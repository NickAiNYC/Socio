#!/bin/bash
# =============================================================================
# Growth OS — Runtime Agent Isolation (locked-down worker profile)
# =============================================================================
# Enforces the execution boundary OUTSIDE the agent's instructions: governed
# Hermes profiles get ONLY cognitive tools (skills/todo/memory/session_search/
# clarify) plus their configured MCP servers (Growth OS). Direct execution
# surfaces (terminal, file, web, code_execution, video gen, X search) are
# disabled at the Hermes toolset layer, so an agent cannot bypass the Governor
# by running shell commands, writing files, or fetching the network.
#
# The Growth OS MCP tools (growth_os_*) remain available — they are the ONLY
# path to external effects.
#
# USAGE:  bash scripts/lockdown-profiles.sh [profile ...]
#         (defaults to all 15 socio-* profiles)
# =============================================================================
set -euo pipefail

HERMES="${HERMES:-hermes}"

if [ $# -gt 0 ]; then
  PROFILES=("$@")
else
  PROFILES=(socio-prospect socio-pitch socio-onboard socio-content socio-listings socio-track socio-support socio-expand socio-compliance socio-pricing socio-terms socio-data socio-cn-prospect socio-tiktok-ops socio-localization)
fi

# Toolsets that allow direct execution / external effects — must be disabled.
DANGEROUS_TOOLSETS=(web terminal file code_execution bfl x_search browser search)

for profile in "${PROFILES[@]}"; do
  if ! "$HERMES" profile show "$profile" >/dev/null 2>&1; then
    echo "SKIP ${profile}: profile does not exist"
    continue
  fi
  echo "LOCKDOWN ${profile}"
  for toolset in "${DANGEROUS_TOOLSETS[@]}"; do
    "$HERMES" -p "$profile" tools disable "$toolset" >/dev/null 2>&1 || true
  done
  # Gateway api_server platform: restrict toolsets (it binds 0.0.0.0:8687+).
  "$HERMES" -p "$profile" config set platforms.api_server.toolsets '["core", "skills", "memory", "session_search", "todo", "clarify"]' >/dev/null 2>&1 || true
  # Remove any stray platform_toolsets key for api_server.
  "$HERMES" -p "$profile" config set platform_toolsets.api_server '[]' >/dev/null 2>&1 || true
done

echo ""
echo "VERIFICATION — any '✓ enabled' line below for a dangerous toolset means lockdown FAILED:"
for profile in "${PROFILES[@]}"; do
  if ! "$HERMES" profile show "$profile" >/dev/null 2>&1; then continue; fi
  echo "── ${profile}"
  "$HERMES" -p "$profile" tools list 2>/dev/null | grep -E '✓ enabled' || echo "   (no enabled toolsets)"
done
