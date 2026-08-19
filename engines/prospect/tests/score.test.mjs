import { test } from 'node:test';
import assert from 'node:assert/strict';
import {
  scoreProspects, recoverableEstimate, MAX_LIMIT,
  computeFeedbackStats, adjustedVerticalBase, MIN_FEEDBACK_SAMPLE
} from '../score.mjs';

const baseRecord = {
  name: 'Test Florist',
  address: 'East Harlem, NYC',
  rating: 3.8,
  reviewCount: 12,
  reviewsLast30d: 0,
  website: 'none',
  googlePosts: 'no',
  instagramFollowers: 120,
  instagramActive: false,
  whatsappBusiness: 'no',
  posType: 'unknown',
  neighborhoodDensity: 8
};

test('high-gap prospect scores HIGH and passes threshold', () => {
  const res = scoreProspects([baseRecord], { area: 'East Harlem, NYC', vertical: 'florist', limit: 10, minScore: 40 });
  assert.equal(res.selected, 1);
  assert.equal(res.prospects.length, 1);
  const p = res.prospects[0];
  assert.ok(p.score >= 65, `expected high score, got ${p.score}`);
  assert.equal(p.leakageTier, 'HIGH');
  assert.ok(p.gaps.length >= 4, 'expected multiple gaps');
  assert.equal(p.recoverableRevenue.estimate, true);
  assert.equal(p.recoverableRevenue.model, 'v1');
});

test('strong prospect scores LOW and is filtered out', () => {
  const strong = {
    ...baseRecord,
    rating: 4.7,
    reviewCount: 210,
    reviewsLast30d: 8,
    website: 'cristalflowers.example.com',
    googlePosts: 'yes',
    instagramFollowers: 4200,
    instagramActive: true,
    whatsappBusiness: 'yes',
    posType: 'square',
    neighborhoodDensity: 2
  };
  const res = scoreProspects([strong], { area: 'East Harlem, NYC', vertical: 'florist', minScore: 40 });
  assert.equal(res.selected, 0, 'strong store must not be pitch-worthy');
  assert.equal(res.prospects.length, 0);
});

test('unknown signals do not inflate score — coverage is reported', () => {
  const sparse = { name: 'Sparse', address: 'x', rating: null, reviewCount: null, reviewsLast30d: null };
  // minScore 0 so the sparse record actually appears in prospects for inspection
  const res = scoreProspects([sparse], { area: 'East Harlem, NYC', vertical: 'florist', minScore: 0 });
  const p = res.prospects[0];
  assert.ok(p, 'sparse record should be inspectable with minScore 0');
  assert.ok(p.coveragePct < 100, `coverage should be < 100, got ${p.coveragePct}`);
  assert.ok(p.score <= 35, `unknown-only record should not score high, got ${p.score}`);
});

test('Manifesto cap: limit is clamped to MAX_LIMIT and sorting is desc', () => {
  const records = Array.from({ length: 30 }, (_, i) => ({
    ...baseRecord,
    name: `Store ${i}`,
    reviewCount: i * 3,
    reviewsLast30d: i % 3,
    instagramFollowers: 50 + i * 10
  }));
  const res = scoreProspects(records, { area: 'East Harlem, NYC', vertical: 'florist', limit: 999 });
  assert.equal(res.cap, MAX_LIMIT);
  assert.ok(res.prospects.length <= MAX_LIMIT);
  const scores = res.prospects.map(p => p.score);
  assert.deepEqual(scores, [...scores].sort((a, b) => b - a), 'prospects must be sorted by score desc');
});

test('recoverableEstimate is a labeled estimate, never a promise', () => {
  const est = recoverableEstimate({ neighborhoodDensity: 5 }, 70, 'florist');
  assert.equal(est.estimate, true);
  assert.ok(est.monthly.low <= est.monthly.mid && est.monthly.mid <= est.monthly.high);
  assert.match(est.note, /[Nn]ot a promise/);
});

// --- conversion feedback ----------------------------------------------------

function outcomeEvent(vertical, outcome, i) {
  return {
    type: 'prospect_outcome',
    amount: 0,
    occurredAt: new Date(Date.now() - i * 86400000).toISOString(),
    metadata: { prospectId: `p${i}`, vertical, outcome }
  };
}

test('feedback: below sample threshold stays on priors and says so', () => {
  const outcomes = Array.from({ length: 5 }, (_, i) => outcomeEvent('florist', 'meeting_booked', i));
  const stats = computeFeedbackStats(outcomes);
  assert.equal(stats.florist.nOutcomes, 5);
  assert.equal(stats.florist.learned, false);
  const base = adjustedVerticalBase('florist', stats);
  assert.equal(base.adjusted, false);
  assert.equal(base.monthlyBase, 1900); // unchanged prior
  assert.match(base.reason, /insufficient outcomes/);
});

test('feedback: learned vertical adjusts the estimate base with clamp', () => {
  // 20 outcomes, 9 positive -> 45% conversion (well above the 3% prior)
  const outcomes = Array.from({ length: 20 }, (_, i) =>
    outcomeEvent('florist', i < 9 ? 'meeting_booked' : 'no_response', i)
  );
  const stats = computeFeedbackStats(outcomes);
  assert.equal(stats.florist.learned, true);
  assert.equal(stats.florist.conversionRate, 0.45);
  const base = adjustedVerticalBase('florist', stats);
  assert.equal(base.adjusted, true);
  assert.ok(base.monthlyBase > 1900, `expected uplift, got ${base.monthlyBase}`);
  assert.ok(base.factor <= 1.4, 'clamped to max 1.4x');
  assert.equal(base.estimate, true);
});

test('feedback: invalid outcomes are ignored, stats never fabricate', () => {
  const outcomes = [
    outcomeEvent('cafe', 'meeting_booked', 1),
    { type: 'prospect_outcome', metadata: { vertical: 'cafe', outcome: 'not_a_real_outcome' } },
    { type: 'revenue', amount: 100 } // not an outcome at all
  ];
  const stats = computeFeedbackStats(outcomes);
  assert.equal(stats.cafe.nOutcomes, 1);
  assert.equal(stats.cafe.nPositive, 1);
  assert.equal(stats.cafe.learned, false);
  assert.equal(MIN_FEEDBACK_SAMPLE, 10);
});
