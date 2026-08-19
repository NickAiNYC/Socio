---
name: cafe-loyalty
description: Drive repeat visits and loyalty enrollment for neighborhood cafés
vertical: cafe
min_dormant_count: 50
whenToUse: A café has 50+ infrequent customers (2+ weeks since last visit)
---

# Café Loyalty Skill

## Step 1 — Segment infrequent customers
- Last visit > 14 days ago
- At least 3 visits in the trailing 90 days (proven regulars, now lapsing)
- Not on suppression list

## Step 2 — Offer selection
- Punch-card completion push (nudge at 4/5 or 9/10 stamps)
- Off-peak incentive (morning/afternoon gap hours, e.g. 10:00–12:00)
- Refer-a-regular (both parties get a free drink)

## Step 3 — Channel selection
- In-store QR/print for high foot traffic
- SMS for regulars with phone on file
- Email for monthly digest + loyalty balance

## Step 4 — Attribution window
- 7 days for off-peak incentives
- 14 days for punch-card completion
- Assign a campaign id per push

## Rules
- Never discount below 15% without Governor approval
- Never send more than 1 message per 48 hours per customer
- Always include an opt-out link
- Free-drink redemptions are excluded from incremental revenue
- Record every push as a governed action (executed approval) before send
