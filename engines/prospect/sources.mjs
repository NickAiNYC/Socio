// ---------------------------------------------------------------------------
// Socio Prospect Engine — source adapters
//
//  - googlePlacesNearby: real Google Places API (Nearby Search) with
//    next_page_token pagination, so the 60-result ceiling is breakable.
//  - gridSearch: density-aware tiling of a corridor into cells; each cell is
//    queried separately and results are deduped by place_id.
//  - demoSearch: deterministic, clearly-labeled synthetic records so the
//    pipeline runs end-to-end without API keys. demo:true is ALWAYS set;
//    demo data is never silently mixed with live results.
//  - yelpSearch / instagramProbe: enrichment stubs that return null unless
//    their API keys are present (honest: not implemented without a key).
// ---------------------------------------------------------------------------

const PLACES_ENDPOINT = 'https://maps.googleapis.com/maps/api/place/nearbysearch/json';

// Corridor configs (NYC density play: own one corridor at a time).
export const CORRIDORS = {
  'east harlem': {
    label: 'East Harlem, NYC',
    center: { lat: 40.7955, lng: -73.9365 },
    bounds: { latMin: 40.7860, latMax: 40.8070, lngMin: -73.9510, lngMax: -73.9220 },
    cellCount: 4
  },
  'washington heights': {
    label: 'Washington Heights, NYC',
    center: { lat: 40.8445, lng: -73.9370 },
    bounds: { latMin: 40.8320, latMax: 40.8560, lngMin: -73.9510, lngMax: -73.9240 },
    cellCount: 4
  },
  'bronx': {
    label: 'South Bronx (Fordham), NYC',
    center: { lat: 40.8590, lng: -73.8970 },
    bounds: { latMin: 40.8500, latMax: 40.8680, lngMin: -73.9100, lngMax: -73.8840 },
    cellCount: 4
  },
  'astoria': {
    label: 'Astoria, Queens, NYC',
    center: { lat: 40.7644, lng: -73.9235 },
    bounds: { latMin: 40.7520, latMax: 40.7770, lngMin: -73.9400, lngMax: -73.9080 },
    cellCount: 4
  }
};

export function getCorridor(area) {
  const key = String(area || '').trim().toLowerCase();
  return CORRIDORS[key] || null;
}

// ---------------------------------------------------------------------------
// Google Places Nearby Search with pagination
// ---------------------------------------------------------------------------
export async function googlePlacesNearby({ lat, lng, radius = 900, keyword, key, maxPages = 3 }) {
  if (!key) return { ok: false, reason: 'no GOOGLE_MAPS_API_KEY', results: [] };

  const out = [];
  let pageToken = null;
  let pages = 0;

  while (pages < maxPages) {
    const params = new URLSearchParams({
      location: `${lat},${lng}`,
      radius: String(radius),
      key
    });
    if (keyword) params.set('keyword', keyword);
    if (pageToken) params.set('pagetoken', pageToken);

    const res = await fetch(`${PLACES_ENDPOINT}?${params.toString()}`);
    if (!res.ok) {
      return { ok: false, reason: `places http ${res.status}`, results: out };
    }
    const data = await res.json();
    if (data.status !== 'OK' && data.status !== 'ZERO_RESULTS') {
      return { ok: false, reason: `places status ${data.status}${data.error_message ? ': ' + data.error_message : ''}`, results: out };
    }

    for (const p of data.results || []) {
      out.push({
        source: 'google_places',
        sourceId: p.place_id,
        name: p.name,
        address: p.vicinity || p.formatted_address || null,
        lat: p.geometry?.location?.lat ?? null,
        lng: p.geometry?.location?.lng ?? null,
        rating: typeof p.rating === 'number' ? p.rating : null,
        reviewCount: typeof p.user_ratings_total === 'number' ? p.user_ratings_total : null,
        website: null,           // Nearby Search doesn't return website — enrichment step would fill this
        sourceRaw: { business_status: p.business_status, types: p.types || [] }
      });
    }

    pageToken = data.next_page_token || null;
    if (!pageToken) break;
    pages += 1;
    // Places API requires a short delay before pagetoken becomes valid
    await new Promise(r => setTimeout(r, 2000));
  }

  return { ok: true, results: out };
}

// ---------------------------------------------------------------------------
// Density-aware grid search
// ---------------------------------------------------------------------------
export async function gridSearch({ area, vertical, key, maxPages = 2 }) {
  const corridor = getCorridor(area);
  if (!corridor) return { ok: false, reason: `unknown corridor "${area}" (known: ${Object.keys(CORRIDORS).join(', ')})`, results: [] };

  const { bounds, cellCount } = corridor;
  const cells = buildCells(bounds, cellCount);
  const byId = new Map();

  for (const cell of cells) {
    const r = await googlePlacesNearby({
      lat: cell.lat,
      lng: cell.lng,
      radius: Math.round(cell.radius),
      keyword: vertical,
      key,
      maxPages
    });
    for (const rec of r.results) {
      if (!byId.has(rec.sourceId)) byId.set(rec.sourceId, rec);
    }
  }

  const results = [...byId.values()];
  // Neighborhood density per record = how many same-vertical competitors we
  // found in the same corridor (this is exactly the density signal we score on).
  for (const rec of results) rec.neighborhoodDensity = results.length;

  return { ok: true, area: corridor.label, results };
}

function buildCells(bounds, n) {
  const cols = Math.max(2, Math.ceil(Math.sqrt(n)));
  const rows = Math.max(2, Math.ceil(n / cols));
  const latStep = (bounds.latMax - bounds.latMin) / rows;
  const lngStep = (bounds.lngMax - bounds.lngMin) / cols;
  const cells = [];
  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < cols; c++) {
      const lat = bounds.latMin + latStep * (r + 0.5);
      const lng = bounds.lngMin + lngStep * (c + 0.5);
      const radius = Math.max(latStep, lngStep) * 0.7 * 111320; // meters
      cells.push({ lat, lng, radius: Math.min(radius, 1600) });
    }
  }
  return cells;
}

// ---------------------------------------------------------------------------
// Demo generator (deterministic, labeled) — lets the pipeline run keyless
// ---------------------------------------------------------------------------
const DEMO_FIRST = ['Bloom', 'Casa', 'Vera', 'Golden', 'Cielo', 'North', 'Elm', 'Rio', 'Luna', 'Fifth', 'Crown', 'Green'];
const DEMO_LAST = ['Floral', 'Bloom House', 'Garden Co', 'Cafe', 'Bites', 'Market', 'Bakery', 'Corner', 'Studio', 'Kitchen'];

export function demoSearch({ area, vertical, count = 12, seed = null }) {
  const corridor = getCorridor(area);
  const seedKey = seed || `${area}|${vertical}`;
  let h = 2166136261;
  for (let i = 0; i < seedKey.length; i++) {
    h ^= seedKey.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  const rand = () => {
    h ^= h << 13; h ^= h >>> 17; h ^= h << 5;
    return ((h >>> 0) % 10000) / 10000;
  };

  const records = [];
  for (let i = 0; i < count; i++) {
    const name = `${DEMO_FIRST[Math.floor(rand() * DEMO_FIRST.length)]} ${DEMO_LAST[Math.floor(rand() * DEMO_LAST.length)]} #${i + 1}`;
    records.push({
      demo: true,
      source: 'demo_generator',
      sourceId: `demo_${area.replace(/[^a-z]/gi, '_').toLowerCase()}_${vertical}_${i + 1}`,
      name,
      address: `${corridor?.label || area} — synthetic address ${i + 1}`,
      lat: corridor?.center?.lat ?? 40.78,
      lng: corridor?.center?.lng ?? -73.95,
      rating: round1(3.4 + rand() * 1.2),
      reviewCount: Math.floor(rand() * 120),
      reviewsLast30d: Math.floor(rand() * 6),
      website: rand() > 0.45 ? (rand() > 0.5 ? 'none' : `demo-site-${i + 1}.wixsite.com`) : 'demo-site-' + (i + 1) + '.com',
      websiteNote: rand() > 0.85 ? 'under-construction' : undefined,
      googlePosts: rand() > 0.55 ? 'no' : 'yes',
      instagramFollowers: Math.floor(rand() * 4200),
      instagramActive: rand() > 0.7 ? false : true,
      whatsappBusiness: rand() > 0.6 ? 'no' : 'yes',
      posType: rand() > 0.5 ? 'square' : (rand() > 0.5 ? 'clover' : 'unknown'),
      neighborhoodDensity: 4 + Math.floor(rand() * 8)
    });
  }
  return records;
}

function round1(n) { return Math.round(n * 10) / 10; }

// ---------------------------------------------------------------------------
// Enrichment stubs — honest: return null unless the key exists
// ---------------------------------------------------------------------------
export async function yelpSearch(_query) {
  if (!process.env.YELP_API_KEY) return { ok: false, reason: 'no YELP_API_KEY' };
  // TODO: Yelp Fusion Business Search when a key is provisioned.
  return { ok: false, reason: 'yelp adapter not wired (key present but adapter pending)' };
}

export async function instagramProbe(_handle) {
  if (!process.env.INSTAGRAM_SESSION_ID) return { ok: false, reason: 'no INSTAGRAM_SESSION_ID' };
  // TODO: profile probe when a session id is provisioned.
  return { ok: false, reason: 'instagram adapter not wired (session present but adapter pending)' };
}
