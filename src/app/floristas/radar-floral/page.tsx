'use client';

import React from 'react';
import Link from 'next/link';
import { 
  Flower2, 
  Sparkles, 
  MessageSquare, 
  Radar, 
  ShieldCheck, 
  ArrowRight, 
  CheckCircle2, 
  Building2,
  Calendar,
  Eye,
  Zap,
  Hotel
} from 'lucide-react';

interface EventRadarItem {
  id: string;
  source: string;
  location: string;
  type: string;
  budget: string;
  status: string;
  action: string;
}

const RADAR_FEED: EventRadarItem[] = [
  {
    id: 'NYC-EVT-9821',
    source: 'Registro de Eventos Manhattan',
    location: 'SoHo Grand Hotel · 310 W Broadway',
    type: 'Suscripción Semanal Lobby & Suites',
    budget: '$1,400 / semana ($5,600/mes)',
    status: 'Sin Proveedor Exclusivo',
    action: 'Cotización WhatsApp enviada por Rosa (48s)'
  },
  {
    id: 'NYC-WED-4102',
    source: 'Registro de Bodas Brooklyn',
    location: 'The Green Building · Gowanus, BK',
    type: 'Decoración Floral Boda (120 Pax)',
    budget: '$7,200.00',
    status: 'Anticipo Requerido',
    action: 'Catálogo y Presupuesto enviado a la novia ✓'
  },
  {
    id: 'NYC-CORP-1094',
    source: 'Procurement Oficinas Midtown',
    location: 'One Vanderbilt · Midtown East',
    type: 'Gala Anual Corporativa Tech',
    budget: '$11,500.00',
    status: 'Aprobación Pendiente',
    action: 'Propuesta de Centros de Mesa entregada'
  },
  {
    id: 'NYC-EVT-7740',
    source: 'Permisos de Eventos DUMBO',
    location: '26 Bridge St · DUMBO, Brooklyn',
    type: 'Lanzamiento de Marca de Moda',
    budget: '$4,800.00',
    status: 'Confirmado',
    action: 'Pago procesado en terminal Stripe ✓'
  },
  {
    id: 'NYC-REST-3319',
    source: 'Asociación de Restaurantes NYC',
    location: 'Astoria Boulevard · Queens',
    type: 'Arreglos Florales Semanales Comedor',
    budget: '$650 / semana ($2,600/mes)',
    status: 'Activo',
    action: 'Floristería local conectada directamente'
  }
];

export default function FloristasRadarFloralPage() {
  const waLink = 'https://wa.me/19175550199?text=Hola%20Socio,%20quiero%20conectar%20mi%20florister%C3%ADa%20al%20Radar%20Floral%20de%20NYC.';

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
            <Link href="/floristas/casos-de-exito" className="hover:text-[#E11D48] transition-colors">Casos de Éxito</Link>
            <Link href="/floristas/radar-floral" className="text-[#E11D48]">Radar Floral</Link>
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
            <Radar className="w-3.5 h-3.5 text-[#E11D48] animate-pulse" />
            <span>SISTEMA DE INTELIGENCIA DE EVENTOS FLORALES</span>
          </div>
          <h1 className="text-4xl sm:text-5xl font-black text-slate-950 tracking-tight">
            Radar Floral en Tiempo Real (NYC)
          </h1>
          <p className="text-slate-600 text-base sm:text-lg max-w-2xl mx-auto leading-relaxed">
            Monitoreamos permisos de eventos de la ciudad, registros de bodas en venues exclusivos y calendarios de compras de hoteles para conectar a su floristería con pedidos de alto presupuesto antes que su competencia.
          </p>
        </div>
      </section>

      {/* Live HUD Component */}
      <section className="py-8 px-6 bg-slate-900 text-white border-y border-slate-800">
        <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-6 font-mono text-xs">
          <div className="flex items-center gap-3 p-3 bg-slate-800/80 rounded-xl border border-slate-700">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-ping shrink-0" />
            <div>
              <div className="text-slate-400">Eventos & Bodas Hoy:</div>
              <div className="text-sm font-black text-emerald-400">14 Oportunidades Activas</div>
            </div>
          </div>

          <div className="flex items-center gap-3 p-3 bg-slate-800/80 rounded-xl border border-slate-700">
            <Hotel className="w-4 h-4 text-rose-400 shrink-0" />
            <div>
              <div className="text-slate-400">Hoteles Buscando Proveedor:</div>
              <div className="text-sm font-black text-rose-400">3 Lobbies en Manhattan</div>
            </div>
          </div>

          <div className="flex items-center gap-3 p-3 bg-slate-800/80 rounded-xl border border-slate-700">
            <Zap className="w-4 h-4 text-amber-400 shrink-0" />
            <div>
              <div className="text-slate-400">Filtro de Rentabilidad:</div>
              <div className="text-sm font-black text-amber-400">Presupuestos &gt;$1,500</div>
            </div>
          </div>
        </div>
      </section>

      {/* Real-time Radar Table Simulation */}
      <section className="py-16 px-6 max-w-6xl mx-auto space-y-8">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b border-rose-200 pb-4">
          <div>
            <h2 className="text-2xl font-black text-slate-900">Feed de Demanda Floral en Vivo</h2>
            <p className="text-xs text-slate-500 font-mono">Actualizado continuamente desde registros de eventos y plataformas B2B</p>
          </div>
          <span className="text-xs font-mono font-bold px-3 py-1 rounded-full bg-rose-100 text-rose-800 border border-rose-200">
            🟢 CONEXIÓN EN VIVO
          </span>
        </div>

        <div className="bg-white rounded-3xl border border-rose-200 shadow-xl overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left font-mono text-xs">
              <thead className="bg-rose-50/70 border-b border-rose-200 text-slate-700">
                <tr>
                  <th className="p-4">ID & Ubicación</th>
                  <th className="p-4">Tipo de Contrato</th>
                  <th className="p-4">Presupuesto Estimado</th>
                  <th className="p-4">Estado</th>
                  <th className="p-4">Acción Automatizada</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {RADAR_FEED.map((item, idx) => (
                  <tr key={idx} className="hover:bg-rose-50/30 transition-colors">
                    <td className="p-4 font-bold text-slate-900">
                      <div className="text-[10px] text-rose-600 font-bold">{item.id}</div>
                      <div>{item.location}</div>
                    </td>
                    <td className="p-4 text-slate-700">{item.type}</td>
                    <td className="p-4 font-black text-slate-900">{item.budget}</td>
                    <td className="p-4">
                      <span className="px-2 py-0.5 rounded bg-slate-100 border border-slate-200 text-[10px] font-bold text-slate-700">
                        {item.status}
                      </span>
                    </td>
                    <td className="p-4 text-emerald-700 font-bold flex items-center gap-1.5">
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                      <span>{item.action}</span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
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
              <span>STATEN ISLAND FLORAL DESIGN</span>
            </div>
          </div>
        </div>
      </section>

      {/* Sticky Bottom Bar */}
      <div className="fixed bottom-0 left-0 right-0 z-50 bg-slate-900/95 backdrop-blur-md border-t border-slate-800 p-4 shadow-2xl">
        <div className="max-w-5xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="text-xs text-slate-300 font-mono text-center sm:text-left">
            <span className="font-bold text-white">Escaneo Floral Gratuito:</span> Conecte su floristería al radar de eventos en NYC.
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
