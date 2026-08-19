# Vertical Discovery Sprint — 14 Days

> Status: READY TO RUN (engineering gates passed 2026-08-19)
> Owner: Nick. System: `~/Desktop/socio` branch `feature/merchant-evidence-layer`.
> Doctrine: the call is reality. Every number below is a decision input, never a deliverable.

## 1. Why this sprint exists

Four clean, comparable acquisition cells → observed merchant language, leak patterns,
objections, software stacks, and conversion behavior → THEN the dedicated vertical page.
No vertical page, no retainer pitch, no paid spend until a cell clears both gates.

**Offer lock (identical across all four cells — do not alter):**

> Run the 3-minute Revenue Leakage Index. Get a directional diagnosis first.
> Socio only earns on verified growth after a data connection and baseline validation.

Headline, scoring, booking logic, and results-page methodology are identical between
cells. The ONLY deliberate variable is vertical-specific framing and the prefilled
vertical route.

## 2. The four cells

| Cell | Vertical route | Message |
|---|---|---|
| A | `/recovery-index?vertical=aesthetic-clinic` | "Find the high-intent consults and returning clients your team is losing." |
| B | `/recovery-index?vertical=salon-wellness` | "Find the rebooking and repeat-visit revenue leaking from your customer base." |
| C | `/recovery-index?vertical=florist` | "Find the recurring gifting and event revenue sitting in your past customer list." |
| D | `/recovery-index?vertical=cafe` | "Find the loyalty, catering, and repeat-order demand your business has not recovered." |

### UTM discipline (mandatory)

Every link you send carries UTM so the Vertical Decision Dashboard can slice cleanly:

```
?vertical=<route>&utm_source=<source>&utm_medium=<channel>&utm_campaign=cell_<a|b|c|d>
```

- `utm_source` ∈ `founder_email`, `founder_linkedin`, `founder_dm`, `warm_partner`, `neighborhood_group`
- `utm_medium` ∈ `email`, `linkedin`, `dm`, `referral`, `event`
- `utm_campaign` ∈ `cell_a`, `cell_b`, `cell_c`, `cell_d` (never mix cells into one campaign)
- Test links you send yourself MUST carry `is_test` only if submitted via admin key —
  see §6. Real merchant outreach never uses the test flag.

## 3. Distribution plan (owned and high-intent first — no paid spend)

1. **Target list: 75–100 NYC operators per vertical.** Build per cell:
   - A: aesthetic clinics / med spas in Manhattan + Brooklyn (Google Maps + DCA license search)
   - B: salons / premium wellness (NYC, ZIP-scoped)
   - C: florists (NYC, event + delivery focus)
   - D: cafés / hospitality (NYC, loyalty + catering potential)
   Sources: Google Maps vertical search, NYC DCA/Socrata business registry, Yelp categories,
   Instagram location tags. Record: business name, neighborhood, owner/manager name,
   software stack if visible (Square/Clover/Toast/Mindbody/Vagaro/FloristWare), one
   observable business-model trait (the personalization hook).

2. **Founder-led short outreach — never a mass campaign.** One personalized
   observation from their business model, then the Index link. Templates in §4.
   Cadence: 20–30 personalized touches/day total, ~5–7 per cell. No auto-send:
   every message is individually reviewed by Nick.

3. **LinkedIn: one vertical-specific teardown or "revenue leak" observation per
   category** (4 posts over the sprint, one per cell). Drafts in §5.

4. **Warm channels** (activate in this order):
   - POS implementers / resellers (Square, Clover, Toast partners in NYC)
   - Clinic consultants (aesthetic practice consultants, med-spa group operators)
   - Salon-suite operators (Solace-style suites, booth-rental owners)
   - Commercial brokers (retail leases — they see revenue at risk)
   - Neighborhood business groups / merchant associations (BNAs, chambers)
   - Local operators already in your network
   The Index is the assessment artifact in every conversation — not a URL you drop.

5. **SMS: do not blast.** Marketing texts require documented consent and clear
   opt-out handling. A phone submitted in a form is not blanket permission.
   Follow `docs/sms-compliance-runbook.md`. Text only existing consent-verified
   relationships, with STOP handling, and log consent timestamps.

## 4. Founder-led outreach templates (per cell)

Structure: observation → evidence → Index link → low-friction ask. 3–5 sentences max.

**Cell A — aesthetic clinic / med spa**
> Hi {First}, noticed {Clinic} runs {Mindbody/Vagaro + Instagram DM consults}. Most
> med spas at your volume have 20–40% of consult requests going cold past 24h and
> no rebooking loop for returning clients. I built a 3-minute Revenue Leakage Index
> that shows exactly which leak is costing you first — {link with UTM}. Directional
> diagnosis, no pitch. Worth 3 minutes?

**Cell B — salon / premium wellness**
> Hi {First}, saw {Salon} books via {Booksy/Vagaro} and keeps a waitlist. The pattern
> we see at your ticket size is rebooking and repeat-visit revenue leaking — clients
> who come once and never schedule again. Run the 3-minute Revenue Leakage Index and
> see your biggest leak ranked {link with UTM}. Directional first; Socio earns only on
> verified growth after a data connection.

**Cell C — florist**
> Hi {First}, noticed {Shop} does {weddings/events/corporate}. Florists typically lose
> recurring gifting and event revenue by not reactivating past customers between
> holidays. The Revenue Leakage Index takes 3 minutes and shows where your past
> customer list is sitting unused {link with UTM}. Happy to walk you through the result.

**Cell D — café / hospitality**
> Hi {First}, {Cafe} runs {Square/Toast} and has solid foot traffic. What we usually
> find at your size is loyalty, catering, and repeat-order demand that never gets
> recovered — regulars who vanish without a re-engagement loop. Take the 3-minute
> Revenue Leakage Index for a directional read {link with UTM}. No pitch, no retainer.

**Follow-up rule:** one touch, one observation. If no reply in 5 days, one short
nudge with a DIFFERENT observation (e.g. their Google rating trend). Then stop.

## 5. LinkedIn teardown drafts (one per vertical, post at day 2/5/8/11)

Hook = specific leak pattern, body = mechanism, CTA = Index link. No "Socio does X"
marketing copy; the post is the observation.

**A (aesthetic):** "Most med spas lose consult revenue in the 24 hours between DM and
reply. Here's the math on a 40% lead-response gap at $350–$600 tickets…" → RLI link.
**B (salon):** "The rebooking gap: a $90 ticket client who never returns costs ~$2,800/yr
at 4 visits. Salons track almost none of this." → RLI link.
**C (florist):** "Wedding florists spend all year acquiring brides and lose the gifting
revenue from the same list the other 11 months. The past-customer list IS the asset." → RLI link.
**D (café):** "Cafés obsess over new faces and ignore the regular who stopped coming.
A 5% repeat-customer recovery beats a 20% new-customer acquisition push on margin." → RLI link.

## 6. Controlled internal test — how to run before external distribution

Already executed (2026-08-19, 33/33 checks, isolated DB):

```bash
cd ~/Desktop/socio
node scripts/test-internal-e2e.mjs        # spawns isolated server, exercises all paths, cleans up
```

Covered: authorization denial (403), allowlist + admin acceptance, boundary scores
49/50/74/75 vs hand-calc, mismatch flag on deliberate tampering only, booking record,
state changes (scheduled/attended), disqualification, queue rendering with TEST RECORD
badge, analytics test-event denial, dashboard gate behavior, CSV export.

**To add a manual test record from the running server (admin key only):**
`POST /api/recovery-index` with header `x-admin-key: <ADMIN_PASSWORD>` and body
`{ ..., "is_test": true, "test_label": "internal_e2e_2026_08_19" }`. It lands in
`test_rli_leads`, carries a TEST RECORD badge in the queue, is excluded from founder
SLAs, vertical ranking, conversion metrics, Hermes sales tasks, and nurture — and from
the dashboard unless the "Exclude test records" toggle is switched off (default: on).

## 7. Decision discipline — end of day 14

Score a vertical ONLY after it clears both gates:

| Gate | Threshold |
|---|---|
| G1 completed RLIs | ≥ 30 |
| G2 leads with server score ≥ 75 | ≥ 10 |

For verticals that clear, normalize each metric to 0–100 (min–max across cleared
verticals; all-equal → 50) and compute:

```
V = 0.20·C_ctr + 0.20·C_completion + 0.25·C_qualified + 0.20·C_booked + 0.15·C_data_access
```

| Metric | Definition |
|---|---|
| C_ctr | vertical-card click-through (clicks / card views) |
| C_completion | assessment completion (completed RLI / starts) |
| C_qualified | % of completed scoring 75+ |
| C_booked | % of qualified who request a booking |
| C_data_access | % of booked who grant read-only access |

Where to read it: Command Center → Vertical Decision Dashboard
(`/command-center.html`), date-range + UTM filters, "Exclude test records" ON by
default, priority score shows "Insufficient data" until both gates clear.
CLI: `node scripts/vertical-gate-score.mjs --admin <key> [--base http://localhost:3030]`.

**If no vertical clears — do not force a winner. Diagnose the funnel:**

| Pattern | Diagnosis | Fix |
|---|---|---|
| Low CTR | positioning mismatch | reframe the cell message, swap teardown angle |
| High start, low completion | form friction / phrasing | shorten steps, reword questions |
| High completion, low 75+ | targeting mismatch or score too strict | tighten list criteria |
| High qualification, low booking | urgency/trust or booking-flow friction | founder-call urgency, fix booking flow |
| High booking, low data access | merchant trust, integration, privacy, ops | read-only export demo, privacy explanation |

## 8. Booking naming caveat (reporting discipline)

A booking request is NOT a booking. Until a scheduler is connected, report:

- `booking_intent_rate` — booked / qualified (intent form submitted)
- `founder_scheduled_rate` — scheduled / booked (founder confirmed a slot)
- `attended_rate` — attended / scheduled (call actually happened)

Never call this "booking rate" in an investor deck, merchant reporting, or the
internal vertical score. A scheduled event is stronger than an intent form; an
attended call is stronger still. The dashboard renders all three separately.

## 9. Exit criteria (what "done" means on day 15)

- [ ] Tested and accurate server-scoring path (e2e green, boundaries 49/50/74/75 verified)
- [ ] Four clean, comparable acquisition cells (identical offer; only framing + prefill vary)
- [ ] At least one vertical that clears the sample gate, OR a precise diagnosis of why none did
- [ ] Evidence of who gives data access — not merely who clicks (export column `data_access_state`)
- [ ] Founder-owned conversion log: RLI completion → booking intent → scheduled → attended → read-only data connection (`GET /api/rli/export`, admin key)
- [ ] Raw inputs for the dedicated vertical page: merchant language, leak patterns, objections, software stacks, conversion behavior

Only then build the dedicated vertical page — from observed data, not assumptions.

## 10. Environment notes

- Test allowlist: `TEST_ALLOWLIST_EMAIL_DOMAINS=socio.nyc` (comma-separated).
- Test DB isolation: `SOCIO_DB_FILE=outputs/socio_test.json`.
- Admin key: `ADMIN_PASSWORD` (16+ chars; server refuses weak values).
- Vercel: new monorepo deploys to project `web`; static `website/` + `server.js` via vercel.json.
