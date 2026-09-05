'use client';

import { motion } from 'framer-motion';
import { bentoContainer, bentoCard } from '@/components/Animations';

export function TwoSidedNetwork() {
  const ownerBenefits = [
    'Structured Scope: Itemized CSI divisions with clear inclusions/exclusions.',
    'Qualified Contractors: Verified NYC license, insurance, and trade history.',
    'Compliance Preparation: Instant ACORD 25 COIs & building alteration kits.',
    'Transparent Bids: Apples-to-apples comparison on identical specifications.',
    'Milestone Controls: Funds held in escrow; released only upon inspection approval.',
    'Project Record: Immutable digital history for warranty, resale, and future work.',
  ];

  const contractorBenefits = [
    'Qualified Demand: Real homeowners with pre-allocated capital ready to build.',
    'Clear Scope: Comprehensive specs eliminate hours of guessing and unpaid site visits.',
    'Real Budgets: Transparent client expectations before committing field resources.',
    'Fewer Wasted Estimates: 70%+ close rates on pre-scoped opportunities.',
    'Better-Fit Projects: Routed strictly by trade mastery and neighborhood capacity.',
    'Predictable Milestone Payment: Guaranteed escrow releases without chasing invoices.',
  ];

  return (
    <section className="w-full bg-[#FAFAFA] py-32 px-6 border-b border-gray-200">
      <div className="max-w-7xl mx-auto">
        <div className="max-w-3xl mb-16">
          <p className="font-mono text-xs uppercase tracking-widest text-gray-400 mb-3">
            Section 04 · Network Economics
          </p>
          <h2 className="text-3xl md:text-5xl font-serif text-black leading-tight mb-6">
            The network works because <br />
            both sides get better outcomes.
          </h2>
          <p className="font-sans text-gray-600 text-lg leading-relaxed">
            Lead generators pit five contractors against one homeowner in a race to the bottom. Socio aligns both sides around a single, verified project truth where everyone wins.
          </p>
        </div>

        <motion.div
          variants={bentoContainer}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, margin: '-100px' }}
          className="grid grid-cols-1 lg:grid-cols-11 gap-6 items-stretch"
        >
          {/* PROPERTY OWNERS */}
          <motion.div
            variants={bentoCard}
            className="lg:col-span-5 bg-white border border-gray-200 p-8 md:p-10 flex flex-col justify-between"
          >
            <div>
              <div className="flex items-center justify-between pb-4 border-b border-gray-200 mb-6">
                <span className="font-mono text-xs uppercase tracking-widest text-black font-semibold">
                  Property Owners
                </span>
                <span className="font-mono text-[11px] text-gray-400 uppercase">
                  Demand Side
                </span>
              </div>
              <h3 className="text-2xl font-serif text-black mb-6">
                What Owners Receive
              </h3>
              <ul className="space-y-4">
                {ownerBenefits.map((b, i) => (
                  <li key={i} className="flex items-start gap-3">
                    <span className="font-mono text-xs font-semibold text-black mt-0.5">0{i + 1}</span>
                    <span className="font-sans text-xs md:text-sm text-gray-600 leading-relaxed">
                      {b}
                    </span>
                  </li>
                ))}
              </ul>
            </div>
            <div className="mt-8 pt-6 border-t border-gray-100 flex items-center justify-between font-mono text-xs text-gray-400">
              <span>OUTCOME:</span>
              <span className="text-black font-semibold">ZERO CAPITAL SURPRISES</span>
            </div>
          </motion.div>

          {/* CENTRAL NEXUS: THE SOCIO PROJECT */}
          <motion.div
            variants={bentoCard}
            className="lg:col-span-1 bg-black text-white p-4 flex flex-col items-center justify-center text-center border border-black min-h-[140px] lg:min-h-full"
          >
            <span className="font-mono text-[10px] uppercase tracking-widest text-gray-400 mb-2 rotate-0 lg:-rotate-90">
              Connected Via
            </span>
            <div className="font-serif text-lg font-bold tracking-tight text-white my-2">
              SOCIO<br className="hidden lg:inline" />PROJECT
            </div>
            <span className="font-mono text-xs text-emerald-400 mt-2">
              ●
            </span>
          </motion.div>

          {/* CONTRACTORS */}
          <motion.div
            variants={bentoCard}
            className="lg:col-span-5 bg-white border border-gray-200 p-8 md:p-10 flex flex-col justify-between"
          >
            <div>
              <div className="flex items-center justify-between pb-4 border-b border-gray-200 mb-6">
                <span className="font-mono text-xs uppercase tracking-widest text-black font-semibold">
                  Contractors &amp; Trades
                </span>
                <span className="font-mono text-[11px] text-gray-400 uppercase">
                  Supply Side
                </span>
              </div>
              <h3 className="text-2xl font-serif text-black mb-6">
                What Contractors Receive
              </h3>
              <ul className="space-y-4">
                {contractorBenefits.map((b, i) => (
                  <li key={i} className="flex items-start gap-3">
                    <span className="font-mono text-xs font-semibold text-black mt-0.5">0{i + 1}</span>
                    <span className="font-sans text-xs md:text-sm text-gray-600 leading-relaxed">
                      {b}
                    </span>
                  </li>
                ))}
              </ul>
            </div>
            <div className="mt-8 pt-6 border-t border-gray-100 flex items-center justify-between font-mono text-xs text-gray-400">
              <span>OUTCOME:</span>
              <span className="text-black font-semibold">ZERO UNPAID ESTIMATING</span>
            </div>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}

export default TwoSidedNetwork;
