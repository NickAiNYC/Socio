import test from 'node:test';
import assert from 'node:assert/strict';
import { attributeRevenue } from '../economic/attribution.mjs';
import { MemoryEconomicStore } from '../economic/economic-store.mjs';
import { compareGroups, MIN_SAMPLE_PER_GROUP } from '../economic/stats.mjs';

/**
 * @param {{id?: string, amount?: number, customerId?: string|null}} [opts]
 */
function makeRevenue({ id, amount = 100, customerId = 'cus_1' } = {}) {
  return {
    id: id || `rev_${Math.random().toString(36).slice(2)}`,
    businessId: 'biz_1',
    type: 'revenue',
    amount,
    currency: 'USD',
    source: 'stripe',
    occurredAt: new Date().toISOString(),
    metadata: { stripeCustomerId: customerId },
  };
}

test('ATTRIBUTION: no experiment/customer link stays unknown (observation level)', async () => {
  const store = new MemoryEconomicStore();
  const record = await attributeRevenue({ store, revenueEvent: makeRevenue({ customerId: null }), experimentId: null, customerId: null });
  assert.equal(record.level, 'observation');
  assert.match(record.claim, /unknown attribution/);
});

test('ATTRIBUTION: unmapped customer stays unknown', async () => {
  const store = new MemoryEconomicStore();
  const record = await attributeRevenue({ store, revenueEvent: makeRevenue(), experimentId: 'exp_1', customerId: 'cust_1' });
  assert.equal(record.level, 'observation');
  assert.match(record.claim, /unmapped customer/);
});

test('ATTRIBUTION: customer not assigned to experiment stays unknown', async () => {
  const store = new MemoryEconomicStore();
  await store.upsertCustomer({ businessId: 'biz_1', provider: 'stripe', providerCustomerId: 'cus_1', displayName: 'A' });
  const record = await attributeRevenue({ store, revenueEvent: makeRevenue(), experimentId: 'exp_1', customerId: 'cust_1' });
  assert.equal(record.level, 'observation');
  assert.match(record.claim, /not assigned/);
});

test('ATTRIBUTION: insufficient sample returns inconclusive, not attribution', async () => {
  const store = new MemoryEconomicStore();
  await store.upsertCustomer({ businessId: 'biz_1', provider: 'stripe', providerCustomerId: 'cus_1', displayName: 'A' });
  await store.assignVariant('exp_1', 'cust_1', 'treatment');
  const record = await attributeRevenue({
    store,
    revenueEvent: makeRevenue(),
    experimentId: 'exp_1',
    customerId: 'cust_1',
    treatmentOutcomes: [1, 2, 3],
    controlOutcomes: [1],
    isRct: true,
  });
  assert.equal(record.level, 'observation');
  assert.match(record.claim, /insufficient sample/);
});

test('ATTRIBUTION: RCT + adequate sample + significance produces attribution-level evidence', async () => {
  const store = new MemoryEconomicStore();
  await store.upsertCustomer({ businessId: 'biz_1', provider: 'stripe', providerCustomerId: 'cus_1', displayName: 'A' });
  await store.assignVariant('exp_1', 'cust_1', 'treatment');

  const treatment = Array.from({ length: MIN_SAMPLE_PER_GROUP + 20 }, () => 0.12);
  const control = Array.from({ length: MIN_SAMPLE_PER_GROUP + 20 }, () => 0.06);

  const record = await attributeRevenue({
    store,
    revenueEvent: makeRevenue(),
    experimentId: 'exp_1',
    customerId: 'cust_1',
    treatmentOutcomes: treatment,
    controlOutcomes: control,
    isRct: true,
  });

  assert.equal(record.level, 'attribution');
  assert.match(record.claim, /significant positive lift/);
  assert.ok(record.confidence > 0.95);
  const evidenceKinds = record.evidence.map((e) => e.type);
  assert.ok(evidenceKinds.includes('fact'));
  assert.ok(evidenceKinds.includes('correlation'));
});

test('ATTRIBUTION: significant lift WITHOUT rct flag stays correlation-level', async () => {
  const store = new MemoryEconomicStore();
  await store.upsertCustomer({ businessId: 'biz_1', provider: 'stripe', providerCustomerId: 'cus_1', displayName: 'A' });
  await store.assignVariant('exp_1', 'cust_1', 'treatment');

  const treatment = Array.from({ length: MIN_SAMPLE_PER_GROUP + 20 }, () => 0.12);
  const control = Array.from({ length: MIN_SAMPLE_PER_GROUP + 20 }, () => 0.06);

  const record = await attributeRevenue({
    store,
    revenueEvent: makeRevenue(),
    experimentId: 'exp_1',
    customerId: 'cust_1',
    treatmentOutcomes: treatment,
    controlOutcomes: control,
    isRct: false,
  });

  assert.equal(record.level, 'correlation');
});

test('STATS: insufficient groups are never called significant', () => {
  const cmp = compareGroups([1, 2], [1]);
  assert.equal(cmp.sufficient, false);
  assert.equal(cmp.verdict, 'insufficient');
});

test('STATS: adequate groups with clear separation produce significant_positive', () => {
  const treatment = Array.from({ length: MIN_SAMPLE_PER_GROUP }, (_, i) => 10 + (i % 5) * 0.1);
  const control = Array.from({ length: MIN_SAMPLE_PER_GROUP }, (_, i) => 5 + (i % 5) * 0.1);
  const cmp = compareGroups(treatment, control);
  assert.equal(cmp.sufficient, true);
  assert.equal(cmp.verdict, 'significant_positive');
  assert.ok(cmp.delta > 0);
});
