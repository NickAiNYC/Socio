/**
 * Stripe webhook receiver — pilot wiring, not a new subsystem.
 *
 * One public endpoint:  POST /api/webhooks/stripe
 *
 * Reuses the existing economic truth plane:
 *   - verifyStripeSignature  (timing-safe, replay window)  economic/stripe-webhook.mjs
 *   - mapStripeEvent         (conservative mapping)         economic/stripe-webhook.mjs
 *   - revenueLedger.record   (idempotent, append-only)
 *
 * Behavior:
 *   - signature invalid            -> 401, nothing recorded
 *   - no secret configured         -> 503, refuse to process (fail closed)
 *   - revenue event                -> ledger record; redelivery -> 200 duplicate
 *   - refund event                 -> matched to original payment; original
 *                                    missing -> 200 ignored with reason
 *   - customer event               -> upsert into the economic store
 *   - unhandled / unbusinessed     -> 200 ignored with reason (no retry storm)
 *
 * Binds 127.0.0.1 by default; put nginx/caddy in front for HTTPS.
 */
import http from 'node:http';
import { pathToFileURL } from 'node:url';
import { RevenueLedger } from '../revenue-ledger.mjs';
import { MemoryEconomicStore, PostgresEconomicStore } from '../economic/economic-store.mjs';
import { verifyStripeSignature, mapStripeEvent } from '../economic/stripe-webhook.mjs';
import { MemoryRepository } from '../repositories/memory-repository.mjs';
import { PostgresRepository } from '../repositories/postgres-repository.mjs';
import { ValidationError } from '../errors.mjs';

const PORT = Number(process.env.STRIPE_WEBHOOK_PORT || 8789);
const HOST = process.env.STRIPE_WEBHOOK_HOST || '127.0.0.1';
const SECRET = process.env.STRIPE_WEBHOOK_SECRET || '';
const MAX_BODY_BYTES = Number(process.env.STRIPE_WEBHOOK_MAX_BODY_BYTES || 1_000_000);
const RATE_LIMIT_PER_MIN = Number(process.env.STRIPE_WEBHOOK_RATE_LIMIT || 120);
const SIGNATURE_HEADER = 'stripe-signature';

/**
 * @param {object} deps
 * @param {import('../revenue-ledger.mjs').RevenueLedger} deps.revenueLedger
 * @param {import('../economic/economic-store.mjs').MemoryEconomicStore|import('../economic/economic-store.mjs').PostgresEconomicStore} deps.economicStore
 * @param {string} [deps.secret] STRIPE_WEBHOOK_SECRET; empty string = refuse to process
 * @returns {import('node:http').Server}
 */
export function createStripeWebhookServer({ revenueLedger, economicStore, secret = '' }) {
  const buckets = new Map(); // ip -> { count, windowStart }

  function rateLimited(ip) {
    const now = Date.now();
    const bucket = buckets.get(ip) || { count: 0, windowStart: now };
    if (now - bucket.windowStart >= 60_000) {
      bucket.count = 0;
      bucket.windowStart = now;
    }
    bucket.count += 1;
    buckets.set(ip, bucket);
    return bucket.count > RATE_LIMIT_PER_MIN;
  }

  function sendJson(res, status, payload) {
    const body = JSON.stringify(payload, null, 2);
    res.writeHead(status, { 'Content-Type': 'application/json; charset=utf-8', 'Cache-Control': 'no-store' });
    res.end(body);
  }

  async function handleWebhook(req, res, rawBody) {
    if (!secret) {
      sendJson(res, 503, { error: { code: 'webhook_not_configured', message: 'STRIPE_WEBHOOK_SECRET is not set — refusing to process unverifiable payloads' } });
      return;
    }

    const signatureHeader = req.headers[SIGNATURE_HEADER];
    if (!verifyStripeSignature({ payload: rawBody, signatureHeader, secret })) {
      sendJson(res, 401, { error: { code: 'invalid_signature', message: 'signature verification failed' } });
      return;
    }

    let event;
    try {
      event = JSON.parse(rawBody);
    } catch {
      sendJson(res, 400, { error: { code: 'bad_request', message: 'payload is not valid JSON' } });
      return;
    }

    const mapped = mapStripeEvent(event);

    if (mapped.kind === 'revenue') {
      try {
        const recorded = await revenueLedger.record(mapped.ledgerEvent);
        sendJson(res, 200, { received: true, status: 'recorded', eventId: event.id, ledgerId: recorded.id });
      } catch (err) {
        if (err instanceof ValidationError && /duplicate event/.test(err.message)) {
          sendJson(res, 200, { received: true, status: 'duplicate', eventId: event.id, reason: err.message });
          return;
        }
        sendJson(res, 422, { error: { code: 'ledger_rejected', message: err.message } });
      }
      return;
    }

    if (mapped.kind === 'refund') {
      const refund = mapped.refundRef;
      const originals = await revenueLedger.getEvents({
        businessId: refund.businessId,
        type: 'revenue',
      });
      const original = originals
        .filter((e) => e.metadata?.paymentIntentId === refund.paymentIntentId)
        .sort((a, b) => (a.occurredAt < b.occurredAt ? 1 : -1))[0];

      if (!original) {
        sendJson(res, 200, { received: true, status: 'ignored', eventId: event.id, reason: `original payment for refund ${refund.stripeRefundId} not found on the ledger` });
        return;
      }

      try {
        const recorded = await revenueLedger.record({
          businessId: refund.businessId,
          type: 'refund',
          amount: refund.amount,
          currency: refund.currency,
          source: 'stripe',
          idempotencyKey: refund.idempotencyKey,
          metadata: {
            originalEventId: original.id,
            stripeRefundId: refund.stripeRefundId,
            paymentIntentId: refund.paymentIntentId,
            businessId: refund.businessId,
          },
        });
        sendJson(res, 200, { received: true, status: 'refund_recorded', eventId: event.id, ledgerId: recorded.id });
      } catch (err) {
        if (err instanceof ValidationError && /duplicate event/.test(err.message)) {
          sendJson(res, 200, { received: true, status: 'duplicate', eventId: event.id, reason: err.message });
          return;
        }
        if (err instanceof ValidationError && /already refunded/.test(err.message)) {
          sendJson(res, 200, { received: true, status: 'rejected', eventId: event.id, reason: err.message });
          return;
        }
        sendJson(res, 422, { error: { code: 'ledger_rejected', message: err.message } });
      }
      return;
    }

    if (mapped.kind === 'customer') {
      if (mapped.customer?.businessId) {
        const customer = await economicStore.upsertCustomer(mapped.customer);
        sendJson(res, 200, { received: true, status: 'customer_upserted', eventId: event.id, customerId: customer.id });
      } else {
        sendJson(res, 200, { received: true, status: 'ignored', eventId: event.id, reason: 'customer event has no metadata.businessId' });
      }
      return;
    }

    sendJson(res, 200, { received: true, status: 'ignored', eventId: event.id, reason: mapped.reason || 'unhandled event type' });
  }

  const server = http.createServer((req, res) => {
    const url = new URL(req.url, `http://${req.headers.host || 'localhost'}`);

    if (req.method === 'GET' && url.pathname === '/api/health') {
      sendJson(res, 200, { status: 'ok', service: 'stripe-webhook-receiver', time: new Date().toISOString() });
      return;
    }

    if (req.method !== 'POST' || url.pathname !== '/api/webhooks/stripe') {
      sendJson(res, 404, { error: { code: 'not_found', message: 'unknown route' } });
      return;
    }

    const ip = req.socket.remoteAddress || 'unknown';
    if (rateLimited(ip)) {
      sendJson(res, 429, { error: { code: 'rate_limited', message: 'too many requests' } });
      return;
    }

    let body = '';
    let tooLarge = false;
    req.on('data', (chunk) => {
      body += chunk;
      if (body.length > MAX_BODY_BYTES) {
        tooLarge = true;
        req.destroy();
      }
    });
    req.on('end', () => {
      if (tooLarge) {
        sendJson(res, 413, { error: { code: 'payload_too_large', message: `body exceeds ${MAX_BODY_BYTES} bytes` } });
        return;
      }
      handleWebhook(req, res, body).catch((err) => {
        sendJson(res, 500, { error: { code: 'internal_error', message: err.message } });
      });
    });
    req.on('error', () => {
      if (!res.headersSent) sendJson(res, 400, { error: { code: 'bad_request', message: 'request stream error' } });
    });
  });

  return server;
}

/**
 * Production boot — fail closed: DATABASE_URL required (unless explicit
 * memory mode) and STRIPE_WEBHOOK_SECRET required (a receiver that cannot
 * verify signatures must not accept payloads).
 */
export function main() {
  const DATABASE_URL = process.env.DATABASE_URL;
  const ALLOW_MEMORY = process.env.GROWTH_OS_ALLOW_MEMORY === 'true';

  if (!DATABASE_URL && !ALLOW_MEMORY) {
    console.error('Stripe webhook receiver fails closed: DATABASE_URL is required for durable persistence. Set GROWTH_OS_ALLOW_MEMORY=true only for explicit in-memory test mode.');
    process.exit(1);
  }
  if (!SECRET) {
    console.error('Stripe webhook receiver fails closed: STRIPE_WEBHOOK_SECRET is required to verify payload signatures.');
    process.exit(1);
  }

  const ledger = DATABASE_URL
    ? new RevenueLedger(new PostgresRepository('revenue_ledger'))
    : new RevenueLedger(new MemoryRepository());
  const economicStore = DATABASE_URL
    ? new PostgresEconomicStore(DATABASE_URL)
    : new MemoryEconomicStore();

  const server = createStripeWebhookServer({ revenueLedger: ledger, economicStore, secret: SECRET });
  server.listen(PORT, HOST, () => {
    console.log(`Stripe webhook receiver listening on http://${HOST}:${PORT}/api/webhooks/stripe`);
    console.log(`  persistence: ${DATABASE_URL ? 'postgres' : 'memory'}`);
  });
}

const isMain = process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href;
if (isMain) {
  main();
}
