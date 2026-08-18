# Pilot 001 — Manual Deployment Runbook

Follow in order. Every placeholder is `<LIKE_THIS>` — generate real values
locally, put them in the host's `.env`, and never paste secrets into chat.

Architecture: one machine (spare MacBook Air) → Postgres (Docker) + two Node
servers (merchant API :8787, Stripe webhook :8789) → Cloudflare Tunnel for
HTTPS. Hard gates: backups + restore verified BEFORE any production Stripe
event; Stripe test mode first.

## 0. Host prep (MacBook Air)

```bash
# Remote Login: System Settings → General → Sharing → Remote Login ON

# Keep the pilot host awake (it must not sleep — Stripe retries are limited)
sudo pmset -a sleep 0
sudo pmset -a displaysleep 0

# Homebrew + git
/bin/bash -c "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/HEAD/install.sh)"

# Clone the pilot branch
git clone https://github.com/NickAiNYC/Socio.git && cd Socio
git checkout feature/merchant-evidence-layer

# Docker Desktop (Apple Silicon)
brew install --cask docker
```

## 1. PostgreSQL (Docker)

```bash
docker run -d --name socio-pilot-pg --restart unless-stopped \
  -e POSTGRES_PASSWORD=<DB_PASSWORD> \
  -e POSTGRES_DB=growth_os \
  -p 5432:5432 \
  -v socio_pilot_pgdata:/var/lib/postgresql/data \
  postgres:16-alpine
```

`<DB_PASSWORD>`: generate locally (`openssl rand -hex 24`), keep in the host's
`.env` only.

## 2. Migrations

```bash
cd Socio
DATABASE_URL=postgres://postgres:<DB_PASSWORD>@127.0.0.1:5432/growth_os npm run migrate
# expect: applied: 001_economic_truth, 002_merchant_evidence
```

## 3. Socio servers

Create `.env` on the host from `.env.example`:

```env
DATABASE_URL=postgres://postgres:<DB_PASSWORD>@127.0.0.1:5432/growth_os
GROWTH_OS_ALLOW_MEMORY=false
MERCHANT_API_PORT=8787
MERCHANT_API_TOKENS={"<businessId>":"<LONG_RANDOM_TOKEN>"}
STRIPE_WEBHOOK_PORT=8789
STRIPE_WEBHOOK_SECRET=whsec_<from_stripe_dashboard>
```

`<LONG_RANDOM_TOKEN>`: `openssl rand -hex 32`. The businessId will be the
merchant's (e.g. `biz_<name>`).

Boot verification (fail-closed checks):

```bash
node engines/growth-os/merchant/merchant-api.mjs
# must print: listening on http://127.0.0.1:8787, tokens: configured, stripe: secret configured
node engines/growth-os/merchant/stripe-webhook-endpoint.mjs
# must print: listening on http://127.0.0.1:8789/api/webhooks/stripe
```

Run both as launchd agents (or tmux for a quick pilot). Request plists here
if you want them written for you.

## 4. HTTPS — Cloudflare Tunnel

```bash
brew install cloudflared
cloudflared tunnel login            # browser: pick a domain you own
cloudflared tunnel create socio-pilot
cloudflared tunnel route dns socio-pilot pilot.<yourdomain>.com
cloudflared tunnel route dns socio-pilot webhook.<yourdomain>.com
```

`~/.cloudflared/config.yml`:

```yaml
tunnel: <tunnel-id>
credentials-file: /Users/<user>/.cloudflared/<tunnel-id>.json
ingress:
  - hostname: pilot.<yourdomain>.com
    service: http://127.0.0.1:8787
  - hostname: webhook.<yourdomain>.com
    service: http://127.0.0.1:8789
  - service: http_status:404
```

```bash
cloudflared tunnel run socio-pilot
```

Quick sanity:

```bash
curl http://127.0.0.1:8787/api/health          # {"status":"ok",...}
curl -X POST http://127.0.0.1:8789/api/webhooks/stripe   # 401 — signature required, correct
```

## 5. Stripe webhook — test mode

1. Stripe Dashboard → **Test mode** → Developers → Webhooks → Add endpoint
2. URL: `https://webhook.<yourdomain>.com/api/webhooks/stripe`
3. Events: `payment_intent.succeeded`, `charge.refunded`, `customer.created`, `customer.updated`
4. Copy the signing secret → host `.env` → `STRIPE_WEBHOOK_SECRET`
5. Restart the webhook server

## 6. Backup + restore (HARD GATE — before any production event)

```bash
mkdir -p /opt/socio/backups
docker exec socio-pilot-pg pg_dump -U postgres growth_os > /opt/socio/backups/growth_os_$(date +%F).sql

# Restore test (prove it works once):
docker exec socio-pilot-pg psql -U postgres -c 'CREATE DATABASE growth_os_restore'
docker exec -i socio-pilot-pg psql -U postgres -d growth_os_restore < /opt/socio/backups/growth_os_$(date +%F).sql
```

Automate a daily dump (launchd/cron), keep 7 days. The restore test must pass
once before switching out of test mode.

## 7. Test-mode lifecycle

1. Stripe Dashboard (test mode) → create a payment **with
   `metadata.businessId = <businessId>`** → webhook records it
2. Webhooks → find the event → **Resend** → expect `200 duplicate`, revenue
   not double-counted
3. Issue a **refund** → expect `refund_recorded`, matched to the original
4. Open `https://pilot.<yourdomain>.com` → enter businessId + token → the
   evidence report shows: action, revenue, attribution, unknown, audit VALID,
   Stripe connected

## 8. First merchant

1. Create their business twin
2. Let real (or live) events flow per the gates
3. Run one governed experiment
4. Generate the report
5. Ask: **"Would you make a business decision based on this report?"**
6. Record the answer verbatim. Triage: structural limitation vs feature
   request before building anything.
