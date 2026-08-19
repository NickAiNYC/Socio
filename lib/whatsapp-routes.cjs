/**
 * Socio — WhatsApp Business Cloud API Routes
 * GET  /api/whatsapp/webhook  — verification handshake
 * POST /api/whatsapp/webhook  — ingestion + async dispatch, signature validated
 * + outbound, consent, status endpoints (compliance-enforced)
 */

'use strict';

const crypto = require('crypto');
const {
  CONFIG,
  WHATSAPP_VERIFY_TOKEN,
  normalizePhoneNumber,
  isValidE164Digits,
  isQuietHours,
  isOptedOut,
  checkFrequencyCap,
  validateSignature,
  sendTextMessage,
  sendInteractiveButtonMessage,
  sendInteractiveListMessage,
  sendTemplateMessage,
  markMessageAsRead,
} = require('./whatsapp-engine.cjs');

const { routeInbound } = require('./whatsapp-router.cjs');

// ---------------------------------------------------------------------------
// Helpers: parse Meta webhook payload into normalized events
// ---------------------------------------------------------------------------
function parseMessagesFromBody(body) {
  const out = [];
  if (!body || body.object !== 'whatsapp_business_account') return out;
  for (const entry of body.entry || []) {
    for (const change of entry.changes || []) {
      const value = change.value || {};
      // Status updates
      if (value.statuses) {
        for (const st of value.statuses) out.push({ kind: 'status', status: st, metadata: value.metadata });
      }
      // Messages
      const contacts = value.contacts || [];
      const messages = value.messages || [];
      for (const msg of messages) {
        const contact = contacts.find((c) => c.wa_id === msg.from) || null;
        let kind = 'text';
        let textBody = '';
        let buttonId = null;
        let listId = null;
        let mediaId = null;
        let mediaType = null;

        switch (msg.type) {
          case 'text':
            kind = 'text';
            textBody = (msg.text && msg.text.body) ? msg.text.body : '';
            break;
          case 'button':
            kind = 'button';
            textBody = (msg.button && msg.button.text) ? msg.button.text : '';
            buttonId = (msg.button && msg.button.payload) ? msg.button.payload : textBody;
            break;
          case 'interactive': {
            const inter = msg.interactive || {};
            if (inter.type === 'button_reply') {
              kind = 'button_reply';
              buttonId = inter.button_reply && inter.button_reply.id;
              textBody = inter.button_reply && inter.button_reply.title ? inter.button_reply.title : buttonId;
            } else if (inter.type === 'list_reply') {
              kind = 'list_reply';
              listId = inter.list_reply && inter.list_reply.id;
              textBody = inter.list_reply && inter.list_reply.title ? inter.list_reply.title : listId;
            } else {
              kind = 'interactive';
              textBody = JSON.stringify(inter);
            }
            break;
          }
          case 'image':
          case 'audio':
          case 'video':
          case 'document':
          case 'sticker': {
            kind = 'media';
            mediaType = msg.type;
            const media = msg[msg.type] || {};
            mediaId = media.id || null;
            textBody = media.caption || '';
            break;
          }
          case 'location': {
            kind = 'location';
            textBody = msg.location ? `${msg.location.latitude},${msg.location.longitude}` : '';
            break;
          }
          case 'contacts': kind = 'contacts'; break;
          default: kind = msg.type || 'unknown';
        }

        out.push({
          kind: 'message',
          id: msg.id,
          from: msg.from,
          timestamp: msg.timestamp,
          type: msg.type,
          normalizedKind: kind,
          textBody,
          buttonId,
          listId,
          mediaId,
          mediaType,
          contact,
          raw: msg,
          metadata: value.metadata,
        });
      }
    }
  }
  return out;
}

// ---------------------------------------------------------------------------
// Raw-body capture for signature verification — we monkey-patch express.json
// verify callback via wrapping. If server.js already uses express.json, we
// add a tiny middleware that reconstructs rawBody from req.body when header
// is present (fallback: JSON.stringify). Actual HMAC check prefers rawBody.
// ---------------------------------------------------------------------------
function getRawBodyBuffer(req) {
  if (req.rawBody && Buffer.isBuffer(req.rawBody)) return req.rawBody;
  if (typeof req.rawBody === 'string') return Buffer.from(req.rawBody);
  // Fallback: deterministic stringify — Meta sends JSON without spaces on
  // webhook POST; we use JSON.stringify but warn if signature fails.
  try { return Buffer.from(JSON.stringify(req.body)); } catch { return Buffer.from(''); }
}

module.exports = function registerWhatsAppRoutes(app, getDb, saveDb) {

  // Ensure raw body is captured for the webhook route — add before json parser
  // has run is ideal, but we add a small companion that stashes stringified
  // body if rawBody not already present. No-op otherwise.
  app.use('/api/whatsapp/webhook', (req, _res, next) => {
    if (!req.rawBody && req.body && typeof req.body === 'object') {
      // Will be overwritten by express.json verify if configured
      req._socioFallbackRaw = JSON.stringify(req.body);
    }
    next();
  });

  // 1) Verification handshake
  app.get('/api/whatsapp/webhook', (req, res) => {
    const mode = req.query['hub.mode'];
    const token = req.query['hub.verify_token'];
    const challenge = req.query['hub.challenge'];
    const expected = CONFIG.verifyToken || WHATSAPP_VERIFY_TOKEN;

    if (mode === 'subscribe' && token === expected) {
      console.log('[WhatsApp Webhook] Handshake verified.');
      return res.status(200).send(challenge);
    }
    console.warn('[WhatsApp Webhook] Verification failed. mode=' + mode + ' tokenMatch=' + (token === expected));
    return res.status(403).send('Verification failed');
  });

  // 2) Ingestion endpoint — signature validated, 200 immediate, async dispatch
  app.post('/api/whatsapp/webhook', async (req, res) => {
    // Signature validation when APP_SECRET is configured.
    // If verify fails, we still return 200 to avoid Meta retries hammering,
    // but we log and skip processing (fail closed on content, not on ack).
    const sigHeader = req.headers['x-hub-signature-256'] || req.headers['x-hub-signature'] || '';
    const rawBuf = getRawBodyBuffer(req);
    let sigOk = true;
    let sigReason = 'skipped (no APP_SECRET)';
    if (CONFIG.appSecret) {
      const r = validateSignature(rawBuf, sigHeader, CONFIG.appSecret);
      sigOk = r.valid;
      sigReason = r.reason;
      if (!sigOk) {
        // Try fallback raw if we used stringify path
        if (req._socioFallbackRaw) {
          const alt = validateSignature(Buffer.from(req._socioFallbackRaw), sigHeader, CONFIG.appSecret);
          if (alt.valid) { sigOk = true; sigReason = 'ok (fallback raw)'; }
        }
      }
      if (!sigOk) {
        console.warn('[WhatsApp Webhook] Signature validation failed: ' + sigReason + ' — acking 200 but dropping payload.');
        // Still ack 200 so Meta stops retrying a poisoned payload — but do not process.
        return res.status(200).json({ status: 'EVENT_RECEIVED', signature: 'invalid', reason: sigReason });
      }
    }

    // Immediate ack — never hold Meta's webhook
    res.status(200).json({ status: 'EVENT_RECEIVED', signature: sigReason });

    // Async dispatch — do not block response
    setImmediate(async () => {
      try {
        const body = req.body;
        if (!body || body.object !== 'whatsapp_business_account') return;

        const db = getDb();
        if (!db.whatsapp_inbound) db.whatsapp_inbound = [];
        if (!db.whatsapp_suppression) db.whatsapp_suppression = [];
        if (!db.whatsapp_leads) db.whatsapp_leads = [];
        if (!db.whatsapp_sessions) db.whatsapp_sessions = {};
        if (!db.whatsapp_dispatches) db.whatsapp_dispatches = [];

        const events = parseMessagesFromBody(body);

        for (const ev of events) {
          if (ev.kind === 'status') {
            db.whatsapp_inbound.push({
              id: `status_${ev.status.id || Date.now()}`,
              type: 'status',
              status: ev.status.status,
              recipient: ev.status.recipient_id,
              timestamp: new Date(Number(ev.status.timestamp) * 1000 || Date.now()).toISOString(),
              raw: ev.status,
            });
            continue;
          }

          // Message event
          const senderPhone = normalizePhoneNumber(ev.from);
          const inboundRecord = {
            id: ev.id,
            from: senderPhone,
            waId: ev.from,
            body: ev.textBody || '',
            buttonId: ev.buttonId || null,
            listId: ev.listId || null,
            mediaId: ev.mediaId || null,
            mediaType: ev.mediaType || null,
            type: ev.type,
            normalizedKind: ev.normalizedKind,
            contactName: ev.contact ? ev.contact.profile.name : null,
            phoneNumberId: ev.metadata ? ev.metadata.phone_number_id : null,
            timestamp: new Date(Number(ev.timestamp) * 1000 || Date.now()).toISOString(),
            raw: ev.raw,
          };
          db.whatsapp_inbound.push(inboundRecord);

          // Auto-mark as read (best-effort, no await blocking)
          if (ev.id) markMessageAsRead(ev.id).catch(() => {});

          const textUpper = String(ev.textBody || '').trim().toUpperCase();

          // STOP / opt-out automation — check before router
          const stopKeywords = ['STOP', 'CANCEL', 'BAJA', 'UNSUBSCRIBE', 'ALTO', 'DETENER', 'PARAR', 'STOP ALL', 'END'];
          const startKeywords = ['START', 'UNSTOP', 'REANUDAR', 'ACTIVAR', 'ALTA', 'RESUBSCRIBE'];
          if (stopKeywords.includes(textUpper) || (ev.buttonId && stopKeywords.includes(String(ev.buttonId).toUpperCase()))) {
            const already = db.whatsapp_suppression.some((s) => s.phone === senderPhone);
            if (!already) {
              db.whatsapp_suppression.push({ phone: senderPhone, reason: 'USER_KEYWORD_OPT_OUT', keyword: textUpper || ev.buttonId, suppressedAt: new Date().toISOString() });
              console.log('[WhatsApp] Suppressed ' + senderPhone);
              await sendTextMessage(senderPhone, 'Socio: Has sido dado de baja. No recibirás más mensajes. Envía START para reanudar. / You have been unsubscribed. Reply START to resubscribe.').catch(() => {});
            }
            continue;
          }
          if (startKeywords.includes(textUpper) || (ev.buttonId && startKeywords.includes(String(ev.buttonId).toUpperCase()))) {
            db.whatsapp_suppression = db.whatsapp_suppression.filter((s) => s.phone !== senderPhone);
            await sendTextMessage(senderPhone, 'Socio: Has reanudado tus notificaciones. ¡Bienvenido de vuelta! / You have resubscribed to Socio updates.').catch(() => {});
            // Fall through to welcome flow after resubscribe
          }

          // Suppressed numbers: don't route further
          if (isOptedOut(senderPhone, db.whatsapp_suppression)) {
            console.log('[WhatsApp] Dropping message from suppressed ' + senderPhone);
            continue;
          }

          // Media handling — acknowledge and ask for text
          if (ev.normalizedKind === 'media') {
            await sendTextMessage(senderPhone, '¡Gracias por el archivo! 📎 Para ayudarte mejor, cuéntame en texto qué necesitas: Demo, Pricing, Support u Onboarding.').catch(() => {});
            continue;
          }
          if (ev.normalizedKind === 'location' || ev.normalizedKind === 'contacts') {
            await sendTextMessage(senderPhone, '¡Gracias! Recibimos tu ubicación/contacto. Un concierge te contacta en minutos. ¿En qué más te ayudo?').catch(() => {});
            continue;
          }

          // Route through conversational state machine
          try {
            const decision = await routeInbound({
              from: senderPhone,
              textBody: ev.textBody || '',
              buttonId: ev.buttonId || null,
              listId: ev.listId || null,
              messageType: ev.normalizedKind,
              rawMessage: ev.raw,
              db,
            }, { sendTextMessage, sendInteractiveButtonMessage, sendInteractiveListMessage });

            if (!decision || decision.action === 'ignore') continue;

            if (decision.action === 'reply') {
              if (decision.kind === 'text') {
                if (decision.buttons && decision.buttons.length) {
                  // Upgrade text + buttons to interactive button message
                  await sendInteractiveButtonMessage(senderPhone, decision.headerText || null, decision.text, decision.buttons).catch(async () => {
                    await sendTextMessage(senderPhone, decision.text).catch(() => {});
                  });
                } else {
                  await sendTextMessage(senderPhone, decision.text).catch(() => {});
                }
              } else if (decision.kind === 'button') {
                const r = await sendInteractiveButtonMessage(senderPhone, decision.headerText || null, decision.bodyText, decision.buttons).catch((e) => e);
                if (r && r.status === 'error' && r.mappedError && r.mappedError.code === 'WINDOW_VIOLATION') {
                  // Fallback to template outside 24h window
                  await sendTemplateMessage(senderPhone, 'hello_world', 'en_US', []).catch(() => {});
                }
              } else if (decision.kind === 'list') {
                const r = await sendInteractiveListMessage(senderPhone, decision.bodyText, decision.buttonText, decision.sections).catch((e) => e);
                if (r && r.status === 'error') {
                  // Fallback to buttons if list fails
                  await sendInteractiveButtonMessage(senderPhone, null, decision.bodyText, [{ id: 'book_a_call', title: '📅 Book a Call' }, { id: 'pricing', title: '💲 Pricing' }]).catch(() => {});
                }
              }
            }

            // Persist session mutations
            saveDb(db);
          } catch (routeErr) {
            console.error('[WhatsApp Router Error]', routeErr);
            // Graceful fallback — don't leave user hanging
            await sendTextMessage(senderPhone, 'Gracias por escribir a Socio. Un humano te responde en minutos. También puedes reservar directo: https://socio.nyc/book').catch(() => {});
          }
        }

        saveDb(db);
      } catch (err) {
        console.error('[WhatsApp Webhook Async Error]', err);
      }
    });
  });

  // 3) Outbound dispatch — compliance-enforced
  app.post('/api/whatsapp/send', async (req, res) => {
    try {
      const {
        to,
        templateName = 'hello_world',
        languageCode = 'en_US',
        components = [],
        text,
        businessId = 'NYC_PARTNER',
        vertical = 'GENERAL',
        forceBypassQuietHours = false,
      } = req.body || {};
      if (!to) return res.status(400).json({ error: 'Recipient phone number is required (field: "to")' });
      const cleanPhone = normalizePhoneNumber(to);
      if (!isValidE164Digits(cleanPhone)) return res.status(400).json({ error: 'Invalid phone number — must be E.164 (7–15 digits)', phone: cleanPhone });

      const db = getDb();
      if (!db.whatsapp_dispatches) db.whatsapp_dispatches = [];
      if (!db.whatsapp_suppression) db.whatsapp_suppression = [];

      if (isOptedOut(cleanPhone, db.whatsapp_suppression)) {
        return res.status(403).json({ error: 'Recipient has opted out (in suppression list)', phone: cleanPhone });
      }
      if (!forceBypassQuietHours && isQuietHours('America/New_York')) {
        return res.status(429).json({ error: 'Dispatch blocked by Quiet Hours (9 PM–8 AM ET). Use forceBypassQuietHours=true for critical alerts.', phone: cleanPhone });
      }
      const freq = checkFrequencyCap(cleanPhone, db.whatsapp_dispatches, 3);
      if (!freq.allowed) {
        return res.status(429).json({ error: 'Frequency cap reached: Max 3 messages per 7-day period', recentCount: freq.recentCount, maxPerWeek: freq.maxPerWeek });
      }

      let metaResponse;
      if (text) metaResponse = await sendTextMessage(cleanPhone, text);
      else metaResponse = await sendTemplateMessage(cleanPhone, templateName, languageCode, components);

      const dispatchRecord = {
        id: `wa_${Date.now()}_${Math.random().toString(36).slice(2, 7)}`,
        to: cleanPhone,
        toE164: '+' + cleanPhone,
        businessId, vertical,
        templateName: text ? 'DIRECT_TEXT' : templateName,
        metaStatus: metaResponse.status,
        mappedError: metaResponse.mappedError || null,
        metaResponse: metaResponse.data || metaResponse.error,
        timestamp: new Date().toISOString(),
      };
      db.whatsapp_dispatches.push(dispatchRecord);
      saveDb(db);

      if (metaResponse.status === 'success') return res.json({ status: 'success', dispatchId: dispatchRecord.id, phone: cleanPhone, phoneE164: '+' + cleanPhone, metaResponse: metaResponse.data });
      return res.status(metaResponse.statusCode || 500).json({ status: 'error', error: metaResponse.error, mappedError: metaResponse.mappedError || null });
    } catch (err) {
      console.error('[WhatsApp Send Error]', err);
      return res.status(500).json({ error: err.message });
    }
  });

  // 4) Consent capture
  app.post('/api/whatsapp/consent', (req, res) => {
    try {
      const { phone, businessName, vertical, sourcePath, consentText } = req.body || {};
      if (!phone) return res.status(400).json({ error: 'Phone number is required' });
      const cleanPhone = normalizePhoneNumber(phone);
      if (!isValidE164Digits(cleanPhone)) return res.status(400).json({ error: 'Invalid phone number — E.164 required', phone: cleanPhone });
      const db = getDb();
      if (!db.whatsapp_consents) db.whatsapp_consents = [];
      const record = {
        phone: cleanPhone,
        phoneE164: '+' + cleanPhone,
        businessName: businessName || '',
        vertical: vertical || 'GENERAL',
        sourcePath: sourcePath || '/',
        consentText: consentText || 'I agree to receive SMS/WhatsApp performance updates from Socio.',
        ip: req.ip || req.headers['x-forwarded-for'] || '',
        timestamp: new Date().toISOString(),
      };
      db.whatsapp_consents.push(record);
      if (db.whatsapp_suppression) db.whatsapp_suppression = db.whatsapp_suppression.filter((s) => s.phone !== cleanPhone);
      saveDb(db);
      return res.json({ status: 'success', consent: record });
    } catch (err) {
      return res.status(500).json({ error: err.message });
    }
  });

  // 5) Status & diagnostics
  app.get('/api/whatsapp/status', (req, res) => {
    const db = getDb();
    const dispatches = db.whatsapp_dispatches || [];
    const suppression = db.whatsapp_suppression || [];
    const inbound = db.whatsapp_inbound || [];
    const consents = db.whatsapp_consents || [];
    const sessions = db.whatsapp_sessions || {};
    const leads = db.whatsapp_leads || [];
    return res.json({
      status: 'operational',
      graphVersion: CONFIG.graphVersion,
      phoneNumberId: CONFIG.phoneNumberId,
      wabaId: CONFIG.businessAccountId,
      totalDispatches: dispatches.length,
      suppressedCount: suppression.length,
      inboundCount: inbound.length,
      consentsCount: consents.length,
      sessionsCount: Object.keys(sessions).length,
      leadsCount: leads.length,
      isQuietHoursNow: isQuietHours('America/New_York'),
      recentDispatches: dispatches.slice(-5),
    });
  });

  // 6) Test hello-world
  app.post('/api/whatsapp/test-hello', async (req, res) => {
    try {
      const { to } = req.body || {};
      if (!to) return res.status(400).json({ error: 'Recipient phone number is required (field: "to")' });
      const result = await sendTemplateMessage(to, 'hello_world', 'en_US', []);
      return res.status(result.status === 'success' ? 200 : (result.statusCode || 500)).json(result);
    } catch (err) {
      return res.status(500).json({ error: err.message });
    }
  });
};
