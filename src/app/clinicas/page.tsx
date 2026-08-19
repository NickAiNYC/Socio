'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { 
  Stethoscope, 
  Sparkles, 
  MessageSquare, 
  ShieldCheck, 
  ArrowRight, 
  CheckCircle2, 
  UserCheck, 
  CalendarClock,
  HeartPulse
} from 'lucide-react';

export default function ClinicasPage() {
  const waLink = 'https://wa.me/19175550199?text=Hola%20Socio,%20tengo%20una%20cl%C3%ADnica%20est%C3%A9tica/dental%20en%20NYC%20y%20quiero%20reducir%20mis%20no-shows%20y%20aumentar%20tratamientos.';

  const [monthlyProcedures, setMonthlyProcedures] = useState<number>(45000);
  const [noShowReduction, setNoShowReduction] = useState<number>(12); // recovered appointments per month

  const recoveredRevenue = noShowReduction * 650; // avg $650 per procedure
  const totalVolume = monthlyProcedures + recoveredRevenue;
  // Tiered fee: 6% on high-ticket medical/aesthetic procedures ($25,000 annual cap)
  const monthlyFee = Math.min(totalVolume * 0.06, 2083);
  const netClinicRetained = totalVolume - monthlyFee;

  return (
    <div className="min-h-screen bg-[#F8FAFC] text-[#0F172A] font-sans selection:bg-[#0284C7] selection:text-white pb-24">
      
      {/* Cyan & Indigo Top Bar */}
      <div className="h-2 w-full bg-gradient-to-r from-[#0284C7] via-[#0EA5E9] to-[#6366F1]" />

      {/* Navigation */}
      <header className="sticky top-0 z-50 bg-white/95 backdrop-blur-md border-b border-sky-100 shadow-sm">
        <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
          <Link href="/" className="flex items-center text-2xl font-black tracking-tight text-slate-900 group">
            <span>Socio</span>
            <span className="w-1.5 h-1.5 rounded-[1px] bg-[#0284C7] inline-block shadow-[0_0_8px_rgba(2,132,199,0.8)] ml-[1.5px] self-end mb-1" />
            <span className="ml-2.5 px-2.5 py-0.5 rounded-full bg-sky-50 border border-sky-200 text-[10px] font-mono font-bold uppercase tracking-wider text-sky-800">
              CLÍNICAS
            </span>
          </Link>

          <nav className="hidden md:flex items-center gap-6 text-xs font-bold uppercase tracking-wider text-slate-600">
            <a href="#como-funciona" className="hover:text-[#0284C7] transition-colors">Cómo Funciona</a>
            <a href="#calculadora" className="hover:text-[#0284C7] transition-colors">Calculadora</a>
            <a href="#no-show-radar" className="hover:text-[#0284C7] transition-colors">Radar Anti-NoShow</a>
            <a href="#garantia" className="hover:text-[#0284C7] transition-colors">La Regla de Oro</a>
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
      <section className="py-16 md:py-24 px-6 bg-white border-b border-sky-100">
        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          
          <div className="lg:col-span-7 space-y-6">
            <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-sky-50 border border-sky-200 text-sky-900 text-xs font-mono font-black uppercase">
              <HeartPulse className="w-3.5 h-3.5 text-[#0284C7]" />
              <span>MEDSPAS, DENTALES & CLÍNICAS ESTÉTICAS · NYC</span>
            </div>

            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black text-slate-950 tracking-tight leading-[1.1]">
              Llene sus Sillones y Elimine los No-Shows. <br />
              <span className="text-[#0284C7] underline decoration-sky-200 decoration-4 underline-offset-8">
                Sin pagar por adelantado.
              </span>
            </h1>

            <p className="text-base sm:text-lg text-slate-600 font-normal leading-relaxed max-w-xl">
              Cada cita vacía en su clínica cuesta entre $300 y $2,500. Nuestra asistente WhatsApp reactiva pacientes inactivos y llena cancelaciones de último minuto en menos de 90 segundos. Solo cobramos comisión cuando el paciente asiste y paga su procedimiento.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 pt-2">
              <a
                href={waLink}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center gap-2.5 px-8 py-4 rounded-xl bg-[#0284C7] text-white font-black text-sm uppercase hover:bg-[#0369A1] shadow-lg shadow-sky-600/25 transition-all"
              >
                <span>Activar Escaneo de Citas Gratuito</span>
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
                <div className="text-xl font-black text-slate-900 font-sans">-78%</div>
                <div>Tasa de No-Shows</div>
              </div>
              <div>
                <div className="text-xl font-black text-slate-900 font-sans">&lt;90 seg</div>
                <div>Llenado de Cancelación</div>
              </div>
              <div>
                <div className="text-xl font-black text-sky-700 font-sans">$0.00</div>
                <div>Costo de Entrada</div>
              </div>
            </div>

          </div>

          {/* Right Card: Anti-NoShow Pipeline */}
          <div className="lg:col-span-5 bg-gradient-to-br from-sky-50 to-indigo-50 p-8 rounded-3xl border border-sky-200 shadow-xl space-y-6">
            <div className="flex items-center justify-between border-b border-sky-200 pb-3">
              <div className="flex items-center gap-2 text-sky-950 font-bold text-sm">
                <CalendarClock className="w-5 h-5 text-[#0284C7]" />
                <span>Radar Standby en Tiempo Real (Manhattan/Queens)</span>
              </div>
              <span className="text-[10px] font-mono font-bold bg-sky-200 text-sky-950 px-2 py-0.5 rounded">
                HIPAA SAFE
              </span>
            </div>

            <div className="space-y-3 font-mono text-xs">
              <div className="p-3.5 bg-white rounded-xl border border-sky-200 shadow-sm space-y-1">
                <div className="text-[10px] text-sky-700 font-bold uppercase">⚡ Cancelación de 2:00 PM Reasignada</div>
                <div className="font-bold text-slate-900">Tratamiento Láser Facial & Botox ($850)</div>
                <div className="text-slate-500">Paciente en lista de espera confirmó en 42s ✓</div>
              </div>

              <div className="p-3.5 bg-white rounded-xl border border-sky-200 shadow-sm space-y-1">
                <div className="text-[10px] text-emerald-700 font-bold uppercase">🦷 Implante Dental Reactivado</div>
                <div className="font-bold text-slate-900">Paciente Inactivo de 2024 Reagendado</div>
                <div className="text-slate-500">Presupuesto: $3,200 · Depósito Cobrado ✓</div>
              </div>
            </div>

            <div className="p-4 bg-white rounded-xl border border-sky-200 text-xs text-slate-600 space-y-1.5">
              <div className="font-bold text-slate-900 flex items-center gap-1.5">
                <ShieldCheck className="w-4 h-4 text-emerald-600" />
                <span>Tope Máximo Protegido ($25,000 / año)</span>
              </div>
              <p className="leading-relaxed">
                Su clínica nunca pagará más de $25,000 en comisiones anuales. Al alcanzar el tope, su comisión es 0.0%.
              </p>
            </div>
          </div>

        </div>
      </section>

      {/* Clinic Simulator */}
      <section id="calculadora" className="py-20 px-6 max-w-5xl mx-auto space-y-12">
        <div className="text-center space-y-3">
          <h2 className="text-3xl font-black text-slate-900">Simulador de Recuperación de Citas y Tratamientos</h2>
          <p className="text-slate-600 max-w-xl mx-auto text-sm">
            Comisiones vinculadas exclusivamente al dinero cobrado en su terminal de pagos o software clínico.
          </p>
        </div>

        <div className="bg-white p-8 md:p-10 rounded-3xl border border-sky-100 shadow-xl space-y-8">
          
          <div className="space-y-6">
            <div>
              <div className="flex justify-between items-center mb-2">
                <label className="text-sm font-bold text-slate-900">Facturación Mensual Actual:</label>
                <span className="text-xl font-black font-mono text-[#0284C7]">${monthlyProcedures.toLocaleString()}</span>
              </div>
              <input
                type="range"
                min="10000"
                max="150000"
                step="5000"
                value={monthlyProcedures}
                onChange={(e) => setMonthlyProcedures(Number(e.target.value))}
                className="w-full h-2.5 bg-sky-100 rounded-lg appearance-none cursor-pointer accent-[#0284C7]"
              />
            </div>

            <div>
              <div className="flex justify-between items-center mb-2">
                <label className="text-sm font-bold text-slate-900">Citas Vacías / No-Shows Recuperadas:</label>
                <span className="text-xl font-black font-mono text-[#0284C7]">{noShowReduction} Citas (+${recoveredRevenue.toLocaleString()}/mes)</span>
              </div>
              <input
                type="range"
                min="2"
                max="30"
                step="1"
                value={noShowReduction}
                onChange={(e) => setNoShowReduction(Number(e.target.value))}
                className="w-full h-2.5 bg-sky-100 rounded-lg appearance-none cursor-pointer accent-[#0284C7]"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 pt-6 border-t border-slate-100 font-mono">
            <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200">
              <div className="text-xs text-slate-500 uppercase font-bold">Volumen Total Mes</div>
              <div className="text-2xl font-black text-slate-900 mt-1">${totalVolume.toLocaleString()}</div>
            </div>

            <div className="p-4 bg-sky-50 rounded-2xl border border-sky-200">
              <div className="text-xs text-sky-950 uppercase font-bold">Comisión Socio (6%)</div>
              <div className="text-2xl font-black text-[#0284C7] mt-1">${Math.round(monthlyFee).toLocaleString()}</div>
            </div>

            <div className="p-4 bg-emerald-50 rounded-2xl border border-emerald-200">
              <div className="text-xs text-emerald-950 uppercase font-bold">Neto Clínica</div>
              <div className="text-2xl font-black text-emerald-700 mt-1">${Math.round(netClinicRetained).toLocaleString()}</div>
            </div>
          </div>

        </div>
      </section>

      {/* The Guarantee */}
      <section id="garantia" className="py-16 px-6 bg-slate-950 text-white border-t border-slate-800">
        <div className="max-w-5xl mx-auto flex flex-col md:flex-row items-center justify-between gap-8">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-2 px-2.5 py-0.5 rounded-full bg-sky-500/20 text-sky-400 text-xs font-mono font-bold">
              LA REGLA DE ORO DE SOCIO
            </div>
            <h3 className="text-2xl font-black">Cero Cobro si el Paciente no Asiste y Paga</h3>
            <p className="text-xs text-slate-400 max-w-xl leading-relaxed">
              Si un paciente cancela, no se presenta o no realiza su pago en caja, usted paga exactamente $0.00.
            </p>
          </div>

          <a
            href={waLink}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 px-8 py-4 rounded-xl bg-[#0284C7] text-white font-black text-xs uppercase hover:bg-[#0369A1] shadow-xl transition-all shrink-0"
          >
            <span>Hablar con un Asesor de Clínicas</span>
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
