# Pilot 001 — Readiness Checklist

One real merchant. One real Stripe account. One governed experiment.
One evidence report. Then the merchant decides.

**Architecture freeze:** no new subsystem gets built unless the pilot proves
it is necessary. The next code written is driven by a real merchant hitting a
real limitation.

## Infrastructure

- [ ] **Production Postgres** — provisioned; `DATABASE_URL` set on the host;
      migrations `001_economic_truth` + `002_merchant_evidence` applied
- [ ] **Backups** — scheduled dump, one restore test documented
- [ ] **HTTPS** — TLS in front of the merchant dashboard and webhook endpoint
- [ ] **Merchant authentication** — `MERCHANT_API_TOKENS` per business; a
      token for one business cannot read another (verified with a 401/403 test)
- [ ] **Stripe webhook endpoint** — public HTTPS URL that receives Stripe
      events. ⚠️ GAP: `economic/stripe-webhook.mjs` has signature verification
      + conservative event mapping, but the HTTP receiver that calls them does
      not exist yet. This is pilot-necessary wiring, not a new subsystem.
- [ ] **Webhook signature verification** — `verifyStripeSignature` enforced
      (timing-safe, replay window) on every received event
- [ ] **Monitoring/logging** — structured logs for API + webhook + ledger;
      uptime check on the dashboard
- [ ] **Error alerting** — webhook failures, ledger rejects, and API 500s
      reach a human (email/webhook channel)
- [ ] **Rollback procedure** — documented: revert commit on the branch + DB
      restore path; tested once

## Functional test pass (real data, no fixtures)

- [ ] **One test transaction** — a real Stripe payment reaches the ledger
      (idempotent: a redelivered event does not double-count)
- [ ] **One test refund** — maps to the original payment; a second refund of
      the same payment is rejected
- [ ] **One governed action** — propose → approve → execute → audit entry,
      chain verifies
- [ ] **One evidence report** — the dashboard renders the six questions from
      the merchant's real data: what Socio did, what happened, what revenue
      followed, what we can attribute, what we can't prove, what's next

## Merchant acceptance criteria

- [ ] Merchant opens the dashboard and reads the report without guidance
- [ ] Merchant's verdict on the one question that matters:
      **"Would you make a business decision based on this report?"**
  - YES → the product hypothesis is real; iterate on what the merchant
    actually used
  - NO / "technically impressive, but I don't care" → equally valuable; learn
    what they need, do not build more until the gap is specific

## Pilot 001 runbook

1. Deploy `feature/merchant-evidence-layer` to the isolated pilot host
2. Provision Postgres, set `DATABASE_URL`, run migrations
3. Set `MERCHANT_API_TOKENS` for the merchant's businessId
4. Configure the Stripe webhook secret on the host + endpoint in Stripe
5. Connect the merchant: create their business twin
6. Let real Stripe events flow; watch the ledger
7. Run one governed experiment
8. Generate the evidence report
9. Put it in front of the merchant
10. Ask the acceptance question — record the answer verbatim

## Definition of done for Pilot 001

- [ ] All infrastructure checkboxes ticked
- [ ] All functional test-pass checkboxes ticked with real output
- [ ] Merchant verdict recorded verbatim
- [ ] No new subsystem added during the pilot
