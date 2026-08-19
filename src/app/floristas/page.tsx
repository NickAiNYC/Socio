'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { 
  Flower2, 
  Sparkles, 
  MessageSquare, 
  ShieldCheck, 
  Calendar, 
  ArrowRight, 
  CheckCircle2, 
  Receipt,
  HeartHandshake,
  Store,
  Building,
  DollarSign
} from 'lucide-react';

export default function FloristasPage() {
  const waLink = 'https://wa.me/19175550199?text=Hola%20Socio,%20tengo%20una%20florister%C3%ADa%20en%20NYC%20y%20quiero%20aumentar%20mis%20pedidos%20y%20suscripciones%20B2B.';

  const [monthlyOrders, setMonthlyOrders] = useState<number>(35000);
  const [b2bCount, setB2bCount] = useState<number>(6);

  // Floral Commission Calculator: 8% on daily retail, 5% on recurring B2B subscriptions ($15k cap)
  const b2bMonthlyRevenue = b2bCount * 1200; // avg $1,200/mo per corporate account
  const totalVolume = monthlyOrders + b2bMonthlyRevenue;
  const retailFee = monthlyOrders * 0.08;
  const b2bFee = b2bMonthlyRevenue * 0.05;
  const totalFee = Math.min(retailFee + b2bFee, 1250); // monthly equivalent cap
  const retainedRevenue = totalVolume - totalFee;

  return (
    <div className="min-h-screen bg-[#FCFBF7] text-[#1F2937] font-sans selection:bg-[#E11D48] selection:text-white pb-24">
      
      {/* Rose & Gold Top Bar */}
      <div className="h-2 w-full bg-gradient-to-r from-[#E11D48] via-[#F43F5E] to-[#F59E0B]" />

      {/* Navigation */}
      <header className="sticky top-0 z-50 bg-white/95 backdrop-blur-md border-b border-rose-100 shadow-sm">
        <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
          <Link href="/" className="flex items-center text-2xl font-black tracking-tight text-slate-900 group">
            <span>Socio</span>
            <span className="w-1.5 h-1.5 rounded-[1px] bg-[#E11D48] inline-block shadow-[0_0_8px_rgba(225,29,72,0.8)] ml-[1.5px] self-end mb-1" />
            <span className="ml-2.5 px-2.5 py-0.5 rounded-full bg-rose-50 border border-rose-200 text-[10px] font-mono font-bold uppercase tracking-wider text-rose-700">
              FLORISTAS
            </span>
          </Link>

          <nav className="hidden md:flex items-center gap-6 text-xs font-bold uppercase tracking-wider text-slate-600">
            <a href="#como-funciona" className="hover:text-[#E11D48] transition-colors">Cómo Funciona</a>
            <a href="#calculadora" className="hover:text-[#E11D48] transition-colors">Calculadora</a>
            <a href="#b2b-radar" className="hover:text-[#E11D48] transition-colors">Radar B2B</a>
            <a href="#garantia" className="hover:text-[#E11D48] transition-colors">La Regla de Oro</a>
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
      <section className="py-16 md:py-24 px-6 bg-white border-b border-rose-100">
        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          
          <div className="lg:col-span-7 space-y-6">
            <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-rose-50 border border-rose-200 text-rose-800 text-xs font-mono font-black uppercase">
              <Sparkles className="w-3.5 h-3.5 text-[#E11D48]" />
              <span>SISTEMA DE ADQUISICIÓN FLORAL · NYC</span>
            </div>

            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black text-slate-950 tracking-tight leading-[1.1]">
              Más Pedidos Diarios y Suscripciones Corporativas. <br />
              <span className="text-[#E11D48] underline decoration-rose-200 decoration-4 underline-offset-8">
                Sin pagar por adelantado.
              </span>
            </h1>

            <p className="text-base sm:text-lg text-slate-600 font-normal leading-relaxed max-w-xl">
              Conectamos su floristería a hoteles, restaurantes, eventos y clientes minoristas en NYC. Nuestra asistente WhatsApp &quot;Rosa&quot; cierra pedidos y suscripciones en 90 segundos. Solo cobramos comisión cuando el pago se acredita en su POS o banco.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 pt-2">
              <a
                href={waLink}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center gap-2.5 px-8 py-4 rounded-xl bg-[#E11D48] text-white font-black text-sm uppercase hover:bg-[#BE123C] shadow-lg shadow-rose-600/25 transition-all"
              >
                <span>Activar Escaneo Floral Gratuito</span>
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
                <div className="text-xl font-black text-slate-900 font-sans">$1.8M+</div>
                <div>Ventas POS Conciliadas</div>
              </div>
              <div>
                <div className="text-xl font-black text-slate-900 font-sans">&lt;90 seg</div>
                <div>Respuesta WhatsApp</div>
              </div>
              <div>
                <div className="text-xl font-black text-rose-600 font-sans">$0.00</div>
                <div>Costo Inicial / Mensual</div>
              </div>
            </div>

          </div>

          {/* Right Card: The Floral Moat Mockup */}
          <div className="lg:col-span-5 bg-gradient-to-br from-rose-50 to-amber-50 p-8 rounded-3xl border border-rose-200/80 shadow-xl space-y-6">
            <div className="flex items-center justify-between border-b border-rose-200 pb-3">
              <div className="flex items-center gap-2 text-rose-900 font-bold text-sm">
                <Flower2 className="w-5 h-5 text-[#E11D48]" />
                <span>Radar Floral en Vivo (Manhattan & Brooklyn)</span>
              </div>
              <span className="text-[10px] font-mono font-bold bg-rose-200 text-rose-950 px-2 py-0.5 rounded">
                NYC RADAR
              </span>
            </div>

            <div className="space-y-3 font-mono text-xs">
              <div className="p-3.5 bg-white rounded-xl border border-rose-200 shadow-sm space-y-1">
                <div className="text-[10px] text-rose-600 font-bold uppercase">🏨 Suscripción Semanal Detectada</div>
                <div className="font-bold text-slate-900">Boutique Hotel en SoHo · Arreglos de Lobby</div>
                <div className="text-slate-500">$1,400 / mes ($350/semana) · 12 Meses</div>
              </div>

              <div className="p-3.5 bg-white rounded-xl border border-rose-200 shadow-sm space-y-1">
                <div className="text-[10px] text-emerald-600 font-bold uppercase">💍 Boda Confirmada en DUMBO</div>
                <div className="font-bold text-slate-900">Decoración Floral & Centros de Mesa</div>
                <div className="text-slate-500">Presupuesto: $6,500 · Anticipo Acreditado ✓</div>
              </div>
            </div>

            <div className="p-4 bg-white rounded-xl border border-rose-200 text-xs text-slate-600 space-y-1.5">
              <div className="font-bold text-slate-900 flex items-center gap-1.5">
                <ShieldCheck className="w-4 h-4 text-emerald-600" />
                <span>Tope Máximo Protegido ($15,000 / año)</span>
              </div>
              <p className="leading-relaxed">
                Una vez alcanzado el tope anual de comisiones, la tasa cae automáticamente a 0.0% para el resto del año.
              </p>
            </div>
          </div>

        </div>
      </section>

      {/* Interactive Simulator */}
      <section id="calculadora" className="py-20 px-6 max-w-5xl mx-auto space-y-12">
        <div className="text-center space-y-3">
          <h2 className="text-3xl font-black text-slate-900">Simulador de Ingresos y Comisión Floral</h2>
          <p className="text-slate-600 max-w-xl mx-auto text-sm">
            Comisiones justas vinculadas exclusivamente a transacciones cobradas en su terminal POS o cuenta bancaria.
          </p>
        </div>

        <div className="bg-white p-8 md:p-10 rounded-3xl border border-rose-100 shadow-xl space-y-8">
          
          <div className="space-y-6">
            <div>
              <div className="flex justify-between items-center mb-2">
                <label className="text-sm font-bold text-slate-900">Venta Mensual Minorista (Ramos & Eventos):</label>
                <span className="text-xl font-black font-mono text-[#E11D48]">${monthlyOrders.toLocaleString()}</span>
              </div>
              <input
                type="range"
                min="5000"
                max="100000"
                step="2500"
                value={monthlyOrders}
                onChange={(e) => setMonthlyOrders(Number(e.target.value))}
                className="w-full h-2.5 bg-rose-100 rounded-lg appearance-none cursor-pointer accent-[#E11D48]"
              />
            </div>

            <div>
              <div className="flex justify-between items-center mb-2">
                <label className="text-sm font-bold text-slate-900">Cuentas Corporativas / Hoteles B2B:</label>
                <span className="text-xl font-black font-mono text-[#E11D48]">{b2bCount} Cuentas (${b2bMonthlyRevenue.toLocaleString()}/mes)</span>
              </div>
              <input
                type="range"
                min="0"
                max="20"
                step="1"
                value={b2bCount}
                onChange={(e) => setB2bCount(Number(e.target.value))}
                className="w-full h-2.5 bg-rose-100 rounded-lg appearance-none cursor-pointer accent-[#E11D48]"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 pt-6 border-t border-slate-100 font-mono">
            <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200">
              <div className="text-xs text-slate-500 uppercase font-bold">Volumen Total Mes</div>
              <div className="text-2xl font-black text-slate-900 mt-1">${totalVolume.toLocaleString()}</div>
            </div>

            <div className="p-4 bg-rose-50 rounded-2xl border border-rose-200">
              <div className="text-xs text-rose-950 uppercase font-bold">Comisión Socio (8% / 5%)</div>
              <div className="text-2xl font-black text-[#E11D48] mt-1">${Math.round(totalFee).toLocaleString()}</div>
            </div>

            <div className="p-4 bg-emerald-50 rounded-2xl border border-emerald-200">
              <div className="text-xs text-emerald-950 uppercase font-bold">Neto Floristería</div>
              <div className="text-2xl font-black text-emerald-700 mt-1">${Math.round(retainedRevenue).toLocaleString()}</div>
            </div>
          </div>

        </div>
      </section>

      {/* The Socio Floral Guarantee */}
      <section id="garantia" className="py-16 px-6 bg-slate-950 text-white border-t border-slate-800">
        <div className="max-w-5xl mx-auto flex flex-col md:flex-row items-center justify-between gap-8">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-2 px-2.5 py-0.5 rounded-full bg-rose-500/20 text-rose-400 text-xs font-mono font-bold">
              LA REGLA DE ORO FLORAL
            </div>
            <h3 className="text-2xl font-black">Cero Cobro si el Pedido no se Entrega y Cobra</h3>
            <p className="text-xs text-slate-400 max-w-xl leading-relaxed">
              Si un cliente cancela, rechaza el ramo o el pago no se acredita en su terminal POS, usted paga $0.00. Cero cargos por suscripciones caídas o cotizaciones no cerradas.
            </p>
          </div>

          <a
            href={waLink}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 px-8 py-4 rounded-xl bg-[#E11D48] text-white font-black text-xs uppercase hover:bg-[#BE123C] shadow-xl transition-all shrink-0"
          >
            <span>Hablar con un Asesor Floral</span>
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
