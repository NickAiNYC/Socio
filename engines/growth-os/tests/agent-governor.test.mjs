import test from 'node:test';
import assert from 'node:assert/strict';
import { AgentGovernor } from '../agent-governor.mjs';

test('AgentGovernor - default risk policies', async () => {
  const governor = new AgentGovernor();

  const baseProposal = {
    id: 'prop_1',
    businessId: 'biz_1',
    agentId: 'agent_1',
    type: 'send_email',
  };

  const lowRisk = await governor.evaluate({ ...baseProposal, risk: 'LOW' });
  assert.equal(lowRisk.decision, 'approved');

  const mediumRisk = await governor.evaluate({ ...baseProposal, risk: 'MEDIUM' });
  assert.equal(mediumRisk.decision, 'approval_required');
  assert.equal(mediumRisk.requiredApprover, 'AGENT_SUPERVISOR');

  const highRisk = await governor.evaluate({ ...baseProposal, risk: 'HIGH' });
  assert.equal(highRisk.decision, 'approval_required');
  assert.equal(highRisk.requiredApprover, 'BUSINESS_OWNER');

  const criticalRisk = await governor.evaluate({ ...baseProposal, risk: 'CRITICAL' });
  assert.equal(criticalRisk.decision, 'blocked');
  assert.equal(criticalRisk.requiredApprover, 'SYSTEM_ADMIN');
});

test('AgentGovernor - custom policy overrides', async () => {
  const customPolicy = async (proposal, currentContext) => {
    if (proposal.payload?.spend > 100) {
      return { decision: 'blocked', reason: 'Spend exceeds $100 limit', policy: 'BUDGET_LIMIT' };
    }
  };

  const governor = new AgentGovernor([customPolicy]);

  const proposal = {
    id: 'prop_1',
    businessId: 'biz_1',
    agentId: 'agent_1',
    type: 'run_ads',
    risk: 'LOW',
    payload: { spend: 150 }
  };

  const result = await governor.evaluate(proposal);
  assert.equal(result.decision, 'blocked');
  assert.equal(result.policy, 'BUDGET_LIMIT');
});
