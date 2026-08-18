import test from 'node:test';
import assert from 'node:assert/strict';
import { spawn } from 'node:child_process';
import { fileURLToPath } from 'node:url';
import path from 'node:path';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const LEADS = path.join(__dirname, '..', '..', '..', 'website', 'api', 'leads.js');

const PORT = 3199;
const SECRET = 'test-secret-123';

let serverProc;

test.before(() => {
  return new Promise((resolve, reject) => {
    let errBuf = '';
    serverProc = spawn(process.execPath, [LEADS], {
      env: {
        ...process.env,
        WEBHOOK_PORT: String(PORT),
        WEBHOOK_SECRET: SECRET,
        WEBHOOK_RATE_LIMIT: '5',
        WEBHOOK_DISABLE_EXEC: 'true',
      },
      stdio: ['ignore', 'pipe', 'pipe'],
    });
    serverProc.stdout.on('data', (d) => {
      if (String(d).includes('listening')) resolve(true);
    });
    serverProc.stderr.on('data', (d) => {
      errBuf += String(d);
    });
    serverProc.on('error', reject);
    serverProc.on('exit', (code) => reject(new Error(`webhook exited early (${code}): ${errBuf}`)));
    setTimeout(() => reject(new Error(`webhook did not start: ${errBuf}`)), 5000);
  });
});

test.after(() => {
  if (serverProc) serverProc.kill();
});

function post(body, headers = {}) {
  return new Promise((resolve, reject) => {
    const req = httpRequest({
      method: 'POST',
      headers: { 'Content-Type': 'application/json', ...headers },
    }, resolve, reject);
    req.end(JSON.stringify(body));
  });
}

import http from 'node:http';
function httpRequest(options, resolve, reject) {
  const req = http.request({ host: '127.0.0.1', port: PORT, path: '/api/leads', ...options }, (res) => {
    let data = '';
    res.on('data', (c) => (data += c));
    res.on('end', () => resolve({ status: res.statusCode, body: data }));
  });
  req.on('error', reject);
  return req;
}

test('WEBHOOK: request without secret is rejected (401)', async () => {
  const res = await post({ name: 'A', type: 'florist' });
  assert.equal(res.status, 401);
});

test('WEBHOOK: wrong secret is rejected (401)', async () => {
  const res = await post({ name: 'A', type: 'florist' }, { 'x-webhook-secret': 'wrong' });
  assert.equal(res.status, 401);
});

test('WEBHOOK: valid secret + valid lead is accepted (200)', async () => {
  const res = await post({ name: 'A', type: 'florist' }, { 'x-webhook-secret': SECRET });
  assert.equal(res.status, 200);
});

test('WEBHOOK: invalid lead shape is rejected (400)', async () => {
  const res = await post({ name: '', type: 'florist' }, { 'x-webhook-secret': SECRET });
  assert.equal(res.status, 400);
});

test('WEBHOOK: malformed JSON is rejected (400)', async () => {
  const res = await new Promise((resolve, reject) => {
    const req = http.request({ host: '127.0.0.1', port: PORT, path: '/api/leads', method: 'POST', headers: { 'Content-Type': 'application/json', 'x-webhook-secret': SECRET } }, (r) => {
      let d = '';
      r.on('data', (c) => (d += c));
      r.on('end', () => resolve({ status: r.statusCode, body: d }));
    });
    req.on('error', reject);
    req.end('{not json');
  });
  assert.equal(res.status, 400);
});

test('WEBHOOK: rate limit kicks in after N requests (429)', async () => {
  const results = [];
  // bucket allows 5/min; previous tests already consumed some — hammer until 429.
  for (let i = 0; i < 10; i++) {
    const res = await post({ name: `L${i}`, type: 'florist' }, { 'x-webhook-secret': SECRET });
    results.push(res.status);
  }
  assert.ok(results.includes(429), `expected at least one 429, got [${results.join(',')}]`);
});
