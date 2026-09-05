'use client';

import { motion } from 'framer-motion';
import { bentoContainer, bentoCard } from '@/components/Animations';

export function CompliancePreview() {
  const packages = [
    {
      code: 'PACKAGE 01',
      title: 'COI Package',
      subtitle: 'Insurance & Indemnification Clearance',
      specs: [
        'Additional Insured: Explicit endorsement naming building & managing agent',
        'Waiver of Subrogation: Standard NYC commercial co-op requirement',
        'Coverage Limits: $1,000,000 per occurrence / $2,000,000 aggregate',
        'Statutory Workers’ Comp: NYS C-105.2 or DB-120.1 verified',
      ],
      tag: 'ACORD 25 Aligned',
    },
    {
      code: 'PACKAGE 02',
      title: 'Scope Package',
      subtitle: 'Standardized Technical Specifications',
      specs: [
        'CSI 16-Division Format: Industry-standard line-item indexing',
        'Specified Materials: Architectural brand & product schedules',
        'Direct Labor Allocations: Transparent trade crew headcounts',
        'Milestone Sequencing: Phased delivery benchmarks',
      ],
      tag: 'Zero Allowances',
    },
    {
      code: 'PACKAGE 03',
      title: 'Alteration Package',
      subtitle: 'Managing Agent & Board Clearance Kit',
      specs: [
        'Building Protection: Hallway Masonite, elevator pads, runner specs',
        'Dust Containment: EPA Lead-Safe RRP containment protocols',
        'Work-Hour Schedule: Strict 9:00 AM – 4:30 PM weekday compliance',
        'Managing Agent Signoff: Standard alteration agreement rider attached',
      ],
      tag: 'Board Ready',
    },
  ];

  return (
    <section className="w-full bg-white py-32 px-6 border-b border-gray-200">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-16">
          <div className="max-w-3xl">
            <p className="font-mono text-xs uppercase tracking-widest text-gray-400 mb-3">
              Section 05 · NYC Compliance Layer
            </p>
            <h2 className="text-3xl md:text-5xl font-serif text-black leading-tight mb-4">
              The project arrives ready to move.
            </h2>
            <p className="font-sans text-gray-600 text-lg leading-relaxed">
              Managing agents and co-op boards stall projects for months over incomplete paperwork. Socio converts complex NYC building requirements into pre-approved, project-ready documentation packages.
            </p>
          </div>
          <div className="font-mono text-xs text-gray-400 border border-gray-200 bg-gray-50 px-3 py-2 shrink-0">
            NYC BUILDING READY · 100% AUDITED
          </div>
        </div>

        <motion.div
          variants={bentoContainer}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, margin: '-100px' }}
          className="grid grid-cols-1 md:grid-cols-3 gap-8"
        >
          {packages.map((pkg, idx) => (
            <motion.div
              key={idx}
              variants={bentoCard}
              className="bg-[#FAFAFA] border border-gray-200 p-8 md:p-10 flex flex-col justify-between hover:border-black transition-colors"
            >
              <div>
                <div className="flex items-center justify-between pb-4 border-b border-gray-200 mb-6">
                  <span className="font-mono text-xs font-semibold text-black tracking-widest">
                    {pkg.code}
                  </span>
                  <span className="font-mono text-[10px] bg-white text-gray-600 px-2 py-0.5 border border-gray-200 uppercase tracking-widest">
                    {pkg.tag}
                  </span>
                </div>
                <h3 className="text-2xl font-serif text-black mb-1">{pkg.title}</h3>
                <p className="font-mono text-xs text-gray-400 uppercase tracking-wider mb-6">
                  {pkg.subtitle}
                </p>

                <ul className="space-y-3 border-t border-gray-200/80 pt-6">
                  {pkg.specs.map((spec, i) => (
                    <li key={i} className="flex items-start gap-2.5 text-xs font-mono text-gray-600">
                      <span className="w-1.5 h-1.5 bg-black mt-1 shrink-0" />
                      <span>{spec}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="mt-8 pt-6 border-t border-gray-200 flex items-center justify-between text-xs font-mono text-gray-400">
                <span>CLEARANCE PROTOCOL</span>
                <span className="text-black font-semibold">VERIFIED</span>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}

export default CompliancePreview;
