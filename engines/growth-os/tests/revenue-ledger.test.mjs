import test from 'node:test';
import assert from 'node:assert/strict';
import { RevenueLedger } from '../revenue-ledger.mjs';
import { MemoryRepository } from '../repositories/memory-repository.mjs';

test('RevenueLedger - records a valid event', async () => {
  const repo = new MemoryRepository();
  const ledger = new RevenueLedger(repo);

  const event = await ledger.record({
    businessId: 'biz_1',
    type: 'revenue',
    amount: 100,
    currency: 'USD',
    source: 'stripe'
  });

  assert.ok(event.id);
  assert.equal(event.amount, 100);
});

test('RevenueLedger - rejects invalid event', async () => {
  const repo = new MemoryRepository();
  const ledger = new RevenueLedger(repo);

  await assert.rejects(
    ledger.record({ type: 'revenue' }), 
    /businessId is required/
  );
});

test('RevenueLedger - aggregation and calculations', async () => {
  const repo = new MemoryRepository();
  const ledger = new RevenueLedger(repo);

  await ledger.record({ businessId: 'biz_1', type: 'revenue', amount: 500, currency: 'USD', source: 'stripe' });
  await ledger.record({ businessId: 'biz_1', type: 'refund', amount: 50, currency: 'USD', source: 'stripe' });
  await ledger.record({ businessId: 'biz_1', type: 'campaign_cost', amount: 100, currency: 'USD', source: 'stripe' });

  const metrics = await ledger.calculateMetrics({ businessId: 'biz_1' });
  
  assert.equal(metrics.grossRevenue, 500);
  assert.equal(metrics.refunds, 50);
  assert.equal(metrics.netRevenue, 450); // 500 - 50
  assert.equal(metrics.totalCost, 100);
  assert.equal(metrics.roi, 350); // ((450 - 100) / 100) * 100
});

test('RevenueLedger - filtering capabilities', async () => {
  const repo = new MemoryRepository();
  const ledger = new RevenueLedger(repo);

  await ledger.record({ businessId: 'biz_1', agentId: 'agent_a', type: 'revenue', amount: 100, currency: 'USD', source: 'test' });
  await ledger.record({ businessId: 'biz_2', agentId: 'agent_a', type: 'revenue', amount: 200, currency: 'USD', source: 'test' });
  await ledger.record({ businessId: 'biz_1', agentId: 'agent_b', type: 'revenue', amount: 300, currency: 'USD', source: 'test' });

  const agentAMetrics = await ledger.calculateMetrics({ agentId: 'agent_a' });
  assert.equal(agentAMetrics.grossRevenue, 300);

  const biz1Metrics = await ledger.calculateMetrics({ businessId: 'biz_1' });
  assert.equal(biz1Metrics.grossRevenue, 400);
});
