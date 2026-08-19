import test from 'node:test';
import assert from 'node:assert/strict';
import { execFile } from 'node:child_process';
import { fileURLToPath } from 'node:url';
import path from 'node:path';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const API = path.join(__dirname, '..', 'merchant', 'merchant-api.mjs');

function run(args, env, timeoutMs = 8000) {
  return new Promise((resolve) => {
    execFile(process.execPath, args, { env: { ...process.env, ...env }, timeout: timeoutMs }, (err, stdout, stderr) => {
      resolve({
        code: err ? (err.code ?? -1) : 0,
        out: String(stdout) + String(stderr),
        killed: Boolean(err && err.killed),
      });
    });
  });
}

test('MERCHANT API BOOT: fails closed when DATABASE_URL is set but MERCHANT_API_TOKENS is missing', async () => {
  const { code, out } = await run([API], { DATABASE_URL: 'postgres://u:p@127.0.0.1:1/db', MERCHANT_API_CORS_ORIGIN: 'https://pilot.example.com' });
  assert.notEqual(code, 0, 'must refuse to boot without tokens in production mode');
  assert.match(out, /fails closed/);
  assert.match(out, /MERCHANT_API_TOKENS/);
});

test('MERCHANT API BOOT: fails closed when DATABASE_URL is set but MERCHANT_API_CORS_ORIGIN is missing', async () => {
  const { code, out } = await run([API], { DATABASE_URL: 'postgres://u:p@127.0.0.1:1/db', MERCHANT_API_TOKENS: '{"biz":"tok"}' });
  assert.notEqual(code, 0, 'must refuse to boot without an explicit CORS origin in production mode');
  assert.match(out, /fails closed/);
  assert.match(out, /MERCHANT_API_CORS_ORIGIN/);
});

test('MERCHANT API BOOT: boots in explicit in-memory dev mode without tokens', async () => {
  const { code, out, killed } = await run([API], { DATABASE_URL: '', GROWTH_OS_ALLOW_MEMORY: 'true', MERCHANT_API_PORT: '0' }, 4000);
  // It should be listening (killed by the timeout, not exited with an error).
  assert.match(out, /listening/);
  assert.ok(killed || code === null, `dev-mode boot should keep running, got code=${code} out=${out}`);
});

test('MERCHANT API BOOT: fails closed on malformed MERCHANT_API_TOKENS JSON', async () => {
  const { code, out } = await run([API], { DATABASE_URL: '', GROWTH_OS_ALLOW_MEMORY: 'true', MERCHANT_API_TOKENS: '{not json' });
  assert.notEqual(code, 0);
  assert.match(out, /valid JSON/);
});
