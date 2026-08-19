#!/bin/bash
set -e

echo "🤖 Initializing Socio Operating System - Hermes Operations Layer..."

# Ensure Hermes CLI is installed
if ! command -v hermes &> /dev/null
then
    echo "❌ Error: 'hermes' command could not be found."
    echo "Please ensure Hermes Desktop (v2026.7.7+) is installed and the CLI is in your PATH."
    exit 1
fi

echo "🧠 Wiring up DSH as the MCP server for heavy lifting..."
# NOTE — DSH is NOT wired into the locked-down fleet by default. DSH exposes
# shell/file/web/code-execution tools; a locked profile (scripts/lockdown-
# profiles.sh) must have ZERO MCP servers, otherwise DSH becomes an escape
# hatch around the Governor (see the hostile audit). The heavy lifting happens
# in the human-operated DSH environment (npx @deepseek-ai/dsh), not inside the
# agent fleet.
# To explicitly opt in (NOT recommended for the pilot), set SOCIO_WIRE_DSH_MCP=1
# and review what the dsh MCP server exposes before enabling it. If you do
# enable DSH, use a dedicated, isolated DEVELOPMENT profile — never a locked
# production fleet profile.
if [ "${SOCIO_WIRE_DSH_MCP:-0}" = "1" ]; then
  echo "⚠️  SOCIO_WIRE_DSH_MCP=1 — wiring DSH as an MCP server for the fleet."
  echo "    This bypasses the execution boundary. Use a dedicated dev profile,"
  echo "    never a locked production profile. Make sure you know what you are doing."
  hermes mcp add dsh --command "npx @deepseek-ai/dsh --mcp"
else
  echo "ℹ️  DSH MCP not wired into the fleet (locked profiles must have no MCP servers)."
fi

echo "👥 Creating the Agent Fleet (Bot Mode) with Manifesto..."

# Agent 1: Lead Generation
echo "Creating Socio-Prospect..."
hermes bot create Socio-Prospect \
  --model deepseek-v4 \
  --memory persistent \
  --system-prompt "$(cat ./agents/socio-system-prompt.txt)"

# Agent 2: Outreach & Sales
echo "Creating Socio-Pitch..."
hermes bot create Socio-Pitch \
  --model deepseek-v4 \
  --memory persistent \
  --system-prompt "$(cat ./agents/socio-system-prompt.txt)"

# Agent 3: Merchant Onboarding
echo "Creating Socio-Onboard..."
hermes bot create Socio-Onboard \
  --model deepseek-v4 \
  --memory persistent \
  --system-prompt "$(cat ./agents/socio-system-prompt.txt)"

# Agent 4: Content Marketing
echo "Creating Socio-Content..."
hermes bot create Socio-Content \
  --model deepseek-v4 \
  --memory persistent \
  --system-prompt "$(cat ./agents/socio-system-prompt.txt)"

# Agent 5: Local SEO
echo "Creating Socio-Listings..."
hermes bot create Socio-Listings \
  --model deepseek-v4 \
  --memory persistent \
  --system-prompt "$(cat ./agents/socio-system-prompt.txt)"

# Agent 6: Commission Tracking
echo "Creating Socio-Track..."
hermes bot create Socio-Track \
  --model deepseek-v4 \
  --memory persistent \
  --system-prompt "$(cat ./agents/socio-system-prompt.txt)"

# Agent 7: Client Support
echo "Creating Socio-Support..."
hermes bot create Socio-Support \
  --model deepseek-v4 \
  --memory persistent \
  --system-prompt "$(cat ./agents/socio-system-prompt.txt)"

# Agent 8: Cross-sell & Referrals
echo "Creating Socio-Expand..."
hermes bot create Socio-Expand \
  --model deepseek-v4 \
  --memory persistent \
  --system-prompt "$(cat ./agents/socio-system-prompt.txt)"

echo "🛡️ Creating Compliance Agent Fleet..."

# Compliance Agent 1: Disclosure
echo "Creating Socio-Compliance..."
hermes bot create Socio-Compliance \
  --model deepseek-v4 \
  --memory persistent \
  --system-prompt "You are Socio's compliance officer. Ensure all AI-generated content is properly labeled. Flag any content that violates NYC or Chinese compliance standards."

# Compliance Agent 2: Pricing
echo "Creating Socio-Pricing..."
hermes bot create Socio-Pricing \
  --model deepseek-v4 \
  --memory persistent \
  --system-prompt "You are Socio's pricing compliance officer. Ensure every pitch, proposal, and invoice displays all-in pricing with no hidden fees."

# Compliance Agent 3: Terms
echo "Creating Socio-Terms..."
hermes bot create Socio-Terms \
  --model deepseek-v4 \
  --memory persistent \
  --system-prompt "You are Socio's terms manager. Generate, track, and store signed partnership agreements for every merchant."

# Compliance Agent 4: Data
echo "Creating Socio-Data..."
hermes bot create Socio-Data \
  --model deepseek-v4 \
  --memory persistent \
  --system-prompt "You are Socio's data privacy officer. Track all merchant data access and ensure compliance with data protection standards."

echo "🤝 Grouping Agents for Collaboration..."
# Group core operations agents for multi-agent workflows
hermes group create "Socio-Operations" --bots Socio-Prospect,Socio-Pitch,Socio-Onboard
hermes group create "Socio-Compliance-Ops" --bots Socio-Compliance,Socio-Pricing,Socio-Terms,Socio-Data

echo "✅ Hermes Fleet initialized."
echo "Your 12 agents (8 Ops + 4 Compliance) are now running with persistent memory."
