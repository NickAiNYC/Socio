#!/usr/bin/env node
/**
 * scripts/vertical-gate-score.mjs
 *
 * Day-14 decision calculator for the vertical discovery sprint. Reads the
 * Vertical Decision Dashboard endpoint (admin-gated) and prints the gate
 * status + priority score per vertical. "Insufficient data" is shown, never
 * a fabricated score, until a vertical clears BOTH gates (>=30 completed,
 * >=10 leads at 75+).
 *
 * Usage:
 *   node scripts/vertical-gate-score.mjs --admin <ADMIN_PASSWORD> [--base http://localhost:3030] [--from 2026-08-19] [--to 2026-08-31] [--utm founder_email]
 *
 * The CSV fallback (offline audit) reads a founder-exported conversion log:
 *   node scripts/vertical-gate-score.mjs --csv socio_rli_conversion_log.csv
 */
import fs from 'node:fs';

function parseArgs(argv) {
  const args = { base: 'http://localhost:3030', admin: null, csv: null, from: null, to: null, utm: null };
  for (let i = 2; i < argv.length; i++) {
    const k = argv[i];
    const v = argv[i + 1];
    if (k === '--admin') { args.admin = v; i++; }
    else if (k === '--base') { args.base = v; i++; }
    else if (k === '--csv') { args.csv = v; i++; }
    else if (k === '--from') { args.from = v; i++; }
    else if (k === '--to') { args.to = v; i++; }
    else if (k === '--utm') { args.utm = v; i++; }
  }
  return args;
}

function fmtPct(x) { return typeof x === 'number' ? x.toFixed(1) + '%' : '—'; }

function printDecision(verticals, gates) {
  console.log('\n=== VERTICAL DECISION — DAY 14 ===');
  console.log(`Gates: >= ${gates.completed_min} completed AND >= ${gates.qualified_min} leads at 75+ (both required)\n`);
  const header = 'VERTICAL                          | COMP | 75+ | GATE    | V-SCORE | BOOK/SCHED/ATTEND | DATA';
  console.log(header);
  console.log('-'.repeat(header.length));
  for (const r of verticals) {
    const gate = r.gate.status === 'CLEARED' ? 'CLEARED' : 'PENDING';
    const score = r.priority ? String(r.priority.score) : 'Insufficient data';
    const funnel = `${r.booking_intent}/${r.founder_scheduled}/${r.attended}`;
    console.log(
      `${r.label.padEnd(31)}| ${String(r.completed).padStart(4)} | ${String(r.qualified).padStart(3)} | ${gate.padEnd(7)} | ${String(score).padEnd(14)} | ${funnel.padEnd(19)} | ${fmtPct(r.access_pct)}`
    );
  }
  console.log('');
}

async function fromApi(args) {
  if (!args.admin) throw new Error('--admin <ADMIN_PASSWORD> is required (or use --csv <file>)');
  const params = new URLSearchParams({ exclude_test: 'true' });
  if (args.from) params.set('from', args.from + 'T00:00:00.000Z');
  if (args.to) params.set('to', args.to + 'T23:59:59.999Z');
  if (args.utm) params.set('utm_source', args.utm);
  const res = await fetch(`${args.base}/api/vertical/dashboard?${params}`, { headers: { 'x-admin-key': args.admin } });
  if (res.status === 401) throw new Error('Unauthorized — check ADMIN_PASSWORD');
  const json = await res.json();
  if (json.status !== 'success') throw new Error(json.message || 'dashboard failed');
  return json;
}

// Offline fallback: compute the same rows from a founder-exported CSV.
function fromCsv(file) {
  const text = fs.readFileSync(file, 'utf8');
  const lines = text.trim().split('\n');
  const header = lines[0].split(',');
  const idx = (name) => header.indexOf(name);
  const leads = lines.slice(1).filter((l) => l.trim()).map((l) => {
    const c = l.split(',');
    const g = (name) => c[idx(name)] ?? '';
    return {
      submitted_at: g('submitted_at'),
      is_test: g('is_test') === 'true',
      merchant: { vertical: g('vertical') },
      server_assessment: { recovery_score: Number(g('server_score')) || 0 },
      status: { booking_state: g('booking_state'), data_access_state: g('data_access_state') },
      attribution: { utm_source: g('utm_source') }
    };
  });
  const { buildRows, diagnose, GATE } = require('../lib/vertical-metrics.cjs');
  const rows = buildRows({ rliLeads: leads.filter((l) => !l.is_test), events: [] });
  return { generated_at: new Date().toISOString(), filters: { from: 'csv' }, gates: { completed_min: GATE.COMPLETED_MIN, qualified_min: GATE.QUALIFIED_MIN }, verticals: rows, diagnosis: diagnose(rows) };
}

import { createRequire } from 'node:module';
const require = createRequire(import.meta.url);

async function main() {
  const args = parseArgs(process.argv);
  const json = args.csv ? fromCsv(args.csv) : await fromApi(args);
  printDecision(json.verticals, json.gates);
  console.log('Diagnosis:');
  (json.diagnosis || ['No diagnosis']).forEach((d) => console.log('  · ' + d));
  const cleared = (json.verticals || []).filter((r) => r.gate.cleared);
  if (cleared.length === 0) {
    console.log('\nNo vertical cleared both gates. Do NOT force a winner — fix the funnel per the diagnosis above.\n');
    process.exitCode = 2;
  } else {
    cleared.sort((a, b) => (b.priority?.score || 0) - (a.priority?.score || 0));
    console.log(`\nRecommended vertical page: ${cleared[0].label} (V = ${cleared[0].priority.score}). Only build the page for this cell's observed language, leaks, objections, stacks, and conversion behavior.\n`);
  }
}

main().catch((e) => { console.error('gate-score failed:', e.message); process.exit(1); });
