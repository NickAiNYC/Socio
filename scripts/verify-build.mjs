#!/usr/bin/env node
/**
 * Socio OS — build preflight (no bundler/compile target exists; this is the
 * real "build": every engine module must parse and import, and the MCP server
 * must boot in memory-test mode).
 */
import { execFileSync } from 'node:child_process';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.join(__dirname, '..');

const files = [
  'engines/growth-os/index.mjs',
  'engines/growth-os/mcp-server.mjs',
  'engines/growth-os/agent-governor.mjs',
  'engines/growth-os/revenue-ledger.mjs',
  'engines/growth-os/audit-trail.mjs',
  'engines/growth-os/business-twin.mjs',
  'engines/growth-os/growth-loop.mjs',
  'engines/growth-os/experiment-engine.mjs',
  'engines/growth-os/repositories/memory-repository.mjs',
  'engines/growth-os/repositories/postgres-repository.mjs',
  'website/api/leads.js',
];

console.log('1/3 syntax check (node --check)');
for (const f of files) {
  execFileSync(process.execPath, ['--check', path.join(root, f)], { stdio: 'pipe' });
  console.log(`  ok ${f}`);
}

console.log('2/3 module import smoke');
await import(path.join(root, 'engines/growth-os/index.mjs'));
await import(path.join(root, 'engines/growth-os/revenue-ledger.mjs'));
await import(path.join(root, 'engines/growth-os/audit-trail.mjs'));
console.log('  ok engine modules import');

console.log('3/3 MCP server fail-closed boot (no DATABASE_URL, no allow flag)');
try {
  execFileSync(process.execPath, ['engines/growth-os/mcp-server.mjs'], {
    cwd: root,
    env: { ...process.env, DATABASE_URL: '' },
    stdio: 'pipe',
    timeout: 10000,
  });
  console.error('FAIL: server booted without DATABASE_URL (should have exited)');
  process.exit(1);
} catch (err) {
  const out = String(err.stdout || '') + String(err.stderr || '');
  if (!out.includes('fails closed')) {
    console.error(`FAIL: unexpected boot behavior: ${out}`);
    process.exit(1);
  }
  console.log('  ok server fails closed without DATABASE_URL');
}

console.log('BUILD OK');
