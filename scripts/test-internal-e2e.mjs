#!/usr/bin/env node
/**
 * scripts/test-internal-e2e.mjs
 *
 * Controlled internal end-to-end test for the RLI → booking → founder-queue
 * system, BEFORE any external distribution. Runs against a THROWAWAY server:
 *   - SOCIO_DB_FILE  = outputs/socio_internal_e2e.json (temp DB, deleted at end)
 *   - PORT           = 3199 (isolated)
 *   - ADMIN_PASSWORD = strong random value (test admin key)
 *   - TEST_ALLOWLIST_EMAIL_DOMAINS = socio.nyc (internal allowlist)
 *
 * Exercises every critical path:
 *   1. RLI submission (server-authoritative scoring)
 *   2. Boundary values at 49/50 and 74/75 vs hand-calculated expectations
 *   3. Client/server mismatch flag (expected on deliberate tampering only)
 *   4. Booking record, state changes (scheduled/attended), disqualification
 *   5. Queue rendering (TEST RECORD badge + production-only stats)
 *   6. Analytics events (test events require authorization)
 *   7. Vertical Decision Dashboard (gates + "Insufficient data" until cleared)
 *   8. Authorization denial (is_test without admin/allowlist -> 403)
 *   9. CSV export (founder conversion log, test-excluded by default)
 *
 * Usage: node scripts/test-internal-e2e.mjs
 * Exits non-zero on any failure.
 */

import { spawn } from 'node:child_process';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { createRequire } from 'node:module';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const require = createRequire(import.meta.url);
const ROOT = path.resolve(__dirname, '..');
const PORT = 3199;
const ADMIN_PASSWORD = 'e2e-' + cryptoRandom(24);
const BASE = `http://127.0.0.1:${PORT}`;
const DB_FILE = path.join(ROOT, 'outputs', 'socio_internal_e2e.json');

function cryptoRandom(n) {
  const bytes = require('node:crypto').randomBytes(n);
  return bytes.toString('hex');
}

let server = null;
let passed = 0;
let failed = 0;
const failures = [];

function ok(name, cond, detail = '') {
  if (cond) { passed++; console.log(`  PASS  ${name}`); }
  else { failed++; failures.push(name + (detail ? ` — ${detail}` : '')); console.log(`  FAIL  ${name}${detail ? ` — ${detail}` : ''}`); }
}

async function api(method, pathname, body, headers = {}) {
  const res = await fetch(BASE + pathname, {
    method,
    headers: { 'Content-Type': 'application/json', ...headers },
    body: body === undefined ? undefined : JSON.stringify(body)
  });
  const text = await res.text();
  let json = null;
  try { json = JSON.parse(text); } catch { json = text; }
  return { status: res.status, json, text };
}

// Independent, hand-written scoring implementation (the test vector oracle).
// Mirrors the server's formula deliberately — a bug in either side surfaces here.
function handCalc(raw) {
  const e = raw.economics || {}, s = raw.systems || {}, o = raw.operations || {}, m = raw.merchant || {};
  const clamp = (n, lo, hi) => Math.max(lo, Math.min(hi, n));
  const dormantMap = { under_10: 2, '10_25': 6, '25_50': 8, over_50: 6, not_sure: 0 };
  const volume = Number(e.monthly_customers_or_leads);
  const volumePts = Number.isFinite(volume) && volume > 0 ? (volume < 500 ? 2 : volume < 2000 ? 5 : volume < 10000 ? 8 : 10) : 0;
  const repeatMap = { weekly: 8, monthly: 7, '2_3_months': 5, quarterly: 4, six_months_plus: 2, one_time: 0 };
  const demandRaw = (dormantMap[o.dormant_share_band] || 0) + volumePts + (repeatMap[e.repeat_cycle] || 0);
  const ticket = Number(e.average_ticket);
  const ticketPts = Number.isFinite(ticket) && ticket > 0 ? (ticket < 30 ? 3 : ticket < 60 ? 6 : ticket < 150 ? 8 : ticket < 500 ? 6 : 5) : 0;
  const bandMap = { under_25k: 2, '25_75k': 5, '75_150k': 7, '150_500k': 9, '500k_plus': 10 };
  const unitRaw = ticketPts + (bandMap[e.monthly_revenue_band] || 0);
  const hasHistory = s.has_customer_history === 'yes';
  const systems = Array.isArray(s.systems) ? s.systems : [];
  const systemsPts = !hasHistory ? 0 : systems.length === 0 ? 0 : systems.length === 1 ? 3 : 6;
  const contactablePts = !hasHistory ? 0 : s.contactable_history === 'yes' ? 5 : 0;
  const dataRaw = (hasHistory ? 8 : 0) + systemsPts + contactablePts;
  const slaMap = { under_5min: 8, under_1hr: 6, same_day: 4, next_day: 2, not_tracked: 0 };
  const priorityMap = { repeat_visits: 7, lost_leads: 7, rebooking: 7, no_shows: 6, slow_days: 4, new_service: 2 };
  const opsRaw = (slaMap[o.lead_response_sla] || 0) + (priorityMap[o.growth_priority] || 0);
  const vertMap = { aesthetic_clinic: 6, salon_wellness: 5, florist: 4, cafe: 3, other: 2 };
  const locMap = { '1': 3, '2_3': 5, '4_plus': 4 };
  const fitRaw = (vertMap[m.vertical] || 0) + (locMap[m.locations] || 0) + (m.zip_code ? 4 : 0);
  const dims = {
    demand: demandRaw / 26 * 30,
    unit: unitRaw / 20 * 20,
    data: dataRaw / 19 * 20,
    ops: opsRaw / 15 * 15,
    fit: fitRaw / 15 * 15
  };
  const score = clamp(Math.round(dims.demand + dims.unit + dims.data + dims.ops + dims.fit), 0, 100);
  return { recovery_score: score, sales_tier: score >= 75 ? 'high' : score >= 50 ? 'opportunity' : 'foundation' };
}

// Boundary vectors: exact 49/50 (tier boundary) and 74/75 (qualified boundary).
const BOUNDARY_VECTORS = [
  { name: 'boundary_49_foundation', expected: { recovery_score: 49, sales_tier: 'foundation' }, payload: {
    merchant: { business_name: 'Boundary 49 Salon', vertical: 'salon_wellness', locations: '1', zip_code: '' },
    economics: { monthly_revenue_band: 'under_25k', average_ticket: 25, monthly_customers_or_leads: 200, repeat_cycle: 'one_time' },
    systems: { has_customer_history: 'yes', systems: ['pos'], contactable_history: 'yes' },
    operations: { dormant_share_band: 'under_10', lead_response_sla: 'under_5min', growth_priority: 'repeat_visits' }
  } },
  { name: 'boundary_50_opportunity', expected: { recovery_score: 50, sales_tier: 'opportunity' }, payload: {
    merchant: { business_name: 'Boundary 50 Med Spa', vertical: 'aesthetic_clinic', locations: '1', zip_code: '' },
    economics: { monthly_revenue_band: 'under_25k', average_ticket: 25, monthly_customers_or_leads: 200, repeat_cycle: 'one_time' },
    systems: { has_customer_history: 'yes', systems: ['pos'], contactable_history: 'yes' },
    operations: { dormant_share_band: 'under_10', lead_response_sla: 'under_5min', growth_priority: 'repeat_visits' }
  } },
  { name: 'boundary_74_opportunity', expected: { recovery_score: 74, sales_tier: 'opportunity' }, payload: {
    merchant: { business_name: 'Boundary 74 Spa', vertical: 'aesthetic_clinic', locations: '1', zip_code: '10029' },
    economics: { monthly_revenue_band: 'under_25k', average_ticket: 25, monthly_customers_or_leads: 5000, repeat_cycle: 'weekly' },
    systems: { has_customer_history: 'yes', systems: ['pos', 'crm'], contactable_history: 'yes' },
    operations: { dormant_share_band: 'under_10', lead_response_sla: 'under_5min', growth_priority: 'repeat_visits' }
  } },
  { name: 'boundary_75_high', expected: { recovery_score: 75, sales_tier: 'high' }, payload: {
    merchant: { business_name: 'Boundary 75 Med Spa', vertical: 'aesthetic_clinic', locations: '2_3', zip_code: '10029' },
    economics: { monthly_revenue_band: 'under_25k', average_ticket: 25, monthly_customers_or_leads: 5000, repeat_cycle: 'monthly' },
    systems: { has_customer_history: 'yes', systems: ['pos', 'crm'], contactable_history: 'yes' },
    operations: { dormant_share_band: 'under_10', lead_response_sla: 'under_5min', growth_priority: 'repeat_visits' }
  } },
  { name: 'mid_range_82_high', expected: { recovery_score: 82, sales_tier: 'high' }, payload: {
    merchant: { business_name: 'Baseline Florist', vertical: 'florist', locations: '1', zip_code: '10029' },
    economics: { monthly_revenue_band: '25_75k', average_ticket: 85, monthly_customers_or_leads: 1200, repeat_cycle: 'monthly' },
    systems: { has_customer_history: 'yes', systems: ['pos', 'crm'], contactable_history: 'yes' },
    operations: { dormant_share_band: '25_50', lead_response_sla: 'under_5min', growth_priority: 'repeat_visits' }
  } }
];

function sleep(ms) { return new Promise((r) => setTimeout(r, ms)); }

async function waitForServer() {
  for (let i = 0; i < 60; i++) {
    try {
      const res = await fetch(BASE + '/');
      if (res.status < 500) return true;
    } catch { /* not up yet */ }
    await sleep(250);
  }
  return false;
}

async function main() {
  console.log('\n=== SOCIO INTERNAL E2E (controlled test — isolated DB) ===\n');
  console.log(`DB: ${DB_FILE}\n`);

  if (fs.existsSync(DB_FILE)) fs.rmSync(DB_FILE, { force: true });

  server = spawn(process.execPath, ['server.js'], {
    cwd: ROOT,
    env: {
      ...process.env,
      PORT: String(PORT),
      SOCIO_DB_FILE: DB_FILE,
      ADMIN_PASSWORD,
      TEST_ALLOWLIST_EMAIL_DOMAINS: 'socio.nyc'
    },
    stdio: ['ignore', 'pipe', 'pipe']
  });
  server.stdout.on('data', () => {});
  server.stderr.on('data', () => {});

  try {
    ok('server boots on isolated DB + test port', await waitForServer());

    // --- 1. Authorization denial (test record without admin/allowlist) ---
    const denied = await api('POST', '/api/recovery-index', {
      ...BOUNDARY_VECTORS[4].payload,
      merchant: { ...BOUNDARY_VECTORS[4].payload.merchant, contact_email: 'someone@external.com' },
      is_test: true,
      test_label: 'internal_e2e_2026_08_19'
    });
    ok('unauthorized is_test submission -> 403 test_not_authorized', denied.status === 403 && denied.json?.code === 'test_not_authorized', `got ${denied.status}`);

    // --- 2. Allowlisted internal domain acceptance ---
    const allow = await api('POST', '/api/recovery-index', {
      ...BOUNDARY_VECTORS[4].payload,
      merchant: { ...BOUNDARY_VECTORS[4].payload.merchant, contact_email: 'nick@socio.nyc' },
      is_test: true,
      test_label: 'internal_e2e_2026_08_19'
    });
    ok('allowlisted domain is_test submission -> 200', allow.status === 200 && allow.json?.status === 'success', `got ${allow.status} ${JSON.stringify(allow.json).slice(0, 120)}`);
    const allowLeadId = allow.json?.lead_id;
    ok('test submission returns is_test=true + label', allow.json?.is_test === true && allow.json?.test_label === 'internal_e2e_2026_08_19');

    // --- 3. Admin-authorized test submission ---
    const adminTest = await api('POST', '/api/recovery-index', {
      ...BOUNDARY_VECTORS[3].payload,
      merchant: { ...BOUNDARY_VECTORS[3].payload.merchant, contact_email: 'admin@socio.nyc' },
      is_test: true,
      test_label: 'admin_e2e_boundary_75'
    }, { 'x-admin-key': ADMIN_PASSWORD });
    ok('admin-authorized is_test submission -> 200', adminTest.status === 200 && adminTest.json?.status === 'success', `got ${adminTest.status}`);
    const adminTestLeadId = adminTest.json?.lead_id;

    // --- 4. Boundary hand-calc vs server_assessment (production path into temp DB) ---
    console.log('\n  Boundary verification (hand-calculated oracle vs server_assessment):');
    for (const v of BOUNDARY_VECTORS) {
      const res = await api('POST', '/api/recovery-index', v.payload);
      const a = res.json?.assessment;
      const okStatus = res.status === 200 && res.json?.status === 'success';
      const okExpected = a && a.recovery_score === v.expected.recovery_score && a.sales_tier === v.expected.sales_tier;
      const hc = handCalc(v.payload);
      const okOracle = hc.recovery_score === a?.recovery_score && hc.sales_tier === a?.sales_tier;
      ok(`${v.name}: server=${a?.recovery_score}/${a?.sales_tier} expected=${v.expected.recovery_score}/${v.expected.sales_tier} handCalc=${hc.recovery_score}/${hc.sales_tier}`,
        okStatus && okExpected && okOracle, `status=${res.status} body=${JSON.stringify(res.json).slice(0, 120)}`);
    }

    // --- 5. Client/server mismatch: ordinary vs tampered ---
    const ordinaryPayload = BOUNDARY_VECTORS[4].payload;
    const ordinaryClient = handCalc(ordinaryPayload);
    const ordinary = await api('POST', '/api/recovery-index', { ...ordinaryPayload, client_assessment: ordinaryClient });
    ok('ordinary submission: client == server (no mismatch)', ordinary.json?.assessment?.recovery_score === ordinaryClient.recovery_score);

    const tamperedPayload = BOUNDARY_VECTORS[2].payload; // true score 74
    const tampered = await api('POST', '/api/recovery-index', { ...tamperedPayload, client_assessment: { recovery_score: 99, leak_type: 'fake', data_confidence: 'High', sales_tier: 'high' } });
    ok('tampered submission accepted but server score authoritative (74, not 99)', tampered.json?.assessment?.recovery_score === 74, `got ${tampered.json?.assessment?.recovery_score}`);
    const tamperedLeadId = tampered.json?.lead_id;

    // --- 6. Booking record (test lead) ---
    const booking = await api('POST', '/api/rli/booking', { lead_id: allowLeadId, event_type: 'revenue-recovery-map-review', contact_email: 'nick@socio.nyc', notes: 'e2e booking' });
    ok('booking request recorded on test lead', booking.status === 200 && booking.json?.status === 'success', `got ${booking.status}`);

    // --- 7. State changes: scheduled, attended, data access, disqualification ---
    const sch = await api('POST', `/api/rli/leads/${allowLeadId}/state`, { booking_state: 'scheduled' }, { 'x-admin-key': ADMIN_PASSWORD });
    ok('state change: booked -> scheduled (founder confirmed slot)', sch.json?.lead?.status?.booking_state === 'scheduled', `got ${JSON.stringify(sch.json).slice(0, 120)}`);
    const att = await api('POST', `/api/rli/leads/${allowLeadId}/state`, { booking_state: 'attended', data_access_state: 'granted' }, { 'x-admin-key': ADMIN_PASSWORD });
    ok('state change: scheduled -> attended + data access granted', att.json?.lead?.status?.booking_state === 'attended' && att.json?.lead?.status?.data_access_state === 'granted');
    const dq = await api('POST', `/api/rli/leads/${tamperedLeadId}/state`, { disqualified_reason: 'wrong_category' }, { 'x-admin-key': ADMIN_PASSWORD });
    ok('disqualification recorded', dq.json?.lead?.status?.disqualified_reason === 'wrong_category');
    const badState = await api('POST', `/api/rli/leads/${allowLeadId}/state`, { booking_state: 'not_a_real_state' }, { 'x-admin-key': ADMIN_PASSWORD });
    ok('invalid booking_state rejected (400)', badState.status === 400);

    // --- 8. Queue rendering: TEST RECORD flagged, stats production-only ---
    const queue = await api('GET', '/api/rli/leads', undefined, { 'x-admin-key': ADMIN_PASSWORD });
    const leads = queue.json?.leads || [];
    const testRows = leads.filter((l) => l.is_test);
    ok('queue returns test records flagged is_test + test_label', testRows.length === 2 && testRows.every((l) => l.test_label));
    const prodCount = queue.json?.stats?.total;
    // 5 boundary vectors + ordinary + tampered = 7 production leads in temp DB
    ok('queue stats exclude test records', prodCount === 7, `stats.total=${prodCount}, test_count=${queue.json?.test_count} (expected 7 prod)`);
    ok('queue returns test_count', queue.json?.test_count === 2, `got ${queue.json?.test_count}`);
    ok('unauthorized queue access -> 401', (await api('GET', '/api/rli/leads')).status === 401);

    // --- 9. Analytics test events: denied unauth, accepted admin, dashboard toggle ---
    const evDenied = await api('POST', '/api/analytics/event', { name: 'rli_started', vertical: 'florist', path: '/recovery-index?vertical=florist&utm_source=founder', is_test: true });
    ok('unauthorized is_test analytics event -> 403', evDenied.status === 403, `got ${evDenied.status}`);
    const evAdmin = await api('POST', '/api/analytics/event', { name: 'rli_started', vertical: 'florist', path: '/recovery-index?vertical=florist&utm_source=founder', is_test: true, email: 'nick@socio.nyc' }, { 'x-admin-key': ADMIN_PASSWORD });
    ok('authorized is_test analytics event -> 200', evAdmin.status === 200, `got ${evAdmin.status}`);
    const evProd = await api('POST', '/api/analytics/event', { name: 'rli_started', vertical: 'florist', path: '/recovery-index?vertical=florist&utm_source=founder' });
    ok('production analytics event -> 200 (no auth needed)', evProd.status === 200);

    // --- 10. Vertical Decision Dashboard ---
    const vdExcluded = await api('GET', '/api/vertical/dashboard?exclude_test=true', undefined, { 'x-admin-key': ADMIN_PASSWORD });
    const floristRow = (vdExcluded.json?.verticals || []).find((r) => r.vertical === 'florist');
    ok('dashboard returns rows with PENDING gates and no priority score', floristRow && floristRow.gate?.status === 'PENDING' && floristRow.priority === null, JSON.stringify(vdExcluded.json?.verticals).slice(0, 200));
    ok('dashboard (exclude_test=true) excludes test starts', floristRow?.starts === 1, `starts=${floristRow?.starts} (expected 1 prod start; test start excluded)`);
    const vdIncluded = await api('GET', '/api/vertical/dashboard?exclude_test=false', undefined, { 'x-admin-key': ADMIN_PASSWORD });
    const floristRow2 = (vdIncluded.json?.verticals || []).find((r) => r.vertical === 'florist');
    ok('dashboard (exclude_test=false) includes test starts', floristRow2?.starts === 2, `starts=${floristRow2?.starts} (expected 2)`);
    ok('dashboard unauthorized -> 401', (await api('GET', '/api/vertical/dashboard')).status === 401);
    const vdUtm = await api('GET', '/api/vertical/dashboard?utm_source=founder&exclude_test=true', undefined, { 'x-admin-key': ADMIN_PASSWORD });
    ok('dashboard utm_source filter applies', ((vdUtm.json?.verticals || []).find((r) => r.vertical === 'florist') || {}).starts === 1, `starts=${((vdUtm.json?.verticals || []).find((r) => r.vertical === 'florist') || {}).starts}`);

    // --- 11. CSV export (founder conversion log) ---
    const csv = await api('GET', '/api/rli/export', undefined, { 'x-admin-key': ADMIN_PASSWORD });
    const csvLines = csv.text.trim().split('\n');
    ok('export is CSV with header + 7 production rows', csvLines.length === 8 && csvLines[0].includes('lead_id,is_test'), `lines=${csvLines.length}`);
    ok('export excludes test records by default', !csv.text.includes('internal_e2e_2026_08_19'));
    ok('export flags client/server mismatch on tampered lead', csv.text.split('\n').find((l) => l.startsWith(tamperedLeadId + ','))?.endsWith(',true') === true);
    const csvTest = await api('GET', '/api/rli/export?include_test=true', undefined, { 'x-admin-key': ADMIN_PASSWORD });
    ok('export include_test=true adds flagged test rows', csvTest.text.includes('internal_e2e_2026_08_19') && csvTest.text.includes(',true,'));

  } finally {
    server.kill('SIGTERM');
    await sleep(400);
    if (fs.existsSync(DB_FILE)) fs.rmSync(DB_FILE, { force: true });
  }

  console.log(`\n=== RESULT: ${passed} passed, ${failed} failed ===`);
  if (failures.length) {
    console.log('\nFailures:');
    failures.forEach((f) => console.log('  ✗ ' + f));
    process.exit(1);
  }
  console.log('Temp DB cleaned. Production DB untouched.\n');
}

main().catch((e) => {
  console.error('E2E harness crashed:', e);
  if (server) server.kill('SIGTERM');
  if (fs.existsSync(DB_FILE)) fs.rmSync(DB_FILE, { force: true });
  process.exit(1);
});
