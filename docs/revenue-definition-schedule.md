# Revenue Definition Schedule — Signed Merchant Contract

> **Purpose:** This document defines — in writing, signed by both parties —
> exactly what counts as eligible revenue, how it is measured, what is
> excluded, and how disputes are resolved. Socio's evidence reports apply this
> schedule mechanically to the ledger. **"Verified" means incremental: revenue
> this schedule does not authorize is never claimed.**
>
> Template version: 1.0 · Engine validation: `merchant/revenue-schedule.mjs`

---

## 1. Parties

| | |
|---|---|
| **Merchant** | Name: ______________________  ·  DBA: ______________________ |
| | Address: ______________________  ·  POS/CRM system: ______________________ |
| **Socio NYC** | Contact: ______________________  ·  Engagement start: ______________________ |

## 2. Definitions

- **Eligible revenue** — gross payment amounts actually received by the
  Merchant from customers, recorded on the Revenue Ledger with a
  `businessId` matching this schedule.
- **Attribution window** — the period after a governed, executed action
  during which resulting revenue may be counted.
- **Incremental revenue** — eligible revenue, within the attribution window,
  with an attribution record at **correlation level or higher** (evidence
  ladder: fact → observation → correlation → attribution). Correlation-level
  revenue is reported as such, never as causation.
- **Baseline** — the counterfactual: revenue that would have happened without
  Socio. Applied only when the required history demonstrably exists.

## 3. Eligible Revenue & Attribution Window

- [ ] Attribution window: **______ days** after a governed action
  (`attributionWindowDays`).
- [ ] Revenue sources accepted: [ ] Stripe payments [ ] POS (Square/Shopify/Toast)
  [ ] Manual import (itemized, with receipts) [ ] Other: ______________

## 4. Baseline Methodology (choose one)

- [ ] **Trailing 12 months** — baseline = 12-month trailing average of the
  Merchant's recorded revenue; incremental = observed − baseline.
- [ ] **Trailing 6 months** — same, over 6 months.
- [ ] **Holdout control** — a random, unexposed control group of customers
  (holdout %: **______%**); incremental = treatment lift over control.
- [ ] **None** — no baseline adjustment (small or highly seasonal merchants).

> The engine stores the chosen methodology but **only applies it when the
> required history actually exists** (`baselineApplied: false` with a note
> otherwise). A baseline is never invented.

## 5. Exclusions (mark all that apply)

Revenue from the following is **never** counted as incremental:

- [x] Refunds & chargebacks
- [ ] Gift card / store credit purchases
- [ ] Pre-existing bookings (made before the engagement)
- [ ] Manually imported contacts/revenue (without receipts)
- [ ] Voids and fee-only transactions
- [ ] Tax-only transactions
- [ ] Other: ______________________

## 6. Holdout Methodology

- [ ] Holdout group used: **______%** of customers (randomized, unexposed to
      Socio interventions), assignment recorded in the Economic Store.
- [ ] No holdout (baseline method above does not require one).

## 7. Dispute Window & Process

- Dispute window: **______ days** after the Verified Growth Statement is
  delivered (`disputeWindowDays`).
- The Merchant may dispute any line item with supporting records; Socio must
  re-run the report against the ledger and respond within 5 business days.
- Commission due on disputed revenue is held until resolution.

## 8. Payment Frequency & Commission

- [ ] Payment frequency: [ ] monthly [ ] weekly [ ] quarterly
- Commission rate: **______%** of **incremental** revenue (never on excluded
  or baseline revenue).
- Commission invoicing requires a governed approval (executed action whose
  proposal payload declares `allowedEventTypes` + `maxAmount`) — see
  `workflows/commission-calc.yaml`.

## 9. Verified Growth Statement

Monthly, Socio delivers a statement built from the Merchant Evidence report
containing at minimum: eligible revenue, excluded revenue (with reasons),
incremental revenue, baseline note, attribution records, and the audit-chain
verification result. The statement contains **no fabricated numbers** — empty
stores render zeros.

## 10. Signatures

| Merchant | Socio NYC |
|---|---|
| Name: ______________________ | Name: ______________________ |
| Signed: ______________________ | Signed: ______________________ |
| Date: ______________________ | Date: ______________________ |

---

## How this is enforced in the engine

1. `validateSchedule()` (`merchant/revenue-schedule.mjs`) rejects any schedule
   missing a required field or naming an unknown exclusion — a malformed
   contract cannot be stored.
2. `saveSchedule()` writes the validated contract (id = businessId) through a
   governed path; the public Merchant API is read-only.
3. `computeIncrementality()` applies exclusions + attribution window to the
   ledger at report time and exposes `excludedRevenue`, `eligibleRevenue`,
   `incrementalRevenue`, and `baselineApplied`.
4. The Merchant API surfaces the schedule at
   `GET /api/merchant/:businessId/schedule` and inside every evidence report.
