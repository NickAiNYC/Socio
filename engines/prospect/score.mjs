// ---------------------------------------------------------------------------
// Socio Prospect Engine — Digital Gap Score (model v1)
//
// Philosophy (Socio Manifesto): "10 great partners beat 100 mediocre ones."
// This scorer exists to surface FEWER, better prospects: the ones with clear,
// attributable revenue upside, and to hide everyone else.
//
// Honesty rules (same doctrine as the site):
//  - Every score component is labeled verified | estimated | unknown.
//  - Unknown signals never count as gaps and never count in the denominator.
//    A record with 40% signal coverage is scored on what we actually know.
//  - Recoverable-revenue is an ESTIMATE (model v1 priors), never a promise.
//  - Demo records carry demo:true and are never mixed silently with live data.
// ---------------------------------------------------------------------------

export const VERTICAL_BASES = {
  florist:    { monthlyBase: 1900, label: 'Florist' },
  cafe:       { monthlyBase: 2600, label: 'Cafe' },
  bodega:     { monthlyBase: 1500, label: 'Bodega / Corner Store' },
  restaurant: { monthlyBase: 2800, label: 'Restaurant' },
  clinic:     { monthlyBase: 3400, label: 'Aesthetic Clinic / MedSpa' }
};

export const DEFAULT_LIMIT = 10;
export const MAX_LIMIT = 12;               // Manifesto cap: 10 great > 100 mediocre
export const DEFAULT_MIN_SCORE = 40;       // below this = LOW leakage, not pitch-worthy

// Gap weights (sum = 100 when every signal is known)
const WEIGHTS = {
  website: 25,
  reviews: 15,
  googlePosts: 10,
  instagram: 15,
  whatsapp: 10,
  pos: 5,
  reviewVolume: 10,
  density: 10
};

function signal(weight, score, status) {
  return { weight, score, status }; // score is gap contribution 0..weight
}

function gapSignal(weight, { verified, unknown, status = 'verified' } = {}) {
  if (unknown) return signal(weight, 0, 'unknown');
  return signal(weight, verified ? weight : 0, status);
}

// --- individual signals -----------------------------------------------------

function websiteSignal(rec) {
  if (rec.website === undefined || rec.website === null) return signal(WEIGHTS.website, 0, 'unknown');
  const w = String(rec.website).trim();
  if (!w || w === '' || w === 'none') return signal(WEIGHTS.website, WEIGHTS.website, 'verified'); // missing = full gap
  // "weak" = generic builder / placeholder domains (honest heuristic, labeled estimated)
  const weak = /wix|weebly|wordpress\.com|squarespace|myshopify|godaddy|000webhost|\.wixsite\./i.test(w) || /placeholder|coming-soon|under-construction/i.test(rec.websiteNote || '');
  return signal(WEIGHTS.website, weak ? Math.round(WEIGHTS.website * 0.6) : 0, weak ? 'estimated' : 'verified');
}

function reviewsSignal(rec) {
  const rate = typeof rec.rating === 'number' ? rec.rating : null;
  const vel = typeof rec.reviewsLast30d === 'number' ? rec.reviewsLast30d : null;
  if (rate === null && vel === null) return signal(WEIGHTS.reviews, 0, 'unknown');
  const weakRating = rate !== null && rate < 4.2;
  const lowVelocity = vel !== null && vel < 2;
  if (weakRating && lowVelocity) return signal(WEIGHTS.reviews, WEIGHTS.reviews, 'verified');
  if (weakRating || lowVelocity) return signal(WEIGHTS.reviews, Math.round(WEIGHTS.reviews * 0.55), 'verified');
  return signal(WEIGHTS.reviews, 0, 'verified');
}

function googlePostsSignal(rec) {
  return gapSignal(WEIGHTS.googlePosts, { verified: rec.googlePosts === false || rec.googlePosts === 'no' || rec.googlePosts === 0, unknown: rec.googlePosts === undefined || rec.googlePosts === null });
}

function instagramSignal(rec) {
  if (rec.instagramFollowers === undefined && rec.instagramActive === undefined) return signal(WEIGHTS.instagram, 0, 'unknown');
  const f = typeof rec.instagramFollowers === 'number' ? rec.instagramFollowers : null;
  const active = rec.instagramActive;
  if (f !== null && f < 500) return signal(WEIGHTS.instagram, WEIGHTS.instagram, 'verified');
  if (active === false) return signal(WEIGHTS.instagram, WEIGHTS.instagram, 'verified');
  if (f !== null && f < 2000) return signal(WEIGHTS.instagram, Math.round(WEIGHTS.instagram * 0.55), 'verified');
  return signal(WEIGHTS.instagram, 0, 'verified');
}

function whatsappSignal(rec) {
  return gapSignal(WEIGHTS.whatsapp, { verified: rec.whatsappBusiness === false || rec.whatsappBusiness === 'no', unknown: rec.whatsappBusiness === undefined || rec.whatsappBusiness === null });
}

function posSignal(rec) {
  if (rec.posType === undefined || rec.posType === null || rec.posType === '' || rec.posType === 'unknown') return signal(WEIGHTS.pos, 0, 'unknown');
  const modern = /square|clover|toast|shopify|stripe/i.test(String(rec.posType));
  return signal(WEIGHTS.pos, modern ? 0 : WEIGHTS.pos, 'verified');
}

function reviewVolumeSignal(rec, cohortMedian) {
  const count = typeof rec.reviewCount === 'number' ? rec.reviewCount : null;
  if (count === null) return signal(WEIGHTS.reviewVolume, 0, 'unknown');
  const median = typeof cohortMedian === 'number' ? cohortMedian : 40;
  return signal(WEIGHTS.reviewVolume, count < median ? WEIGHTS.reviewVolume : 0, 'verified');
}

function densitySignal(rec) {
  const d = typeof rec.neighborhoodDensity === 'number' ? rec.neighborhoodDensity : null;
  if (d === null) return signal(WEIGHTS.density, 0, 'unknown');
  if (d >= 6) return signal(WEIGHTS.density, WEIGHTS.density, 'verified');   // crowded corridor: gaps hurt more
  if (d >= 3) return signal(WEIGHTS.density, Math.round(WEIGHTS.density * 0.5), 'verified');
  return signal(WEIGHTS.density, 0, 'verified');
}

// --- recoverable revenue estimate (model v1 priors, labeled estimate) --------

export function recoverableEstimate(rec, score, vertical) {
  const base = VERTICAL_BASES[vertical]?.monthlyBase || 2200;
  const density = typeof rec.neighborhoodDensity === 'number' ? rec.neighborhoodDensity : 3;
  const gapFactor = 0.5 + score / 100;            // 0.5x at score 0 -> 1.5x at score 100
  const densityFactor = 1 + 0.1 * Math.min(density, 12);
  const mid = Math.round(base * gapFactor * densityFactor);
  const lo = Math.round(mid * 0.7);
  const hi = Math.round(mid * 1.3);
  return {
    monthly: { low: lo, mid, high: hi },
    currency: 'USD',
    estimate: true,
    model: 'v1',
    note: 'Prior-based estimate from gap score × vertical base × corridor density. Not a promise of revenue.'
  };
}

// --- main scoring ------------------------------------------------------------

export function scoreProspects(records, opts = {}) {
  const area = opts.area || 'Unknown area';
  const vertical = opts.vertical || 'florist';
  const rawLimit = opts.limit === undefined || opts.limit === null ? DEFAULT_LIMIT : parseInt(opts.limit, 10);
  const rawMinScore = opts.minScore === undefined || opts.minScore === null ? DEFAULT_MIN_SCORE : parseInt(opts.minScore, 10);
  const limit = Math.min(Number.isFinite(rawLimit) ? rawLimit : DEFAULT_LIMIT, MAX_LIMIT);
  const minScore = Number.isFinite(rawMinScore) ? rawMinScore : DEFAULT_MIN_SCORE;

  if (!Array.isArray(records)) throw new Error('records must be an array');

  const cohortMedian = median(records.map(r => r.reviewCount).filter(n => typeof n === 'number'));

  const scored = records.map(rec => {
    const signals = {
      website: websiteSignal(rec),
      reviews: reviewsSignal(rec),
      googlePosts: googlePostsSignal(rec),
      instagram: instagramSignal(rec),
      whatsapp: whatsappSignal(rec),
      pos: posSignal(rec),
      reviewVolume: reviewVolumeSignal(rec, cohortMedian),
      density: densitySignal(rec)
    };

    const known = Object.values(signals).filter(s => s.status !== 'unknown');
    const knownWeight = known.reduce((sum, s) => sum + s.weight, 0);
    const gapScore = known.reduce((sum, s) => sum + s.score, 0);
    const score = knownWeight > 0 ? Math.round((gapScore / knownWeight) * 100) : 0;
    const coverage = Math.round((knownWeight / 100) * 100);

    const tier = score >= 65 ? 'HIGH' : score >= 40 ? 'MEDIUM' : 'LOW';
    const gaps = Object.entries(signals)
      .filter(([, s]) => s.score > 0)
      .map(([k, s]) => ({ signal: k, status: s.status }));

    return {
      ...rec,
      area,
      vertical,
      score,
      coveragePct: coverage,
      leakageTier: tier,
      gaps,
      recoverableRevenue: recoverableEstimate(rec, score, vertical),
      scoredAt: new Date().toISOString()
    };
  });

  scored.sort((a, b) => b.score - a.score);

  const passed = scored.filter(p => p.score >= minScore);
  const selected = passed.slice(0, limit);

  return {
    model: 'digital-gap-v1',
    area,
    vertical,
    generatedAt: new Date().toISOString(),
    manifestoCapped: true,
    cap: limit,
    maxCap: MAX_LIMIT,
    minScore,
    inputs: scored.length,
    passedThreshold: passed.length,
    selected: selected.length,
    prospects: selected
  };
}

function median(nums) {
  if (nums.length === 0) return null;
  const sorted = [...nums].sort((a, b) => a - b);
  const mid = Math.floor(sorted.length / 2);
  return sorted.length % 2 ? sorted[mid] : Math.round((sorted[mid - 1] + sorted[mid]) / 2);
}
