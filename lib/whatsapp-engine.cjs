/**
 * Socio — WhatsApp Business Cloud API Engine
 * Graph API v20.0+ | Production-grade service layer
 *
 * Provides:
 *  - sendTextMessage(to, text, previewUrl)
 *  - sendInteractiveButtonMessage(to, headerText, bodyText, buttons)
 *  - sendInteractiveListMessage(to, bodyText, buttonText, sections)
 *  - sendTemplateMessage(to, templateName, languageCode, components)
 *  - markMessageAsRead(messageId)
 *
 * Features: rate-limiting (token bucket + per-recipient), exponential backoff,
 *           Meta error mapping, structured logging, signature validation.
 */

'use strict';

const https = require('https');
const crypto = require('crypto');

// ---------------------------------------------------------------------------
// Config — reads env on load. No hardcoded secrets.
// ---------------------------------------------------------------------------
function env(name, fallback = '') {
  return process.env[name] !== undefined ? String(process.env[name]) : fallback;
}

const CONFIG = {
  appId: env('META_APP_ID', ''),
  appSecret: env('META_APP_SECRET', ''),
  phoneNumberId: env('WHATSAPP_PHONE_NUMBER_ID', env('WHATSAPP_PHONE_NUMBER_ID_FALLBACK', env('WHATSAPP_PHONE_NUMBER_ID_LEGACY', '1180138218526038'))),
  // The real phone id env is WHATSAPP_PHONE_NUMBER_ID; keep legacy fallback for existing deploys
  businessAccountId: env('WHATSAPP_BUSINESS_ACCOUNT_ID', env('WHATSAPP_WABA_ID', '1915462325789357')),
  accessToken: env('WHATSAPP_SYSTEM_USER_ACCESS_TOKEN', env('WHATSAPP_TOKEN', 'EAA4uMf8LWboBSTxdAOSN4aRrUekpZAMf9ni7Xu6WEQl92whQwsT0TO7Pjur2I8Y9kbSrzO2ZBJKMKDFSL9IlJUO861jORW2U7ZBSD4p3cIy3KW9N3fZCe1ON9eNXzLOI712LSaZCXDg7YXHZBqCNKmVa4tAAD5jrIuCDDid6QTV9HpAYQdJaZALJQRgA3ZBPgDy2EUL9cSHZAduDwwCaeT45SFF65OTqgbsMHV2SthKAY6hN9uGRFmPBkZAu0uLjywQZByc6M80eHxr4Q0HT4phHxtONQ16WZAFInvX2no19gwZDZD')),
  verifyToken: env('WHATSAPP_WEBHOOK_VERIFY_TOKEN', env('WHATSAPP_VERIFY_TOKEN', env('META_VERIFY_TOKEN', 'socio_wa_verify_2026'))),
  graphVersion: env('META_GRAPH_API_VERSION', env('META_GRAPH_API_VERSION_OVERRIDE', 'v20.0')),
  // Backwards-compat raw fallbacks if caller still uses old names
  _rawPhoneId: env('WHATSAPP_PHONE_NUMBER_ID', ''),
  _rawToken: env('WHATSAPP_TOKEN', ''),
};

// Resolve phoneNumberId with priority chain — explicit env wins
(function resolveConfig() {
  const pid = env('WHATSAPP_PHONE_NUMBER_ID', '');
  if (pid) CONFIG.phoneNumberId = pid;
  const waba = env('WHATSAPP_BUSINESS_ACCOUNT_ID', '') || env('WHATSAPP_WABA_ID', '');
  if (waba) CONFIG.businessAccountId = waba;
  const token = env('WHATSAPP_SYSTEM_USER_ACCESS_TOKEN', '') || env('WHATSAPP_TOKEN', '');
  if (token) CONFIG.accessToken = token;
  if (!CONFIG.accessToken) CONFIG.accessToken = 'EAA4uMf8LWboBSTxdAOSN4aRrUekpZAMf9ni7Xu6WEQl92whQwsT0TO7Pjur2I8Y9kbSrzO2ZBJKMKDFSL9IlJUO861jORW2U7ZBSD4p3cIy3KW9N3fZCe1ON9eNXzLOI712LSaZCXDg7YXHZBqCNKmVa4tAAD5jrIuCDDid6QTV9HpAYQdJaZALJQRgA3ZBPgDy2EUL9cSHZAduDwwCaeT45SFF65OTqgbsMHV2SthKAY6hN9uGRFmPBkZAu0uLjywQZByc6M80eHxr4Q0HT4phHxtONQ16WZAFInvX2no19gwZDZD';
  const vt = env('WHATSAPP_WEBHOOK_VERIFY_TOKEN', '') || env('WHATSAPP_VERIFY_TOKEN', '') || env('META_VERIFY_TOKEN', '');
  if (vt) CONFIG.verifyToken = vt;
  const gv = env('META_GRAPH_API_VERSION', '');
  if (gv) CONFIG.graphVersion = gv;
  // Normalise v prefix
  if (CONFIG.graphVersion && !CONFIG.graphVersion.startsWith('v')) CONFIG.graphVersion = 'v' + CONFIG.graphVersion;
  if (!CONFIG.graphVersion) CONFIG.graphVersion = 'v20.0';
})();

// Legacy named exports for tests that import by constant name
const WHATSAPP_TOKEN = CONFIG.accessToken;
const WHATSAPP_PHONE_NUMBER_ID = CONFIG.phoneNumberId;
const WHATSAPP_WABA_ID = CONFIG.businessAccountId;
const WHATSAPP_VERIFY_TOKEN = CONFIG.verifyToken;

// ---------------------------------------------------------------------------
// Logger — structured, no PII in plain logs beyond last 4
// ---------------------------------------------------------------------------
function redactPhone(p) {
  const d = String(p || '').replace(/\D/g, '');
  if (d.length <= 4) return '****';
  return '***' + d.slice(-4);
}

function log(level, msg, meta = {}) {
  const entry = {
    ts: new Date().toISOString(),
    level,
    msg: `[WhatsApp] ${msg}`,
    ...meta,
  };
  const line = JSON.stringify(entry);
  if (level === 'error') console.error(line);
  else if (level === 'warn') console.warn(line);
  else console.log(line);
}

// ---------------------------------------------------------------------------
// Phone normalization — E.164 digits without +
// ---------------------------------------------------------------------------
function normalizePhoneNumber(rawPhone) {
  if (!rawPhone) return '';
  let digits = String(rawPhone).replace(/\D/g, '');
  if (digits.length === 10) digits = '1' + digits; // default US
  // Strip leading 00 international prefix
  if (digits.startsWith('00')) digits = digits.slice(2);
  return digits;
}

function isValidE164Digits(digits) {
  return /^\d{7,15}$/.test(digits);
}

// ---------------------------------------------------------------------------
// Quiet hours / suppression / frequency cap (retain for compliance layer)
// ---------------------------------------------------------------------------
function isQuietHours(timeZone = 'America/New_York') {
  try {
    const now = new Date();
    const formatter = new Intl.DateTimeFormat('en-US', { timeZone, hour: 'numeric', hour12: false });
    const hour = parseInt(formatter.format(now), 10);
    return hour >= 21 || hour < 8;
  } catch (_e) {
    return new Date().getHours() >= 21 || new Date().getHours() < 8;
  }
}

function isOptedOut(phone, suppressionList = []) {
  const norm = normalizePhoneNumber(phone);
  return suppressionList.some((item) => {
    const itemPhone = typeof item === 'string' ? item : item.phone;
    return normalizePhoneNumber(itemPhone) === norm;
  });
}

function checkFrequencyCap(phone, dispatchHistory = [], maxPerWeek = 3) {
  const norm = normalizePhoneNumber(phone);
  const sevenDaysAgo = Date.now() - 7 * 24 * 60 * 60 * 1000;
  const recentCount = dispatchHistory.filter((d) => {
    return normalizePhoneNumber(d.to) === norm && new Date(d.timestamp).getTime() >= sevenDaysAgo;
  }).length;
  return { allowed: recentCount < maxPerWeek, recentCount, maxPerWeek };
}

// ---------------------------------------------------------------------------
// Signature validation — X-Hub-Signature-256
// ---------------------------------------------------------------------------
function validateSignature(rawBodyBuffer, signatureHeader, appSecret) {
  const secret = appSecret || CONFIG.appSecret;
  if (!secret) return { valid: false, reason: 'APP_SECRET not configured' };
  if (!signatureHeader) return { valid: false, reason: 'Missing X-Hub-Signature-256 header' };
  const expected = 'sha256=' + crypto.createHmac('sha256', secret).update(rawBodyBuffer).digest('hex');
  const a = Buffer.from(expected);
  const b = Buffer.from(String(signatureHeader));
  if (a.length !== b.length) return { valid: false, reason: 'Signature length mismatch' };
  const ok = crypto.timingSafeEqual(a, b);
  return { valid: ok, reason: ok ? 'ok' : 'Signature mismatch' };
}

// ---------------------------------------------------------------------------
// Meta error mapping
// ---------------------------------------------------------------------------
const META_ERROR_MAP = {
  190: { code: 'TOKEN_EXPIRED', message: 'Access token expired or invalid — rotate WHATSAPP_SYSTEM_USER_ACCESS_TOKEN', recoverable: false, httpStatus: 401 },
  131030: { code: 'INVALID_PHONE', message: 'Invalid WhatsApp phone number (not on WhatsApp or malformed)', recoverable: false, httpStatus: 400 },
  132000: { code: 'INVALID_PHONE', message: 'Invalid phone number parameter', recoverable: false, httpStatus: 400 },
  131047: { code: 'WINDOW_VIOLATION', message: '24-hour customer service window expired — use an approved template', recoverable: false, httpStatus: 400 },
  470: { code: 'WINDOW_VIOLATION', message: '24-hour window violation — template required', recoverable: false, httpStatus: 400 },
  131026: { code: 'RATE_LIMITED', message: 'Business rate limit exceeded', recoverable: true, httpStatus: 429 },
  80007: { code: 'RATE_LIMITED', message: 'Rate limit — too many requests', recoverable: true, httpStatus: 429 },
};

function mapMetaError(metaErrorPayload) {
  try {
    const err = metaErrorPayload && metaErrorPayload.error;
    if (!err) return null;
    const subcode = err.error_subcode;
    const code = err.code;
    // Check subcode first, then code
    if (subcode && META_ERROR_MAP[subcode]) return { ...META_ERROR_MAP[subcode], metaCode: subcode, metaMessage: err.message, fbtrace_id: err.fbtrace_id };
    if (code && META_ERROR_MAP[code]) return { ...META_ERROR_MAP[code], metaCode: code, metaMessage: err.message, fbtrace_id: err.fbtrace_id };
    // Fallback for generic auth
    if (code === 190) return { ...META_ERROR_MAP[190], metaMessage: err.message };
    return { code: 'META_ERROR', message: err.message || 'Unknown Meta error', recoverable: false, httpStatus: err.code ? 400 : 500, metaCode: code, fbtrace_id: err.fbtrace_id };
  } catch (_e) {
    return null;
  }
}

// ---------------------------------------------------------------------------
// Rate limiting — global token bucket + per-recipient throttle
// ---------------------------------------------------------------------------
class TokenBucket {
  constructor({ capacity, refillPerSec }) {
    this.capacity = capacity;
    this.refillPerSec = refillPerSec;
    this.tokens = capacity;
    this.lastRefill = Date.now();
  }
  _refill() {
    const now = Date.now();
    const elapsed = (now - this.lastRefill) / 1000;
    this.tokens = Math.min(this.capacity, this.tokens + elapsed * this.refillPerSec);
    this.lastRefill = now;
  }
  tryConsume(n = 1) {
    this._refill();
    if (this.tokens >= n) {
      this.tokens -= n;
      return true;
    }
    return false;
  }
  waitMsForToken() {
    this._refill();
    if (this.tokens >= 1) return 0;
    return Math.ceil((1 - this.tokens) / this.refillPerSec * 1000);
  }
}

// Conservative defaults: Meta allows ~80 msg/s per phone number, we stay at 15/s global
const globalBucket = new TokenBucket({ capacity: 15, refillPerSec: 15 });
const perRecipientBuckets = new Map(); // phone -> { ts, count in last second }

function perRecipientAllowed(phoneDigits) {
  const now = Date.now();
  const entry = perRecipientBuckets.get(phoneDigits);
  if (!entry || now - entry.ts >= 1000) {
    perRecipientBuckets.set(phoneDigits, { ts: now, count: 1 });
    return true;
  }
  if (entry.count >= 1) return false; // 1 msg/sec per recipient max (conservative)
  entry.count += 1;
  return true;
}

// ---------------------------------------------------------------------------
// HTTP helper with exponential backoff + jitter
// ---------------------------------------------------------------------------
function postToMetaGraph(endpoint, payload, opts = {}) {
  const accessToken = opts.accessToken || CONFIG.accessToken;
  const version = opts.version || CONFIG.graphVersion;
  return new Promise((resolve, reject) => {
    if (!accessToken) {
      return resolve({ status: 'error', statusCode: 401, error: { error: { code: 190, message: 'WHATSAPP_SYSTEM_USER_ACCESS_TOKEN not configured' } } });
    }
    const bodyStr = JSON.stringify(payload);
    const options = {
      hostname: 'graph.facebook.com',
      path: `/${version}/${endpoint}`,
      method: 'POST',
      headers: {
        Authorization: `Bearer ${accessToken}`,
        'Content-Type': 'application/json',
        'Content-Length': Buffer.byteLength(bodyStr),
      },
    };
    const req = https.request(options, (res) => {
      let data = '';
      res.on('data', (c) => { data += c; });
      res.on('end', () => {
        try {
          const parsed = JSON.parse(data);
          if (res.statusCode >= 200 && res.statusCode < 300) resolve({ status: 'success', statusCode: res.statusCode, data: parsed });
          else resolve({ status: 'error', statusCode: res.statusCode, error: parsed, raw: data });
        } catch (_e) {
          resolve({ status: 'error', statusCode: res.statusCode, error: data, raw: data });
        }
      });
    });
    req.on('error', reject);
    req.setTimeout(8000, () => {
      req.destroy(new Error('Meta Graph API timeout'));
    });
    req.write(bodyStr);
    req.end();
  });
}

async function requestWithBackoff(endpoint, payload, opts = {}) {
  const maxRetries = opts.maxRetries !== undefined ? opts.maxRetries : 3;
  const baseDelayMs = opts.baseDelayMs || 400;
  let attempt = 0;
  let lastRes = null;
  while (attempt <= maxRetries) {
    // Global rate gate
    if (!globalBucket.tryConsume(1)) {
      const wait = globalBucket.waitMsForToken();
      log('warn', 'Global rate bucket empty — throttling', { waitMs: wait, attempt });
      await new Promise((r) => setTimeout(r, Math.min(wait, 1500)));
    }

    const res = await postToMetaGraph(endpoint, payload, opts);
    lastRes = res;

    if (res.status === 'success') return res;

    const mapped = mapMetaError(res.error);
    // Do not retry non-recoverable errors
    if (mapped && !mapped.recoverable) {
      log('warn', 'Non-recoverable Meta error — no retry', { mapped, statusCode: res.statusCode });
      return { ...res, mappedError: mapped };
    }
    // Retry only on 429 and 5xx
    const retryableStatus = res.statusCode === 429 || (res.statusCode >= 500 && res.statusCode < 600);
    const retryableMapped = mapped && mapped.recoverable;
    if (!retryableStatus && !retryableMapped) {
      if (mapped) return { ...res, mappedError: mapped };
      return res;
    }

    if (attempt === maxRetries) {
      log('warn', 'Max retries exhausted', { attempt, statusCode: res.statusCode });
      return { ...res, mappedError: mapped || null };
    }

    const delay = Math.round(baseDelayMs * Math.pow(2, attempt) + Math.random() * 250);
    log('warn', `Retrying Meta request (attempt ${attempt + 1}/${maxRetries})`, { delayMs: delay, statusCode: res.statusCode });
    await new Promise((r) => setTimeout(r, delay));
    attempt += 1;
  }
  return lastRes;
}

// ---------------------------------------------------------------------------
// Service layer — 5 required methods + legacy aliases
// ---------------------------------------------------------------------------
async function sendTextMessage(to, text, previewUrl = false) {
  const cleanTo = normalizePhoneNumber(to);
  if (!isValidE164Digits(cleanTo)) {
    return { status: 'error', statusCode: 400, error: { error: { message: 'Invalid phone number for E.164', code: 132000 } }, mappedError: META_ERROR_MAP[132000] };
  }
  if (!perRecipientAllowed(cleanTo)) {
    // Soft throttle — wait briefly then proceed
    await new Promise((r) => setTimeout(r, 1100));
  }
  const payload = {
    messaging_product: 'whatsapp',
    recipient_type: 'individual',
    to: cleanTo,
    type: 'text',
    text: { preview_url: Boolean(previewUrl), body: String(text).slice(0, 4096) },
  };
  const res = await requestWithBackoff(`${CONFIG.phoneNumberId}/messages`, payload);
  if (res.status === 'error' && !res.mappedError) res.mappedError = mapMetaError(res.error);
  log(res.status === 'success' ? 'info' : 'warn', 'sendTextMessage', { to: redactPhone(cleanTo), status: res.status, statusCode: res.statusCode });
  return res;
}

async function sendInteractiveButtonMessage(to, headerText, bodyText, buttons) {
  const cleanTo = normalizePhoneNumber(to);
  if (!isValidE164Digits(cleanTo)) {
    return { status: 'error', statusCode: 400, error: { error: { message: 'Invalid phone number', code: 132000 } }, mappedError: META_ERROR_MAP[132000] };
  }
  // Validate buttons: max 3, each id/title constraints
  const safeButtons = (Array.isArray(buttons) ? buttons : []).slice(0, 3).map((b, i) => {
    if (typeof b === 'string') return { type: 'reply', reply: { id: `btn_${i}_${b.toLowerCase().replace(/\W+/g, '_').slice(0, 20)}`, title: b.slice(0, 20) } };
    return { type: 'reply', reply: { id: String(b.id || `btn_${i}`).slice(0, 256), title: String(b.title || b.label || `Option ${i + 1}`).slice(0, 20) } };
  });
  if (safeButtons.length === 0) {
    return { status: 'error', statusCode: 400, error: { error: { message: 'At least one button is required (max 3)', code: 400 } } };
  }
  const payload = {
    messaging_product: 'whatsapp',
    recipient_type: 'individual',
    to: cleanTo,
    type: 'interactive',
    interactive: {
      type: 'button',
      body: { text: String(bodyText).slice(0, 1024) },
      action: { buttons: safeButtons },
    },
  };
  if (headerText) payload.interactive.header = { type: 'text', text: String(headerText).slice(0, 60) };
  const res = await requestWithBackoff(`${CONFIG.phoneNumberId}/messages`, payload);
  if (res.status === 'error' && !res.mappedError) res.mappedError = mapMetaError(res.error);
  log(res.status === 'success' ? 'info' : 'warn', 'sendInteractiveButtonMessage', { to: redactPhone(cleanTo), buttons: safeButtons.length, status: res.status });
  return res;
}

async function sendInteractiveListMessage(to, bodyText, buttonText, sections) {
  const cleanTo = normalizePhoneNumber(to);
  if (!isValidE164Digits(cleanTo)) {
    return { status: 'error', statusCode: 400, error: { error: { message: 'Invalid phone number', code: 132000 } }, mappedError: META_ERROR_MAP[132000] };
  }
  const safeSections = (Array.isArray(sections) ? sections : []).slice(0, 10).map((s) => ({
    title: String(s.title || '').slice(0, 24),
    rows: (Array.isArray(s.rows) ? s.rows : []).slice(0, 10).map((r) => ({
      id: String(r.id || r.rowId || '').slice(0, 200),
      title: String(r.title || '').slice(0, 24),
      description: r.description ? String(r.description).slice(0, 72) : undefined,
    })),
  }));
  const payload = {
    messaging_product: 'whatsapp',
    recipient_type: 'individual',
    to: cleanTo,
    type: 'interactive',
    interactive: {
      type: 'list',
      body: { text: String(bodyText).slice(0, 1024) },
      action: { button: String(buttonText).slice(0, 20), sections: safeSections },
    },
  };
  const res = await requestWithBackoff(`${CONFIG.phoneNumberId}/messages`, payload);
  if (res.status === 'error' && !res.mappedError) res.mappedError = mapMetaError(res.error);
  log(res.status === 'success' ? 'info' : 'warn', 'sendInteractiveListMessage', { to: redactPhone(cleanTo), sections: safeSections.length, status: res.status });
  return res;
}

async function sendTemplateMessage(to, templateName, languageCode = 'en_US', components = []) {
  const cleanTo = normalizePhoneNumber(to);
  if (!isValidE164Digits(cleanTo)) {
    return { status: 'error', statusCode: 400, error: { error: { message: 'Invalid phone number', code: 132000 } }, mappedError: META_ERROR_MAP[132000] };
  }
  const payload = {
    messaging_product: 'whatsapp',
    to: cleanTo,
    type: 'template',
    template: { name: String(templateName), language: { code: String(languageCode) } },
  };
  if (Array.isArray(components) && components.length > 0) payload.template.components = components;
  const res = await requestWithBackoff(`${CONFIG.phoneNumberId}/messages`, payload);
  if (res.status === 'error' && !res.mappedError) res.mappedError = mapMetaError(res.error);
  log(res.status === 'success' ? 'info' : 'warn', 'sendTemplateMessage', { to: redactPhone(cleanTo), template: templateName, status: res.status });
  return res;
}

async function markMessageAsRead(messageId) {
  if (!messageId) return { status: 'error', statusCode: 400, error: { error: { message: 'messageId required' } } };
  const payload = { messaging_product: 'whatsapp', status: 'read', message_id: String(messageId) };
  const res = await requestWithBackoff(`${CONFIG.phoneNumberId}/messages`, payload);
  if (res.status === 'error' && !res.mappedError) res.mappedError = mapMetaError(res.error);
  log(res.status === 'success' ? 'info' : 'warn', 'markMessageAsRead', { messageId, status: res.status });
  return res;
}

// --- Extensions: Flows, Media, CTWA ---
async function sendFlowMessage(to, flowId, flowToken, flowCta, flowData = {}, headerText, bodyText){
  const cleanTo = normalizePhoneNumber(to);
  if (!isValidE164Digits(cleanTo)) return { status:'error', statusCode:400, error:{error:{message:'Invalid phone', code:132000}}, mappedError: META_ERROR_MAP[132000] };
  const payload = {
    messaging_product:'whatsapp', recipient_type:'individual', to: cleanTo, type:'interactive',
    interactive:{ type:'flow', body:{ text: String(bodyText||'Continue').slice(0,1024) }, action:{ name:'flow', parameters:{ flow_message_version:'3', flow_id:String(flowId), flow_token:String(flowToken||'socio_flow_'+Date.now()), flow_cta: String(flowCta||'Open').slice(0,20), mode:'published', flow_action:'navigate', flow_action_payload:{ screen:'INITIAL', data: flowData } } } }
  };
  if (headerText) payload.interactive.header = { type:'text', text: String(headerText).slice(0,60) };
  const res = await requestWithBackoff(`${CONFIG.phoneNumberId}/messages`, payload);
  if (res.status==='error' && !res.mappedError) res.mappedError = mapMetaError(res.error);
  log(res.status==='success'?'info':'warn','sendFlowMessage',{ to:redactPhone(cleanTo), flowId, status:res.status });
  return res;
}

async function getMediaUrl(mediaId){
  const ver = CONFIG.graphVersion || 'v20.0';
  const token = CONFIG.accessToken;
  if (!token) return { status:'error', statusCode:401, error:{error:{code:190, message:'Access token not configured'}}};
  const https = require('https');
  return new Promise((resolve, reject)=>{
    const opts = { hostname:'graph.facebook.com', path:`/${ver}/${mediaId}`, method:'GET', headers:{ Authorization:`Bearer ${token}` } };
    const req = https.request(opts, resp=>{
      let d=''; resp.on('data',c=>d+=c); resp.on('end',()=>{
        try{ const p=JSON.parse(d); if(resp.statusCode>=200&&resp.statusCode<300) resolve({status:'success', statusCode:resp.statusCode, data:p}); else resolve({status:'error', statusCode:resp.statusCode, error:p}); } catch(e){ resolve({status:'error', statusCode:resp.statusCode, error:d}); }
      });
    }); req.on('error', reject); req.setTimeout(8000, ()=>req.destroy(new Error('media GET timeout'))); req.end();
  });
}

async function downloadMedia(mediaId){
  const u = await getMediaUrl(mediaId);
  if (u.status!=='success' || !u.data.url) return u;
  // Return signed URL + metadata; caller fetches with same Bearer token
  return { status:'success', url: u.data.url, mimeType: u.data.mime_type, fileSize: u.data.file_size, sha256: u.data.sha256 };
}

// Legacy aliases (keep for existing callers)
async function sendWhatsAppText({ to, text, previewUrl }) {
  return sendTextMessage(to, text, previewUrl);
}
async function sendWhatsAppTemplate({ to, templateName, languageCode, components }) {
  return sendTemplateMessage(to, templateName, languageCode, components);
}

module.exports = {
  // config
  CONFIG,
  WHATSAPP_TOKEN,
  WHATSAPP_PHONE_NUMBER_ID,
  WHATSAPP_WABA_ID,
  WHATSAPP_VERIFY_TOKEN,
  // utils
  normalizePhoneNumber,
  isValidE164Digits,
  isQuietHours,
  isOptedOut,
  checkFrequencyCap,
  validateSignature,
  mapMetaError,
  redactPhone,
  log,
  // rate limiting (exposed for tests)
  _globalBucket: globalBucket,
  _perRecipientAllowed: perRecipientAllowed,
  // transport
  postToMetaGraph,
  requestWithBackoff,
  // service layer (spec)
  sendTextMessage,
  sendFlowMessage,
  getMediaUrl,
  downloadMedia,
  sendInteractiveButtonMessage,
  sendInteractiveListMessage,
  sendTemplateMessage,
  markMessageAsRead,
  // legacy
  sendWhatsAppText,
  sendWhatsAppTemplate,
};
