const test = require('node:test');
const assert = require('node:assert/strict');
const { normalizePhoneNumber, validateSignature, mapMetaError, CONFIG } = require('../lib/whatsapp-engine.cjs');
const { detectIntent, faqAnswer, routeInbound, BUTTON_IDS } = require('../lib/whatsapp-router.cjs');
const crypto = require('node:crypto');

// ---------------------------------------------------------------------------
// detectIntent + faq
// ---------------------------------------------------------------------------
test('Router: detectIntent matches bilingual keywords', () => {
  assert.equal(detectIntent('I want a Demo'), 'DEMO');
  assert.equal(detectIntent('precio por favor'), 'PRICING');
  assert.equal(detectIntent('need SUPPORT'), 'SUPPORT');
  assert.equal(detectIntent('quiero onboarding'), 'ONBOARDING');
  assert.equal(detectIntent('talk to human please'), 'HUMAN');
  assert.equal(detectIntent('hablar con humano'), 'HUMAN');
  assert.equal(detectIntent('hello'), null);
});

test('Router: faqAnswer returns match or null', () => {
  assert.ok(faqAnswer('what are your hours?').includes('9am'));
  assert.equal(faqAnswer('random message xyz'), null);
});

// ---------------------------------------------------------------------------
// routeInbound — welcome, keyword, button, FAQ, E.164 lead capture
// ---------------------------------------------------------------------------
test('Router: welcome sequence for NEW contact', async () => {
  const db = {};
  const decision = await routeInbound({ from: '19175551234', textBody: 'hello', buttonId: null, listId: null, messageType: 'text', rawMessage: {}, db }, {});
  assert.equal(decision.action, 'reply');
  assert.equal(decision.kind, 'button');
  assert.ok((decision.headerText && decision.headerText.includes('Bienvenido')) || (decision.bodyText && decision.bodyText.includes('Socio')));
  assert.equal(db.whatsapp_sessions['19175551234'].state, 'WELCOMED');
  assert.ok(db.whatsapp_leads.some((l) => l.phone === '19175551234' && l.phoneE164 === '+19175551234'));
});

test('Router: Demo keyword triggers demo handler with buttons', async () => {
  const db = {};
  const d = await routeInbound({ from: '19175551234', textBody: 'Demo', buttonId: null, listId: null, messageType: 'text', rawMessage: {}, db }, {});
  assert.equal(d.headerText, '🚀 Socio Demo');
  assert.ok(d.buttons.some((b) => b.id === BUTTON_IDS.BOOK_A_CALL));
});

test('Router: Pricing keyword triggers pricing handler', async () => {
  const db = {};
  const d = await routeInbound({ from: '19175551234', textBody: 'Pricing', buttonId: null, listId: null, messageType: 'text', rawMessage: {}, db }, {});
  assert.equal(d.headerText, '💲 Socio Pricing');
});

test('Router: Talk to Human triggers handoff and marks lead', async () => {
  const db = {};
  const d = await routeInbound({ from: '19175551234', textBody: 'Talk to Human', buttonId: null, listId: null, messageType: 'text', rawMessage: {}, db }, {});
  assert.equal(d.humanHandoff, true);
  assert.equal(db.whatsapp_leads.find((l) => l.phone === '19175551234').requestedHuman, true);
});

test('Router: buttonId overrides text detection', async () => {
  const db = {};
  const d = await routeInbound({ from: '19175551234', textBody: 'ignored', buttonId: 'pricing', listId: null, messageType: 'button_reply', rawMessage: {}, db }, {});
  assert.equal(d.headerText, '💲 Socio Pricing');
});

test('Router: FAQ auto-reply when no high-intent match', async () => {
  const db = { whatsapp_sessions: { '19175551234': { phone: '19175551234', state: 'WELCOMED', history: [], lastInboundAt: null, lead: null } }, whatsapp_leads: [] };
  const d = await routeInbound({ from: '19175551234', textBody: 'what is your comision?', buttonId: null, listId: null, messageType: 'text', rawMessage: {}, db }, {});
  assert.equal(d.kind, 'text');
  assert.ok(d.text.includes('Cero adelantos'));
});

test('Router: stores lead in E.164 format (+ prefix)', async () => {
  const db = {};
  await routeInbound({ from: '+1 (917) 555-1234', textBody: 'hello', buttonId: null, listId: null, messageType: 'text', rawMessage: {}, db }, {});
  const lead = db.whatsapp_leads[0];
  assert.equal(lead.phone, '19175551234');
  assert.equal(lead.phoneE164, '+19175551234');
});

test('Router: Explore Features returns list message', async () => {
  const db = {};
  const d = await routeInbound({ from: '19175551234', textBody: '', buttonId: BUTTON_IDS.EXPLORE_FEATURES, listId: null, messageType: 'button_reply', rawMessage: {}, db }, {});
  assert.equal(d.kind, 'list');
  assert.ok(Array.isArray(d.sections));
});

// ---------------------------------------------------------------------------
// Engine: signature + error mapping
// ---------------------------------------------------------------------------
test('Engine: validateSignature verifies HMAC-SHA256', () => {
  const secret = 'test_secret_123';
  const body = Buffer.from(JSON.stringify({ object: 'whatsapp_business_account' }));
  const sig = 'sha256=' + crypto.createHmac('sha256', secret).update(body).digest('hex');
  const ok = validateSignature(body, sig, secret);
  assert.equal(ok.valid, true);
  const bad = validateSignature(body, 'sha256=deadbeef', secret);
  assert.equal(bad.valid, false);
});

test('Engine: mapMetaError maps known codes', () => {
  const m1 = mapMetaError({ error: { code: 190, message: 'token expired', fbtrace_id: 'x' } });
  assert.equal(m1.code, 'TOKEN_EXPIRED');
  const m2 = mapMetaError({ error: { code: 131030, message: 'invalid' } });
  assert.equal(m2.code, 'INVALID_PHONE');
  const m3 = mapMetaError({ error: { code: 470, message: 'window' } });
  assert.equal(m3.code, 'WINDOW_VIOLATION');
  const m4 = mapMetaError({ error: { error_subcode: 131047, message: 'window' } });
  assert.equal(m4.code, 'WINDOW_VIOLATION');
});
