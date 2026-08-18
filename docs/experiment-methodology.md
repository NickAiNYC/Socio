# Experiment Methodology

## Goal

Experiments produce the only data that can support an ATTRIBUTION claim:
customers are assigned to **control** or **treatment** before the
intervention, outcomes are observed, and groups are compared.

## Lifecycle (experiment-engine.mjs)

`DRAFT → RUNNING → PAUSED → RUNNING → PROMOTED | KILLED | INCONCLUSIVE`

- `createExperiment` — hypothesis, objective, metric, baseline, variants
- `startExperiment` / `pauseExperiment` — status guards
- `assignVariant(experimentId, customerId, variant)` — control/treatment
  assignment (stored in `experiment_assignments`, PK `(experiment_id,
  customer_id)`, DB-enforced; a customer cannot silently change variants)
- `observe(id, { value, variant })` — outcome observations
- `evaluate(id)` — statistics
- `promote` / `kill` — terminal decisions with rationale

## Statistics (economic/stats.mjs)

`compareGroups(treatment, control)`:

- **sufficient** requires `MIN_SAMPLE_PER_GROUP = 30` per group
- Welch's t approximation, two-sided p (labeled **approximate**)
- verdicts: `insufficient`, `significant_positive`, `significant_negative`,
  `no_effect`

## Evaluation rules

1. No observations → `INCONCLUSIVE`.
2. Variant observations present:
   - missing control OR treatment group → `INCONCLUSIVE`
   - insufficient sample → `INCONCLUSIVE (insufficient sample n=…)`
   - significant positive → `PROMOTABLE`
   - significant negative → `KILLABLE`
   - no detectable effect → `INCONCLUSIVE`
3. Legacy baseline mode (no variants): ratio of observations above baseline;
   needs the minimum sample before any verdict.

## Control/treatment data

- Assignments are recorded BEFORE outcomes (pre-registration discipline).
- A customer assigned to an experiment belongs to exactly one variant.
- Outcomes are observed per variant; the comparison uses raw group values.

## Insufficient samples

Insufficient samples **always** return `INCONCLUSIVE` — never a promotion, a
kill, or an attribution. The engine would rather say "we don't know yet" than
pretend.

## Attribution tie-in

`evaluate()` supplies the `stats` used by `attributeRevenue()` (see
docs/revenue-attribution.md). Only an experiment with control/treatment data,
adequate samples, and significant positive lift can produce an
attribution-level record — and only when the experiment is flagged as an RCT.
