'use client';

import { motion } from 'framer-motion';

export function WhatSocioDoes() {
  const services = [
    {
      num: '01',
      title: 'STRUCTURE THE PROJECT',
      description: 'Turn an ambiguous renovation idea into a defined scope, budget baseline, timeline, and digital project record before anyone swings a hammer.',
      outcome: 'What you get: 42 line-item CSI scope with explicit inclusions, exclusions, and identified unknowns.',
    },
    {
      num: '02',
      title: 'FIND THE RIGHT CONTRACTOR',
      description: 'Match the project with licensed contractors based on trade specialization, local NYC building experience, verified capacity, and DOB track record.',
      outcome: 'What you get: Direct introduction to 3–4 vetted crews who specialize in your exact property type.',
    },
    {
      num: '03',
      title: 'PREPARE THE DOCUMENTS',
      description: 'Organize required insurance, alteration agreements, lead-safe disclosures, and managing agent compliance packages ahead of board review.',
      outcome: 'What you get: Complete, board-ready alteration filing package with ACORD 25 certificates.',
    },
    {
      num: '04',
      title: 'CONTROL MILESTONES',
      description: 'Never hand over large cash deposits blindly upfront. Secure funds in escrow and release capital only upon photographic and physical milestone verification.',
      outcome: 'What you get: Staged escrow releases gated by dual owner and contractor signoff.',
    },
    {
      num: '05',
      title: 'KEEP THE RECORD',
      description: 'Maintain an immutable digital record of every drawing revision, approved change order, milestone disbursement, and final statutory lien waiver.',
      outcome: 'What you get: A permanent property ledger that protects resale value and historical proof.',
    },
  ];

  return (
    <section className="w-full bg-white py-32 px-6 border-b border-gray-200">
      <div className="max-w-7xl mx-auto">
        {/* Section Header */}
        <div className="max-w-3xl mb-20">
          <p className="font-mono text-xs uppercase tracking-widest text-gray-400 mb-3">
            Start With The Project
          </p>
          <h2 className="text-4xl sm:text-5xl md:text-6xl font-serif text-black leading-tight mb-6">
            One place to organize <br />
            the entire project.
          </h2>
          <p className="font-sans text-gray-600 text-lg leading-relaxed">
            Socio organizes your property, scope, budget, documents, timeline, and requirements before contractors begin estimating.
          </p>
        </div>

        {/* 5 Editorial Services (Clean 1px grid without boxy cards) */}
        <div className="border-t border-gray-200 divide-y divide-gray-200">
          {services.map((svc) => (
            <motion.div
              key={svc.num}
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-60px' }}
              transition={{ duration: 0.6 }}
              className="py-10 grid grid-cols-1 md:grid-cols-12 gap-6 items-baseline"
            >
              <div className="md:col-span-2 font-mono text-xs text-gray-400 font-semibold tracking-wider">
                [{svc.num}]
              </div>
              <div className="md:col-span-4">
                <h3 className="font-mono text-sm sm:text-base font-bold text-black uppercase tracking-wider">
                  {svc.title}
                </h3>
              </div>
              <div className="md:col-span-6 space-y-3 font-sans">
                <p className="text-sm sm:text-base text-gray-700 leading-relaxed">
                  {svc.description}
                </p>
                <p className="font-mono text-xs text-gray-500 bg-gray-50 border-l-2 border-black pl-3 py-1.5">
                  {svc.outcome}
                </p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

export default WhatSocioDoes;
