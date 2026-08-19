---
name: clinic-dormant-leads
description: Reactivate dormant leads for local clinics with compliance-safe follow-up
vertical: clinic
min_dormant_count: 25
whenToUse: A clinic has 25+ leads that requested contact but never booked
---

# Clinic Dormant Leads Skill

## Step 1 — Segment dormant leads
- Lead requested contact (form/webhook) but no booking in 30+ days
- Consent state = explicit (recorded at capture — no implied consent)
- Not on suppression list

## Step 2 — Offer selection
- First-visit callback (scheduler books the appointment, no discount)
- New-patient consult window (limited-time availability, not a discount)
- Seasonal check (flu season, back-to-school physicals)

## Step 3 — Channel selection
- Phone callback for high-intent leads (booked elsewhere within 14 days)
- SMS for mid-intent (consented to SMS)
- Email for low-intent (monthly digest)

## Step 4 — Attribution window
- 21 days after first contact for callbacks
- 14 days for SMS/email nudges
- Every booking is matched to the originating lead id

## Rules
- HIPAA/PHI: never include clinical details in outreach; no PHI in the
  evidence report or audit trail (see ecc-hipaa-compliance skill)
- Never send more than 1 outreach per 72 hours per lead
- Always include opt-out
- Discounts require Governor approval and a documented exception
- Log every outreach as a governed action before send
