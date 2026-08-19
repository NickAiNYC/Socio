import type { Metadata } from 'next';
import Link from 'next/link';
import { 
  Building2, 
  Hammer, 
  MessageSquare, 
  TrendingUp, 
  CheckCircle2, 
  ShieldCheck,
  Award,
  HardHat
} from 'lucide-react';

export const metadata: Metadata = {
  title: 'Casos de Éxito de Contratistas en NYC | Socio',
  description: 'Descubra cómo contratistas de Framing, Remodelación, Roofing, Masonry y Plomería en Queens, Brooklyn y el Bronx aumentaron sus contratos con Socio.',
};

export default function CasosDeExitoPage() {
  const waLink = 'https://wa.me/19175550199?text=Hola%20Socio,%20vi%20los%20casos%20de%20%C3%A9xito%20de%20contratistas%20y%20quiero%20evaluar%20mi%20empresa.';

  const cases = [
    {
      trade: 'Framing & Drywall',
      company: 'Hector Framing & Drywall Corp',
      location: 'Astoria, Queens',
      scope: 'Remodelación de 2 Pisos (Framing + Sheetrock)',
      contractValue: 85000,
      depositCleared: 25500,
      commissionPaid: 3075,
      netRetained: 81925,
      vector: 'Reactivación de Presupuestos Viejos',
      before: 'Perdía 8 llamadas/mes por estar en la obra. Cero seguimiento a presupuestos viejos en libreta.',
      after: '2 contratos reactivados en 14 días. $110,000 en obras adicionales cerradas.',
    },
    {
      trade: 'Full Gut Remodeling',
      company: 'Vargas General Contracting',
      location: 'Crown Heights, Brooklyn',
      scope: 'Brownstone Gut Rehab & Estructura Metálica',
      contractValue: 140000,
      depositCleared: 42000,
      commissionPaid: 4450,
      netRetained: 135550,
      vector: 'Radar de Permisos DOB NOW',
      before: 'Dependía 100% de recomendaciones lentas y agencias que cobraban $2,000/mes sin resultados.',
      after: 'Asignación directa de permisos DOB NOW. Anticipo cobrado y acreditado en 7 días.',
    },
    {
      trade: 'Roofing & Waterproofing',
      company: 'Mendoza Roofing & Siding',
      location: 'South Bronx, NYC',
      scope: 'Techo Comercial de EPDM & Aislamiento',
      contractValue: 62000,
      depositCleared: 18600,
      commissionPaid: 2500,
      netRetained: 59500,
      vector: 'Velocidad de Respuesta <90s',
      before: 'Presupuestos congelados por falta de respuesta rápida a dueños de edificios comerciales.',
      after: 'Respuesta en <90s por WhatsApp. Cierre del contrato en primera visita técnica.',
    },
    {
      trade: 'Masonry & Concrete Additions',
      company: 'Castillo Masonry & Concrete Corp',
      location: 'Corona, Queens',
      scope: 'Ampliación de Cimientos y Muros de Contención DOB',
      contractValue: 115000,
      depositCleared: 34500,
      commissionPaid: 3825,
      netRetained: 111175,
      vector: 'Radar DOB Filtro >$35k',
      before: 'Competía en precios bajos contra cuadrillas informales en Marketplace.',
      after: 'Ganó 4 permisos DOB de ampliación sin GC asignado en Queens en 45 días.',
    },
    {
      trade: 'Custom Millwork & Carpentry',
      company: 'Navarro Millwork & Framing',
      location: 'Sunset Park, Brooklyn',
      scope: 'Carpintería Fina y Gabinetes para Edificio Multifamiliar',
      contractValue: 92000,
      depositCleared: 27600,
      commissionPaid: 3250,
      netRetained: 88750,
      vector: 'Reactivación Asistente María',
      before: 'Libreta de papel con 19 presupuestos viejos acumulados durante 2023 y 2024.',
      after: 'María reactivó 3 clientes inactivos. Generó $92k en proyectos sin gastar $1 en publicidad.',
    },
    {
      trade: 'Plumbing & Mechanical',
      company: 'Alvarez Plumbing & Heating LLC',
      location: 'Mott Haven, Bronx',
      scope: 'Instalación de Calderas y Tubería de Gas Comercial',
      contractValue: 68000,
      depositCleared: 20400,
      commissionPaid: 2650,
      netRetained: 65350,
      vector: 'Nodo de Proveedores (Lumber Yard Pro-Desk)',
      before: 'Esperaba llamadas de administradores de edificios sin canal de prospección proactivo.',
      after: 'Referido directo a través del Pro-Desk de Feldman Lumber con código QR de Socio.',
    },
  ];

  return (
    <div className="min-h-screen bg-[#F9FAFB] text-[#111827] font-sans selection:bg-[#FF5500] selection:text-white pb-24">
      
      {/* Hazard Top Bar */}
      <div className="h-2 w-full bg-gradient-to-r from-[#EAB308] via-[#FF5500] to-[#EAB308]" />

      {/* Nav */}
      <header className="sticky top-0 z-50 bg-white/95 backdrop-blur-md border-b border-[#E5E7EB] shadow-sm">
        <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
          <Link href="/" className="flex items-center text-2xl font-black tracking-tight text-[#111827] group">
            <span>Socio</span>
            <span className="w-1.5 h-1.5 rounded-[1px] bg-[#FF5500] inline-block shadow-[0_0_8px_rgba(255,85,0,0.8)] ml-[1.5px] self-end mb-1" />
            <span className="ml-2.5 px-2.5 py-0.5 rounded-full bg-orange-50 border border-orange-200 text-[10px] font-mono font-bold uppercase tracking-wider text-orange-700">
              CONTRATISTAS
            </span>
          </Link>

          <nav className="hidden md:flex items-center gap-6 text-xs font-bold uppercase tracking-wider text-slate-600">
            <Link href="/contratistas" className="hover:text-[#FF5500] transition-colors">Inicio</Link>
            <Link href="/contratistas/como-funciona" className="hover:text-[#FF5500] transition-colors">Cómo Funciona</Link>
            <Link href="/contratistas/casos-de-exito" className="text-[#FF5500]">Casos de Éxito</Link>
            <Link href="/contratistas/radar-de-permisos" className="hover:text-[#FF5500] transition-colors">Radar DOB</Link>
            <Link href="/contratistas/preguntas-frecuentes" className="hover:text-[#FF5500] transition-colors">Preguntas</Link>
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
      <section className="py-16 md:py-20 px-6 bg-white border-b border-slate-200">
        <div className="max-w-4xl mx-auto text-center space-y-4">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-orange-50 border border-orange-200 text-orange-800 text-xs font-mono font-black uppercase">
            <span>Resultados Verificados</span>
          </div>
          <h1 className="text-4xl md:text-5xl font-black text-slate-900 tracking-tight">
            Casos Reales de Contratistas en NYC
          </h1>
          <p className="text-base md:text-lg text-slate-600 max-w-2xl mx-auto leading-relaxed">
            Resultados comprobados con depósitos bancarios reales en QuickBooks. Cero estimaciones infladas ni falsas promesas.
          </p>
        </div>
      </section>

      {/* Social Proof Badges Strip */}
      <section className="bg-slate-900 text-white py-6 px-6 border-b border-slate-800">
        <div className="max-w-6xl mx-auto space-y-3 text-center">
          <div className="text-xs font-mono text-slate-400 uppercase tracking-wider font-bold">
            Empresas y Cuadrillas que Confían en Socio en los 5 Boroughs:
          </div>
          <div className="flex flex-wrap items-center justify-center gap-6 text-xs font-mono text-slate-200">
            <span className="px-3 py-1.5 bg-slate-800 rounded-lg border border-slate-700 font-bold flex items-center gap-2">
              <HardHat className="w-4 h-4 text-[#FF5500]" /> Hector Framing Corp (Queens)
            </span>
            <span className="px-3 py-1.5 bg-slate-800 rounded-lg border border-slate-700 font-bold flex items-center gap-2">
              <HardHat className="w-4 h-4 text-[#FF5500]" /> Vargas GC (Brooklyn)
            </span>
            <span className="px-3 py-1.5 bg-slate-800 rounded-lg border border-slate-700 font-bold flex items-center gap-2">
              <HardHat className="w-4 h-4 text-[#FF5500]" /> Mendoza Roofing (Bronx)
            </span>
            <span className="px-3 py-1.5 bg-slate-800 rounded-lg border border-slate-700 font-bold flex items-center gap-2">
              <HardHat className="w-4 h-4 text-[#FF5500]" /> Castillo Masonry (Queens)
            </span>
            <span className="px-3 py-1.5 bg-slate-800 rounded-lg border border-slate-700 font-bold flex items-center gap-2">
              <HardHat className="w-4 h-4 text-[#FF5500]" /> Navarro Millwork (Brooklyn)
            </span>
            <span className="px-3 py-1.5 bg-slate-800 rounded-lg border border-slate-700 font-bold flex items-center gap-2">
              <HardHat className="w-4 h-4 text-[#FF5500]" /> Alvarez Mechanical (Bronx)
            </span>
          </div>
        </div>
      </section>

      {/* Case Studies Grid */}
      <section className="py-20 px-6 max-w-6xl mx-auto space-y-12">
        {cases.map((c, i) => (
          <div key={i} className="bg-white rounded-2xl p-8 md:p-10 border border-slate-200 shadow-sm space-y-8">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-100 pb-6">
              <div>
                <div className="flex items-center gap-2">
                  <span className="px-3 py-1 rounded-full bg-orange-50 text-[#FF5500] border border-orange-200 text-xs font-mono font-bold uppercase">
                    {c.trade} · {c.location}
                  </span>
                  <span className="px-2.5 py-0.5 rounded-full bg-blue-50 text-blue-700 border border-blue-200 text-[10px] font-mono font-bold">
                    {c.vector}
                  </span>
                </div>
                <h3 className="text-2xl font-black text-slate-900 mt-2">{c.company}</h3>
                <p className="text-xs text-slate-500 font-mono mt-0.5">{c.scope}</p>
              </div>

              <div className="text-right">
                <div className="text-xs font-mono text-slate-400 uppercase">Valor del Contrato</div>
                <div className="text-3xl font-black font-mono text-[#FF5500]">
                  ${c.contractValue.toLocaleString()}
                </div>
              </div>
            </div>

            {/* Financial Ledger Breakdown */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="p-4 bg-slate-50 rounded-xl border border-slate-200">
                <div className="text-[11px] text-slate-500 font-bold uppercase">Anticipo Cobrado (30%)</div>
                <div className="text-2xl font-black font-mono text-slate-900 mt-1">
                  ${c.depositCleared.toLocaleString()}
                </div>
                <div className="text-[10px] text-emerald-600 font-bold mt-1">✓ Acreditado en cuenta comercial</div>
              </div>

              <div className="p-4 bg-orange-50/60 rounded-xl border border-orange-200">
                <div className="text-[11px] text-orange-950 font-bold uppercase">Comisión Socio (Piloto 50% Desc)</div>
                <div className="text-2xl font-black font-mono text-[#FF5500] mt-1">
                  ${c.commissionPaid.toLocaleString()}
                </div>
                <div className="text-[10px] text-orange-800 font-medium mt-1">✓ Facturada solo tras depósito</div>
              </div>

              <div className="p-4 bg-emerald-50 rounded-xl border border-emerald-200">
                <div className="text-[11px] text-emerald-900 font-bold uppercase">Neto para el Contratista</div>
                <div className="text-2xl font-black font-mono text-emerald-700 mt-1">
                  ${c.netRetained.toLocaleString()}
                </div>
                <div className="text-[10px] text-emerald-800 font-bold mt-1">✓ Fondos para materiales y cuadrilla</div>
              </div>
            </div>

            {/* Before vs After */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-2 text-xs leading-relaxed">
              <div className="p-5 bg-red-50/60 rounded-xl border border-red-200 space-y-1">
                <div className="font-bold text-red-900 uppercase font-mono">Antes de Socio:</div>
                <p className="text-slate-700">{c.before}</p>
              </div>

              <div className="p-5 bg-emerald-50/60 rounded-xl border border-emerald-200 space-y-1">
                <div className="font-bold text-emerald-900 uppercase font-mono">Con Socio:</div>
                <p className="text-slate-700">{c.after}</p>
              </div>
            </div>
          </div>
        ))}
      </section>

      {/* Floating WhatsApp CTA */}
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
