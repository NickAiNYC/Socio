import { test } from 'node:test';
import assert from 'node:assert/strict';

// Module 1
import { buildPitchPayload, isWithinEstOperatingHours } from '../construction/pitch-agent.mjs';

// Module 2
import { generateContractorLeakScan } from '../construction/leak-scan-generator.mjs';

// Module 3
import { parseHandwrittenEstimatePad, provisionTwilioTrackingNumber, generateQboAuthLink, evaluateOnboardingProgress } from '../construction/contractor-onboarding.mjs';

// Module 4
import { evaluateGate1, evaluateGate2 } from '../construction/pilot-tracker.mjs';

test('GTM MODULE 1: Pitch Agent generates compliant 3-touch WhatsApp payloads and enforces Governor gates', () => {
  // Touch 1: Free Leak Scan offer, requires human approval
  const t1 = buildPitchPayload({
    prospectPhone: '(718) 555-0199',
    ownerName: 'Don Hector',
    companyName: 'Hector Framing Corp',
    borough: 'Queens',
    touchNumber: 1,
    lang: 'es',
  });
  assert.equal(t1.touchNumber, 1);
  assert.equal(t1.requiresApproval, true);
  assert.match(t1.payload.text.body, /Escaneo de Fugas/);
  assert.match(t1.payload.text.body, /Don Hector/);

  // Touch 2: Social proof & zero upfront fees / deposit condition
  const t2 = buildPitchPayload({
    prospectPhone: '7185550199',
    ownerName: 'Don Hector',
    companyName: 'Hector Framing Corp',
    touchNumber: 2,
    lang: 'es',
  });
  assert.equal(t2.touchNumber, 2);
  assert.equal(t2.requiresApproval, false);
  assert.match(t2.payload.text.body, /deposita el anticipo en su cuenta bancaria/);

  // Touch 3: Voice Note + PDF Playbook
  const t3 = buildPitchPayload({
    prospectPhone: '7185550199',
    ownerName: 'Don Hector',
    touchNumber: 3,
    lang: 'es',
  });
  assert.equal(t3.type, 'voice_and_document');
  assert.equal(t3.voicePayload.type, 'audio');
  assert.equal(t3.documentPayload.type, 'document');
  assert.match(t3.documentPayload.document.caption, /Guía de Adquisición de Contratos/);

  // Touch 4: Throws error (Governor max 3 touches)
  assert.throws(() => {
    buildPitchPayload({ prospectPhone: '7185550199', touchNumber: 4 });
  }, /Governor blocked: Touch 4 exceeds maximum allowed touches/);

  // Quiet Hours check (Between 8:00 AM and 7:00 PM EST)
  const morningEst = new Date('2026-08-19T14:00:00Z'); // 10:00 AM EDT
  assert.equal(isWithinEstOperatingHours(morningEst), true);

  const nightEst = new Date('2026-08-20T01:00:00Z'); // 9:00 PM EDT
  assert.equal(isWithinEstOperatingHours(nightEst), false);
});

test('GTM MODULE 2: Escaneo de Fugas Generator calculates health score and financial leakage', () => {
  const scan = generateContractorLeakScan({
    businessName: 'Vargas Drywall & General Construction',
    ownerName: 'Santiago Vargas',
    phone: '7185550194',
    borough: 'Queens',
    avgTicket: 40000,
    gbpData: { claimed: false, reviewCount: 6, lastPhotoDaysAgo: 120 },
    webData: { hasWebsite: false },
    callData: { simulatedResponseMinutes: 120, hasAfterHoursVoicemailText: false },
  });

  assert.equal(scan.contractor.businessName, 'Vargas Drywall & General Construction');
  assert.ok(scan.scores.overallHealthScore < 50); // High leakage
  assert.ok(scan.financialImpact.estimatedLostContractsPerYear > 0);
  assert.ok(scan.financialImpact.estimatedAnnualRevenueLeakage >= 40000);
  assert.equal(scan.financialImpact.currency, 'USD');
  assert.ok(scan.detectedLeaks.length >= 3);
});

test('GTM MODULE 3: Contractor Onboarding parses handwritten pads, provisions tracking & QBO links', () => {
  const rawPadSample = `
    Cliente: Carlos Mendoza
    Tel: (718) 555-0192
    Trabajo: Remodelacion cocina completa y drywall
    Total: $28,500.00
    Deposito: $8,550.00
  `;

  const parsed = parseHandwrittenEstimatePad(rawPadSample);
  assert.equal(parsed.length, 1);
  assert.equal(parsed[0].phone, '7185550192');
  assert.equal(parsed[0].amount, 28500);

  // Twilio Provisioning
  const tracking = provisionTwilioTrackingNumber({ borough: 'BROOKLYN', contractorId: 'cont_101' });
  assert.equal(tracking.areaCode, '347');
  assert.match(tracking.trackingNumber, /^\+1347555/);

  // QBO 1-Click Link
  const qbo = generateQboAuthLink({ contractorId: 'cont_101' });
  assert.match(qbo.oneClickAuthUrl, /https:\/\/appcenter\.intuit\.com\/connect\/oauth2/);
  assert.match(qbo.whatsappAuthPrompt, /QuickBooks/);

  // Progress Evaluation
  const progress = evaluateOnboardingProgress({
    contractorId: 'cont_101',
    hasHandwrittenData: true,
    hasLicenseProof: true,
    hasTrackingNumber: true,
    hasQboConnected: true,
  });
  assert.equal(progress.percentComplete, 100);
  assert.equal(progress.isReadyToLaunch, true);
});

test('GTM MODULE 4: Pilot Tracker enforces Gate 1 (Day 45) and Gate 2 (Day 90) Kill Gates', () => {
  // Gate 1: 15 Scans Delivered, 5 Pilots Signed at Day 30 -> PASSED
  const gate1Pass = evaluateGate1({ scansDeliveredCount: 15, pilotsSignedCount: 5, elapsedDays: 30 });
  assert.equal(gate1Pass.status, 'PASSED');
  assert.equal(gate1Pass.conversionRate, 0.3333);

  // Gate 1: 10 Scans Delivered, 2 Pilots Signed at Day 50 (Expired) -> KILL_GATE_FAILED
  const gate1Fail = evaluateGate1({ scansDeliveredCount: 10, pilotsSignedCount: 2, elapsedDays: 50 });
  assert.equal(gate1Fail.status, 'KILL_GATE_FAILED');

  // Gate 2: 5 Pilots, 3 have cleared deposits ($65,000 total) -> PASSED
  const mockPilots = [
    { id: 'p1', attributedContractsCount: 2, clearedDepositVolume: 25000, totalContractVolume: 80000 },
    { id: 'p2', attributedContractsCount: 1, clearedDepositVolume: 15000, totalContractVolume: 50000 },
    { id: 'p3', attributedContractsCount: 1, clearedDepositVolume: 25000, totalContractVolume: 75000 },
    { id: 'p4', attributedContractsCount: 0, clearedDepositVolume: 0, totalContractVolume: 0 },
    { id: 'p5', attributedContractsCount: 0, clearedDepositVolume: 0, totalContractVolume: 0 },
  ];

  const gate2Pass = evaluateGate2({ pilots: mockPilots, elapsedDays: 60 });
  assert.equal(gate2Pass.status, 'PASSED');
  assert.equal(gate2Pass.pilotsWithClearedDepositsCount, 3);
  assert.equal(gate2Pass.totalClearedDeposits, 65000);

  // Gate 2: Expired with only 1 successful pilot -> KILL_GATE_FAILED
  const mockPilotsFailing = [
    { id: 'p1', attributedContractsCount: 1, clearedDepositVolume: 10000, totalContractVolume: 35000 },
    { id: 'p2', attributedContractsCount: 0, clearedDepositVolume: 0, totalContractVolume: 0 },
  ];
  const gate2Fail = evaluateGate2({ pilots: mockPilotsFailing, elapsedDays: 95 });
  assert.equal(gate2Fail.status, 'KILL_GATE_FAILED');
});
