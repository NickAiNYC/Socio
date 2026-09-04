'use client';

import { motion } from 'framer-motion';
import { bentoContainer, bentoCard } from '@/components/Animations';

export function CompliancePreview() {
  const documents = [
    {
      code: 'DOC-01',
      title: 'ACORD 25 COI Package',
      spec: '$1,000,000 / $2,000,000 Commercial General Liability with Named Building Management as Additional Insured and Waiver of Subrogation.',
      tag: 'Co-op Board Ready',
    },
    {
      code: 'DOC-02',
      title: 'Itemized CSI Scope Sheet',
      spec: 'Granular line-item breakdown dividing labor, specified materials (Level 5 drywall/plaster, BM/F&B paint), and daily milestones.',
      tag: 'Zero Napkin Estimates',
    },
    {
      code: 'DOC-03',
      title: 'Alteration Agreement Rider',
      spec: 'Building protection protocol, dust-containment plan (EPA Lead-Safe RRP), and strict weekday work-hour schedule alignment.',
      tag: 'Managing Agent Clearance',
    },
  ];

  return (
    <section className="w-full bg-[#FAFAFA] py-32 px-6 border-b border-gray-200">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-16">
          <div>
            <p className="font-mono text-xs uppercase tracking-widest text-gray-400 mb-3">
              Standardized Deliverables
            </p>
            <h2 className="text-3xl md:text-5xl font-serif text-black leading-tight">
              The Alteration Kit.<br />Built for strict NYC buildings.
            </h2>
          </div>
          <p className="font-sans text-gray-500 max-w-md text-base md:text-lg">
            Every project deployed through Socio arrives pre-packaged with the exact documentation Brooklyn and Queens managing agents demand before signing off.
          </p>
        </div>

        <motion.div
          variants={bentoContainer}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, margin: '-100px' }}
          className="grid grid-cols-1 md:grid-cols-3 gap-6"
        >
          {documents.map((doc, idx) => (
            <motion.div
              key={idx}
              variants={bentoCard}
              className="bg-white border border-gray-200 p-8 flex flex-col justify-between hover:border-black transition-colors duration-300 min-h-[300px]"
            >
              <div>
                <div className="flex items-center justify-between mb-6 pb-4 border-b border-gray-100">
                  <span className="font-mono text-xs font-semibold text-black tracking-widest">
                    {doc.code}
                  </span>
                  <span className="font-mono text-[10px] bg-gray-100 text-gray-600 px-2 py-0.5 border border-gray-200 uppercase tracking-wider">
                    {doc.tag}
                  </span>
                </div>
                <h3 className="text-xl font-serif text-black mb-3">{doc.title}</h3>
                <p className="font-sans text-sm text-gray-500 leading-relaxed">
                  {doc.spec}
                </p>
              </div>

              <div className="mt-8 pt-4 border-t border-gray-100 flex items-center justify-between text-xs font-mono text-gray-400">
                <span>VERIFIED DELIVERABLE</span>
                <span className="text-black font-semibold">✓ COMPLETE</span>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}

export default CompliancePreview;
