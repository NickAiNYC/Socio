import { test } from 'node:test';
import assert from 'node:assert/strict';
import { scoreProspects, recoverableEstimate, MAX_LIMIT } from '../score.mjs';

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
