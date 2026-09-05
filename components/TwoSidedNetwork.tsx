'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';

export function TwoSidedNetwork() {
  return (
    <section id="for-owners" className="w-full bg-[#FAFAFA] py-32 px-6 border-b border-gray-200">
      <div className="max-w-7xl mx-auto space-y-20">
        <div className="max-w-3xl">
          <p className="font-mono text-xs uppercase tracking-widest text-gray-400 mb-3">
            Two-Sided Alignment
          </p>
          <h2 className="text-4xl sm:text-5xl md:text-6xl font-serif text-black leading-tight mb-6">
            Aligned around one project truth.
          </h2>
          <p className="font-sans text-gray-600 text-lg leading-relaxed">
            Lead marketplaces pit contractors in a race to the bottom. Socio connects owners and contractors through structured projects where both sides win.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* FOR PROPERTY OWNERS */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-40px' }}
            transition={{ duration: 0.6 }}
            className="bg-white border border-gray-200 p-8 sm:p-12 flex flex-col justify-between"
          >
            <div>
              <div className="flex items-center justify-between pb-4 border-b border-gray-100 mb-6 font-mono text-xs">
                <span className="text-black font-bold uppercase tracking-widest">
                  FOR PROPERTY OWNERS
                </span>
                <span className="text-gray-400">DEMAND SIDE</span>
              </div>

              <h3 className="text-3xl font-serif text-black mb-3">
                Start with clarity.
              </h3>
              <p className="font-sans text-sm sm:text-base text-gray-600 leading-relaxed mb-8">
                Know what you’re building, what it should require, and who is qualified to build it before you commit capital or sign contracts.
              </p>

              {/* Owner Readiness Artifact */}
              <div className="p-6 bg-[#FAFAFA] border border-gray-200 space-y-4 font-mono text-xs mb-8">
                <div className="flex items-center justify-between border-b border-gray-200 pb-2">
                  <span className="font-bold text-black uppercase">PROJECT READINESS</span>
                  <span className="text-emerald-700 bg-emerald-50 border border-emerald-200 px-2 py-0.5 font-bold">
                    READY FOR BID
                  </span>
                </div>
                <div className="space-y-2">
                  <div className="flex justify-between text-gray-600">
                    <span>CSI Scope Definition</span>
                    <span className="font-bold text-black">100% (LOCKED)</span>
                  </div>
                  <div className="flex justify-between text-gray-600">
                    <span>Alteration &amp; Insurance Docs</span>
                    <span className="font-bold text-black">92% (VERIFIED)</span>
                  </div>
                  <div className="flex justify-between text-gray-600">
                    <span>Contractor Pre-Screening</span>
                    <span className="font-bold text-black">100% (VERIFIED)</span>
                  </div>
                  <div className="flex justify-between text-gray-600">
                    <span>Baseline Budget Model</span>
                    <span className="font-bold text-emerald-700">NORMALIZED</span>
                  </div>
                </div>
              </div>
            </div>

            <div>
              <Link
                href="/craft/estimate"
                className="w-full bg-black text-white font-mono text-xs uppercase tracking-wider py-4 px-6 hover:bg-gray-800 transition-colors flex items-center justify-between group"
              >
                <span>START A PROJECT</span>
                <span className="group-hover:translate-x-1 transition-transform">→</span>
              </Link>
            </div>
          </motion.div>

          {/* FOR CONTRACTORS */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-40px' }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="bg-white border border-gray-200 p-8 sm:p-12 flex flex-col justify-between"
          >
            <div>
              <div className="flex items-center justify-between pb-4 border-b border-gray-100 mb-6 font-mono text-xs">
                <span className="text-black font-bold uppercase tracking-widest">
                  FOR CONTRACTORS
                </span>
                <span className="text-gray-400">SUPPLY SIDE</span>
              </div>

              <h3 className="text-3xl font-serif text-black mb-3">
                Better projects. Less wasted estimating.
              </h3>
              <p className="font-sans text-sm sm:text-base text-gray-600 leading-relaxed mb-8">
                Receive structured opportunities with defined scope, transparent budgets, project requirements, and milestone payment structures.
              </p>

              {/* Contractor Opportunity Artifact */}
              <div className="p-6 bg-[#FAFAFA] border border-gray-200 space-y-4 font-mono text-xs mb-8">
                <div className="flex items-center justify-between border-b border-gray-200 pb-2">
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-black uppercase">NEW OPPORTUNITY</span>
                    <span className="text-gray-400 font-mono text-[10px]">#PRJ-7102-BK</span>
                  </div>
                  <span className="text-black bg-gray-100 border border-gray-200 px-2 py-0.5 text-[10px]">
                    CARROLL GARDENS · CO-OP
                  </span>
                </div>
                <div className="grid grid-cols-2 gap-3 text-[11px]">
                  <div>
                    <span className="text-gray-400 block text-[10px] uppercase">BUDGET RANGE</span>
                    <span className="font-bold text-black">$85K – $105K</span>
                  </div>
                  <div>
                    <span className="text-gray-400 block text-[10px] uppercase">SCOPE ITEMS</span>
                    <span className="font-bold text-black">42 DEFINED</span>
                  </div>
                  <div>
                    <span className="text-gray-400 block text-[10px] uppercase">TARGET DURATION</span>
                    <span className="font-bold text-black">14 WEEKS</span>
                  </div>
                  <div>
                    <span className="text-gray-400 block text-[10px] uppercase">CLIENT CAPITAL</span>
                    <span className="font-bold text-emerald-700">VERIFIED</span>
                  </div>
                </div>
              </div>
            </div>

            <div>
              <Link
                href="/contractors/join"
                className="w-full bg-white border border-gray-300 text-black font-mono text-xs uppercase tracking-wider py-4 px-6 hover:border-black transition-colors flex items-center justify-between group"
              >
                <span>I&apos;M A CONTRACTOR</span>
                <span className="group-hover:translate-x-1 transition-transform">→</span>
              </Link>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}

export default TwoSidedNetwork;
