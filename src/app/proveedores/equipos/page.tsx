import type { Metadata } from 'next';
import Link from 'next/link';
import { 
  Wrench, 
  Percent, 
  QrCode, 
  MessageSquare, 
  CheckCircle2, 
  ShieldCheck,
  Building2,
  Cpu
} from 'lucide-react';

export const metadata: Metadata = {
  title: 'Alianza para Renta de Maquinaria y Equipos en NYC | Socio',
  description: 'Conecte su inventario de andamios, miniexcavadoras, compresores y herramientas pesadas con contratistas en activo en NYC.',
};

export default function ProveedoresEquiposPage() {
  const waLink = 'https://wa.me/19175550199?text=Hola%20Socio,%20tengo%20un%20negocio%20de%20renta%20de%20maquinaria/herramientas%20en%20NYC%20y%20quiero%20conocer%20el%20programa%20de%20alianzas.';

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
              EQUIPOS
            </span>
          </Link>

          <nav className="hidden md:flex items-center gap-6 text-xs font-bold uppercase tracking-wider text-slate-600">
            <Link href="/proveedores/ferreterias" className="hover:text-[#FF5500] transition-colors">Ferreterías</Link>
            <Link href="/proveedores/materiales" className="hover:text-[#FF5500] transition-colors">Materiales & Maderas</Link>
            <Link href="/proveedores/equipos" className="text-[#FF5500]">Renta de Equipos</Link>
            <Link href="/contratistas" className="hover:text-[#FF5500] transition-colors">Portal Contratistas</Link>
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
            <Wrench className="w-3.5 h-3.5 text-[#FF5500]" />
            <span>Heavy Machinery & Equipment Rental · NYC</span>
          </div>
          <h1 className="text-4xl md:text-5xl font-black text-slate-900 tracking-tight">
            Mantén tu Maquinaria en Renta. <br />
            <span className="text-[#FF5500]">Conectada a Obras DOB en Vivo.</span>
          </h1>
          <p className="text-base md:text-lg text-slate-600 max-w-2xl mx-auto leading-relaxed">
            Andamios, miniexcavadoras, generadores y compresores rentados directamente a los contratistas de Socio cuando inician obras aprobadas por el DOB en los 5 condados de Nueva York.
          </p>
        </div>
      </section>

      {/* Benefits */}
      <section className="py-20 px-6 max-w-5xl mx-auto space-y-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          
          <div className="bg-white p-8 rounded-2xl border border-slate-200 shadow-sm space-y-4">
            <h3 className="text-xl font-bold text-slate-900">Demanda Inmediata</h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              Detectamos permisos de excavación y fachadas para recomendar su catálogo de renta a los contratistas asignados.
            </p>
          </div>

          <div className="bg-white p-8 rounded-2xl border border-slate-200 shadow-sm space-y-4">
            <h3 className="text-xl font-bold text-slate-900">Cero Riesgo de Pago</h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              Los pagos de renta se garantizan directamente con los depósitos bancarios iniciales gestionados en QuickBooks.
            </p>
          </div>

          <div className="bg-white p-8 rounded-2xl border border-slate-200 shadow-sm space-y-4">
            <h3 className="text-xl font-bold text-slate-900">Comisión 1% de Referido</h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              Si un contratista llega a Socio a través de sus tarjetas en mostrador, usted recibe el 1% del contrato total.
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
          <span>WhatsApp para Renta de Equipos</span>
        </a>
      </div>

    </div>
  );
}
