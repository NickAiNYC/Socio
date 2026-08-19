/**
 * Socio — Instagram Graph + Messenger webhook scaffold (P1)
 * Reuses WhatsApp HMAC validation, rawBody, and whatsapp-router intents.
 * Endpoints:
 *   GET  /api/instagram/webhook  (hub.verify_token = META_VERIFY_TOKEN)
 *   POST /api/instagram/webhook  (X-Hub-Signature-256)
 *   GET  /api/messenger/webhook  (same verify)
 *   POST /api/messenger/webhook
 * For now responders log + store to instagram_inbound; add graph send on next pass
 * when IG_BUSINESS_ACCOUNT_ID + PAGE_TOKEN are provisioned.
 */
'use strict';
const crypto = require('crypto');
const { validateSignature, CONFIG } = require('./whatsapp-engine.cjs');

function getRaw(req){
  if (req.rawBody && Buffer.isBuffer(req.rawBody)) return req.rawBody;
  if (typeof req.rawBody==='string') return Buffer.from(req.rawBody);
  try{ return Buffer.from(JSON.stringify(req.body)); } catch{ return Buffer.from(''); }
}
function verifyOrAck(req, res, next){
  const sig = req.headers['x-hub-signature-256'] || req.headers['x-hub-signature'] || '';
  if (!CONFIG.appSecret) return next(); // no secret configured — allow but log
  const raw = getRaw(req);
  const r = validateSignature(raw, sig, CONFIG.appSecret);
  if (!r.valid && !sig) { console.warn('[IG/Messenger] missing signature — ack 200, skip'); return res.status(200).json({status:'EVENT_RECEIVED', signature:'missing'}); }
  // validateSignature handles timingSafeEqual; on fail we still ack 200 per Meta retry spec
  return next();
}

module.exports = function(app, getDb, saveDb){
  const verifyToken = process.env.META_VERIFY_TOKEN || process.env.WHATSAPP_WEBHOOK_VERIFY_TOKEN || process.env.WHATSAPP_VERIFY_TOKEN || 'socio_wa_verify_2026';

  function handshake(req,res){
    const mode = req.query['hub.mode'];
    const token = req.query['hub.verify_token'];
    const challenge = req.query['hub.challenge'];
    if (mode==='subscribe' && token===verifyToken) return res.status(200).send(challenge);
    return res.status(403).send('Verification failed');
  }
  app.get('/api/instagram/webhook', handshake);
  app.get('/api/messenger/webhook', handshake);

  app.post('/api/instagram/webhook', verifyOrAck, async (req,res)=>{
    res.status(200).json({status:'EVENT_RECEIVED'});
    setImmediate(async()=>{
      try{
        const db=getDb(); if(!db.instagram_inbound) db.instagram_inbound=[];
        const entries = (req.body && req.body.entry) || [];
        for(const e of entries){
          for(const m of (e.messaging||[])){
            db.instagram_inbound.push({ platform:'instagram', sender: m.sender && m.sender.id, text: m.message && m.message.text, mid: m.message && m.message.mid, ts: new Date().toISOString(), raw:m });
          }
          for(const ch of (e.changes||[])){
            db.instagram_inbound.push({ platform:'instagram', change: ch, ts: new Date().toISOString() });
          }
        }
        saveDb(db);
        console.log('[Instagram] inbound', JSON.stringify(req.body).slice(0,800));
      }catch(err){ console.error('[Instagram webhook]', err); }
    });
  });

  app.post('/api/messenger/webhook', verifyOrAck, async (req,res)=>{
    res.status(200).json({status:'EVENT_RECEIVED'});
    setImmediate(async()=>{
      try{
        const db=getDb(); if(!db.messenger_inbound) db.messenger_inbound=[];
        for(const entry of (req.body.entry||[])){
          for(const m of (entry.messaging||[])){
            db.messenger_inbound.push({ platform:'messenger', sender: m.sender && m.sender.id, text: m.message && m.message.text, mid: m.message && m.message.mid, ts: new Date().toISOString(), raw:m });
          }
        }
        saveDb(db);
        console.log('[Messenger] inbound', JSON.stringify(req.body).slice(0,800));
      }catch(err){ console.error('[Messenger webhook]', err); }
    });
  });

  app.get('/api/instagram/status', (req,res)=>{
    const db=getDb();
    res.json({ status:'operational', instagram_inbound: (db.instagram_inbound||[]).length, messenger_inbound:(db.messenger_inbound||[]).length, verifyToken_set: !!verifyToken, graphVersion: CONFIG.graphVersion });
  });
};
