/**
 * Construction Vertical API Routes for Socio
 * Implements DOB Permit Ingestion, Tiered Commission Calculation,
 * QuickBooks Deposit Clearing, and GBP Review Solicitation Webhook.
 */

const { computeTieredCommission, evaluateCommissionWithCap } = require('../engines/growth-os/construction/commission-engine.mjs');
const { matchLeadInPool } = require('../engines/growth-os/construction/attribution-engine.mjs');
const { fetchDobPermits } = require('../engines/growth-os/construction/dob-permit-ingestion.mjs');
const { buildWhatsAppMessage, dispatchWhatsAppMessage } = require('../engines/growth-os/construction/whatsapp-service.mjs');
const { evaluateDepositStatus, processInvoiceDeposit } = require('../engines/growth-os/construction/quickbooks-client.mjs');

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

  // 4. QuickBooks Final Invoice Payment Webhook -> Google Business Profile Review Dispatch
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
};
