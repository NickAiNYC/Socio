# Website Cleanup — Change Log

*2026-08-20 · 38 files changed, +117 / −107 · working tree only, nothing committed or deployed*

Companion to `website-audit-2026-08-20.md`. Covers the 8 mechanical items; the 4 judgment items are still open at the bottom.

---

## What changed

### 1. Mobile viewport — 2 pages
`contratistas/radar-de-permisos/brooklyn.html`, `.../queens.html` had no viewport meta and rendered desktop-width on phones. Added. Since your entire channel is WhatsApp, these were broken for effectively 100% of their traffic.

### 2. Tailwind CDN → compiled CSS — 19 pages
Replaced `<script src="https://cdn.tailwindcss.com">` with `/assets/output.css` + `/assets/design-tokens.css`, and removed 20 dead `preconnect` tags.

**Verified safe before touching anything:** extracted all 297 distinct classes from those pages and confirmed every one resolves in `output.css`. The only 8 that didn't were `hazard-stripe`, `amber-stripe`, `rose-stripe`, `sky-stripe` (defined in each page's own `<style>`) and four arbitrary `shadow-[0_0_8px_rgba(…)]` utilities that *are* present — my first check just escaped the commas wrong.

Site-wide CDN references: **19 → 0.** No page compiles CSS in the browser anymore.

**Design tokens now load on 35 of 36 pages** (was 2). The exception is `global-brands.html`, which is self-styled with 4.6 KB of its own CSS and never used Tailwind — it only had a stray preconnect, now removed. Correct as-is.

### 3. `limpieza.html` nav
Removed all 8 links into `/contratistas/*` (including "Radar DOB" — DOB construction permits on a cleaning page). Nav now points at that page's own `#calculator` and `#enrollment` sections.

### 4. `clinicas.html` + `restaurantes.html` nav — *same bug, found during the fix*
Both had three nav anchors — `#como-funciona`, `#calculadora`, `#garantia` — and **none of those IDs exist on either page.** Six dead links total. Worse, neither page linked to its own four sub-pages, which is why those sub-pages were reachable only from each other.

Both now link to their real sub-pages, matching the pattern `floristas.html` already used correctly.

### 5. `proveedores/*` un-orphaned
Added a "Proveedores & Ferreterías (NYC)" link to the homepage footer verticals list. The three supplier pages previously linked only to each other and were reachable from nowhere — worth having before Kamco and Feldman.

### 6. Sitemap — 34 → 31 URLs

**Removed:**

- `/merchant-evidence.html` — duplicate of `/merchant-evidence`
- `/command-center` — internal ops dashboard
- `/pilot-agreement`, `/supplier-cards`, `/escaneo-de-fugas-scorecard` — prospect-specific collateral

**Added:** the two radar sub-pages, which were live but unlisted.

**Also:** added `noindex, nofollow` to those four internal pages, and fixed the homepage's one `/merchant-evidence.html` link to the extensionless form every other page uses.

*The de-indexing is a judgment call and fully reversible — one meta tag and a sitemap entry each. My reasoning on the pilot agreement in particular: it's indexed today, so any contractor can read the "founding cohort, 5 slots" framing at any time, which quietly removes the scarcity you use in the pitch.*

### 7. Link checker — `scripts/check-site-links.mjs`
New, wired up as `npm run check:links`. Validates every internal href resolves (handling Vercel clean URLs), every `#anchor` exists on its page, and flags cross-vertical nav links — the exact bug `limpieza.html` had. Also checks the sitemap for duplicates, dead entries, `noindex` pages, and indexable pages that are missing.

Exits non-zero on errors, so it can gate a deploy.

Deliberate cross-links are allowlisted (`proveedores → contratistas`), so the supplier pages don't produce permanent noise.

### 8. Meta descriptions + heading
Added descriptions to the 5 pages missing them (`command-center`, `escaneo-de-fugas-scorecard`, `pilot-agreement`, `supplier-cards`, `trust-and-proof`) in each page's own language. Added an `sr-only` `<h1>` to `merchant-evidence.html`, which had five `<h2>`s and no `<h1>` — invisible visually, correct for screen readers and crawlers.

### 9. Duplicates — you got there first
`website/archive/` and `website/_to_delete/` were gone by the time I reached this item; you'd already deleted them. Neither was tracked in git. I removed the temporary `robots.txt` Disallow rules I'd added for them, since they no longer point at anything.

---

## Verified after the fact

CSS rebuilt offline with the local Tailwind binary (`68,558 bytes`), then three representative pages served and rendered in headless Chromium at 1280px and 390px:

| Check | Result |
|---|---|
| Tailwind CDN references site-wide | **0** |
| Pages missing viewport / description / `<h1>` | **0 / 0 / 0** |
| `limpieza.html` → `/contratistas/*` links | **0** (was 8) |
| Stylesheets loading, computed styles correct | ✅ 4–5 sheets/page, `text-slate-600` → `rgb(71,85,105)` |
| Migrated subfolder page, desktop + mobile | ✅ renders correctly, responsive |
| `clinicas.html` nav targets | ✅ 4 real sub-pages |
| `limpieza.html` nav targets | ✅ `#calculator`, `#enrollment` |
| `npm run check:links` | 2 errors, 0 warnings — both pre-existing (below) |

---

## ⚠️ Two things I found but did not change

### `$1zsh.00` — corrupted price on your main sales page

Every dollar figure on `contratistas.html` renders as **`$1zsh.00`** instead of `$1,200.00`. **Nine occurrences**, including the primary CTA button:

> **"Abonar Depósito Seguro ($1zsh.00)"**

Seven more on `limpieza.html`. This is in git HEAD — pre-existing, not something I introduced (my diff to `limpieza.html` is nav links plus one stylesheet line, nothing else). It looks like a find-and-replace or an unquoted shell heredoc that ate the `,200`.

**Why I left it:** the correct fix depends on the pricing decision that's still open. If the $1,200 deposit stays, these become `$1,200.00`. If it goes, they get deleted entirely — and correcting them now would just be work you throw away. Say which and it's a two-minute change.

Worth sitting with, though: a contractor you sent from WhatsApp has been looking at a button that says `$1zsh.00`.

### `/privacy` and `/terms` don't exist

`trust-and-proof.html` links to both; neither page exists. (The unused `partials/footer.html` links to them too.) These are the 2 errors the link checker reports.

**I deliberately didn't "fix" this by deleting the links.** Your site collects emails and runs an enrollment form through `api/leads.js` — removing the privacy link would make a real compliance gap look tidy. The fix is to write the pages, which needs your input, not mine.

---

## Housekeeping

A `git status` I ran through the device bridge left a stale `.git/index.lock`. The bridge can't delete files, so I moved it to `_stale/git-index.lock` — **git works normally again**, but you can delete that `_stale/` folder whenever.

Nothing was committed or deployed. Review with `git diff`, then commit when you're happy.

```
npm run check:links     # link integrity gate
npm run build:css       # rebuild output.css after HTML edits
```

---

## Still open — needs your call

| # | Item | Blocking |
|---|---|---|
| 1 | **$1,200 deposit + 10% vs. $0 upfront + 6/4/2.5%** — landing page, contract, and WhatsApp scripts disagree | The `$1zsh.00` fix, and arguably your reply rate |
| 2 | **"$2.4M+ Depósitos Verificados," "<90s," "12 detectados en 48h"** — substantiate or remove | Credibility, on the page prospects land on |
| 3 | **Homepage weighting** — contractors gets the same prominence as four dormant verticals | Positioning |
| 4 | **Annual cap: $40k (contract) / $25k (clínicas) / $20k (homepage, restaurantes) / $15k (floristas)** — plus "Garantizamos por contrato" on a page with no contract | Consistency |
