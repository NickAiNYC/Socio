/**
 * Socio — Context-Aware Dynamic Island WhatsApp Widget
 * Seamlessly morphs from pill into contextual CTA based on scroll & page section.
 */
(function () {
  const DEFAULTS = {
    phoneNumber: '19175550199',
    brandName: 'Socio NYC',
    accent: '#25D366'
  };

  function injectStyles() {
    if (document.getElementById('socio-dynamic-wa-styles')) return;
    const style = document.createElement('style');
    style.id = 'socio-dynamic-wa-styles';
    style.innerHTML = `
      #socio-island-root {
        position: fixed;
        bottom: 24px;
        right: 24px;
        z-index: 9999;
        font-family: 'Plus Jakarta Sans', system-ui, sans-serif;
      }
      .socio-island-pill {
        display: inline-flex;
        align-items: center;
        gap: 10px;
        padding: 10px 18px;
        background: #0f172a;
        color: #ffffff;
        border-radius: 9999px;
        border: 1px solid rgba(255, 255, 255, 0.15);
        box-shadow: 0 10px 30px rgba(0, 0, 0, 0.3), 0 0 0 1px rgba(255, 85, 0, 0.2);
        cursor: pointer;
        text-decoration: none;
        transition: all 0.35s cubic-bezier(0.16, 1, 0.3, 1);
      }
      .socio-island-pill:hover {
        transform: translateY(-2px) scale(1.02);
        background: #000000;
        border-color: #25D366;
        box-shadow: 0 14px 36px rgba(37, 211, 102, 0.25);
      }
      .socio-island-dot {
        width: 10px;
        height: 10px;
        border-radius: 9999px;
        background: #25D366;
        box-shadow: 0 0 8px #25D366;
        animation: islandPulse 2s infinite;
      }
      @keyframes islandPulse {
        0%, 100% { transform: scale(1); opacity: 1; }
        50% { transform: scale(1.3); opacity: 0.7; }
      }
      .socio-island-text {
        font-size: 12.5px;
        font-weight: 700;
        letter-spacing: -0.01em;
        white-space: nowrap;
      }
      @media (max-width: 640px) {
        #socio-island-root {
          bottom: 16px;
          right: 16px;
        }
        .socio-island-pill {
          padding: 8px 14px;
        }
        .socio-island-text {
          font-size: 11px;
        }
      }
    `;
    document.head.appendChild(style);
  }

  function initDynamicIsland() {
    injectStyles();
    if (document.getElementById('socio-island-root')) return;

    const root = document.createElement('div');
    root.id = 'socio-island-root';
    root.innerHTML = `
      <a href="https://wa.me/19175550199?text=Hola%20Socio,%20quiero%20informacion." target="_blank" class="socio-island-pill" id="socio-island-cta">
        <span class="socio-island-dot"></span>
        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#25D366" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M7.9 20A9 9 0 1 0 4 16.1L2 22Z"/></svg>
        <span class="socio-island-text" id="socio-island-label">WhatsApp · Despacho Directo</span>
      </a>
    `;
    document.body.appendChild(root);

    // Scroll Context Morphing
    window.addEventListener('scroll', () => {
      const label = document.getElementById('socio-island-label');
      const cta = document.getElementById('socio-island-cta');
      if (!label || !cta) return;

      const calcSec = document.getElementById('calculator');
      const enrollSec = document.getElementById('enrollment');
      const scrollY = window.scrollY;

      if (enrollSec && scrollY >= enrollSec.offsetTop - 300) {
        label.textContent = 'Activar Piloto · $0 Anticipo';
        cta.href = 'https://wa.me/19175550199?text=Hola%20Socio,%20quiero%20activar%20mi%20piloto%20de%2060%20dias.';
      } else if (calcSec && scrollY >= calcSec.offsetTop - 300) {
        label.textContent = 'Simular Comisión por WhatsApp';
        cta.href = 'https://wa.me/19175550199?text=Hola%20Socio,%20quiero%20calcular%20mi%20comision.';
      } else if (window.location.pathname.includes('limpieza')) {
        label.textContent = 'WhatsApp · Contratos Limpieza';
        cta.href = 'https://wa.me/19175550199?text=Hola%20Socio,%20tengo%20empresa%20de%20limpieza.';
      } else if (window.location.pathname.includes('contratistas')) {
        label.textContent = 'WhatsApp Contratistas · $0 Anticipo';
        cta.href = 'https://wa.me/19175550199?text=Hola%20Socio,%20soy%20contratista%20en%20NYC.';
      } else {
        label.textContent = 'WhatsApp · Despacho Directo';
        cta.href = 'https://wa.me/19175550199?text=Hola%20Socio,%20quiero%20informacion.';
      }
    });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initDynamicIsland);
  } else {
    initDynamicIsland();
  }
})();
