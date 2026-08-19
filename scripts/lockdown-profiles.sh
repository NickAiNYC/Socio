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

# ---------------------------------------------------------------------------
# Pre-flight: locked-down profiles must have ZERO MCP servers.
# `hermes mcp add dsh` (or any server) gives a locked profile a full
# code-execution route that bypasses this script — refuse to run instead of
# pretending the boundary holds. Override with ALLOW_MCP=1 only if you know
# exactly which MCP servers are wired and have reviewed them.
# ---------------------------------------------------------------------------
if [ "${ALLOW_MCP:-0}" != "1" ]; then
  if MCP_OUT="$("$HERMES" mcp list 2>/dev/null)"; then
    if ! printf '%s\n' "$MCP_OUT" | grep -q "No MCP servers configured"; then
      echo "REFUSE: MCP servers are configured — locked profiles must have none."
      printf '%s\n' "$MCP_OUT"
      echo "Review and remove them, or set ALLOW_MCP=1 to override (not recommended)."
      exit 1
    fi
  fi
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
  # Gateway api_server platform: DISABLE it entirely. Hermes' own startup
  # security audit warns that a network-accessible api_server with no
  # API_SERVER_KEY "dispatches terminal-capable agent work — an unauthenticated
  # network endpoint is remote code execution." Locked profiles have no
  # business exposing an OpenAI-compatible agent API, so the platform is off.
  "$HERMES" -p "$profile" config set platforms.api_server.enabled false >/dev/null 2>&1 || true
  # Belt-and-suspenders: even if re-enabled, restrict toolsets + force loopback.
  "$HERMES" -p "$profile" config set platforms.api_server.toolsets '["core", "skills", "memory", "session_search", "todo", "clarify"]' >/dev/null 2>&1 || true
  "$HERMES" -p "$profile" config set platforms.api_server.extra.host '127.0.0.1' >/dev/null 2>&1 || true
  # Remove any stray platform_toolsets key for api_server.
  "$HERMES" -p "$profile" config set platform_toolsets.api_server '[]' >/dev/null 2>&1 || true
done

echo ""
echo "VERIFICATION — any '✓ enabled' line below for a dangerous toolset means lockdown FAILED:"
for profile in "${PROFILES[@]}"; do
  if ! "$HERMES" profile show "$profile" >/dev/null 2>&1; then continue; fi
  echo "── ${profile}"
  "$HERMES" -p "$profile" tools list 2>/dev/null | grep -E '✓ enabled' || echo "   (no enabled toolsets)"
  APISERVER="$("$HERMES" -p "$profile" config get platforms.api_server.enabled 2>/dev/null)"
  echo "   api_server.enabled = ${APISERVER:-<unset>} (must be false)"
done
echo ""
echo "MCP check:"
"$HERMES" mcp list 2>/dev/null || true
