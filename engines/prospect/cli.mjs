#!/usr/bin/env node
// ---------------------------------------------------------------------------
// Socio Prospect Engine — CLI
//
//   node engines/prospect/cli.mjs --area "East Harlem" --vertical florist [options]
//
// Options:
//   --area       corridor key: east harlem | washington heights | bronx | astoria
//   --vertical   florist | cafe | bodega | restaurant | clinic   (default florist)
//   --limit      max prospects to pass to Pitch (default 10, hard cap 12)
//   --min-score  minimum Digital Gap Score to pass (default 40)
//   --demo       force demo mode even when GOOGLE_MAPS_API_KEY exists
//   --out        write packet JSON to this file (default outputs/prospects/<date>.json)
//
// Real mode requires GOOGLE_MAPS_API_KEY; without it the CLI runs in demo
// mode and every record carries demo:true. Demo packets are never labeled
// as live data downstream.
// ---------------------------------------------------------------------------
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { gridSearch, demoSearch, getCorridor } from './sources.mjs';
import { scoreProspects, MAX_LIMIT } from './score.mjs';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

function parseArgs(argv) {
  const opts = { area: 'east harlem', vertical: 'florist', limit: 10, minScore: 40, demo: false, out: null };
  for (let i = 0; i < argv.length; i++) {
    const a = argv[i];
    if (a === '--area') opts.area = argv[++i];
    else if (a === '--vertical') opts.vertical = argv[++i];
    else if (a === '--limit') opts.limit = parseInt(argv[++i], 10);
    else if (a === '--min-score') opts.minScore = parseInt(argv[++i], 10);
    else if (a === '--demo') opts.demo = true;
    else if (a === '--out') opts.out = argv[++i];
  }
  return opts;
}

async function main() {
  const opts = parseArgs(process.argv.slice(2));
  const corridor = getCorridor(opts.area);
  if (!corridor) {
    console.error(`Unknown corridor "${opts.area}". Known: east harlem, washington heights, bronx, astoria`);
    process.exit(2);
  }

  const hasKey = Boolean(process.env.GOOGLE_MAPS_API_KEY);
  const useDemo = opts.demo || !hasKey;
  const mode = useDemo ? 'demo' : 'live';

  let records;
  let gather;
  if (useDemo) {
    records = demoSearch({ area: opts.area, vertical: opts.vertical, count: 12 });
    gather = { mode, reason: opts.demo ? 'forced by --demo' : 'no GOOGLE_MAPS_API_KEY', generator: 'demo_generator' };
  } else {
    const g = await gridSearch({ area: opts.area, vertical: opts.vertical, key: process.env.GOOGLE_MAPS_API_KEY });
    if (!g.ok || g.results.length === 0) {
      console.error(`Grid search failed: ${g.reason || 'no results'} — falling back to demo mode`);
      records = demoSearch({ area: opts.area, vertical: opts.vertical, count: 12 });
      gather = { mode: 'demo', reason: g.reason || 'empty live results', generator: 'demo_generator' };
    } else {
      records = g.results;
      gather = { mode: 'live', corridor: g.area, cells: 'grid', generator: 'google_places' };
    }
  }

  const result = scoreProspects(records, {
    area: corridor.label,
    vertical: opts.vertical,
    limit: opts.limit,
    minScore: opts.minScore
  });

  const packet = {
    kind: 'socio-prospect-packet',
    version: 1,
    generatedAt: result.generatedAt,
    gather,
    area: corridor.label,
    vertical: opts.vertical,
    model: result.model,
    manifestoCapped: true,
    cap: result.cap,
    maxCap: MAX_LIMIT,
    inputs: result.inputs,
    passedThreshold: result.passedThreshold,
    selected: result.selected,
    prospects: result.prospects
  };

  // Persist the packet (sourcing delivers scored, consented packets only).
  const outFile = opts.out || path.join(__dirname, '..', '..', 'outputs', 'prospects', `${new Date().toISOString().slice(0, 10)}.json`);
  fs.mkdirSync(path.dirname(outFile), { recursive: true });
  fs.writeFileSync(outFile, JSON.stringify(packet, null, 2));

  // Human summary
  console.log(`\nSocio Prospect Scan — ${corridor.label} · ${opts.vertical}`);
  console.log(`Mode: ${mode.toUpperCase()}${useDemo ? ' (demo data — demo:true on every record)' : ''} · inputs=${result.inputs} · passed=${result.passedThreshold} · selected=${result.selected} (cap ${result.cap})`);
  console.log('-'.repeat(88));
  for (const p of result.prospects) {
    const est = p.recoverableRevenue.monthly;
    console.log(
      `${String(p.score).padStart(3)}  ${p.leakageTier.padEnd(6)}  ${p.name.padEnd(34)} ` +
      `~$${est.mid.toLocaleString()}/mo (${est.low.toLocaleString()}-${est.high.toLocaleString()})  cov ${p.coveragePct}%  ` +
      `gaps: ${p.gaps.map(g => g.signal).join(', ') || 'none'}`
    );
  }
  console.log('-'.repeat(88));
  console.log(`Packet written to ${outFile}`);
  console.log(`Pitch consumes ONLY this packet — ${result.selected} prospects, all >= score ${result.minScore}.`);
}

main().catch(err => {
  console.error('Fatal:', err.message);
  process.exit(1);
});
