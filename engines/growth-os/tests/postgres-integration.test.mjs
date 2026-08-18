import test from 'node:test';
import assert from 'node:assert/strict';
import pg from 'pg';
import { mkdtemp, writeFile, rm } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import path from 'node:path';

import { runMigrations } from '../migrations/migrate.mjs';
import { PostgresRepository } from '../repositories/postgres-repository.mjs';
import { RevenueLedger } from '../revenue-ledger.mjs';

import { AgentGovernor } from '../agent-governor.mjs';
import { PostgresEconomicStore } from '../economic/economic-store.mjs';
import { mapStripeEvent } from '../economic/stripe-webhook.mjs';

// Ephemeral Postgres. CI provides DATABASE_URL (postgres service); locally we
// use the throwaway docker container (no personal credentials anywhere).
const DATABASE_URL =
  process.env.DATABASE_URL ||
  'postgres://postgres:ephemeral_test@127.0.0.1:55432/growth_os_test';

let pool;
let available = false;

test.before(async () => {
  process.env.DATABASE_URL = DATABASE_URL; // repositories build their own pools from env
  pool = new pg.Pool({ connectionString: DATABASE_URL, connectionTimeoutMillis: 3000 });
  try {
    await pool.query('SELECT 1');
    available = true;
    await pool.query('DROP SCHEMA public CASCADE; CREATE SCHEMA public;');
    await runMigrations(pool);
  } catch {
    available = false;
  }
});

test.after(async () => {
  if (pool) await pool.end();
});

test('PG: migrations apply (ephemeral Postgres required)', async (t) => {
  if (!available) return t.skip('Postgres unavailable — set DATABASE_URL');
  const { rows } = await pool.query('SELECT version FROM schema_migrations ORDER BY version');
  assert.ok(rows.some((r) => r.version === '001_economic_truth'));
});

test('PG: duplicate idempotencyKey is DB-enforced (23505 mapped to ValidationError)', async (t) => {
  if (!available) return t.skip('Postgres unavailable');
  const repo = new PostgresRepository('revenue_ledger');
  const ledger = new RevenueLedger(repo);

  await ledger.record({
    id: 'evt_a',
    businessId: 'biz_1',
    type: 'revenue',
    amount: 100,
    currency: 'USD',
    source: 'stripe',
    idempotencyKey: 'stripe:evt_x',
  });
  // Different record id, same idempotency key -> must be rejected by the DB.
  await assert.rejects(
    ledger.record({
      id: 'evt_b',
      businessId: 'biz_1',
      type: 'revenue',
      amount: 999,
      currency: 'USD',
      source: 'stripe',
      idempotencyKey: 'stripe:evt_x',
    }),
    /duplicate event/i
  );
});

test('PG: duplicate Stripe webhook delivery does not double revenue', async (t) => {
  if (!available) return t.skip('Postgres unavailable');
  const repo = new PostgresRepository('revenue_ledger');
  const ledger = new RevenueLedger(repo);
  const businessId = 'biz_wh_delivery';

  const mapped = mapStripeEvent({
    id: 'evt_delivery_1',
    type: 'payment_intent.succeeded',
    data: { object: { id: 'pi_9', amount_received: 5000, currency: 'usd', customer: 'cus_9', metadata: { businessId } } },
  });
  const event = mapped.ledgerEvent;
  await ledger.record(event);
  // Stripe redelivers the SAME event id.
  await assert.rejects(ledger.record(event), /duplicate event/i);

  const metrics = await ledger.calculateMetrics({ businessId });
  assert.equal(metrics.grossRevenue, 50, 'revenue must be counted exactly once');
});

test('PG: refund requires the original payment and cannot be replayed', async (t) => {
  if (!available) return t.skip('Postgres unavailable');
  const repo = new PostgresRepository('revenue_ledger');
  const ledger = new RevenueLedger(repo);

  await ledger.record({
    id: 'rev_orig',
    businessId: 'biz_1',
    type: 'revenue',
    amount: 100,
    currency: 'USD',
    source: 'stripe',
    idempotencyKey: 'stripe:pi_orig',
    metadata: { paymentIntentId: 'pi_orig' },
  });

  const refund = {
    businessId: 'biz_1',
    type: 'refund',
    amount: 25,
    currency: 'USD',
    source: 'stripe',
    idempotencyKey: 'stripe-refund:re_orig',
    metadata: { originalEventId: 'rev_orig', paymentIntentId: 'pi_orig' },
  };
  await ledger.record(refund);
  await assert.rejects(ledger.record(refund), /already refunded|duplicate/i, 'refund replay must fail');

  // Refund without an original must fail.
  await assert.rejects(
    ledger.record({ businessId: 'biz_1', type: 'refund', amount: 1, currency: 'USD', source: 'stripe', idempotencyKey: 'stripe-refund:re_none' }),
    /originalEventId/i
  );
});

test('PG: concurrent CAS — exactly one worker consumes an approval', async (t) => {
  if (!available) return t.skip('Postgres unavailable');
  const approvalRepo = new PostgresRepository('approvals');
  const governor = new AgentGovernor([], approvalRepo);

  await governor.propose({
    id: 'prop_cas',
    businessId: 'biz_1',
    agentId: 'agent_a',
    type: 'charge',
    risk: 'LOW',
    objective: 'x',
    expectedOutcome: 'y',
    payload: { amount: 10 },
    evidence: 'none',
    createdAt: new Date().toISOString(),
  });

  const results = await Promise.allSettled([
    governor.markExecuted('prop_cas'),
    governor.markExecuted('prop_cas'),
    governor.markExecuted('prop_cas'),
  ]);
  const fulfilled = results.filter((r) => r.status === 'fulfilled').length;
  assert.equal(fulfilled, 1, 'exactly one concurrent consumer must win');
});

test('PG: tenant isolation at the repository boundary', async (t) => {
  if (!available) return t.skip('Postgres unavailable');
  const repo = new PostgresRepository('revenue_ledger');
  const ledger = new RevenueLedger(repo);
  const bizA = 'biz_iso_a';
  const bizB = 'biz_iso_b';

  await ledger.record({ id: 'b1_r1', businessId: bizA, type: 'revenue', amount: 10, currency: 'USD', source: 's' });
  await ledger.record({ id: 'b2_r1', businessId: bizB, type: 'revenue', amount: 99, currency: 'USD', source: 's' });

  const biz1 = await ledger.getByBusiness(bizA);
  assert.ok(biz1.every((e) => e.businessId === bizA), 'only bizA rows returned');
  assert.equal(biz1.length, 1);
});

test('PG: migration failure rolls back cleanly', async (t) => {
  if (!available) return t.skip('Postgres unavailable');
  const dir = await mkdtemp(path.join(tmpdir(), 'growth-os-migrate-'));
  try {
    await writeFile(path.join(dir, '001_bad.sql'), 'CREATE TABLE partial_ok (id int); THIS IS NOT SQL;');
    await assert.rejects(runMigrations(pool, dir), /migration 001_bad failed/);
    // The successful part of the failed migration must have rolled back.
    const res = await pool.query(`SELECT to_regclass('public.partial_ok') AS t`);
    assert.equal(res.rows[0].t, null, 'partial table must be rolled back');
  } finally {
    await rm(dir, { recursive: true, force: true });
  }
});

test('PG: economic store — customer uniqueness and attribution uniqueness enforced', async (t) => {
  if (!available) return t.skip('Postgres unavailable');
  const store = new PostgresEconomicStore(pool);

  await store.upsertCustomer({ businessId: 'biz_1', provider: 'stripe', providerCustomerId: 'cus_u', displayName: 'First' });
  await store.upsertCustomer({ businessId: 'biz_1', provider: 'stripe', providerCustomerId: 'cus_u', displayName: 'Second' });
  const customers = await store.getCustomersByBusiness('biz_1');
  assert.equal(customers.filter((c) => c.providerCustomerId === 'cus_u').length, 1, 'upsert must not duplicate');

  await store.assignVariant('exp_u', 'cust_u', 'treatment');
  await store.assignVariant('exp_u', 'cust_u', 'treatment');
  const assignment = await store.getAssignment('exp_u', 'cust_u');
  assert.equal(assignment.variant, 'treatment');

  const attribution = { id: 'attr_u', businessId: 'biz_1', revenueEventId: 'rev_u', experimentId: 'exp_u', customerId: 'cust_u', level: 'observation', claim: 'x', confidence: null, evidence: [], createdAt: new Date().toISOString() };
  await store.recordAttribution(attribution);
  await assert.rejects(store.recordAttribution(attribution), /already exists/);
});
