import test from 'node:test';
import assert from 'node:assert/strict';
import { Client } from '@modelcontextprotocol/sdk/client/index.js';
import { StdioClientTransport } from '@modelcontextprotocol/sdk/client/stdio.js';
import { fileURLToPath } from 'node:url';
import path from 'node:path';
import { RevenueLedger } from '../revenue-ledger.mjs';
import { AuditTrail } from '../audit-trail.mjs';
import { AgentGovernor } from '../agent-governor.mjs';
import { MemoryRepository } from '../repositories/memory-repository.mjs';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const SERVER = path.join(__dirname, '..', 'mcp-server.mjs');

async function withServer(fn) {
  const transport = new StdioClientTransport({
    command: process.execPath,
    args: [SERVER],
    env: { ...process.env, DATABASE_URL: '', GROWTH_OS_ALLOW_MEMORY: 'true' },
  });
  const client = new Client({ name: 'boundary-test', version: '1.0.0' });
  await client.connect(transport);
  try {
    await fn(client);
  } finally {
    await client.close();
  }
}

async function callTool(client, name, args) {
  const res = await client.callTool({ name, arguments: args });
  return {
    isError: res.isError === true,
    text: res.content?.[0]?.text ?? '',
  };
}

async function propose(client, overrides = {}) {
  const res = await callTool(client, 'growth_os_propose_action', {
    businessId: 'biz_A',
    agentId: 'agent_a',
    type: 'send_email',
    risk: 'LOW',
    objective: 'test',
    expectedOutcome: 'ok',
    payload: { to: 'merchant@example.com', template: 'welcome' },
    evidence: 'unit test',
    ...overrides,
  });
  return res;
}

// ---------------------------------------------------------------------------
// 1. EXECUTION BOUNDARY — MCP level, end-to-end through the real server
// ---------------------------------------------------------------------------

test('BOUNDARY: execute_action with a FORGED proposalId must fail', async () => {
  await withServer(async (client) => {
    const res = await callTool(client, 'growth_os_execute_action', {
      businessId: 'biz_A',
      agentId: 'agent_a',
      proposalId: 'prop_FORGED_NEVER_PROPOSED',
      actionType: 'send_email',
      payload: { to: 'victim@example.com' },
    });
    assert.equal(res.isError, true, `forged proposal executed: ${res.text}`);
  });
});

test('BOUNDARY: execute_action must reject a proposal that was BLOCKED by the Governor', async () => {
  await withServer(async (client) => {
    const p = await propose(client, { type: 'refund_all', risk: 'CRITICAL', payload: { amount: 999999 } });
    assert.match(p.text, /blocked/, `precondition failed: ${p.text}`);

    const decision = JSON.parse(p.text);
    assert.ok(decision.proposalId, 'proposal id present in response');

    const res = await callTool(client, 'growth_os_execute_action', {
      businessId: 'biz_A',
      agentId: 'agent_a',
      proposalId: decision.proposalId,
      actionType: 'refund_all',
      payload: { amount: 999999 },
    });
    assert.equal(res.isError, true, `a BLOCKED proposal executed: ${res.text}`);
  });
});

test('BOUNDARY: execute_action must bind approval to businessId (cross-business must fail)', async () => {
  await withServer(async (client) => {
    const p = await propose(client);
    const proposalId = JSON.parse(p.text).proposalId;

    const res = await callTool(client, 'growth_os_execute_action', {
      businessId: 'biz_ATTACKER',
      agentId: 'agent_a',
      proposalId,
      actionType: 'send_email',
      payload: { to: 'merchant@example.com', template: 'welcome' },
    });
    assert.equal(res.isError, true, `cross-business execution succeeded: ${res.text}`);
  });
});

test('BOUNDARY: execute_action must bind approval to agentId (cross-agent must fail)', async () => {
  await withServer(async (client) => {
    const p = await propose(client);
    const proposalId = JSON.parse(p.text).proposalId;

    const res = await callTool(client, 'growth_os_execute_action', {
      businessId: 'biz_A',
      agentId: 'agent_attacker',
      proposalId,
      actionType: 'send_email',
      payload: { to: 'merchant@example.com', template: 'welcome' },
    });
    assert.equal(res.isError, true, `cross-agent execution succeeded: ${res.text}`);
  });
});

test('BOUNDARY: execute_action must bind approval to actionType (type swap must fail)', async () => {
  await withServer(async (client) => {
    const p = await propose(client, { type: 'send_email' });
    const proposalId = JSON.parse(p.text).proposalId;

    const res = await callTool(client, 'growth_os_execute_action', {
      businessId: 'biz_A',
      agentId: 'agent_a',
      proposalId,
      actionType: 'delete_data',
      payload: { to: 'merchant@example.com', template: 'welcome' },
    });
    assert.equal(res.isError, true, `action-type swap executed: ${res.text}`);
  });
});

test('BOUNDARY: execute_action must bind approval to payload (modified payload must fail)', async () => {
  await withServer(async (client) => {
    const p = await propose(client);
    const proposalId = JSON.parse(p.text).proposalId;

    const res = await callTool(client, 'growth_os_execute_action', {
      businessId: 'biz_A',
      agentId: 'agent_a',
      proposalId,
      actionType: 'send_email',
      payload: { to: 'attacker-controlled@example.com', template: 'welcome' },
    });
    assert.equal(res.isError, true, `modified payload executed: ${res.text}`);
  });
});

test('BOUNDARY: execute_action replay — same proposalId must not execute twice', async () => {
  await withServer(async (client) => {
    const p = await propose(client);
    const proposalId = JSON.parse(p.text).proposalId;
    const args = {
      businessId: 'biz_A',
      agentId: 'agent_a',
      proposalId,
      actionType: 'send_email',
      payload: { to: 'merchant@example.com', template: 'welcome' },
    };
    const first = await callTool(client, 'growth_os_execute_action', args);
    const second = await callTool(client, 'growth_os_execute_action', args);
    assert.equal(first.isError, false, `first execution failed: ${first.text}`);
    assert.equal(second.isError, true, `replayed action executed twice: ${second.text}`);
  });
});

test('BOUNDARY: concurrent workers cannot double-execute (CAS)', async () => {
  await withServer(async (client) => {
    const p = await propose(client);
    const proposalId = JSON.parse(p.text).proposalId;
    const args = {
      businessId: 'biz_A',
      agentId: 'agent_a',
      proposalId,
      actionType: 'send_email',
      payload: { to: 'merchant@example.com', template: 'welcome' },
    };
    const [r1, r2] = await Promise.all([
      callTool(client, 'growth_os_execute_action', args),
      callTool(client, 'growth_os_execute_action', args),
    ]);
    const okCount = [r1, r2].filter((r) => !r.isError).length;
    assert.equal(okCount, 1, `exactly one concurrent execution must win, got ${okCount}`);
  });
});

test('BOUNDARY: unknown agent is rejected when auth tokens are configured', async () => {
  // Spawn a dedicated server with an auth token map.
  const transport = new StdioClientTransport({
    command: process.execPath,
    args: [SERVER],
    env: {
      ...process.env,
      DATABASE_URL: '',
      GROWTH_OS_ALLOW_MEMORY: 'true',
      GROWTH_OS_AUTH_TOKENS: JSON.stringify({ agent_known: 'tok_known' }),
    },
  });
  const client = new Client({ name: 'boundary-test', version: '1.0.0' });
  await client.connect(transport);
  try {
    const res = await callTool(client, 'growth_os_propose_action', {
      businessId: 'biz_A',
      agentId: 'agent_unknown',
      type: 'send_email',
      risk: 'LOW',
      objective: 'x',
      expectedOutcome: 'y',
      payload: {},
      evidence: 'none',
    });
    assert.equal(res.isError, true, `unknown agent proposed an action: ${res.text}`);
    assert.match(res.text, /not authorized/);
  } finally {
    await client.close();
  }
});

test('BOUNDARY: record_event financial without an executed action must fail', async () => {
  await withServer(async (client) => {
    const res = await callTool(client, 'growth_os_record_event', {
      businessId: 'biz_A',
      agentId: 'agent_a',
      type: 'revenue',
      amount: 1000,
      currency: 'USD',
      source: 'stripe',
    });
    assert.equal(res.isError, true, `ungoverned revenue recorded: ${res.text}`);
  });
});

// ---------------------------------------------------------------------------
// 2. REVENUE LEDGER — economic integrity
// ---------------------------------------------------------------------------

test('LEDGER: duplicate payment (same deterministic id) must not double-count', async () => {
  const repo = new MemoryRepository();
  const ledger = new RevenueLedger(repo);
  // Callers must supply a deterministic id (webhook/transaction id) for dedupe.
  const evt = { id: 'wh_1', businessId: 'biz_1', type: 'revenue', amount: 500, currency: 'USD', source: 'stripe', metadata: { webhookId: 'wh_1' } };
  await ledger.record(evt);
  await assert.rejects(ledger.record(evt), /already exists/i, 'replayed payment must be rejected');
  const metrics = await ledger.calculateMetrics({ businessId: 'biz_1' });
  assert.equal(metrics.grossRevenue, 500, 'duplicate payment must not double-count');
});

test('LEDGER: duplicate webhook replay (same id) must be rejected, not silently overwrite', async () => {
  const repo = new MemoryRepository();
  const ledger = new RevenueLedger(repo);
  const evt = { id: 'evt_fixed', businessId: 'biz_1', type: 'revenue', amount: 100, currency: 'USD', source: 'stripe' };
  await ledger.record(evt);
  const replay = { ...evt, amount: 999999 };
  await assert.rejects(ledger.record(replay), /duplicate|already exists/i, 'replayed event id must be rejected');
});

test('LEDGER: refund without an original payment must fail', async () => {
  const repo = new MemoryRepository();
  const ledger = new RevenueLedger(repo);
  await assert.rejects(
    ledger.record({ businessId: 'biz_1', type: 'refund', amount: 100, currency: 'USD', source: 'stripe' }),
    /originalEventId/i,
    'refund with no original payment must not be recorded'
  );
});

test('LEDGER: refund of a non-payment event must fail', async () => {
  const repo = new MemoryRepository();
  const ledger = new RevenueLedger(repo);
  await ledger.record({ id: 'evt_cost', businessId: 'biz_1', type: 'campaign_cost', amount: 50, currency: 'USD', source: 'ads' });
  await assert.rejects(
    ledger.record({ businessId: 'biz_1', type: 'refund', amount: 50, currency: 'USD', source: 'stripe', metadata: { originalEventId: 'evt_cost' } }),
    /not a payment/i
  );
});

test('LEDGER: partial refunds accumulate; the total can never exceed the original; a replayed refund id is rejected', async () => {
  const repo = new MemoryRepository();
  const ledger = new RevenueLedger(repo);
  await ledger.record({ id: 'evt_orig', businessId: 'biz_1', type: 'revenue', amount: 100, currency: 'USD', source: 'stripe' });

  const partialA = { businessId: 'biz_1', type: 'refund', amount: 50, currency: 'USD', source: 'stripe', idempotencyKey: 'ref:r_a', metadata: { originalEventId: 'evt_orig' } };
  const partialB = { businessId: 'biz_1', type: 'refund', amount: 50, currency: 'USD', source: 'stripe', idempotencyKey: 'ref:r_b', metadata: { originalEventId: 'evt_orig' } };
  await ledger.record(partialA);
  await ledger.record(partialB); // legitimate second partial refund of the same original
  const refunds = (await ledger.getEvents({ businessId: 'biz_1', type: 'refund' }));
  assert.equal(refunds.length, 2);

  // Over-refund: nothing left to refund.
  await assert.rejects(
    ledger.record({ businessId: 'biz_1', type: 'refund', amount: 1, currency: 'USD', source: 'stripe', metadata: { originalEventId: 'evt_orig' } }),
    /exceeds the remaining refundable amount/i
  );

  // Replay of the SAME refund (same idempotency key) is rejected, never
  // re-recorded — either by the over-refund guard (already fully refunded) or
  // by the idempotency duplicate check when room remains.
  await assert.rejects(ledger.record(partialA), /exceeds the remaining refundable amount|duplicate event/i);
});

test('LEDGER: negative revenue must be rejected', async () => {
  const repo = new MemoryRepository();
  const ledger = new RevenueLedger(repo);
  await assert.rejects(
    ledger.record({ businessId: 'biz_1', type: 'revenue', amount: -500, currency: 'USD', source: 'stripe' }),
    /positive/i,
    'negative revenue must not be accepted'
  );
});

test('LEDGER: currency mismatch in aggregation must not silently mix', async () => {
  const repo = new MemoryRepository();
  const ledger = new RevenueLedger(repo);
  await ledger.record({ businessId: 'biz_1', type: 'revenue', amount: 100, currency: 'USD', source: 'stripe' });
  await ledger.record({ businessId: 'biz_1', type: 'revenue', amount: 100, currency: 'EUR', source: 'stripe' });
  const metrics = await ledger.calculateMetrics({ businessId: 'biz_1' });
  assert.equal(metrics.grossRevenue, 100, 'mixed-currency aggregation must not silently sum');
  assert.equal(metrics.mixedCurrencies, true, 'mixed currencies must be flagged');
  assert.deepEqual(metrics.byCurrency.USD, metrics.byCurrency.USD);
  assert.equal(metrics.byCurrency.USD.grossRevenue, 100);
  assert.equal(metrics.byCurrency.EUR.grossRevenue, 100);
});

// ---------------------------------------------------------------------------
// 3. AUDIT TRAIL — immutability / chain
// ---------------------------------------------------------------------------

test('AUDIT: application API exposes no retroactive mutation (log/getLogs/verifyChain only)', () => {
  const proto = Object.getOwnPropertyNames(AuditTrail.prototype);
  for (const banned of ['update', 'delete', 'clear']) {
    assert.equal(proto.includes(banned), false, `AuditTrail must not expose ${banned}`);
  }
});

test('AUDIT: entries must be hash-chained (each entry binds to the previous)', async () => {
  const repo = new MemoryRepository();
  const audit = new AuditTrail(repo);
  await audit.log({ businessId: 'biz_1', agentId: 'agent_a', proposalId: 'prop_1', actionType: 'a', payload: {}, status: 'EXECUTED' });
  await audit.log({ businessId: 'biz_1', agentId: 'agent_a', proposalId: 'prop_2', actionType: 'b', payload: {}, status: 'EXECUTED' });
  const logs = await audit.getLogs({ businessId: 'biz_1' });
  assert.equal(logs.length, 2);
  const [first, second] = logs;
  assert.ok(first.prevHash === null || first.prevHash === undefined, 'genesis entry has no prevHash');
  assert.ok(second.prevHash, 'second entry must carry prevHash binding to the first');
  assert.equal(second.prevHash, first.hash, 'chain link must match the previous entry hash');

  const chain = await audit.verifyChain();
  assert.equal(chain.valid, true, 'chain must verify when untouched');
});

test('AUDIT: retroactive tampering is detectable via chain verification', async () => {
  const repo = new MemoryRepository();
  const audit = new AuditTrail(repo);
  await audit.log({ businessId: 'biz_1', agentId: 'agent_a', proposalId: 'prop_1', actionType: 'charge', payload: { amount: 50 }, status: 'EXECUTED' });
  await audit.log({ businessId: 'biz_1', agentId: 'agent_a', proposalId: 'prop_2', actionType: 'charge', payload: { amount: 60 }, status: 'EXECUTED' });

  // Directly tamper with the stored entry (raw repository level).
  const logs = await audit.getLogs({ businessId: 'biz_1' });
  const first = logs[0];
  await repo.update(first.id, { ...first, payload: { amount: 999999 }, status: 'NOT_EXECUTED' });

  const chain = await audit.verifyChain();
  assert.equal(chain.valid, false, 'tampered chain must be flagged');
  assert.ok(chain.brokenLinks.length > 0);
});

// ---------------------------------------------------------------------------
// 4. GOVERNOR — approval lifecycle
// ---------------------------------------------------------------------------

test('GOVERNOR: an approval must be a durable, inspectable state — not a transient return value', async () => {
  const approvalRepo = new MemoryRepository();
  const governor = new AgentGovernor([], approvalRepo);
  const proposal = {
    id: 'prop_1',
    businessId: 'biz_1',
    agentId: 'agent_a',
    type: 'send_email',
    risk: 'LOW',
    objective: 'x',
    expectedOutcome: 'y',
    payload: { to: 'a@b.co' },
    evidence: 'none',
    createdAt: new Date().toISOString(),
  };

  await governor.propose(proposal);
  const status = await governor.getApprovalStatus('prop_1');
  assert.ok(status, 'approval must be durable state');
  assert.equal(status.status, 'APPROVED');
  assert.ok(status.expiresAt, 'approval must carry an expiry');
});

test('GOVERNOR: markExecuted consumes an approval; replay is rejected', async () => {
  const approvalRepo = new MemoryRepository();
  const governor = new AgentGovernor([], approvalRepo);
  await governor.propose({ id: 'prop_1', businessId: 'biz_1', agentId: 'agent_a', type: 't', risk: 'LOW', objective: 'x', expectedOutcome: 'y', payload: {}, evidence: 'none', createdAt: new Date().toISOString() });

  await governor.markExecuted('prop_1');
  await assert.rejects(governor.markExecuted('prop_1'), /not APPROVED|replay/i, 'second consumption must fail');
});

test('GOVERNOR: expired approvals must not execute', async () => {
  const approvalRepo = new MemoryRepository();
  const governor = new AgentGovernor([], approvalRepo);
  governor.approvalTtlMs = -1000; // force immediate expiry
  await governor.propose({ id: 'prop_1', businessId: 'biz_1', agentId: 'agent_a', type: 't', risk: 'LOW', objective: 'x', expectedOutcome: 'y', payload: {}, evidence: 'none', createdAt: new Date().toISOString() });
  await assert.rejects(governor.markExecuted('prop_1'), /expired/i);
});
