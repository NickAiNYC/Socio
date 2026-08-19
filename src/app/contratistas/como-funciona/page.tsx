import type { Metadata } from 'next';
import Link from 'next/link';
import { 
  ScanSearch, 
  FileSignature, 
  Bot, 
  ReceiptCheck, 
  ArrowRight, 
  ShieldCheck, 
  MessageSquare,
  Building2,
  CheckCircle2
} from 'lucide-react';

export const metadata: Metadata = {
  title: 'Cómo Funciona | Socio para Contratistas NYC',
  description: 'Conozca el proceso paso a paso de adquisición de contratos de construcción en NYC: Escaneo de Fugas, Acuerdo en 1 Página, Asistente WhatsApp y Cobro contra Depósito Bancario en QuickBooks.',
};

export default function ComoFuncionaPage() {
  const waLink = 'https://wa.me/19175550199?text=Hola%20Socio,%20quiero%20conocer%20m%C3%A1s%20sobre%20c%C3%B3mo%20funciona%20el%20sistema%20de%20adquisici%C3%B3n%20para%20contratistas.';

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
            <Link href="/contratistas/como-funciona" className="text-[#FF5500]">Cómo Funciona</Link>
            <Link href="/contratistas/casos-de-exito" className="hover:text-[#FF5500] transition-colors">Casos de Éxito</Link>
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
            <span>Mecánica Operativa</span>
          </div>
          <h1 className="text-4xl md:text-5xl font-black text-slate-900 tracking-tight">
            El Proceso de 4 Pasos de Socio
          </h1>
          <p className="text-base md:text-lg text-slate-600 max-w-2xl mx-auto leading-relaxed">
            Sin mensualidades fijas. Sin falsas promesas. Solo pagas una comisión justa cuando el cliente deposita el anticipo en tu cuenta bancaria.
          </p>
        </div>
      </section>

      {/* 4 Steps Grid */}
      <section className="py-20 px-6 max-w-6xl mx-auto space-y-12">
        
        {/* Step 1 */}
        <div className="bg-white rounded-2xl p-8 md:p-10 border border-slate-200 shadow-sm grid grid-cols-1 md:grid-cols-12 gap-8 items-center">
          <div className="md:col-span-4 flex flex-col items-start gap-4">
            <div className="w-14 h-14 rounded-2xl bg-orange-50 border border-orange-200 text-[#FF5500] flex items-center justify-center font-black text-xl font-mono">
              01
            </div>
            <h3 className="text-2xl font-black text-slate-900">Escaneo de Fugas 48h</h3>
            <span className="text-xs font-mono text-emerald-600 bg-emerald-50 px-2.5 py-1 rounded-full font-bold">
              100% GRATUITO · SIN COMPROMISO
            </span>
          </div>
          <div className="md:col-span-8 space-y-3 text-slate-600 text-sm leading-relaxed">
            <p>
              Analizamos su presencia en Google Maps, velocidad de respuesta a llamadas perdidas y permisos de construcción recientes en su zona (Queens, Brooklyn, Bronx o Manhattan).
            </p>
            <p>
              Le entregamos un informe de 1 página que muestra exactamente cuántos contratos y dólares está perdiendo frente a competidores que responden en menos de 90 segundos.
            </p>
          </div>
        </div>

        {/* Step 2 */}
        <div className="bg-white rounded-2xl p-8 md:p-10 border border-slate-200 shadow-sm grid grid-cols-1 md:grid-cols-12 gap-8 items-center">
          <div className="md:col-span-4 flex flex-col items-start gap-4">
            <div className="w-14 h-14 rounded-2xl bg-orange-50 border border-orange-200 text-[#FF5500] flex items-center justify-center font-black text-xl font-mono">
              02
            </div>
            <h3 className="text-2xl font-black text-slate-900">Acuerdo de Piloto en 1 Página</h3>
            <span className="text-xs font-mono text-orange-800 bg-orange-50 px-2.5 py-1 rounded-full font-bold">
              50% DESCUENTO EN COMISIÓN
            </span>
          </div>
          <div className="md:col-span-8 space-y-3 text-slate-600 text-sm leading-relaxed">
            <p>
              Firmamos un acuerdo simple y transparente sin letras pequeñas:
            </p>
            <ul className="space-y-1.5 font-medium text-slate-800">
              <li className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
                <span>$0.00 de costo de activación o mensualidad.</span>
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
                <span>Comisión reducida de piloto: 6% (&lt;$10k), 4% ($10k–$50k), 2.5% (&gt;$50k).</span>
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
                <span>Tope Máximo Anual de $40,000 (después de este límite, comisión es 0%).</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Step 3 */}
        <div className="bg-white rounded-2xl p-8 md:p-10 border border-slate-200 shadow-sm grid grid-cols-1 md:grid-cols-12 gap-8 items-center">
          <div className="md:col-span-4 flex flex-col items-start gap-4">
            <div className="w-14 h-14 rounded-2xl bg-orange-50 border border-orange-200 text-[#FF5500] flex items-center justify-center font-black text-xl font-mono">
              03
            </div>
            <h3 className="text-2xl font-black text-slate-900">Activación de IA & Leads</h3>
            <span className="text-xs font-mono text-blue-800 bg-blue-50 px-2.5 py-1 rounded-full font-bold">
              WHATSAPP EN TIEMPO REAL
            </span>
          </div>
          <div className="md:col-span-8 space-y-3 text-slate-600 text-sm leading-relaxed">
            <p>
              Nuestra asistente &quot;María&quot; reactiva sus presupuestos viejos no cerrados y nuestro Radar de Permisos DOB conecta llamadas entrantes de propietarios en su zona.
            </p>
            <p>
              Usted recibe los datos del cliente calificado en su WhatsApp en menos de 90 segundos. Va a la obra, toma medidas y envía el presupuesto.
            </p>
          </div>
        </div>

        {/* Step 4 */}
        <div className="bg-white rounded-2xl p-8 md:p-10 border border-slate-200 shadow-sm grid grid-cols-1 md:grid-cols-12 gap-8 items-center">
          <div className="md:col-span-4 flex flex-col items-start gap-4">
            <div className="w-14 h-14 rounded-2xl bg-orange-50 border border-orange-200 text-[#FF5500] flex items-center justify-center font-black text-xl font-mono">
              04
            </div>
            <h3 className="text-2xl font-black text-slate-900">Liquidación contra Depósito</h3>
            <span className="text-xs font-mono text-emerald-800 bg-emerald-50 px-2.5 py-1 rounded-full font-bold">
              LA REGLA DE ORO DE SOCIO
            </span>
          </div>
          <div className="md:col-span-8 space-y-3 text-slate-600 text-sm leading-relaxed">
            <p>
              Cuando el cliente deposita el anticipo del 20–30% en su cuenta bancaria comercial verificada por QuickBooks, el sistema genera la liquidación de comisión de Socio con desglose transparente.
            </p>
            <p className="font-bold text-slate-900">
              Si el cliente no paga o la obra se cancela, usted paga exactamente $0.00.
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
