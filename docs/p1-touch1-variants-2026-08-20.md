# P1 — Touch 1 Rewrites: 3 Variants + Contractor Psychology Analysis

*Generated 2026-08-20 · Source of current script: `workflows/whatsapp-pitch-sequence.json` → `step_4_dispatch_touch_1`*

---

## Before you test: two corrections to the brief

**1. There is no 60-day guarantee.** I searched the repo. What exists is a 60-day **attribution clause** (`website/contratistas.html`): a lead registered through the proxy line and closed within 60 days is credited to Socio. That is a rule that protects *Socio's* commission — it is not a promise to the contractor. Writing it into Touch 1 as a "guarantee" would be an unsupported claim, and a contractor who reads it closely will hear "here's how I get paid," not "here's how you're protected."

The actual risk reversal you own is stronger and fully supported: **$0 unless a deposit clears in the contractor's own bank account.** That is in the pilot agreement as "La Regla de Oro." All three variants below lead on that instead.

**2. "Quantified dollar loss" is a trap here.** Opening with an invented number ("you're losing $47,000 a year") is the exact failure mode your other company audits for. A contractor who has been pitched twice this month will price-check the number in his head and conclude you made it up — and he'll be right. All three variants quantify from something **he** can verify: his own dead-estimate notebook, his own filed permit, his own missed calls. The number comes out of his mouth, not yours.

---

## Why the current script under-performs (and what's carrying it)

**Current Touch 1:**
> Hola {{ownerName}}, le saluda Nick de Socio en NYC. Vimos los proyectos que {{companyName}} hace en {{borough}}. Preparamos un *Escaneo de Fugas* de 1 página que muestra llamadas y contratos que están yendo a competidores locales en su zona. Es 100% gratuito y no cobramos nada por adelantado. ¿Le gustaría que se lo comparta por aquí en PDF?

### What's working

- **`Le saluda` + `Don`/usted register.** Correct formality for a 40-something maestro. Most marketers get this wrong by defaulting to `tú`.
- **The free asset is a low-commitment ask.** "Can I send you a PDF" is a much smaller yes than "can we get on a call."
- **`No cobramos nada por adelantado` appears in message one.** Cash-flow paranoia is the dominant emotion in this audience; addressing it before the ask is right.

### What's costing you replies

**1. "Escaneo de Fugas" is your vocabulary, not his.** He has never heard of a leak scan. A branded product name in the first message signals *agency* — the exact category he's screened out. It reads as jargon he has to decode before he can decide, and the default decision when decoding costs effort is no reply.

**2. `Vimos los proyectos que {{companyName}} hace` is unfalsifiable flattery.** It's what every scraper-driven blast says. He can't tell it from a bot because *it is what a bot says*. There's no proof you looked. Compare: "Vi el permiso A2 que se registró en la 45 con Quinta" — that is checkable, and checkable is what buys the second sentence.

**3. The offer is a report, and a report is homework.** Free things that require reading are not free — they cost attention. He's on a jobsite. A PDF that shows him "calls going to competitors" also implies he's been doing it wrong, which triggers defensiveness in a trade where competence *is* reputation.

**4. Nothing establishes you're not the fifth guy this week.** The anti-agency reflex is not skepticism about value, it's pattern-matching on format. Your message currently matches the pattern: greeting → we noticed you → free thing → question mark.

**5. The close asks for permission to send, not for information.** `¿Le gustaría que se lo comparta?` can be ignored at zero social cost. A question about *his* business is harder to leave on read.

### The three psychological levers that actually move this audience

| Lever | Why it works | How it shows up below |
|---|---|---|
| **Cash-flow paranoia** | Materials get bought before deposits land. Every fixed cost is a threat. | "$0 hasta que el cliente deposite" stated as a rule, not a promise |
| **Anti-agency reflex** | He's been burned by SEO/Yelp/Angi retainers. "Marketing" is a category, and the category is a scam. | No brand name in sentence one. No product noun. Fellow-tradesman register. |
| **Referral-native trust** | Work comes from primos, supply-house counter guys, and the last customer. Cold anything is suspect by default. | Name the specific thing you saw; talk about *his* leftover estimates, which only someone who understands the trade would think to ask about |

**One more:** the 33% figure is 4 replies out of 12 sends. The 95% confidence interval on that (Wilson) is **14%–61%**. It is not yet distinguishable from your 15% target in either direction. Treat 33% as "not broken," not as a baseline to beat — and don't kill a variant that comes back 2/10 on the first batch. You need ~40–50 sends per variant before the comparison means anything.

---

## Variant A — "La Libreta" *(the dead-estimate notebook)*

**Angle:** pattern interrupt via a question no marketer would know to ask. Loss is quantified by him, in his own notebook, in the first three seconds.

> Don {{ownerName}}, una pregunta de contratista a contratista: ¿cuántos presupuestos dio este año que nunca cerraron? Casi todos los maestros tienen veinte o treinta muertos en la libreta.
>
> Nosotros los volvemos a tocar por WhatsApp, en español, sin que usted mueva un dedo. Usted no paga nada hasta que un cliente le deposite el anticipo en su banco. Si nadie deposita, cuesta $0.
>
> ¿Cuántos tiene usted en la libreta?

**Why it works:** The opening question is the pattern interrupt — nobody selling marketing asks about your notebook, because nobody selling marketing knows the notebook exists. It also does the quantification for free: he mentally counts, and the number is his, so he believes it. The close asks for a number rather than permission, which is a much stickier open loop. And it sets up your actual highest-leverage asset (the reactivation sequence in P3) as the first thing he buys.

**Risk:** if he has no notebook — younger, more systematized operator — the opener misses. Use variant B for anyone whose Google presence looks professionally managed.

---

## Variant B — "El Permiso" *(proof-of-homework via DOB filing)*

**Angle:** verifiable specificity. This is the one that cannot be mistaken for a blast, because a blast can't cite a permit.

> {{ownerName}}, vi que se registró un permiso de alteración en {{house_number}} {{street_name}} — obra de más o menos ${{estimated_cost}} — y todavía no aparece contratista asignado.
>
> Nosotros conectamos ese tipo de dueño directamente con maestros de la zona por WhatsApp. Cero costo fijo: solo cobramos si el cliente le deposita el anticipo a usted.
>
> ¿Esas obras le llegan a usted, o se las están llevando otros?

**Why it works:** The first sentence is checkable in ten seconds on his phone, which converts you from "marketer" to "someone who reads the permit feed" — a category he respects, because it's how the smart guys in his trade find work. The final question is the pain, but he supplies the answer, so it doesn't feel like an accusation. Note it names no product and no brand until he replies.

**Requires:** live DOB permit data per prospect. Your `72h-pilot-acquisition-sprint.md` already has the SoQL query, but it's scoped to Queens and the Bronx — **you'll need to change the borough filter to `BROOKLYN` for the Sunset Park / Park Slope batch.**

**Risk:** if the permit is stale or the contractor field was filled after you pulled it, you look sloppy. Verify the "no GC assigned" condition the morning you send.

---

## Variant C — "El Que Contesta" *(the missed-call angle)*

**Angle:** the pain that every contractor already knows he has and nobody has ever offered to fix. Fellow-tradesman voice, zero marketing vocabulary.

> Don {{ownerName}}, usted sabe cómo es: uno está arriba del andamio y el teléfono suena. Para cuando baja y devuelve la llamada, el cliente ya contrató a otro.
>
> Le contestamos en español en menos de cinco minutos, agendamos la visita, y le pasamos el trabajo listo al WhatsApp. Si el cliente no deposita, usted no paga nada.
>
> ¿Cuántas llamadas se le pierden en una semana normal?

**Why it works:** The opening is a scene, not a claim — he sees himself in it, and there is nothing to be skeptical *of* yet. It also reframes the whole offer from "we do marketing" to "we answer your phone," which is a job title he understands and does not associate with the agencies that burned him. The close again asks for his number.

**Risk:** it promises a five-minute response window. Don't send this variant until you can actually staff it. Breaking this promise in week one kills the pilot faster than a slow start.

---

## Word counts

| Variant | Words | Under 80? |
|---|---|---|
| A — La Libreta | 69 | ✅ |
| B — El Permiso | 64 | ✅ |
| C — El Que Contesta | 66 | ✅ |
| *(current script, for reference)* | 58 | — |

---

## How to test this without fooling yourself

1. **Do not run all three at once on 10 sends.** With batches that small you'll get noise and pick a winner by coin flip.
2. **Run A vs. current, 25 sends each, over the next two weeks.** A is the biggest swing and needs no new data pipeline.
3. **Log the reply, not the vibe.** Reply / no reply / negative reply. A "no gracias" is a reply and should be counted as one — it tells you the message got read, which is different from being ignored.
4. **Hold B until the Brooklyn permit pull is running.** Its whole advantage is the specificity; without live data it degrades into variant A with worse copy.
5. **Only after ~50 sends per arm** should you compare rates. Before that you are reading tea leaves.

One thing worth deciding up front: the governor in your workflow rate-limits to 1 message per phone per day and gates Touch 1 behind manual approval. Keep both. The moment this stops being hand-approved is the moment the reply rate you're measuring stops being real.
