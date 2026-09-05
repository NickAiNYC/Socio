'use client';

import { motion } from 'framer-motion';
import { bentoContainer, bentoCard } from '@/components/Animations';

export function TransactionLifecycle() {
  const steps = [
    {
      num: '01',
      state: 'PROJECT CREATED',
      desc: 'Owner submits property address, preliminary drawings, and budget target into the digital intake layer.',
      gate: 'Address & Typology Verified',
    },
    {
      num: '02',
      state: 'SCOPE STRUCTURED',
      desc: 'Socio generates the CSI line-item breakdown with explicit Included, Excluded, and Unknown contingency boundaries.',
      gate: 'Scope Normalized',
    },
    {
      num: '03',
      state: 'CONTRACTORS MATCHED',
      desc: 'Routed exclusively to verified independent NYC trade crews with proven local historic building performance.',
      gate: 'DOB & COI Cleared',
    },
    {
      num: '04',
      state: 'BIDS RECEIVED',
      desc: 'Trades submit pricing on the identical scope sheet. Zero ambiguity; pure apples-to-apples evaluation.',
      gate: 'Pricing Parity Confirmed',
    },
    {
      num: '05',
      state: 'CONTRACT AWARDED',
      desc: 'Owner selects the master craftsman. Standardized contract and managing-agent alteration rider executed.',
      gate: 'Agreement Formalized',
    },
    {
      num: '06',
      state: 'MILESTONE FUNDED',
      desc: 'Capital for the upcoming milestone is locked in secure escrow before physical tools touch the jobsite.',
      gate: 'Escrow Confirmed',
    },
    {
      num: '07',
      state: 'WORK VERIFIED',
      desc: 'Phase completion is verified through photo telemetry and physical punch-list walkthrough signoff.',
      gate: 'Inspection Cleared',
    },
    {
      num: '08',
      state: 'PAYMENT RELEASED',
      desc: 'Escrow releases funds directly to the contractor bank rail. Zero billing disputes or payment chasing.',
      gate: 'Capital Disbursed',
    },
    {
      num: '09',
      state: 'PROJECT COMPLETED',
      desc: 'Final lien waivers, DOB inspection signoffs, and managing-agent closeout documentation archived.',
      gate: 'Zero Outstanding Liens',
    },
    {
      num: '10',
      state: 'OUTCOME RECORDED',
      desc: 'Actual schedule velocity, material costs, and contractor reliability scores committed to the system data moat.',
      gate: 'Moat Benchmark Committed',
    },
  ];

  return (
    <section className="w-full bg-[#FAFAFA] py-32 px-6 border-b border-gray-200">
      <div className="max-w-7xl mx-auto">
        <div className="max-w-3xl mb-16">
          <p className="font-mono text-xs uppercase tracking-widest text-gray-400 mb-3">
            Section 08 · Operating Protocol
          </p>
          <h2 className="text-3xl md:text-5xl font-serif text-black leading-tight mb-6">
            The 10-Step Transaction Protocol.
          </h2>
          <p className="font-sans text-gray-600 text-lg leading-relaxed">
            Construction should not be governed by verbal promises and reactive arguments. Socio executes projects as a deterministic state machine where every transition requires verifiable clearance.
          </p>
        </div>

        <motion.div
          variants={bentoContainer}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, margin: '-100px' }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4"
        >
          {steps.map((s, idx) => (
            <motion.div
              key={idx}
              variants={bentoCard}
              className="bg-white border border-gray-200 p-6 flex flex-col justify-between hover:border-black transition-colors min-h-[260px]"
            >
              <div>
                <div className="flex items-center justify-between mb-4 pb-2 border-b border-gray-100">
                  <span className="font-mono text-sm font-semibold text-black">{s.num}</span>
                  <span className="font-mono text-[9px] text-gray-400 uppercase tracking-widest">
                    STATE
                  </span>
                </div>
                <h3 className="font-mono text-xs font-bold text-black uppercase tracking-wider mb-2">
                  {s.state}
                </h3>
                <p className="font-sans text-xs text-gray-500 leading-relaxed">
                  {s.desc}
                </p>
              </div>

              <div className="mt-6 pt-3 border-t border-gray-100 font-mono text-[10px] text-emerald-800 bg-emerald-50/50 p-1.5 border border-emerald-100">
                ✓ {s.gate}
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}

export default TransactionLifecycle;
