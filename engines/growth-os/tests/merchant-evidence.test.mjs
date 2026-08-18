import test from 'node:test';
import assert from 'node:assert/strict';
import { buildMerchantEvidenceReport, computeStripeState } from '../merchant/evidence-report.mjs';
import { MemoryEconomicStore } from '../economic/economic-store.mjs';
import { MemoryRepository, BusinessTwinMemoryRepository } from '../repositories/memory-repository.mjs';
import { BusinessTwin } from '../business-twin.mjs';
import { RevenueLedger } from '../revenue-ledger.mjs';
import { AuditTrail } from '../audit-trail.mjs';
import { ExperimentEngine } from '../experiment-engine.mjs';
import { AgentGovernor } from '../agent-governor.mjs';
import { attributeRevenue } from '../economic/attribution.mjs';
import { MIN_SAMPLE_PER_GROUP } from '../economic/stats.mjs';

function makeEngine() {
  const twinRepo = new BusinessTwinMemoryRepository();
  const twin = new BusinessTwin(twinRepo);
  const ledger = new RevenueLedger(new MemoryRepository());
  const audit = new AuditTrail(new MemoryRepository());
  const experiments = new ExperimentEngine(new MemoryRepository());
  const store = new MemoryEconomicStore();
  const governor = new AgentGovernor([], new MemoryRepository());
  return { twin, ledger, audit, experiments, store, governor };
}

async function makeReport(engine, businessId, opts = {}) {
  return buildMerchantEvidenceReport({
    businessTwin: engine.twin,
    revenueLedger: engine.ledger,
    auditTrail: engine.audit,
    experimentEngine: engine.experiments,
    economicStore: engine.store,
    agentGovernor: engine.governor,
    businessId,
    stripeSecretConfigured: Boolean(opts.stripeSecretConfigured),
  });
}

test('REPORT: empty business produces honest zeros, missing hops, disconnected stripe', async () => {
  const engine = makeEngine();
  const report = await makeReport(engine, 'ghost_biz');

  assert.equal(report.questions.whatDidSocioDo.count, 0);
  assert.equal(report.questions.whatHappened.metrics.grossRevenue, 0);
  assert.equal(report.questions.whatHappened.metrics.netRevenue, 0);
  assert.equal(report.questions.whatRevenueFollowed.count, 0);
  assert.equal(report.questions.whatCanWeAttribute.count, 0);
  assert.equal(report.questions.whatCantWeProve.count, 0);
  assert.equal(report.questions.whatCantWeProve.unattributedRevenue.amount, 0);
  assert.ok(report.trace.missing.includes('business_twin'), 'missing twin hop is reported');
  assert.equal(report.trace.learnings.summary, 'no attribution evidence yet');
  assert.equal(report.stripe.status, 'disconnected');
  assert.equal(report.system.health, 'ok');
  assert.equal(report.methodology.causationClaimed, false);
});

test('REPORT: metric calculations are real ledger math', async () => {
  const engine = makeEngine();
  await engine.ledger.record({ id: 'evt_1', businessId: 'biz_1', type: 'revenue', amount: 100, currency: 'USD', source: 'stripe' });
  await engine.ledger.record({ businessId: 'biz_1', type: 'revenue', amount: 50, currency: 'USD', source: 'stripe' });
  await engine.ledger.record({ businessId: 'biz_1', type: 'campaign_cost', amount: 25, currency: 'USD', source: 'manual' });
  await engine.ledger.record({
    businessId: 'biz_1', type: 'refund', amount: 10, currency: 'USD', source: 'stripe',
    metadata: { originalEventId: 'evt_1' },
  });

  const report = await makeReport(engine, 'biz_1');
  const m = report.questions.whatHappened.metrics;

  assert.equal(m.grossRevenue, 150);
  assert.equal(m.netRevenue, 140);
  assert.equal(m.totalCost, 25);
  assert.equal(m.refunds, 10);
  assert.equal(m.eventCount, 4);
  assert.ok(Math.abs(m.roi - 460) < 0.0001, `expected roi ~460, got ${m.roi}`); // ((140 - 25) / 25) * 100
  assert.equal(m.mixedCurrencies, false);
  assert.equal(report.questions.whatRevenueFollowed.count, 3); // 2 revenue + 1 refund
  assert.equal(report.trace.counts.revenueEvents, 4);
});

test('REPORT: full economic chain is reconstructed in the report', async () => {
  const engine = makeEngine();
  const businessId = 'biz_1';

  await engine.twin.initialize(businessId, { name: 'Test Biz' });
  await engine.audit.log({ businessId, agentId: 'agent_a', proposalId: 'prop_1', actionType: 'send_email', payload: {}, status: 'EXECUTED' });
  const exp = await engine.experiments.createExperiment({
    businessId, hypothesis: 'Email lift', objective: 'lift', metric: 'revenue', baseline: 5, variants: ['control', 'treatment'],
  });
  await engine.store.upsertCustomer({ businessId, provider: 'stripe', providerCustomerId: 'cus_1', displayName: 'A' });
  await engine.store.assignVariant(exp.id, 'cust_1', 'treatment');
  await engine.ledger.record({ businessId, type: 'revenue', amount: 50, currency: 'USD', source: 'stripe', metadata: { stripeCustomerId: 'cus_1' } });
  await engine.store.recordAttribution({
    id: 'attr_1', businessId, revenueEventId: 'rev_1', experimentId: exp.id, customerId: 'cust_1',
    level: 'observation', claim: 'unknown attribution', confidence: null, evidence: [], createdAt: new Date().toISOString(),
  });

  const report = await makeReport(engine, businessId);

  assert.equal(report.trace.counts.actions, 1);
  assert.equal(report.trace.counts.experiments, 1);
  assert.equal(report.trace.counts.customers, 1);
  assert.equal(report.trace.counts.revenueEvents, 1);
  assert.equal(report.trace.counts.attributionRecords, 1);
  assert.equal(report.questions.whatDidSocioDo.actions[0].actionType, 'send_email');
  assert.equal(report.questions.whatShouldSocioDoNext.experiments[0].status, 'DRAFT');
  assert.equal(report.questions.whatShouldSocioDoNext.learnings.unknownCount, 1);
  assert.deepEqual(report.trace.missing, []);
});

test('REPORT: unknown attribution is clearly distinguished and never imputed', async () => {
  const engine = makeEngine();
  const businessId = 'biz_1';

  const rev = await engine.ledger.record({
    id: 'rev_1', businessId, type: 'revenue', amount: 40, currency: 'USD', source: 'stripe',
    metadata: { stripeCustomerId: 'cus_unknown' },
  });
  await attributeRevenue({ store: engine.store, revenueEvent: rev, experimentId: null, customerId: null });

  const report = await makeReport(engine, businessId);

  assert.equal(report.questions.whatCanWeAttribute.count, 0);
  assert.equal(report.questions.whatCantWeProve.count, 1);
  assert.match(report.questions.whatCantWeProve.records[0].claim, /unknown attribution/);
  assert.equal(report.questions.whatCantWeProve.unattributedRevenue.amount, 0); // has a record — just not provable
});

test('REPORT: unattributed revenue is reported when no attribution record exists', async () => {
  const engine = makeEngine();
  await engine.ledger.record({ id: 'rev_1', businessId: 'biz_1', type: 'revenue', amount: 100, currency: 'USD', source: 'stripe' });
  await engine.ledger.record({ id: 'rev_2', businessId: 'biz_1', type: 'revenue', amount: 25, currency: 'USD', source: 'stripe' });
  await engine.store.recordAttribution({
    id: 'attr_1', businessId: 'biz_1', revenueEventId: 'rev_1', experimentId: null, customerId: null,
    level: 'observation', claim: 'unknown attribution', confidence: null, evidence: [], createdAt: new Date().toISOString(),
  });

  const report = await makeReport(engine, 'biz_1');
  assert.equal(report.questions.whatCantWeProve.unattributedRevenue.amount, 25); // rev_2 has no record
  assert.match(report.questions.whatCantWeProve.unattributedRevenue.note, /no attribution record/);
});

test('REPORT: experimental attribution (RCT, adequate sample) lands in whatCanWeAttribute', async () => {
  const engine = makeEngine();
  const businessId = 'biz_1';

  await engine.store.upsertCustomer({ businessId, provider: 'stripe', providerCustomerId: 'cus_1', displayName: 'A' });
  await engine.store.assignVariant('exp_1', 'cust_1', 'treatment');
  const rev = await engine.ledger.record({
    id: 'rev_1', businessId, type: 'revenue', amount: 60, currency: 'USD', source: 'stripe',
    metadata: { stripeCustomerId: 'cus_1' },
  });
  const treatment = Array.from({ length: MIN_SAMPLE_PER_GROUP + 20 }, () => 0.12);
  const control = Array.from({ length: MIN_SAMPLE_PER_GROUP + 20 }, () => 0.06);

  await attributeRevenue({
    store: engine.store, revenueEvent: rev, experimentId: 'exp_1', customerId: 'cust_1',
    treatmentOutcomes: treatment, controlOutcomes: control, isRct: true,
  });

  const report = await makeReport(engine, businessId);
  assert.equal(report.questions.whatCanWeAttribute.count, 1);
  assert.equal(report.questions.whatCanWeAttribute.records[0].level, 'attribution');
  assert.match(report.questions.whatCanWeAttribute.records[0].claim, /significant positive lift/);
  assert.ok(report.questions.whatCanWeAttribute.records[0].confidence > 0.95);
  assert.equal(report.questions.whatCantWeProve.count, 0);
});

test('REPORT: correlational evidence is shown but never claimed as attribution', async () => {
  const engine = makeEngine();
  const businessId = 'biz_1';

  await engine.store.upsertCustomer({ businessId, provider: 'stripe', providerCustomerId: 'cus_1', displayName: 'A' });
  await engine.store.assignVariant('exp_1', 'cust_1', 'treatment');
  const rev = await engine.ledger.record({
    id: 'rev_1', businessId, type: 'revenue', amount: 60, currency: 'USD', source: 'stripe',
    metadata: { stripeCustomerId: 'cus_1' },
  });
  const treatment = Array.from({ length: MIN_SAMPLE_PER_GROUP + 20 }, () => 0.12);
  const control = Array.from({ length: MIN_SAMPLE_PER_GROUP + 20 }, () => 0.06);

  await attributeRevenue({
    store: engine.store, revenueEvent: rev, experimentId: 'exp_1', customerId: 'cust_1',
    treatmentOutcomes: treatment, controlOutcomes: control, isRct: false,
  });

  const report = await makeReport(engine, businessId);
  assert.equal(report.questions.whatCanWeAttribute.count, 1);
  assert.equal(report.questions.whatCanWeAttribute.records[0].level, 'correlation');
  assert.match(report.questions.whatCanWeAttribute.records[0].claim, /not a causal attribution/);
  assert.equal(report.methodology.causationClaimed, false);
});

test('STRIPE: connected only when secret configured AND events recorded', () => {
  assert.equal(computeStripeState({ secretConfigured: false, stripeEventCount: 0 }).status, 'disconnected');
  assert.equal(computeStripeState({ secretConfigured: true, stripeEventCount: 0 }).status, 'configured');
  assert.equal(computeStripeState({ secretConfigured: true, stripeEventCount: 3 }).status, 'connected');
});

test('STRIPE: report reflects real ledger stripe events end-to-end', async () => {
  const engine = makeEngine();
  await engine.ledger.record({ businessId: 'biz_1', type: 'revenue', amount: 99, currency: 'USD', source: 'stripe', metadata: { stripeCustomerId: 'cus_1' } });

  const disconnected = await makeReport(engine, 'biz_1', { stripeSecretConfigured: false });
  assert.equal(disconnected.stripe.status, 'disconnected');

  const connected = await makeReport(engine, 'biz_1', { stripeSecretConfigured: true });
  assert.equal(connected.stripe.status, 'connected');
  assert.equal(connected.stripe.eventsReceived, 1);
});

test('REPORT: approvals from the real governor registry are listed with statuses', async () => {
  const engine = makeEngine();
  const businessId = 'biz_1';
  await engine.governor.propose({ id: 'prop_low', businessId, agentId: 'agent_a', type: 'send_email', risk: 'LOW', objective: 'x', expectedOutcome: 'y', payload: {} });
  await engine.governor.propose({ id: 'prop_crit', businessId, agentId: 'agent_a', type: 'delete_data', risk: 'CRITICAL', objective: 'x', expectedOutcome: 'y', payload: {} });
  await engine.governor.propose({ id: 'prop_high', businessId, agentId: 'agent_b', type: 'spend', risk: 'HIGH', objective: 'x', expectedOutcome: 'y', payload: {} });

  const report = await makeReport(engine, businessId);
  assert.equal(report.approvals.counts.total, 3);
  assert.equal(report.approvals.counts.approved, 1);
  assert.equal(report.approvals.counts.blocked, 1);
  assert.equal(report.approvals.counts.pending, 1);
  assert.equal(report.approvals.counts.executed, 0);
  const ids = report.approvals.records.map((r) => r.id).sort();
  assert.deepEqual(ids, ['prop_crit', 'prop_high', 'prop_low']);
});
