/**
 * QuickBooks Online Integration for Construction Contracts
 * Monitors deposit payments and triggers commission calculation.
 */

import { computeTieredCommission, evaluateCommissionWithCap } from './commission-engine.mjs';
import { matchLeadInPool } from './attribution-engine.mjs';

export function evaluateDepositStatus(invoice) {
  const totalAmount = parseFloat(invoice.TotalAmt || invoice.totalAmount || '0');
  const balance = parseFloat(invoice.Balance || invoice.balance || '0');
  const clearedPayment = Math.max(0, totalAmount - balance);
  const depositThreshold = totalAmount * 0.20; // At least 20% deposit cleared

  const hasClearedDeposit = clearedPayment >= depositThreshold || (totalAmount > 0 && balance < totalAmount);

  return {
    totalAmount,
    balance,
    clearedPayment,
    depositThreshold,
    hasClearedDeposit,
    isFullyPaid: totalAmount > 0 && balance === 0,
  };
}

export function processInvoiceDeposit({
  invoice,
  contractor,
  leadsPool = [],
}) {
  const depositStatus = evaluateDepositStatus(invoice);

  const customerPhone = invoice.CustomerPhone || invoice.PrimaryPhone || '';
  const customerEmail = invoice.CustomerEmail || invoice.PrimaryEmail || '';

  const attribution = matchLeadInPool(leadsPool, { phone: customerPhone, email: customerEmail });

  let commission = null;
  if (depositStatus.hasClearedDeposit && attribution.lead) {
    commission = evaluateCommissionWithCap({
      contractAmount: depositStatus.totalAmount,
      currentYearBilled: contractor.currentYearBilled || 0,
      annualCap: contractor.annualCommissionCap || 40000,
      isAlreadyCapped: contractor.isCapped || false,
    });
  }

  return {
    contractorId: contractor.id,
    invoiceId: invoice.Id || invoice.id,
    depositStatus,
    attribution,
    commission,
  };
}
