'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { 
  HelpCircle, 
  ChevronDown, 
  MessageSquare, 
  ShieldCheck, 
  CheckCircle2,
  HardHat,
  ClipboardList
} from 'lucide-react';

export default function PreguntasFrecuentesPage() {
  const waLink = 'https://wa.me/19175550199?text=Hola%20Socio,%20tengo%20una%20pregunta%20espec%C3%ADfica%20sobre%20el%20acuerdo%20de%20contratistas.';

  const [openIndex, setOpenIndex] = useState<number | null>(0);

  const faqs = [
    {
      q: '¿Qué pasa si el propietario cancela el proyecto o detiene la obra?',
      a: 'La Regla de Oro de Socio es 100% estricta: solo cobramos comisión sobre dinero que efectivamente haya ingresado y se haya acreditado en su cuenta bancaria comercial verificada por QuickBooks. Si el cliente cancela la obra antes del anticipo, desaparece o congela el proyecto, usted nos debe exactamente $0.00. Cero penalidades, cero cargos por gestión.',
    },
    {
      q: '¿Cómo manejan los atrasos en pagos o contratos con pagos por hitos (Milestones)?',
      a: 'La comisión de Socio se divide y se liquida en sincronía exacta con los hitos reales que usted cobra. Si el cliente paga un 30% de anticipo, 30% a mitad de obra y 40% al finalizar la inspección, la comisión solo se calcula sobre cada depósito bancario individual una vez que los fondos están disponibles en su cuenta.',
    },
    {
      q: '¿Qué pasa si el cliente pide cambios de último minuto (Change Orders) o el monto sube/baja?',
      a: 'Los Change Orders se ingresan automáticamente en QuickBooks. Si el monto del contrato aumenta, la comisión sobre el adicional se calcula en el tramo correspondiente (con el 50% de descuento del piloto). Si el monto baja, su comisión total se reduce en proporción exacta. Nunca pagará comisión sobre trabajos no cobrados.',
    },
    {
      q: '¿Cómo se concilia la comisión si recibo cheques físicos, depósitos en ventanilla o Zelle comercial?',
      a: 'QuickBooks Online concilia automáticamente cualquier cheque o transferencia depositada en su cuenta bancaria comercial. Cuando usted marca el depósito como "Cleared" (Fondos Disponibles), el ledger de Socio genera el comprobante digital de liquidación con desglose transparente.',
    },
    {
      q: '¿Por qué me piden fotos de mi libreta con presupuestos viejos? ¿Se los van a dar a otros contratistas?',
      a: 'Sus clientes son 100% de su propiedad bajo contrato de confidencialidad legal en NYC. La asistente "María" se comunica exclusivamente en nombre de SU empresa ("María de parte de Don Hector"), no de Socio. Jamás compartimos, vendemos o transferimos sus presupuestos a otros contratistas.',
    },
    {
      q: '¿Cómo prueban que un cliente vino por Socio y no por mi propia cuenta?',
      a: 'Utilizamos coincidencia determinista de teléfono y correo electrónico. Cuando se emite un depósito en su QuickBooks, el sistema verifica si ese número ya existía en nuestro registro de capturas del Radar DOB o si fue reactivado por María. Si el cliente ya era suyo y vino sin intervención nuestra, no hay comisión.',
    },
    {
      q: '¿Qué sucede exactamente cuando alcanzo el Tope Anual de $40,000 en comisiones?',
      a: 'En cuanto la suma acumulada de sus comisiones pagadas durante el año calendario alcance los $40,000 USD, la comisión cae automáticamente a 0.0%. A partir de ese momento, usted se queda con el 100% de los ingresos de todas sus obras por el resto del año.',
    },
  ];

  return (
    <div className="min-h-screen bg-[#F9FAFB] text-[#111827] font-sans selection:bg-[#FF5500] selection:text-white pb-24">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify({"@context": "https://schema.org", "@type": "FAQPage", "mainEntity": [{"@type": "Question", "name": "¿Qué pasa si el propietario cancela el proyecto o detiene la obra?", "acceptedAnswer": {"@type": "Answer", "text": "La Regla de Oro de Socio es 100% estricta: solo cobramos comisión sobre dinero que efectivamente haya ingresado y se haya acreditado en su cuenta bancaria comercial verificada por QuickBooks. Si el cliente cancela la obra antes del anticipo, desaparece o congela el proyecto, usted nos debe exactamente $0.00. Cero penalidades, cero cargos por gestión."}}, {"@type": "Question", "name": "¿Cómo manejan los atrasos en pagos o contratos con pagos por hitos (Milestones)?", "acceptedAnswer": {"@type": "Answer", "text": "La comisión de Socio se divide y se liquida en sincronía exacta con los hitos reales que usted cobra. Si el cliente paga un 30% de anticipo, 30% a mitad de obra y 40% al finalizar la inspección, la comisión solo se calcula sobre cada depósito bancario individual una vez que los fondos están disponibles en su cuenta."}}, {"@type": "Question", "name": "¿Qué pasa si el cliente pide cambios de último minuto (Change Orders) o el monto sube/baja?", "acceptedAnswer": {"@type": "Answer", "text": "Los Change Orders se ingresan automáticamente en QuickBooks. Si el monto del contrato aumenta, la comisión sobre el adicional se calcula en el tramo correspondiente (con el 50% de descuento del piloto). Si el monto baja, su comisión total se reduce en proporción exacta. Nunca pagará comisión sobre trabajos no cobrados."}}, {"@type": "Question", "name": "¿Cómo se concilia la comisión si recibo cheques físicos, depósitos en ventanilla o Zelle comercial?", "acceptedAnswer": {"@type": "Answer", "text": "QuickBooks Online concilia automáticamente cualquier cheque o transferencia depositada en su cuenta bancaria comercial. Cuando usted marca el depósito como \"Cleared\" (Fondos Disponibles), el ledger de Socio genera el comprobante digital de liquidación con desglose transparente."}}, {"@type": "Question", "name": "¿Por qué me piden fotos de mi libreta con presupuestos viejos? ¿Se los van a dar a otros contratistas?", "acceptedAnswer": {"@type": "Answer", "text": "Sus clientes son 100% de su propiedad bajo contrato de confidencialidad legal en NYC. La asistente \"María\" se comunica exclusivamente en nombre de SU empresa (\"María de parte de Don Hector\"), no de Socio. Jamás compartimos, vendemos o transferimos sus presupuestos a otros contratistas."}}, {"@type": "Question", "name": "¿Cómo prueban que un cliente vino por Socio y no por mi propia cuenta?", "acceptedAnswer": {"@type": "Answer", "text": "Utilizamos coincidencia determinista de teléfono y correo electrónico. Cuando se emite un depósito en su QuickBooks, el sistema verifica si ese número ya existía en nuestro registro de capturas del Radar DOB o si fue reactivado por María. Si el cliente ya era suyo y vino sin intervención nuestra, no hay comisión."}}, {"@type": "Question", "name": "¿Qué sucede exactamente cuando alcanzo el Tope Anual de $40,000 en comisiones?", "acceptedAnswer": {"@type": "Answer", "text": "En cuanto la suma acumulada de sus comisiones pagadas durante el año calendario alcance los $40,000 USD, la comisión cae automáticamente a 0.0%. A partir de ese momento, usted se queda con el 100% de los ingresos de todas sus obras por el resto del año."}}]}) }}
      />

      
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
            Sin rodeos ni letra chica. Respuestas directas sobre cancelaciones, hitos de pago, cambio de órdenes y tope anual.
          </p>
        </div>
      </section>

      {/* Social Proof Strip */}
      <section className="bg-slate-900 text-white py-4 px-6 border-b border-slate-800">
        <div className="max-w-6xl mx-auto flex flex-wrap items-center justify-center gap-8 text-xs font-mono text-slate-300">
          <span className="text-slate-400 font-bold uppercase">Garantías Operativas en NYC:</span>
          <span className="flex items-center gap-1.5"><ShieldCheck className="w-4 h-4 text-emerald-400" /> Cero Cobro si Cliente Cancela</span>
          <span className="flex items-center gap-1.5"><ShieldCheck className="w-4 h-4 text-emerald-400" /> Confidencialidad NDA</span>
          <span className="flex items-center gap-1.5"><ShieldCheck className="w-4 h-4 text-emerald-400" /> Tope Máximo Anual $40k</span>
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

      {/* Sticky Bottom Diagnostic Bar */}
      <div className="fixed bottom-0 left-0 right-0 z-50 bg-slate-900/95 backdrop-blur-md border-t border-slate-700 py-3.5 px-6 shadow-2xl">
        <div className="max-w-6xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3 text-white">
            <ClipboardList className="w-5 h-5 text-[#FF5500] shrink-0" />
            <span className="text-sm font-bold tracking-tight">
              ¿Tienes otra duda específica sobre tu empresa o licencias en NYC?
            </span>
          </div>
          <a
            href={waLink}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl bg-[#25D366] text-white font-black text-xs uppercase hover:bg-[#20ba5a] shadow-lg transition-all shrink-0"
          >
            <span>📋 Consulta con un Operador → WhatsApp</span>
          </a>
        </div>
      </div>

    </div>
  );
}
