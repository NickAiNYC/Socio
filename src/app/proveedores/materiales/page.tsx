import type { Metadata } from 'next';
import Link from 'next/link';
import { 
  Truck, 
  Percent, 
  QrCode, 
  MessageSquare, 
  CheckCircle2, 
  ShieldCheck,
  Building2,
  Package
} from 'lucide-react';

export const metadata: Metadata = {
  title: 'Alianza para Proveedores de Materiales & Madereras NYC | Socio',
  description: 'Conecte a sus clientes de Drywall, Madera, Baldosa y Cemento al sistema de adquisición de obras de Socio y gane comisiones en cada contrato cerrado.',
};

export default function ProveedoresMaterialesPage() {
  const waLink = 'https://wa.me/19175550199?text=Hola%20Socio,%20tengo%20un%20patio%20de%20materiales/maderera%20en%20NYC%20y%20quiero%20conocer%20el%20programa%20para%20el%20Pro-Desk.';

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
              PRO-DESK
            </span>
          </Link>

          <nav className="hidden md:flex items-center gap-6 text-xs font-bold uppercase tracking-wider text-slate-600">
            <Link href="/proveedores/ferreterias" className="hover:text-[#FF5500] transition-colors">Ferreterías</Link>
            <Link href="/proveedores/materiales" className="text-[#FF5500]">Materiales & Maderas</Link>
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
            <Package className="w-3.5 h-3.5 text-[#FF5500]" />
            <span>Lumber Yards, Drywall & Tile Nodes · NYC</span>
          </div>
          <h1 className="text-4xl md:text-5xl font-black text-slate-900 tracking-tight">
            Multiplica la Venta de Materiales de tu Pro-Desk. <br />
            <span className="text-[#FF5500]">Sin Costo para tus Contratistas.</span>
          </h1>
          <p className="text-base md:text-lg text-slate-600 max-w-2xl mx-auto leading-relaxed">
            Los contratistas que ganan más obras compran más drywall, madera y cemento. Al asociar tu mostrador Pro-Desk con Socio, activas un flujo constante de pedidos de materiales asegurados con los depósitos bancarios de sus clientes.
          </p>
        </div>
      </section>

      {/* Pro-Desk Synergy */}
      <section className="py-20 px-6 max-w-5xl mx-auto space-y-12">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          
          <div className="bg-white p-8 rounded-2xl border border-slate-200 shadow-sm space-y-4">
            <h3 className="text-2xl font-black text-slate-900">1. Asegura la Venta del Material</h3>
            <p className="text-sm text-slate-600 leading-relaxed">
              Cuando el contratista gana una remodelación o estructura a través del Radar DOB de Socio, el presupuesto incluye el listado de materiales de tu patio como proveedor preferente.
            </p>
          </div>

          <div className="bg-white p-8 rounded-2xl border border-slate-200 shadow-sm space-y-4">
            <h3 className="text-2xl font-black text-slate-900">2. Kickback del 1% Liquidado en 48h</h3>
            <p className="text-sm text-slate-600 leading-relaxed">
              Cada vez que el contratista recibe su anticipo verificado en QuickBooks, tu mostrador Pro-Desk recibe el 1% del valor total de la obra liquidado en tu cuenta bancaria.
            </p>
          </div>

        </div>

        {/* Banner with kamco / feldman reference */}
        <div className="p-8 rounded-2xl bg-slate-900 text-white border border-slate-800 flex flex-col md:flex-row items-center justify-between gap-6">
          <div>
            <h4 className="text-xl font-bold">¿Tienes un Pro-Desk en Brooklyn, Queens o el Bronx?</h4>
            <p className="text-xs text-slate-400 mt-1">Integramos tu inventario y habilitamos códigos QR de mostrador en 24 horas.</p>
          </div>
          <a
            href={waLink}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-[#FF5500] text-white font-black text-xs uppercase hover:bg-[#E04B00] shadow-lg transition-all shrink-0"
          >
            <span>Activar Alianza Pro-Desk</span>
          </a>
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
          <span>WhatsApp para Patios de Materiales</span>
        </a>
      </div>

    </div>
  );
}
