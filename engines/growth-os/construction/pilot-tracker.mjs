/**
 * Pilot Tracking & Kill Gate Engine for NYC Contractor Launch
 * Cohort: 5 Founding Pilot Partners at 50% Commission Discount (6% / 4% / 2.5%).
 * 
 * Gate 1 (Day 45): >= 30% conversion from Scans Delivered -> Pilots Signed (Min 5 active).
 * Gate 2 (Day 90): >= 60% of active pilots (>= 3/5) have at least 1 attributed contract with cleared deposit.
 */

export const PILOT_COHORT_SPECS = {
  MAX_PILOT_SEATS: 5,
  COMMISSION_DISCOUNT_PERCENT: 50, // 50% off standard rates
  GATE_1_DAY_LIMIT: 45,
  GATE_1_MIN_CONVERSION_RATE: 0.30, // 30%
  GATE_2_DAY_LIMIT: 90,
  GATE_2_MIN_ACTIVE_SUCCESS_COUNT: 3, // At least 3 pilots with cleared deposits
};

export function evaluateGate1({ scansDeliveredCount = 0, pilotsSignedCount = 0, elapsedDays = 0 }) {
  const conversionRate = scansDeliveredCount > 0 ? Number((pilotsSignedCount / scansDeliveredCount).toFixed(4)) : 0;
  const isPassed = pilotsSignedCount >= PILOT_COHORT_SPECS.MAX_PILOT_SEATS && conversionRate >= PILOT_COHORT_SPECS.GATE_1_MIN_CONVERSION_RATE;
  const isExpired = elapsedDays > PILOT_COHORT_SPECS.GATE_1_DAY_LIMIT && !isPassed;

  return {
    gate: 'GATE_1_PILOT_ACQUISITION',
    evaluationDay: elapsedDays,
    limitDay: PILOT_COHORT_SPECS.GATE_1_DAY_LIMIT,
    scansDeliveredCount,
    pilotsSignedCount,
    conversionRate,
    targetRate: PILOT_COHORT_SPECS.GATE_1_MIN_CONVERSION_RATE,
    status: isPassed ? 'PASSED' : (isExpired ? 'KILL_GATE_FAILED' : 'IN_PROGRESS'),
    verdict: isPassed
      ? 'Gate 1 CLEARED: 5 pilot contractor seats filled with >30% scan-to-close efficiency.'
      : (isExpired
          ? 'KILL TRIGGER: Failed to acquire 5 pilot partners within 45 days. Reprice offer or change outbound channel.'
          : `In Progress: ${pilotsSignedCount}/5 pilots onboarded (${(conversionRate * 100).toFixed(1)}% conversion).`),
  };
}

export function evaluateGate2({ pilots = [], elapsedDays = 0 }) {
  const totalPilots = pilots.length;
  const pilotsWithClearedDeposits = pilots.filter((p) => (p.attributedContractsCount || 0) >= 1 && (p.clearedDepositVolume || 0) > 0);
  const successCount = pilotsWithClearedDeposits.length;
  const totalAttributedRevenue = pilots.reduce((acc, p) => acc + (p.totalContractVolume || 0), 0);
  const totalClearedDeposits = pilots.reduce((acc, p) => acc + (p.clearedDepositVolume || 0), 0);

  const isPassed = successCount >= PILOT_COHORT_SPECS.GATE_2_MIN_ACTIVE_SUCCESS_COUNT;
  const isExpired = elapsedDays > PILOT_COHORT_SPECS.GATE_2_DAY_LIMIT && !isPassed;

  return {
    gate: 'GATE_2_ECONOMIC_PROVABILITY',
    evaluationDay: elapsedDays,
    limitDay: PILOT_COHORT_SPECS.GATE_2_DAY_LIMIT,
    totalPilots,
    pilotsWithClearedDepositsCount: successCount,
    requiredSuccessCount: PILOT_COHORT_SPECS.GATE_2_MIN_ACTIVE_SUCCESS_COUNT,
    totalAttributedRevenue,
    totalClearedDeposits,
    status: isPassed ? 'PASSED' : (isExpired ? 'KILL_GATE_FAILED' : 'IN_PROGRESS'),
    verdict: isPassed
      ? `Gate 2 CLEARED: ${successCount}/${totalPilots} contractors have cleared bank deposits. Proceed to full NYC expansion.`
      : (isExpired
          ? 'KILL TRIGGER: Less than 3 contractors generated verified revenue within 90 days. Audit lead quality and estimating friction.'
          : `In Progress: ${successCount}/${totalPilots} contractors with bank-cleared deposits ($${totalClearedDeposits.toLocaleString()} deposited).`),
  };
}
