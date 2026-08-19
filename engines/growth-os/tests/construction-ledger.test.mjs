import { test } from 'node:test';
import assert from 'node:assert/strict';

import { computeTieredCommission, evaluateCommissionWithCap } from '../construction/commission-engine.mjs';
import { normalizePhone, normalizeEmail, matchLeadInPool } from '../construction/attribution-engine.mjs';
import { evaluateDepositStatus, processInvoiceDeposit } from '../construction/quickbooks-client.mjs';
import { parsePermitRecord } from '../construction/dob-permit-ingestion.mjs';
import { buildWhatsAppMessage } from '../construction/whatsapp-service.mjs';

test('COMMISSION: calculates progressive tiered rates (12% <$10k, 8% $10k-$50k, 5% >$50k)', () => {
  // 1. Under $10k: strictly 12%
  const smallJob = computeTieredCommission(8000);
  assert.equal(smallJob.fee, 960);
  assert.equal(smallJob.effectiveRate, 0.12);

  // 2. $10k - $50k: 12% on first $10k ($1,200) + 8% on remainder ($1,600) = $2,800
  const midJob = computeTieredCommission(30000);
  assert.equal(midJob.fee, 2800);
  assert.equal(midJob.effectiveRate, 0.0933);

  // 3. Over $50k: $1,200 (first 10k) + $3,200 (next 40k) + 5% on remainder
  // $100k job = 1,200 + 3,200 + (50,000 * 0.05 = 2,500) = $6,900
  const largeJob = computeTieredCommission(100000);
  assert.equal(largeJob.fee, 6900);
  assert.equal(largeJob.effectiveRate, 0.069);
});

test('CAP: clamps fee at $40,000 annual ceiling and triggers SaaS transition flag', () => {
  // Contractor currently at $38,000 billed. Next job fee is $6,900.
  const cappedResult = evaluateCommissionWithCap({
    contractAmount: 100000,
    currentYearBilled: 38000,
    annualCap: 40000,
    isAlreadyCapped: false,
  });

  assert.equal(cappedResult.rawFee, 6900);
  assert.equal(cappedResult.appliedFee, 2000); // Only $2,000 remaining until $40k cap
  assert.equal(cappedResult.isCapped, true);
  assert.equal(cappedResult.transitionedToSaaS, true);
  assert.equal(cappedResult.currentYearTotalBilled, 40000);

  // Next job for already capped contractor: fee is $0.00
  const alreadyCappedJob = evaluateCommissionWithCap({
    contractAmount: 50000,
    currentYearBilled: 40000,
    annualCap: 40000,
    isAlreadyCapped: true,
  });

  assert.equal(alreadyCappedJob.appliedFee, 0);
  assert.equal(alreadyCappedJob.isCapped, true);
  assert.equal(alreadyCappedJob.transitionedToSaaS, true);
});

test('ATTRIBUTION: matches QBO invoices against lead pool by 10-digit phone or email', () => {
  const sampleLeads = [
    { id: 'lead_1', clientName: 'Juan Perez', clientPhone: '(718) 555-0199', clientEmail: 'juan@construction.nyc' },
    { id: 'lead_2', clientName: 'Maria Gomez', clientPhone: '+1-347-555-0188', clientEmail: 'maria@decor.nyc' },
  ];

  // Phone match with different formatting
  const match1 = matchLeadInPool(sampleLeads, { phone: '718-555-0199' });
  assert.equal(match1.matchType, 'PHONE_EXACT');
  assert.equal(match1.lead?.id, 'lead_1');

  // Email match fallback
  const match2 = matchLeadInPool(sampleLeads, { phone: '9999999999', email: 'MARIA@DECOR.NYC' });
  assert.equal(match2.matchType, 'EMAIL_EXACT');
  assert.equal(match2.lead?.id, 'lead_2');

  // Unmatched lead
  const match3 = matchLeadInPool(sampleLeads, { phone: '2125550000', email: 'stranger@nyc.gov' });
  assert.equal(match3.matchType, 'NONE');
  assert.equal(match3.lead, null);
});

test('QUICKBOOKS: verifies deposit clearing before generating commission proof', () => {
  const sampleLeads = [
    { id: 'lead_1', clientName: 'Carlos Ruiz', clientPhone: '9175550133', clientEmail: 'carlos@nyc.com' },
  ];

  // Case A: Deposit paid ($15,000 paid out of $50,000 total)
  const depositPaidInvoice = {
    Id: 'QBO_INV_1001',
    TotalAmt: '50000.00',
    Balance: '35000.00', // $15,000 cleared
    CustomerPhone: '(917) 555-0133',
  };

  const depositStatusA = evaluateDepositStatus(depositPaidInvoice);
  assert.equal(depositStatusA.hasClearedDeposit, true);
  assert.equal(depositStatusA.clearedPayment, 15000);

  const outcomeA = processInvoiceDeposit({
    invoice: depositPaidInvoice,
    contractor: { id: 'contractor_1', currentYearBilled: 0, annualCommissionCap: 40000 },
    leadsPool: sampleLeads,
  });

  assert.equal(outcomeA.attribution.matchType, 'PHONE_EXACT');
  assert.notEqual(outcomeA.commission, null);
  assert.equal(outcomeA.commission?.appliedFee, 4400); // 10k*12% + 40k*8% = 1200 + 3200 = $4,400

  // Case B: Invoice drafted with $0 paid (no deposit cleared yet)
  const unpaidInvoice = {
    Id: 'QBO_INV_1002',
    TotalAmt: '50000.00',
    Balance: '50000.00',
    CustomerPhone: '(917) 555-0133',
  };

  const depositStatusB = evaluateDepositStatus(unpaidInvoice);
  assert.equal(depositStatusB.hasClearedDeposit, false);
  assert.equal(depositStatusB.clearedPayment, 0);

  const outcomeB = processInvoiceDeposit({
    invoice: unpaidInvoice,
    contractor: { id: 'contractor_1', currentYearBilled: 0, annualCommissionCap: 40000 },
    leadsPool: sampleLeads,
  });

  assert.equal(outcomeB.commission, null); // Zero commission triggered until deposit clears
});

test('DOB PERMIT: parses raw NYC OpenData permit records into actionable contractor leads', () => {
  const rawPermit = {
    job__: '421890123',
    house__: '34-12',
    street_name: 'Broadway',
    borough: 'QUEENS',
    owner_s_first_name: 'Santiago',
    owner_s_last_name: 'Vargas',
    owner_s_phone__: '718-555-0194',
    job_description: 'Demolition of interior partitions and complete kitchen/bath framing overhaul',
    estimated_cost: '65000',
    issuance_date: '2026-08-19T00:00:00.000',
  };

  const parsed = parsePermitRecord(rawPermit);
  assert.equal(parsed.jobNumber, '421890123');
  assert.equal(parsed.ownerName, 'Santiago Vargas');
  assert.equal(parsed.ownerPhone, '7185550194');
  assert.equal(parsed.projectAddress, '34-12 Broadway, QUEENS, NY');
  assert.equal(parsed.estimatedCost, 65000);
});

test('WHATSAPP: builds Spanish construction-native sequences and GBP review messages', () => {
  // Touch 1: Site visit booking
  const touch1 = buildWhatsAppMessage({
    touchNumber: 1,
    contractorName: 'Alianza Framing NYC',
    clientName: 'Don Hector',
    projectScope: 'la ampliación del segundo piso',
  });
  assert.match(touch1, /Don Hector/);
  assert.match(touch1, /tomar medidas exactas/);

  // Touch 3: Deposit close
  const touch3 = buildWhatsAppMessage({
    touchNumber: 3,
    contractorName: 'Alianza Framing NYC',
    clientName: 'Don Hector',
    projectScope: 'la ampliación del segundo piso',
  });
  assert.match(touch3, /depósito inicial del contrato/);

  // GBP Final Review Solicitation
  const reviewMsg = buildWhatsAppMessage({
    clientName: 'Sra. Mariana',
    contractorName: 'Alianza Framing NYC',
    projectScope: 'la remodelación comercial',
    gbpReviewLink: 'https://g.page/r/alianza-framing/review',
  });
  assert.match(reviewMsg, /5 estrellas en Google/);
  assert.match(reviewMsg, /https:\/\/g.page\/r\/alianza-framing\/review/);
});
