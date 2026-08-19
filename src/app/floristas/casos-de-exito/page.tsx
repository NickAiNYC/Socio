'use client';

import React from 'react';
import Link from 'next/link';
import { 
  Flower2, 
  Sparkles, 
  MessageSquare, 
  Receipt, 
  ShieldCheck, 
  ArrowRight, 
  CheckCircle2, 
  Building2,
  CalendarCheck,
  TrendingUp,
  MapPin
} from 'lucide-react';

interface CaseStudy {
  name: string;
  location: string;
  type: string;
  contractValue: string;
  commission: string;
  netRetained: string;
  description: string;
  metric: string;
}

const CASE_STUDIES: CaseStudy[] = [
  {
    name: 'Flores de Manhattan',
    location: 'Midtown East, Manhattan',
    type: 'Suscripciones Corporativas B2B',
    contractValue: '$48,000.00',
    commission: '$2,400.00 (5%)',
    netRetained: '$45,600.00',
    description: '3 torres de oficinas en Park Ave contrataron arreglos florales semanales para recepción y salas ejecutivas tras activación con Asistente Rosa.',
    metric: '+12 Meses de Facturación Recurrente Asegurada'
  },
  {
    name: 'Rosa & Olivo Botanical',
    location: 'Williamsburg, Brooklyn',
    type: 'Bodas & Eventos Boutique',
    contractValue: '$32,500.00',
    commission: '$1,950.00 (6%)',
    netRetained: '$30,550.00',
    description: 'Captó 5 bodas de alto presupuesto en DUMBO y Greenpoint respondiendo cotizaciones en WhatsApp en menos de 60 segundos.',
    metric: '100% Anticipos Cobrados en Square'
  },
  {
    name: 'Jardín de Queens Floral',
    location: 'Astoria, Queens',
    type: 'Hoteles & Lobbies',
    contractValue: '$22,000.00',
    commission: '$1,100.00 (5%)',
    netRetained: '$20,900.00',
    description: 'Cerró contrato de abastecimiento semanal para 2 hoteles boutique en Long Island City sin pagar comisiones a plataformas intermediarias.',
    metric: 'Cero Días de Merma Floral'
  },
  {
    name: 'Bella Flora NYC',
    location: 'Upper West Side, Manhattan',
    type: 'Campaña San Valentín & Madres',
    contractValue: '$64,000.00',
    commission: '$3,840.00 (6%)',
    netRetained: '$60,160.00',
    description: 'Reactivó 420 clientes de su base de datos dormida con ofertas anticipadas por WhatsApp, agotando inventario antes de las fechas pico.',
    metric: '420 Pedidos Anticipados Pagados'
  },
  {
    name: 'El Patio Floral Studio',
    location: 'Mott Haven, South Bronx',
    type: 'Eventos Privados & Restaurantes',
    contractValue: '$18,500.00',
    commission: '$1,110.00 (6%)',
    netRetained: '$17,390.00',
    description: 'Asociación directa con 4 restaurantes del Bronx para centros de mesa de fin de semana y cenas de gala privadas.',
    metric: 'Liquidación Automática Stripe'
  },
  {
    name: 'Staten Island Floral Design',
    location: 'St. George, Staten Island',
    type: 'Servicios Funerarios & Conmemorativos',
    contractValue: '$27,000.00',
    commission: '$1,350.00 (5%)',
    netRetained: '$25,650.00',
    description: 'Canal prioritario de pedidos inmediatos gestionados por asistente virtual con entrega garantizada en el mismo día.',
    metric: 'Respuesta Promedio: 45 Segundos'
  }
];

export default function FloristasCasosDeExitoPage() {
  const waLink = 'https://wa.me/19175550199?text=Hola%20Socio,%20quiero%20conocer%20los%20casos%20de%20%C3%A9xito%20de%20florister%C3%ADas%20en%20NYC.';

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
            <Link href="/floristas/como-funciona" className="hover:text-[#E11D48] transition-colors">Cómo Funciona</Link>
            <Link href="/floristas/casos-de-exito" className="text-[#E11D48]">Casos de Éxito</Link>
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
            <span>RESULTADOS VERIFICADOS EN EL POS</span>
          </div>
          <h1 className="text-4xl sm:text-5xl font-black text-slate-950 tracking-tight">
            Casos Reales de Floristerías en NYC
          </h1>
          <p className="text-slate-600 text-base sm:text-lg max-w-2xl mx-auto leading-relaxed">
            Libros contables transparentes. Vea exactamente cuánto facturaron nuestros socios florales, la comisión liquidada tras el cobro y el dinero neto que quedó en su cuenta bancaria.
          </p>
        </div>
      </section>

      {/* 6 Case Studies Grid */}
      <section className="py-20 px-6 max-w-7xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {CASE_STUDIES.map((study, idx) => (
            <div key={idx} className="bg-white rounded-3xl border border-rose-100 p-7 shadow-lg hover:shadow-xl transition-all space-y-6 flex flex-col justify-between">
              
              <div className="space-y-3">
                <div className="flex items-center justify-between text-xs font-mono text-slate-500">
                  <div className="flex items-center gap-1.5 text-rose-700 font-bold">
                    <MapPin className="w-3.5 h-3.5" />
                    <span>{study.location}</span>
                  </div>
                  <span className="bg-rose-50 px-2 py-0.5 rounded text-[10px] text-rose-800 font-bold uppercase">{study.type}</span>
                </div>

                <h3 className="text-xl font-black text-slate-900">{study.name}</h3>
                <p className="text-xs text-slate-600 leading-relaxed">{study.description}</p>
              </div>

              {/* Financial Ledger Box */}
              <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 font-mono text-xs space-y-2">
                <div className="flex justify-between items-center text-slate-500">
                  <span>Facturado POS:</span>
                  <span className="font-bold text-slate-900">{study.contractValue}</span>
                </div>
                <div className="flex justify-between items-center text-rose-700">
                  <span>Comisión Socio:</span>
                  <span className="font-bold">-{study.commission}</span>
                </div>
                <div className="flex justify-between items-center pt-2 border-t border-slate-200 font-black text-emerald-700 text-sm">
                  <span>Neto Floristería:</span>
                  <span>{study.netRetained}</span>
                </div>
              </div>

              <div className="pt-1 text-[11px] font-mono text-slate-500 flex items-center gap-1.5 border-t border-slate-100">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                <span>{study.metric}</span>
              </div>

            </div>
          ))}
        </div>
      </section>

      {/* Social Proof Strip */}
      <section className="py-12 bg-white border-y border-rose-100">
        <div className="max-w-5xl mx-auto px-6 text-center space-y-4">
          <div className="text-xs font-mono font-bold text-slate-400 uppercase tracking-widest">
            Floristerías que Confían en Socio en los 5 Boroughs
          </div>
          <div className="flex flex-wrap justify-center items-center gap-6 font-mono text-xs font-black text-slate-700">
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
              <span>BELLA FLORA NYC</span>
            </div>
          </div>
        </div>
      </section>

      {/* Sticky Bottom Bar */}
      <div className="fixed bottom-0 left-0 right-0 z-50 bg-slate-900/95 backdrop-blur-md border-t border-slate-800 p-4 shadow-2xl">
        <div className="max-w-5xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="text-xs text-slate-300 font-mono text-center sm:text-left">
            <span className="font-bold text-white">Escaneo Floral Gratuito:</span> Conectamos su floristería con eventos y clientes B2B.
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
