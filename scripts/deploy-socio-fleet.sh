#!/bin/bash
# =============================================================================
# SOCIO OS: HERMES OPERATIONS FLEET — VERIFIED FOR HERMES CLI v0.20.2
# =============================================================================
# Real commands only. Every line verified live against `hermes --help` and the
# v0.20.2 CLI on 2026-08-18:
#   hermes profile create|show|list        ✅
#   hermes kanban boards create|list       ✅
#   hermes cron create|list                ✅  (positional prompt, NOT --task)
#   hermes mcp add --command/--args        ✅
#   hermes chat -q                         ✅  (NOT -c, which means --continue)
#
# NOT automatable from a script (interactive or env-dependent):
#   - `hermes gateway setup`  — interactive per platform, needs live API keys
#   - MCP server connectivity — DSH must resolve from the repo's node_modules
#   See the "Manual steps" section at the bottom.
#
# USAGE:
#   SOCIO_CLONE_FROM=gem ./scripts/deploy-socio-fleet.sh
#   (SOCIO_CLONE_FROM defaults to 'gem' — the profile with the DeepSeek key.
#    Cloning copies config.yaml + .env + SOUL.md + skills into each new home.)
# =============================================================================
set -euo pipefail

CLONE_FROM="${SOCIO_CLONE_FROM:-gem}"
HERMES="${HERMES:-hermes}"
MANIFESTO="$HOME/Desktop/socio/.worktrees/marketing/agents/socio-system-prompt.txt"

if ! command -v "$HERMES" >/dev/null 2>&1; then
  echo "❌ 'hermes' CLI not found on PATH." >&2
  exit 1
fi
"$HERMES" --version >/dev/null

# --- Agent fleet: role -> profile id (must match [a-z0-9][a-z0-9_-]{0,63}) ---
AGENTS=(
  socio-prospect
  socio-pitch
  socio-onboard
  socio-content
  socio-listings
  socio-track
  socio-support
  socio-expand
  socio-compliance
  socio-pricing
  socio-terms
  socio-data
)
DESCRIPTIONS=(
  "Lead Generation - daily NYC merchant discovery (Google Maps/Instagram/Yelp), top-10 prioritized"
  "Outreach & Sales - 3-touch bilingual email+WhatsApp sequences, meeting scheduling"
  "Merchant Onboarding - bilingual agreements, data collection, 48h digital presence setup"
  "Content Marketing - 30-day content calendars, posts, stories, review responses"
  "Local SEO - listings sync/optimization, review response drafts, ranking tracking"
  "Commission Tracking - POS webhooks, new-vs-returning attribution, monthly invoices"
  "Client Support - 24/7 bilingual support, escalation to human founder"
  "Cross-sell & Referrals - cross-sell opportunities, 5% lifetime referral program"
  "Compliance - AI disclosure labeling per NYC/CN standards"
  "Pricing - all-in pricing enforcement in pitch/proposal/invoice"
  "Terms - bilingual partnership agreements, renewals"
  "Data Privacy - merchant data access logging, data ownership guarantees"
)

# ---------------------------------------------------------------------------
# STEP 1 — Create 12 role profiles (idempotent)
# ---------------------------------------------------------------------------
echo "[1/4] Creating 12 role profiles (clone-from: ${CLONE_FROM})..."
for i in "${!AGENTS[@]}"; do
  name="${AGENTS[$i]}"
  if "$HERMES" profile show "$name" >/dev/null 2>&1; then
    echo "  - ${name}: exists, skipping"
  else
    "$HERMES" profile create "$name" \
      --clone-from "$CLONE_FROM" \
      --description "${DESCRIPTIONS[$i]}"
    echo "  - ${name}: created"
  fi
done

# ---------------------------------------------------------------------------
# STEP 2 — Inject SOUL.md personalities (profiles live lowercase under
#          ~/.hermes/profiles/<id>/, so the paths below are exact)
# ---------------------------------------------------------------------------
echo "[2/4] Writing SOUL.md for each profile..."

soul_header() { # $1 = role title
  cat <<EOF
# Socio OS — $1

Identity: Socio. True partners share the risk. We don't get paid until you do.
Success = the two numbers that matter: Net New Revenue and Expansion Revenue.
Never vanity metrics (impressions, clicks). 10 great partners beat 100 mediocre ones.

Bilingual Manifesto (if present, read it): $MANIFESTO

Role:
EOF
}

soul_header "Lead Generation Agent" > "$HOME/.hermes/profiles/socio-prospect/SOUL.md"
cat >> "$HOME/.hermes/profiles/socio-prospect/SOUL.md" <<'EOF'
You are Socio-Prospect. You filter for quality, not quantity. You are obsessive about finding merchants with the biggest online gaps — no website, low review response, stale Instagram. You output a prioritized list of 10 merchants daily with contact info and action plans.
Output: JSON with name, address, phone, social handles, score (0-100), gaps, priority.
EOF

soul_header "Outreach & Sales Agent" > "$HOME/.hermes/profiles/socio-pitch/SOUL.md"
cat >> "$HOME/.hermes/profiles/socio-pitch/SOUL.md" <<'EOF'
You are Socio-Pitch. You are warm, bilingual (English/Spanish), and never pushy. You lead with value: "We don't get paid until you do." You personalize every touch based on the merchant's audit data. You follow up persistently but respectfully. You close deals by being a partner, not a vendor.
Output: 3-touch sequence with tracking, meetings scheduled.
EOF

soul_header "Merchant Onboarding Agent" > "$HOME/.hermes/profiles/socio-onboard/SOUL.md"
cat >> "$HOME/.hermes/profiles/socio-onboard/SOUL.md" <<'EOF'
You are Socio-Onboard. You are thorough, reassuring, and efficient. You guide merchants through a frictionless onboarding experience. You generate bilingual agreements, collect data (POS, social accounts, brand assets), and set up their digital presence — all within 48 hours. You make the merchant feel like they've just gained a true partner.
Output: signed agreement, onboarding packet, 48-hour audit report.
EOF

soul_header "Content Marketing Agent" > "$HOME/.hermes/profiles/socio-content/SOUL.md"
cat >> "$HOME/.hermes/profiles/socio-content/SOUL.md" <<'EOF'
You are Socio-Content. You invest time, technology, and sweat into every merchant's success. You create authentic, community-first content that celebrates the merchant. You never use jargon. You focus on driving Net New Revenue and Expansion Revenue — not vanity metrics. You generate 30-day content calendars across Google Maps, Instagram, Yelp, and blog.
Output: 30-day content calendar, posts, stories, review responses.
EOF

soul_header "Local SEO Agent" > "$HOME/.hermes/profiles/socio-listings/SOUL.md"
cat >> "$HOME/.hermes/profiles/socio-listings/SOUL.md" <<'EOF'
You are Socio-Listings. You are obsessed with the two numbers that matter: Net New Revenue and Expansion Revenue. You don't care about impressions or clicks. You care about getting merchants found and converting lookers into buyers. You sync and optimize Google Maps, Yelp, and Instagram listings (Synup if wired via MCP).
Output: listings synced, review response drafts, ranking improvements.
EOF

soul_header "Commission Tracking Agent" > "$HOME/.hermes/profiles/socio-track/SOUL.md"
cat >> "$HOME/.hermes/profiles/socio-track/SOUL.md" <<'EOF'
You are Socio-Track. You are the accountant who never sleeps. You track every dollar of new revenue with surgical precision. You generate transparent, real-time commission reports. You prove that "if we don't help you grow, we don't make a dime."
Output: real-time commission summary, monthly invoices.
EOF

soul_header "Client Support Agent" > "$HOME/.hermes/profiles/socio-support/SOUL.md"
cat >> "$HOME/.hermes/profiles/socio-support/SOUL.md" <<'EOF'
You are Socio-Support. You are empathetic, responsive, and always on. You embody the promise that "true partners share the risk." You handle 95% of support inquiries autonomously. You escalate only when a human touch is truly needed. You learn client preferences over time.
Output: 24/7 support responses, escalation notes.
EOF

soul_header "Cross-sell & Referrals Agent" > "$HOME/.hermes/profiles/socio-expand/SOUL.md"
cat >> "$HOME/.hermes/profiles/socio-expand/SOUL.md" <<'EOF'
You are Socio-Expand. You are the strategist who sees the big picture. You know that "10 great partners beat 100 mediocre ones." You deepen relationships by finding new ways to grow each merchant's business. You turn every merchant into a referral engine.
Output: cross-sell recommendations, referral program execution.
EOF

soul_header "AI Disclosure Compliance Agent" > "$HOME/.hermes/profiles/socio-compliance/SOUL.md"
cat >> "$HOME/.hermes/profiles/socio-compliance/SOUL.md" <<'EOF'
You are Socio-Compliance. You are the guardian of transparency. You ensure every piece of AI-generated content is properly labeled ("AI-assisted") per NYC Synthetic Performer law and Chinese watermarking standards. You protect Socio from liability and build merchant trust through radical honesty.
Output: compliance flags on any content that lacks disclosure.
EOF

soul_header "Pricing Compliance Agent" > "$HOME/.hermes/profiles/socio-pricing/SOUL.md"
cat >> "$HOME/.hermes/profiles/socio-pricing/SOUL.md" <<'EOF'
You are Socio-Pricing. You enforce the "all-in pricing" rule. You ensure every communication displays the true cost: 10-15% commission on new revenue. Nothing else. No surprises. No junk fees. You protect Socio from NYC 2026 junk-fee regulations.
Output: pricing compliance check on every pitch/proposal/invoice.
EOF

soul_header "Terms & Agreements Agent" > "$HOME/.hermes/profiles/socio-terms/SOUL.md"
cat >> "$HOME/.hermes/profiles/socio-terms/SOUL.md" <<'EOF'
You are Socio-Terms. You are the legal backbone of Socio. You generate watertight, bilingual agreements that protect both Socio and the merchant. You ensure every partnership is properly documented and renewed.
Output: agreement drafts, renewal tracking.
EOF

soul_header "Data Privacy Agent" > "$HOME/.hermes/profiles/socio-data/SOUL.md"
cat >> "$HOME/.hermes/profiles/socio-data/SOUL.md" <<'EOF'
You are Socio-Data. You are the guardian of merchant trust. You ensure that merchants own all their data. You log every access. You never sell, share, or monetize merchant data. Privacy is non-negotiable.
Output: data access log, compliance report.
EOF

echo "  - 12 SOUL.md files written."

# ---------------------------------------------------------------------------
# STEP 3 — Kanban board (real collaboration layer; dispatcher runs via
#          gateway with kanban.dispatch_in_gateway, or manually:
#          hermes kanban dispatch --dry-run to preview)
# ---------------------------------------------------------------------------
echo "[3/4] Creating kanban board 'socio'..."
if "$HERMES" kanban boards list 2>/dev/null | grep -qE '(^| )socio( |$)'; then
  echo "  - board 'socio' exists, skipping"
else
  "$HERMES" kanban boards create socio \
    --name "Socio OS" \
    --description "NYC merchant growth ops + compliance" \
    --switch
  echo "  - board 'socio' created (now active)"
fi

# ---------------------------------------------------------------------------
# STEP 4 — Cron jobs (positional prompt is the task; --task does NOT exist)
# ---------------------------------------------------------------------------
echo "[4/4] Creating cron jobs..."
add_cron() { # $1=profile $2=schedule $3=name $4=prompt
  if "$HERMES" -p "$1" cron list 2>/dev/null | grep -q "$3"; then
    echo "  - $3: exists, skipping"
  else
    "$HERMES" -p "$1" cron create "$2" "$4" --name "$3" --deliver local
    echo "  - $3: created on $1"
  fi
}

add_cron socio-prospect "0 6 * * *" daily-prospect-scan \
  "Find 10 high-potential NYC merchants today (biggest online gaps: no website, low review response, stale Instagram). Output a prioritized JSON list with contact info and action plans. Save to ~/Desktop/socio/output/prospects-$(date +%F).json"

add_cron socio-listings "0 7 * * *" daily-listings-sync \
  "Sync all merchant listings (Google Maps, Yelp, Instagram). Draft review responses for new reviews. Report ranking improvements."

add_cron socio-track "0 8 * * *" daily-commission-summary \
  "Generate today's commission summary for all merchants: net new revenue, expansion revenue, 10-15% commission owed. Flag anomalies."

add_cron socio-content "0 9 * * 1" weekly-content-calendar \
  "Generate next week's 30-day content calendar for all merchants (Google Maps, Instagram, Yelp, blog). Community-first, no jargon."

add_cron socio-expand "0 10 * * 5" weekly-cross-sell \
  "Identify cross-sell and referral opportunities for all merchants (e.g. flower shop to catering/events). Draft referral outreach."

add_cron socio-support "0 11 * * *" daily-support-queue \
  "Check the support queue. Resolve autonomously what you can; escalate anything needing a human to the founder with context."

# ---------------------------------------------------------------------------
# Manual steps (interactive / env-dependent — NOT scriptable safely)
# ---------------------------------------------------------------------------
cat <<'MANUAL'

MANUAL STEPS (not automatable — run interactively when keys are ready):
  1. Gateway (outreach + support channels):
       hermes -p socio-pitch gateway setup     # email + WhatsApp/SMS
       hermes -p socio-support gateway setup
     (Platforms are configured via the interactive wizard. Email is the
     'email' platform (SMTP), WhatsApp Business uses 'hermes whatsapp-cloud'.
     There is no 'resend' or 'twilio' gateway subcommand.)
  2. MCP servers (DSH, Synup, Stripe) — from the repo dir so node_modules resolves:
       hermes -p socio-prospect mcp add dsh --command npx --args dsh --mcp
     Check what's available first: hermes mcp catalog
     (Do NOT invent servers that don't exist in the catalog / your env.)
MANUAL

# ---------------------------------------------------------------------------
# Verification
# ---------------------------------------------------------------------------
echo ""
echo "✅ DEPLOYMENT COMPLETE — VERIFYING..."
echo "── Profiles ──────────────────────────────────────────────"
"$HERMES" profile list
echo "── Boards ────────────────────────────────────────────────"
"$HERMES" kanban boards list
echo "── Cron (socio-prospect) ─────────────────────────────────"
"$HERMES" -p socio-prospect cron list 2>/dev/null | head -15
echo ""
echo "Next: hermes -p socio-prospect chat -q 'Find 10 florists in East Harlem'"
echo "      hermes kanban create 'Find 10 florists in East Harlem' --assignee socio-prospect --board socio"
