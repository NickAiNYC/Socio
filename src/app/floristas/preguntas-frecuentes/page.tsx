'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { 
  Flower2, 
  Sparkles, 
  MessageSquare, 
  HelpCircle, 
  ChevronDown, 
  ShieldCheck, 
  ArrowRight, 
  CheckCircle2, 
  Receipt,
  Truck,
  AlertCircle
} from 'lucide-react';

interface FAQItem {
  q: string;
  a: string;
  category: string;
}

const FAQS: FAQItem[] = [
  {
    category: 'Merma & Cancelaciones',
    q: '¿Qué pasa si las flores perecederas se marchitan o el cliente cancela el pedido?',
    a: 'Usted paga exactamente $0.00. La regla de oro de Socio es que nuestra comisión solo se liquida si el dinero del cliente se acredita satisfactoriamente en su cuenta o terminal POS. Si una entrega se cancela, se devuelve o no se cobra, no existe ninguna comisión adeudada.'
  },
  {
    category: 'Temporadas Altas',
    q: '¿Cómo controlan la sobrecarga de pedidos en San Valentín y el Día de las Madres?',
    a: 'Nuestra asistente virtual "Rosa" cuenta con un regulador de cupos. Cuando usted alcanza su capacidad máxima diaria de armado y reparto de arreglos, el sistema deja de aceptar pedidos inmediatos y pasa a programar fechas posteriores o activar lista de espera con prepago obligatorio.'
  },
  {
    category: 'Logística & Envíos',
    q: '¿Quién se encarga del reparto físico de los arreglos en los 5 Boroughs?',
    a: 'Su floristería mantiene el control de sus choferes o servicios locales de mensajería (como DoorDash Drive, Relay o choferes propios). Socio actúa como el motor comercial y de captación que asegura el cobro anticipado del ramo y la tarifa de envío antes de que salga de su taller.'
  },
  {
    category: 'Integración POS',
    q: '¿Cómo concilian las comisiones con mi sistema de cobro (Square, Clover, Shopify POS o Stripe)?',
    a: 'Nos conectamos mediante webhook seguro de lectura a su procesador de pagos. El sistema solo registra comisiones cuando una transacción tiene estado "settled" o "cleared". Cero reportes manuales o cálculos engorrosos.'
  },
  {
    category: 'Tope de Comisión',
    q: '¿Cómo funciona exactamente el Tope Anual Protegido de $15,000?',
    a: 'Garantizamos por contrato que una vez que su floristería haya pagado $15,000 en comisiones dentro de un año fiscal, nuestra comisión baja automáticamente a 0.0% para todas las ventas restantes de ese año. Sin letras pequeñas.'
  },
  {
    category: 'Suscripciones B2B',
    q: '¿Qué comisión se aplica a las suscripciones corporativas semanales de hoteles y oficinas?',
    a: 'Las cuentas corporativas B2B tienen una tasa reducida preferencial del 5% (en comparación con el 8% de pedidos minoristas directos), reconociendo el alto volumen y la predictibilidad del contrato a largo plazo.'
  }
];

export default function FloristasPreguntasFrecuentesPage() {
  const waLink = 'https://wa.me/19175550199?text=Hola%20Socio,%20tengo%20una%20pregunta%20sobre%20el%20sistema%20para%20florister%C3%ADas.';
  const [openIdx, setOpenIdx] = useState<number | null>(0);

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
            <Link href="/floristas/radar-floral" className="hover:text-[#E11D48] transition-colors">Radar Floral</Link>
            <Link href="/floristas/preguntas-frecuentes" className="text-[#E11D48]">Preguntas</Link>
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
            <HelpCircle className="w-3.5 h-3.5 text-[#E11D48]" />
            <span>CLARIDAD TOTAL & OBJECIONES RESUELTAS</span>
          </div>
          <h1 className="text-4xl sm:text-5xl font-black text-slate-950 tracking-tight">
            Preguntas Frecuentes de Floristas en NYC
          </h1>
          <p className="text-slate-600 text-base sm:text-lg max-w-2xl mx-auto leading-relaxed">
            Sin rodeos ni términos confusos. Respuestas claras sobre mermas, picos de temporada, repartos y liquidación en terminales de cobro.
          </p>
        </div>
      </section>

      {/* FAQ Accordion Section */}
      <section className="py-20 px-6 max-w-4xl mx-auto space-y-4">
        {FAQS.map((faq, idx) => (
          <div 
            key={idx} 
            className="bg-white rounded-2xl border border-rose-100 shadow-sm overflow-hidden transition-all"
          >
            <button
              onClick={() => setOpenIdx(openIdx === idx ? null : idx)}
              className="w-full p-6 text-left flex items-center justify-between gap-4 hover:bg-rose-50/40 transition-colors"
            >
              <div className="space-y-1">
                <span className="text-[10px] font-mono font-bold uppercase text-rose-600 bg-rose-50 px-2 py-0.5 rounded border border-rose-200">
                  {faq.category}
                </span>
                <h3 className="text-base font-bold text-slate-900 pt-1">{faq.q}</h3>
              </div>
              <ChevronDown className={`w-5 h-5 text-slate-400 shrink-0 transition-transform duration-200 ${openIdx === idx ? 'rotate-180 text-[#E11D48]' : ''}`} />
            </button>

            {openIdx === idx && (
              <div className="px-6 pb-6 pt-2 text-xs sm:text-sm text-slate-600 leading-relaxed border-t border-slate-100 bg-slate-50/50">
                {faq.a}
              </div>
            )}
          </div>
        ))}
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
              <span>BELLA FLORA NYC</span>
            </div>
          </div>
        </div>
      </section>

      {/* Sticky Bottom Bar */}
      <div className="fixed bottom-0 left-0 right-0 z-50 bg-slate-900/95 backdrop-blur-md border-t border-slate-800 p-4 shadow-2xl">
        <div className="max-w-5xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="text-xs text-slate-300 font-mono text-center sm:text-left">
            <span className="font-bold text-white">¿Tiene dudas adicionales?</span> Hable directamente con nuestro equipo técnico.
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
