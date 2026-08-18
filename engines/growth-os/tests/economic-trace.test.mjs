import test from 'node:test';
import assert from 'node:assert/strict';
import { buildEconomicTrace } from '../economic/economic-trace.mjs';
import { MemoryEconomicStore } from '../economic/economic-store.mjs';
import { MemoryRepository, BusinessTwinMemoryRepository } from '../repositories/memory-repository.mjs';
import { BusinessTwin } from '../business-twin.mjs';
import { RevenueLedger } from '../revenue-ledger.mjs';
import { AuditTrail } from '../audit-trail.mjs';
import { ExperimentEngine } from '../experiment-engine.mjs';

function makeEngine() {
  const twinRepo = new BusinessTwinMemoryRepository();
  const twin = new BusinessTwin(twinRepo);
  const ledger = new RevenueLedger(new MemoryRepository());
  const audit = new AuditTrail(new MemoryRepository());
  const experiments = new ExperimentEngine(new MemoryRepository());
  const store = new MemoryEconomicStore();
  return { twin, ledger, audit, experiments, store };
}

test('TRACE: full economic chain is reconstructed', async () => {
  const { twin, ledger, audit, experiments, store } = makeEngine();
  const businessId = 'biz_1';

  await twin.initialize(businessId, { name: 'Test Biz' });
  await audit.log({ businessId, agentId: 'agent_a', proposalId: 'prop_1', actionType: 'send_email', payload: {}, status: 'EXECUTED' });
  const exp = await experiments.createExperiment({
    businessId, hypothesis: 'Email lift', objective: 'lift', metric: 'revenue', baseline: 5, variants: ['control', 'treatment'],
  });
  await store.upsertCustomer({ businessId, provider: 'stripe', providerCustomerId: 'cus_1', displayName: 'A' });
  await store.assignVariant(exp.id, 'cust_1', 'treatment');
  await ledger.record({ businessId, type: 'revenue', amount: 50, currency: 'USD', source: 'stripe', metadata: { stripeCustomerId: 'cus_1' } });
  await store.recordAttribution({
    id: 'attr_1', businessId, revenueEventId: 'rev_1', experimentId: exp.id, customerId: 'cust_1',
    level: 'observation', claim: 'unknown attribution', confidence: null, evidence: [], createdAt: new Date().toISOString(),
  });

  const trace = await buildEconomicTrace({ businessTwin: twin, ledger, auditTrail: audit, experimentEngine: experiments, economicStore: store, businessId });

  assert.ok(trace.twin, 'twin present');
  assert.equal(trace.actions.length, 1, 'audited action present');
  assert.equal(trace.experiments.length, 1, 'experiment present');
  assert.equal(trace.customers.length, 1, 'customer present');
  assert.equal(trace.revenue.length, 1, 'revenue present');
  assert.equal(trace.attribution.length, 1, 'attribution present');
  assert.equal(trace.learnings.unknownCount, 1);
});

test('TRACE: empty business reports missing hops, never invents data', async () => {
  const { twin, ledger, audit, experiments, store } = makeEngine();
  const trace = await buildEconomicTrace({ businessTwin: twin, ledger, auditTrail: audit, experimentEngine: experiments, economicStore: store, businessId: 'ghost' });

  assert.equal(trace.actions.length, 0);
  assert.equal(trace.revenue.length, 0);
  assert.ok(trace.missing.includes('business_twin'));
  assert.equal(trace.learnings.summary, 'no attribution evidence yet');
});
