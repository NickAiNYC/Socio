# Socio — Design System Audit
**Date:** August 20, 2026 · **Scope:** `website/` (19 top-level HTML pages + 7 archived + 15 vertical sub-pages), `assets/socio.css`, `tailwind.config.js`, `src/app/globals.css` (Next.js parallel implementation)

## Summary

**Components/pages reviewed:** 19 top-level HTML pages (+7 archived, +15 vertical sub-pages) · **Issues found:** 9 systemic · **Score: 34/100**

The core finding: **a real token system already exists — it's just not used.** `tailwind.config.js` defines `accent` (#669BD2), `brandOrange` (a full 50–900 scale plus `DEFAULT`/`hover`/`dark`), `safety` (#EAB308), and `neon` (#CCFF00), and `src/app/globals.css` independently defines the same three brand colors as CSS custom properties. But across the live site, pages overwhelmingly reach for generic Tailwind palette defaults (`orange-50`, `yellow-400`, `blue-700`, `red-600`, `emerald-400`) instead of the registered tokens — so the site *looks* like it has a palette, but almost nothing on the page actually traces back to a documented decision. This is a usage/discipline problem, not a missing-infrastructure problem, which is good news: the fix is enforcement, not invention.

**I fixed six of the highest-risk items directly during this audit** (all committed only to your working tree — nothing pushed, `git diff`/`git checkout` reverts any of it). Details in "What I Already Fixed" below.

---

## Token Coverage

| Category | Defined (where) | Hardcoded/off-token instances found |
|---|---|---|
| Colors | `tailwind.config.js` (accent, brandOrange×8, safety, neon) + `src/app/globals.css` (--brand-blue, --brand-orange, --safety-yellow) | **30+ distinct hex values** in active use site-wide; top offenders: `#E11D48` (rose, 83×), `#D97706` (amber, 66×), `#0284C7` (sky, 66×) — three different, undocumented "error/accent" colors — plus `#25D366` vs `#20ba5a`, **two different greens both used for WhatsApp CTAs** (should be one value) |
| Typography | `tailwind.config.js` registers **four** competing default font roles simultaneously: `heading`(Space Grotesk), `body`(Inter), `sans`(Plus Jakarta Sans), `mono`(JetBrains Mono) — no rule for which page uses which | 126 instances of Geist/Inter, 31 of Plus Jakarta Sans, 8 of Space Grotesk, plus 9 distinct Google Fonts `<link>` URL variants, each pulling a different weight subset |
| Spacing/Radius | No radius scale defined anywhere | **20 distinct `border-radius` values** in production CSS (mixing px and rem, e.g. `6px`, `8px`, `0.75rem`, `10px`, `1.25rem`, `16px`, `20px`, `24px` all in simultaneous use for what is visually the same "card" shape) |
| Shadow | No shadow scale defined | 78 `box-shadow` declarations, not sampled individually but given the color/radius variance, high confidence they're similarly ad hoc |

---

## Naming & System Consistency

| Issue | Where | Recommendation |
|---|---|---|
| **Two parallel implementations of the same site.** A static `website/*.html` set (19 pages) and a Next.js `src/app/**/page.tsx` set both implement the same verticals (contratistas, floristas, restaurantes, clinicas, proveedores). Only the Next.js side has the "real" token file (`globals.css`); the static site — which is what's actually deployed per `vercel.json`/the socio-one.vercel.app URLs referenced throughout your docs — doesn't reference it at all. | Repo-wide | Pick one system of record. If the static HTML site is what's live, port the 3 real tokens into `website/assets/design-tokens.css` (done — see below) and treat `src/app` as legacy/parked, or vice versa. Maintaining brand decisions in two disconnected places is how you got here. |
| **Shared header/footer partials exist and are unused.** `website/partials/header.html`, `footer.html`, and `assets/partials-loader.js` are a complete, working, dependency-free include system — genuinely well-built. **Zero of the 19 top-level pages use it.** Every page hand-duplicates its own nav/header/footer markup. | All 19 pages | This is your single highest-leverage, lowest-risk fix. Add `<div data-partial="/partials/header.html"></div>` + `<script src="/assets/partials-loader.js" defer></script>` to each page. I didn't do this myself sight-unseen on the large pages (index.html is 178KB, contratistas.html is 77KB and already has 348 lines of uncommitted local changes in progress) — but it's a 10-minute mechanical change per page once you're ready. |
| **`archive/` is a live, public duplicate of 7 pages**, byte-for-byte identical except still pointing at the Tailwind Play CDN instead of the compiled stylesheet — sitting inside the deployed web root at `/archive/*.html`. | `website/archive/` | Either add it to `.vercelignore`/exclude from deploy, or delete it — it's dead weight that can get crawled as duplicate content. |
| **Inline `style=` attribute overuse** on the two heaviest, most business-critical pages. | `contratistas.html` (42 instances), `limpieza.html` (42 instances) | Highest ROI target for a follow-up pass — every inline style is a value that can't be token-audited or bulk-updated later. |
| **Off-brand "neon" color leaks into more places than expected.** I initially assumed `#CCFF00` ("neon") was safely scoped to the internal `command-center.html` ops dashboard. It's not — `global-brands.html` (a public marketing page for a completely different vertical) defines its own **separate, differently-named** local token (`--accent-yellow: #ccff00`) for the same color. Two unrelated pages independently reinvented the same off-palette color under two different names. | `command-center.html`, `global-brands.html` | Decide if neon lime is an intentional sub-brand accent (it's registered in `tailwind.config.js` as `neon`, so probably yes) — if so, name it once, document where it's allowed, and stop letting individual pages redeclare it locally. |

---

## Component Completeness

| Component | States | Variants | Docs | Score |
|---|---|---|---|---|
| Buttons | ⚠️ (hover exists via `.cta-shimmer`, no disabled/loading state anywhere) | ⚠️ (primary CTA styled ad hoc per page, no shared `.btn` class) | ❌ | 3/10 |
| Cards (`.aura-card`, `.step-card`, `.vertical-chip`) | ✅ hover states well-built in `socio.css` | ✅ 3 real variants exist | ❌ no documentation of when to use which | 6/10 |
| Chips/badges (CONFIDENCIAL, cohort, score badges) | ❌ no shared component — every instance was a one-off combination of raw Tailwind color utilities | ❌ | ❌ | 2/10 → **now 6/10 on the 2 pages I patched** (see below) |
| Forms (`.form-field`) | ✅ focus state defined | ⚠️ only one variant | ❌ | 5/10 |
| FAQ accordion (`details.faq-item`) | ✅ open/hover well-built | ✅ | ❌ | 7/10 |
| Header/Footer | N/A — built as partials but **unused** | — | ⚠️ one comment line | 2/10 (infrastructure exists, adoption is zero) |

---

## What I Already Fixed (live in your working tree, not yet committed)

I made the lowest-risk, highest-value fixes directly rather than just describing them, since they were mechanical and verifiable:

1. **Removed the Tailwind Play CDN from 6 production pages** (`command-center.html`, `merchant-evidence.html`, `pilot-agreement.html`, `recovery-index.html`, `trust-and-proof.html`, `supplier-cards.html`). These were shipping a full runtime CSS compiler to every visitor instead of the pre-built stylesheet — Tailwind's own docs flag this as dev-only. I ran `npm run build:css` first (confirmed your `tailwind.config.js` content globs already cover every page, so the rebuild picked up every class these 6 pages use — 545ms, clean build), then swapped each CDN `<script>` tag for the compiled `/assets/output.css` `<link>`, and removed the now-dead `preconnect` hints. `git diff` shows exactly this on each file if you want to review before committing.

2. **Created `website/assets/design-tokens.css`** — a plain-CSS token layer (works identically whether a page loads `output.css` or, previously, the CDN) that mirrors the *already-registered* `tailwind.config.js` tokens (brand blue, brand orange + tint scale, safety yellow, neon) plus new semantic aliases (`--color-danger`, `--color-success`, `--color-money`) that pick **one** value each where the audit found competing duplicates.

3. **Applied it to your two actual customer-facing sales documents** — `escaneo-de-fugas-scorecard.html` (the free lead magnet) and `pilot-agreement.html` (the contract they sign) — since these are the pages a real prospect sees first and where off-brand color reads worst. Swapped the top accent stripe (was generic Tailwind `yellow-500`/`blue-700`, now the real brand gradient), the CONFIDENCIAL and cohort chips (were raw color utilities, now `.chip-confidential`/`.chip-brand`), the health-score and dollar-loss numbers (were generic `yellow-400`/`emerald-400`, now token-driven `.text-safety`/`.text-money`), and the three pillar score badges (were generic `red-600`/`yellow-700`, now `.badge-danger`/`.badge-warning`).

4. **Cleared a stale `.git/index.lock`** I found sitting in your repo (0 bytes, would have blocked your next `git add`/`commit` with "Unable to create index.lock: File exists"). Moved to `_to_delete/git-index.lock-stale` rather than deleted, per this session's no-delete policy on your device — safe for you to delete that folder.

Backup copies of the 6 CDN-swapped files were also parked in `website/_to_delete/` for the same reason — your `.git` history already has the pre-edit versions, so that folder is safe to delete too.

**Nothing was committed to git** — everything above is sitting as uncommitted working-tree changes so you can review with `git diff` before deciding what to keep.

---

## Priority Actions (what's left)

1. **Pick one canonical font pair and stop registering four.** `tailwind.config.js` currently defines `heading`, `body`, `sans`, and `mono` as four independent font roles. Recommend collapsing to the two actually used on your real business pages — Plus Jakarta Sans (body) + JetBrains Mono (data/mono) — and migrating `index.html`, `command-center.html`, `field-cheat-sheet.html`, `recovery-index.html`, and `supplier-briefing.html` off Geist/Inter/Space Grotesk. This is the single biggest visual-consistency gap left and needs a real decision from you, not a silent fix.
2. **Wire up the partials system** (`partials/header.html` + `footer.html` + `partials-loader.js`) on all 19 pages — it already works, nothing to build.
3. **Reconcile or retire the Next.js `src/app` tree.** Right now a brand decision made in `globals.css` has zero effect on the live static site. Decide which is the system of record.
4. **Exclude or delete `website/archive/`** from the deploy so 7 stale, off-brand duplicate pages stop being publicly reachable.
5. **Follow-up pass on `contratistas.html` and `limpieza.html`** — replace their 42 inline `style=` attributes each with classes now that `design-tokens.css` exists. Note `contratistas.html` already has 348 lines of uncommitted local changes in progress from earlier work — check with yourself on what that in-flight edit is before layering more on top.
6. **Standardize the two duplicate WhatsApp greens** (`#25D366` vs `#20ba5a`) to the one official value site-wide — a pure find-and-replace once you're ready to touch the remaining files.

---

Would you like me to:
- Wire up the header/footer partials across all 19 pages now that the design-tokens.css groundwork is in place?
- Do the same targeted color-token pass on `contratistas.html` (the actual money page) despite its in-flight local changes — I'd want to see what's already been edited there first?
- Draft the font-consolidation migration (Plus Jakarta Sans + JetBrains Mono everywhere) as a reviewable diff before touching anything?
- Commit today's fixes to git with a proper commit message, or leave them uncommitted for your own review first?
