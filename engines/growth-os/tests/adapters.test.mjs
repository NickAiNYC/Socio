import test from 'node:test';
import assert from 'node:assert/strict';
import { GovernedAdapterProxy } from '../adapters/index.mjs';
import { AgentGovernor } from '../agent-governor.mjs';
import { MemoryRepository } from '../repositories/memory-repository.mjs';

function executedApproval(overrides = {}) {
  return {
    status: 'EXECUTED',
    proposal: {
      businessId: 'biz_1',
      agentId: 'agent_a',
      type: 'send_email',
      payload: { to: 'merchant@example.com', template: 'welcome' },
      ...overrides,
    },
  };
}

test('ADAPTERS: call without an executed approval is refused', async () => {
  const proxy = new GovernedAdapterProxy({ send_email: { send: async () => 'sent' } });
  await assert.rejects(
    proxy.call('send_email', 'send', { businessId: 'biz_1', to: 'x@y.co' }, null),
    /executed, approved action/
  );
  await assert.rejects(
    proxy.call('send_email', 'send', { businessId: 'biz_1', to: 'x@y.co' }, { status: 'APPROVED', proposal: executedApproval().proposal }),
    /executed, approved action/
  );
});

test('ADAPTERS: businessId mismatch is refused', async () => {
  const proxy = new GovernedAdapterProxy({ send_email: { send: async () => 'sent' } });
  await assert.rejects(
    proxy.call('send_email', 'send', { businessId: 'biz_ATTACKER' }, executedApproval()),
    /businessId/
  );
});

test('ADAPTERS: payload mismatch is refused (approval binds the exact action)', async () => {
  const proxy = new GovernedAdapterProxy({ send_email: { send: async () => 'sent' } });
  await assert.rejects(
    proxy.call('send_email', 'send', { businessId: 'biz_1', to: 'attacker@example.com' }, executedApproval()),
    /payload/
  );
});

test('ADAPTERS: adapter type must match the approved action type', async () => {
  const proxy = new GovernedAdapterProxy({ delete_data: { run: async () => 'deleted' } });
  await assert.rejects(
    proxy.call('delete_data', 'run', { businessId: 'biz_1' }, executedApproval({ type: 'send_email' })),
    /does not match/
  );
});

test('ADAPTERS: a matching executed approval calls through to the adapter', async () => {
  let called = false;
  const proxy = new GovernedAdapterProxy({
    send_email: {
      send: async (params) => {
        called = true;
        return `sent to ${params.to}`;
      },
    },
  });
  const result = await proxy.call('send_email', 'send', { businessId: 'biz_1', to: 'merchant@example.com', template: 'welcome' }, executedApproval());
  assert.equal(called, true);
  assert.match(result, /sent to merchant@example.com/);
});

test('ADAPTERS: agent-reachable proxy path still requires a real Governor approval (end-to-end shape)', async () => {
  const approvalRepo = new MemoryRepository();
  const governor = new AgentGovernor([], approvalRepo);
  await governor.propose({
    id: 'prop_1',
    businessId: 'biz_1',
    agentId: 'agent_a',
    type: 'send_email',
    risk: 'LOW',
    objective: 'x',
    expectedOutcome: 'y',
    payload: { to: 'merchant@example.com', template: 'welcome' },
    evidence: 'none',
    createdAt: new Date().toISOString(),
  });
  // An unexecuted approval cannot drive an adapter call.
  const approval = await governor.getApprovalStatus('prop_1');
  const proxy = new GovernedAdapterProxy({ send_email: { send: async (p) => `sent ${p.to}` } });
  await assert.rejects(
    proxy.call('send_email', 'send', { businessId: 'biz_1', to: 'merchant@example.com', template: 'welcome' }, approval),
    /executed, approved action/
  );
  // After the Governor consumes it (markExecuted), the adapter call is permitted.
  await governor.markExecuted('prop_1');
  const executed = await governor.getApprovalStatus('prop_1');
  const result = await proxy.call('send_email', 'send', { businessId: 'biz_1', to: 'merchant@example.com', template: 'welcome' }, executed);
  assert.match(result, /sent merchant@example.com/);
});
