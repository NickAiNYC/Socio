#!/usr/bin/env bash
set -euo pipefail
# Socio WhatsApp — local test helpers (no secrets needed for --dry run)
ROOT="$(cd "$(dirname "$0")/.." && pwd)"
HOST="${HOST:-http://localhost:3030}"
VERIFY="${WHATSAPP_WEBHOOK_VERIFY_TOKEN:-${WHATSAPP_VERIFY_TOKEN:-socio_wa_verify_2026}}"

echo "== Socio WhatsApp local tests =="
echo "Host: $HOST"
echo

echo "[1] Unit tests"
node --test "$ROOT/tests/whatsapp-engine.test.cjs" "$ROOT/tests/whatsapp-router.test.cjs"
echo

echo "[2] Fixtures dry run (no network)"
node "$ROOT/tests/whatsapp-fixtures.cjs" --dry
echo

if curl -sf "$HOST/api/whatsapp/status" >/dev/null 2>&1; then
  echo "[3] Live server checks (server is up at $HOST)"
  echo "  GET /api/whatsapp/webhook (handshake)…"
  curl -i "$HOST/api/whatsapp/webhook?hub.mode=subscribe&hub.verify_token=$VERIFY&hub.challenge=hello123" 2>&1 | head -n 8 || true
  echo
  echo "  GET /api/whatsapp/status…"
  curl -s "$HOST/api/whatsapp/status" | head -c 600; echo; echo
  echo "  Live fixtures — POST 14 inbound events to /api/whatsapp/webhook…"
  node "$ROOT/tests/whatsapp-fixtures.cjs"
else
  echo "[3] Live server checks — skipped (no server at $HOST). Start with: npm start  (PORT=3030)"
  echo "    Then re-run: HOST=$HOST bash $0"
fi

echo
echo "wa.me helper:"
echo "  https://wa.me/19175551234?text=$(python3 -c "import urllib.parse; print(urllib.parse.quote('Hi Socio — I want a Demo'))")"
