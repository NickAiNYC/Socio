/**
 * Socio — WhatsApp Conversational Router / State Machine
 * Keyword triggers, welcome sequences, FAQ auto-replies, lead qualification.
 */

'use strict';

const { normalizePhoneNumber, isValidE164Digits } = require('./whatsapp-engine.cjs');

// ---------------------------------------------------------------------------
// Keyword & intent definitions
// ---------------------------------------------------------------------------
const KEYWORDS = {
  DEMO: ['demo', 'demostracion', 'demostración'],
  PRICING: ['pricing', 'precio', 'precios', 'cost', 'costo', 'price'],
  SUPPORT: ['support', 'soporte', 'ayuda', 'help', 'problema'],
  ONBOARDING: ['onboarding', 'empezar', 'comenzar', 'start', 'registro'],
  HUMAN: ['talk to human', 'human', 'humano', 'agente', 'agent', 'hablar con humano', 'operador'],
};

const BUTTON_IDS = {
  EXPLORE_FEATURES: 'explore_features',
  BOOK_A_CALL: 'book_a_call',
  PRICING: 'pricing',
  TALK_TO_HUMAN: 'talk_to_human',
  SUPPORT: 'support',
  ONBOARDING: 'onboarding',
  DEMO: 'demo',
};

// Quick-reply button sets that the router sends
const BUTTON_SETS = {
  WELCOME: [
    { id: BUTTON_IDS.EXPLORE_FEATURES, title: '✨ Explore Features' },
    { id: BUTTON_IDS.BOOK_A_CALL, title: '📅 Book a Call' },
    { id: BUTTON_IDS.PRICING, title: '💲 Pricing' },
  ],
  QUALIFIED: [
    { id: BUTTON_IDS.BOOK_A_CALL, title: '📅 Book a Call' },
    { id: BUTTON_IDS.TALK_TO_HUMAN, title: '💬 Talk to Human' },
  ],
  SUPPORT: [
    { id: BUTTON_IDS.TALK_TO_HUMAN, title: '💬 Talk to Human' },
    { id: BUTTON_IDS.ONBOARDING, title: '🚀 Onboarding' },
  ],
};

const FAQ_MAP = [
  { keywords: ['horario', 'hours', 'abierto'], answer: '🕘 Estamos disponibles Lun–Sáb 9am–7pm ET. ¡Fuera de ese horario, deja tu mensaje y te respondemos en <90 seg al abrir!' },
  { keywords: ['donde', 'where', 'ubicacion', 'location', 'nyc'], answer: '📍 Socio es 100% NYC — trabajamos con comercios locales en los 5 boroughs. ¿En qué barrio está tu negocio?' },
  { keywords: ['comision', 'commission', 'cobran', 'fee'], answer: '💸 Cero adelantos. Solo 10–15% sobre el revenue *nuevo* que generamos y que tu POS/QBO confirma. Si no creces, no cobramos.' },
  { keywords: ['contrato', 'contract', 'cancelar', 'cancel'], answer: '📄 Sin contratos forzados. Cancela cuando quieras — te quedas con todos tus datos. Nuestra garantía es performance.' },
];

function detectIntent(text) {
  const lower = String(text || '').toLowerCase();
  if (KEYWORDS.HUMAN.some((k) => lower.includes(k))) return 'HUMAN';
  if (KEYWORDS.DEMO.some((k) => lower.includes(k))) return 'DEMO';
  if (KEYWORDS.PRICING.some((k) => lower.includes(k))) return 'PRICING';
  if (KEYWORDS.SUPPORT.some((k) => lower.includes(k))) return 'SUPPORT';
  if (KEYWORDS.ONBOARDING.some((k) => lower.includes(k))) return 'ONBOARDING';
  return null;
}

function faqAnswer(text) {
  const lower = String(text || '').toLowerCase();
  for (const entry of FAQ_MAP) {
    if (entry.keywords.some((k) => lower.includes(k))) return entry.answer;
  }
  return null;
}

// ---------------------------------------------------------------------------
// Session store helpers — persisted in the JSON db (whatsapp_sessions)
// ---------------------------------------------------------------------------
function getSession(db, phone) {
  if (!db.whatsapp_sessions) db.whatsapp_sessions = {};
  if (!db.whatsapp_sessions[phone]) {
    db.whatsapp_sessions[phone] = {
      phone,
      state: 'NEW', // NEW | WELCOMED | QUALIFYING | QUALIFIED | HUMAN_HANDOFF | SUPPRESSED
      firstSeenAt: new Date().toISOString(),
      lastInboundAt: null,
      lead: null,
      history: [],
    };
  }
  return db.whatsapp_sessions[phone];
}

function pushHistory(session, role, content) {
  session.history.push({ role, content, ts: new Date().toISOString() });
  if (session.history.length > 50) session.history = session.history.slice(-50);
}

// ---------------------------------------------------------------------------
// Lead capture — E.164 formatted storage
// ---------------------------------------------------------------------------
function upsertLead(db, phoneDigits, extra = {}) {
  if (!db.whatsapp_leads) db.whatsapp_leads = [];
  let lead = db.whatsapp_leads.find((l) => l.phone === phoneDigits);
  if (!lead) {
    lead = {
      phone: phoneDigits,
      phoneE164: '+' + phoneDigits,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      status: 'new',
      source: 'whatsapp',
      ...extra,
    };
    db.whatsapp_leads.push(lead);
  } else {
    Object.assign(lead, extra, { updatedAt: new Date().toISOString() });
  }
  return lead;
}

// ---------------------------------------------------------------------------
// Main router — returns an object describing what to send
// ---------------------------------------------------------------------------
async function routeInbound({ from, textBody, buttonId, listId, messageType, rawMessage, db }, client) {
  const phone = normalizePhoneNumber(from);
  if (!isValidE164Digits(phone)) {
    return { action: 'ignore', reason: 'invalid_phone' };
  }

  const session = getSession(db, phone);
  session.lastInboundAt = new Date().toISOString();

  const inboundText = String(textBody || buttonId || listId || '').trim();
  const lowerText = inboundText.toLowerCase();

  // Track inbound
  pushHistory(session, 'user', inboundText || `[${messageType}]`);
  upsertLead(db, phone, { lastMessage: inboundText, lastMessageType: messageType });

  // STOP / opt-out is handled at the webhook layer — router won't be called for STOP
  // But treat human triggers explicitly
  // Determine intent from text OR button id
  const effectiveText = buttonId || listId || textBody || '';
  let intent = detectIntent(effectiveText);

  // Button-id direct mapping overrides text detection
  if (buttonId) {
    if (buttonId === BUTTON_IDS.EXPLORE_FEATURES) intent = 'EXPLORE';
    else if (buttonId === BUTTON_IDS.BOOK_A_CALL) intent = 'BOOK';
    else if (buttonId === BUTTON_IDS.PRICING) intent = 'PRICING';
    else if (buttonId === BUTTON_IDS.TALK_TO_HUMAN) intent = 'HUMAN';
    else if (buttonId === BUTTON_IDS.SUPPORT) intent = 'SUPPORT';
    else if (buttonId === BUTTON_IDS.ONBOARDING) intent = 'ONBOARDING';
    else if (buttonId === BUTTON_IDS.DEMO) intent = 'DEMO';
  }

  // FAQ auto-reply takes precedence if no high-intent trigger matched
  if (!intent) {
    const faq = faqAnswer(inboundText);
    if (faq) {
      return {
        action: 'reply',
        kind: 'text',
        text: faq,
        buttons: BUTTON_SETS.WELCOME,
        sessionState: session.state,
      };
    }
  }

  // State-machine branching
  switch (intent) {
    case 'DEMO': {
      session.state = 'QUALIFIED';
      return {
        action: 'reply',
        kind: 'button',
        headerText: '🚀 Socio Demo',
        bodyText: '¡Perfecto! Te mostramos cómo Socio recupera revenue perdido en 48h sin adelantos.\n\n• Auditoría gratuita de fugas de revenue\n• Agentes IA bilingües 24/7\n• Solo pagas 10–15% del crecimiento verificado',
        buttons: [
          { id: BUTTON_IDS.BOOK_A_CALL, title: '📅 Book a Call' },
          { id: BUTTON_IDS.EXPLORE_FEATURES, title: '✨ Explore Features' },
        ],
      };
    }
    case 'PRICING': {
      session.state = 'QUALIFIED';
      return {
        action: 'reply',
        kind: 'button',
        headerText: '💲 Socio Pricing',
        bodyText: 'Cero retainers. Cero sorpresas.\n\n• 0$ upfront\n• 10–15% solo sobre revenue NUEVO verificado en tu POS/QBO\n• Sin contratos forzados — cancela cuando quieras\n\n¿Quieres que calculemos tu ROI estimado?',
        buttons: [
          { id: BUTTON_IDS.BOOK_A_CALL, title: '📅 Book a Call' },
          { id: BUTTON_IDS.TALK_TO_HUMAN, title: '💬 Talk to Human' },
        ],
      };
    }
    case 'SUPPORT': {
      session.state = 'HUMAN_HANDOFF';
      return {
        action: 'reply',
        kind: 'button',
        headerText: '🛟 Socio Support',
        bodyText: 'Estamos aquí. Cuéntanos en 1 línea qué necesitas y un concierge te responde en <90 seg.\n\n¿Es sobre tu auditoría, tu cuenta, o algo urgente en tienda?',
        buttons: BUTTON_SETS.SUPPORT,
      };
    }
    case 'ONBOARDING': {
      session.state = 'QUALIFYING';
      return {
        action: 'reply',
        kind: 'button',
        headerText: '🚀 Onboarding',
        bodyText: '¡Vamos a lanzarte en 48h!\n\n1️⃣ Auditoría gratuita\n2️⃣ Firmas tu Pilot Agreement (sin adelantos)\n3️⃣ Conectamos tu POS/Google/Instagram y activamos los agentes\n\n¿Con qué vertical te identificas?',
        buttons: [
          { id: 'vertical_florist', title: '🌸 Florist' },
          { id: 'vertical_restaurant', title: '🍽 Restaurant' },
          { id: 'vertical_clinic', title: '💆 Clinic' },
        ],
      };
    }
    case 'HUMAN': {
      session.state = 'HUMAN_HANDOFF';
      upsertLead(db, phone, { requestedHuman: true, status: 'human_requested' });
      return {
        action: 'reply',
        kind: 'text',
        text: '✅ Te conectamos con un humano. Un miembro de Socio te escribe por aquí en los próximos 5 min. Si es urgente, responde con tu nombre + negocio y lo priorizamos.',
        humanHandoff: true,
      };
    }
    case 'BOOK': {
      session.state = 'QUALIFIED';
      return {
        action: 'reply',
        kind: 'text',
        text: '📅 ¡Agenda directo! Reserva tu Revenue Recovery Call aquí: https://socio.nyc/book — o responde con tu disponibilidad (ej: "Mañana 3pm ET") y te confirmamos por aquí.',
      };
    }
    case 'EXPLORE': {
      return {
        action: 'reply',
        kind: 'list',
        bodyText: 'Explora lo que Socio hace por comercios NYC:',
        buttonText: 'Ver opciones',
        sections: [
          {
            title: 'Socio Growth OS',
            rows: [
              { id: 'feat_recovery', title: 'Revenue Recovery Map', description: 'Auditoría 48h de fugas' },
              { id: 'feat_agents', title: 'IA Bilingüe 24/7', description: 'WhatsApp/SMS + voz' },
              { id: 'feat_evidence', title: 'Evidence Ledger', description: 'POS-matched proof' },
            ],
          },
          {
            title: 'Verticales',
            rows: [
              { id: 'vertical_florist', title: 'Floristas', description: 'Radar Floral + recarga' },
              { id: 'vertical_restaurant', title: 'Restaurantes', description: 'Radar Gastronómico' },
              { id: 'vertical_contractor', title: 'Contratistas', description: 'DOB permits pipeline' },
            ],
          },
        ],
      };
    }
    default: break;
  }

  // New contact — welcome sequence
  if (session.state === 'NEW') {
    session.state = 'WELCOMED';
    return {
      action: 'reply',
      kind: 'button',
      headerText: '👋 Bienvenido a Socio',
      bodyText: 'Hola — soy Socio, tu partner de crecimiento para comercios NYC.\n\nRecuperamos revenue que ya dejaste en la mesa. Sin adelantos. Solo cobramos si creces.\n\n¿En qué te ayudo hoy?',
      buttons: BUTTON_SETS.WELCOME,
    };
  }

  // Fallback — qualifying nudge + lead capture ask
  if (session.state === 'WELCOMED' || session.state === 'QUALIFYING') {
    // If message looks like a business name, capture it
    if (inboundText.length >= 3 && inboundText.length <= 80 && !detectIntent(inboundText) && !faqAnswer(inboundText)) {
      upsertLead(db, phone, { businessNameGuess: inboundText, status: 'qualifying' });
      return {
        action: 'reply',
        kind: 'button',
        headerText: 'Gracias 🙏',
        bodyText: `Perfecto — anotado: "${inboundText}".\n\n¿En qué barrio de NYC estás y cuál es tu mayor dolor hoy: clientes nuevos, recompra, o ticket promedio?`,
        buttons: BUTTON_SETS.WELCOME,
      };
    }
    return {
      action: 'reply',
      kind: 'button',
      headerText: 'Socio está aquí',
      bodyText: 'Cuéntame: ¿cómo se llama tu negocio y en qué vertical estás? Responde en una línea y te armamos el mapa de recuperación.',
      buttons: BUTTON_SETS.WELCOME,
    };
  }

  // Generic fallback
  return {
    action: 'reply',
    kind: 'button',
    headerText: 'Socio',
    bodyText: 'Gracias por escribir. ¿Te ayudo con Demo, Pricing, Support u Onboarding? Toca una opción:',
    buttons: BUTTON_SETS.WELCOME,
  };
}

module.exports = {
  KEYWORDS,
  BUTTON_IDS,
  BUTTON_SETS,
  detectIntent,
  faqAnswer,
  getSession,
  upsertLead,
  routeInbound,
};
