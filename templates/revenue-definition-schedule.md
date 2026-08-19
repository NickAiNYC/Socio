# Revenue Definition Schedule (DRAFT)

**Status:** DRAFT — required attachment to every Socio partnership agreement. No revenue-share contract without a signed schedule.
**Owner:** Nick / Socio. Grounded in `docs/revenue-attribution.md` doctrine: descriptive, never adjudicative; no claim without an evidence chain.

---

## 1. Eligible Revenue

- **Definition:** Completed, non-refunded, non-tax, non-tip sales, OR a mutually agreed alternative (e.g., gross profit on eligible sales) recorded in the merchant's POS/CRM/booking system during the agreement term.
- Socio's share is calculated on **incremental** revenue as defined in §4 — never on raw tracked receipts.

## 2. Attribution Window (by vertical & campaign type)

| Vertical | Default window | Notes |
|---|---|---|
| Aesthetic clinics / med spas | 30–90 days post-engagement | Consult-to-service conversion can take weeks; use longer window |
| Premium salons / wellness | 14–30 days | Rebooking cycles are short |
| Florists | 7–21 days | Event/gifting moments; seasonal spikes need baseline adjustment |
| Cafés | 7–14 days | High-frequency, low-ticket; window short, volume-based |

Campaign type modifies the window (SMS/WhatsApp blast = shorter; nurture sequence = longer). Both parties agree in writing per campaign plan.

## 3. Existing-Customer vs Net-New-Customer Rules

- **Net New:** a customer with no recorded transaction in the prior 12 months (or agreed lookback), who transacts after a Socio campaign.
- **Expansion/Existing:** a known customer who increases frequency or spend above their personal baseline after a campaign.
- Both count toward the incremental calculation ONLY via the baseline method in §4.

## 4. Baseline Methodology

- Baseline = modeled expected revenue for the cohort without Socio's intervention: prior-period trends, seasonality, local events, and category benchmarks.
- Where practical, a **holdout group** (random 10–20% of eligible cohort, unexposed) is measured; incremental = exposed group actuals − holdout/baseline actuals.
- Baseline and holdout design must be agreed **before** campaign launch. Post-hoc baselines are not accepted as evidence.
- Evidence levels per `docs/revenue-attribution.md`: factual → observational → correlational → attributional. Socio bills only on evidence ≥ correlational with adequate sample; attributional (RCT) earns the highest share tier.

## 5. Exclusions (never eligible)

- Refunds, cancellations, chargebacks, voided sales.
- Taxes, tips, gift-card purchases (redemptions count once, per agreed rule).
- Staff/family/owner transactions.
- Wholesale/B2B orders unless campaign targets them explicitly.
- Manually uploaded contacts without campaign touch evidence.
- Pre-existing booked appointments (booked before campaign start).
- Campaigns the merchant ran independently (merchant-owned channels) during the same window.
- Any transaction the merchant cannot produce a receipt/record for.

## 6. Discounts & Packages

- Discounted sales count at **net** value (post-discount), never gross list price.
- Packages/memberships: revenue recognized at point of sale, pro-rated if refunded.

## 7. Holdout Methodology

- Activates per campaign plan: random assignment, pre-registered, minimum sample (n per plan).
- Holdout results are reported in the monthly statement; they are the merchant's evidence that Socio's share is incremental.
- If holdout is impractical (small cohorts), baseline-only with a documented confidence grade, and a **lower share tier** applies.

## 8. Dispute Window & Evidence Standard

- Merchant may dispute any line within **14 days** of monthly statement.
- Evidence standard: campaign ID + identity resolution + POS receipt + exclusion check (per Attribution Protocol).
- Socio freezes the disputed amount until resolution. Both sides keep audit rights to the ledger.

## 9. Payment Frequency & Reconciliation

- Monthly, in arrears, via Stripe invoice. Statement shows: revenue influenced, revenue counted as incremental, baseline vs holdout, receipts matched, refund-adjusted revenue, Socio fee, merchant retained value, data-confidence score, next highest-value action.
- First invoice only after the agreed validation period (§11).

## 10. Commission Rate & Payment Timing

- Default: **10–15%** of verified incremental revenue.
- Hybrid tiers (where data quality permits):
  - **Lower share** (e.g., 10%) on verified retained/recovered revenue (baseline-comparable).
  - **Higher share** (e.g., 15%) on rigorously measured incremental revenue (holdout/attributional evidence).
- Floor: **minimum recoverable opportunity threshold** agreed per merchant (replaces any monthly retainer — aligns incentive without a labor-hungry zero-margin model).

## 11. Data-Readiness / Validation Period

- **Days 1–2:** Revenue Recovery Map delivered (sales wedge; free).
- **Days 3–30:** data validation — consent state, profile dedupe, POS mapping, baseline + holdout setup, first campaigns live.
- **Day 31+:** ongoing verified growth; commission accrues from validated campaigns only.

## 12. Merchant Obligations (for schedule to hold)

- Maintain data quality (dedupe, consent records, POS connectivity).
- Respond to leads within the agreed SLA; operational exceptions (slow follow-up, no-shows, stock gaps) are logged and excluded from Socio's performance attribution.
- No backdating, refund-forcing, or channel recoding designed to shift attribution.
