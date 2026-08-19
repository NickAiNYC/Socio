import test from 'node:test';
import assert from 'node:assert/strict';
import pg from 'pg';
import { RevenueLedger } from '../revenue-ledger.mjs';
import { MemoryRepository } from '../repositories/memory-repository.mjs';
import { PostgresRepository } from '../repositories/postgres-repository.mjs';

/**
 * Refund race regression tests.
 *
 * The over-refund guard is only trustworthy if the "sum existing refunds"
 * read and the "insert refund" write are atomic per original payment.
 * These tests fire conflicting cumulative refunds concurrently and assert
 * that exactly one wins per attempt batch and the total never exceeds the
 * original — on the in-memory store (per-key mutex) and, when a real
 * DATABASE_URL is available, on Postgres (pg_advisory_xact_lock across
 * separate connections).
 */

test('REFUND RACE: concurrent refunds on the memory store never over-refund', async () => {
  const repo = new MemoryRepository();
  const ledger = new RevenueLedger(repo);
  await ledger.record({ id: 'evt_orig_1', businessId: 'biz_1', type: 'revenue', amount: 100, currency: 'USD', source: 'stripe' });

  const attempts = Array.from({ length: 10 }, (_, i) =>
    ledger
      .record({
        businessId: 'biz_1',
        type: 'refund',
        amount: 60,
        currency: 'USD',
        source: 'stripe',
        idempotencyKey: `refund:race:mem:${i}`,
        metadata: { originalEventId: 'evt_orig_1' },
      })
      .then(() => 'ok')
      .catch((e) => e.message)
  );

  const results = await Promise.all(attempts);
  const ok = results.filter((r) => r === 'ok');

  assert.equal(ok.length, 1, `exactly one concurrent refund must record, got ${ok.length}`);
  const refunds = await ledger.getEvents({ businessId: 'biz_1', type: 'refund' });
  const total = refunds.reduce((sum, e) => sum + e.amount, 0);
  assert.equal(total, 60, 'total refunded must never exceed the original payment');
});

test('REFUND RACE: sequential partial refunds accumulate correctly', async () => {
  const repo = new MemoryRepository();
  const ledger = new RevenueLedger(repo);
  await ledger.record({ id: 'evt_orig_2', businessId: 'biz_2', type: 'revenue', amount: 100, currency: 'USD', source: 'stripe' });

  await ledger.record({ businessId: 'biz_2', type: 'refund', amount: 40, currency: 'USD', source: 'stripe', metadata: { originalEventId: 'evt_orig_2' } });
  await ledger.record({ businessId: 'biz_2', type: 'refund', amount: 40, currency: 'USD', source: 'stripe', metadata: { originalEventId: 'evt_orig_2' } });
  // Third refund would push past $100 — must be rejected.
  await assert.rejects(
    ledger.record({ businessId: 'biz_2', type: 'refund', amount: 40, currency: 'USD', source: 'stripe', metadata: { originalEventId: 'evt_orig_2' } }),
    /exceeds the remaining refundable amount/
  );

  const refunds = await ledger.getEvents({ businessId: 'biz_2', type: 'refund' });
  assert.equal(refunds.length, 2);
  assert.equal(refunds.reduce((s, e) => s + e.amount, 0), 80);
});

// ---------------------------------------------------------------------------
// Postgres: real advisory lock across separate connections.
// ---------------------------------------------------------------------------
let pgAvailable = false;
try {
  if (!process.env.DATABASE_URL) throw new Error('no DATABASE_URL');
  const pool = new pg.Pool({ connectionString: process.env.DATABASE_URL });
  await pool.query('SELECT 1');
  await pool.end();
  pgAvailable = true;
} catch {
  pgAvailable = false;
}

test('REFUND RACE: concurrent refunds across Postgres connections never over-refund', async (t) => {
  if (!pgAvailable) return t.skip('Postgres unavailable — set DATABASE_URL');

  const repoA = new PostgresRepository('revenue_ledger');
  const repoB = new PostgresRepository('revenue_ledger');
  const ledgerA = new RevenueLedger(repoA);
  const ledgerB = new RevenueLedger(repoB);
  const businessId = 'biz_race_pg';
  const originalId = 'evt_orig_race_pg';

  await ledgerA.record({ id: originalId, businessId, type: 'revenue', amount: 100, currency: 'USD', source: 'stripe' });

  const attempts = Array.from({ length: 10 }, (_, i) => {
    const ledger = i % 2 === 0 ? ledgerA : ledgerB; // alternate connections
    return ledger
      .record({
        businessId,
        type: 'refund',
        amount: 60,
        currency: 'USD',
        source: 'stripe',
        idempotencyKey: `refund:race:pg:${i}`,
        metadata: { originalEventId: originalId },
      })
      .then(() => 'ok')
      .catch((e) => e.message);
  });

  const results = await Promise.all(attempts);
  const ok = results.filter((r) => r === 'ok');

  assert.equal(ok.length, 1, `exactly one concurrent refund must record, got ${ok.length}`);
  const refunds = await ledgerA.getEvents({ businessId, type: 'refund' });
  const total = refunds.reduce((sum, e) => sum + e.amount, 0);
  assert.equal(total, 60, 'total refunded must never exceed the original payment');

  await repoA.pool?.end?.();
  await repoB.pool?.end?.();
});
