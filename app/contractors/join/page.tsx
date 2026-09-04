"use client";

import { useState } from "react";

export default function JoinPage() {
  const [lang, setLang] = useState<"es" | "en">("es");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const t = {
    es: {
      headline: "Usted hace el trabajo de maestro. Nosotros nos encargamos de los clientes, estimados y cobros.",
      toggle: "View in English",
      features: [
        "Presupuestos profesionales en inglés para clientes exigentes.",
        "Citas confirmadas en casas residenciales (cero pérdida de tiempo).",
        "Gestión de seguros y certificados (COI) para edificios y co-ops.",
        "Sin mensualidades fijas: solo pagas cuando recibes el trabajo."
      ],
      formTitle: "Solicitar una invitación",
      name: "Nombre Completo",
      trade: "Especialidad (Ej: Pintura, Plaster, Azulejos)",
      years: "Años trabajando en NYC",
      phone: "Teléfono (WhatsApp)",
      submit: "Enviar Solicitud",
      submitting: "Enviando...",
      success: "Solicitud enviada con éxito. Nos pondremos en contacto pronto."
    },
    en: {
      headline: "You do the master work. We handle the clients, estimates, and collections.",
      toggle: "Ver en Español",
      features: [
        "Professional English proposals for demanding clients.",
        "Confirmed appointments at residential homes (zero wasted time).",
        "Insurance and COI management for buildings and co-ops.",
        "No fixed monthly fees: you only pay when you land the job."
      ],
      formTitle: "Request an Invitation",
      name: "Full Name",
      trade: "Specialty (e.g., Painting, Plaster, Tile)",
      years: "Years working in NYC",
      phone: "Phone (WhatsApp)",
      submit: "Submit Application",
      submitting: "Submitting...",
      success: "Application submitted successfully. We will be in touch soon."
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      const formData = new FormData(e.currentTarget as HTMLFormElement);
      const data = Object.fromEntries(formData.entries());
      
      const response = await fetch('/api/intake', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...data, type: 'contractor_application', lang })
      });

      if (!response.ok) throw new Error('Network response was not ok');

      alert(t[lang].success);
    } catch {
      alert("Something went wrong. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="w-full bg-canvas min-h-screen py-16 px-4 sm:px-6 lg:px-8">
      <div className="max-w-5xl mx-auto flex flex-col lg:flex-row gap-16 items-center">
        
        {/* Value Prop Section */}
        <div className="flex-1 space-y-8">
          <button 
            onClick={() => setLang(lang === "es" ? "en" : "es")}
            className="text-xs font-mono font-medium tracking-widest uppercase text-ink-soft hover:text-ink transition-colors bg-hairline/50 px-3 py-1 rounded-full"
          >
            {t[lang].toggle}
          </button>
          
          <h1 className="font-display text-4xl md:text-5xl lg:text-6xl font-semibold tracking-tight text-ink leading-tight">
            {t[lang].headline}
          </h1>
          
          <ul className="space-y-4">
            {t[lang].features.map((feature, i) => (
              <li key={i} className="flex gap-4 items-start">
                <div className="mt-1 bg-accent text-accent-ink text-white rounded-full p-1 flex-shrink-0">
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"/></svg>
                </div>
                <span className="text-lg text-ink-soft font-sans">{feature}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* Application Form */}
        <div className="w-full max-w-md bg-surface border border-hairline rounded-2xl shadow-sm p-8">
          <h2 className="font-display text-2xl text-ink mb-6">
            {t[lang].formTitle}
          </h2>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-semibold text-ink mb-1">{t[lang].name}</label>
              <input name="name" required type="text" className="w-full rounded-md border border-hairline-strong px-4 py-3 text-ink focus:border-neutral-900 focus:outline-none focus:ring-1 focus:ring-neutral-900" />
            </div>
            <div>
              <label className="block text-sm font-semibold text-ink mb-1">{t[lang].trade}</label>
              <input name="trade" required type="text" className="w-full rounded-md border border-hairline-strong px-4 py-3 text-ink focus:border-neutral-900 focus:outline-none focus:ring-1 focus:ring-neutral-900" />
            </div>
            <div>
              <label className="block text-sm font-semibold text-ink mb-1">{t[lang].years}</label>
              <input name="years" required type="number" min="0" className="w-full rounded-md border border-hairline-strong px-4 py-3 text-ink focus:border-neutral-900 focus:outline-none focus:ring-1 focus:ring-neutral-900" />
            </div>
            <div>
              <label className="block text-sm font-semibold text-ink mb-1">{t[lang].phone}</label>
              <input name="phone" required type="tel" className="w-full rounded-md border border-hairline-strong px-4 py-3 text-ink focus:border-neutral-900 focus:outline-none focus:ring-1 focus:ring-neutral-900" />
            </div>
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full mt-4 px-4 py-4 text-base font-medium text-white bg-accent text-accent-ink rounded-md hover:opacity-90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isSubmitting ? t[lang].submitting : t[lang].submit}
            </button>
          </form>
        </div>

      </div>
    </div>
  );
}
