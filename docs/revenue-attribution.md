# Revenue Attribution

## Principle

Revenue is attributed to an intervention only when there is a recorded chain
of evidence. Attribution output is always one of:

- **factual** — revenue recorded (no attribution claimed)
- **observational** — revenue + a known customer, no experiment link
- **correlational** — group comparison at adequate sample size
- **attributional** — designed experiment (RCT flag), control group, adequate
  sample, significant positive lift
- **unknown** — a link is missing; the engine says why

## Algorithm (economic/attribution.mjs)

`attributeRevenue()` is called with a revenue event and the experiment context.
It assembles an evidence array hop by hop:

1. **FACT** — the revenue event itself (id, amount, currency, timestamp, source).
2. If `customerId` or `experimentId` is missing → record `observation` level,
   claim `unknown attribution`, stop.
3. **FACT** — customer must exist in the store (`findCustomerByProviderId`).
   Unmapped → `unknown attribution (unmapped customer)`.
4. **FACT** — the customer must have an experiment assignment
   (`getAssignment`). Unassigned → `unknown attribution (not assigned)`.
5. **CORRELATION** — `compareGroups(treatmentOutcomes, controlOutcomes)`:
   - insufficient sample → `observation`, `insufficient sample (n=…)`
   - no significant effect → `correlation`, `no significant positive effect`
   - significant + `isRct` → **attribution** level:
     `treatment variant <v> shows significant positive lift (delta=…, approx p=…)`
   - significant + not RCT → `correlation` (a significant association without
     a designed experiment is correlation, never attribution)

Confidence is `1 - pApprox` (approximate) and is `null` when inconclusive.

## Unknown attribution

The engine NEVER produces attribution without:
- a revenue event
- a mapped customer
- an experiment assignment
- an adequate treatment/control comparison

If any is absent, the claim literally contains the word **unknown**.

## What this means for reports

A report to a merchant may say:

> "We changed X under experiment Y. These customers were assigned, these
> transactions occurred afterward, here is the correlation evidence, here is
> what we cannot prove, and here is whether Socio should repeat the
> intervention."

It may NOT say "we caused this revenue" unless the evidence chain reached the
attribution level — and even then, causation is never claimed automatically.
