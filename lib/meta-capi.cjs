/**
 * Socio — Meta Conversions API (CAPI) + Pixel dedup service
 * Covers P0 gap: server-side Lead / ViewContent / InitiateCheckout events
 * with eventID dedup against browser pixel, hashed PII, and v20.0 error mapping.
 * Reuses whatsapp-engine transport + logging shape but posts to /<PIXEL_ID>/events.
 */
'use strict';
const https = require('https');
const crypto = require('crypto');
const { CONFIG: WA_CONFIG, mapMetaError, log } = require('./whatsapp-engine.cjs');

function env(n, f=''){ return process.env[n]!==undefined? String(process.env[n]): f; }

function hashSha256(v){
  if (!v) return undefined;
  return crypto.createHash('sha256').update(String(v).trim().toLowerCase()).digest('hex');
}
function normalizePhone(p){
  let d = String(p||'').replace(/\D/g,'');
  if (d.length===10) d='1'+d;
  if (d.startsWith('00')) d=d.slice(2);
  return d;
}

// Build user_data with hashed PII per Meta spec
function buildUserData({ email, phone, firstName, lastName, city, state, zip, country, externalId, clientIp, clientUa, fbc, fbp }){
  const ud = {};
  if (email) ud.em = [hashSha256(email)];
  if (phone) ud.ph = [hashSha256(normalizePhone(phone))];
  if (firstName) ud.fn = [hashSha256(firstName)];
  if (lastName) ud.ln = [hashSha256(lastName)];
  if (city) ud.ct = [hashSha256(city)];
  if (state) ud.st = [hashSha256(state)];
  if (zip) ud.zp = [hashSha256(String(zip))];
  if (country) ud.country = [hashSha256(country)];
  if (externalId) ud.external_id = [hashSha256(String(externalId))];
  if (clientIp) ud.client_ip_address = String(clientIp).split(',')[0].trim();
  if (clientUa) ud.client_user_agent = String(clientUa);
  if (fbc) ud.fbc = String(fbc);
  if (fbp) ud.fbp = String(fbp);
  return ud;
}

function postToGraph(path, body, token){
  const t = token || env('META_CAPI_TOKEN','') || WA_CONFIG.accessToken;
  const ver = env('META_GRAPH_API_VERSION','v20.0').replace(/^v/,'v');
  const fullPath = `/${ver}${path}`;
  const raw = JSON.stringify(body);
  return new Promise((resolve, reject)=>{
    if (!env('META_PIXEL_ID','') && !body.pixel) return resolve({ status:'error', statusCode:400, error:{error:{message:'META_PIXEL_ID not configured'}}});
    if (!t) return resolve({ status:'error', statusCode:401, error:{error:{code:190, message:'META_CAPI_TOKEN / WHATSAPP_SYSTEM_USER_ACCESS_TOKEN not configured'}}});
    const opts = { hostname:'graph.facebook.com', path: fullPath, method:'POST', headers:{ Authorization:`Bearer ${t}`, 'Content-Type':'application/json', 'Content-Length': Buffer.byteLength(raw) } };
    const req = https.request(opts, res=>{
      let d=''; res.on('data',c=>d+=c); res.on('end',()=>{
        try{ const p=JSON.parse(d); if(res.statusCode>=200 && res.statusCode<300) resolve({status:'success', statusCode:res.statusCode, data:p}); else resolve({status:'error', statusCode:res.statusCode, error:p, raw:d}); } catch(e){ resolve({status:'error', statusCode:res.statusCode, error:d, raw:d}); }
      });
    });
    req.on('error', reject);
    req.setTimeout(8000, ()=>req.destroy(new Error('CAPI timeout')));
    req.write(raw); req.end();
  });
}

/**
 * Send a CAPI event.
 * @param {Object} p { eventName, eventId, sourceUrl, actionSource, userData, customData, testEventCode }
 * actionSource: website|whatsapp|business_messaging|messaging|phone_call|chat
 */
async function sendCapiEvent(p){
  const pixelId = env('META_PIXEL_ID','');
  if (!pixelId) return { status:'error', statusCode:400, error:{error:{message:'META_PIXEL_ID not configured — set in .env'}}};
  const eventTime = Math.floor(Date.now()/1000);
  const eventId = p.eventId || `socio_${Date.now()}_${crypto.randomBytes(4).toString('hex')}`;
  const payload = {
    data: [{
      event_name: p.eventName || 'Lead',
      event_time: p.eventTime || eventTime,
      event_id: eventId,
      event_source_url: p.sourceUrl || 'https://socio-one.vercel.app/',
      action_source: p.actionSource || 'website',
      user_data: buildUserData(p.userData || {}),
      custom_data: p.customData || {},
    }],
    test_event_code: p.testEventCode || env('META_TEST_EVENT_CODE','') || undefined,
  };
  // strip undefined
  if (!payload.test_event_code) delete payload.test_event_code;
  const ver = env('META_GRAPH_API_VERSION','v20.0');
  log('info','CAPI send', { pixelId: pixelId.slice(-4), eventName: payload.data[0].event_name, eventId });
  const res = await postToGraph(`/${pixelId}/events`, payload);
  if (res.status==='error' && !res.mappedError) res.mappedError = mapMetaError(res.error);
  // Also mirror to whatsapp_leads for attribution join
  return { ...res, eventId };
}

// Convenience: Lead from Socio lead-form
async function sendLeadEvent({ email, phone, businessName, vertical, sourceUrl, fbc, fbp, clientIp, clientUa, value }){
  return sendCapiEvent({
    eventName:'Lead',
    actionSource:'website',
    sourceUrl: sourceUrl || 'https://socio-one.vercel.app/',
    userData:{ email, phone, externalId: phone? normalizePhone(phone): undefined, clientIp, clientUa, fbc, fbp },
    customData:{ content_name: businessName || 'Socio Lead', content_category: vertical || 'general', value: value||0, currency:'USD' },
  });
}

module.exports = { buildUserData, hashSha256, normalizePhone, postToGraph, sendCapiEvent, sendLeadEvent };
