import test from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import { execFileSync } from 'node:child_process';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.join(__dirname, '..', '..', '..');

async function read(rel) {
  return readFile(path.join(ROOT, rel), 'utf8');
}

// ---------------------------------------------------------------------------
// Dashboard XSS regression: every data-driven field must go through esc().
// ---------------------------------------------------------------------------

test('XSS: dashboard defines an HTML-escape helper', async () => {
  const html = await read('website/merchant-evidence.html');
  assert.match(html, /const esc = \(v\) =>/, 'dashboard must define esc()');
});

test('XSS: no raw (unescaped) data interpolation remains in dashboard render paths', async () => {
  const html = await read('website/merchant-evidence.html');
  const rawPatterns = [
    '${a.agentId}', '${a.actionType}', '${a.proposalId}', '${a.id}',
    '${e.source}', '${e.id}', '${e.type}',
    '${rec.claim}', '${rec.variant}', '${rec.level}',
    '${e.hypothesis}', '${e.objective}', '${e.metric}', '${e.rationale}',
    '${p.type}', '${p.agentId}', '${p.risk}',
    '${s.reason}', '${s.status}', '${sys.persistence}',
    '${next.learnings.summary}', '${b.id}', '${b.reason}', '${err.message}',
  ];
  for (const pat of rawPatterns) {
    assert.ok(!html.includes(pat), `dashboard must not interpolate ${pat} raw — wrap it in esc()`);
  }
});

// ---------------------------------------------------------------------------
// Leads webhook: loopback bind + fail-closed secret for non-loopback hosts.
// ---------------------------------------------------------------------------

test('LEADS WEBHOOK: binds loopback by default and fails closed on non-loopback without a secret', async () => {
  const src = await read('website/api/leads.js');
  assert.match(src, /WEBHOOK_HOST \|\| '127\.0\.0\.1'/, 'default bind must be loopback');
  assert.match(src, /listen\(\{ port: PORT, host: HOST \}/, 'server must bind the configured host');
  assert.match(src, /fails closed: WEBHOOK_HOST is not loopback, so WEBHOOK_SECRET is required/);
  execFileSync(process.execPath, ['--check', path.join(ROOT, 'website/api/leads.js')], { stdio: 'pipe' });
});

test('LEADS WEBHOOK: landing page sends the secret from deploy-time config only', async () => {
  const html = await read('website/index.html');
  assert.match(html, /X-Webhook-Secret/, 'page must send the secret header when injected');
  assert.match(html, /window\.SOCIO_WEBHOOK_SECRET/, 'secret must come from injected config, never hardcoded');
});

// ---------------------------------------------------------------------------
// Escape-route governance: no DSH MCP into the locked fleet, gateway disabled.
// ---------------------------------------------------------------------------

test('FLEET: init_hermes_fleet.sh must not wire DSH MCP unconditionally', async () => {
  const src = await read('init_hermes_fleet.sh');
  assert.match(src, /SOCIO_WIRE_DSH_MCP/, 'DSH MCP wiring must be behind an explicit opt-in');
  execFileSync('bash', ['-n', path.join(ROOT, 'init_hermes_fleet.sh')], { stdio: 'pipe' });
});

test('LOCKDOWN: script disables the gateway api_server platform and refuses MCP servers', async () => {
  const src = await read('scripts/lockdown-profiles.sh');
  assert.match(src, /platforms\.api_server\.enabled false/, 'api_server must be disabled per profile');
  assert.match(src, /No MCP servers configured/, 'pre-flight must reject any configured MCP server');
  execFileSync('bash', ['-n', path.join(ROOT, 'scripts/lockdown-profiles.sh')], { stdio: 'pipe' });
});

// ---------------------------------------------------------------------------
// Commission workflow: no ungoverned Stripe invoicing.
// ---------------------------------------------------------------------------

test('COMMISSION: workflow must not auto-invoice via Stripe; must gate on the Governor + human approval', async () => {
  const yaml = await read('workflows/commission-calc.yaml');
  assert.ok(!yaml.includes('stripe-connect-api'), 'no direct Stripe invoicing in the workflow');
  assert.ok(!yaml.includes('generate-stripe-invoice'), 'auto-invoice step must be gone');
  assert.match(yaml, /growth_os_record_event/, 'commission must flow through the governed ledger surface');
  assert.match(yaml, /allowedEventTypes/, 'workflow must honor the Governor bounds');
  assert.match(yaml, /queue-for-approval/, 'invoicing must wait for human approval');
});

// ---------------------------------------------------------------------------
// Fail-closed documentation: runbook and checklist carry the new gates.
// ---------------------------------------------------------------------------

test('DOCS: runbook and checklist require tokens + gateway/MCP lockdown', async () => {
  const runbook = await read('docs/pilot-001-runbook.md');
  const checklist = await read('docs/pilot-readiness-checklist.md');
  assert.match(runbook, /MERCHANT_API_TOKENS is MANDATORY/);
  assert.match(runbook, /API_SERVER_KEY/);
  assert.match(runbook, /remote-code-execution/);
  assert.match(checklist, /MERCHANT_API_TOKENS/);
  assert.match(checklist, /fails closed without it/);
  assert.match(checklist, /zero MCP servers/);
});
