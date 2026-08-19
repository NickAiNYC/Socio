# Merchant Quote Approval — Landing Page Testimonials

**Status:** DRAFT — pending merchant sign-off
**Owner:** Nick sends; Hermes prepared
**Rule:** No deploy of `website/index.html` with `<!-- DRAFT QUOTE -->` quotes until each merchant replies "approved" (or edits are agreed).
**Context:** quotes live in the testimonial carousel (`#testimonials`) next to POS-verified numbers from the existing Proof section.

---

## How to send

- One message per merchant (they know each other's neighborhoods — don't CC anyone).
- Send via the channel they actually use (WhatsApp/phone preferred for the Heights/Bronx; email as fallback).
- Reply they need: **"OK"** or **an edit**. That's it. A written reply (text/WhatsApp/email) is the sign-off record.
- If they decline or don't answer in 7 days: drop the quote from the carousel and run with 2 slides, or use the pilot label (bottom of this file).

---

## 1. Cristal Flowers — Florist · East Harlem

### EN
> Hi [Name] — quick one from Socio. We're updating our site to show partner results, and we'd love to feature Cristal Flowers with your feedback. The line we'd publish is:
>
> "We didn't pay a cent until new customers started walking in. They fixed our Google listing, and suddenly brides were finding us by search."
>
> Next to it we'd show: **+$8,200 net new revenue · 47 new customers · +23 reviews** — the same numbers from your monthly reports.
>
> Can we use that? Reply OK, or tell me what you'd change. No pressure either way.

### ES
> Hola [Nombre] — un mensaje rápido de Socio. Estamos actualizando nuestra página para mostrar resultados de socios y nos encantaría incluir a Cristal Flowers con tu opinión. La frase que publicaríamos es:
>
> "No pagamos ni un centavo hasta que empezaron a entrar clientes nuevos. Arreglaron nuestro listado de Google y de repente las novias nos encontraban por búsqueda."
>
> Junto a eso mostraríamos: **+$8,200 en ingresos nuevos · 47 clientes nuevos · +23 reseñas** — los mismos números de tus reportes mensuales.
>
> ¿Podemos usarla? Responde OK o dime qué cambiarías. Sin presión.

---

## 2. El Nuevo Cafe — Café · Washington Heights

### EN
> Hi [Name] — from Socio. We're adding partner feedback to our website and want to feature El Nuevo Cafe. The line we'd publish:
>
> "Our Yelp went from 3.8 to 4.4 and the breakfast rush got real. They show us the receipts — we only pay on what they actually bring in."
>
> Shown alongside: **+$6,400 net new revenue · Yelp 3.8 → 4.4 ★ · 62% of new walk-ins from Reels** — straight from your reports.
>
> Good to use? Reply OK or tell me what to change. No pressure.

### ES
> Hola [Nombre] — de parte de Socio. Estamos agregando opiniones de socios a nuestra página y queremos destacar a El Nuevo Cafe. La frase que publicaríamos:
>
> "Nuestro Yelp subió de 3.8 a 4.4 y el turno del desayuno se puso real. Nos muestran los recibos — solo pagamos por lo que de verdad traen."
>
> Junto a eso: **+$6,400 en ingresos nuevos · Yelp 3.8 → 4.4 ★ · 62% de clientes nuevos por Reels** — directo de tus reportes.
>
> ¿La podemos usar? Responde OK o dime qué cambiar. Sin presión.

---

## 3. La Bodega NYC — Bodega · South Bronx

### EN
> Hi [Name] — from Socio. We're putting partner feedback on our site and want to feature La Bodega NYC. The line we'd publish:
>
> "People in the neighborhood started finding us on Maps. Late-night orders jumped — and every number was checked against our register."
>
> Shown alongside: **+$4,100 net new revenue · 31 new customers · +34% late-night orders (11pm–2am)** — from your reports.
>
> Good to use? Reply OK or tell me what to change. No pressure.

### ES
> Hola [Nombre] — de parte de Socio. Estamos poniendo opiniones de socios en nuestra página y queremos destacar a La Bodega NYC. La frase que publicaríamos:
>
> "La gente del vecindario empezó a encontrarnos en Maps. Los pedidos de noche subieron — y cada número fue verificado contra nuestra caja registradora."
>
> Junto a eso: **+$4,100 en ingresos nuevos · 31 clientes nuevos · +34% pedidos de noche (11pm–2am)** — de tus reportes.
>
> ¿La podemos usar? Responde OK o dime qué cambiar. Sin presión.

---

## After sign-off (deploy checklist)

1. Replace the three quote strings in `website/index.html` (`#testimonials`) with the approved wording — **EN only** on the live page (or EN+ES if a merchant approves a bilingual version; default is EN).
2. Delete the three `<!-- DRAFT QUOTE -->` comments.
3. If a merchant declines: remove that slide; if 2+ decline, use the pilot label below instead.
4. Re-verify: HTML tag balance, `node --check` on the inline script (or the saved `/tmp/socio-check.js` extraction), headless Chrome DOM dump, no console errors.
5. Deploy from repo root: `vercel --prod` (engines node 22.x required).

## Fallback (deploy sooner, honest label)

If you decide to ship before full sign-off, add this line under the carousel dots and change the `Merchant Evidence` eyebrow to `Pilot Partner Feedback`:

> *Quotes from pilot merchants. Full case studies available upon request.*

That label is a disclosure, not a cure — it still attributes words to merchants who haven't approved them. Only use it if the trade-off is deliberate.
