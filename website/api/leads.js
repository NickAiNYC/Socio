const http = require('http');
const { execFile } = require('child_process');
const crypto = require('crypto');

const PORT = process.env.WEBHOOK_PORT || 3001;
const WEBHOOK_SECRET = process.env.WEBHOOK_SECRET || ''; // empty = auth disabled (local only)
const RATE_LIMIT_PER_MIN = Number(process.env.WEBHOOK_RATE_LIMIT || 10);
const MAX_BODY_BYTES = Number(process.env.WEBHOOK_MAX_BODY_BYTES || 16384);
const DISABLE_EXEC = process.env.WEBHOOK_DISABLE_EXEC === 'true'; // test-only guard

// In-memory token bucket per client IP (single process; enough for lead capture).
const buckets = new Map(); // ip -> { count, windowStart }

function rateLimited(ip) {
  const now = Date.now();
  const bucket = buckets.get(ip) || { count: 0, windowStart: now };
  if (now - bucket.windowStart >= 60_000) {
    bucket.count = 0;
    bucket.windowStart = now;
  }
  bucket.count += 1;
  buckets.set(ip, bucket);
  return bucket.count > RATE_LIMIT_PER_MIN;
}

function safeEqual(a, b) {
  const ab = Buffer.from(String(a));
  const bb = Buffer.from(String(b));
  if (ab.length !== bb.length) return false;
  return crypto.timingSafeEqual(ab, bb);
}

function validateLead(lead) {
  if (!lead || typeof lead !== 'object' || Array.isArray(lead)) return 'lead must be a JSON object';
  if (typeof lead.name !== 'string' || lead.name.length === 0 || lead.name.length > 200) {
    return 'lead.name must be a non-empty string (max 200 chars)';
  }
  if (typeof lead.type !== 'string' || lead.type.length === 0 || lead.type.length > 200) {
    return 'lead.type must be a non-empty string (max 200 chars)';
  }
  return null;
}

http.createServer((req, res) => {
  // CORS Headers
  res.setHeader('Access-Control-Allow-Origin', process.env.WEBHOOK_CORS_ORIGIN || '*');
  res.setHeader('Access-Control-Allow-Methods', 'OPTIONS, POST');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, X-Webhook-Secret');

  if (req.method === 'OPTIONS') {
    res.writeHead(200);
    res.end();
    return;
  }

  if (req.method === 'POST') {
    // 1. Secret check (when configured) — before reading the body.
    if (WEBHOOK_SECRET && !safeEqual(req.headers['x-webhook-secret'] || '', WEBHOOK_SECRET)) {
      res.writeHead(401, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ status: 'error', message: 'Unauthorized' }));
      return;
    }

    // 2. Rate limit per IP.
    const ip = req.socket.remoteAddress || 'unknown';
    if (rateLimited(ip)) {
      res.writeHead(429, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ status: 'error', message: 'Rate limit exceeded' }));
      return;
    }

    // 3. Bounded body read.
    let body = '';
    let tooLarge = false;
    req.on('data', (chunk) => {
      body += chunk;
      if (body.length > MAX_BODY_BYTES) {
        tooLarge = true;
        req.destroy();
      }
    });
    req.on('end', () => {
      if (tooLarge) {
        res.writeHead(413, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ status: 'error', message: 'Payload too large' }));
        return;
      }

      let lead;
      try {
        lead = JSON.parse(body);
      } catch {
        res.writeHead(400, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ status: 'error', message: 'Bad Request' }));
        return;
      }

      // 4. Field validation.
      const validationError = validateLead(lead);
      if (validationError) {
        res.writeHead(400, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ status: 'error', message: validationError }));
        return;
      }

      console.log('Received Lead:', lead);

      if (req.url === '/api/leads') {
        // 5. Create Kanban task in Hermes (argv only — no shell; the RCE fix).
        if (!DISABLE_EXEC) {
          const args = ['kanban', 'create', `Lead: ${lead.name} — ${lead.type}`, '--assignee', 'socio-prospect', '--board', 'socio'];
          execFile('hermes', args, (error, stdout) => {
            if (error) {
              console.error(`Error executing hermes: ${error}`);
            } else {
              console.log(`Kanban task created: ${stdout}`);
            }
          });
        }

        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ status: 'success', message: 'Lead captured' }));
      } else if (req.url === '/api/analytics/pageview' || req.url === '/api/analytics/event') {
        console.log('Analytics Event:', lead);
        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ status: 'success' }));
      } else if (req.url === '/api/referrals/visit') {
        console.log('Referral Visit:', lead);
        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ status: 'success' }));
      } else {
        res.writeHead(404);
        res.end('Not Found');
      }
    });
  } else {
    res.writeHead(405);
    res.end('Method Not Allowed');
  }
}).listen(PORT, () => {
  console.log(`Lead webhook listening on :${PORT} (secret: ${WEBHOOK_SECRET ? 'configured' : 'DISABLED'})`);
});
