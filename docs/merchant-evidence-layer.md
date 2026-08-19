# Merchant Evidence Layer

The merchant-facing surface of the Growth OS economic truth layer. A merchant
opens Socio and gets direct, honest answers to six questions:

1. **What did Socio do?**
2. **What happened?**
3. **What revenue followed?**
4. **What can we actually attribute?**
5. **What can't we prove?**
6. **What should Socio do next?**

Everything rendered is computed from recorded Growth OS data. Nothing is
invented; empty stores render zeros, empty lists, and missing-hop notes.

## Architecture

```
Growth OS engine (engines/growth-os)
  ├─ business-twin / revenue-ledger / audit-trail / agent-governor
  ├─ experiment-engine / economic-store
  ├─ economic/attribution.mjs   (evidence ladder)
  └─ economic/economic-trace.mjs (chain reconstruction)
          │
          ▼
merchant/evidence-report.mjs   (six-question report builder)
          │
          ▼
merchant/merchant-api.mjs      (read-only HTTP API, token auth, isolation)
          │
          ▼
website/merchant-evidence.html (dashboard UI)
```

## Screens

The dashboard (`website/merchant-evidence.html`) is a single page with
anchor sections:

| Section | Answers | Content |
|---|---|---|
| **Overview** | All six at a glance | Six KPI cards: actions, net revenue, revenue events, attributable records, unknown records + unattributed $, experiments + pending approvals |
| **Actions** | What did Socio do? | Table of governed, audited actions: time, agent, action type, status, proposal id |
| **Revenue** | What happened? | Metric cards (gross, net, cost, refunds, ROI, events) + chronological revenue/refund event table with per-event source. ROI is labeled with its formula: `(net revenue − attributed cost) ÷ cost` |
| **Attribution** | What can we attribute / what can't we prove? | Two panels: evidence-based records (attribution green / correlation amber, level label, claim, statistical result, evidence hops) and unknown records (observation) + unattributed revenue; methodology ladder below |
| **Experiments** | What should Socio do next? | Learnings summary, experiment cards (hypothesis, status, decision, observations), pending approvals awaiting merchant decision |
| **Audit** | Can the chain be verified? | Audit entries table + "Verify audit chain" button that runs real hash-chain verification and reports VALID or BROKEN with broken-link reasons |
| **System** | Is Stripe real? Is health real? | Stripe connection state (connected / configured / disconnected) with reason, events received, persistence backend, system health |

Configuration bar (header): API base URL, businessId, and optional bearer
token (session memory only — never persisted to localStorage).

## API endpoints

Read-only JSON API served by `engines/growth-os/merchant/merchant-api.mjs`.
Default bind `127.0.0.1:8787` (override `MERCHANT_API_PORT` /
`MERCHANT_API_HOST`).

| Method | Path | Returns |
|---|---|---|
| GET | `/api/health` | liveness: service, status, time |
| GET | `/api/merchant/:businessId/evidence` | full six-question report |
| GET | `/api/merchant/:businessId/actions` | what did Socio do (audit entries) |
| GET | `/api/merchant/:businessId/revenue` | metrics + byCurrency + revenue events |
| GET | `/api/merchant/:businessId/attribution` | attributable + notProvable + methodology |
| GET | `/api/merchant/:businessId/experiments` | experiments + learnings |
| GET | `/api/merchant/:businessId/approvals` | governor approval registry + status counts |
| GET | `/api/merchant/:businessId/audit` | business audit entries + verify result |
| POST | `/api/merchant/:businessId/audit/verify` | real hash-chain verification result |
| GET | `/api/merchant/:businessId/system` | stripe state + system health |

There are no mutation endpoints on the reporting API. The layer is read-only
by design.

### Stripe webhook receiver (pilot wiring)

`engines/growth-os/merchant/stripe-webhook-endpoint.mjs` — separate server,
default `127.0.0.1:8789`, one public route:

| Method | Path | Purpose |
|---|---|---|
| POST | `/api/webhooks/stripe` | ingest Stripe events (signature-verified) |
| GET | `/api/health` | liveness |

- Every payload requires a valid `stripe-signature` header
  (`verifyStripeSignature`, timing-safe, 5-minute replay window); invalid →
  401, nothing recorded.
- Fails closed: no `STRIPE_WEBHOOK_SECRET` → 503; boot refuses to start.
- Idempotent: revenue events are keyed on the **payment intent**
  (`stripe:pi:<paymentIntentId>`), so `payment_intent.succeeded` and
  `checkout.session.completed` for the same payment collapse to one ledger
  record, and redelivery returns `200 duplicate` — never double-counted.
- Refunds are matched to the original payment by `paymentIntentId`;
  `charge.refunded` carries a **cumulative** `amount_refunded`, so the receiver
  records only the incremental delta over refunds already on the ledger.
  Partial refunds accumulate exactly; resending the same refund state is
  `200 duplicate`; the total can never exceed the original payment. A missing
  original is ignored with a reason.
- Events without `metadata.businessId` are ignored with a reason — unknown
  stays unknown.
- Put nginx/caddy in front for HTTPS; point Stripe at
  `https://<host>/api/webhooks/stripe`.

## Data sources

Every field in the report is pulled from a recorded Growth OS store:

| Report section | Source | Realness guarantee |
|---|---|---|
| Actions | `audit-trail.mjs` log entries (hash-chained, append-only) | only entries logged by a governed execution |
| Metrics | `revenue-ledger.mjs` `calculateMetrics()` | computed from immutable ledger events |
| Revenue events | `revenue-ledger.mjs` `getByBusiness()` | idempotency-keyed, duplicate-rejected |
| Attribution records | `economic-store.mjs` + `attributeRevenue()` | ladder-enforced (fact/observation/correlation/attribution) |
| Experiments | `experiment-engine.mjs` | real lifecycle (DRAFT → RUNNING → PROMOTED/KILLED) |
| Approvals | `agent-governor.mjs` durable approval registry | proposed through the real Governor |
| Stripe state | env secret + ledger events with `source: 'stripe'` | connection only claimed when events actually recorded |
| Audit verification | `audit-trail.mjs` `verifyChain()` | recomputes every SHA-256 hash from canonical content |

## Attribution language

The report uses the evidence ladder from `docs/economic-truth-model.md`
verbatim — never blurred:

- **FACT** — recorded event (timestamped, source-identified)
- **OBSERVATION** — aggregate computed from facts
- **CORRELATION** — statistical association at adequate sample size
- **ATTRIBUTION** — designed experiment + control group + adequate sample +
  significant positive lift
- **CAUSATION** — never claimed automatically (reserved)

Unknown stays unknown. A revenue event with no customer mapping, no experiment
assignment, or insufficient samples is reported under **What can't we prove?**
with the literal reason (`unknown attribution — …`). Revenue on the ledger
with no attribution record is reported as **unattributed** and explicitly
"not claimed by any intervention."

Confidence is never displayed as a naked probability. Evidence-based records
show a level label ("Experimental attribution" / "Correlational evidence") and
the recorded statistical result — verdict, delta, approximate p, and group
sizes — drawn from the attribution record's correlation hop. A high
`confidence` value (1 − p) is a property of the statistical test, not a
probability that Socio caused the revenue.

## Authorization model

- Per-business bearer tokens: `MERCHANT_API_TOKENS={"businessId":"token"}`.
  **Required in production**: when `DATABASE_URL` is set, the server refuses
  to boot without tokens (fail closed). Every merchant request must present
  `Authorization: Bearer <token>` (401 otherwise).
- **Business isolation is server-side**: the token binds the caller to one
  businessId; requesting a different business in the path returns 403 *before
  any data is assembled*. All reads are additionally scoped by businessId at
  the repository boundary (`findByBusiness` / `getByBusiness` / SQL
  `data->>'businessId'` filters).
- Token-less operation is allowed only in explicit in-memory dev mode
  (`GROWTH_OS_ALLOW_MEMORY=true`, binds 127.0.0.1, logs `tokens: DISABLED`).
- CORS: `MERCHANT_API_CORS_ORIGIN` (default `*` — set explicitly before any
  non-local deployment).
- Fail-closed boot: `DATABASE_URL` is required unless
  `GROWTH_OS_ALLOW_MEMORY=true` (explicit in-memory test mode). The server
  exits otherwise.

## Empty states

Honest by construction — the report builder returns zeros and empty arrays,
never fabricated fallback numbers:

- No actions → "No governed actions yet"
- No revenue → `$0` metrics, "No revenue events on the ledger yet"
- No attribution → "No evidence-based attribution records yet — nothing is
  being claimed as caused by Socio"
- No experiments → "No experiments yet"
- No pending approvals → "No pending approvals"
- Missing twin → `missing: ['business_twin']` in the trace
- Stripe not configured → `disconnected` with reason
- Learnings → "no attribution evidence yet"

## Limitations

- **Causation is never claimed.** Even at attribution level, the report says
  "attribution-level evidence, still not causation."
- **Audit verification is in-place tamper detection**, not cryptographic
  proof: no signatures, no Merkle root, no external anchoring. `verifyChain()`
  recomputes the SHA-256 chain and reports broken links.
- **Stripe "connected" requires proof**: a configured webhook secret plus at
  least one stripe-source event on the ledger. A secret with zero events is
  `configured`, explicitly "not proven end-to-end."
- **No live polling** in the API; each request reads current state from the
  shared Growth OS stores.
- **Mixed currencies** are never silently summed: primary-currency totals are
  labeled and the full per-currency breakdown is exposed via `byCurrency`.
- **In-memory mode** (`GROWTH_OS_ALLOW_MEMORY=true`) loses data on restart;
  production must run against Postgres.
