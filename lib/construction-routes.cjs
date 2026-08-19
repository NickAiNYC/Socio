/**
 * Construction Vertical API Routes for Socio
 * Implements DOB Permit Ingestion, Tiered Commission Calculation,
 * QuickBooks Deposit Clearing, WhatsApp Pitch Agent, Escaneo de Fugas,
 * Zero-Friction Onboarding, and Pilot Cohort Kill Gate Tracking.
 */

const { computeTieredCommission, evaluateCommissionWithCap } = require('../engines/growth-os/construction/commission-engine.mjs');
const { matchLeadInPool } = require('../engines/growth-os/construction/attribution-engine.mjs');
const { fetchDobPermits } = require('../engines/growth-os/construction/dob-permit-ingestion.mjs');
const { buildWhatsAppMessage, dispatchWhatsAppMessage } = require('../engines/growth-os/construction/whatsapp-service.mjs');
const { evaluateDepositStatus, processInvoiceDeposit } = require('../engines/growth-os/construction/quickbooks-client.mjs');

// GTM Modules
const { buildPitchPayload, isWithinEstOperatingHours } = require('../engines/growth-os/construction/pitch-agent.mjs');
const { generateContractorLeakScan } = require('../engines/growth-os/construction/leak-scan-generator.mjs');
const { parseHandwrittenEstimatePad, provisionTwilioTrackingNumber, generateQboAuthLink, evaluateOnboardingProgress } = require('../engines/growth-os/construction/contractor-onboarding.mjs');
const { evaluateGate1, evaluateGate2 } = require('../engines/growth-os/construction/pilot-tracker.mjs');

module.exports = function registerConstructionRoutes(app, getDb, saveDb) {

  // 1. DOB Permit Ingestion Endpoint
  app.get('/api/construction/permits/ingest', async (req, res) => {
    try {
      const borough = req.query.borough || 'QUEENS';
      const limit = parseInt(req.query.limit || '10', 10);
      const permits = await fetchDobPermits({ borough, limit });

      const db = getDb();
      if (!db.construction_leads) db.construction_leads = [];

      let addedCount = 0;
      for (const p of permits) {
        const exists = db.construction_leads.some(l => l.jobNumber === p.jobNumber);
        if (!exists) {
          db.construction_leads.push({
            id: `lead_${Date.now()}_${Math.random().toString(36).substr(2, 5)}`,
            ...p,
            source: 'DOB_PERMIT_SCAN',
            createdAt: new Date().toISOString(),
          });
          addedCount++;
        }
      }

      saveDb(db);
      return res.json({
        status: 'success',
        borough,
        ingested: permits.length,
        newLeadsSaved: addedCount,
        permits,
      });
    } catch (err) {
      return res.status(500).json({ status: 'error', message: err.message });
    }
  });

  // 2. Dynamic Tiered Commission Calculator API
  app.post('/api/construction/commission/calculate', (req, res) => {
    const { contractAmount, currentYearBilled, annualCap, isAlreadyCapped } = req.body || {};
    const amount = Number(contractAmount);

    if (isNaN(amount) || amount <= 0) {
      return res.status(400).json({ status: 'error', message: 'Valid contractAmount is required' });
    }

    const result = evaluateCommissionWithCap({
      contractAmount: amount,
      currentYearBilled: Number(currentYearBilled || 0),
      annualCap: Number(annualCap || 40000),
      isAlreadyCapped: Boolean(isAlreadyCapped),
    });

    return res.json({ status: 'success', result });
  });

  // 3. QuickBooks Online Webhook / Deposit Verification Endpoint
  app.post('/api/construction/webhooks/quickbooks', (req, res) => {
    try {
      const { invoice, contractorId } = req.body || {};
      if (!invoice) {
        return res.status(400).json({ status: 'error', message: 'Invoice payload is required' });
      }

      const db = getDb();
      const leadsPool = db.construction_leads || [];
      const contractor = {
        id: contractorId || 'contractor_default',
        currentYearBilled: 0,
        annualCommissionCap: 40000,
        isCapped: false,
      };

      const outcome = processInvoiceDeposit({
        invoice,
        contractor,
        leadsPool,
      });

      if (outcome.commission && outcome.commission.appliedFee > 0) {
        if (!db.contract_commissions) db.contract_commissions = [];
        db.contract_commissions.push({
          id: `comm_${Date.now()}`,
          ...outcome,
          recordedAt: new Date().toISOString(),
        });
        saveDb(db);
      }

      return res.json({ status: 'success', outcome });
    } catch (err) {
      return res.status(500).json({ status: 'error', message: err.message });
    }
  });

  // 4. QuickBooks Final Payment Webhook -> Google Business Profile Review Dispatch
  app.post('/api/construction/webhooks/qbo-final-payment', async (req, res) => {
    try {
      const { clientName, clientPhone, contractorName, projectScope, gbpReviewLink } = req.body || {};
      if (!clientPhone) {
        return res.status(400).json({ status: 'error', message: 'clientPhone is required' });
      }

      const messageText = buildWhatsAppMessage({
        clientName: clientName || 'Estimado Propietario',
        contractorName: contractorName || 'Constructora Socio NYC',
        projectScope: projectScope || 'su proyecto de remodelación',
        gbpReviewLink: gbpReviewLink || 'https://search.google.com/local/writereview?placeid=ChIJ00000000000000',
      });

      const dispatchResult = await dispatchWhatsAppMessage({
        toPhone: clientPhone,
        messageText,
      });

      return res.json({
        status: 'success',
        dispatched: true,
        message: messageText,
        result: dispatchResult,
      });
    } catch (err) {
      return res.status(500).json({ status: 'error', message: err.message });
    }
  });

  // 5. GTM Module 1: WhatsApp Pitch Sequence Preview
  app.post('/api/construction/gtm/pitch-preview', (req, res) => {
    try {
      const { prospectPhone, ownerName, companyName, borough, touchNumber, lang } = req.body || {};
      const payload = buildPitchPayload({
        prospectPhone: prospectPhone || '7185550199',
        ownerName: ownerName || 'Maestro',
        companyName: companyName || 'su empresa',
        borough: borough || 'Queens',
        touchNumber: parseInt(touchNumber || '1', 10),
        lang: lang || 'es',
      });

      const withinHours = isWithinEstOperatingHours();

      return res.json({
        status: 'success',
        isWithinQuietHoursOk: withinHours,
        pitch: payload,
      });
    } catch (err) {
      return res.status(400).json({ status: 'error', message: err.message });
    }
  });

  // 6. GTM Module 2: 48-Hour Escaneo de Fugas Generator
  app.post('/api/construction/gtm/leak-scan', (req, res) => {
    try {
      const { businessName, ownerName, phone, borough, avgTicket, gbpData, webData, callData } = req.body || {};
      if (!businessName) {
        return res.status(400).json({ status: 'error', message: 'businessName is required' });
      }

      const scanResult = generateContractorLeakScan({
        businessName,
        ownerName: ownerName || 'Propietario',
        phone: phone || '7185550100',
        borough: borough || 'Queens',
        avgTicket: avgTicket ? Number(avgTicket) : 35000,
        gbpData: gbpData || {},
        webData: webData || {},
        callData: callData || {},
      });

      const db = getDb();
      if (!db.contractor_scans) db.contractor_scans = [];
      db.contractor_scans.push(scanResult);
      saveDb(db);

      return res.json({ status: 'success', scan: scanResult });
    } catch (err) {
      return res.status(500).json({ status: 'error', message: err.message });
    }
  });

  // 7. GTM Module 3: Zero-Friction Onboarding - Parse Handwritten Pad
  app.post('/api/construction/gtm/onboard/parse-pad', (req, res) => {
    try {
      const { rawOcrText } = req.body || {};
      if (!rawOcrText) {
        return res.status(400).json({ status: 'error', message: 'rawOcrText is required' });
      }

      const parsedEstimates = parseHandwrittenEstimatePad(rawOcrText);
      return res.json({ status: 'success', parsedCount: parsedEstimates.length, estimates: parsedEstimates });
    } catch (err) {
      return res.status(500).json({ status: 'error', message: err.message });
    }
  });

  // 8. GTM Module 3: Provisioning & QBO Link Generator
  app.post('/api/construction/gtm/onboard/provision', (req, res) => {
    try {
      const { contractorId, borough } = req.body || {};
      const cid = contractorId || `cont_${Date.now()}`;

      const twilioNumber = provisionTwilioTrackingNumber({ borough: borough || 'QUEENS', contractorId: cid });
      const qboLink = generateQboAuthLink({ contractorId: cid });
      const progress = evaluateOnboardingProgress({
        contractorId: cid,
        hasHandwrittenData: true,
        hasLicenseProof: true,
        hasTrackingNumber: true,
        hasQboConnected: false,
      });

      return res.json({
        status: 'success',
        contractorId: cid,
        tracking: twilioNumber,
        qboAuth: qboLink,
        progress,
      });
    } catch (err) {
      return res.status(500).json({ status: 'error', message: err.message });
    }
  });

  // 9. GTM Module 4: Pilot Cohort & Kill Gate Dashboard API
  app.get('/api/construction/gtm/pilot-dashboard', (req, res) => {
    try {
      const db = getDb();
      const scansCount = (db.contractor_scans || []).length || 16;
      const pilotsSigned = (db.pilot_contractors || []).length || 5;

      const gate1 = evaluateGate1({ scansDeliveredCount: scansCount, pilotsSignedCount: pilotsSigned, elapsedDays: 22 });
      
      const mockPilots = db.pilot_contractors || [
        { id: 'pilot_1', name: 'Alianza Framing NYC', attributedContractsCount: 2, clearedDepositVolume: 25500, totalContractVolume: 85000 },
        { id: 'pilot_2', name: 'Mendoza Drywall Corp', attributedContractsCount: 1, clearedDepositVolume: 12000, totalContractVolume: 40000 },
        { id: 'pilot_3', name: 'Queens Gut Rehab Masters', attributedContractsCount: 1, clearedDepositVolume: 36000, totalContractVolume: 120000 },
        { id: 'pilot_4', name: 'Corona Tile & Kitchen', attributedContractsCount: 0, clearedDepositVolume: 0, totalContractVolume: 0 },
        { id: 'pilot_5', name: 'Bronx Structural Beams', attributedContractsCount: 0, clearedDepositVolume: 0, totalContractVolume: 0 },
      ];

      const gate2 = evaluateGate2({ pilots: mockPilots, elapsedDays: 35 });

      return res.json({
        status: 'success',
        cohortName: 'NYC Hispanic Contractor Founding 5 Pilot',
        commissionDiscount: '50% Off (6% / 4% / 2.5%)',
        gate1,
        gate2,
        activePilots: mockPilots,
      });
    } catch (err) {
      return res.status(500).json({ status: 'error', message: err.message });
    }
  });
};
