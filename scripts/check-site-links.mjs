#!/usr/bin/env node
/**
 * check-site-links.mjs — static link integrity check for website/.
 *
 * Catches the class of bug found in the 2026-08-20 audit:
 *   - limpieza.html shipped with contratistas.html's nav (cross-vertical links)
 *   - clinicas.html / restaurantes.html navs pointed at #anchors that did not exist
 *   - sitemap.xml listed a URL twice and omitted two live pages
 *
 * Usage: npm run check:links
 * Exits 1 on errors, 0 on warnings only.
 */
import { readFileSync, readdirSync, statSync, existsSync } from 'node:fs';
import { join, dirname, resolve, relative } from 'node:path';

const ROOT = resolve(process.cwd(), 'website');
const SKIP = ['archive', '_to_delete', 'partials', 'assets', 'api'];
const VERTICALS = ['contratistas', 'clinicas', 'floristas', 'restaurantes', 'limpieza', 'proveedores'];
// Deliberate cross-links: supplier pages funnel to the contractor portal by design.
const ALLOWED_CROSS = new Set(['proveedores->contratistas']);

function walk(dir, out = []) {
  for (const e of readdirSync(dir)) {
    const p = join(dir, e);
    if (statSync(p).isDirectory()) { if (!SKIP.includes(e)) walk(p, out); }
    else if (e.endsWith('.html')) out.push(p);
  }
  return out;
}

/** Vercel clean-URLs: /foo -> website/foo.html, or website/foo/index.html */
function resolveUrl(url) {
  const clean = url.split(/[?#]/)[0].replace(/\/$/, '') || '/index';
  const base = join(ROOT, clean.startsWith('/') ? clean.slice(1) : clean);
  for (const c of [base, base + '.html', join(base, 'index.html')]) {
    if (existsSync(c) && statSync(c).isFile()) return c;
  }
  return null;
}

const files = walk(ROOT).sort();
const errors = [];
const warnings = [];

for (const file of files) {
  const rel = relative(ROOT, file);
  const html = readFileSync(file, 'utf8');
  const ids = new Set([...html.matchAll(/\sid="([^"]+)"/g)].map((m) => m[1]));
  const owner = VERTICALS.find((v) => rel === `${v}.html` || rel.startsWith(`${v}/`));

  for (const m of html.matchAll(/\shref="([^"]+)"/g)) {
    const href = m[1];
    if (/^(https?:|mailto:|tel:|data:|javascript:|#$)/.test(href)) continue;

    // same-page anchor
    if (href.startsWith('#')) {
      const id = href.slice(1);
      if (id && !ids.has(id)) errors.push(`${rel}: dead anchor ${href}`);
      continue;
    }

    const target = href.startsWith('/') ? href : '/' + join(dirname(rel), href).replace(/\\/g, '/');
    if (!resolveUrl(target)) { errors.push(`${rel}: broken link -> ${href}`); continue; }

    // cross-vertical nav leakage (the limpieza bug)
    const other = VERTICALS.find((v) => target === `/${v}` || target.startsWith(`/${v}/`));
    if (owner && other && other !== owner && !ALLOWED_CROSS.has(`${owner}->${other}`)) {
      warnings.push(`${rel}: links into /${other}/ (page belongs to /${owner}/) -> ${href}`);
    }
  }
}

// --- sitemap consistency -------------------------------------------------
const smPath = join(ROOT, 'sitemap.xml');
if (existsSync(smPath)) {
  const sm = readFileSync(smPath, 'utf8');
  const locs = [...sm.matchAll(/<loc>([^<]+)<\/loc>/g)].map((m) => m[1]);
  const paths = locs.map((l) => l.replace(/^https?:\/\/[^/]+/, ''));

  const seen = new Set();
  for (const p of paths) {
    if (seen.has(p)) errors.push(`sitemap.xml: duplicate <loc> ${p}`);
    seen.add(p);
    if (!resolveUrl(p)) errors.push(`sitemap.xml: <loc> does not resolve -> ${p}`);
  }
  for (const p of paths) {
    const f = resolveUrl(p);
    if (f && /name="robots"[^>]*noindex/.test(readFileSync(f, 'utf8'))) {
      errors.push(`sitemap.xml: lists a noindex page -> ${p}`);
    }
  }
  for (const file of files) {
    const html = readFileSync(file, 'utf8');
    if (/name="robots"[^>]*noindex/.test(html)) continue;
    const rel = relative(ROOT, file);
    if (rel === '404.html') continue;
    const url = '/' + rel.replace(/\.html$/, '').replace(/\/index$/, '').replace(/^index$/, '');
    if (!seen.has(url === '/' ? '/' : url)) {
      warnings.push(`sitemap.xml: indexable page missing from sitemap -> ${url}`);
    }
  }
}

// --- report --------------------------------------------------------------
const pad = (n) => String(n).padStart(3);
console.log(`\nchecked ${files.length} pages in website/\n`);
for (const w of warnings) console.log(`  WARN  ${w}`);
for (const e of errors) console.log(`  ERROR ${e}`);
console.log(`\n${pad(errors.length)} error(s)\n${pad(warnings.length)} warning(s)\n`);
process.exit(errors.length ? 1 : 0);
