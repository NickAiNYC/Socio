/**
 * Revenue Definition Schedule — the signed per-merchant contract that makes
 * "verified" mean "incremental."
 *
 * Every merchant engagement is governed by a schedule defining what counts as
 * eligible revenue, the attribution window, the baseline methodology, the
 * exclusions, the holdout methodology, the dispute window, and payment
 * frequency. The report layer applies these rules to the ledger so Socio
 * never claims revenue the contract says it cannot claim.
 *
 * Honesty rules (mirrors the evidence ladder):
 *   - exclusions are applied mechanically from the schedule
 *   - baseline methodology is recorded but only APPLIED when the required
 *     history actually exists (baselineApplied:false + note otherwise) —
 *     a baseline is never invented
 *   - incrementality requires an attribution record at correlation level or
 *     higher on an eligible, in-window event
 */

export const EXCLUSIONS = Object.freeze([
  'refund',
  'chargeback',
  'gift_card',
  'pre_existing_booking',
  'manual_import',
  'void',
  'fee',
  'tax',
]);

export const BASELINE_METHODS = Object.freeze([
  'trailing_12m',   // 12-month trailing average of the merchant's revenue
  'trailing_6m',    // 6-month trailing average
  'holdout_control',// revenue lift vs. an unexposed holdout group
  'none',           // no baseline adjustment (small/seasonal merchants)
]);

export const PAYMENT_FREQUENCIES = Object.freeze(['monthly', 'weekly', 'quarterly']);

const ID_RE = /^[A-Za-z0-9_\-.]{1,64}$/;

/**
 * Validates and normalizes a schedule. Throws on invalid input — the API
 * surface fails closed rather than storing a schedule the report cannot apply.
 * @param {object} s
 * @returns {object} normalized schedule
 */
export function validateSchedule(s) {  if (!s || typeof s !== 'object' || Array.isArray(s)) {
    throw new Error('schedule must be an object');
  }
  if (typeof s.businessId !== 'string' || !ID_RE.test(s.businessId)) {
    throw new Error('schedule.businessId is required (letters, digits, _ - .)');
  }
  if (!Number.isInteger(s.attributionWindowDays) || s.attributionWindowDays <= 0) {
    throw new Error('schedule.attributionWindowDays must be a positive integer (days)');
  }
  if (!BASELINE_METHODS.includes(s.baselineMethod)) {
    throw new Error(`schedule.baselineMethod must be one of ${BASELINE_METHODS.join(', ')}`);
  }
  if (!Array.isArray(s.exclusions) || s.exclusions.length === 0) {
    throw new Error('schedule.exclusions must be a non-empty array');
  }
  for (const ex of s.exclusions) {
    if (!EXCLUSIONS.includes(ex)) {
      throw new Error(`schedule.exclusions contains unknown exclusion "${ex}" (allowed: ${EXCLUSIONS.join(', ')})`);
    }
  }
  if (!Number.isInteger(s.disputeWindowDays) || s.disputeWindowDays < 0) {
    throw new Error('schedule.disputeWindowDays must be a non-negative integer');
  }
  if (!PAYMENT_FREQUENCIES.includes(s.paymentFrequency)) {
    throw new Error(`schedule.paymentFrequency must be one of ${PAYMENT_FREQUENCIES.join(', ')}`);
  }
  const holdoutPercent = s.holdoutPercent === undefined ? null : Number(s.holdoutPercent);
  if (holdoutPercent !== null && (!Number.isFinite(holdoutPercent) || holdoutPercent < 0 || holdoutPercent > 100)) {
    throw new Error('schedule.holdoutPercent must be between 0 and 100');
  }
  const commissionRate = s.commissionRate === undefined ? null : Number(s.commissionRate);
  if (commissionRate !== null && (!Number.isFinite(commissionRate) || commissionRate < 0 || commissionRate > 1)) {
    throw new Error('schedule.commissionRate must be between 0 and 1');
  }

  return {
    businessId: s.businessId,
    attributionWindowDays: s.attributionWindowDays,
    baselineMethod: s.baselineMethod,
    exclusions: [...s.exclusions],
    disputeWindowDays: s.disputeWindowDays,
    paymentFrequency: s.paymentFrequency,
    holdoutPercent,
    commissionRate,
    effectiveDate: typeof s.effectiveDate === 'string' ? s.effectiveDate : null,
    version: typeof s.version === 'string' ? s.version : '1.0.0',
  };
}

/**
 * Mechanical exclusion test for a single ledger event.
 * @returns {{excluded: boolean, reason?: string}}
 */
export function eventExclusion(event, schedule) {
  if (!event || !schedule) return { excluded: true, reason: 'no schedule' };
  if (event.type === 'refund' || event.type === 'churn') {
    return { excluded: true, reason: `${event.type} events are never incremental revenue` };
  }
  const md = event.metadata || {};
  const rules = {
    chargeback: md.chargeback === true || md.dispute === 'chargeback',
    gift_card: md.giftCard === true || md.paymentMethod === 'gift_card',
    pre_existing_booking: md.preExistingBooking === true || md.preExistingCustomer === true,
    manual_import: md.manualImport === true,
    void: md.void === true,
    fee: event.type === 'fee' || md.feeOnly === true,
    tax: event.type === 'tax' || md.taxOnly === true,
  };
  for (const ex of schedule.exclusions) {
    if (rules[ex]) {
      return { excluded: true, reason: `excluded by schedule rule "${ex}"` };
    }
  }
  return { excluded: false };
}

/**
 * Whether an event falls inside the schedule's attribution window. Revenue
 * recorded before (now - windowDays) is treated as pre-existing — it cannot
 * be claimed as incremental by the current engagement. (Per-campaign windows
 * are enforced at the attribution hop; this is the contract-level bound.)
 */
export function withinAttributionWindow(event, schedule, nowMs = Date.now()) {
  if (!event?.occurredAt || !schedule) return false;
  const t = new Date(event.occurredAt).getTime();
  if (!Number.isFinite(t)) return false;
  const windowMs = schedule.attributionWindowDays * 24 * 60 * 60 * 1000;
  return t >= nowMs - windowMs && t <= nowMs + 5 * 60 * 1000; // allow clock skew forward
}

const EVIDENCE_LEVELS = new Set(['correlation', 'attribution']);

/**
 * Applies the schedule to a business's ledger events + attribution records.
 * Returns the honest incremental picture. baselineApplied stays false until
 * the required history (e.g. trailing 12m) demonstrably exists.
 */
export function computeIncrementality(events, attributionRecords, schedule, nowMs = Date.now()) {
  if (!schedule) {
    return {
      scheduleStatus: 'none',
      totalRevenue: 0,
      excludedRevenue: 0,
      eligibleRevenue: 0,
      attributedRevenue: 0,
      incrementalRevenue: 0,
      baselineMethod: null,
      baselineApplied: false,
      baselineNote: 'no revenue definition schedule on file — incremental revenue cannot be computed',
    };
  }

  const revenueEvents = (events || []).filter((e) =>
    ['revenue', 'purchase', 'repeat_purchase', 'expansion_revenue'].includes(e.type)
  );
  const byRevenueEventId = new Map((attributionRecords || []).map((a) => [a.revenueEventId, a]));

  let totalRevenue = 0;
  let excludedRevenue = 0;
  let eligibleRevenue = 0;
  let attributedRevenue = 0;
  let incrementalRevenue = 0;
  const excludedReasons = {};

  for (const e of revenueEvents) {
    totalRevenue += e.amount;
    const ex = eventExclusion(e, schedule);
    if (ex.excluded) {
      excludedRevenue += e.amount;
      excludedReasons[ex.reason] = (excludedReasons[ex.reason] || 0) + 1;
      continue;
    }
    if (!withinAttributionWindow(e, schedule, nowMs)) {
      excludedRevenue += e.amount;
      excludedReasons['outside_attribution_window'] = (excludedReasons['outside_attribution_window'] || 0) + 1;
      continue;
    }
    eligibleRevenue += e.amount;
    const attr = byRevenueEventId.get(e.id);
    if (attr && EVIDENCE_LEVELS.has(attr.level)) {
      attributedRevenue += e.amount;
      incrementalRevenue += e.amount;
    }
  }

  // Baseline: only applied when the method can actually be computed from
  // recorded history. The pilot stores the methodology; application is a
  // Phase-2 proof with real history — never invented here.
  const needsHistory = schedule.baselineMethod === 'trailing_12m' || schedule.baselineMethod === 'trailing_6m';
  const baselineApplied = false;
  const baselineNote = needsHistory
    ? `baseline method "${schedule.baselineMethod}" requires the merchant's pre-engagement history — not yet computable from recorded data`
    : schedule.baselineMethod === 'holdout_control'
      ? 'holdout control group methodology recorded — applied once the holdout group has real exposure data'
      : 'no baseline adjustment per schedule';

  return {
    scheduleStatus: 'signed',
    totalRevenue,
    excludedRevenue,
    eligibleRevenue,
    attributedRevenue,
    incrementalRevenue,
    baselineMethod: schedule.baselineMethod,
    baselineApplied,
    baselineNote,
    excludedReasons,
  };
}

/**
 * Governed write path for a schedule. Socio ops (or a governed script) stores
 * the validated contract under id = businessId; the public Merchant API stays
 * read-only by design. Re-saving replaces the prior version (history is kept
 * by bumping `version` in the record).
 * @param {{save(id: string, data: object): Promise<object>}} repository
 * @param {object} schedule
 */
export async function saveSchedule(repository, schedule) {
  const normalized = validateSchedule(schedule);
  await repository.save(normalized.businessId, normalized);
  return normalized;
}

/**
 * Read the active schedule for a business from a repository.
 * @param {{get(id: string): Promise<object|null>, findByBusiness?: (id: string) => Promise<object[]>}} repository
 */
export async function getSchedule(repository, businessId) {
  if (!repository) return null;
  const direct = await repository.get(businessId);
  if (direct) return direct;
  if (typeof repository.findByBusiness === 'function') {
    const found = await repository.findByBusiness(businessId);
    return found && found.length > 0 ? found[0] : null;
  }
  return null;
}
