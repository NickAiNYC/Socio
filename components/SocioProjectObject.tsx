'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import { bentoContainer, bentoCard } from '@/components/Animations';

export function SocioProjectObject() {
  const nodes = [
    { key: 'Property', value: '172 Union Street · Carroll Gardens, Brooklyn (Pre-War Co-op · 3 Units)' },
    { key: 'Scope', value: 'CSI 09 20 00 Plaster & Skim (Level 5 Finish · 1,450 sq ft) · Explicit In/Out Matrix' },
    { key: 'Budget', value: '$84,500 Normalized Baseline · Pre-verified Labor & Materials' },
    { key: 'Documents', value: 'Architectural Submittal Set · Alteration Agreement · EPA Lead-Safe RRP' },
    { key: 'Contractors', value: 'Verified Master Trade Crew · DOB Active Permit History · Clean NYC Track Record' },
    { key: 'Compliance', value: 'ACORD 25 COI Package · $1M/$2M General Liability · Named Managing Agent' },
    { key: 'Milestones', value: 'MS-01 Prep (25%) → MS-02 Skim (35%) → MS-03 Prime/Finish (30%) → MS-04 Punch (10%)' },
    { key: 'Payments', value: 'Staged Milestone Escrow Rails · Capital Released Strictly Post-Inspection' },
    { key: 'Changes', value: 'Zero Napkin Variations · Digital Change Orders Governed by Agreed Scope Baseline' },
    { key: 'Outcome', value: 'Signed Managing Agent Clearance · Historical Cost & Duration Recorded to System Moat' },
  ];

  return (
    <section className="w-full bg-[#FAFAFA] py-32 px-6 border-b border-gray-200">
      <div className="max-w-7xl mx-auto">
        <div className="max-w-3xl mb-16">
          <p className="font-mono text-xs uppercase tracking-widest text-gray-400 mb-3">
            Section 02 · Core Data Primitive
          </p>
          <h2 className="text-3xl md:text-5xl font-serif text-black leading-tight mb-6">
            The Socio Project: <br />
            The primary digital object.
          </h2>
          <p className="font-sans text-gray-600 text-lg leading-relaxed">
            Socio is not a static web catalog. It is an operating environment where every renovation is instantiated as a structured, tamper-resistant digital project record governing scope, compliance, and capital.
          </p>
        </div>

        {/* The Digital Object Inspector Blueprint */}
        <motion.div
          variants={bentoContainer}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, margin: '-100px' }}
          className="bg-white border border-gray-200 shadow-xs overflow-hidden"
        >
          {/* Header Bar of the Object */}
          <div className="px-6 py-4 border-b border-gray-200 bg-gray-50 flex flex-wrap items-center justify-between gap-4 font-mono text-xs">
            <div className="flex items-center gap-3">
              <span className="w-2.5 h-2.5 bg-black" />
              <span className="font-semibold text-black uppercase tracking-wider">
                OBJECT: SOCIO_PROJECT_INSTANCE
              </span>
              <span className="text-gray-400">#PRJ-7102-BK</span>
            </div>
            <div className="flex items-center gap-4 text-gray-500">
              <span>STATUS: ACTIVE_MILESTONE_02</span>
              <span className="text-emerald-700 font-semibold bg-emerald-50 border border-emerald-200 px-2 py-0.5">
                ● ESCROW_LOCKED
              </span>
            </div>
          </div>

          {/* Blueprint Schema Tree */}
          <div className="p-8 md:p-12 font-mono text-sm">
            <div className="text-black font-semibold mb-6 flex items-center gap-2">
              <span className="text-gray-400">root@socio-os:~$</span>
              <span>inspect project --id PRJ-7102-BK --format schema</span>
            </div>

            <div className="border border-gray-200 bg-[#FAFAFA] p-6 md:p-8 space-y-4">
              <div className="text-black font-bold text-base pb-2 border-b border-gray-200 flex items-center justify-between">
                <span>PROJECT [PRJ-7102-BK]</span>
                <span className="text-xs font-normal text-gray-500">SCHEMA VERSION 2.4</span>
              </div>

              <div className="space-y-3 pt-2">
                {nodes.map((node, idx) => {
                  const isLast = idx === nodes.length - 1;
                  return (
                    <motion.div
                      key={node.key}
                      variants={bentoCard}
                      className="flex flex-col md:flex-row md:items-start gap-2 md:gap-4 pl-2"
                    >
                      <div className="text-gray-400 select-none whitespace-nowrap">
                        {isLast ? '└──' : '├──'} <span className="text-black font-semibold">{node.key}</span>
                      </div>
                      <div className="text-gray-600 font-sans text-xs md:text-sm leading-relaxed md:pl-2">
                        {node.value}
                      </div>
                    </motion.div>
                  );
                })}
              </div>
            </div>

            <div className="mt-8 flex flex-col sm:flex-row sm:items-center justify-between gap-4 text-xs text-gray-500 pt-6 border-t border-gray-200">
              <div className="flex items-center gap-2">
                <span className="w-1.5 h-1.5 bg-black" />
                <span>Deterministic Project Architecture</span>
              </div>
              <div className="flex items-center gap-4">
                <span className="hidden sm:inline">Immutable Ledger · Zero Vague Napkin Agreements</span>
                <Link
                  href="/project/PRJ-7102-BK"
                  className="bg-black text-white px-3 py-1.5 font-mono text-xs hover:bg-gray-800 transition-colors inline-flex items-center gap-1.5"
                >
                  <span>Inspect Live Project Runtime</span>
                  <span>→</span>
                </Link>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}

export default SocioProjectObject;
