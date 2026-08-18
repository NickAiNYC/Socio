import test from 'node:test';
import assert from 'node:assert/strict';
import { createMerchantApi } from '../merchant/merchant-api.mjs';
import { MemoryEconomicStore } from '../economic/economic-store.mjs';
import { MemoryRepository, BusinessTwinMemoryRepository } from '../repositories/memory-repository.mjs';
import { BusinessTwin } from '../business-twin.mjs';
import { RevenueLedger } from '../revenue-ledger.mjs';
import { AuditTrail } from '../audit-trail.mjs';
import { ExperimentEngine } from '../experiment-engine.mjs';
import { AgentGovernor } from '../agent-governor.mjs';

function makeEngine() {
  const twin = new BusinessTwin(new BusinessTwinMemoryRepository());
  const ledger = new RevenueLedger(new MemoryRepository());
  const audit = new AuditTrail(new MemoryRepository());
  const experiments = new ExperimentEngine(new MemoryRepository());
  const store = new MemoryEconomicStore();
  const governor = new AgentGovernor([], new MemoryRepository());
  return { twin, ledger, audit, experiments, store, governor, auditRepo: audit.repo };
}

async function startServer(t, overrides = {}) {
  const engine = makeEngine();
  const server = createMerchantApi({
    businessTwin: engine.twin,
    revenueLedger: engine.ledger,
    auditTrail: engine.audit,
    experimentEngine: engine.experiments,
    economicStore: engine.store,
    agentGovernor: engine.governor,
    tokens: { biz_a: 'token-a', biz_b: 'token-b' },
    stripeSecretConfigured: false,
    ...overrides,
  });
  await new Promise((resolve) => server.listen(0, '127.0.0.1', () => resolve(undefined)));
  const addr = server.address();
  if (!addr || typeof addr === 'string') {
    throw new Error('failed to bind test server');
  }
  t.after(() => server.close());
  const { port } = addr;
  return { ...engine, server, base: `http://127.0.0.1:${port}` };
}

function authed(base, businessId, token) {
  return fetch(`${base}/api/merchant/${businessId}/evidence`, {
    headers: { Authorization: `Bearer ${token}` },
  });
}

test('API: health endpoint reports real service state', async (t) => {
  const { base } = await startServer(t);
  const res = await fetch(`${base}/api/health`);
  assert.equal(res.status, 200);
  const body = await res.json();
  assert.equal(body.status, 'ok');
  assert.equal(body.service, 'merchant-evidence-api');
});

test('API: missing token is rejected when tokens are configured (401)', async (t) => {
  const { base } = await startServer(t);
  const res = await fetch(`${base}/api/merchant/biz_a/evidence`);
  assert.equal(res.status, 401);
  const body = await res.json();
  assert.equal(body.error.code, 'unauthorized');
});

test('API: business isolation is server-side — a token for biz_a cannot read biz_b (403)', async (t) => {
  const { base } = await startServer(t);
  const res = await authed(base, 'biz_b', 'token-a');
  assert.equal(res.status, 403);
  const body = await res.json();
  assert.equal(body.error.code, 'forbidden');
});

test('API: token scoped to its business can read only its own evidence', async (t) => {
  const { base, ledger } = await startServer(t);
  await ledger.record({ businessId: 'biz_a', type: 'revenue', amount: 77, currency: 'USD', source: 'stripe' });
  await ledger.record({ businessId: 'biz_b', type: 'revenue', amount: 999, currency: 'USD', source: 'stripe' });

  const res = await authed(base, 'biz_a', 'token-a');
  assert.equal(res.status, 200);
  const body = await res.json();
  assert.equal(body.questions.whatHappened.metrics.grossRevenue, 77);
  assert.equal(body.trace.counts.revenueEvents, 1);
});

test('API: unknown merchant routes return 404', async (t) => {
  const { base } = await startServer(t);
  const res = await fetch(`${base}/api/merchant/biz_a/nope`, {
    headers: { Authorization: 'Bearer token-a' },
  });
  assert.equal(res.status, 404);
});

test('API: approval lifecycle from the real Governor is visible (approval + rejection)', async (t) => {
  const { base, governor, audit } = await startServer(t);

  // LOW risk auto-approves; execute it and log the audited action.
  await governor.propose({ id: 'prop_low', businessId: 'biz_a', agentId: 'agent_a', type: 'send_email', risk: 'LOW', objective: 'x', expectedOutcome: 'y', payload: {} });
  await governor.markExecuted('prop_low');
  await audit.log({ businessId: 'biz_a', agentId: 'agent_a', proposalId: 'prop_low', actionType: 'send_email', payload: {}, status: 'EXECUTED' });

  // CRITICAL is blocked by policy; HIGH is pending approval.
  await governor.propose({ id: 'prop_crit', businessId: 'biz_a', agentId: 'agent_a', type: 'delete_data', risk: 'CRITICAL', objective: 'x', expectedOutcome: 'y', payload: {} });
  await governor.propose({ id: 'prop_high', businessId: 'biz_a', agentId: 'agent_b', type: 'spend', risk: 'HIGH', objective: 'x', expectedOutcome: 'y', payload: {} });

  const approvalsRes = await fetch(`${base}/api/merchant/biz_a/approvals`, {
    headers: { Authorization: 'Bearer token-a' },
  });
  assert.equal(approvalsRes.status, 200);
  const approvals = await approvalsRes.json();
  assert.equal(approvals.counts.total, 3);
  assert.equal(approvals.counts.executed, 1);
  assert.equal(approvals.counts.blocked, 1);
  assert.equal(approvals.counts.pending, 1);

  const evidenceRes = await authed(base, 'biz_a', 'token-a');
  const evidence = await evidenceRes.json();
  assert.equal(evidence.questions.whatDidSocioDo.count, 1);
  assert.equal(evidence.questions.whatDidSocioDo.actions[0].proposalId, 'prop_low');
  assert.equal(evidence.questions.whatShouldSocioDoNext.pendingApprovals.length, 1);
});

test('API: audit chain is displayed and tampering is detected by real verification', async (t) => {
  const { base, auditRepo } = await startServer(t);

  // Build a valid hash-chain through the real AuditTrail (the only hashing authority).
  const audit = new AuditTrail(auditRepo);
  await audit.log({ businessId: 'biz_a', agentId: 'agent_a', proposalId: 'prop_1', actionType: 'send_email', payload: {}, status: 'EXECUTED' });
  await audit.log({ businessId: 'biz_a', agentId: 'agent_a', proposalId: 'prop_2', actionType: 'send_email', payload: { to: 'x@y.z' }, status: 'EXECUTED' });

  const res = await fetch(`${base}/api/merchant/biz_a/audit`, {
    headers: { Authorization: 'Bearer token-a' },
  });
  assert.equal(res.status, 200);
  const body = await res.json();
  assert.ok(Array.isArray(body.entries));
  assert.equal(body.entries.length, 2);
  assert.equal(body.verify.valid, true);

  // Tamper: mutate a stored payload directly — verification must fail.
  const firstEntryId = body.entries[0].id;
  const target = auditRepo.store.get(firstEntryId);
  target.payload = { to: 'attacker@example.com' };

  const verifyRes = await fetch(`${base}/api/merchant/biz_a/audit/verify`, {
    method: 'POST',
    headers: { Authorization: 'Bearer token-a' },
  });
  const verify = await verifyRes.json();
  assert.equal(verify.verify.valid, false);
  assert.ok(verify.verify.brokenLinks.some((b) => b.reason === 'hash_mismatch'));
});

test('API: stripe disconnected state is real and honest', async (t) => {
  const { base } = await startServer(t);
  const res = await fetch(`${base}/api/merchant/biz_a/system`, {
    headers: { Authorization: 'Bearer token-a' },
  });
  assert.equal(res.status, 200);
  const body = await res.json();
  assert.equal(body.stripe.status, 'disconnected');
  assert.equal(body.system.health, 'ok');
  assert.equal(body.system.persistence, 'memory');
});

test('API: stripe shows configured (not connected) when secret set but no events', async (t) => {
  const { base } = await startServer(t, { stripeSecretConfigured: true });
  const res = await fetch(`${base}/api/merchant/biz_a/system`, {
    headers: { Authorization: 'Bearer token-a' },
  });
  const body = await res.json();
  assert.equal(body.stripe.status, 'configured');
});

test('API: empty state is honest — zeros and missing hops, never fabricated data', async (t) => {
  const { base } = await startServer(t);
  const res = await authed(base, 'biz_a', 'token-a');
  assert.equal(res.status, 200);
  const body = await res.json();
  assert.equal(body.questions.whatHappened.metrics.grossRevenue, 0);
  assert.equal(body.questions.whatHappened.metrics.netRevenue, 0);
  assert.equal(body.questions.whatRevenueFollowed.count, 0);
  assert.equal(body.questions.whatCanWeAttribute.count, 0);
  assert.equal(body.questions.whatCantWeProve.count, 0);
  assert.ok(body.trace.missing.includes('business_twin'));
  assert.equal(body.questions.whatShouldSocioDoNext.learnings.summary, 'no attribution evidence yet');
  assert.equal(body.stripe.status, 'disconnected');
});

test('API: attribution endpoint separates provable from not-provable', async (t) => {
  const { base, store, ledger } = await startServer(t);
  const rev = await ledger.record({ id: 'rev_1', businessId: 'biz_a', type: 'revenue', amount: 40, currency: 'USD', source: 'stripe', metadata: { stripeCustomerId: 'cus_x' } });
  await store.recordAttribution({
    id: 'attr_1', businessId: 'biz_a', revenueEventId: rev.id, experimentId: null, customerId: null,
    level: 'observation', claim: 'unknown attribution — revenue recorded, but no experiment/customer link exists',
    confidence: null, evidence: [], createdAt: new Date().toISOString(),
  });

  const res = await fetch(`${base}/api/merchant/biz_a/attribution`, {
    headers: { Authorization: 'Bearer token-a' },
  });
  assert.equal(res.status, 200);
  const body = await res.json();
  assert.equal(body.attributable.count, 0);
  assert.equal(body.notProvable.count, 1);
  assert.match(body.notProvable.records[0].claim, /unknown attribution/);
  assert.ok(body.methodology.levels.includes('attribution'));
  assert.equal(body.methodology.causationClaimed, false);
});
