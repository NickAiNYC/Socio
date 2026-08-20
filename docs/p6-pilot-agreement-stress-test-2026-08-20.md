# P6 — Pilot Agreement Stress Test

*Generated 2026-08-20 · Source: `website/pilot-agreement.html`*

> **Not legal advice.** I'm not a lawyer and this isn't a legal opinion. This is a commercial read of what the document says, what it doesn't say, and where the disputes are going to come from. Before you sign this with a fifth contractor, have a New York attorney look at it — a $500 hour now is cheaper than one commission fight.

---

## What the agreement currently contains

Four clauses, one page, Spanish:

1. **La Regla de Oro** — $0 upfront, no fixed fees, no charges for unclosed estimates. Commission triggers **only** when the client deposits the project advance into the contractor's QuickBooks-verified business bank account.
2. **Pilot commission structure (50% off)** — Tier 1 (<$10k): 6% (vs 12%). Tier 2 ($10k–$50k): 4% (vs 8%). Tier 3 (>$50k): 2.5% (vs 5%).
3. **Annual cap** — once commissions paid reach $40,000 in a calendar year, the rate drops to 0.0% and the client moves to an optional flat rate.
4. **Dead-lead reactivation** — contractor agrees to share photos of their notebook/list of unclosed estimates from the last 12 months; Socio deploys the WhatsApp reactivation sequence at no extra cost.

Plus signature blocks for both parties.

**The honest headline:** the commercial terms are genuinely good and genuinely contractor-friendly. The $0-until-deposit structure is a real differentiator and the cap is a thoughtful touch most people wouldn't bother with. **The problem is not what it says — it's the five things it doesn't say.** As written, this is a term sheet, not an agreement.

---

## The three biggest risks

### 🔴 Risk 1 — Attribution is undefined in the contract. This will cause your first fight.

**The problem:** Clause 1 says commission is owed when "el cliente deposita el anticipo." It never defines **which** clients. Nothing in the document says a client must have originated through Socio.

Read literally, Socio is owed commission on **every deposit the contractor receives**, including his cousin's kitchen and the landlord he's worked for since 2019. That's obviously not the intent — but a contract that says something you don't mean is a contract that gets read against you when there's money on the table.

Meanwhile, the **60-day attribution rule** — the thing that actually resolves this — lives on `website/contratistas.html` as marketing copy, **not in the agreement.** Marketing copy is not a contract term.

**The failure scenario, and it's not hypothetical:** Month two. Contractor closes an $80,000 job. You invoice 2.5% = $2,000. He says "ese cliente ya era mío, me llamó él directo." You point at the proxy line log. He points at the agreement, which says nothing about proxy lines. Now you're in an argument you cannot win on paper, with your first reference customer, over $2,000.

**The fix — add a clause 5, in plain Spanish:**

> **5. Clientes Atribuibles**
>
> Socio cobra comisión **únicamente** sobre clientes cuyo primer contacto con el Contratista ocurrió a través de la línea telefónica o WhatsApp registrada de Socio, con fecha y hora registrada.
>
> Un cliente queda atribuido a Socio si firma contrato dentro de los **60 días** posteriores a ese primer contacto. Después de 60 días sin contrato firmado, la atribución vence y no se cobra comisión.
>
> Clientes que el Contratista ya tenía antes de firmar este acuerdo **nunca** generan comisión. El Contratista puede entregar su lista de clientes existentes al inicio del piloto y esa lista queda excluida por escrito.
>
> Si hay desacuerdo sobre el origen de un cliente, Socio muestra el registro de la línea con fecha y hora. Si no existe ese registro, no se cobra.

That last sentence is the one that matters. **"No log, no fee"** is a generous-sounding rule that costs you almost nothing (you control the logging) and removes the single most likely reason a contractor walks away angry. Note that it also excludes the dead-lead reactivation leads from clause 4 — decide deliberately whether reactivated old estimates count as attributable, and **write the answer down**, because it's genuinely ambiguous and it's where your P3 revenue lives.

---

### 🔴 Risk 2 — No termination clause, no term, no exit.

**The problem:** The agreement has no start date, no end date, no notice period, and no way for either party to leave. It's called a "pilot" but nothing defines how long a pilot lasts.

**Two failure scenarios:**

- *He wants out at week three.* He has no defined exit, so he just stops responding. You have no enforceable claim on deals in flight and no clean record of what happened. Worse, in a referral-dense neighborhood, an ugly exit becomes the story other contractors hear.
- *You want out.* He turns out to be unlicensed, unreachable, or does work that generates complaints. You have no stated right to terminate and no way to stop sending him leads without breaching a document you drafted.

**The fix — add a clause 6:**

> **6. Duración y Terminación**
>
> Este piloto dura **90 días** a partir de la firma, y se renueva mes a mes salvo aviso.
>
> Cualquiera de las partes puede terminar con **14 días de aviso por escrito** (WhatsApp cuenta como aviso escrito), sin penalidad y sin costo.
>
> Al terminar: los clientes ya atribuidos que firmen contrato dentro de los 30 días siguientes siguen generando comisión. Después de eso, no.
>
> El descuento de cohorte fundadora se mantiene mientras el acuerdo siga activo.

**Counterintuitive but true: making it easy to leave makes it easier to sign.** For a buyer whose core objection is "me estafaron con un contrato," a visible 14-day exit is a selling point, not a concession. Put it in the pitch.

---

### 🟠 Risk 3 — No liability allocation, and you're introducing strangers to people's homes.

**The problem:** The agreement says nothing about who is responsible for the work. Socio connects a homeowner to a contractor. The contractor floods the apartment below, does unpermitted work, or takes a deposit and disappears. The homeowner's lawyer looks for everyone in the chain — including the company whose branded WhatsApp line made the introduction and whose marketing says the contractors are "certificados con seguro COI al día" (that phrase is in `72h-pilot-acquisition-sprint.md`).

**This is the risk with the largest tail**, even though a dispute is less likely than the attribution fight.

**Three fixes, in order of importance:**

**a) Add a clause 7:**

> **7. Responsabilidad de la Obra**
>
> Socio **no ejecuta obra, no supervisa obra, y no es parte del contrato** entre el Contratista y su cliente. Toda la responsabilidad por la obra, permisos, licencias, seguros y garantías es del Contratista.
>
> El Contratista declara que mantiene licencia vigente (DCWP Home Improvement Contractor cuando aplique), seguro de responsabilidad civil, y workers' comp, y se compromete a entregar copias a Socio y a notificar si alguna vence.
>
> El Contratista mantiene a Socio libre de reclamos derivados de su obra.

**b) Verify the license and COI before the first lead, every time.** You can check DCWP status in two minutes at [a858-elicense.nyc.gov](https://a858-elicense.nyc.gov/). NYC's HIC license requires workers' comp proof, an exam, and either Trust Fund enrollment or a $20,000 surety bond ([NYC DCWP](https://www.nyc.gov/site/dca/businesses/license-checklist-home-improvement-contractor.page)) — a contractor who has one has already cleared a bar. **If you route a homeowner to an unlicensed contractor for residential home improvement work, that is your exposure, not a paperwork detail.**

**c) Stop saying "certificados" in outbound copy until (b) is a real process.** Right now that word appears in your Twilio template and describes a verification you aren't systematically doing. That's a claim without support — and it's the precise failure mode your other company exists to catch. Change it to something you can prove: *"maestros locales con licencia y seguro verificados."* Only after you're actually verifying.

---

## Also worth fixing (lower severity)

| # | Gap | Why it matters | Suggested fix |
|---|---|---|---|
| 4 | **No payment terms.** No due date, no method, no late consequence. | You'll be chasing invoices with no contractual footing. And 6%–12% of a deposit is real money to ask for by text. | "Comisión pagadera dentro de 7 días de que el anticipo se acredite. Pago por [método]." |
| 5 | **"Verified by QuickBooks" is undefined.** Read-only access? Screenshots? What if he doesn't use QBO? | Half of small Hispanic GCs don't run QuickBooks. As written, the trigger condition may be unmeetable — which arguably means no commission is ever owed. | Define acceptable proof, and add a non-QBO alternative (bank screenshot + signed contract copy). |
| 6 | **Clause 4 (notebook photos) has no data terms.** He's handing over his entire customer list. | This is the most sensitive asset a contractor owns, and you're asking for it in writing with no protection offered. It's also a likely stall point at signing. | Add: Socio uses the list only for his reactivation, doesn't share or resell it, deletes on request, and never contacts them for any other purpose. **This clause will win you signatures.** |
| 7 | **No consent language for the WhatsApp messaging in clause 4.** | You're messaging his past customers in his name. He should be authorizing that explicitly, and it should be recorded. | Add: Contractor authorizes Socio to message these contacts on his behalf, confirms they were prior business contacts, and approves the templates before sending. |
| 8 | **$40,000 cap → "tarifa plana opcional" is undefined.** | You've promised a flat rate with no number. If a contractor actually hits the cap (great problem), you're renegotiating from a promise you can't quantify. | Either name the flat rate or say "a acordar por escrito, sin obligación de continuar." |
| 9 | **No governing law / dispute clause.** | Small thing until it isn't. | "Este acuerdo se rige por las leyes del Estado de Nueva York." |
| 10 | **Company name inconsistency.** The signature block says "SOCIO INC (NYC)." | If that entity isn't actually incorporated and in good standing in NY, you're signing as a company that doesn't exist — which can pierce straight through to you personally. | Verify with [NYS DOS entity search](https://apps.dos.ny.gov/publicInquiry/). If it isn't formed yet, form it before signing #1. |

---

## On consumer protection law

You asked specifically about NYC consumer protection compliance. Two things to raise with an actual attorney:

1. **Who the consumer is.** This agreement is B2B — Socio to contractor — and consumer protection rules generally attach to the *homeowner* relationship. But your model puts you inside the flow between a home improvement contractor and a homeowner, and NYC regulates that relationship tightly (written contract requirements, deposit rules, the HIC licensing regime). **Ask the lawyer directly whether Socio's role creates any obligation of its own.** I don't know the answer and I'd be guessing.
2. **Commercial messaging.** You're sending cold WhatsApp outreach to businesses and, via clause 4, warm outreach to consumers on a contractor's behalf. Prior business relationship helps a lot on the second. Your existing quiet-hours governor and 1-per-day rate limit are the right instincts — keep them, and add a documented opt-out on every sequence. Your repo already has `templates/sms-compliance-runbook.md`; make sure the WhatsApp reactivation flow is actually covered by it.

---

## Priority order

**Before the next signature:**

1. Clause 5 — attribution (Risk 1). This is the one that costs you money and your first reference.
2. Clause 6 — term and termination (Risk 2). Cheap to add, and it *helps* you sell.
3. Clause 7 — liability + license/insurance rep (Risk 3).
4. Fix the "certificados" claim in outbound copy, or start verifying.

**Before contractor #5:**

5. Everything in the lower-severity table.
6. A New York attorney reads the whole thing. One hour.

**A note on length:** the one-page format is a genuine asset — it's why contractors sign it at the table instead of taking it home to disappear. Adding clauses 5–7 gets you to about a page and a half. That's still signable. Don't let it become four pages; if it does, put the operational detail in a short annex and keep the front page as-is.

---

## Sources

- Internal: `website/pilot-agreement.html`, `website/contratistas.html`, `docs/72h-pilot-acquisition-sprint.md`, `workflows/whatsapp-pitch-sequence.json`
- [NYC DCWP — Home Improvement Contractor license checklist](https://www.nyc.gov/site/dca/businesses/license-checklist-home-improvement-contractor.page)
- [NYC DCWP License Search](https://a858-elicense.nyc.gov/)
