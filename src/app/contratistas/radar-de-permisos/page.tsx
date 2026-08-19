import type { Metadata } from 'next';
import Link from 'next/link';
import { 
  Building2, 
  Search, 
  MessageSquare, 
  Zap, 
  ArrowRight, 
  ShieldCheck, 
  Radio,
  FileText
} from 'lucide-react';

export const metadata: Metadata = {
  title: 'Radar de Permisos DOB NYC | Socio para Contratistas',
  description: 'Descubra cómo Socio monitorea en tiempo real los permisos de construcción y remodelación emitidos por el DOB NOW de NYC para conectar contratistas con propietarios.',
};

export default function RadarDePermisosPage() {
  const waLink = 'https://wa.me/19175550199?text=Hola%20Socio,%20quiero%20conectar%20mi%20empresa%20al%20Radar%20de%20Permisos%20DOB%20de%20NYC.';

  return (
    <div className="min-h-screen bg-[#F9FAFB] text-[#111827] font-sans selection:bg-[#FF5500] selection:text-white">
      
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
            <Link href="/contratistas/casos-de-exito" className="hover:text-[#FF5500] transition-colors">Casos de Éxito</Link>
            <Link href="/contratistas/radar-de-permisos" className="text-[#FF5500]">Radar DOB</Link>
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
            <Radio className="w-3.5 h-3.5 text-[#FF5500] animate-pulse" />
            <span>Tecnología Propietaria NYC</span>
          </div>
          <h1 className="text-4xl md:text-5xl font-black text-slate-900 tracking-tight">
            El Radar de Permisos DOB NOW
          </h1>
          <p className="text-base md:text-lg text-slate-600 max-w-2xl mx-auto leading-relaxed">
            Ingestión en tiempo real de permisos de remodelación y obras mayores en Queens, Brooklyn, Bronx y Manhattan para capturar al cliente antes que nadie.
          </p>
        </div>
      </section>

      {/* Pipeline Diagram & Live Simulation */}
      <section className="py-20 px-6 max-w-6xl mx-auto space-y-12">
        
        {/* Step-by-step Transformation Card */}
        <div className="bg-slate-900 text-white rounded-2xl p-8 md:p-10 border border-slate-800 shadow-2xl space-y-8">
          <div className="flex items-center justify-between border-b border-slate-800 pb-4">
            <div className="flex items-center gap-2">
              <Zap className="w-5 h-5 text-yellow-400" />
              <span className="font-mono text-xs font-bold uppercase tracking-widest text-slate-300">
                Transformación en Vivo: Permiso DOB ➔ Lead de WhatsApp
              </span>
            </div>
            <span className="text-[10px] font-mono bg-emerald-950 text-emerald-400 px-2 py-0.5 rounded border border-emerald-700 font-bold">
              NYC OPENDATA STREAM ACTIVE
            </span>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            
            {/* Raw Permit Data */}
            <div className="bg-slate-950 p-6 rounded-xl border border-slate-800 space-y-4 font-mono text-xs">
              <div className="text-yellow-400 text-xs font-bold uppercase flex items-center gap-2">
                <FileText className="w-4 h-4" />
                <span>1. Permiso DOB Emitido Hoy (Queens)</span>
              </div>
              <div className="space-y-1.5 text-slate-300 bg-slate-900/60 p-4 rounded-lg border border-slate-800">
                <div><span className="text-slate-500">Job #:</span> 44029104-Q</div>
                <div><span className="text-slate-500">Address:</span> 31-28 30th Ave, Astoria, NY</div>
                <div><span className="text-slate-500">Owner:</span> Carlos Mendoza</div>
                <div><span className="text-slate-500">Work Type:</span> A2 - Full Interior Gut & Framing</div>
                <div><span className="text-slate-500">Est. Cost:</span> $85,000.00</div>
                <div><span className="text-slate-500">GC Status:</span> Unassigned / Owner-Filer</div>
              </div>
              <div className="text-[11px] text-slate-400">
                ⚡ Detectado por Socio 14 minutos tras ser publicado en el portal oficial del DOB.
              </div>
            </div>

            {/* Dispatched WhatsApp */}
            <div className="bg-slate-950 p-6 rounded-xl border border-slate-800 space-y-4 font-mono text-xs">
              <div className="text-emerald-400 text-xs font-bold uppercase flex items-center gap-2">
                <MessageSquare className="w-4 h-4" />
                <span>2. WhatsApp Desplegado al Propietario</span>
              </div>
              <div className="space-y-2 text-slate-200 bg-[#075E54]/30 p-4 rounded-lg border border-[#128C7E]/50 leading-relaxed">
                <p className="text-emerald-300">
                  &quot;Hola Don Carlos, le saluda Nick de Socio en NYC. Vimos su permiso de remodelación para 31-28 30th Ave en Astoria ($85,000). ¿Ya tiene contratista general asignado o le gustaría recibir presupuestos de nuestros maestros locales certificados? Cero costo por la consulta.&quot;
                </p>
              </div>
              <div className="text-[11px] text-emerald-400 font-bold">
                ✓ Propietario responde: &quot;Sí, necesito presupuesto para framing y plomería.&quot;
              </div>
            </div>

          </div>
        </div>

        {/* 3 Value Pillars */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="bg-white p-8 rounded-2xl border border-slate-200 shadow-sm space-y-3">
            <div className="w-12 h-12 rounded-xl bg-orange-50 text-[#FF5500] flex items-center justify-center font-bold">
              01
            </div>
            <h3 className="text-lg font-bold text-slate-900">Filtrado por Monto Alto</h3>
            <p className="text-sm text-slate-600 leading-relaxed">
              Filtramos proyectos residenciales y comerciales mayores a $30,000 para asegurar obras de alto margen para su cuadrilla.
            </p>
          </div>

          <div className="bg-white p-8 rounded-2xl border border-slate-200 shadow-sm space-y-3">
            <div className="w-12 h-12 rounded-xl bg-orange-50 text-[#FF5500] flex items-center justify-center font-bold">
              02
            </div>
            <h3 className="text-lg font-bold text-slate-900">Exclusión de GC Asignados</h3>
            <p className="text-sm text-slate-600 leading-relaxed">
              Aislamos únicamente permisos donde el propietario todavía no ha contratado a un General Contractor o registró la obra directamente.
            </p>
          </div>

          <div className="bg-white p-8 rounded-2xl border border-slate-200 shadow-sm space-y-3">
            <div className="w-12 h-12 rounded-xl bg-orange-50 text-[#FF5500] flex items-center justify-center font-bold">
              03
            </div>
            <h3 className="text-lg font-bold text-slate-900">Distribución Equitativa</h3>
            <p className="text-sm text-slate-600 leading-relaxed">
              Los leads se asignan por distrito (Queens, Brooklyn, Bronx, Manhattan) mediante Round-Robin para alimentar a nuestros contratistas por igual.
            </p>
          </div>
        </div>

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
