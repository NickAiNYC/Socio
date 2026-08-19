'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { 
  UtensilsCrossed, 
  Sparkles, 
  MessageSquare, 
  ShieldCheck, 
  ArrowRight, 
  CheckCircle2, 
  Users, 
  TrendingUp,
  Building2,
  CalendarCheck2
} from 'lucide-react';

export default function RestaurantesPage() {
  const waLink = 'https://wa.me/19175550199?text=Hola%20Socio,%20tengo%20un%20restaurante%20en%20NYC%20y%20quiero%20aumentar%20mis%20eventos%20privados%20y%20catering%20corporativo.';

  const [cateringEvents, setCateringEvents] = useState<number>(4);
  const [avgTicket, setAvgTicket] = useState<number>(3500);

  const monthlyCateringVolume = cateringEvents * avgTicket;
  // Tiered commission: 8% on catering under $10k/event, 5% on buyouts >$10k ($20,000 annual cap)
  const monthlyFee = Math.min(monthlyCateringVolume * 0.07, 1666);
  const netRetained = monthlyCateringVolume - monthlyFee;

  return (
    <div className="min-h-screen bg-[#FDFBF7] text-[#1E293B] font-sans selection:bg-[#D97706] selection:text-white pb-24">
      
      {/* Warm Amber Top Bar */}
      <div className="h-2 w-full bg-gradient-to-r from-[#D97706] via-[#EA580C] to-[#B45309]" />

      {/* Navigation */}
      <header className="sticky top-0 z-50 bg-white/95 backdrop-blur-md border-b border-amber-100 shadow-sm">
        <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
          <Link href="/" className="flex items-center text-2xl font-black tracking-tight text-slate-900 group">
            <span>Socio</span>
            <span className="w-1.5 h-1.5 rounded-[1px] bg-[#D97706] inline-block shadow-[0_0_8px_rgba(217,119,6,0.8)] ml-[1.5px] self-end mb-1" />
            <span className="ml-2.5 px-2.5 py-0.5 rounded-full bg-amber-50 border border-amber-200 text-[10px] font-mono font-bold uppercase tracking-wider text-amber-800">
              RESTAURANTES
            </span>
          </Link>

          <nav className="hidden md:flex items-center gap-6 text-xs font-bold uppercase tracking-wider text-slate-600">
            <a href="#como-funciona" className="hover:text-[#D97706] transition-colors">Cómo Funciona</a>
            <a href="#calculadora" className="hover:text-[#D97706] transition-colors">Calculadora</a>
            <a href="#catering-radar" className="hover:text-[#D97706] transition-colors">Radar Catering</a>
            <a href="#garantia" className="hover:text-[#D97706] transition-colors">La Regla de Oro</a>
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

      {/* Hero Section */}
      <section className="py-16 md:py-24 px-6 bg-white border-b border-amber-100">
        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          
          <div className="lg:col-span-7 space-y-6">
            <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-amber-50 border border-amber-200 text-amber-900 text-xs font-mono font-black uppercase">
              <UtensilsCrossed className="w-3.5 h-3.5 text-[#D97706]" />
              <span>CATERING CORPORATIVO & EVENTOS PRIVADOS · NYC</span>
            </div>

            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black text-slate-950 tracking-tight leading-[1.1]">
              Llene sus Mesas y Gane Eventos de Alto Margen. <br />
              <span className="text-[#D97706] underline decoration-amber-200 decoration-4 underline-offset-8">
                Sin comisiones del 30% de apps de delivery.
              </span>
            </h1>

            <p className="text-base sm:text-lg text-slate-600 font-normal leading-relaxed max-w-xl">
              Conectamos su restaurante directamente con empresas, productoras de cine y organizadores de eventos en NYC. Nuestra asistente WhatsApp &quot;Camila&quot; responde cotizaciones de catering en menos de 90 segundos. Solo paga comisión cuando el anticipo se acredita en su Toast, Square o banco.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 pt-2">
              <a
                href={waLink}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center gap-2.5 px-8 py-4 rounded-xl bg-[#D97706] text-white font-black text-sm uppercase hover:bg-[#B45309] shadow-lg shadow-amber-600/25 transition-all"
              >
                <span>Activar Escaneo de Eventos Gratuito</span>
                <ArrowRight className="w-4 h-4" />
              </a>
              <a
                href="#calculadora"
                className="inline-flex items-center justify-center gap-2 px-6 py-4 rounded-xl bg-slate-100 text-slate-800 font-bold text-sm hover:bg-slate-200 transition-all"
              >
                <span>Simular Comisiones</span>
              </a>
            </div>

            <div className="grid grid-cols-3 gap-4 pt-4 border-t border-slate-100 text-xs font-mono text-slate-500">
              <div>
                <div className="text-xl font-black text-slate-900 font-sans">$3.2M+</div>
                <div>Catering Conciliado</div>
              </div>
              <div>
                <div className="text-xl font-black text-slate-900 font-sans">&lt;90 seg</div>
                <div>Tiempo de Respuesta</div>
              </div>
              <div>
                <div className="text-xl font-black text-amber-700 font-sans">$0.00</div>
                <div>Mensualidad Fija</div>
              </div>
            </div>

          </div>

          {/* Right Card: Catering Pipeline Demo */}
          <div className="lg:col-span-5 bg-gradient-to-br from-amber-50 to-orange-50 p-8 rounded-3xl border border-amber-200 shadow-xl space-y-6">
            <div className="flex items-center justify-between border-b border-amber-200 pb-3">
              <div className="flex items-center gap-2 text-amber-950 font-bold text-sm">
                <CalendarCheck2 className="w-5 h-5 text-[#D97706]" />
                <span>Radar de Eventos NYC (Toast / Square Sync)</span>
              </div>
              <span className="text-[10px] font-mono font-bold bg-amber-200 text-amber-950 px-2 py-0.5 rounded">
                LIVE LEADS
              </span>
            </div>

            <div className="space-y-3 font-mono text-xs">
              <div className="p-3.5 bg-white rounded-xl border border-amber-200 shadow-sm space-y-1">
                <div className="text-[10px] text-amber-700 font-bold uppercase">🏢 Almuerzo Corporativo (Fintech en Midtown)</div>
                <div className="font-bold text-slate-900">Catering Semanal para 85 Empleados</div>
                <div className="text-slate-500">$3,800 / semana ($15,200/mes) · Toast POS Cleared ✓</div>
              </div>

              <div className="p-3.5 bg-white rounded-xl border border-amber-200 shadow-sm space-y-1">
                <div className="text-[10px] text-emerald-700 font-bold uppercase">🎉 Buyout Completo de Fin de Semana</div>
                <div className="font-bold text-slate-900">Cena Privada de Empresa (50 Pax)</div>
                <div className="text-slate-500">Monto: $8,500.00 · Depósito 50% Acreditado ✓</div>
              </div>
            </div>

            <div className="p-4 bg-white rounded-xl border border-amber-200 text-xs text-slate-600 space-y-1.5">
              <div className="font-bold text-slate-900 flex items-center gap-1.5">
                <ShieldCheck className="w-4 h-4 text-emerald-600" />
                <span>Tope Máximo Protegido ($20,000 / año)</span>
              </div>
              <p className="leading-relaxed">
                Usted nunca pagará más de $20,000 en comisiones anuales. Al alcanzar el tope, su comisión es 0.0%.
              </p>
            </div>
          </div>

        </div>
      </section>

      {/* Catering Simulator */}
      <section id="calculadora" className="py-20 px-6 max-w-5xl mx-auto space-y-12">
        <div className="text-center space-y-3">
          <h2 className="text-3xl font-black text-slate-900">Simulador de Ingresos por Catering y Eventos</h2>
          <p className="text-slate-600 max-w-xl mx-auto text-sm">
            Comisiones por tramos transparentes vinculadas exclusivamente al dinero cobrado en su POS o cuenta bancaria.
          </p>
        </div>

        <div className="bg-white p-8 md:p-10 rounded-3xl border border-amber-100 shadow-xl space-y-8">
          
          <div className="space-y-6">
            <div>
              <div className="flex justify-between items-center mb-2">
                <label className="text-sm font-bold text-slate-900">Eventos de Catering / Mes:</label>
                <span className="text-xl font-black font-mono text-[#D97706]">{cateringEvents} Eventos</span>
              </div>
              <input
                type="range"
                min="1"
                max="20"
                step="1"
                value={cateringEvents}
                onChange={(e) => setCateringEvents(Number(e.target.value))}
                className="w-full h-2.5 bg-amber-100 rounded-lg appearance-none cursor-pointer accent-[#D97706]"
              />
            </div>

            <div>
              <div className="flex justify-between items-center mb-2">
                <label className="text-sm font-bold text-slate-900">Ticket Promedio por Evento:</label>
                <span className="text-xl font-black font-mono text-[#D97706]">${avgTicket.toLocaleString()}</span>
              </div>
              <input
                type="range"
                min="1000"
                max="15000"
                step="500"
                value={avgTicket}
                onChange={(e) => setAvgTicket(Number(e.target.value))}
                className="w-full h-2.5 bg-amber-100 rounded-lg appearance-none cursor-pointer accent-[#D97706]"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 pt-6 border-t border-slate-100 font-mono">
            <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200">
              <div className="text-xs text-slate-500 uppercase font-bold">Volumen Mensual</div>
              <div className="text-2xl font-black text-slate-900 mt-1">${monthlyCateringVolume.toLocaleString()}</div>
            </div>

            <div className="p-4 bg-amber-50 rounded-2xl border border-amber-200">
              <div className="text-xs text-amber-950 uppercase font-bold">Comisión Socio (~7%)</div>
              <div className="text-2xl font-black text-[#D97706] mt-1">${Math.round(monthlyFee).toLocaleString()}</div>
            </div>

            <div className="p-4 bg-emerald-50 rounded-2xl border border-emerald-200">
              <div className="text-xs text-emerald-950 uppercase font-bold">Neto Restaurante</div>
              <div className="text-2xl font-black text-emerald-700 mt-1">${Math.round(netRetained).toLocaleString()}</div>
            </div>
          </div>

        </div>
      </section>

      {/* The Guarantee */}
      <section id="garantia" className="py-16 px-6 bg-slate-950 text-white border-t border-slate-800">
        <div className="max-w-5xl mx-auto flex flex-col md:flex-row items-center justify-between gap-8">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-2 px-2.5 py-0.5 rounded-full bg-amber-500/20 text-amber-400 text-xs font-mono font-bold">
              LA REGLA DE ORO DE SOCIO
            </div>
            <h3 className="text-2xl font-black">Cero Cobro si el Evento no se Cobra en su POS</h3>
            <p className="text-xs text-slate-400 max-w-xl leading-relaxed">
              Si un cliente corporativo cancela o no deposita, usted paga $0.00. Cero cargos por cotizaciones no cerradas.
            </p>
          </div>

          <a
            href={waLink}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 px-8 py-4 rounded-xl bg-[#D97706] text-white font-black text-xs uppercase hover:bg-[#B45309] shadow-xl transition-all shrink-0"
          >
            <span>Hablar con un Asesor de Restaurantes</span>
            <ArrowRight className="w-4 h-4" />
          </a>
        </div>
      </section>

      {/* Floating WhatsApp FAB */}
      <div id="waFab" className="fixed bottom-6 right-6 z-50">
        <a
          href={waLink}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-3 px-5 py-3.5 rounded-full bg-[#25D366] text-white font-black text-sm uppercase shadow-2xl hover:bg-[#20ba5a] hover:scale-105 transition-all"
        >
          <MessageSquare className="w-5 h-5" />
          <span>Consultar por WhatsApp</span>
        </a>
      </div>

    </div>
  );
}
