import test from 'node:test';
import assert from 'node:assert/strict';
import crypto from 'node:crypto';
import { verifyStripeSignature, mapStripeEvent } from '../economic/stripe-webhook.mjs';

const SECRET = 'whsec_test_secret';

function sign(payload, secret = SECRET, timestamp = Math.floor(Date.now() / 1000)) {
  const v1 = crypto.createHmac('sha256', secret).update(`${timestamp}.${payload}`).digest('hex');
  return `t=${timestamp},v1=${v1}`;
}

test('STRIPE: valid signature verifies', () => {
  const payload = JSON.stringify({ id: 'evt_1', type: 'payment_intent.succeeded' });
  assert.equal(verifyStripeSignature({ payload, signatureHeader: sign(payload), secret: SECRET }), true);
});

test('STRIPE: tampered payload fails', () => {
  const payload = JSON.stringify({ id: 'evt_1', type: 'payment_intent.succeeded' });
  const header = sign(payload);
  assert.equal(verifyStripeSignature({ payload: JSON.stringify({ id: 'evt_1', type: 'payment_intent.succeeded', amount: 999 }), signatureHeader: header, secret: SECRET }), false);
});

test('STRIPE: wrong secret fails', () => {
  const payload = JSON.stringify({ id: 'evt_1' });
  assert.equal(verifyStripeSignature({ payload, signatureHeader: sign(payload), secret: 'whsec_wrong' }), false);
});

test('STRIPE: expired timestamp fails (replay protection)', () => {
  const payload = JSON.stringify({ id: 'evt_1' });
  const old = Math.floor(Date.now() / 1000) - 3600;
  const header = sign(payload, SECRET, old);
  assert.equal(verifyStripeSignature({ payload, signatureHeader: header, secret: SECRET, toleranceSec: 300 }), false);
});

test('STRIPE: malformed header fails', () => {
  assert.equal(verifyStripeSignature({ payload: '{}', signatureHeader: 'not-a-header', secret: SECRET }), false);
  assert.equal(verifyStripeSignature({ payload: '{}', signatureHeader: '', secret: SECRET }), false);
});

test('STRIPE: payment_intent.succeeded maps to revenue with idempotencyKey', () => {
  const mapped = mapStripeEvent({
    id: 'evt_1',
    type: 'payment_intent.succeeded',
    data: { object: { id: 'pi_1', amount_received: 10000, currency: 'usd', customer: 'cus_1', metadata: { businessId: 'biz_1' } } },
  });
  assert.equal(mapped.kind, 'revenue');
  assert.equal(mapped.ledgerEvent.idempotencyKey, 'stripe:evt_1');
  assert.equal(mapped.ledgerEvent.amount, 100);
  assert.equal(mapped.ledgerEvent.businessId, 'biz_1');
});

test('STRIPE: revenue without businessId is ignored (unknown stays unknown)', () => {
  const mapped = mapStripeEvent({
    id: 'evt_2',
    type: 'payment_intent.succeeded',
    data: { object: { id: 'pi_2', amount_received: 100, currency: 'usd' } },
  });
  assert.equal(mapped.kind, 'ignored');
  assert.match(mapped.reason, /businessId/);
});

test('STRIPE: charge.refunded maps to a refund reference', () => {
  const mapped = mapStripeEvent({
    id: 'evt_3',
    type: 'charge.refunded',
    data: { object: { id: 're_1', payment_intent: 'pi_1', amount_refunded: 2000, currency: 'usd', metadata: { businessId: 'biz_1' } } },
  });
  assert.equal(mapped.kind, 'refund');
  assert.equal(mapped.refundRef.idempotencyKey, 'stripe-refund:re_1');
  assert.equal(mapped.refundRef.amount, 20);
});

test('STRIPE: unhandled event type is ignored', () => {
  const mapped = mapStripeEvent({ id: 'evt_4', type: 'invoice.payment_failed', data: { object: {} } });
  assert.equal(mapped.kind, 'ignored');
});
