/**
 * Conservative statistics for economic comparison.
 *
 * Terminology discipline (see docs/economic-truth-model.md):
 *   - A t-statistic with an adequate sample is CORRELATION-level evidence.
 *   - It becomes ATTRIBUTION-level only inside a designed experiment with a
 *     control group; it is never CAUSATION by itself (no automatic causal
 *     claims; that requires randomized assignment, replication, and external
 *     validation).
 */

export const MIN_SAMPLE_PER_GROUP = 30;

export function summarize(values) {
  const n = values.length;
  const mean = n > 0 ? values.reduce((a, b) => a + b, 0) / n : 0;
  const variance = n > 1 ? values.reduce((a, v) => a + (v - mean) ** 2, 0) / (n - 1) : 0;
  return { n, mean, std: Math.sqrt(variance), sum: values.reduce((a, b) => a + b, 0) };
}

// Abramowitz & Stegun approximation of the standard normal CDF.
function normalCdf(x) {
  const t = 1 / (1 + 0.2316419 * Math.abs(x));
  const d = 0.3989422804014327 * Math.exp((-x * x) / 2);
  let p = d * t * (0.31938153 + t * (-0.356563782 + t * (1.781477937 + t * (-1.821255978 + t * 1.330274429))));
  return x > 0 ? 1 - p : p;
}

/**
 * Compares treatment vs control outcomes.
 * @param {number[]} treatment
 * @param {number[]} control
 * @returns {{sufficient: boolean, verdict: string, nTreatment: number, nControl: number,
 *            meanTreatment?: number, meanControl?: number, delta?: number, tStat?: number, pApprox?: number}}
 */
export function compareGroups(treatment, control) {
  const t = summarize(treatment);
  const c = summarize(control);
  const sufficient = t.n >= MIN_SAMPLE_PER_GROUP && c.n >= MIN_SAMPLE_PER_GROUP;

  if (!sufficient) {
    return {
      sufficient: false,
      verdict: 'insufficient',
      nTreatment: t.n,
      nControl: c.n,
    };
  }

  // Welch's t approximation.
  const se = Math.sqrt((t.std ** 2) / t.n + (c.std ** 2) / c.n);
  const tStat = se > 0 ? (t.mean - c.mean) / se : 0;
  const pApprox = 2 * (1 - normalCdf(Math.abs(tStat)));

  let verdict = 'no_effect';
  if (pApprox < 0.05 && tStat > 0) verdict = 'significant_positive';
  if (pApprox < 0.05 && tStat < 0) verdict = 'significant_negative';

  return {
    sufficient: true,
    verdict,
    nTreatment: t.n,
    nControl: c.n,
    meanTreatment: t.mean,
    meanControl: c.mean,
    delta: t.mean - c.mean,
    tStat,
    pApprox,
  };
}
