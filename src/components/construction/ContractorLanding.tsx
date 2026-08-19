'use client';

import React, { useState } from 'react';
import { 
  HardHat, 
  MessageSquare, 
  ArrowUpRight, 
  Calculator, 
  Building2, 
  Hammer,
  FileCheck2,
  Globe
} from 'lucide-react';
import { CommissionSimulator } from './CommissionSimulator';

type Language = 'es' | 'en';

const CONTENT = {
  es: {
    badge: 'SISTEMA DE ADQUISICIÓN DE PROYECTOS · NYC',
    headlineMain: 'Más Contratos de Remodelación y Construcción.',
    headlineSub: 'Sin cobrarle por adelantado.',
    description: 'Socio implementa un Sistema de Gestión de Prospectos Bilingüe que conecta llamadas comerciales directamente a su WhatsApp. Solo cobramos comisión cuando su cliente paga el depósito inicial en QuickBooks.',
    ctaPrimary: 'Cotizar Proyecto por WhatsApp',
    ctaSecondary: 'Ver Calculadora de Comisión',
    metrics: [
      { label: 'Depósitos Asegurados', value: '$2.4M+' },
      { label: 'Tiempo de Respuesta', value: '< 90 seg' },
      { label: 'Permisos DOB Monitoreados', value: '1,200/mes' },
      { label: 'Costo Inicial', value: '$0.00' }
    ],
    featuresTitle: 'Diseñado para el Flujo de Caja Real del Contratista',
    features: [
      {
        icon: MessageSquare,
        title: 'Cierre Rápido vía WhatsApp',
        desc: 'Propietarios en Queens, Brooklyn y Manhattan no leen correos. Enviamos cotizaciones y seguimiento en 3 toques directo a WhatsApp.'
      },
      {
        icon: FileCheck2,
        title: 'Atribución Contra Depósito QuickBooks',
        desc: 'Comisión ligada a depósitos cobrados en banco. Cero cargos por estimados no cerrados o clientes fantasmas.'
      },
      {
        icon: Building2,
        title: 'Radar de Permisos DOB de NYC',
        desc: 'Detectamos permisos residenciales y comerciales emitidos hoy para contactar a dueños antes que la competencia.'
      }
    ],
    guaranteeTitle: 'La Regla de Oro de Socio',
    guaranteeDesc: 'Si el cliente no deposita el anticipo en su cuenta comercial, Socio cobra $0.00. Usted mantiene el 100% del control de sus cuadrillas y licencias.',
    whatsappMessage: 'Hola Socio, soy contratista en NYC y quiero activar el sistema de prospectos para mi empresa.'
  },
  en: {
    badge: 'PROJECT ACQUISITION ENGINE · NYC',
    headlineMain: 'High-Ticket Renovation & Framing Contracts.',
    headlineSub: 'Zero upfront fees. Paid on deposits.',
    description: 'Socio deploys a Bilingual Lead Management System connecting property owners directly to your WhatsApp. We only earn our commission once the client clears the initial project deposit in QuickBooks.',
    ctaPrimary: 'Launch WhatsApp Dispatch',
    ctaSecondary: 'Simulate Commission Tiers',
    metrics: [
      { label: 'Contract Volume', value: '$2.4M+' },
      { label: 'Lead Response Time', value: '< 90 sec' },
      { label: 'DOB Permits Scanned', value: '1,200/mo' },
      { label: 'Upfront Cost', value: '$0.00' }
    ],
    featuresTitle: 'Engineered for Real Contractor Cash Flow',
    features: [
      {
        icon: MessageSquare,
        title: 'WhatsApp-First Estimating',
        desc: 'Homeowners in Brooklyn and Manhattan ignore email. We deliver 3-touch follow-ups directly to WhatsApp within 90 seconds.'
      },
      {
        icon: FileCheck2,
        title: 'QuickBooks Cleared-Deposit Ledger',
        desc: 'Performance proof requires cleared bank deposits. Zero fees for lost bids, ghost leads, or delays.'
      },
      {
        icon: Building2,
        title: 'NYC DOB Permit Feeds',
        desc: 'Ingesting daily DOB NOW filings to identify high-budget additions and full gut renovations across NYC.'
      }
    ],
    guaranteeTitle: 'The Socio Contractor Pact',
    guaranteeDesc: 'No retainer. No setup fee. If your customer deposit does not clear in your bank account, you pay $0.00.',
    whatsappMessage: 'Hello Socio, I am an NYC general contractor interested in deploying the project acquisition engine.'
  }
};

export function ContractorLanding() {
  const [lang, setLang] = useState<Language>('es');
  const t = CONTENT[lang];

  const getWhatsAppLink = () => {
    const encoded = encodeURIComponent(t.whatsappMessage);
    return `https://wa.me/19175550199?text=${encoded}`;
  };

  return (
    <div className="min-h-screen bg-[#F9FAFB] text-[#111827] font-sans selection:bg-[#EAB308] selection:text-black">
      {/* Safety Hazard Industrial Top Bar */}
      <div className="h-2 w-full bg-gradient-to-r from-[#EAB308] via-[#1E40AF] to-[#EAB308]" />

      {/* Main Navigation */}
      <header className="sticky top-0 z-50 bg-white/95 backdrop-blur-md border-b border-[#E5E7EB]">
        <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded bg-[#111827] flex items-center justify-center text-[#EAB308]">
              <HardHat className="w-6 h-6" />
            </div>
            <div className="flex items-center">
              <span className="text-2xl font-black tracking-tight text-[#111827]">Socio</span>
              <span className="w-1.5 h-1.5 rounded-[1px] bg-[#1E40AF] ml-[1.5px] self-end mb-1 inline-block"></span>
              <span className="ml-2 px-2 py-0.5 rounded bg-[#F3F4F6] border border-[#E5E7EB] text-[10px] font-mono font-bold uppercase tracking-wider text-[#4B5563]">
                CONTRATISTAS
              </span>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <button
              onClick={() => setLang(lang === 'es' ? 'en' : 'es')}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-[#D1D5DB] text-xs font-bold text-[#374151] hover:bg-[#F3F4F6] transition-all"
            >
              <Globe className="w-4 h-4 text-[#1E40AF]" />
              <span>{lang === 'es' ? 'English' : 'Español'}</span>
            </button>

            <a
              href={getWhatsAppLink()}
              target="_blank"
              rel="noopener noreferrer"
              className="hidden sm:inline-flex items-center gap-2 px-5 py-2.5 rounded-lg bg-[#25D366] text-white text-xs font-extrabold tracking-wide uppercase hover:bg-[#20ba5a] shadow-sm transition-all"
            >
              <MessageSquare className="w-4 h-4" />
              WhatsApp Directo
            </a>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative pt-16 pb-20 px-6 overflow-hidden border-b border-[#E5E7EB] bg-white">
        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          <div className="lg:col-span-7 space-y-6">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded bg-[#FEF9C3] border border-[#FDE047] text-[#854D0E] text-xs font-mono font-black tracking-wider uppercase">
              <span className="w-2 h-2 rounded-full bg-[#EAB308] animate-ping" />
              {t.badge}
            </div>

            <h1 className="text-4xl sm:text-6xl font-black tracking-tight text-[#111827] leading-[1.08]">
              {t.headlineMain}{' '}
              <span className="text-[#1E40AF] underline decoration-[#EAB308] decoration-4 underline-offset-8">
                {t.headlineSub}
              </span>
            </h1>

            <p className="text-lg text-[#4B5563] font-normal leading-relaxed max-w-2xl">
              {t.description}
            </p>

            <div className="flex flex-col sm:flex-row gap-4 pt-4">
              <a
                href={getWhatsAppLink()}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center gap-3 px-8 py-4 rounded-xl bg-[#1E40AF] text-white text-base font-bold hover:bg-[#1e3a8a] shadow-lg shadow-blue-900/10 transition-all group"
              >
                <MessageSquare className="w-5 h-5 text-[#EAB308]" />
                {t.ctaPrimary}
                <ArrowUpRight className="w-4 h-4 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
              </a>

              <a
                href="#calculator"
                className="inline-flex items-center justify-center gap-2 px-6 py-4 rounded-xl bg-[#F3F4F6] text-[#111827] border border-[#D1D5DB] text-base font-bold hover:bg-[#E5E7EB] transition-all"
              >
                <Calculator className="w-5 h-5 text-[#4B5563]" />
                {t.ctaSecondary}
              </a>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 pt-8 border-t border-[#E5E7EB]">
              {t.metrics.map((m, i) => (
                <div key={i} className="p-3 bg-[#F9FAFB] rounded-lg border border-[#E5E7EB]">
                  <div className="text-2xl font-black font-mono text-[#111827]">{m.value}</div>
                  <div className="text-[11px] font-bold text-[#6B7280] uppercase tracking-wider mt-0.5">{m.label}</div>
                </div>
              ))}
            </div>
          </div>

          <div className="lg:col-span-5 bg-[#111827] p-6 rounded-2xl border border-[#374151] text-white shadow-2xl space-y-6">
            <div className="flex items-center justify-between border-b border-[#374151] pb-4">
              <div className="flex items-center gap-2">
                <Hammer className="w-5 h-5 text-[#EAB308]" />
                <span className="font-mono text-xs font-bold uppercase tracking-widest text-[#9CA3AF]">
                  Master Project Pipeline
                </span>
              </div>
              <span className="text-[10px] font-mono bg-[#065F46] text-[#34D399] px-2 py-0.5 rounded border border-[#059669]">
                QBO DEPOSIT SYNC
              </span>
            </div>

            <div className="space-y-3 font-mono text-xs">
              <div className="p-3 bg-[#1F2937] rounded-lg border-l-4 border-l-[#EAB308]">
                <div className="text-[#9CA3AF]">DOB PERMIT RADAR · QUEENS</div>
                <div className="text-white font-bold mt-1">31-28 30th Ave, Astoria · Gut Rehab</div>
                <div className="text-[#EAB308] text-[10px] mt-1">✓ WhatsApp Toque 1 enviado: $85,000</div>
              </div>

              <div className="p-3 bg-[#1F2937] rounded-lg border-l-4 border-l-[#3B82F6]">
                <div className="text-[#9CA3AF]">COTIZACIÓN EN REVISIÓN · BROOKLYN</div>
                <div className="text-white font-bold mt-1">142 Bedford Ave · Storefront Framing</div>
                <div className="text-[#60A5FA] text-[10px] mt-1">✓ Presupuesto $120,000 en revisión</div>
              </div>

              <div className="p-3 bg-[#064E3B] rounded-lg border-l-4 border-l-[#10B981]">
                <div className="text-[#6EE7B7]">DEPÓSITO COBRADO (QUICKBOOKS)</div>
                <div className="text-white font-bold mt-1">Anticipo 30% Pagado: $25,500.00</div>
                <div className="text-[#A7F3D0] text-[10px] mt-1">✓ Comisión Socio (8%): $6,800.00</div>
              </div>
            </div>

            <div className="pt-2 text-center text-[11px] text-[#9CA3AF]">
              ✓ Cero hardware POS · 100% Depósitos Bancarios
            </div>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-20 px-6 max-w-7xl mx-auto">
        <div className="text-center max-w-3xl mx-auto mb-16 space-y-3">
          <h2 className="text-3xl font-black text-[#111827]">{t.featuresTitle}</h2>
          <p className="text-base text-[#6B7280]">
            Sin software innecesario: solo llamadas y cotizaciones de alto margen.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {t.features.map((f, i) => {
            const Icon = f.icon;
            return (
              <div key={i} className="bg-white p-8 rounded-2xl border border-[#E5E7EB] hover:border-[#1E40AF] transition-all shadow-sm">
                <div className="w-12 h-12 rounded-xl bg-[#EFF6FF] text-[#1E40AF] flex items-center justify-center mb-6">
                  <Icon className="w-6 h-6" />
                </div>
                <h3 className="text-lg font-bold text-[#111827] mb-2">{f.title}</h3>
                <p className="text-sm text-[#4B5563] leading-relaxed">{f.desc}</p>
              </div>
            );
          })}
        </div>
      </section>

      {/* Calculator */}
      <section id="calculator" className="py-20 bg-[#F3F4F6] border-y border-[#E5E7EB]">
        <div className="max-w-4xl mx-auto px-6">
          <CommissionSimulator lang={lang} />
        </div>
      </section>

      {/* Guarantee & Footer */}
      <footer className="bg-[#111827] text-white py-16 px-6">
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
          <div>
            <div className="flex items-center gap-2 text-2xl font-black text-white mb-4">
              <span>Socio</span>
              <span className="w-1.5 h-1.5 rounded-[1px] bg-[#EAB308] ml-[1.5px] self-end mb-1 inline-block" />
              <span className="text-xs font-mono text-[#9CA3AF] ml-2">NYC CONSTRUCTION PARTNER</span>
            </div>
            <h4 className="text-xl font-bold text-[#F3F4F6] mb-2">{t.guaranteeTitle}</h4>
            <p className="text-sm text-[#9CA3AF] leading-relaxed max-w-md">
              {t.guaranteeDesc}
            </p>
          </div>

          <div className="flex flex-col sm:flex-row gap-4 justify-end">
            <a
              href={getWhatsAppLink()}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center gap-3 px-8 py-4 rounded-xl bg-[#25D366] text-white font-black text-sm uppercase hover:bg-[#20ba5a] transition-all shadow-lg"
            >
              <MessageSquare className="w-5 h-5" />
              Hablar con un Operador en NYC
            </a>
          </div>
        </div>
      </footer>
    </div>
  );
}
