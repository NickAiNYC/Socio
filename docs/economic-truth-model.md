# Socio Economic Truth Model

The Economic Truth Layer answers one question:

> **Did Socio actually create economic value, and can we prove how?**

It never answers that question by assertion. Every claim carries an evidence
chain, and every chain has a level.

## The evidence ladder — never blur these

Socio distinguishes five concepts and refuses to conflate them:

| Level | Definition | Example | Can Socio claim it? |
|---|---|---|---|
| **FACT** | A recorded event with a source and timestamp | `payment_intent.succeeded` → ledger event `evt_x`, $50, 2026-08-18T12:00Z, source `stripe` | Always, from the ledger |
| **OBSERVATION** | An aggregate computed from facts | "Total revenue this week: $1,240" | Always, from the ledger |
| **CORRELATION** | A statistical association between series | "Customers in the email variant spent more on average (p≈0.01)" | Only with adequate sample + a comparison |
| **ATTRIBUTION** | An evidence-based causal-ish claim from a designed experiment | "The treatment caused the lift" | Only with a designed experiment, control group, adequate sample, and pre-registered assignment |
| **CAUSATION** | A proven causal claim | "Socio's intervention causes revenue" | **Never automatically.** Requires randomized controlled trials, replication, external validation — reserved, not produced by the engine |

## The chain

```
BUSINESS TWIN
   │
   ▼
OPPORTUNITY  ── FACT (identified, timestamped)
   │
   ▼
EXPERIMENT   ── FACT (control/treatment assignments recorded)
   │
   ▼
AGENT PROPOSAL ── FACT (governed, audited)
   │
   ▼
GOVERNOR     ── FACT (approval durable state)
   │
   ▼
APPROVED ACTION ── FACT (audit trail, hash-chained)
   │
   ▼
EXTERNAL ADAPTER ── governed proxy (never agent-reachable directly)
   │
   ├──► CUSTOMER ── FACT (identity mapping)
   │
   ▼
REVENUE EVENT ── FACT (ledger, idempotent, immutable)
   │
   ▼
ATTRIBUTION   ── OBSERVATION / CORRELATION / ATTRIBUTION (per ladder)
   │
   ▼
LEARNING      ── OBSERVATION (what the evidence supports)
   │
   ▼
BUSINESS TWIN (updated)
```

## Unknown stays unknown

If any hop in the chain is missing — no customer mapping, no experiment
assignment, no `businessId` on a payment — the attribution engine records
**`unknown attribution`** with the reason. It never guesses, never imputes,
never fills a gap with an assumption.

## Terminology in code

- `economic/attribution.mjs` — the ladder is `LEVELS`; the engine returns
  `level`, `claim`, `confidence`, and an `evidence` array of typed hops.
- `economic/stats.mjs` — sample-size floor (`MIN_SAMPLE_PER_GROUP = 30`) and
  Welch's t approximation, labeled approximate.
- `docs/revenue-attribution.md` — how attribution is computed.
- `docs/experiment-methodology.md` — how experiments produce data.
