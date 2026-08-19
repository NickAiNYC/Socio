'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { 
  HelpCircle, 
  ChevronDown, 
  MessageSquare, 
  ShieldCheck, 
  CheckCircle2 
} from 'lucide-react';

export default function PreguntasFrecuentesPage() {
  const waLink = 'https://wa.me/19175550199?text=Hola%20Socio,%20tengo%20una%20pregunta%20sobre%20el%20acuerdo%20de%20contratistas.';

  const [openIndex, setOpenIndex] = useState<number | null>(0);

  const faqs = [
    {
      q: '¿Qué pasa si el cliente cancela la obra o se atrasa en los pagos?',
      a: 'La Regla de Oro de Socio es estricta: solo cobramos comisión sobre dinero que efectivamente haya ingresado y se haya acreditado en su cuenta bancaria comercial verificada por QuickBooks. Si el cliente cancela, desaparece o no paga, usted nos debe exactamente $0.00.',
    },
    {
      q: '¿Por qué me piden fotos de mi libreta con presupuestos viejos? ¿Se los van a dar a otros contratistas?',
      a: 'Sus clientes son 100% suyos bajo contrato de confidencialidad legal en NYC. La asistente "María" se comunica en nombre de SU empresa ("María de parte de Don Hector"), no de Socio. Jamás compartimos sus presupuestos o contactos con otros contratistas.',
    },
    {
      q: '¿Cómo prueban que un cliente vino por Socio y no por mi propia cuenta?',
      a: 'Utilizamos coincidencia determinista de teléfono y correo electrónico. Cuando se emite un depósito en su QuickBooks, el sistema verifica si ese número de teléfono o correo ya existía en nuestro registro de capturas o si fue reactivado por María. Si el cliente ya era suyo y vino sin intervención nuestra, no hay comisión.',
    },
    {
      q: '¿Qué sucede exactamente cuando alcanzo el Tope Anual de $40,000?',
      a: 'En cuanto la suma acumulada de sus comisiones pagadas durante el año calendario alcance los $40,000 USD, la comisión cae automáticamente a 0.0%. A partir de ese momento, usted se queda con el 100% de los ingresos de todas sus obras por el resto del año.',
    },
    {
      q: '¿Tengo que pagar alguna mensualidad, tarifa de instalación o costo de software?',
      a: 'No. Cero costo de entrada, cero mensualidades y cero cargos por cotizaciones no cerradas. Nosotros invertimos en la tecnología y la prospección; solo ganamos cuando usted cobra dinero real en su banco.',
    },
    {
      q: '¿Cómo se conecta QuickBooks Online y qué permisos requiere?',
      a: 'La conexión se realiza en 1 clic mediante el protocolo oficial de Intuit QuickBooks OAuth 2.0. Socio solo lee el estado de facturas y depósitos cobrados para conciliar la comisión. No tenemos acceso para retirar fondos ni modificar sus cuentas.',
    },
  ];

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
            <Link href="/contratistas/radar-de-permisos" className="hover:text-[#FF5500] transition-colors">Radar DOB</Link>
            <Link href="/contratistas/preguntas-frecuentes" className="text-[#FF5500]">Preguntas</Link>
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
            <HelpCircle className="w-3.5 h-3.5 text-[#FF5500]" />
            <span>Transparencia Total</span>
          </div>
          <h1 className="text-4xl md:text-5xl font-black text-slate-900 tracking-tight">
            Preguntas Frecuentes de Contratistas
          </h1>
          <p className="text-base md:text-lg text-slate-600 max-w-2xl mx-auto leading-relaxed">
            Sin rodeos ni letra chica. Respuestas directas a las dudas más importantes antes de unirse al piloto.
          </p>
        </div>
      </section>

      {/* FAQ Accordion Section */}
      <section className="py-20 px-6 max-w-4xl mx-auto space-y-4">
        {faqs.map((f, i) => {
          const isOpen = openIndex === i;
          return (
            <div
              key={i}
              className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden transition-all"
            >
              <button
                onClick={() => setOpenIndex(isOpen ? null : i)}
                className="w-full p-6 text-left flex items-center justify-between gap-4 font-bold text-slate-900 text-base md:text-lg hover:text-[#FF5500] transition-colors"
              >
                <span>{f.q}</span>
                <ChevronDown
                  className={`w-5 h-5 text-slate-400 shrink-0 transition-transform duration-200 ${
                    isOpen ? 'rotate-180 text-[#FF5500]' : ''
                  }`}
                />
              </button>
              {isOpen && (
                <div className="px-6 pb-6 text-slate-600 text-sm leading-relaxed border-t border-slate-100 pt-4 bg-slate-50/50">
                  <p>{f.a}</p>
                </div>
              )}
            </div>
          );
        })}
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
