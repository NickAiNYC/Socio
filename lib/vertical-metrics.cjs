/**
 * lib/vertical-metrics.cjs
 *
 * Pure computation for the Vertical Decision Dashboard (14-day discovery sprint).
 * No express, no IO — unit-testable and shared by server.js and the CLI gate scorer.
 *
 * Decision discipline (from the sprint spec):
 *   A vertical is scored ONLY after clearing both gates:
 *     G1: >= 30 completed RLI assessments
 *     G2: >= 10 leads with server score >= 75
 *   Until then the dashboard shows "Insufficient data" — never a priority score.
 *
 * Booking naming caveat (a booking request is not a booking):
 *   booking_intent_rate   = booked / qualified        (intent form submitted)
 *   founder_scheduled_rate = scheduled / booked        (founder confirmed a slot)
 *   attended_rate         = attended / scheduled       (call actually happened)
 *   These three are reported separately and never collapsed into "booking rate".
 *
 * CTR uses two signals fired from the landing page:
 *   rli_vertical_view  — vertical card section became visible (denominator)
 *   rli_vertical_click — vertical card CTA clicked (numerator)
 */

'use strict';

const CELL_VERTICALS = ['aesthetic_clinic', 'salon_wellness', 'florist', 'cafe'];

const VERTICAL_LABELS = {
  aesthetic_clinic: 'Aesthetic clinics / med spas',
  salon_wellness: 'Salons / premium wellness',
  florist: 'Florists',
  cafe: 'Cafés / hospitality',
  other: 'Other'
};

const GATE = { COMPLETED_MIN: 30, QUALIFIED_MIN: 10 };

function pct(part, whole) {
  return whole > 0 ? Math.round((part / whole) * 1000) / 10 : 0;
}

/** min-max normalize an array of ratios (0-1) to 0-100. All-equal => neutral 50. */
function normalizeMinMax(values) {
  const nums = values.filter((v) => Number.isFinite(v));
  if (nums.length === 0) return {};
  const min = Math.min(...nums);
  const max = Math.max(...nums);
  const out = {};
  nums.forEach((v, i) => {
    out[i] = max === min ? 50 : Math.round(((v - min) / (max - min)) * 1000) / 10;
  });
  return out;
}

/**
 * Build one row per cell vertical plus any 'other' verticals with data.
 *
 * @param {object} opts
 *   rliLeads     array of RLI records (already filtered by caller for test flag if desired)
 *   events       array of normalized analytics events ({ name, vertical, utm_source, timestamp, is_test })
 *   from,to      ISO date strings (inclusive on the date) or null
 *   utmSource    string filter or null
 */
function buildRows({ rliLeads = [], events = [], from = null, to = null, utmSource = null } = {}) {
  const inRange = (iso) => {
    if (!iso) return true;
    const t = Date.parse(iso);
    if (!Number.isFinite(t)) return true;
    if (from && t < Date.parse(from)) return false;
    if (to && t > Date.parse(to) + 24 * 60 * 60 * 1000) return false; // inclusive end-of-day
    return true;
  };
  const utmOk = (utm) => !utmSource || utm === utmSource;

  const leads = rliLeads.filter((l) => inRange(l.submitted_at) && utmOk((l.attribution && l.attribution.utm_source) || ''));
  const evs = events.filter((e) => inRange(e.timestamp) && utmOk(e.utm_source || ''));

  const clickCount = {};
  const viewCount = {};
  const startCount = {};
  for (const e of evs) {
    const v = e.vertical || '';
    if (e.name === 'rli_vertical_click') clickCount[v] = (clickCount[v] || 0) + 1;
    else if (e.name === 'rli_vertical_view') viewCount[v] = (viewCount[v] || 0) + 1;
    else if (e.name === 'rli_started') startCount[v] = (startCount[v] || 0) + 1;
  }

  const completed = {};
  for (const l of leads) {
    const v = (l.merchant && l.merchant.vertical) || 'other';
    completed[v] = completed[v] || [];
    completed[v].push(l);
  }

  const verticals = new Set([...CELL_VERTICALS, ...Object.keys(completed), ...Object.keys(startCount)]);
  const rows = [];

  for (const v of verticals) {
    const leadsFor = completed[v] || [];
    const qualified = leadsFor.filter((l) => (l.server_assessment && l.server_assessment.recovery_score) >= 75);
    // Funnel semantics are "ever reached": a lead moves booked -> scheduled ->
    // attended over time and the state is REPLACED at each step, so each stage
    // counts leads that ever reached it (no_show still booked and was scheduled).
    const bookingIntent = leadsFor.filter((l) => ['booked', 'scheduled', 'attended', 'no_show'].includes(l.status && l.status.booking_state));
    const founderScheduled = leadsFor.filter((l) => ['scheduled', 'attended', 'no_show'].includes(l.status && l.status.booking_state));
    const attended = leadsFor.filter((l) => l.status && l.status.booking_state === 'attended');
    const dataGranted = leadsFor.filter((l) => l.status && l.status.data_access_state === 'granted');

    const clicks = clickCount[v] || 0;
    const views = viewCount[v] || 0;
    const starts = startCount[v] || 0;
    const comp = leadsFor.length;

    const gateCleared = comp >= GATE.COMPLETED_MIN && qualified.length >= GATE.QUALIFIED_MIN;

    rows.push({
      vertical: v,
      label: VERTICAL_LABELS[v] || v.replace(/_/g, ' '),
      clicks,
      views,
      ctr_pct: pct(clicks, views),
      starts,
      completed: comp,
      completion_pct: pct(comp, starts),
      qualified: qualified.length,
      qualified_pct: pct(qualified.length, comp),
      booking_intent: bookingIntent.length,
      booking_intent_pct: pct(bookingIntent.length, qualified.length),
      founder_scheduled: founderScheduled.length,
      founder_scheduled_pct: pct(founderScheduled.length, bookingIntent.length),
      attended: attended.length,
      attended_pct: pct(attended.length, founderScheduled.length),
      data_granted: dataGranted.length,
      access_pct: pct(dataGranted.length, bookingIntent.length),
      gate: {
        cleared: gateCleared,
        completed_needed: Math.max(0, GATE.COMPLETED_MIN - comp),
        qualified_needed: Math.max(0, GATE.QUALIFIED_MIN - qualified.length),
        status: gateCleared ? 'CLEARED' : 'PENDING'
      },
      priority: null
    });
  }

  // Priority score V — only among rows that cleared BOTH gates.
  const cleared = rows.filter((r) => r.gate.cleared);
  if (cleared.length >= 1) {
    const idx = cleared.map((r) => rows.indexOf(r));
    const ctr = cleared.map((r) => (r.views > 0 ? r.clicks / r.views : 0));
    const comp = cleared.map((r) => (r.starts > 0 ? r.completed / r.starts : 0));
    const qual = cleared.map((r) => (r.completed > 0 ? r.qualified / r.completed : 0));
    const book = cleared.map((r) => (r.qualified > 0 ? r.booking_intent / r.qualified : 0));
    const acc = cleared.map((r) => (r.booking_intent > 0 ? r.data_granted / r.booking_intent : 0));

    const nCtr = normalizeMinMax(ctr);
    const nComp = normalizeMinMax(comp);
    const nQual = normalizeMinMax(qual);
    const nBook = normalizeMinMax(book);
    const nAcc = normalizeMinMax(acc);

    cleared.forEach((r, i) => {
      const V = 0.20 * (nCtr[i] ?? 0) + 0.20 * (nComp[i] ?? 0) + 0.25 * (nQual[i] ?? 0) + 0.20 * (nBook[i] ?? 0) + 0.15 * (nAcc[i] ?? 0);
      r.priority = {
        score: Math.round(V * 10) / 10,
        components: {
          ctr_norm: nCtr[i] ?? null,
          completion_norm: nComp[i] ?? null,
          qualified_norm: nQual[i] ?? null,
          booking_norm: nBook[i] ?? null,
          data_access_norm: nAcc[i] ?? null
        },
        weights: { ctr: 0.20, completion: 0.20, qualified: 0.25, booking: 0.20, data_access: 0.15 }
      };
    });
  }

  rows.sort((a, b) => {
    const pa = a.priority ? a.priority.score : -1;
    const pb = b.priority ? b.priority.score : -1;
    if (pa !== pb) return pb - pa;
    return CELL_VERTICALS.indexOf(a.vertical) - CELL_VERTICALS.indexOf(b.vertical);
  });

  return rows;
}

/** Diagnose why no vertical cleared the gates (spec decision discipline). */
function diagnose(rows) {
  const findings = [];
  for (const r of rows) {
    if (r.gate.cleared) continue;
    if (r.views > 0 && r.ctr_pct < 8) findings.push(`${r.label}: low CTR (${r.ctr_pct}%) — positioning mismatch`);
    if (r.starts > 0 && r.completion_pct < 60) findings.push(`${r.label}: high start, low completion (${r.completion_pct}%) — form friction or poorly phrased questions`);
    if (r.completed >= 10 && r.qualified_pct < 25) findings.push(`${r.label}: high completion, low 75+ rate (${r.qualified_pct}%) — targeting mismatch or score too strict`);
    if (r.qualified > 0 && r.booking_intent_pct < 20) findings.push(`${r.label}: high qualification, low booking intent (${r.booking_intent_pct}%) — insufficient urgency/trust or booking-flow friction`);
    if (r.booking_intent > 0 && r.access_pct < 30) findings.push(`${r.label}: high booking, low data access (${r.access_pct}%) — merchant trust, integration, privacy, or operational friction`);
    if (r.completed < GATE.COMPLETED_MIN && r.qualified >= GATE.QUALIFIED_MIN) findings.push(`${r.label}: qualified gate met but ${r.completed}/${GATE.COMPLETED_MIN} completions — keep distributing`);
  }
  return findings.length ? findings : ['No vertical cleared the gates; no single-funnel failure pattern detected — compare per-cell distribution before forcing a winner.'];
}

module.exports = { CELL_VERTICALS, VERTICAL_LABELS, GATE, buildRows, normalizeMinMax, diagnose };
