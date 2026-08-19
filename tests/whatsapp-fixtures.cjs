#!/usr/bin/env node
/**
 * Socio WhatsApp — payload fixtures + local simulator
 * Usage:
 *   node tests/whatsapp-fixtures.cjs --dry              # print payloads + router decisions, no network
 *   node tests/whatsapp-fixtures.cjs                    # POST to localhost:3030/api/whatsapp/webhook
 *   HOST=https://your-tunnel.ngrok.io node tests/whatsapp-fixtures.cjs
 *
 * Each fixture mirrors a real Meta Graph API webhook event (v20.0):
 *   object: whatsapp_business_account, entry[].changes[].value.messages[]
 * Covers: text, button_reply, list_reply, media (image), STOP/START, location.
 */

'use strict';
const crypto = require('crypto');
const http = require('http');
const https = require('https');

const HOST = process.env.HOST || 'http://localhost:3030';
const VERIFY_TOKEN = process.env.WHATSAPP_WEBHOOK_VERIFY_TOKEN || process.env.WHATSAPP_VERIFY_TOKEN || 'socio_wa_verify_2026';
const APP_SECRET = process.env.META_APP_SECRET || process.env.WHATSAPP_APP_SECRET || '';
const DRY = process.argv.includes('--dry');

function waPayload({ from = '19175551234', id = 'wamid.test1', type = 'text', body = 'Hello', extra = {} } = {}) {
  const message = { from, id, timestamp: String(Math.floor(Date.now() / 1000)), type };
  if (type === 'text') message.text = { body };
  else if (type === 'interactive') {
    // extra.interactive should be provided
    message.interactive = extra.interactive;
  } else if (type === 'image' || type === 'document' || type === 'audio' || type === 'video') {
    message[type] = { id: 'media_' + id, caption: body, mime_type: type === 'image' ? 'image/jpeg' : 'application/octet-stream' };
  } else if (type === 'location') {
    message.location = { latitude: 40.7128, longitude: -74.0060, name: 'NYC' };
  }
  Object.assign(message, extra.messageOverrides || {});
  return {
    object: 'whatsapp_business_account',
    entry: [{ id: '1915462325789357', changes: [{ value: { messaging_product: 'whatsapp', metadata: { display_phone_number: '19175551234', phone_number_id: '1180138218526038' }, contacts: [{ profile: { name: 'Test User' }, wa_id: from }], messages: [message] }, field: 'messages' }] }],
  };
}

const FIXTURES = [
  { name: 'text_hello (triggers welcome)', payload: waPayload({ body: 'Hello' }) },
  { name: 'keyword_demo', payload: waPayload({ body: 'Demo' }) },
  { name: 'keyword_pricing (es)', payload: waPayload({ body: 'precio' }) },
  { name: 'keyword_support', payload: waPayload({ body: 'Support' }) },
  { name: 'keyword_onboarding', payload: waPayload({ body: 'Onboarding' }) },
  { name: 'keyword_talk_to_human', payload: waPayload({ body: 'Talk to Human' }) },
  {
    name: 'button_reply Explore Features',
    payload: waPayload({ type: 'interactive', extra: { interactive: { type: 'button_reply', button_reply: { id: 'explore_features', title: '✨ Explore Features' } } } }),
  },
  {
    name: 'button_reply Pricing',
    payload: waPayload({ type: 'interactive', extra: { interactive: { type: 'button_reply', button_reply: { id: 'pricing', title: '💲 Pricing' } } } }),
  },
  {
    name: 'list_reply selection',
    payload: waPayload({ type: 'interactive', extra: { interactive: { type: 'list_reply', list_reply: { id: 'feat_recovery', title: 'Revenue Recovery Map', description: 'Auditoría 48h' } } } }),
  },
  { name: 'media_image with caption', payload: waPayload({ type: 'image', body: 'My store photo' }) },
  { name: 'location', payload: waPayload({ type: 'location' }) },
  { name: 'STOP keyword (suppression)', payload: waPayload({ body: 'STOP' }) },
  { name: 'START keyword (resubscribe)', payload: waPayload({ body: 'START' }) },
  { name: 'faq_hours', payload: waPayload({ body: 'What are your hours?' }) },
];

function signatureFor(bodyStr, secret) {
  if (!secret) return '(no APP_SECRET — signature not computed)';
  return 'sha256=' + crypto.createHmac('sha256', secret).update(Buffer.from(bodyStr)).digest('hex');
}

async function routeDryRun() {
  const { routeInbound } = require('../lib/whatsapp-router.cjs');
  console.log('— Dry run: router decisions (no network) —\n');
  for (const f of FIXTURES) {
    const msg = f.payload.entry[0].changes[0].value.messages[0];
    const textBody = msg.text ? msg.text.body : (msg.interactive && msg.interactive.button_reply ? msg.interactive.button_reply.title : (msg.interactive && msg.interactive.list_reply ? msg.interactive.list_reply.title : (msg.image ? msg.image.caption : (msg.location ? 'location' : ''))));
    const buttonId = msg.interactive && msg.interactive.button_reply ? msg.interactive.button_reply.id : (msg.interactive && msg.interactive.list_reply ? msg.interactive.list_reply.id : null);
    const db = {};
    const textual = textBody || '';
    let intent = '(n/a)';
    try { intent = require('../lib/whatsapp-router.cjs').detectIntent(textual) || '(no keyword)'; } catch (_) {}
    const decision = await routeInbound({ from: msg.from, textBody: textual, buttonId, listId: buttonId, messageType: msg.type, rawMessage: msg, db }, {});
    const bodyStr = JSON.stringify(f.payload);
    console.log(`● ${f.name}`);
    console.log(`  from=${msg.from} type=${msg.type} text=${JSON.stringify(textual)} intent=${intent}`);
    console.log(`  decision: ${JSON.stringify({ action: decision.action, kind: decision.kind, headerText: decision.headerText || undefined, buttons: decision.buttons ? decision.buttons.map((b)=>b.id) : undefined }, null, 2).replace(/\n/g, '\n  ')}`);
    console.log(`  X-Hub-Signature-256: ${signatureFor(bodyStr, APP_SECRET)}`);
    console.log('');
  }
}

function postJson(urlStr, bodyStr, headers = {}) {
  return new Promise((resolve, reject) => {
    const u = new URL(urlStr);
    const lib = u.protocol === 'https:' ? https : http;
    const req = lib.request({ hostname: u.hostname, port: u.port || (u.protocol === 'https:' ? 443 : 80), path: u.pathname + u.search, method: 'POST', headers: { 'Content-Type': 'application/json', 'Content-Length': Buffer.byteLength(bodyStr), ...headers } }, (res) => {
      let data = '';
      res.on('data', (c) => (data += c));
      res.on('end', () => resolve({ status: res.statusCode, headers: res.headers, body: data }));
    });
    req.on('error', reject);
    req.write(bodyStr);
    req.end();
  });
}

async function liveRun() {
  console.log(`— Live run: POST to ${HOST}/api/whatsapp/webhook —\n`);
  // First verify GET handshake works
  const verifyUrl = `${HOST}/api/whatsapp/webhook?hub.mode=subscribe&hub.verify_token=${encodeURIComponent(VERIFY_TOKEN)}&hub.challenge=12345`;
  console.log(`GET ${verifyUrl}`);
  const getLib = verifyUrl.startsWith('https:') ? https : http;
  await new Promise((resolve) => {
    getLib.get(verifyUrl, (res) => {
      let d = '';
      res.on('data', (c) => (d += c));
      res.on('end', () => { console.log(`  → ${res.statusCode} body=${d.slice(0, 120)}\n`); resolve(); });
    }).on('error', (e) => { console.log(`  → error: ${e.message}\n`); resolve(); });
  });

  for (const f of FIXTURES) {
    const bodyStr = JSON.stringify(f.payload);
    const sig = APP_SECRET ? 'sha256=' + crypto.createHmac('sha256', APP_SECRET).update(Buffer.from(bodyStr)).digest('hex') : undefined;
    const headers = {};
    if (sig) headers['X-Hub-Signature-256'] = sig;
    process.stdout.write(`POST ${f.name} (${f.payload.entry[0].changes[0].value.messages[0].type}) ... `);
    try {
      const r = await postJson(`${HOST}/api/whatsapp/webhook`, bodyStr, headers);
      console.log(`${r.status} ${r.body.slice(0, 140)}`);
    } catch (e) {
      console.log(`error: ${e.message}`);
    }
    await new Promise((r) => setTimeout(r, 250));
  }
  console.log('\nDone. Check server logs for router output and DB at outputs/socio_production.json');
}

(async () => {
  if (DRY) await routeDryRun();
  else await liveRun();
})();
