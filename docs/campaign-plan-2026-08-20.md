# Socio NYC — Campaign Brief: "Zero a Cinco" Founding Pilot Sprint
**Prepared:** August 20, 2026 · Owner: Nick

**One assumption stated up front, since no budget/timeline was specified:** this plan uses the timeline and kill-gate thresholds already committed to in `docs/phase-3-gtm-playbook.md` (Gate 1 = Day 45, Gate 2 = Day 90) and treats today, Aug 20, 2026, as Day 0. Budget is treated as near-$0 cash / founder-time-funded, since that's the model the business itself is selling to contractors — flagged with actual line items in Section 8 rather than left blank.

---

## 1. Campaign Overview

**Campaign name:** Zero a Cinco (Zero to Five) — Founding Pilot Sprint

**One-sentence summary:** A 45-day, WhatsApp-and-permit-data-driven push to sign 5 founding Spanish-speaking NYC general contractors to Socio's zero-upfront commission model, then prove real value with 3 bank-verified deposits by day 90.

**Primary objective:** Sign 5 founding contractors to a pilot agreement by **Day 45 (Oct 4, 2026)**, hitting the ≥30% scan-to-pilot conversion rate defined as Gate 1 in the existing GTM playbook.

**Secondary objectives:**
- Reach 3 of 5 pilots generating at least one bank-cleared deposit in QuickBooks by **Day 90 (Nov 18, 2026)** — Gate 2.
- Reactivate at least 20 "dead lead" contacts across the signed cohort's own legal pads, generating a provable revenue story with zero net-new ad spend.
- Establish 2+ live supply-house referral relationships (Kamco, Feldman, Dykes, or Cancos) as an ongoing distribution channel beyond the sprint window.

---

## 2. Target Audience

**Primary segment:** Solo and small-crew Spanish-speaking general contractors and renovation firms in Sunset Park, Park Slope-adjacent Brooklyn, Queens (Astoria/LIC), and the Bronx, typically running $10K–$50K residential jobs (kitchens, bathrooms, brownstone facades). They drive between job sites, answer their own phones inconsistently, and keep estimates on a paper pad rather than in a CRM.

**Secondary segment:** Pro-desk managers and counter reps at NYC building-material suppliers (lumber, tile, drywall) who see these same contractors daily and are trusted by them in a way no outside marketer is.

**Pain points and motivations:** Lost bids from slow callback times (documented at >15 min average response cost); burned once or more by pay-per-lead marketplaces (Angi/Thumbtack) or retainer marketing agencies (Orbis Advisers-type competitors) that took money with no guarantee; cash-flow-constrained, so anything requiring money before results is a hard no.

**Where they spend time:** WhatsApp (primary — not email, not a web portal), physical supply houses/pro-desks, word of mouth within the same trade/church/family network, Google Business Profile (as a searched-for entity, not an actively managed one).

**Buying stage:** Mostly unaware a zero-risk alternative exists; several have tried and rejected the awareness-stage options (Angi, agencies) already, which puts them at a jaded "prove it" consideration stage rather than a cold-awareness one. Messaging needs to open with risk reversal, not feature education.

---

## 3. Key Messages

**Core campaign message:** *"No le cobramos nada hasta que a usted le paguen."* — We don't get paid until you do.

**Supporting messages:**
1. **Dead-lead reactivation, not cold prospecting.** "Reactivamos los clientes que usted ya tiene, no le vendemos contactos nuevos que no conoce." Proof point: the 15-minute dead-lead call script already converts on the premise that 2 of 10 dormant leads = $60K in "found" revenue.
2. **We watch NYC permits so you don't have to.** DOB/HPD/LPC filing data flags new work before competitors know it exists. Proof point: live Socrata query already built against NYC OpenData (`72h-pilot-acquisition-sprint.md`).
3. **No contract, no cancellation penalty, no shared leads.** Direct contrast to Angi's 12-month lock-in and 3–8-way lead-sharing. Proof point: 1-page pilot agreement, zero dollars owed if the client doesn't pay.
4. **We show up where you already are.** WhatsApp-native, Spanish-first, no app or dashboard to learn. Proof point: existing 3-touch WhatsApp sequence with quiet-hours and touch-cap governance already built.

**Message hierarchy for cold touch 1:** (1) you're losing bids you don't know about → (2) here's a free 1-page proof (Escaneo de Fugas) → (3) we only get paid when you do → (4) reply for your free scan.

**Channel tone variations:** WhatsApp = warm, informal "Don [Nombre]" register, voice-note-friendly. Supply-house pitch = fast, transactional, incentive-forward (60-second counter pitch already scripted). Any future public content (GBP posts, before/afters) = proof-forward, no hard sell.

---

## 4. Channel Strategy

| Channel | Why It Fits | Format | Effort | Budget |
|---|---|---|---|---|
| **WhatsApp direct outreach (owned)** | This is where the buyer actually lives; email and web forms are proven dead ends for this audience | 3-touch text/voice-note sequence, human-approved Touch 1 | High (manual, founder-led in weeks 1–2) | ~$0 (Twilio/Meta WhatsApp Business API usage fees only, est. <$50 for sprint volume) |
| **DOB/HPD/LPC permit radar (owned data)** | Surfaces genuinely new, unassigned work before the contractor's competitors see it — a real trust-earning hook, not just a lead list | Automated Socrata query feeding WhatsApp Touch 1 targeting | Medium (already built, needs daily run) | $0 — NYC OpenData is free |
| **Supply-house pro-desk referrals (earned/physical)** | Highest-trust channel available; a card handed over by a counter rep the contractor already trusts converts skepticism no cold message can | In-person 30–60s pitch, QR referral cards, 1% cash kickback on cleared deposits | Medium (4 target locations already identified) | ~$100–150 (printed cards + kickback float for first closes) |
| **Escaneo de Fugas PDF (content asset)** | Free, no-upfront-cost proof point that de-risks the very first ask | 1-page branded PDF, Spanish-first | Low (already built — leak-scan API + printable scorecard exist) | $0 |
| **Dead-lead reactivation (owned, post-signup)** | Fastest path to a provable, bank-verified win once a contractor is signed — doesn't require new customer acquisition at all | WhatsApp message to the contractor's own dormant client list | Medium (per-signed-contractor effort) | $0 |
| **Google Business Profile audit (owned, supporting)** | Cheap proof point inside the leak-scan pitch; also the contractor's most-neglected owned asset | Score + 3 quick fixes as part of the Escaneo de Fugas | Low | $0 |
| **Paid ads / SEM / social ads** | **Not recommended for this sprint.** Zero pilots signed yet, zero case studies to point ads at, and paid acquisition contradicts the zero-risk story being sold — spend nothing here until Gate 2 is real | — | — | $0 (deliberately excluded — revisit post-Gate-2) |

---

## 5. Content Calendar (Day 0 → Day 45)

| Week | Content/Action | Channel | Owner/Notes | Status |
|---|---|---|---|---|
| **Week 1** (Aug 20–26) | Pull first 10–20 DOB/HPD hits (Queens + Bronx, ≥$30K, unassigned GC); send Touch 1 personally, by hand, from Nick's own WhatsApp — not an agent | WhatsApp + DOB radar | Nick, founder-led per prior guidance: first 100 messages matter more than the 12th agent config | Not started |
| **Week 1** | Visit 2 of the 4 target supply houses (Kamco LIC, Feldman Bushwick) with printed referral cards; deliver 60-second counter pitch | Physical/supply-house | Nick | Not started |
| **Week 2** (Aug 27–Sep 2) | Send Touch 2 to Week 1 non-responders; visit remaining 2 supply houses (Dykes, Cancos); collect first "dead lead" legal pad photo from any warm reply | WhatsApp + physical | Nick | Not started |
| **Week 2** | Stand up simple tracking (spreadsheet or the pilot-dashboard API) for scans delivered → replies → pilots signed, since Gate 1 is measured on this ratio | Internal | Nick | Not started |
| **Week 3** (Sep 3–9) | Send Touch 3 (call-booking + DOB guide) to remaining non-responders; run the 15-minute Dead Lead Closing Protocol call with any warm lead; target: first pilot agreement signed | WhatsApp + phone | Nick | Not started |
| **Week 4** (Sep 10–16) | Pull second DOB/HPD batch (Brooklyn added); repeat Touch 1–3 cadence on new batch; begin onboarding photo-intake for any signed pilot | WhatsApp + DOB radar | Nick (consider handing Touch 1 drafting, not sending, to SNIPER once the human-approved cadence is proven) | Not started |
| **Week 5** (Sep 17–23) | Mid-sprint checkpoint: compare actual scan→pilot conversion against the 30% Gate 1 threshold; if trending under, reprice or shift channel mix per the playbook's own kill-gate action rather than push harder on a channel that isn't converting | Internal review | Nick | Not started |
| **Week 6** (Sep 24–30) | Final push on any warm-but-unsigned leads from weeks 1–4; second supply-house follow-up visit to check on referral card distribution and any contractor sign-ups from that channel | WhatsApp + physical | Nick | Not started |
| **Week 6–7** (Oct 1–4) | **Day 45 — Gate 1 checkpoint.** Confirm 5 pilots signed at ≥30% conversion, or trigger the documented `KILL_GATE_FAILED` action (reprice offer or change acquisition channel) | Internal | Nick | Not started |
| **Weeks 7–13** (Oct 5–Nov 18, stretch) | For each signed pilot: run dead-lead reactivation, monitor QuickBooks for first cleared deposit, publish first case study the moment Gate 2's first deposit clears | WhatsApp + internal | Nick | Not started |

*20% of this calendar is intentionally left flexible — a supply-house rep asking for a second visit, or a contractor replying at an unplanned moment, should be prioritized over sticking rigidly to the week's plan.*

---

## 6. Content Pieces Needed

| Asset | Description | Priority | Status |
|---|---|---|---|
| Escaneo de Fugas PDF template | 1-page Spanish-first leak-scan scorecard, populated per-contractor from the GBP + response-latency + follow-up scoring model | Must-have | **Already built** (`/api/construction/gtm/leak-scan`) |
| WhatsApp Touch 1/2/3 scripts | Personalized with `{{ownerName}}`, `{{companyName}}`, `{{borough}}` variables | Must-have | **Already built**, needs live variable-fill testing on first real batch |
| 1-page pilot agreement | Zero-cost entry, 50%-discount commission terms, deposit-trigger clause | Must-have | **Already built** (`socio.nyc/pilot-agreement`) |
| Printed supply-house referral cards (QR + kickback terms) | Physical card for pro-desk handoff, referral-tagged QR code | Must-have | Needs printing — not yet produced physically |
| Dead-lead reactivation message template | Sent by "María" as the contractor's own secretary, not as Socio | Must-have | **Already built**, needs first live test |
| Simple conversion tracker (scans → replies → pilots) | Spreadsheet or dashboard view against Gate 1's 30% threshold | Must-have | Not yet stood up — needed by Week 2 |
| First case study / before-after | Real pilot outcome, Spanish + English | Nice-to-have (blocked until Gate 2) | Not started — do not fabricate ahead of real data |
| GBP quick-fix one-pager | 3 concrete fixes bundled into the leak-scan hand-off | Nice-to-have | Not started |

---

## 7. Success Metrics

**Primary KPI:** 5 signed pilot agreements by Day 45, at ≥30% scan-to-pilot conversion (Gate 1, as already defined).

**Secondary KPIs:**
- Touch 1 → reply rate (track weekly; a rate near zero by Week 3 is the earliest real signal something in message, targeting, or channel needs to change)
- Number of DOB/HPD permits scanned and contacted per week (targets pipeline volume, not just conversion)
- Number of supply-house referral cards distributed and QR scans generated
- Number of dead-lead lists collected from warm replies, and reactivation close rate within those lists (2 of 10 is the number used in the existing call script — track actual vs. that assumption)
- Day-90 stretch metric: 3 of 5 pilots with a bank-cleared deposit (Gate 2)

**Tracking:** Manual spreadsheet or the existing `GET /api/construction/gtm/pilot-dashboard` endpoint if stood up in time; QuickBooks Online for deposit verification (already a hard requirement per the pilot-readiness checklist — no revenue claim without a ledger-backed FACT, per the Economic Truth Model).

**Reporting cadence:** Weekly self-review every Friday against the calendar above; a formal Gate 1 review on Day 45 with an explicit go/reprice/re-channel decision, not a soft extension.

---

## 8. Budget Allocation

No paid acquisition budget — the entire model depends on $0 cost until a deposit clears, so paying for ads before that's proven would undercut the pitch. Actual cash needed for this sprint is small:

| Line Item | Estimate |
|---|---|
| Twilio/Meta WhatsApp Business API messaging fees | ~$30–50 for sprint volume (est. 40–60 contractors × 3 touches) |
| Printed supply-house referral cards (4 locations × ~50 cards) | ~$75–100 |
| Pro-desk 1% cash-kickback float (first 2–3 closes, $400–1,200 each) | ~$800–3,600, paid only after a deposit clears — self-funding, not upfront |
| Contingency | ~$50 |
| **Total upfront cash needed** | **~$150–200** before any pilot closes |

No content-production, events, or tooling line items — the assets already exist in the repo and need distribution, not creation.

---

## 9. Risks and Mitigations

**Risk: solo-founder execution doesn't scale past a handful of contractors per week.** Manual, hand-sent Touch 1 messages are the right move for trust-building in Weeks 1–3, but won't cover enough volume alone by Week 4–6. *Mitigation:* only hand Touch 1 drafting (never unsupervised sending) to the SNIPER agent once the human-run cadence proves what actually gets replies — this matches the existing "architecture freeze" rule of not automating before a channel is proven.

**Risk: contractor skepticism kills reply rates before the zero-upfront message lands.** Every competitor category researched (Angi, Thumbtack, retainer agencies) has already burned this exact buyer once. *Mitigation:* lead every first touch with the free, no-obligation Escaneo de Fugas rather than an ask, and lean harder on supply-house referrals (trusted third party) over cold DOB outreach where reply rates are weaker.

**Risk: WhatsApp Business API compliance violation (spam flags, account suspension) from over-messaging.** *Mitigation:* the existing 7am–7pm EST quiet-hours gate, 3-touch cap, and human-approval-on-Touch-1 rule are already built — do not bypass them for volume, even under Gate 1 time pressure.

**Risk: Gate 1 conversion comes in under 30% by Day 45.** *Mitigation:* this isn't treated as failure requiring more of the same — the playbook already defines the correct response as `KILL_GATE_FAILED`, triggering a repriced offer or a channel change, decided at the Day 45 checkpoint rather than drifting past it.

---

## 10. Next Steps

1. **Today:** pull the first DOB/HPD batch (Queens + Bronx, ≥$30K, unassigned) and send Touch 1 to 10 contractors personally, by hand.
2. **This week:** print the first batch of supply-house referral cards and visit Kamco (LIC) and Feldman (Bushwick) in person.
3. **By end of Week 2:** stand up the scan → reply → pilot conversion tracker — Gate 1 can't be evaluated without it.
4. **Day 45:** hold the Gate 1 checkpoint as a hard decision point, not a soft check-in — go, reprice, or re-channel.

---

Would you like me to:
- Draft the actual DOB-batch outreach list and personalize the first 10 Touch 1 messages?
- Build the conversion tracker (spreadsheet or lightweight dashboard) needed by Week 2?
- Turn the printed referral card into an actual print-ready design?
- Adjust this plan for a different timeline or add a paid-acquisition phase for after Gate 2?
