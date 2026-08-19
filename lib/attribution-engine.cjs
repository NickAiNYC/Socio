/**
 * Socio — Zero-Trust Attribution Engine for Contratistas
 * DOB Radar -> Twilio Proxy (recorded) -> WhatsApp Handoff -> Dual-SMS Lead # -> Weekly 1/2/3 -> Stripe Invoice
 */
'use strict';
const crypto = require('crypto');

function newLeadId(){ return `SOC-${Date.now().toString(36).toUpperCase()}-${crypto.randomBytes(2).toString('hex').toUpperCase()}`; }

function createProxyRecord({contractorId, contractorPhone, permitId, address, budget}){
  return {
    leadId: newLeadId(),
    contractorId,
    proxyNumber: contractorPhone, // Twilio number assigned per contractor
    permitId, address, budget,
    createdAt: new Date().toISOString(),
    attributionWindowDays: 60,
    status: 'dispatched', // dispatched -> quoted -> closed -> invoiced
    source: 'DOB Radar + Proxy'
  };
}

function dualSmsPayload(lead){
  return {
    toOwner: `Lead #${lead.leadId}: ${lead.clientName||'Propietario'} — ${lead.address} — Presupuesto $${lead.budget||'N/A'} — Responda 1:Cotizado 2:Cerrado 3:Descartado`,
    toClient: `Hola, soy ${lead.contractorName||'su contratista'} — vimos su permiso en ${lead.address}. ¿Cuándo podemos cotizar? Responda SI para WhatsApp.`
  };
}

function parseReconciliation(text){
  const t = String(text||'').trim();
  if (t==='1' || /cotizado/i.test(t)) return 'quoted';
  if (t==='2' || /cerrado/i.test(t)) return 'closed';
  if (t==='3' || /descartado/i.test(t)) return 'discarded';
  return 'unknown';
}

function isAttributed(lead, closedAt){
  if (!lead.createdAt || !closedAt) return false;
  const diff = (new Date(closedAt) - new Date(lead.createdAt)) / (86400000);
  return diff >=0 && diff <= (lead.attributionWindowDays||60);
}

module.exports = { newLeadId, createProxyRecord, dualSmsPayload, parseReconciliation, isAttributed };
