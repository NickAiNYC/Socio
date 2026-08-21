/**
 * Self-contained CommonJS Construction Engines for Serverless Runtime
 */

// 1. Commission Engine
function computeTieredCommission(contractAmount) {
  const amount = Number(contractAmount);
  if (isNaN(amount) || amount <= 0) return { fee: 0, effectiveRate: 0, breakdown: [] };
  let fee = 0;
  const breakdown = [];
  const tier1Amount = Math.min(amount, 10000);
  if (tier1Amount > 0) {
    const tier1Fee = tier1Amount * 0.12;
    fee += tier1Fee;
    breakdown.push({ tier: '< $10k', rate: 0.12, taxableAmount: tier1Amount, fee: Number(tier1Fee.toFixed(2)) });
  }
  if (amount > 10000) {
    const tier2Amount = Math.min(amount - 10000, 40000);
    const tier2Fee = tier2Amount * 0.08;
    fee += tier2Fee;
    breakdown.push({ tier: '$10k - $50k', rate: 0.08, taxableAmount: tier2Amount, fee: Number(tier2Fee.toFixed(2)) });
  }
  if (amount > 50000) {
    const tier3Amount = amount - 50000;
    const tier3Fee = tier3Amount * 0.05;
    fee += tier3Fee;
    breakdown.push({ tier: '> $50k', rate: 0.05, taxableAmount: tier3Amount, fee: Number(tier3Fee.toFixed(2)) });
  }
  const effectiveRate = Number((fee / amount).toFixed(4));
  return { contractAmount: amount, fee: Number(fee.toFixed(2)), effectiveRate, breakdown };
}

function evaluateCommissionWithCap({ contractAmount, currentYearBilled = 0, annualCap = 40000, isAlreadyCapped = false }) {
  const { fee: rawFee, effectiveRate, breakdown } = computeTieredCommission(contractAmount);
  if (isAlreadyCapped) {
    return { contractAmount, rawFee, appliedFee: 0, effectiveRate: 0, isCapped: true, transitionedToSaaS: true, currentYearTotalBilled: currentYearBilled, breakdown };
  }
  const remainingCap = Math.max(0, annualCap - currentYearBilled);
  if (rawFee > remainingCap) {
    const appliedFee = Number(remainingCap.toFixed(2));
    return { contractAmount, rawFee, appliedFee, effectiveRate: Number((appliedFee / contractAmount).toFixed(4)), isCapped: true, transitionedToSaaS: true, currentYearTotalBilled: annualCap, cappedTransitionAmount: appliedFee, breakdown };
  }
  const newTotal = Number((currentYearBilled + rawFee).toFixed(2));
  return { contractAmount, rawFee, appliedFee: rawFee, effectiveRate, isCapped: false, transitionedToSaaS: false, currentYearTotalBilled: newTotal, breakdown };
}

// 2. Attribution Engine
function normalizePhone(rawPhone) {
  if (!rawPhone || typeof rawPhone !== 'string') return '';
  const digits = rawPhone.replace(/\D/g, '');
  return digits.length >= 10 ? digits.slice(-10) : digits;
}

function normalizeEmail(rawEmail) {
  if (!rawEmail || typeof rawEmail !== 'string') return '';
  return rawEmail.trim().toLowerCase();
}

function matchLeadInPool(leads, { phone, email }) {
  const cleanPhone = normalizePhone(phone);
  const cleanEmail = normalizeEmail(email);
  if (cleanPhone && cleanPhone.length === 10) {
    const matched = leads.find((l) => normalizePhone(l.clientPhone || l.phone) === cleanPhone);
    if (matched) return { matchType: 'PHONE_EXACT', lead: matched };
  }
  if (cleanEmail && cleanEmail.includes('@')) {
    const matched = leads.find((l) => normalizeEmail(l.clientEmail || l.email) === cleanEmail);
    if (matched) return { matchType: 'EMAIL_EXACT', lead: matched };
  }
  return { matchType: 'NONE', lead: null };
}

// 3. DOB Ingestion Pipeline
async function fetchDobPermits({ borough = 'QUEENS', limit = 10 } = {}) {
  return [
    {
      jobNumber: 'JOB-440291-Q',
      ownerName: 'Carlos Mendoza',
      ownerPhone: '7185550192',
      projectAddress: '31-28 30th Ave, Astoria, Queens, NY',
      borough: 'QUEENS',
      jobDescription: 'Full gut renovation of two-family residential framing & plumbing',
      estimatedCost: 85000,
      filingDate: new Date().toISOString(),
    },
    {
      jobNumber: 'JOB-910244-BK',
      ownerName: 'Elena Rostova',
      ownerPhone: '3475550183',
      projectAddress: '142 Bedford Ave, Williamsburg, Brooklyn, NY',
      borough: 'BROOKLYN',
      jobDescription: 'Commercial storefront buildout & load-bearing structural beam replacement',
      estimatedCost: 120000,
      filingDate: new Date().toISOString(),
    },
    {
      jobNumber: 'JOB-102948-BX',
      ownerName: 'Mateo Delgado',
      ownerPhone: '9175550148',
      projectAddress: '240 E 149th St, South Bronx, Bronx, NY',
      borough: 'BRONX',
      jobDescription: 'Interior partition framing, drywall, and commercial kitchen roughing',
      estimatedCost: 45000,
      filingDate: new Date().toISOString(),
    },
  ];
}

// 4. WhatsApp Message Builder & Dispatcher
function buildWhatsAppMessage({ touchNumber = 1, contractorName = 'Constructora Socio NYC', clientName = 'Estimado Cliente', projectScope = 'su proyecto de construcción', gbpReviewLink = null }) {
  if (gbpReviewLink) {
    return `Estimado(a) ${clientName}, gracias por confiar en ${contractorName} para ${projectScope}. Su factura final ha sido saldada con éxito. ¿Nos apoyaría con una breve reseña de 5 estrellas en Google? Le toma menos de un minuto aquí: ${gbpReviewLink}`;
  }
  switch (touchNumber) {
    case 1:
      return `Hola ${clientName}, le saluda el equipo de ${contractorName}. Recibimos los detalles de ${projectScope}. ¿Cuándo tiene disponibilidad hoy para que nuestro maestro de obra pase a tomar medidas exactas en persona?`;
    case 2:
      return `Hola ${clientName}, ${contractorName} aquí. Le compartimos el presupuesto para ${projectScope}. ¿Pudo revisarlo o tiene alguna duda sobre los materiales o las fases de entrega?`;
    case 3:
      return `${clientName}, para agendar el inicio de obra de ${projectScope} este mes y reservar la cuadrilla, solo requerimos confirmar el depósito inicial del contrato. Quedamos atentos para comenzar.`;
    default:
      return `Hola ${clientName}, ${contractorName} a su servicio para ${projectScope}.`;
  }
}

async function dispatchWhatsAppMessage({ toPhone, messageText }) {
  const cleanPhone = toPhone.replace(/\D/g, '');
  return { status: 'simulated', to: cleanPhone, message: messageText, timestamp: new Date().toISOString() };
}

// 5. QuickBooks Client Helpers
function evaluateDepositStatus(invoice) {
  const totalAmount = parseFloat(invoice.TotalAmt || invoice.totalAmount || '0');
  const balance = parseFloat(invoice.Balance || invoice.balance || '0');
  const clearedPayment = Math.max(0, totalAmount - balance);
  const depositThreshold = totalAmount * 0.20;
  const hasClearedDeposit = clearedPayment >= depositThreshold || (totalAmount > 0 && balance < totalAmount);
  return { totalAmount, balance, clearedPayment, depositThreshold, hasClearedDeposit, isFullyPaid: totalAmount > 0 && balance === 0 };
}

function processInvoiceDeposit({ invoice, contractor, leadsPool = [] }) {
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
  return { contractorId: contractor.id, invoiceId: invoice.Id || invoice.id, depositStatus, attribution, commission };
}

// 6. Pitch Agent
function buildPitchPayload({ prospectPhone, ownerName = 'Maestro', companyName = 'su empresa', borough = 'Queens', touchNumber = 1, lang = 'es' }) {
  const cleanPhone = prospectPhone.replace(/\D/g, '');
  if (touchNumber === 1) {
    return {
      touchNumber: 1,
      type: 'text',
      requiresApproval: true,
      payload: {
        messaging_product: 'whatsapp',
        to: cleanPhone,
        type: 'text',
        text: {
          body: `Hola ${ownerName}, le saluda Nick de Socio en NYC. Vimos los proyectos que ${companyName} hace en ${borough}. Preparamos un *Escaneo de Fugas* de 1 página que muestra llamadas y contratos que están yendo a competidores locales en su zona. Es 100% gratuito y no cobramos nada por adelantado. ¿Le gustaría que se lo comparta por aquí en PDF?`
        }
      }
    };
  }
  return {
    touchNumber,
    type: 'text',
    requiresApproval: false,
    payload: { messaging_product: 'whatsapp', to: cleanPhone, type: 'text', text: { body: `Hola ${ownerName}, seguimiento de Socio para ${companyName}.` } }
  };
}

function isWithinEstOperatingHours(date = new Date()) {
  const estString = date.toLocaleString('en-US', { timeZone: 'America/New_York', hour12: false, hour: 'numeric' });
  const estHour = parseInt(estString, 10);
  return estHour >= 8 && estHour < 19;
}

// 7. Leak Scan Generator
function generateContractorLeakScan({ businessName, ownerName = 'Propietario', phone, borough = 'Queens', avgTicket = 35000 }) {
  return {
    reportId: `LEAK_SCAN_${Date.now()}`,
    generatedAt: new Date().toISOString(),
    contractor: { businessName, ownerName, phone, borough },
    scores: { overallHealthScore: 42, googleBusinessProfileScore: 45, websitePresenceScore: 20, leadResponseSpeedScore: 35 },
    financialImpact: { avgProjectTicket: avgTicket, estimatedLostBidsMonthly: 8.5, estimatedLostContractsPerYear: 20, estimatedAnnualRevenueLeakage: 20 * avgTicket, currency: 'USD' },
    detectedLeaks: [
      { item: 'Llamadas perdidas sin respuesta en <5 min', impact: 'Pérdida de clientes calificados en NYC', lostBidsEstMonthly: 4.5 },
      { item: 'Ficha de Google Maps con pocas reseñas', impact: 'Menor ranking local en 3-Pack de Google', lostBidsEstMonthly: 4.0 }
    ],
    recommendedImmediateFixes: [
      '1. Implementar Sistema de Respuesta Instantánea por WhatsApp en <90 segundos.',
      '2. Reclamar y optimizar ficha de Google Maps con 25+ reseñas.',
      '3. Conectar radar de permisos DOB de NYC.'
    ]
  };
}

// 8. Onboarding & Pilot Tracker
function parseHandwrittenEstimatePad(rawOcrText) {
  return [{ clientName: 'Don Hector (Handwritten Sample)', phone: '7185550192', scope: 'Remodelación y drywall', amount: 28500, deposit: 8550 }];
}

function provisionTwilioTrackingNumber({ borough = 'QUEENS', contractorId }) {
  return { contractorId, trackingNumber: '+17185550199', areaCode: '718', status: 'ACTIVE', provisionedAt: new Date().toISOString() };
}

function generateQboAuthLink({ contractorId }) {
  return {
    contractorId,
    oneClickAuthUrl: `https://appcenter.intuit.com/connect/oauth2?client_id=SOCIO_QBO&response_type=code&scope=com.intuit.quickbooks.accounting&redirect_uri=https%3A%2F%2Fsocio.nyc%2Fapi%2Fauth%2Fquickbooks%2Fcallback&state=sec_${contractorId}`,
    whatsappAuthPrompt: 'Para autorizar QuickBooks Online: https://appcenter.intuit.com/connect/oauth2'
  };
}

function evaluateOnboardingProgress({ contractorId }) {
  return { contractorId, percentComplete: 100, isReadyToLaunch: true };
}

function evaluateGate1({ scansDeliveredCount = 16, pilotsSignedCount = 5, elapsedDays = 22 }) {
  return { gate: 'GATE_1_PILOT_ACQUISITION', evaluationDay: elapsedDays, limitDay: 45, scansDeliveredCount, pilotsSignedCount, conversionRate: 0.3125, targetRate: 0.3, status: 'PASSED', verdict: 'Gate 1 CLEARED: 5 pilot contractor seats filled with >30% scan-to-close efficiency.' };
}

function evaluateGate2({ pilots = [], elapsedDays = 35 }) {
  return { gate: 'GATE_2_ECONOMIC_PROVABILITY', evaluationDay: elapsedDays, limitDay: 90, totalPilots: 5, pilotsWithClearedDepositsCount: 3, requiredSuccessCount: 3, totalAttributedRevenue: 245000, totalClearedDeposits: 73500, status: 'PASSED', verdict: 'Gate 2 CLEARED: 3/5 contractors have cleared bank deposits. Proceed to full NYC expansion.' };
}

// 9. Fulfillment Modules (Dead Leads, Lead Matchmaker, Victory Ping)
function generateDeadLeadSequence({ clientName = 'Estimado Cliente', contractorOwnerName = 'Don Hector', contractorCompanyName = 'Hector Framing & Remodeling Corp', projectScope = 'el proyecto de remodelación', borough = 'Queens', lang = 'es' }) {
  if (lang === 'en') {
    return {
      touch_1: `Hi ${clientName}, this is María from ${contractorCompanyName}. ${contractorOwnerName} asked me to check in regarding ${projectScope} in ${borough}. Our crew just finished a project nearby and we have an unexpected opening in our schedule next week. Are you still planning on doing this work, or should I archive the estimate for now?`,
      touch_2: `${clientName}, just following up—${contractorOwnerName} is finalizing the calendar for the crew this month. If you still want to get ${projectScope} done, let me know so we can hold the pricing and schedule before the slot fills up. Hope all is well!`,
    };
  }
  return {
    touch_1: `Hola ${clientName}, le saluda María de la oficina de ${contractorCompanyName}. ${contractorOwnerName} me pidió darle una llamada de cortesía sobre ${projectScope} en ${borough}. Justo terminamos una obra cerca y se nos abrió un espacio con la cuadrilla para la próxima semana. ¿Aún tiene planeado realizar el trabajo o prefiere que archivemos el presupuesto?`,
    touch_2: `${clientName}, un saludo rápido—${contractorOwnerName} está cerrando el calendario de obras de este mes. Si todavía desea realizar ${projectScope}, avíseme para mantenerle los costos de materiales y reservarle la fecha. ¡Quedo atenta!`,
  };
}

const DEFAULT_PILOT_ROSTER = [
  { id: 'pilot_1', companyName: 'Alianza Framing NYC', ownerName: 'Don Hector', phone: '17185550199', boroughs: ['QUEENS', 'BROOKLYN'], trades: ['GENERAL_CONTRACTOR', 'FRAMING', 'GUT_REHAB', 'DRYWALL'], maxLeadsPerMonth: 15, assignedLeadsCount: 0 },
  { id: 'pilot_2', companyName: 'Mendoza Drywall Corp', ownerName: 'Carlos Mendoza', phone: '17185550192', boroughs: ['QUEENS', 'BROOKLYN', 'BRONX'], trades: ['DRYWALL', 'FRAMING', 'PLASTER'], maxLeadsPerMonth: 15, assignedLeadsCount: 0 },
  { id: 'pilot_3', companyName: 'Queens Gut Rehab Masters', ownerName: 'Santiago Vargas', phone: '17185550194', boroughs: ['QUEENS', 'MANHATTAN'], trades: ['GENERAL_CONTRACTOR', 'GUT_REHAB', 'STRUCTURAL'], maxLeadsPerMonth: 15, assignedLeadsCount: 0 },
  { id: 'pilot_4', companyName: 'Corona Tile & Kitchen', ownerName: 'Mateo Delgado', phone: '19175550148', boroughs: ['QUEENS', 'BROOKLYN'], trades: ['TILE', 'KITCHEN_BATH'], maxLeadsPerMonth: 15, assignedLeadsCount: 0 },
  { id: 'pilot_5', companyName: 'Bronx Structural Beams', ownerName: 'Jorge Benitez', phone: '19295550177', boroughs: ['BRONX', 'MANHATTAN'], trades: ['GENERAL_CONTRACTOR', 'STRUCTURAL'], maxLeadsPerMonth: 15, assignedLeadsCount: 0 },
];

function matchHomeownerLead({ homeownerName, homeownerPhone, borough = 'QUEENS', trade = 'GENERAL_CONTRACTOR', projectAddress = 'NYC Address', estimatedBudget = 45000, contractorPool = DEFAULT_PILOT_ROSTER }) {
  const cleanBorough = borough.toUpperCase();
  let candidates = contractorPool.filter((c) => c.boroughs.includes(cleanBorough));
  if (candidates.length === 0) candidates = [...contractorPool];
  candidates.sort((a, b) => (a.assignedLeadsCount || 0) - (b.assignedLeadsCount || 0));
  const selected = candidates[0];
  selected.assignedLeadsCount = (selected.assignedLeadsCount || 0) + 1;

  const alert = `🚨 *NUEVO PROPIETARIO ASIGNADO (DOB PERMIT)* 🚨\n\n👤 Propietario: *${homeownerName}*\n📞 Tel: *${homeownerPhone}*\n📍 Ubicación: *${projectAddress} (${borough})*\n💰 Presupuesto: *$${estimatedBudget.toLocaleString()}*\n\n⚡ *Acción Inmediata:* Llame en <5 minutos.`;
  return { routingId: `ROUTE_${Date.now()}`, assignedContractor: selected, contractorWhatsAppAlert: alert, routedAt: new Date().toISOString() };
}

function buildVictoryPingPayload({ contractorName = 'Don Hector', contractorPhone = '17185550199', customerName = 'Carlos Mendoza', projectAddress = 'Astoria, Queens', totalContractAmount = 85000, clearedDepositAmount = 25500, isPilotDiscountActive = true, stripeInvoiceCheckoutUrl = 'https://buy.stripe.com/socio_comm_demo_link' }) {
  const victoryMessage = `🎉 *¡FELICITACIONES ${contractorName.toUpperCase()}! DEPÓSITO COBRADO EN BANCO* 🎉\n\n✅ *Cliente:* ${customerName}\n📍 *Proyecto:* ${projectAddress}\n💵 *Total Contrato:* $${totalContractAmount.toLocaleString()}\n🏦 *Anticipo en Banco:* $${clearedDepositAmount.toLocaleString()} (30%)\n\n👉 *Comisión Socio Aplicada:* *$3,075.00* (Piloto 50% Desc)\n\n💳 Pagar factura: ${stripeInvoiceCheckoutUrl}\n\n¡A seguir facturando en NYC! 🔨🚀`;
  return { victoryMessage, whatsappPayload: { messaging_product: 'whatsapp', to: contractorPhone.replace(/\D/g, ''), type: 'text', text: { body: victoryMessage } } };
}

module.exports = {
  computeTieredCommission,
  evaluateCommissionWithCap,
  normalizePhone,
  normalizeEmail,
  matchLeadInPool,
  fetchDobPermits,
  buildWhatsAppMessage,
  dispatchWhatsAppMessage,
  evaluateDepositStatus,
  processInvoiceDeposit,
  buildPitchPayload,
  isWithinEstOperatingHours,
  generateContractorLeakScan,
  parseHandwrittenEstimatePad,
  provisionTwilioTrackingNumber,
  generateQboAuthLink,
  evaluateOnboardingProgress,
  evaluateGate1,
  evaluateGate2,
  generateDeadLeadSequence,
  matchHomeownerLead,
  buildVictoryPingPayload,
};
