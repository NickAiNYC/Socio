# Stripe Integration

## Webhook signature verification (economic/stripe-webhook.mjs)

`verifyStripeSignature()` implements Stripe's documented scheme:

- header format `t=<unix-seconds>,v1=<hmac-sha256 hex>`
- recompute `HMAC-SHA256(secret, "<t>.<raw-body>")`
- **timing-safe** comparison
- timestamp checked against `toleranceSec` (default 300s) — old/replayed
  payloads are rejected

Any failure — malformed header, wrong secret, tampered payload, stale
timestamp — returns `false`. The caller must treat `false` as **reject** (HTTP
400, no ledger write).

## Event mapping

`mapStripeEvent()` maps Stripe events conservatively:

| Stripe event | Result | Notes |
|---|---|---|
| `payment_intent.succeeded` / `checkout.session.completed` | `revenue` ledger event | amount = minor units / 100; `idempotencyKey = stripe:<event.id>`; **requires `metadata.businessId`** — otherwise `ignored` |
| `charge.refunded` | `refund` reference | requires `metadata.businessId`; resolved to the original payment downstream |
| `customer.created` / `customer.updated` | `customer` mapping | upserted into the economic store |
| anything else | `ignored` with a reason | never guessed |

**Unknown stays unknown**: a payment without `metadata.businessId` cannot be
attributed to a Socio business, so it is ignored with a reason — it is never
silently credited.

## Idempotency (DB-enforced)

- Ledger events carry `idempotencyKey = stripe:<event.id>`.
- Migration `001_economic_truth` adds a partial **UNIQUE index** on
  `revenue_ledger (data->>'idempotencyKey')`.
- A redelivered webhook (same Stripe event id) is rejected — by the
  application pre-check and by the database (`23505` mapped to
  `ValidationError`). **Revenue is never double-counted.**
- Refunds carry `idempotencyKey = stripe-refund:<refund.id>` and additionally
  require `metadata.originalEventId` of a real, not-yet-refunded payment.

## Operation

1. Configure the webhook endpoint with the signing secret
   (`STRIPE_WEBHOOK_SECRET`).
2. On POST: verify signature → reject on failure.
3. Map the event → record ledger events via `RevenueLedger.record`.
4. Duplicates fail loudly; log them, do not swallow.

## Credentials policy

No personal credentials are stored in the repository. Secrets live in the
environment (`.env`, never committed). Integration tests use an ephemeral
Postgres container with throwaway credentials (`postgres:ephemeral_test`).
