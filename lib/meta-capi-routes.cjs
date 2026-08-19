/**
 * Socio — Meta CAPI HTTP routes
 * POST /api/meta/capi  → server-side Conversions API (dedupe with browser pixel via eventID)
 * GET  /api/meta/capi/status → diag
 */
'use strict';
const { sendCapiEvent } = require('./meta-capi.cjs');

module.exports = function(app){
  app.post('/api/meta/capi', async (req, res)=>{
    try{
      const { eventName, eventId, sourceUrl, userData, customData, actionSource } = req.body || {};
      if (!eventName) return res.status(400).json({ error:'eventName required' });
      const r = await sendCapiEvent({ eventName, eventId, sourceUrl, userData, customData, actionSource });
      if (r.status==='success') return res.json({ status:'success', eventId: r.eventId, fbTrace: r.data });
      // map token/pixel missing to 400, else passthrough
      return res.status(r.statusCode||500).json({ status:'error', error: r.error, mappedError: r.mappedError, eventId: r.eventId });
    } catch(e){ return res.status(500).json({ error: e.message }); }
  });

  app.get('/api/meta/capi/status', (req,res)=>{
    const pixel = process.env.META_PIXEL_ID || '';
    const hasToken = !!(process.env.META_CAPI_TOKEN || process.env.WHATSAPP_SYSTEM_USER_ACCESS_TOKEN);
    res.json({ status: pixel? 'configured':'missing_pixel', pixel_tail: pixel? pixel.slice(-4): null, hasToken, graphVersion: process.env.META_GRAPH_API_VERSION||'v20.0' });
  });
};
