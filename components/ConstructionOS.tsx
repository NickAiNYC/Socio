'use client';

import { motion } from 'framer-motion';
import { bentoContainer, bentoCard } from '@/components/Animations';

export function ConstructionOS() {
  const pillars = [
    {
      step: 'LAYER 01',
      title: 'Structured Scope Engine',
      subtitle: 'Included / Excluded / Unknown Matrix',
      desc: 'Eliminates vague napkin bids before they happen. Translates homeowner aspirations and architectural drawings into rigorous CSI line items with explicit trade boundaries.',
      metric: 'Zero Scope Creep',
    },
    {
      step: 'LAYER 02',
      title: 'Project-Fit & Verification',
      subtitle: 'Hyper-Local DOB & Capacity Intel',
      desc: 'No random contractor matching. Every project is routed based on active DOB permit records, proven historic brownstone track record, and verified COI compliance.',
      metric: 'Top 5% Craftsmen Only',
    },
    {
      step: 'LAYER 03',
      title: 'Milestone & Escrow Rails',
      subtitle: 'Staged Releases & Inspection Periods',
      desc: 'Capital is held securely in milestone escrow. Payments are released strictly upon signed inspection and cure periods, guaranteeing contractors get paid and homeowners get finished work.',
      metric: '100% Payment Security',
    },
    {
      step: 'LAYER 04',
      title: 'The Proprietary Data Moat',
      subtitle: 'NYC Historical Cost & Variance Index',
      desc: 'Every closed transaction feeds empirical data on real square-footage costs, variance rates, and co-op board approvals across Park Slope, Brooklyn Heights, and Astoria.',
      metric: 'Predictive Intelligence',
    },
  ];

  return (
    <section id="platform" className="w-full bg-[#FAFAFA] py-32 px-6 border-b border-gray-200">
      <div className="max-w-7xl mx-auto">
        <div className="max-w-3xl mb-16">
          <p className="font-mono text-xs uppercase tracking-widest text-gray-400 mb-3">
            System Architecture
          </p>
          <h2 className="text-3xl md:text-5xl font-serif text-black leading-tight mb-6">
            Not a lead board.<br />The construction operating system.
          </h2>
          <p className="font-sans text-gray-500 text-lg leading-relaxed">
            Lead marketplaces sell unvetted contact info to five contractors at once. Socio sits directly in the middle of the transaction—standardizing scopes, aligning incentives, and governing capital from permit to final punch-list.
          </p>
        </div>

        <motion.div
          variants={bentoContainer}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, margin: '-100px' }}
          className="grid grid-cols-1 md:grid-cols-2 gap-6"
        >
          {pillars.map((item, idx) => (
            <motion.div
              key={idx}
              variants={bentoCard}
              className="bg-white border border-gray-200 p-10 hover:border-black transition-colors duration-300 flex flex-col justify-between min-h-[300px]"
            >
              <div>
                <div className="flex items-center justify-between mb-6 pb-4 border-b border-gray-100">
                  <span className="font-mono text-xs font-semibold text-black tracking-widest">
                    {item.step}
                  </span>
                  <span className="font-mono text-[10px] bg-gray-100 text-gray-600 px-2.5 py-1 border border-gray-200 uppercase tracking-widest">
                    {item.metric}
                  </span>
                </div>
                <h3 className="text-2xl font-serif text-black mb-1">{item.title}</h3>
                <p className="font-mono text-xs text-gray-400 uppercase tracking-wider mb-4">
                  {item.subtitle}
                </p>
                <p className="font-sans text-gray-600 leading-relaxed text-base">
                  {item.desc}
                </p>
              </div>

              <div className="mt-8 pt-4 border-t border-gray-100 flex items-center justify-between text-xs font-mono text-gray-400">
                <span>NYC CORE RUNTIME</span>
                <span className="text-black font-semibold">VERIFIED</span>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}

export default ConstructionOS;
