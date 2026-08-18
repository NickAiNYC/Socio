# Pilot 001 — Deployment & Validation Checklist

One real business. One isolated environment. Stripe test mode first.
One governed intervention. One evidence report. Then the merchant decides.

**Architecture freeze:** no new subsystem gets built unless the pilot proves
it is necessary. No Kubernetes, microservices, queues, or another cloud
architecture — one isolated VPS + PostgreSQL is the entire pilot.

```
                  INTERNET
                     │ HTTPS
              Caddy / Nginx
          ┌──────────┴──────────┐
     Merchant API          Stripe Webhook
        :8787                   :8789
          └──────────┬──────────┘
                     ▼
                Growth OS
                     ▼
                PostgreSQL
          ┌───────────┼───────────┐
          ▼           ▼           ▼
       Revenue      Audit      Business
       Ledger       Trail        Twin
          │
          ▼
    Merchant Evidence Dashboard
```

## Infrastructure

- [ ] **Isolated host** — dedicated VPS for Socio only; nothing else on it
- [ ] **Firewall** — UFW: SSH + 80/443 only
- [ ] **HTTPS** — Caddy/Nginx terminating TLS for dashboard + webhook URL
- [ ] **PostgreSQL** — provisioned; migrations `001` + `002` applied
- [ ] **Backups** — scheduled `pg_dump` + **one restore test executed** (gate
      for any production Stripe events)

## Socio

- [ ] `DATABASE_URL` set on the host
- [ ] `MERCHANT_API_TOKENS` per business
- [ ] Stripe webhook secret set on the host
- [ ] Migrations 001 + 002 applied (idempotent re-run confirmed)
- [ ] **Production boot verification** — both servers fail-closed checks pass
      (merchant API :8787, webhook receiver :8789) and health endpoints answer

## Stripe — test mode first (hard gate)

- [ ] Webhook URL registered in Stripe → `https://<host>/api/webhooks/stripe`
- [ ] Signature verification — an invalid signature is rejected 401 and
      nothing is recorded
- [ ] Test payment → recorded on the ledger
- [ ] Duplicate webhook test → `200 duplicate`, no double-count
- [ ] Refund test → matched to the original payment
- [ ] **Complete lifecycle in test mode: payment → duplicate webhook → refund
      → evidence report**
- [ ] Only after the test-mode lifecycle passes: switch to live mode

## Merchant

- [ ] Business Twin created
- [ ] One real customer cohort
- [ ] One experiment
- [ ] One governed action
- [ ] One evidence report (the six questions, from real data)

## Product validation

- [ ] Merchant reviews the report
- [ ] Ask the only question that matters:
      **"Would you make a business decision based on this report?"**
- [ ] Capture the answer **verbatim**
- [ ] Triage the feedback: is the limitation **structural** (the pilot
      genuinely can't do what the business needs) or a **feature request**
      (nice-to-have)? Do not build what they request until it is classified.

## Hard gates

1. **No production Stripe events** until backups + rollback are verified
   (restore test passed) — this is financial data, not software testing
2. **Test mode full lifecycle passes before live mode** — payment → duplicate
   webhook → refund → report
3. **No merge to main** until the first real-world run completes —
   `feature/merchant-evidence-layer` stays the pilot branch
4. **No new subsystem** unless the pilot proves it necessary

## The real milestone

Not "does the code work?" — that's done and CI-verified. The milestone is:

> Does a business owner care enough about the evidence to change what they do?

If yes → build around that behavior. If no → find the actual wedge; do not
blindly add features.
