# Socio Website Audit — `socio/website/`

*2026-08-20 · Read-only pass. Nothing was modified.*

**Scope:** 36 live HTML pages (plus 9 in `archive/` and 6 in `_to_delete/`), 3 stylesheets, 4.6 MB of assets.

---

## The one thing to fix before anything else

### 🔴 Your landing page and your contract describe two different businesses.

**`contratistas.html`** — the page you link from WhatsApp Touch 3 and from the supply-house pitch — sells:

> "Depósito técnico **$1,200** (100% acreditable a comisiones del **10%**)"
> Button: **"Abonar Depósito Seguro ($1,200)"**
> Header badge: "ALIANZA DE CRECIMIENTO · DEPÓSITO $1,200 ACREDITABLE"

**`pilot-agreement.html`** — the page he signs — says:

> "**1. La Regla de Oro ($0.00 por Adelantado)** — El Contratista **NUNCA** pagará tarifas fijas, costos de instalación, ni tarifas por cotizaciones no cerradas."
> Tiered commission: 6.0% / 4.0% / 2.5%

**And your WhatsApp Touch 1 says:** "no cobramos nada por adelantado."

Three artifacts, two incompatible pricing models. The message says free, the landing page asks for $1,200, the contract says never.

**Why this is the top of the list:** your entire pitch is engineered around one objection — *cash-flow paranoia, "me estafaron con una mensualidad."* You send a contractor a WhatsApp promising $0 upfront, he taps `socio.nyc/contratistas`, and the first thing above the fold asks him for **$1,200**. You lose him on the page you sent him to, and he never tells you why. This may be a meaningful share of your 8 non-replies.

**It also isn't survivable at the coffee meeting.** If he read the page and you hand him a one-page agreement saying $0 forever, one of you is going to look like they moved the goalposts.

`limpieza.html` carries the identical $1,200 + 10% construct.

**Decide which model is real, then make all four artifacts say it.** I'd need you to tell me which — that's a business decision, not a cleanup task.

---

### 🔴 Unverifiable social proof on the two pages a contractor actually sees

`contratistas.html` and `limpieza.html` both display:

- **"$2.4M+ Depósitos Verificados"**
- **"<90s"** response time
- **"12 detectados en 48h (Queens / Brooklyn)"**

Per your own tracking you're working toward your **first** pilot. If $2.4M in verified deposits isn't in a ledger you can produce, this is fabricated proof on your primary sales page — and it's the exact failure mode AuditGPT exists to catch, sitting on your own site.

The practical risk isn't regulatory, it's local: Sunset Park contractors talk to each other. One guy who asks "¿cuáles $2.4 millones?" at a supply-house counter and gets a vague answer costs you the referral network you're trying to enter.

**Also inconsistent:** the annual commission cap is **$40,000** in the pilot agreement, **$25,000** on `clinicas/como-funciona.html`, and **$15,000** on `floristas/preguntas-frecuentes.html` — the last one framed as "**Garantizamos por contrato**." Per-vertical caps may be intentional, but nothing on the site reconciles them, and "garantizamos por contrato" is a contractual promise made on a page with no contract behind it.

---

## 1. Visual layout & the design system

**There is a design-system migration in flight and it is roughly 40% done.** Three styling regimes are live simultaneously:

| Regime | Pages | Status |
|---|---|---|
| `output.css` only | Most root pages (index, contratistas, clinicas, limpieza, command-center, supplier-cards…) | Migrated |
| `output.css` + `design-tokens.css` | **Only 2**: `pilot-agreement.html`, `escaneo-de-fugas-scorecard.html` | Fully migrated |
| **`cdn.tailwindcss.com`** | **All 18 subfolder pages** — every `contratistas/*`, `clinicas/*`, `floristas/*`, `restaurantes/*`, `proveedores/*` | Not migrated |

Your own `design-tokens.css` header documents this honestly ("most pages currently bypass in favor of generic Tailwind palette utilities"). The audit that produced it was correct; the rollout stopped early.

**Three consequences:**

1. **The Tailwind CDN should not be in production.** It compiles CSS in the browser on every page load, causes a flash of unstyled content, prints a console warning, and makes your site depend on a third-party CDN. Every subfolder page — including all four `contratistas/*` pages a real prospect clicks through — is running it.

2. **The good news: this is a cheap fix.** `tailwind.config.js` globs `./website/**/*.{html,js}`, so `output.css` **already contains the classes those subfolder pages use.** Swapping the CDN script tag for the two stylesheet links should be close to a find-and-replace, not a re-theme. Needs visual verification page by page, but the risk is low.

3. **Only 2 of 36 pages load the design tokens**, so the token file isn't yet doing its job. The audit found "3 competing error reds and 2 competing success greens in production" — those are still live everywhere except those two pages.

**Also on layout:**

- **`contratistas/radar-de-permisos/brooklyn.html` and `queens.html` have no `<meta name="viewport">`.** They will render desktop-width and zoomed-out on a phone. Your entire channel is WhatsApp — that is, 100% mobile. These two pages are effectively broken for every visitor.
- **`merchant-evidence.html` has no `<h1>`** — the only live page missing one.
- 5 pages have no meta description: `command-center`, `escaneo-de-fugas-scorecard`, `pilot-agreement`, `supplier-cards`, `trust-and-proof`.

**What I'd say about the React rebuild:** don't. The problem here isn't the framework — it's that a migration already underway was left half-finished, and there's no shared header/footer. Converting 36 static pages to a React SPA would change every URL (including the ones printed on the cards you're taking to Kamco), and would not fix a single issue in this document. Finishing the CSS migration and extracting a real shared nav gets you 90% of the benefit for 10% of the risk.

---

## 2. Site structure & navigation

### The partials system is built but not connected

`partials/header.html` (397 bytes), `partials/footer.html` (1,119 bytes), and `assets/partials-loader.js` all exist. **Zero live pages load the loader.** Every one of the 36 pages carries its own hardcoded nav.

That's why the next finding exists:

### `limpieza.html` has the contractor nav pasted into it

The cleaning-vertical page's navigation links to:

- `/contratistas/como-funciona`
- `/contratistas/casos-de-exito`
- `/contratistas/radar-de-permisos` — labeled **"Radar DOB"**
- `/contratistas/preguntas-frecuentes`

A cleaning company clicking "Cómo Funciona" lands on a contractor page about DOB construction permits. The whole page appears to be a copy of `contratistas.html` with the hero swapped — it also carries the $1,200 deposit, the $2.4M claim, and the 60-day attribution language verbatim.

### Orphaned pages — in the sitemap, unreachable by clicking

| Page | Inbound links | In sitemap? |
|---|---|---|
| `limpieza.html` | **0** | ✅ yes |
| `command-center.html` | **0** | ✅ yes |
| `trust-and-proof.html` | **0** | ✅ yes |
| `global-brands.html` | **0** | ✅ yes |
| `escaneo-de-fugas-scorecard.html` | **0** | ✅ yes |
| `contratistas/radar-de-permisos/brooklyn.html` | **0** | ❌ no |
| `contratistas/radar-de-permisos/queens.html` | **0** | ❌ no |
| `proveedores/*` (3 pages) | 3 each (each other only) | ✅ yes |

**`command-center.html` deserves a flag of its own.** It's your internal ops dashboard — 71 KB, no meta description, titled "Revenue Recovery & AI Agent…" — and it is **listed in your public sitemap**, i.e. actively submitted to Google for indexing. Your `design-tokens.css` even marks the neon accent as "internal ops-dashboard accent ONLY. Do not use on public marketing/sales pages." Decide whether it's public. If it isn't, it needs to leave the sitemap and get a `noindex`.

### Sitemap defects

- **Duplicate entry:** both `/merchant-evidence` and `/merchant-evidence.html` are listed — a self-inflicted duplicate-content signal. `index.html` links to the `.html` form while every other page uses extensionless URLs.
- **Missing:** the two radar sub-pages.
- **Includes sales collateral as indexable marketing:** `supplier-cards`, `escaneo-de-fugas-scorecard`, `pilot-agreement`, `trust-and-proof`. The pilot agreement in particular is a document you hand to a specific prospect — publicly indexed, it means any contractor can see the "founding cohort, 5 slots only" framing at any time, which quietly removes the scarcity you're using in the pitch.

### Dead weight: 15 near-duplicate files

`archive/` holds 9 copies and `_to_delete/` holds 6 `.bak` copies of live pages. **The only difference in most is the Tailwind CDN line** — they're pre-migration snapshots, not different content. `archive/global-brands.html` is byte-identical to the live file.

This is ~470 KB of near-duplicates that will (a) confuse you about which file is canonical when you edit, and (b) get deployed and potentially crawled unless something excludes them. `robots.txt` is only 122 bytes — worth checking it covers these.

*(Note: `device_bash` can't delete. If you want these gone I'd move them to a single `_to_delete/` and you'd remove the folder yourself.)*

---

## 3. Market positioning & messaging

Beyond the pricing contradiction and the $2.4M claim above:

**The "60 días" language is doing the wrong job.** It appears 6 times on `contratistas.html` as *"Atribución inviolable de 60 días"* and *"Cláusula de Atribución 60 días."* As I flagged in the P6 stress test: this rule protects **Socio's commission**, and it lives only in marketing copy — it is **not in the agreement**. A contractor reading carefully sees a page that explains, three separate times, how you make sure you get paid. That's a strange thing to emphasize on a page whose job is to make him feel safe.

Meanwhile the clause that would actually protect *him* — "if there's no proxy-line log, we don't charge" — appears nowhere on the site, because it doesn't exist yet.

**"Inviolable" is a strong word** for a mechanism with no contractual backing. It's the kind of adjective that reads as confidence to you and as overreach to a skeptical buyer.

**`certificados` claim:** `contratistas/radar-de-permisos.html` is the live page using "certificad-" language. Same issue I raised in P6 — that's a verification you aren't systematically performing.

**What's working, and worth protecting:** the "no somos agencia / socio" framing is consistent and strong; the Spanish register is right; every page has exactly one `<h1>` and OG tags (31 of 36 have descriptions). Structurally this site is in better shape than most at this stage. The problems are contradictions, not craft.

---

## 4. Vertical prioritization

**Contractors is your only active motion. The site gives it no more weight than four dormant bets.**

Inbound internal links, live pages:

| Vertical | Hub inbound | Sub-pages | Status per your own docs |
|---|---|---|---|
| **contratistas** | 12 | 4 (+2 orphaned) | **Active** — all outreach, both coffee meetings |
| clinicas | **12** | 4 | Dormant |
| restaurantes | **12** | 4 | Dormant |
| floristas | 7 | 4 | Dormant |
| limpieza | **0** | 0 | Dormant, orphaned, broken nav |
| proveedores | 3 | 3 (self-linked only) | Supports the Kamco/Feldman motion |

Clinics and restaurants receive **exactly as much internal link equity as contractors** — the vertical you're actually selling. `index.html` links out to clinicas, contratistas, floristas, restaurantes, and both `casos-de-exito` pages with apparently equal prominence.

**Two costs.** For a visitor: the homepage says "we do five things" rather than "we get Brooklyn contractors more remodeling contracts," which is a weaker and less credible claim from a company with no customers yet. For search: five thin verticals split your authority five ways.

**`proveedores/*` is the interesting orphan.** Three supplier-alliance pages exist, are linked only to each other, and are reachable from nowhere. You're walking into Kamco and Feldman with a supplier pitch — there's already a supplier page built that you can't send them to. Fixing that is a ten-minute job with immediate use.

---

## Recommended sequence

**Before your next outreach batch or coffee meeting:**

1. **Resolve $1,200-deposit vs. $0-upfront.** Business decision, blocks everything else. Then align all four surfaces: `contratistas.html`, `limpieza.html`, `pilot-agreement.html`, WhatsApp scripts.
2. **Remove or substantiate "$2.4M+ Depósitos Verificados," "<90s," "12 detectados en 48h."** If there's a ledger, cite it. If not, replace with something true — "cohorte fundadora, 5 cupos" is honest and does similar work.
3. **Add viewport meta to the two radar sub-pages.** Two lines. They're mobile-broken today.
4. **Link `proveedores/*` from somewhere** before the supply-house visits.

**This week:**

5. Finish the CSS migration — swap the Tailwind CDN for `output.css` + `design-tokens.css` on all 18 subfolder pages. Low risk; the classes are already compiled in.
6. Wire up the partials loader (or inline one canonical nav) so `limpieza.html`-style nav bugs can't recur.
7. Fix `limpieza.html`'s contractor nav, or retire the page — it's orphaned anyway.
8. Sitemap: drop the duplicate `merchant-evidence.html`, add the radar sub-pages, decide on `command-center` and `pilot-agreement`.

**When convenient:**

9. Clear out `archive/` and `_to_delete/` (15 files, ~470 KB of near-duplicates).
10. Rebalance the homepage toward contractors; demote the dormant verticals to a secondary "otras industrias" position rather than deleting them.
11. Meta descriptions on the 5 pages missing them; `<h1>` on `merchant-evidence.html`.
12. Reconcile the $15k / $25k / $40k caps, and soften "Garantizamos por contrato" on `floristas/preguntas-frecuentes.html`.

---

## What I'd suggest we do next

Items **3, 4, 5, 6, 7, 8, 9, 11** are mechanical — no judgment calls, and I can do them in one pass with a diff for you to review before anything is written.

Items **1, 2, 10, 12** need your decision first, because they're about what Socio actually charges and what it can actually prove.

Say the word and I'll start with the mechanical set.
