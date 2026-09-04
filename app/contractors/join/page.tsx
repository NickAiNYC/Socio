'use client';

import { motion } from 'framer-motion';
import Image from 'next/image';
import { TradesmanForm } from '@/components/TradesmanForm';
import { WhatsAppCTA, FloatingWhatsAppButton } from '@/components/WhatsAppCTA';

export default function JoinFormPage() {
  const benefits = [
    'Presupuestos profesionales en inglés para clientes exigentes.',
    'Citas confirmadas en casas residenciales (cero pérdida de tiempo).',
    'Gestión de seguros y certificados (COI) para edificios y co-ops.',
    'Sin cobros ocultos: capa operativa y de presupuesto para maestros independientes.',
  ];

  return (
    <main className="min-h-screen bg-[#FAFAFA] pt-32 pb-24 px-6 border-b border-gray-200">
      <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-24 items-start">
        {/* Left Column: Value Proposition */}
        <div className="flex flex-col justify-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: 'easeOut' }}
          >
            <div className="flex items-center gap-3 mb-6">
              <Image
                src="/socio-logo.png"
                alt="Socio."
                width={84}
                height={24}
                className="h-5 w-auto object-contain"
              />
              <span className="font-mono text-sm uppercase tracking-widest text-gray-400">
                · Brooklyn Hub
              </span>
            </div>
            <h1 className="text-4xl sm:text-5xl md:text-6xl font-serif leading-[1.1] text-black mb-8 pr-4">
              Usted hace el trabajo de maestro. Nosotros nos encargamos de los clientes, estimados y cobros.
            </h1>
            <ul className="flex flex-col gap-4 border-t border-gray-200 pt-8 mt-4">
              {benefits.map((benefit, idx) => (
                <li key={idx} className="flex items-start gap-4">
                  <div className="mt-1 w-5 h-5 flex items-center justify-center border border-black bg-black text-white text-xs shrink-0">
                    ✓
                  </div>
                  <span className="font-sans text-gray-600 text-lg leading-relaxed">
                    {benefit}
                  </span>
                </li>
              ))}
            </ul>

            {/* Direct 1-Click WhatsApp Channel */}
            <div className="mt-10 pt-8 border-t border-gray-200">
              <span className="font-mono text-xs uppercase tracking-wider text-gray-400 block mb-3">
                ¿Prefiere saltarse el formulario?
              </span>
              <WhatsAppCTA
                label="Habla con nuestro desk de operaciones por WhatsApp"
                className="w-full"
              />
            </div>
          </motion.div>
        </div>

        {/* Right Column: Architectural Form */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6, delay: 0.2, ease: 'easeOut' }}
          className="bg-white border border-gray-200 p-8 md:p-12 shadow-[0_4px_40px_rgba(0,0,0,0.02)]"
        >
          <div className="mb-10 pb-6 border-b border-gray-100 flex items-center justify-between">
            <h2 className="text-2xl font-serif text-black">Solicitar una invitación</h2>
            <span className="font-mono text-[11px] text-gray-400 uppercase tracking-widest">
              Paso 1 de 2
            </span>
          </div>
          <TradesmanForm />
        </motion.div>
      </div>

      <FloatingWhatsAppButton />
    </main>
  );
}
