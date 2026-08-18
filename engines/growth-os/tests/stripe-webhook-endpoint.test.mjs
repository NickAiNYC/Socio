import test from 'node:test';
import assert from 'node:assert/strict';
import crypto from 'node:crypto';
import { createStripeWebhookServer } from '../merchant/stripe-webhook-endpoint.mjs';
import { MemoryEconomicStore } from '../economic/economic-store.mjs';
import { MemoryRepository } from '../repositories/memory-repository.mjs';
import { RevenueLedger } from '../revenue-ledger.mjs';

const SECRET = 'whsec_test';

function sign(payload, secret = SECRET) {
  const t = Math.floor(Date.now() / 1000);
  const v1 = crypto.createHmac('sha256', secret).update(`${t}.${payload}`).digest('hex');
  return `t=${t},v1=${v1}`;
}

function revenueEvent(overrides = {}) {
  return {
    id: 'evt_pay_1',
    type: 'payment_intent.succeeded',
    data: {
      object: {
        id: 'pi_1',
        amount: 5000,
        currency: 'usd',
        metadata: /** @type {{businessId?: string, [k: string]: unknown}} */ ({ businessId: 'biz_a' }),
        customer: 'cus_1',
        payment_intent: 'pi_1',
      },
    },
    ...overrides,
  };
}

function refundEvent(overrides = {}) {
  return {
    id: 'evt_ref_1',
    type: 'charge.refunded',
    data: { object: { id: 're_1', amount: 5000, currency: 'usd', metadata: { businessId: 'biz_a' }, payment_intent: 'pi_1' } },
    ...overrides,
  };
}

function customerEvent(overrides = {}) {
  return {
    id: 'evt_cus_1',
    type: 'customer.created',
    data: { object: { id: 'cus_1', name: 'Maya R.', email: 'maya@example.com', metadata: { businessId: 'biz_a' } } },
    ...overrides,
  };
}

async function startServer(t, { secret = SECRET } = {}) {
  const ledger = new RevenueLedger(new MemoryRepository());
  const store = new MemoryEconomicStore();
  const server = createStripeWebhookServer({ revenueLedger: ledger, economicStore: store, secret });
  await new Promise((resolve) => server.listen(0, '127.0.0.1', () => resolve(undefined)));
  const addr = server.address();
  if (!addr || typeof addr === 'string') {
    throw new Error('failed to bind test server');
  }
  t.after(() => server.close());
  const { port } = addr;
  const base = `http://127.0.0.1:${port}/api/webhooks/stripe`;
  return { ledger, store, base };
}

async function post(base, payload, { signature = null, secret = SECRET } = {}) {
  const body = typeof payload === 'string' ? payload : JSON.stringify(payload);
  const headers = { 'Content-Type': 'application/json' };
  if (signature !== null) headers['stripe-signature'] = signature;
  else if (secret) headers['stripe-signature'] = sign(body, secret);
  const res = await fetch(base, { method: 'POST', headers, body });
  return { status: res.status, body: await res.json().catch(() => ({})) };
}

test('WEBHOOK: revenue event with valid signature is recorded to the ledger', async (t) => {
  const { ledger, base } = await startServer(t);
  const event = revenueEvent();
  const { status, body } = await post(base, event);

  assert.equal(status, 200);
  assert.equal(body.status, 'recorded');
  assert.equal(body.eventId, 'evt_pay_1');

  const events = await ledger.getEvents({ businessId: 'biz_a' });
  assert.equal(events.length, 1);
  assert.equal(events[0].type, 'revenue');
  assert.equal(events[0].amount, 50);
  assert.equal(events[0].currency, 'USD');
  assert.equal(events[0].source, 'stripe');
  assert.equal(events[0].idempotencyKey, 'stripe:evt_pay_1');
});

test('WEBHOOK: redelivered event is idempotent — 200 duplicate, no double-count', async (t) => {
  const { ledger, base } = await startServer(t);
  const event = revenueEvent();

  const first = await post(base, event);
  const second = await post(base, event);

  assert.equal(first.body.status, 'recorded');
  assert.equal(second.status, 200);
  assert.equal(second.body.status, 'duplicate');

  const events = await ledger.getEvents({ businessId: 'biz_a' });
  assert.equal(events.length, 1, 'redelivery must not double-count revenue');
});

test('WEBHOOK: invalid signature is rejected 401 and nothing is recorded', async (t) => {
  const { ledger, base } = await startServer(t);
  const body = JSON.stringify(revenueEvent());
  const res = await post(base, body, { signature: 't=0,v1=deadbeef' });

  assert.equal(res.status, 401);
  assert.equal(res.body.error.code, 'invalid_signature');
  assert.equal((await ledger.getEvents({ businessId: 'biz_a' })).length, 0);
});

test('WEBHOOK: no secret configured refuses to process (503)', async (t) => {
  const { base } = await startServer(t, { secret: '' });
  const res = await post(base, revenueEvent(), { secret: '' });

  assert.equal(res.status, 503);
  assert.equal(res.body.error.code, 'webhook_not_configured');
});

test('WEBHOOK: refund maps to the original payment on the ledger', async (t) => {
  const { ledger, base } = await startServer(t);
  await post(base, revenueEvent());
  const { status, body } = await post(base, refundEvent());

  assert.equal(status, 200);
  assert.equal(body.status, 'refund_recorded');

  const refunds = await ledger.getEvents({ businessId: 'biz_a', type: 'refund' });
  assert.equal(refunds.length, 1);
  const original = (await ledger.getEvents({ businessId: 'biz_a' })).find((e) => e.type === 'revenue');
  assert.equal(refunds[0].metadata.originalEventId, original.id);
  assert.equal(refunds[0].idempotencyKey, 'stripe-refund:re_1');
});

test('WEBHOOK: refund with unknown original payment is ignored with a reason', async (t) => {
  const { ledger, base } = await startServer(t);
  const { status, body } = await post(base, refundEvent());

  assert.equal(status, 200);
  assert.equal(body.status, 'ignored');
  assert.match(body.reason, /original payment for refund/);
  assert.equal((await ledger.getEvents({ businessId: 'biz_a', type: 'refund' })).length, 0);
});

test('WEBHOOK: a second refund of the same original payment is rejected, not retried', async (t) => {
  const { ledger, base } = await startServer(t);
  await post(base, revenueEvent());
  await post(base, refundEvent());

  const second = await post(base, refundEvent({ id: 'evt_ref_2', data: { object: { id: 're_2', amount: 5000, currency: 'usd', metadata: { businessId: 'biz_a' }, payment_intent: 'pi_1' } } }));

  assert.equal(second.status, 200);
  assert.equal(second.body.status, 'rejected');
  assert.match(second.body.reason, /already refunded/);
  assert.equal((await ledger.getEvents({ businessId: 'biz_a', type: 'refund' })).length, 1);
});

test('WEBHOOK: customer.created upserts the customer into the economic store', async (t) => {
  const { store, base } = await startServer(t);
  const { status, body } = await post(base, customerEvent());

  assert.equal(status, 200);
  assert.equal(body.status, 'customer_upserted');

  const customers = await store.getCustomersByBusiness('biz_a');
  assert.equal(customers.length, 1);
  assert.equal(customers[0].providerCustomerId, 'cus_1');
  assert.equal(customers[0].displayName, 'Maya R.');
});

test('WEBHOOK: event without businessId is ignored, never attributed', async (t) => {
  const { ledger, base } = await startServer(t);
  const event = revenueEvent();
  event.data.object = { ...event.data.object, metadata: {} }; // no businessId
  const { status, body } = await post(base, event);

  assert.equal(status, 200);
  assert.equal(body.status, 'ignored');
  assert.match(body.reason, /no metadata\.businessId/);
  assert.equal((await ledger.getEvents({})).length, 0);
});

test('WEBHOOK: malformed JSON returns 400', async (t) => {
  const { base } = await startServer(t);
  const res = await post(base, '{not json', { signature: sign('{not json') });

  assert.equal(res.status, 400);
  assert.equal(res.body.error.code, 'bad_request');
});

test('WEBHOOK: unknown routes return 404', async (t) => {
  const server = createStripeWebhookServer({
    revenueLedger: new RevenueLedger(new MemoryRepository()),
    economicStore: new MemoryEconomicStore(),
    secret: SECRET,
  });
  await new Promise((resolve) => server.listen(0, '127.0.0.1', () => resolve(undefined)));
  const addr = server.address();
  const port = typeof addr === 'object' && addr ? addr.port : 0;
  t.after(() => server.close());

  const res = await fetch(`http://127.0.0.1:${port}/api/nope`, { method: 'POST' });
  assert.equal(res.status, 404);
});
