'use client';

import { motion } from 'framer-motion';
import { bentoContainer, bentoCard } from '@/components/Animations';

export function DataMoat() {
  const lifecycle = [
    {
      phase: '01 / EXPECTED',
      stage: 'At Project Creation',
      desc: 'Socio establishes the normalized scope, CSI division breakdown, and expected baseline budget.',
    },
    {
      phase: '02 / BID',
      stage: 'During Contractor Matching',
      desc: 'Socio captures granular trade pricing across identical line items from verified NYC master crews.',
    },
    {
      phase: '03 / EXECUTION',
      stage: 'During Construction',
      desc: 'Socio tracks milestone velocity, inspection clearance rates, and any scope variation requests.',
    },
    {
      phase: '04 / ACTUAL',
      stage: 'At Completion',
      desc: 'Socio records the final audited cost, actual days to close, and punch-list satisfaction score.',
    },
    {
      phase: '05 / BENCHMARK',
      stage: 'The Compounding Loop',
      desc: 'Empirical data automatically refines predictive scope modeling for the next building on the block.',
    },
  ];

  const intelligenceFields = [
    { title: 'Cost Benchmarks', desc: 'Real square-footage costs by pre-war typology, eliminating predatory markups.' },
    { title: 'Schedule Benchmarks', desc: 'Empirical completion timelines for kitchen, bath, and brownstone gut restorations.' },
    { title: 'Contractor Performance', desc: 'Objective reliability indices based on milestone timeliness and inspection pass rates.' },
    { title: 'Scope Variance', desc: 'Precise identification of trade categories most prone to unforeseen site conditions.' },
    { title: 'Change-Order Patterns', desc: 'Root-cause tracking ensuring contingency budgets are allocated accurately upfront.' },
    { title: 'Building Requirements', desc: 'Institutional memory of specific co-op boards and managing agent alteration rules.' },
  ];

  return (
    <section className="w-full bg-white py-32 px-6 border-b border-gray-200">
      <div className="max-w-7xl mx-auto">
        <div className="max-w-3xl mb-16">
          <p className="font-mono text-xs uppercase tracking-widest text-gray-400 mb-3">
            Section 07 · The Compounding Data Layer
          </p>
          <h2 className="text-3xl md:text-5xl font-serif text-black leading-tight mb-6">
            Every project makes <br />
            the next project smarter.
          </h2>
          <p className="font-sans text-gray-600 text-lg leading-relaxed">
            Socio is systematically building a project-level dataset that captures the empirical reality of NYC residential construction. While traditional contractors keep records on scattered paper, our operating system records every stage as structured market intelligence.
          </p>
        </div>

        {/* The 5-Phase Compounding Flywheel */}
        <div className="border border-gray-200 bg-[#FAFAFA] p-8 md:p-12 mb-16">
          <span className="font-mono text-xs uppercase tracking-widest text-gray-400 block mb-6 pb-4 border-b border-gray-200">
            The Empirical Learning Protocol
          </span>
          <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-6">
            {lifecycle.map((item, idx) => (
              <div key={idx} className="flex flex-col justify-between bg-white border border-gray-200 p-6">
                <div>
                  <span className="font-mono text-xs font-semibold text-black block mb-1">
                    {item.phase}
                  </span>
                  <p className="font-serif text-base text-black mb-3">{item.stage}</p>
                  <p className="font-sans text-xs text-gray-500 leading-relaxed">
                    {item.desc}
                  </p>
                </div>
                <div className="mt-6 pt-3 border-t border-gray-100 font-mono text-[10px] text-gray-400">
                  LOOP NODE 0{idx + 1}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Intelligence Outputs Grid */}
        <motion.div
          variants={bentoContainer}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, margin: '-100px' }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
        >
          {intelligenceFields.map((field, idx) => (
            <motion.div
              key={idx}
              variants={bentoCard}
              className="bg-white border border-gray-200 p-8 flex flex-col justify-between hover:border-black transition-colors"
            >
              <div>
                <div className="flex items-center justify-between mb-4 pb-2 border-b border-gray-100">
                  <span className="font-mono text-xs text-gray-400">INDEX 0{idx + 1}</span>
                  <span className="font-mono text-[10px] text-emerald-700 bg-emerald-50 px-2 py-0.5 border border-emerald-200">
                    ACTIVE TELEMETRY
                  </span>
                </div>
                <h3 className="text-xl font-serif text-black mb-2">{field.title}</h3>
                <p className="font-sans text-xs md:text-sm text-gray-500 leading-relaxed">
                  {field.desc}
                </p>
              </div>
              <div className="mt-6 pt-4 border-t border-gray-100 font-mono text-[10px] text-gray-400 uppercase tracking-widest">
                System Intelligence
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}

export default DataMoat;
