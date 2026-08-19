/**
 * Dynamic Tiered Commission Engine for NYC Construction Contractors
 * 
 * Progressive Tiers:
 * - 12% on the first $10,000 (< $10,000)
 * - 8% on the amount between $10,000 and $50,000 ($10,000 - $50,000)
 * - 5% on any amount exceeding $50,000 (> $50,000)
 * 
 * Annual Cap:
 * - Default $40,000.00 ceiling per contractor per calendar year.
 * - When reached, client transitions to flat SaaS billing ($1,500/mo) and fee is clamped.
 */

export function computeTieredCommission(contractAmount) {
  const amount = Number(contractAmount);
  if (isNaN(amount) || amount <= 0) {
    return { fee: 0, effectiveRate: 0, breakdown: [] };
  }

  let fee = 0;
  const breakdown = [];

  // Tier 1: 0 - 10,000 at 12%
  const tier1Amount = Math.min(amount, 10000);
  if (tier1Amount > 0) {
    const tier1Fee = tier1Amount * 0.12;
    fee += tier1Fee;
    breakdown.push({ tier: '< $10k', rate: 0.12, taxableAmount: tier1Amount, fee: Number(tier1Fee.toFixed(2)) });
  }

  // Tier 2: 10,000 - 50,000 at 8%
  if (amount > 10000) {
    const tier2Amount = Math.min(amount - 10000, 40000);
    const tier2Fee = tier2Amount * 0.08;
    fee += tier2Fee;
    breakdown.push({ tier: '$10k - $50k', rate: 0.08, taxableAmount: tier2Amount, fee: Number(tier2Fee.toFixed(2)) });
  }

  // Tier 3: > 50,000 at 5%
  if (amount > 50000) {
    const tier3Amount = amount - 50000;
    const tier3Fee = tier3Amount * 0.05;
    fee += tier3Fee;
    breakdown.push({ tier: '> $50k', rate: 0.05, taxableAmount: tier3Amount, fee: Number(tier3Fee.toFixed(2)) });
  }

  const effectiveRate = Number((fee / amount).toFixed(4));
  return {
    contractAmount: amount,
    fee: Number(fee.toFixed(2)),
    effectiveRate,
    breakdown,
  };
}

export function evaluateCommissionWithCap({
  contractAmount,
  currentYearBilled = 0,
  annualCap = 40000,
  isAlreadyCapped = false,
}) {
  const { fee: rawFee, effectiveRate, breakdown } = computeTieredCommission(contractAmount);

  if (isAlreadyCapped) {
    return {
      contractAmount,
      rawFee,
      appliedFee: 0,
      effectiveRate: 0,
      isCapped: true,
      transitionedToSaaS: true,
      currentYearTotalBilled: currentYearBilled,
      breakdown,
    };
  }

  const remainingCap = Math.max(0, annualCap - currentYearBilled);

  if (rawFee > remainingCap) {
    const appliedFee = Number(remainingCap.toFixed(2));
    return {
      contractAmount,
      rawFee,
      appliedFee,
      effectiveRate: Number((appliedFee / contractAmount).toFixed(4)),
      isCapped: true,
      transitionedToSaaS: true,
      currentYearTotalBilled: annualCap,
      cappedTransitionAmount: appliedFee,
      breakdown,
    };
  }

  const newTotal = Number((currentYearBilled + rawFee).toFixed(2));
  return {
    contractAmount,
    rawFee,
    appliedFee: rawFee,
    effectiveRate,
    isCapped: false,
    transitionedToSaaS: false,
    currentYearTotalBilled: newTotal,
    breakdown,
  };
}
