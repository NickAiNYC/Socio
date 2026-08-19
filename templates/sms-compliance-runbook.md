# SMS / WhatsApp Compliance Runbook (DRAFT)

**Purpose:** Operational checklist for compliant re-engagement messaging. Non-negotiable before any SMS/WhatsApp campaign sends. Legal specifics vary — have counsel review before first send.

---

## 1. Pre-launch registration (US)

- [ ] Register brand with **A2P 10DLC** (The Campaign Registry) via your SMS provider (Twilio, etc.).
- [ ] Register each use case as a separate campaign (marketing, notifications) with the correct campaign type.
- [ ] Register with **carrier vetting**; keep sample message content on file.
- [ ] Set up **STOP/HELP keyword handling** at the carrier level (free-to-end-user replies).
- [ ] If messaging health-adjacent clinics: confirm campaign description covers treatment-related content conservatively.

## 2. Consent capture (source of truth = Consent Vault)

- [ ] Opt-in must be documented: source, timestamp, language version, phone number, scope — per `templates/consent-vault-schema.md`.
- [ ] Preferred flows: booking form checkbox, SMS keyword (e.g., "JOIN"), in-store tablet, QR to opt-in page.
- [ ] Opt-in copy states what they'll receive, frequency, and how to opt out.
- [ ] Never buy lists. Never import third-party numbers as opted-in.

## 3. Message discipline

- [ ] Sender identification clear (brand name in every message).
- [ ] Frequency caps per contact per channel (default ≤ 4 SMS/month; lower for clinics).
- [ ] Quiet hours: no sends in recipient-local 9pm–9am (configurable per merchant).
- [ ] First campaign per merchant requires owner approval (audience + copy).
- [ ] Avoid urgency-porn, medical claims, or anything that reads as health advice — escalate, don't guess.

## 4. Opt-out & suppression

- [ ] STOP/opt-out propagates across ALL channels within minutes (vault update → agent suppression).
- [ ] Honor opt-outs immediately; no "are you sure" messages.
- [ ] Suppression list checked at send-time by every agent (fail-closed: no consent record = no send).
- [ ] Log every opt-out event; report counts in monthly statements.

## 5. Auditing & record-keeping

- [ ] Consent vault writes are append-only.
- [ ] Message logs retained per provider policy + 12 months minimum.
- [ ] Monthly compliance report: sends, opt-outs, complaints, quiet-hour breaches, agent-level violations (must be zero).

## 6. First-campaign checklist (per merchant)

1. Consent vault populated + audited (no `unknown` in audience).
2. A2P campaign active for the brand/use case.
3. Owner approved audience + copy.
4. Frequency cap + quiet hours configured.
5. STOP handling verified with a test number.
6. Lead-response SLA agreed (operational exceptions logged per Revenue Definition Schedule §12).
