/** Zero-Trust Ledger routes */
const { createProxyRecord, parseReconciliation, isAttributed } = require('./attribution-engine.cjs');
module.exports = function(app, getDb, saveDb){
  // Create lead via proxy dispatch
  app.post('/api/attribution/lead', (req,res)=>{
    const { contractorId, contractorPhone, permitId, address, budget, clientName, contractorName } = req.body||{};
    if(!contractorId) return res.status(400).json({error:'contractorId required'});
    const db=getDb(); if(!db.attribution_leads) db.attribution_leads=[];
    const lead = { ...createProxyRecord({contractorId, contractorPhone, permitId, address, budget}), clientName, contractorName, phone: contractorPhone };
    db.attribution_leads.push(lead); saveDb(db);
    return res.json({status:'success', lead});
  });
  // Weekly 1/2/3 reconciliation webhook
  app.post('/api/attribution/reconcile', (req,res)=>{
    const { leadId, text, closedAt } = req.body||{};
    const db=getDb(); const lead=(db.attribution_leads||[]).find(l=>l.leadId===leadId);
    if(!lead) return res.status(404).json({error:'lead not found'});
    const status=parseReconciliation(text);
    lead.reconciliation={ text, status, at: new Date().toISOString() };
    if(status==='closed'){
      lead.closedAt = closedAt || new Date().toISOString();
      lead.attributed = isAttributed(lead, lead.closedAt);
      // Create Stripe invoice stub
      if(lead.attributed){
        lead.invoice={ amount: Math.round((lead.budget||35000)*0.10), currency:'usd', status:'draft', due: lead.closedAt };
        lead.status='closed_attributed';
      } else {
        lead.status='closed_outside_window';
      }
    } else {
      lead.status=status;
    }
    saveDb(db);
    return res.json({status:'success', lead});
  });
  app.get('/api/attribution/ledger', (req,res)=>{
    const db=getDb(); return res.json({leads: db.attribution_leads||[]});
  });
  app.get('/api/attribution/status', (req,res)=>{
    const db=getDb(); const leads=db.attribution_leads||[];
    return res.json({total:leads.length, attributed: leads.filter(l=>l.attributed).length, closed: leads.filter(l=>l.status==='closed_attributed').length});
  });
};
