import type { Metadata } from 'next';
import Link from 'next/link';
import { 
  Store, 
  Percent, 
  QrCode, 
  MessageSquare, 
  CheckCircle2, 
  ShieldCheck,
  TrendingUp,
  DollarSign
} from 'lucide-react';

export const metadata: Metadata = {
  title: 'Alianza para Ferreterías de NYC | Programa de Referidos Socio',
  description: 'Gane un 1% de comisión recurrente en cada compra de materiales y contrato cerrado refiriendo a sus contratistas de confianza a Socio.',
};

export default function FerreteriasPage() {
  const waLink = 'https://wa.me/19175550199?text=Hola%20Socio,%20tengo%20una%20ferreter%C3%ADa%20en%20NYC%20y%20quiero%20conocer%20el%20programa%20del%201%25%20de%20referidos.';

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
              PROVEEDORES
            </span>
          </Link>

          <nav className="hidden md:flex items-center gap-6 text-xs font-bold uppercase tracking-wider text-slate-600">
            <Link href="/proveedores/ferreterias" className="text-[#FF5500]">Ferreterías</Link>
            <Link href="/proveedores/materiales" className="hover:text-[#FF5500] transition-colors">Materiales & Maderas</Link>
            <Link href="/proveedores/equipos" className="hover:text-[#FF5500] transition-colors">Renta de Equipos</Link>
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
            <Store className="w-3.5 h-3.5 text-[#FF5500]" />
            <span>Programa Exclusivo para Ferreterías en NYC</span>
          </div>
          <h1 className="text-4xl md:text-5xl font-black text-slate-900 tracking-tight">
            Ayuda a tus Contratistas a Ganar Más Obras. <br />
            <span className="text-[#FF5500]">Gana 1% en Comisión y Materiales.</span>
          </h1>
          <p className="text-base md:text-lg text-slate-600 max-w-2xl mx-auto leading-relaxed">
            Coloca tarjetas con código QR exclusivo de Socio en tu mostrador. Cuando tus clientes contratistas cierran obras con nuestra tecnología, tu ferretería recibe el 1% del valor total del contrato más la lealtad en la compra de sus materiales.
          </p>
        </div>
      </section>

      {/* 3 Steps for Hardware Stores */}
      <section className="py-20 px-6 max-w-5xl mx-auto space-y-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          
          <div className="bg-white p-8 rounded-2xl border border-slate-200 shadow-sm space-y-4">
            <div className="w-12 h-12 rounded-xl bg-orange-50 text-[#FF5500] flex items-center justify-center font-bold font-mono">
              01
            </div>
            <h3 className="text-xl font-bold text-slate-900">Tarjetas QR en Mostrador</h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              Le entregamos un dispensador acrílico con tarjetas QR personalizadas con el código de su tienda.
            </p>
          </div>

          <div className="bg-white p-8 rounded-2xl border border-slate-200 shadow-sm space-y-4">
            <div className="w-12 h-12 rounded-xl bg-orange-50 text-[#FF5500] flex items-center justify-center font-bold font-mono">
              02
            </div>
            <h3 className="text-xl font-bold text-slate-900">El Contratista Escanea</h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              El contratista obtiene su Escaneo de Fugas gratis y activa la asistente María para reactivar sus presupuestos.
            </p>
          </div>

          <div className="bg-white p-8 rounded-2xl border border-slate-200 shadow-sm space-y-4">
            <div className="w-12 h-12 rounded-xl bg-orange-50 text-[#FF5500] flex items-center justify-center font-bold font-mono">
              03
            </div>
            <h3 className="text-xl font-bold text-slate-900">Cobro Directo 1%</h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              Al acreditarse el depósito bancario de la obra, Socio envía su pago del 1% a su cuenta bancaria comercial o crédito en tienda.
            </p>
          </div>

        </div>

        {/* Math Example */}
        <div className="bg-slate-900 text-white rounded-2xl p-8 md:p-10 border border-slate-800 space-y-6">
          <div className="text-xs font-mono text-yellow-400 uppercase font-bold">
            Ejemplo Económico para Mostrador de Ferretería:
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 font-mono">
            <div className="p-4 bg-slate-950 rounded-xl border border-slate-800">
              <div className="text-[11px] text-slate-400">Contrato del Contratista:</div>
              <div className="text-2xl font-bold text-white mt-1">$85,000</div>
            </div>
            <div className="p-4 bg-slate-950 rounded-xl border border-slate-800">
              <div className="text-[11px] text-slate-400">Venta Estimada de Pintura/Herramientas:</div>
              <div className="text-2xl font-bold text-emerald-400 mt-1">$8,500</div>
            </div>
            <div className="p-4 bg-slate-950 rounded-xl border border-slate-800">
              <div className="text-[11px] text-slate-400">Comisión Socio (1% Kickback):</div>
              <div className="text-2xl font-bold text-[#FF5500] mt-1">$850.00</div>
            </div>
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
          <span>Solicitar Tarjetas para mi Tienda</span>
        </a>
      </div>

    </div>
  );
}
