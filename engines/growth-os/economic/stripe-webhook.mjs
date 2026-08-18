import crypto from 'node:crypto';

/**
 * Stripe webhook signature verification (Stripe's documented scheme).
 *
 * Header format:  t=<unix-seconds>,v1=<hmac-sha256 hex of "t.payload">
 * Signature uses HMAC-SHA256 with the webhook signing secret. Comparison is
 * timing-safe; the timestamp is checked against a tolerance window to prevent
 * replay of old payloads.
 */
export function verifyStripeSignature({ payload, signatureHeader, secret, toleranceSec = 300 }) {
  if (!payload || !signatureHeader || !secret) return false;
  const parts = {};
  for (const kv of signatureHeader.split(',')) {
    const idx = kv.indexOf('=');
    if (idx < 0) continue;
    parts[kv.slice(0, idx).trim()] = kv.slice(idx + 1).trim();
  }
  const t = parts.t;
  const v1 = parts.v1;
  if (!t || !v1) return false;

  const timestamp = Number(t);
  if (!Number.isFinite(timestamp)) return false;
  if (Math.abs(Date.now() / 1000 - timestamp) > toleranceSec) return false;

  const expected = crypto.createHmac('sha256', secret).update(`${t}.${payload}`).digest('hex');
  const a = Buffer.from(expected);
  const b = Buffer.from(v1);
  if (a.length !== b.length) return false;
  return crypto.timingSafeEqual(a, b);
}

const REVENUE_TYPES = new Set(['payment_intent.succeeded', 'checkout.session.completed']);
const REFUND_TYPES = new Set(['charge.refunded']);
const CUSTOMER_TYPES = new Set(['customer.created', 'customer.updated']);

/**
 * Maps a Stripe event to a durable ledger/customer action.
 *
 * Every mapping is conservative:
 *   - payment without metadata.businessId -> ignored (unknown stays unknown)
 *   - refund without a findable original payment -> rejected downstream
 *   - anything unrecognized -> ignored with a reason
 *
 * @param {{id: string, type: string, data?: {object?: {[key: string]: any}}}} event the raw Stripe webhook event object
 * @returns {{kind: 'revenue'|'refund'|'customer'|'ignored', reason?: string,
 *            ledgerEvent?: {businessId: string, type: string, amount: number, currency: string, source: string, idempotencyKey: string, metadata?: object},
 *            refundRef?: {businessId: string, stripeRefundId: string, paymentIntentId: string|null, amount: number, currency: string, idempotencyKey: string},
 *            customer?: object}}
 */
export function mapStripeEvent(event) {
  const type = event?.type;
  const object = event?.data?.object || {};

  if (REVENUE_TYPES.has(type)) {
    const businessId = object.metadata?.businessId;
    if (!businessId) {
      return { kind: 'ignored', reason: `revenue event ${event.id} has no metadata.businessId — cannot attribute` };
    }
    const amountMinor = object.amount_received ?? object.amount_total ?? object.amount;
    if (typeof amountMinor !== 'number' || amountMinor <= 0) {
      return { kind: 'ignored', reason: `revenue event ${event.id} has no positive amount` };
    }
    const currency = String(object.currency || 'usd').toUpperCase();
    const amount = amountMinor / 100;
    return {
      kind: 'revenue',
      ledgerEvent: {
        businessId,
        type: 'revenue',
        amount,
        currency,
        source: 'stripe',
        idempotencyKey: `stripe:${event.id}`,
        metadata: {
          stripeEventId: event.id,
          paymentIntentId: object.payment_intent || object.id,
          stripeCustomerId: object.customer || null,
          businessId,
        },
      },
    };
  }

  if (REFUND_TYPES.has(type)) {
    const businessId = object.metadata?.businessId;
    if (!businessId) {
      return { kind: 'ignored', reason: `refund event ${event.id} has no metadata.businessId — cannot attribute` };
    }
    const amountMinor = object.amount_refunded ?? object.amount;
    if (typeof amountMinor !== 'number' || amountMinor <= 0) {
      return { kind: 'ignored', reason: `refund event ${event.id} has no positive amount` };
    }
    return {
      kind: 'refund',
      refundRef: {
        businessId,
        stripeRefundId: object.id,
        paymentIntentId: object.payment_intent || null,
        amount: amountMinor / 100,
        currency: String(object.currency || 'usd').toUpperCase(),
        idempotencyKey: `stripe-refund:${object.id}`,
      },
    };
  }

  if (CUSTOMER_TYPES.has(type)) {
    const businessId = object.metadata?.businessId;
    return {
      kind: 'customer',
      customer: {
        businessId,
        provider: 'stripe',
        providerCustomerId: object.id,
        displayName: object.name || object.email || null,
        data: { email: object.email || null, created: object.created || null },
      },
    };
  }

  return { kind: 'ignored', reason: `unhandled stripe event type ${type}` };
}
