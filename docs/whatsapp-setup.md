# Socio — WhatsApp Business Cloud API Setup (Graph API v20.0)

Full portal + env + webhook wiring for the production-grade integration in `lib/whatsapp-engine.cjs`, `lib/whatsapp-router.cjs`, `lib/whatsapp-routes.cjs`, and `website/assets/whatsapp-widget.js`.

---

## 1. Meta Developer Portal / Business Manager

### A. Create the App
1. Go to **developers.facebook.com → My Apps → Create App → Business → Next**.
2. Name: `Socio — WhatsApp`, contact email: your ops email.
3. In the dashboard, **Add Product → WhatsApp → Set up**.
4. Note your **App ID** and **App Secret** (`App Settings → Basic`). Put them in `.env` as `META_APP_ID` / `META_APP_SECRET`.

### B. Phone Number & Business Account
1. In **WhatsApp → API Setup** you’ll see a test phone number, a **Phone Number ID**, and a **WhatsApp Business Account ID (WABA)**.
2. To go to production: **Business Settings (business.facebook.com) → WhatsApp Accounts → Add phone number** (verify ownership via SMS/call), then assign it to your app.
3. Copy **Phone Number ID** → `WHATSAPP_PHONE_NUMBER_ID` and **Business Account ID** → `WHATSAPP_BUSINESS_ACCOUNT_ID`.

### C. System User + Permanent Token (critical — never use a short-lived user token)
1. **Business Settings → Users → System Users → Add** (type: Admin).
2. Assign assets: your **App** (with `whatsapp_business_messaging` + `whatsapp_business_management`) and your **WhatsApp Business Account** (with *Manage* permission).
3. **Generate token** for the system user → select the app → check `whatsapp_business_messaging`, `whatsapp_business_management`, `business_management`. **Copy once** → `WHATSAPP_SYSTEM_USER_ACCESS_TOKEN`. It never expires unless you revoke it — this is your production `Bearer` token.
4. Keep the token in your secrets manager. Never commit it. Rotate with Business Settings → System Users → Generate New Token.

### D. Webhook Subscription
1. In **App Dashboard → WhatsApp → Configuration → Webhooks → Edit**, set:
   - **Callback URL**: `https://<your-domain>/api/whatsapp/webhook` (must be HTTPS, public, GET-able).
   - **Verify Token**: generate with `openssl rand -hex 16`, put in `.env` as `WHATSAPP_WEBHOOK_VERIFY_TOKEN` (same value you type into Meta).
2. Click **Verify and Save** — Meta will `GET` your endpoint with `hub.mode=subscribe&hub.verify_token=<your-token>&hub.challenge=<nonce>`. Your server (`GET /api/whatsapp/webhook`) must echo `hub.challenge` only when the token matches (we do, with a timing-safe compare and `v20.0` config).
3. Then **Subscribe to fields**: check `messages` at minimum (optionally `message_template_status_update` for template approvals). Save.
4. Add the webhook field subscription under **App Dashboard → Webhooks → WhatsApp Business Account → Subscribe** if you manage via the generic Webhooks product.

### E. Message Templates (needed outside the 24h window)
1. **WhatsApp Manager (business.facebook.com/wa/manage) → Message Templates → Create**.
2. Get your first template approved (e.g., `hello_world` is pre-approved on test numbers; for prod create `socio_intro` / `socio_pilot_followup` with a body + optional button).
3. Templates are sent via `sendTemplateMessage(to, name, lang, components)`; free-form `sendTextMessage` only works inside the 24h customer service window (we map `470` / `131047` to `WINDOW_VIOLATION` so you can fall back to a template).

---

## 2. Environment

Copy `.env.example` → `.env` and fill section **10**:

```
META_APP_ID=1234567890
META_APP_SECRET=abcdef...
WHATSAPP_PHONE_NUMBER_ID=1180138218526038
WHATSAPP_BUSINESS_ACCOUNT_ID=1915462325789357
WHATSAPP_SYSTEM_USER_ACCESS_TOKEN=EAAJ... (permanent system user token)
WHATSAPP_WEBHOOK_VERIFY_TOKEN=<same as portal webhook verify token>
WHATSAPP_DISPLAY_PHONE_NUMBER=19175551234
META_GRAPH_API_VERSION=v20.0
```

Local dev via ngrok/Cloudflare Tunnel: `npx ngrok http 3030` → set the webhook URL to `https://<ngrok-id>.ngrok.io/api/whatsapp/webhook`.

---

## 3. Webhook Security & Behaviour

- **GET** validates `hub.mode` / `hub.verify_token` / `hub.challenge` (our route does).
- **POST** validates `X-Hub-Signature-256` HMAC-SHA256 against `META_APP_SECRET` over the raw request body (`server.js` captures `req.rawBody` via `express.json({ verify })`). If the signature is invalid, we still ack `200` (so Meta stops retrying a bad payload) but drop the event and log `signature: invalid`.
- Payload parsing handles `text`, `button`, `interactive.button_reply`, `interactive.list_reply`, and `media` (`image`/`audio`/`document`/`video`/`sticker` + `location`/`contacts`). Media gets an auto-reply asking for text.
- We **ack `200` before processing** (`res.status(200).json(...)` then `setImmediate(async ...)`), so Meta never sees a webhook timeout even if the router does a Meta API call.
- STOP keywords (`STOP/CANCEL/BAJA/UNSUBSCRIBE/ALTO/DETENER/PARAR`) auto-suppress; `START/UNSTOP/REANUDAR` resubscribes — both bilingual, stored in `whatsapp_suppression` and checked on every outbound dispatch + inbound.
- Compliance layer on dispatch: quiet-hours block (9pm–8am ET) + 3-per-7-days frequency cap + suppression check. Bypass quiet hours only with `forceBypassQuietHours=true`.

---

## 4. Service Layer

`lib/whatsapp-engine.cjs` exposes the five required methods (plus legacy aliases):

```js
const { sendTextMessage, sendInteractiveButtonMessage,
        sendInteractiveListMessage, sendTemplateMessage,
        markMessageAsRead, validateSignature, CONFIG } = require('./lib/whatsapp-engine.cjs');

await sendTextMessage('+19175551234', 'Hola — bienvenido a Socio', false);
await sendInteractiveButtonMessage(to, '👋 Socio', '¿En qué te ayudo?', [
  { id: 'explore_features', title: '✨ Explore Features' },
  { id: 'book_a_call', title: '📅 Book a Call' },
  { id: 'pricing', title: '💲 Pricing' },
]);
await sendInteractiveListMessage(to, 'Explora Socio:', 'Ver opciones', [
  { title: 'Growth OS', rows: [{ id: 'feat_recovery', title: 'Revenue Recovery Map' }] },
]);
await sendTemplateMessage(to, 'hello_world', 'en_US', []);
await markMessageAsRead(messageId);
```

Error mapping (`mapMetaError`): `190` → `TOKEN_EXPIRED` (rotate token), `131030/132000` → `INVALID_PHONE`, `470/131047` → `WINDOW_VIOLATION` (send a template instead). Rate limiting: token-bucket 15/s global + 1/s per recipient; exponential backoff (base 400ms × 2^n + jitter, 3 retries) only on `429` and `5xx` / `RATE_LIMITED`.

---

## 5. Router & Automation

`lib/whatsapp-router.cjs` (`routeInbound`) implements the Socio state machine:

- **Keywords**: `Demo` / `Pricing` / `Support` / `Onboarding` / `Talk to Human` (bilingual, substring match + button-id mapping).
- **Welcome sequence** for `NEW` contacts with three quick-reply buttons (`Explore Features / Book a Call / Pricing`).
- **FAQ auto-replies** (hours, location, commission, contract).
- **Lead capture**: every inbound stores/updates `whatsapp_leads` with `phone` (E.164 digits) + `phoneE164` (`+` prefixed) and guesses for `businessName`.
- **Vertical selection** for onboarding (Florist / Restaurant / Clinic → stored for routing).
- Sessions persisted in `whatsapp_sessions[phone]` (`NEW → WELCOMED → QUALIFYING → QUALIFIED → HUMAN_HANDOFF`).

Outbound interactive replies use `sendInteractiveButtonMessage` and fall back to `sendTemplateMessage('hello_world')` when the 24h window is closed; list messages fall back to buttons if the list fails.

---

## 6. Frontend Widget

`website/assets/whatsapp-widget.js` is a zero-build IIFE:

- Drop-in: already injected in `website/index.html` as
  ```html
  <script>window.SOCIO_WHATSAPP={phoneNumber:'19175551234',defaultMessage:'Hi Socio — …'}</script>
  <script src="/assets/whatsapp-widget.js" defer></script>
  ```
  Override via `data-phone` / `data-message` on the script tag or `window.SOCIO_WHATSAPP` before load.
- Generates **wa.me deep links**: `https://wa.me/<digits>?text=<encodeURIComponent(msg)>` (single canonical helper `waLink`).
- UI: fixed floating FAB (60px, pulse rings + online dot), glassmorphic panel (`backdrop-filter: blur(16px)`, `rgba(255,255,255,0.88)`, `border: 1px solid rgba(255,255,255,0.55)`, 20px radius), brand header with `Space Grotesk`, chip quick-replies (Demo/Pricing/Support/Onboarding/Talk to Human), free-text input + send button, footer consent. Mobile: panel becomes `fixed` with `left/right: 14px`. Animations: `transform: scale(0.92) translateY(8px)` ↔ `scale(1) translateY(0)` with `cubic-bezier(0.16,1,0.3,1)`, 280ms.
- To change the number per environment, edit `window.SOCIO_WHATSAPP.phoneNumber` in `index.html` (or set `WHATSAPP_DISPLAY_PHONE_NUMBER` and have your deploy inject it).

---

## 7. Logging, Tests & Local Fixtures

- **Logging**: structured JSON lines via `log(level, msg, meta)` in the engine (`{ ts, level, msg, ...meta }`). PII redaction via `redactPhone` (last 4 only). Route logs: handshake, suppression, dispatch counts, router decisions, mapped Meta errors.
- **Existing tests**: `tests/whatsapp-engine.test.cjs` (normalize, suppression, frequency cap, constants). New coverage in `tests/whatsapp-router.test.cjs`.
- **Local fixtures**: run `node tests/whatsapp-fixtures.cjs` to simulate inbound payloads against a live local server, or `node tests/whatsapp-fixtures.cjs --dry` to print payloads + expected `X-Hub-Signature-256` + router decisions without network. Also see `scripts/test-whatsapp.sh` for cURL recipes.

Verify the whole stack:

```sh
npm test                  # engine + router + vertical-metrics
node tests/whatsapp-fixtures.cjs --dry
WHATSAPP_SYSTEM_USER_ACCESS_TOKEN=dummy node -e "require('./lib/whatsapp-engine.cjs').sendTextMessage('19175551234','hello')"
curl -i "http://localhost:3030/api/whatsapp/webhook?hub.mode=subscribe&hub.verify_token=$WHATSAPP_WEBHOOK_VERIFY_TOKEN&hub.challenge=123"
curl -i http://localhost:3030/api/whatsapp/status
```

---

## 8. Troubleshooting

| Symptom | Cause | Fix |
|---|---|---|
| `TOKEN_EXPIRED (190)` | User token or short-lived token | Regenerate **System User** permanent token, update `WHATSAPP_SYSTEM_USER_ACCESS_TOKEN`, restart. |
| `WINDOW_VIOLATION (470/131047)` | `sendTextMessage` outside 24h | Send a template (`sendTemplateMessage`) to reopen the window. |
| `INVALID_PHONE (131030/132000)` | Bad number or user not on WhatsApp | Validate E.164 (7–15 digits) before sending — we do. Check test number allowlist. |
| Webhook not firing | URL not verified or not subscribed to `messages` | Re-verify in portal; ensure the URL is public HTTPS and the verify token matches `.env`. |
| `429 rate limit` | Too many sends | Our backoff retries 3× with jitter; if still 429, spread dispatches and respect `recentCount` (3/7d cap). |
| Signature invalid | `META_APP_SECRET` mismatch or raw body not captured | Confirm secret matches portal; ensure `express.json({ verify: (req,_,buf)=>req.rawBody=buf })` is set (we patched `server.js`). |

---

## 9. Security Checklist Before Prod

- [ ] `META_APP_SECRET` + `WHATSAPP_SYSTEM_USER_ACCESS_TOKEN` in secrets manager, never in Git.
- [ ] `WHATSAPP_WEBHOOK_VERIFY_TOKEN` is random (`openssl rand -hex 16`).
- [ ] Webhook URL is HTTPS with signature validation on.
- [ ] `WHATSAPP_DISPLAY_PHONE_NUMBER` matches the verified business number (for wa.me links).
- [ ] Templates submitted/approved for out-of-window follow-ups.
- [ ] `POST /api/whatsapp/send` is not publicly open without auth if you expose it beyond localhost (add admin auth or place behind your app auth).
