# Socio Prospect Engine

Density-aware corridor scanning → Digital Gap scoring → capped, consented
prospect packets for Socio-Pitch. Read-only by design: this engine never
contacts a merchant. Any outreach that follows is a separate governed action
by Socio-Pitch via `growth_os_propose_action`.

## Run

```bash
# Demo mode (no API key needed) — every record carries demo:true
node engines/prospect/cli.mjs --area "east harlem" --vertical florist --limit 10 --min-score 40

# Live mode (requires GOOGLE_MAPS_API_KEY in env)
GOOGLE_MAPS_API_KEY=... node engines/prospect/cli.mjs --area "east harlem" --vertical florist

# Tests
node --test engines/prospect/tests/score.test.mjs
```

Corridors (own one at a time): `east harlem` · `washington heights` · `bronx` · `astoria`.
Verticals: `florist` · `cafe` · `bodega` · `restaurant` · `clinic`.

Packets are written to `outputs/prospects/<date>.json`. Pitch consumes ONLY
the packet — that is the handoff boundary.

## Digital Gap Score (model v1)

0–100; **higher = bigger digital gap = stronger prospect**. Signals:

| Signal | Weight | Gap when |
|---|---|---|
| website | 25 | missing, or weak (generic builder / under-construction — labeled `estimated`) |
| reviews | 15 | rating < 4.2 AND/OR < 2 reviews in last 30d |
| googlePosts | 10 | no Google Posts |
| instagram | 15 | < 500 followers or inactive |
| whatsapp | 10 | no WhatsApp Business |
| pos | 5 | known non-modern POS (unknown is not penalized) |
| reviewVolume | 10 | below cohort median |
| density | 10 | crowded corridor (≥ 6 same-vertical competitors) |

Honesty rules (same doctrine as the site):
- Unknown signals never count as gaps and never count in the denominator;
  `coveragePct` reports how much of the model was actually observed.
- Recoverable revenue is an `estimate: true`, model v1 prior — a range
  (`low/mid/high`), never a promise.
- Demo records carry `demo: true` and are never mixed silently with live data.

## Governance & cap

- Manifesto: "10 great partners beat 100 mediocre ones" → hard cap `MAX_LIMIT = 12`,
  default `limit 10`, default `minScore 40`. Only records above threshold pass to Pitch.
- Scoring is read-only: `prospect_score_batch` (Growth OS MCP) requires no approval.
- Ledger instrumentation: `prospect_commit_packet` (Growth OS MCP) validates the
  packet and records one `lead_created` event per selected prospect — score,
  gaps, coverage and recoverable-revenue estimate as metadata. Non-financial,
  no Governor approval. The packet FILE stays the single handoff artifact to
  Pitch (see agent-pitch.json HANDOFF BOUNDARY); the ledger makes the handoff
  auditable, no side channels.

## Layout

```
score.mjs    Digital Gap model v1 (pure, testable)
sources.mjs  Google Places adapter (pagination + grid), demo generator, enrichment stubs
cli.mjs      gather → score → packet
tests/       node:test suite
```

Enrichment stubs (Yelp, Instagram probe) return `{ ok:false }` until their API
keys are provisioned — they never fake data.
