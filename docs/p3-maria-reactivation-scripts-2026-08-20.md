# P3 — "María" Dead-Lead Reactivation Scripts

*Generated 2026-08-20 · Three WhatsApp templates for reactivating a contractor's dormant estimates.*

---

## Read this first — two things that will bite you

**1. Don't project the revenue.** The brief assumed "2 of 10 convert = $60K found." Nobody knows that yet — you have zero reactivation campaigns run. If you say that number to a contractor and land 0 for 10, you've burned your first pilot on a claim you invented. Say what's true instead: *"No sé cuántos van a contestar. Vamos a medirlo con los suyos y usted ve el resultado."* Uncertainty offered up front reads as confidence, not weakness — and it's the same evidence discipline your other company sells.

**2. Decide what María is, and be consistent.** These leads are the contractor's own prior estimates, so there's a real prior relationship — that's the right footing for outreach. But if María is a bot, she cannot claim to be a person. If a lead replies "¿eres una persona?" the answer is the truth, and the sequence should hand to a human fast. The clean setup: **María is the contractor's reception function, staffed by Socio, and every message goes out from the contractor's number with his knowledge.** That's honest, it's what the customer would expect, and it survives being asked about. Build the handoff rule before you send message one.

Also: get the contractor's explicit written OK on the exact templates before sending. They go out in his name and his reputation is the collateral.

---

## Template 1 — "Encontramos su presupuesto" *(re-engagement)*

Use for leads **6–12 months old**. The oldest and coldest.

> Buenas tardes, {{firstName}}. Le habla María, de {{companyName}}.
>
> Estaba organizando los presupuestos del año y encontré el suyo, del trabajo de {{projectType}}. Nunca le dimos seguimiento y la verdad me quedé con la duda.
>
> ¿Ya lo resolvió con alguien, o todavía anda pendiente?

**Words: 43** ✅

**Why it works:** The reason for contact is mundane and true — she was organizing files. That's a much lower-threat opening than any pitch. "Me quedé con la duda" is a small, human admission that a bot wouldn't produce. And the question is genuinely easy to answer either way, which is what gets a reply out of someone who has no intention of buying — and that reply is where the real conversation starts.

**Merge fields:** `{{firstName}}`, `{{companyName}}`, `{{projectType}}` (cocina / baño / fachada / techo — pull from the notebook photo).

---

## Template 2 — "Seguimiento" *(gentle nudge)*

Use for leads **2–6 months old**, or as follow-up 4 days after Template 1 with no reply.

> {{firstName}}, buenos días. María otra vez, de {{companyName}}.
>
> No quiero molestarlo. Solo que en esta temporada se nos llenan las semanas rápido, y si todavía piensa hacer lo de {{projectType}}, prefiero avisarle ahora y no en octubre.
>
> ¿Le sigue interesando? Un sí o un no me sirve igual.

**Words: 48** ✅

**Why it works:** "Un sí o un no me sirve igual" removes the cost of saying no, which is the actual reason dormant leads go silent — they feel bad, so they ghost. Giving explicit permission to decline reliably pulls replies out of people who would otherwise never answer, and a clean no is worth more to you than a maybe. The seasonality note is a real constraint, not manufactured urgency.

---

## Template 3 — "Último cupo" *(scarcity close)*

Use **only when it is true.** If he has open capacity, do not send this one.

> {{firstName}}, María de {{companyName}}.
>
> Le escribo rápido: nos queda un espacio en el calendario de {{month}} y después ya entramos a {{nextMonth}}. Si quiere que le apartemos ese, dígame hoy y se lo guardo.
>
> Si no, sin pena — le escribo cuando se abra otro.

**Words: 44** ✅

**Why it works:** The scarcity is specific (one slot, a named month) rather than generic ("limited availability"), and the exit line — "si no, sin pena" — is what keeps it from reading as pressure. Warm scarcity converts; desperate scarcity gets blocked.

⚠️ **Fabricated scarcity is the fastest way to burn a contractor's name in a neighborhood where everyone knows everyone.** If the calendar isn't tight, use Template 2 again with a different project detail.

---

## Sequence timing

| Day | Message | Skip if |
|---|---|---|
| 0 | Template 1 | — |
| 4 | Template 2 | Replied |
| 11 | Template 3 | Replied, or calendar isn't actually tight |
| — | **Stop.** | Always stop at 3. |

**Rules:**

- One message per person per day, maximum — you already enforce this in `whatsapp-pitch-sequence.json`, keep it.
- Respect quiet hours (send 8am–7pm ET; your governor already gates this).
- Any reply → **stop the automation and hand to a human immediately.** These are warm contacts with a real prior relationship; an automated reply to a human reply is how you turn a warm lead cold.
- Stop permanently on any negative signal — "no", "no me escriba", "ya no", or silence after three.

---

## What to measure

Track these four, per batch of 10:

1. **Delivered** (WhatsApp shows two ticks)
2. **Replied** (any reply, including no)
3. **Re-quoted** (contractor gave a new or refreshed estimate)
4. **Deposit cleared** (the only one that triggers commission)

Report all four to the contractor, including the zeros. If the first batch of 30 produces two re-quotes and one deposit, that is a **real result with an evidence chain** — and a case study you can actually defend — in a way that "reactivation typically converts 20%" never will be.

---

## Suggested first batch

His notebook has ~30 dead estimates. **Don't send all 30.**

Send **10** — the most recent ten, since recency beats everything in reactivation. Watch what happens for a week. Adjust the templates based on what the actual replies look like. Then send the next 20.

If the first ten produce nothing, you want to have learned that on ten names, not thirty.
