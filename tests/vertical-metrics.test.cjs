'use strict';
const test = require('node:test');
const assert = require('node:assert');
const { buildRows, normalizeMinMax, diagnose, GATE } = require('../lib/vertical-metrics.cjs');

function lead(over = {}) {
  return {
    lead_id: 'rli_' + Math.random().toString(16).slice(2),
    submitted_at: '2026-08-19T12:00:00.000Z',
    merchant: { business_name: 'Shop', vertical: 'florist', locations: '1' },
    server_assessment: { recovery_score: 80, sales_tier: 'high' },
    status: { booking_state: 'unbooked', data_access_state: null },
    attribution: { utm_source: 'founder' },
    ...over
  };
}

function ev(name, over = {}) {
  return { name, vertical: 'florist', utm_source: 'founder', timestamp: '2026-08-19T12:00:00.000Z', ...over };
}

test('gates: PENDING with insufficient data, no priority score', () => {
  const rows = buildRows({
    rliLeads: [lead(), lead({ server_assessment: { recovery_score: 60, sales_tier: 'opportunity' } })],
    events: [ev('rli_started'), ev('rli_vertical_click'), ev('rli_vertical_view')]
  });
  const florist = rows.find((r) => r.vertical === 'florist');
  assert.strictEqual(florist.completed, 2);
  assert.strictEqual(florist.gate.cleared, false);
  assert.strictEqual(florist.gate.status, 'PENDING');
  assert.strictEqual(florist.priority, null); // "Insufficient data" — never a score
});

test('gates: CLEARED only at >=30 completed AND >=10 qualified; priority computed then', () => {
  const leads = [];
  for (let i = 0; i < 30; i++) {
    leads.push(lead({ merchant: { business_name: 'F' + i, vertical: 'florist' }, server_assessment: { recovery_score: i < 10 ? 78 : 55, sales_tier: i < 10 ? 'high' : 'opportunity' } }));
  }
  // second vertical with 30 completed but only 9 qualified -> must stay PENDING
  for (let i = 0; i < 30; i++) {
    leads.push(lead({ merchant: { business_name: 'C' + i, vertical: 'cafe' }, server_assessment: { recovery_score: i < 9 ? 76 : 40, sales_tier: i < 9 ? 'high' : 'foundation' } }));
  }
  const rows = buildRows({ rliLeads: leads, events: [] });
  const florist = rows.find((r) => r.vertical === 'florist');
  const cafe = rows.find((r) => r.vertical === 'cafe');
  assert.strictEqual(florist.gate.cleared, true);
  assert.strictEqual(florist.gate.status, 'CLEARED');
  assert.ok(florist.priority && typeof florist.priority.score === 'number');
  assert.strictEqual(cafe.gate.cleared, false); // 9 qualified < 10
  assert.strictEqual(cafe.priority, null);
});

test('booking naming caveat: intent/scheduled/attended use sequential denominators', () => {
  const booked = lead({ status: { booking_state: 'booked', data_access_state: null } });
  const scheduled = lead({ status: { booking_state: 'scheduled', data_access_state: 'requested' } });
  const attended = lead({ status: { booking_state: 'attended', data_access_state: 'granted' } });
  const rows = buildRows({
    rliLeads: [booked, scheduled, attended].map((l) => ({ ...l, server_assessment: { recovery_score: 90, sales_tier: 'high' } })),
    events: []
  });
  const florist = rows.find((r) => r.vertical === 'florist');
  assert.strictEqual(florist.booking_intent, 3);   // all three booked (intent)
  assert.strictEqual(florist.booking_intent_pct, 100); // 3/3 qualified
  assert.strictEqual(florist.founder_scheduled, 2);  // booked -> scheduled
  assert.strictEqual(florist.founder_scheduled_pct, 66.7); // 2/3 booked
  assert.strictEqual(florist.attended, 1);           // scheduled -> attended
  assert.strictEqual(florist.attended_pct, 50);      // 1/2 scheduled
  assert.strictEqual(florist.data_granted, 1);
  assert.strictEqual(florist.access_pct, 33.3);      // 1/3 booked
});

test('normalizeMinMax: min 0, max 100, all-equal neutral 50', () => {
  const n = normalizeMinMax([0.2, 0.6, 0.9]);
  assert.deepStrictEqual(n, { 0: 0, 1: 57.1, 2: 100 });
  assert.deepStrictEqual(normalizeMinMax([0.5, 0.5]), { 0: 50, 1: 50 });
});

test('priority score formula weights (0.20/0.20/0.25/0.20/0.15)', () => {
  // Two cleared verticals with known ratios -> assert the exact V for the winner.
  const mk = (vertical, n, qual, book, grant, starts) => {
    const out = [];
    for (let i = 0; i < n; i++) {
      const booked = i < book;
      const granted = i < grant;
      out.push(lead({
        merchant: { business_name: vertical + i, vertical },
        server_assessment: { recovery_score: i < qual ? 80 : 40, sales_tier: i < qual ? 'high' : 'foundation' },
        status: { booking_state: booked ? 'booked' : 'unbooked', data_access_state: granted ? 'granted' : null }
      }));
    }
    return out;
  };
  const a = mk('florist', 30, 20, 10, 8, 0);   // qual .667, book .5, access .8
  const b = mk('cafe', 30, 30, 30, 3, 0);      // qual 1, book 1, access .1
  const events = [];
  for (const v of ['florist', 'cafe']) {
    events.push(ev('rli_started', { vertical: v }));
    events.push(ev('rli_vertical_view', { vertical: v }));
    events.push(ev('rli_vertical_click', { vertical: v }));
  }
  const rows = buildRows({ rliLeads: [...a, ...b], events });
  const florist = rows.find((r) => r.vertical === 'florist');
  const cafe = rows.find((r) => r.vertical === 'cafe');
  assert.ok(florist.priority && cafe.priority);
  // All clicks==views==starts==1 -> ctr, completion normalized neutral (50) both.
  // qual: florist .667 -> 0, cafe 1 -> 100. book: florist .5 -> 0, cafe 1 -> 100.
  // access: florist .8 -> 100, cafe .1 -> 0.
  // florist V = .2*50 + .2*50 + .25*0 + .2*0 + .15*100 = 10+10+0+0+15 = 35
  // cafe V     = .2*50 + .2*50 + .25*100 + .2*100 + .15*0 = 10+10+25+20+0 = 65
  assert.strictEqual(florist.priority.score, 35);
  assert.strictEqual(cafe.priority.score, 65);
});

test('date range and utm_source filters apply to both leads and events', () => {
  const rows = buildRows({
    rliLeads: [
      lead({ submitted_at: '2026-08-01T00:00:00.000Z', attribution: { utm_source: 'linkedin' } }),
      lead({ submitted_at: '2026-08-19T00:00:00.000Z', attribution: { utm_source: 'founder' } })
    ],
    events: [
      ev('rli_vertical_click', { timestamp: '2026-08-01T00:00:00.000Z', utm_source: 'linkedin' }),
      ev('rli_vertical_click', { timestamp: '2026-08-19T00:00:00.000Z', utm_source: 'founder' })
    ],
    from: '2026-08-10T00:00:00.000Z',
    to: '2026-08-31T00:00:00.000Z',
    utmSource: 'founder'
  });
  const florist = rows.find((r) => r.vertical === 'florist');
  assert.strictEqual(florist.completed, 1);
  assert.strictEqual(florist.clicks, 1);
});

test('diagnose: low completion flags form friction', () => {
  const rows = buildRows({
    rliLeads: [lead()], // 1 completed
    events: [ev('rli_started'), ev('rli_started'), ev('rli_started')] // 3 starts, 33% completion
  });
  const findings = diagnose(rows);
  assert.ok(findings.some((f) => f.includes('form friction')));
});

test('GATE constants are the sprint spec values', () => {
  assert.strictEqual(GATE.COMPLETED_MIN, 30);
  assert.strictEqual(GATE.QUALIFIED_MIN, 10);
});
