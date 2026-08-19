/**
 * Socio — WhatsApp Floating Widget
 * Glassmorphic, responsive, brand-aligned, wa.me deep-link routing.
 * No build step: drop-in IIFE, auto-inits on DOMContentLoaded.
 * Configure via window.SOCIO_WHATSAPP or data attributes on script tag.
 */
(function () {
  const DEFAULTS = {
    phoneNumber: '19175551234', // E.164 without +, without wa.me + prefix — override via window.SOCIO_WHATSAPP.phone
    defaultMessage: 'Hi Socio — I was on your site and want to learn more about growing my local business in NYC.',
    brandName: 'Socio',
    accent: '#669BD2',
    position: 'bottom-right', // bottom-right | bottom-left
    quickReplies: [
      { id: 'demo', label: '🎥 Demo', message: 'Hi Socio — I would like a Demo of your Growth OS.' },
      { id: 'pricing', label: '💲 Pricing', message: 'Hi Socio — can you share Pricing for your Growth OS?' },
      { id: 'support', label: '🛟 Support', message: 'Hi Socio — I need Support with my account.' },
      { id: 'onboarding', label: '🚀 Onboarding', message: 'Hi Socio — I want to start Onboarding for my business.' },
      { id: 'human', label: '💬 Talk to Human', message: 'Hi Socio — I would like to Talk to Human.' },
    ],
  };

  function getConfig() {
    const w = (typeof window !== 'undefined' && window.SOCIO_WHATSAPP) ? window.SOCIO_WHATSAPP : {};
    // Also read data-* from the script tag that loaded this file
    let dataCfg = {};
    try {
      const scripts = document.querySelectorAll('script[src*="whatsapp-widget"]');
      const last = scripts[scripts.length - 1];
      if (last) {
        if (last.dataset.phone) dataCfg.phoneNumber = last.dataset.phone.replace(/\D/g, '');
        if (last.dataset.message) dataCfg.defaultMessage = last.dataset.message;
        if (last.dataset.accent) dataCfg.accent = last.dataset.accent;
      }
    } catch (_) {}
    return { ...DEFAULTS, ...dataCfg, ...w };
  }

  function waLink(phoneDigits, text) {
    const clean = String(phoneDigits).replace(/\D/g, '');
    // wa.me expects number without + and without leading 00, with country code
    const num = clean.startsWith('00') ? clean.slice(2) : clean;
    return 'https://wa.me/' + num + '?text=' + encodeURIComponent(text);
  }

  function injectStyles(accent) {
    const id = 'socio-wa-styles';
    if (document.getElementById(id)) return;
    const css = `
#socio-wa-root{position:fixed;z-index:9999;font-family:Inter,system-ui,-apple-system,sans-serif}
#socio-wa-root[data-pos="bottom-right"]{right:20px;bottom:20px}
#socio-wa-root[data-pos="bottom-left"]{left:20px;bottom:20px}
@media(max-width:640px){#socio-wa-root[data-pos="bottom-right"]{right:14px;bottom:14px}#socio-wa-root[data-pos="bottom-left"]{left:14px;bottom:14px}}
.socio-wa-btn{position:relative;width:60px;height:60px;border-radius:9999px;background:${accent};display:flex;align-items:center;justify-content:center;cursor:pointer;box-shadow:0 8px 24px rgba(0,0,0,0.18),0 2px 8px rgba(0,0,0,0.12);border:none;transition:transform 0.2s cubic-bezier(0.16,1,0.3,1),box-shadow 0.2s}
.socio-wa-btn:hover{transform:scale(1.06);box-shadow:0 12px 32px rgba(0,0,0,0.22)}
.socio-wa-btn:active{transform:scale(0.97)}
.socio-wa-pulse{position:absolute;inset:0;border-radius:9999px;background:${accent};opacity:0.35;animation:socioPulse 2.2s cubic-bezier(0.4,0,0.6,1) infinite}
.socio-wa-pulse:nth-child(2){animation-delay:0.55s}
@keyframes socioPulse{0%{transform:scale(0.85);opacity:0.45}100%{transform:scale(1.45);opacity:0}}
.socio-wa-panel{position:absolute;bottom:76px;right:0;width:360px;max-width:calc(100vw - 28px);background:rgba(255,255,255,0.88);backdrop-filter:blur(16px) saturate(1.2);-webkit-backdrop-filter:blur(16px) saturate(1.2);border:1px solid rgba(255,255,255,0.55);border-radius:20px;box-shadow:0 16px 48px rgba(15,23,42,0.14),0 4px 16px rgba(15,23,42,0.08);overflow:hidden;transform-origin:bottom right;transition:opacity 0.28s cubic-bezier(0.16,1,0.3,1),transform 0.28s cubic-bezier(0.16,1,0.3,1)}
.socio-wa-panel[data-open="false"]{opacity:0;transform:scale(0.92) translateY(8px);pointer-events:none}
.socio-wa-panel[data-open="true"]{opacity:1;transform:scale(1) translateY(0);pointer-events:auto}
@media(max-width:640px){.socio-wa-panel{position:fixed;left:14px;right:14px;bottom:84px;width:auto;max-width:none}}
.socio-wa-header{padding:16px 16px 14px;display:flex;align-items:center;justify-content:space-between;background:linear-gradient(135deg, rgba(102,155,210,0.14), rgba(255,255,255,0.6));border-bottom:1px solid rgba(148,163,184,0.16)}
.socio-wa-brand{display:flex;align-items:center;gap:10px}
.socio-wa-logo{width:32px;height:32px;border-radius:10px;background:linear-gradient(135deg, ${accent}, #4a7fbe);display:flex;align-items:center;justify-content:center;color:#fff;font-weight:700;font-size:13px}
.socio-wa-title{font-family:'Space Grotesk',Inter,sans-serif;font-weight:600;font-size:13px;color:#0f172a;letter-spacing:-0.01em}
.socio-wa-sub{font-size:11px;color:#64748b;font-weight:400;margin-top:1px}
.socio-wa-close{width:28px;height:28px;border-radius:9999px;border:1px solid rgba(148,163,184,0.22);background:rgba(255,255,255,0.7);display:flex;align-items:center;justify-content:center;cursor:pointer;color:#64748b;font-size:16px;line-height:1}
.socio-wa-body{padding:14px 14px 12px}
.socio-wa-greeting{font-size:13px;line-height:1.5;color:#334155;background:rgba(102,155,210,0.10);border:1px solid rgba(102,155,210,0.14);border-radius:14px;padding:10px 12px;margin-bottom:12px}
.socio-wa-chips{display:flex;flex-wrap:wrap;gap:8px;margin-bottom:12px}
.socio-wa-chip{appearance:none;border:1px solid rgba(148,163,184,0.22);background:rgba(255,255,255,0.9);color:#0f172a;font-size:12.5px;font-weight:500;padding:7px 10px;border-radius:9999px;cursor:pointer;transition:all 0.15s;white-space:nowrap}
.socio-wa-chip:hover{border-color:${accent};background:rgba(102,155,210,0.10);transform:translateY(-1px)}
.socio-wa-inputRow{display:flex;gap:8px;align-items:center}
.socio-wa-input{flex:1;min-width:0;border:1px solid rgba(148,163,184,0.22);background:rgba(255,255,255,0.95);border-radius:9999px;padding:10px 14px;font-size:13px;color:#0f172a;outline:none}
.socio-wa-input:focus{border-color:${accent};box-shadow:0 0 0 3px rgba(102,155,210,0.18)}
.socio-wa-send{width:40px;height:40px;border-radius:9999px;background:${accent};border:none;display:flex;align-items:center;justify-content:center;cursor:pointer;color:#fff;flex-shrink:0;box-shadow:0 4px 12px rgba(102,155,210,0.35)}
.socio-wa-send:hover{filter:brightness(1.05)}
.socio-wa-foot{padding:8px 14px 12px;text-align:center;font-size:10.5px;color:#94a3b8}
.socio-wa-foot a{color:${accent};text-decoration:none;font-weight:600}
.socio-wa-dot{position:absolute;top:-2px;right:-2px;width:14px;height:14px;background:#22c55e;border:2px solid #fff;border-radius:9999px;box-shadow:0 2px 6px rgba(0,0,0,0.15)}
`;
    const el = document.createElement('style');
    el.id = id;
    el.textContent = css;
    document.head.appendChild(el);
  }

  function createWidget() {
    const cfg = getConfig();
    injectStyles(cfg.accent);

    const root = document.createElement('div');
    root.id = 'socio-wa-root';
    root.dataset.pos = cfg.position;

    const panel = document.createElement('div');
    panel.className = 'socio-wa-panel';
    panel.dataset.open = 'false';
    panel.setAttribute('role', 'dialog');
    panel.setAttribute('aria-label', 'Chat on WhatsApp');

    panel.innerHTML = `
      <div class="socio-wa-header">
        <div class="socio-wa-brand">
          <div class="socio-wa-logo">S</div>
          <div>
            <div class="socio-wa-title">${cfg.brandName} <span style="color:${cfg.accent}">· WhatsApp</span></div>
            <div class="socio-wa-sub">Respuesta en &lt;90 seg · Bilingual</div>
          </div>
        </div>
        <button class="socio-wa-close" aria-label="Close chat" type="button">×</button>
      </div>
      <div class="socio-wa-body">
        <div class="socio-wa-greeting">Hi — need a <strong>Revenue Recovery Map</strong> or a quick answer? Tap a prompt or type below and we’ll open WhatsApp with your message ready to send.</div>
        <div class="socio-wa-chips"></div>
        <div class="socio-wa-inputRow">
          <input class="socio-wa-input" type="text" placeholder="Type your message…" aria-label="WhatsApp message" maxlength="500" />
          <button class="socio-wa-send" type="button" aria-label="Send on WhatsApp">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="22" y1="2" x2="11" y2="13"></line><polygon points="22 2 15 22 11 13 2 9 22 2"></polygon></svg>
          </button>
        </div>
      </div>
      <div class="socio-wa-foot">By continuing you agree to receive WhatsApp updates from ${cfg.brandName}. Reply <strong>STOP</strong> to opt out. <a href="#" class="socio-wa-privacy">Privacy</a></div>
    `;

    const chipsWrap = panel.querySelector('.socio-wa-chips');
    cfg.quickReplies.forEach((q) => {
      const btn = document.createElement('button');
      btn.className = 'socio-wa-chip';
      btn.type = 'button';
      btn.textContent = q.label;
      btn.dataset.message = q.message;
      btn.addEventListener('click', () => openWa(q.message));
      chipsWrap.appendChild(btn);
    });

    const input = panel.querySelector('.socio-wa-input');
    const sendBtn = panel.querySelector('.socio-wa-send');
    const closeBtn = panel.querySelector('.socio-wa-close');

    function openWa(message) {
      const text = (message || input.value || cfg.defaultMessage).trim() || cfg.defaultMessage;
      // Keep wa.me link generation in one place for auditability
      const url = waLink(cfg.phoneNumber, text);
      window.open(url, '_blank', 'noopener');
      // Also try to record a lightweight analytics ping (no PII)
      try {
        fetch('/api/whatsapp/consent', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ phone: cfg.phoneNumber, sourcePath: location.pathname, consentText: 'Widget click-to-chat' }),
        }).catch(() => {});
      } catch (_) {}
    }

    sendBtn.addEventListener('click', () => openWa(input.value));
    input.addEventListener('keydown', (e) => {
      if (e.key === 'Enter') openWa(input.value);
    });

    // Toggle logic
    const fab = document.createElement('button');
    fab.className = 'socio-wa-btn';
    fab.type = 'button';
    fab.setAttribute('aria-label', 'Open WhatsApp chat');
    fab.setAttribute('aria-expanded', 'false');
    fab.innerHTML = `
      <span class="socio-wa-pulse" aria-hidden="true"></span>
      <span class="socio-wa-pulse" aria-hidden="true"></span>
      <span style="position:relative;z-index:1;display:flex;align-items:center;justify-content:center;color:#fff">
        <svg width="28" height="28" viewBox="0 0 24 24" fill="white" aria-hidden="true"><path d="M19.05 4.94A9.91 9.91 0 0 0 12.04 2C6.58 2 2.14 6.35 2.14 10.74c0 1.54.42 3.03 1.2 4.34L2 22l7.08-1.8a10 10 0 0 0 4.96 1.32h.01c5.46 0 9.9-4.35 9.9-9.71 0-2.6-1.03-5.04-2.9-6.87ZM12.05 19.5h-.01a8 8 0 0 1-4.08-1.1l-.29-.17-4.2 1.07 1.12-3.99-.19-.31A7.7 7.7 0 0 1 3.92 10.74c0-4.26 3.54-7.72 7.9-7.72 2.11 0 4.1.81 5.59 2.27a7.66 7.66 0 0 1 2.32 5.43c0 4.26-3.55 7.72-7.91 7.72Zm6.55-5.78c-.36-.18-2.14-1.04-2.47-1.16-.33-.12-.57-.18-.81.18s-.93 1.16-1.14 1.4-.42.27-.78.09-1.52-.55-2.82-1.74c-1.04-.91-1.74-2.04-1.95-2.39-.2-.34-.02-.52.15-.7.15-.15.36-.4.54-.6.18-.2.24-.34.36-.57.12-.22.06-.42-.03-.6l-1.1-2.6c-.29-.68-.59-.59-.81-.6h-.69c-.24 0-.63.09-.96.42s-1.26 1.21-1.26 2.95 1.29 3.42 1.47 3.66c.18.22 2.54 3.82 6.17 5.26.86.36 1.53.58 2.05.74.86.27 1.64.23 2.26.14.69-.1 2.14-.86 2.44-1.69.3-.83.3-1.55.21-1.69-.09-.15-.33-.24-.69-.42Z"/></svg>
      </span>
      <span class="socio-wa-dot" aria-hidden="true"></span>
    `;

    function setOpen(open) {
      panel.dataset.open = String(open);
      fab.setAttribute('aria-expanded', String(open));
    }

    fab.addEventListener('click', () => setOpen(panel.dataset.open !== 'true'));
    closeBtn.addEventListener('click', () => setOpen(false));
    document.addEventListener('keydown', (e) => { if (e.key === 'Escape') setOpen(false); });
    // Close when clicking outside panel+fab
    document.addEventListener('click', (e) => {
      if (panel.dataset.open !== 'true') return;
      if (root.contains(e.target)) return;
      setOpen(false);
    });

    root.appendChild(panel);
    root.appendChild(fab);
    return root;
  }

  function init() {
    if (document.getElementById('socio-wa-root')) return;
    const w = createWidget();
    document.body.appendChild(w);
    // Expose helper for external triggers (e.g., CTA buttons)
    window.SocioWhatsApp = {
      open: (msg) => window.open(waLink(getConfig().phoneNumber, msg || getConfig().defaultMessage), '_blank', 'noopener'),
      linkFor: (msg) => waLink(getConfig().phoneNumber, msg || getConfig().defaultMessage),
    };
  }

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init);
  else init();
})();
