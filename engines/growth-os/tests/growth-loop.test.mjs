import test from 'node:test';
import assert from 'node:assert/strict';
import { GrowthLoop } from '../growth-loop.mjs';
import { BusinessTwin } from '../business-twin.mjs';
import { RevenueLedger } from '../revenue-ledger.mjs';
import { AgentGovernor } from '../agent-governor.mjs';
import { ExperimentEngine } from '../experiment-engine.mjs';
import { MemoryRepository, BusinessTwinMemoryRepository } from '../repositories/memory-repository.mjs';

test('GrowthLoop - runs a complete cycle', async () => {
  const twinRepo = new BusinessTwinMemoryRepository();
  const ledgerRepo = new MemoryRepository();
  const expRepo = new MemoryRepository();

  const businessTwin = new BusinessTwin(twinRepo);
  const revenueLedger = new RevenueLedger(ledgerRepo);
  const agentGovernor = new AgentGovernor();
  const experimentEngine = new ExperimentEngine(expRepo);

  await businessTwin.initialize('biz_1', { name: 'Test Biz' });

  const loop = new GrowthLoop({
    businessTwin,
    revenueLedger,
    agentGovernor,
    experimentEngine
  });

  // Override _generateActionProposals just for testing
  loop._generateActionProposals = () => [
    { id: 'prop_1', businessId: 'biz_1', agentId: 'agent_1', type: 'test', risk: 'LOW' }
  ];

  const results = await loop.runCycle({ businessId: 'biz_1' });
  
  assert.equal(results.businessId, 'biz_1');
  assert.equal(results.proposedActions.length, 1);
  assert.equal(results.approvedActions.length, 1); // LOW risk is auto-approved
  assert.equal(results.blockedActions.length, 0);
  assert.equal(results.twinUpdates.cycleApprovedActions, 1);

  const updatedTwin = await businessTwin.get('biz_1');
  assert.equal(updatedTwin.cycleApprovedActions, 1);
});
