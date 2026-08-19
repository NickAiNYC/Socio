# Consent Vault — Schema & Principles (DRAFT)

**Purpose:** Single source of truth for contact consent across every agent and channel. Marketing SMS/WhatsApp requires documented consent; opt-outs must propagate everywhere. This is infrastructure, not a feature.

## Contact consent object

```json
{
  "contact_id": "con_8bd82",
  "channel": "sms",
  "status": "opted_in",
  "consent_source": "booking_form",
  "consent_timestamp": "2026-08-19T14:10:00Z",
  "consent_language_version": "v1.0",
  "opt_out_timestamp": null,
  "suppression_scope": []
}
```

### Field rules

- `status`: `opted_in` | `opted_out` | `never_consented` | `unknown`
- `consent_source`: exact capture point (booking_form, sms_optin_keyword, in_store_tablet, whatsapp_template, etc.) — tied to the opt-in event, not imported.
- `consent_language_version`: version of the consent copy the contact saw (consent language changes invalidate old captures).
- `suppression_scope`: e.g. `["campaign:holiday_gifting"]` — allows narrow opt-outs without full channel loss.
- One object per contact × channel (sms, whatsapp, email, phone-call).

## Principles

1. **Consent is event-tied.** A consent record without source + timestamp + language version is treated as `unknown` — and `unknown` is not contactable.
2. **STOP/opt-out propagation.** One opt-out (SMS STOP, WhatsApp block, form) updates the vault and propagates to every agent and channel within minutes. No agent may message an opted-out contact — period.
3. **Channel-specific suppression & frequency caps.** Per-merchant caps (e.g., ≤ 4 SMS/contact/month); quiet hours enforced in recipient-local time.
4. **Merchant-visible approval mode** for first campaigns per merchant: no messages send until the owner approves the audience + copy.
5. **Do-not-contact risk score.** Complaints, repeated non-engagement, or sensitive categories (health-adjacent clinics) raise the score; above threshold = suppressed.
6. **Health-adjacent caution.** For clinics, treat treatment-related messaging conservatively — operational convenience never outruns privacy controls.
7. **Audit trail.** Consent vault writes are append-only, timestamped, and visible in the merchant's evidence view.

## Where it lives

Growth OS identity layer — upstream of the Agent Execution Layer (agents read consent; they never write it). The Command Center surfaces a per-contact consent view for merchant audits.
