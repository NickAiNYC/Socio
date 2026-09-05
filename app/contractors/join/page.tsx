'use client';

import { motion } from 'framer-motion';
import Image from 'next/image';
import { TradesmanForm } from '@/components/TradesmanForm';
import { WhatsAppCTA, FloatingWhatsAppButton } from '@/components/WhatsAppCTA';

export default function JoinFormPage() {
  const benefits = [
    {
      title: 'Defined Scope Packages',
      desc: 'Receive codified CSI line items with explicit inclusions, exclusions, and known site conditions. Zero unpaid estimating guessing games.',
    },
    {
      title: 'Inspection-Gated Milestone Rails',
      desc: 'Project capital is secured upfront on milestone payment rails. Funds release automatically upon verified punchlist clearance.',
    },
    {
      title: 'Building Compliance Dossiers',
      desc: 'Managing agent alteration agreements, elevator reservations, and ACORD 25 COI endorsements are organized before mobilization.',
    },
    {
      title: 'Targeted Local Trade Matching',
      desc: 'Match against projects tailored to your trade classification, building experience, and neighborhood crew capacity.',
    },
  ];

  return (
    <main className="min-h-screen bg-[#FAFAFA] pt-32 pb-24 px-6 border-b border-gray-200 font-sans">
      <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-start">
        {/* Left Column: Value Proposition */}
        <div className="lg:col-span-5 flex flex-col justify-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: 'easeOut' }}
            className="space-y-6"
          >
            <div className="flex items-center gap-3">
              <Image
                src="/socio-logo.png"
                alt="Socio."
                width={84}
                height={24}
                className="h-5 w-auto object-contain"
              />
              <span className="font-mono text-xs uppercase tracking-widest text-gray-400">
                · Trade Network
              </span>
            </div>

            <h1 className="text-4xl sm:text-5xl font-serif leading-[1.1] text-black">
              Better projects. Less wasted estimating.
            </h1>

            <p className="font-sans text-gray-600 text-base leading-relaxed">
              Socio eliminates the race to the bottom. We provide master craftsmen and licensed general contractors with structured residential projects, verified budgets, and guaranteed milestone payment rails.
            </p>

            <div className="border-t border-gray-200 pt-6 space-y-4">
              {benefits.map((b, idx) => (
                <div key={idx} className="flex items-start gap-3">
                  <span className="font-mono text-xs text-black font-bold mt-0.5 shrink-0">
                    0{idx + 1}.
                  </span>
                  <div>
                    <h4 className="font-mono text-xs font-bold text-black uppercase tracking-wide">
                      {b.title}
                    </h4>
                    <p className="text-xs text-gray-500 font-sans leading-relaxed mt-0.5">
                      {b.desc}
                    </p>
                  </div>
                </div>
              ))}
            </div>

            {/* Direct Channel */}
            <div className="pt-6 border-t border-gray-200 space-y-2">
              <span className="font-mono text-xs uppercase tracking-wider text-gray-400 block">
                Direct Trade Desk Channel
              </span>
              <WhatsAppCTA
                label="Direct WhatsApp Operations Desk"
                className="w-full"
              />
            </div>
          </motion.div>
        </div>

        {/* Right Column: Architectural Onboarding & Opportunity Matching Form */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6, delay: 0.2, ease: 'easeOut' }}
          className="lg:col-span-7 bg-white border border-gray-200 p-8 sm:p-10 shadow-sm"
        >
          <TradesmanForm />
        </motion.div>
      </div>

      <FloatingWhatsAppButton />
    </main>
  );
}
