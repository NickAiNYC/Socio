'use client';

import React from 'react';
import Link from 'next/link';
import { 
  Flower2, 
  Search, 
  FileText, 
  MessageSquare, 
  Receipt, 
  ShieldCheck, 
  ArrowRight, 
  CheckCircle2, 
  Building2,
  CalendarCheck,
  Percent,
  Sparkles
} from 'lucide-react';

export default function FloristasComoFuncionaPage() {
  const waLink = 'https://wa.me/19175550199?text=Hola%20Socio,%20quiero%20conocer%20c%C3%B3mo%20funciona%20el%20sistema%20para%20mi%20florister%C3%ADa.';

  return (
    <div className="min-h-screen bg-[#FCFBF7] text-[#1F2937] font-sans selection:bg-[#E11D48] selection:text-white pb-24">
      {/* Rose Top Bar */}
      <div className="h-2 w-full bg-gradient-to-r from-[#E11D48] via-[#F43F5E] to-[#F59E0B]" />

      {/* Navigation */}
      <header className="sticky top-0 z-50 bg-white/95 backdrop-blur-md border-b border-rose-100 shadow-sm">
        <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
          <Link href="/floristas" className="flex items-center text-2xl font-black tracking-tight text-slate-900 group">
            <span>Socio</span>
            <span className="w-1.5 h-1.5 rounded-[1px] bg-[#E11D48] inline-block shadow-[0_0_8px_rgba(225,29,72,0.8)] ml-[1.5px] self-end mb-1" />
            <span className="ml-2.5 px-2.5 py-0.5 rounded-full bg-rose-50 border border-rose-200 text-[10px] font-mono font-bold uppercase tracking-wider text-rose-700">
              FLORISTAS
            </span>
          </Link>

          <nav className="hidden md:flex items-center gap-6 text-xs font-bold uppercase tracking-wider text-slate-600">
            <Link href="/floristas/como-funciona" className="text-[#E11D48]">Cómo Funciona</Link>
            <Link href="/floristas/casos-de-exito" className="hover:text-[#E11D48] transition-colors">Casos de Éxito</Link>
            <Link href="/floristas/radar-floral" className="hover:text-[#E11D48] transition-colors">Radar Floral</Link>
            <Link href="/floristas/preguntas-frecuentes" className="hover:text-[#E11D48] transition-colors">Preguntas</Link>
          </nav>

          <a
            href={waLink}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#25D366] text-white text-xs font-black tracking-wide uppercase hover:bg-[#20ba5a] shadow-sm transition-all"
          >
            <MessageSquare className="w-4 h-4" />
            <span>Hablar por WhatsApp</span>
          </a>
        </div>
      </header>

      {/* Hero */}
      <section className="py-16 px-6 bg-white border-b border-rose-100">
        <div className="max-w-4xl mx-auto text-center space-y-4">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-rose-50 border border-rose-200 text-rose-800 text-xs font-mono font-black uppercase">
            <Sparkles className="w-3.5 h-3.5 text-[#E11D48]" />
            <span>ARQUITECTURA OPERATIVA EN 4 PASOS</span>
          </div>
          <h1 className="text-4xl sm:text-5xl font-black text-slate-950 tracking-tight">
            Cómo Funciona Socio para Floristas en NYC
          </h1>
          <p className="text-slate-600 text-base sm:text-lg max-w-2xl mx-auto leading-relaxed">
            De la detección de pedidos corporativos y bodas hasta la conciliación automática en su terminal POS. Cero riesgo, sin cuotas fijas y con liquidación condicionada al cobro real.
          </p>
        </div>
      </section>

      {/* 4 Steps */}
      <section className="py-20 px-6 max-w-5xl mx-auto space-y-16">
        
        {/* Step 1 */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-center">
          <div className="md:col-span-2 text-center md:text-left">
            <div className="w-16 h-16 rounded-2xl bg-rose-50 border-2 border-rose-200 flex items-center justify-center text-2xl font-black text-[#E11D48] mx-auto md:mx-0">
              01
            </div>
          </div>
          <div className="md:col-span-10 space-y-2">
            <h3 className="text-2xl font-black text-slate-900">Escaneo de Fugas & Demanda Floral Local</h3>
            <p className="text-slate-600 text-sm leading-relaxed">
              Analizamos las cotizaciones no cerradas en su floristería (clientes que consultaron pero no confirmaron) y rastreamos hoteles, restaurantes y oficinas en su zona postal que requieren arreglos florales recurrentes.
            </p>
            <div className="inline-flex items-center gap-2 text-xs font-mono text-rose-700 bg-rose-50 px-3 py-1 rounded-md border border-rose-200">
              <span>Tiempo de ejecución: 48 horas · Costo: $0.00</span>
            </div>
          </div>
        </div>

        {/* Step 2 */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-center">
          <div className="md:col-span-2 text-center md:text-left">
            <div className="w-16 h-16 rounded-2xl bg-rose-50 border-2 border-rose-200 flex items-center justify-center text-2xl font-black text-[#E11D48] mx-auto md:mx-0">
              02
            </div>
          </div>
          <div className="md:col-span-10 space-y-2">
            <h3 className="text-2xl font-black text-slate-900">Acuerdo Simple de 1 Página (Cero Costo Inicial)</h3>
            <p className="text-slate-600 text-sm leading-relaxed">
              Firma un acuerdo transparente sin mensualidades ni compromisos a largo plazo. Establecemos la comisión por tramos (8% retail / 5% B2B corporativo) y fijamos el <strong>Tope Anual Protegido de $15,000</strong>.
            </p>
            <div className="inline-flex items-center gap-2 text-xs font-mono text-emerald-700 bg-emerald-50 px-3 py-1 rounded-md border border-emerald-200">
              <span>Garantía: Tasa 0% al superar el tope anual</span>
            </div>
          </div>
        </div>

        {/* Step 3 */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-center">
          <div className="md:col-span-2 text-center md:text-left">
            <div className="w-16 h-16 rounded-2xl bg-rose-50 border-2 border-rose-200 flex items-center justify-center text-2xl font-black text-[#E11D48] mx-auto md:mx-0">
              03
            </div>
          </div>
          <div className="md:col-span-10 space-y-2">
            <h3 className="text-2xl font-black text-slate-900">Asistente WhatsApp Concierge &quot;Rosa&quot; (&lt;90s)</h3>
            <p className="text-slate-600 text-sm leading-relaxed">
              Nuestra asistente atiende consultas 24/7 en WhatsApp, envía fotos de su catálogo, gestiona preferencias florales y confirma pedidos de bodas o suscripciones B2B antes de que el cliente busque otra floristería.
            </p>
            <div className="inline-flex items-center gap-2 text-xs font-mono text-rose-700 bg-rose-50 px-3 py-1 rounded-md border border-rose-200">
              <span>Respuesta inmediata en español e inglés</span>
            </div>
          </div>
        </div>

        {/* Step 4 */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-center">
          <div className="md:col-span-2 text-center md:text-left">
            <div className="w-16 h-16 rounded-2xl bg-rose-50 border-2 border-rose-200 flex items-center justify-center text-2xl font-black text-[#E11D48] mx-auto md:mx-0">
              04
            </div>
          </div>
          <div className="md:col-span-10 space-y-2">
            <h3 className="text-2xl font-black text-slate-900">Liquidación Vinculada al Cobro Real en POS</h3>
            <p className="text-slate-600 text-sm leading-relaxed">
              La comisión se dispara únicamente cuando el pago del cliente se acredita en su Square, Clover, Shopify POS, Stripe o cuenta bancaria. Si el cliente cancela o rechaza el pedido, usted paga $0.00.
            </p>
            <div className="inline-flex items-center gap-2 text-xs font-mono text-emerald-700 bg-emerald-50 px-3 py-1 rounded-md border border-emerald-200">
              <span>Conciliación transparente y automática</span>
            </div>
          </div>
        </div>

      </section>

      {/* Social Proof Strip */}
      <section className="py-12 bg-white border-y border-rose-100">
        <div className="max-w-5xl mx-auto px-6 text-center space-y-4">
          <div className="text-xs font-mono font-bold text-slate-400 uppercase tracking-widest">
            Floristerías y Diseñadores que Confían en Socio en los 5 Boroughs
          </div>
          <div className="flex flex-wrap justify-center items-center gap-6 sm:gap-10 font-mono text-xs font-black text-slate-700">
            <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-rose-50 border border-rose-200">
              <Flower2 className="w-4 h-4 text-[#E11D48]" />
              <span>FLORES DE MANHATTAN</span>
            </div>
            <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-rose-50 border border-rose-200">
              <Flower2 className="w-4 h-4 text-[#E11D48]" />
              <span>ROSA & OLIVO BOTANICAL (BK)</span>
            </div>
            <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-rose-50 border border-rose-200">
              <Flower2 className="w-4 h-4 text-[#E11D48]" />
              <span>JARDÍN DE QUEENS FLORAL</span>
            </div>
            <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-rose-50 border border-rose-200">
              <Flower2 className="w-4 h-4 text-[#E11D48]" />
              <span>EL PATIO FLORAL (BX)</span>
            </div>
          </div>
        </div>
      </section>

      {/* Sticky Bottom Bar */}
      <div className="fixed bottom-0 left-0 right-0 z-50 bg-slate-900/95 backdrop-blur-md border-t border-slate-800 p-4 shadow-2xl">
        <div className="max-w-5xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="text-xs text-slate-300 font-mono text-center sm:text-left">
            <span className="font-bold text-white">Escaneo Floral Gratuito:</span> Detectamos pedidos corporativos y bodas en su zona postal.
          </div>
          <a
            href={waLink}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl bg-[#E11D48] text-white text-xs font-black uppercase tracking-wider hover:bg-[#BE123C] shadow-lg transition-all shrink-0"
          >
            <span>📋 Obtén tu diagnóstico floral gratuito → WhatsApp</span>
          </a>
        </div>
      </div>

    </div>
  );
}
