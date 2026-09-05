'use client';

import { motion } from 'framer-motion';
import { bentoContainer, bentoCard } from '@/components/Animations';

export function ConstructionOS() {
  const layers = [
    {
      layer: 'LAYER 01',
      title: 'Scope Engine',
      summary: 'Normalize ambiguous renovation requests into structured line items.',
      items: [
        'Included: Explicit labor & material allocations',
        'Excluded: Clear demarcation of client-provided finishes',
        'Unknown: Contingency items flagged before contract',
        'Specified Materials: Architectural manufacturer references',
        'Milestone Breakdown: Sequential delivery phases',
      ],
      badge: 'Specification Core',
    },
    {
      layer: 'LAYER 02',
      title: 'Project-Fit + Verification',
      summary: 'Match the project to verified NYC trade capacity.',
      items: [
        'DOB Records: Active permit history & license standing',
        'NYC Experience: Proven pre-war & historic building track record',
        'Trade Specialization: Level 5 plasterers, master tile, custom millwork',
        'COI Verification: $1M/$2M liability & workers’ comp compliance',
        'Geographic Proximity: Real-time site proximity across Brooklyn/Queens',
      ],
      badge: 'Capacity Layer',
    },
    {
      layer: 'LAYER 03',
      title: 'Milestone + Payment Rails',
      summary: 'Construction payments correspond to verified project progress.',
      items: [
        'Milestone: Capital funded into secure escrow before phase starts',
        'Inspection: Physical site walkthrough or digital proof verification',
        'Cure Period: Defined window to address punch-list deficiencies',
        'Approval: Dual signoff from property owner & site lead',
        'Release: Direct automated disbursement to the craftsman',
      ],
      badge: 'Escrow Rails',
    },
    {
      layer: 'LAYER 04',
      title: 'Project Data Moat',
      summary: 'Every completed transaction permanently improves network intelligence.',
      items: [
        'Estimated vs. Actual Cost: Real benchmark variances recorded',
        'Schedule Variance: Empirical duration tracking by neighborhood',
        'Change-Order Frequency: Root-cause analysis by trade category',
        'Contractor Performance: Verified reliability scores',
        'Building Requirements: Pre-war co-op board approval precedents',
      ],
      badge: 'Proprietary Moat',
    },
  ];

  return (
    <section id="platform" className="w-full bg-white py-32 px-6 border-b border-gray-200">
      <div className="max-w-7xl mx-auto">
        <div className="max-w-3xl mb-16">
          <p className="font-mono text-xs uppercase tracking-widest text-gray-400 mb-3">
            Section 03 · Operating System
          </p>
          <h2 className="text-3xl md:text-5xl font-serif text-black leading-tight mb-6">
            The Four Layers of Socio.
          </h2>
          <p className="font-sans text-gray-600 text-lg leading-relaxed">
            Socio is built on four interconnected infrastructure layers. They replace subjective contractor guesswork with deterministic engineering, contractual transparency, and compounding market data.
          </p>
        </div>

        <motion.div
          variants={bentoContainer}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, margin: '-100px' }}
          className="grid grid-cols-1 md:grid-cols-2 gap-8"
        >
          {layers.map((item, idx) => (
            <motion.div
              key={idx}
              variants={bentoCard}
              className="bg-[#FAFAFA] border border-gray-200 p-8 md:p-10 flex flex-col justify-between hover:border-black transition-colors"
            >
              <div>
                <div className="flex items-center justify-between pb-4 border-b border-gray-200 mb-6">
                  <span className="font-mono text-xs font-semibold text-black tracking-widest">
                    {item.layer}
                  </span>
                  <span className="font-mono text-[10px] bg-white text-gray-600 px-2.5 py-1 border border-gray-200 uppercase tracking-widest">
                    {item.badge}
                  </span>
                </div>
                <h3 className="text-2xl font-serif text-black mb-2">{item.title}</h3>
                <p className="font-sans text-sm text-gray-600 mb-6 leading-relaxed">
                  {item.summary}
                </p>

                <ul className="space-y-2.5 border-t border-gray-200/80 pt-6">
                  {item.items.map((it, i) => (
                    <li key={i} className="flex items-start gap-2.5 text-xs font-mono text-gray-600">
                      <span className="w-1.5 h-1.5 bg-black mt-1 shrink-0" />
                      <span>{it}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="mt-8 pt-6 border-t border-gray-200 flex items-center justify-between text-xs font-mono text-gray-400">
                <span>SYSTEM ARCHITECTURE</span>
                <span className="text-black font-semibold">DETERMINISTIC</span>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}

export default ConstructionOS;
