'use client';

import { motion } from 'framer-motion';
import { bentoContainer, bentoCard } from '@/components/Animations';

export function TheProblem() {
  const fragmentedSteps = [
    { role: 'OWNER', status: 'Ambiguous Initial Budget' },
    { role: 'Architect', status: 'Drawings Disconnected from Trade Pricing' },
    { role: 'Contractor', status: 'Napkin Estimates & Inflated Allowances' },
    { role: 'Subcontractor', status: 'Uncoordinated Execution & Site Delays' },
    { role: 'Managing Agent', status: 'Rejected Alteration Submissions' },
    { role: 'Insurance', status: 'Missing Riders & COI Deficiencies' },
    { role: 'DOB', status: 'Permit Variance & Code Friction' },
    { role: 'Payments', status: 'Unprotected Upfront Cash Outlays' },
    { role: 'Change Orders', status: 'Disputed 20–40% Budget Overruns' },
    { role: 'Completion', status: 'Unresolved Punch-Lists & Abandonment' },
  ];

  const socioSteps = [
    { label: 'OWNER', detail: 'Structured Project Initiation' },
    { label: 'SOCIO PROJECT', detail: 'Central Verified Digital Object' },
    { label: 'STANDARDIZED SCOPE', detail: 'CSI Division Breakdown · Included/Excluded/Unknown' },
    { label: 'VERIFIED CAPACITY', detail: 'Trade History · DOB Intelligence · License Audits' },
    { label: 'COMPLIANCE', detail: 'ACORD 25 COI Package & Alteration Agreement Rider' },
    { label: 'MILESTONES', detail: 'Staged Inspection Releases & Cure Periods' },
    { label: 'PAYMENT', detail: 'Escrow Rails · Zero Upfront Capital Exposure' },
    { label: 'PROJECT RECORD', detail: 'Permanent Empirical Benchmark for Future Projects' },
  ];

  return (
    <section id="how-it-works" className="w-full bg-white py-32 px-6 border-b border-gray-200">
      <div className="max-w-7xl mx-auto">
        <div className="max-w-3xl mb-16">
          <p className="font-mono text-xs uppercase tracking-widest text-gray-400 mb-3">
            Section 01 · Structural Breakdown
          </p>
          <h2 className="text-3xl md:text-5xl font-serif text-black leading-tight mb-6">
            Fragmented construction <br />
            versus a structured transaction.
          </h2>
          <p className="font-sans text-gray-600 text-lg leading-relaxed">
            NYC renovation does not fail because contractors are malicious or homeowners are unreasonable. It fails because the traditional process is an unstandardized, multi-party telephone game with zero shared data layer.
          </p>
        </div>

        <motion.div
          variants={bentoContainer}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, margin: '-100px' }}
          className="grid grid-cols-1 lg:grid-cols-2 gap-8"
        >
          {/* THE FRAGMENTED PROCESS */}
          <motion.div
            variants={bentoCard}
            className="bg-[#FAFAFA] border border-gray-200 p-8 md:p-10 flex flex-col justify-between"
          >
            <div>
              <div className="flex items-center justify-between pb-4 border-b border-gray-200 mb-6">
                <span className="font-mono text-xs uppercase tracking-widest text-red-700 font-semibold">
                  Traditional Approach
                </span>
                <span className="font-mono text-[11px] text-gray-400 uppercase">
                  10 Disjointed Hand-offs
                </span>
              </div>
              <h3 className="text-2xl font-serif text-black mb-3">
                The Friction Chain
              </h3>
              <p className="font-sans text-sm text-gray-500 mb-8 leading-relaxed">
                Information degrades at every step. Misaligned incentives create budget variance, managing agent rejections, and abandoned projects.
              </p>

              <div className="space-y-2.5">
                {fragmentedSteps.map((step, idx) => (
                  <div
                    key={idx}
                    className="flex flex-col sm:flex-row sm:items-center justify-between p-3 bg-white border border-gray-200/80 text-xs font-mono"
                  >
                    <div className="flex items-center gap-3">
                      <span className="text-gray-400 w-5">{String(idx + 1).padStart(2, '0')}</span>
                      <span className="font-semibold text-black uppercase">{step.role}</span>
                    </div>
                    <span className="text-gray-500 mt-1 sm:mt-0">{step.status}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="mt-8 pt-6 border-t border-gray-200 flex items-center justify-between font-mono text-xs text-red-700">
              <span>SYSTEM OUTCOME:</span>
              <span className="font-semibold">UNPREDICTABLE RISK</span>
            </div>
          </motion.div>

          {/* THE SOCIO MODEL */}
          <motion.div
            variants={bentoCard}
            className="bg-black text-white p-8 md:p-10 flex flex-col justify-between"
          >
            <div>
              <div className="flex items-center justify-between pb-4 border-b border-zinc-800 mb-6">
                <span className="font-mono text-xs uppercase tracking-widest text-emerald-400 font-semibold">
                  The Socio Operating Model
                </span>
                <span className="font-mono text-[11px] text-gray-400 uppercase">
                  Centralized Architecture
                </span>
              </div>
              <h3 className="text-2xl font-serif text-white mb-3">
                The Structured Transaction
              </h3>
              <p className="font-sans text-sm text-gray-400 mb-8 leading-relaxed">
                All participants coordinate through a single digital project object. Scope, compliance, inspection approvals, and payments are strictly governed.
              </p>

              <div className="space-y-2.5">
                {socioSteps.map((step, idx) => (
                  <div
                    key={idx}
                    className="flex flex-col sm:flex-row sm:items-center justify-between p-3 bg-zinc-900 border border-zinc-800 text-xs font-mono"
                  >
                    <div className="flex items-center gap-3">
                      <span className="text-emerald-400 w-5">{String(idx + 1).padStart(2, '0')}</span>
                      <span className="font-semibold text-white uppercase">{step.label}</span>
                    </div>
                    <span className="text-gray-400 mt-1 sm:mt-0">{step.detail}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="mt-8 pt-6 border-t border-zinc-800 flex items-center justify-between font-mono text-xs text-emerald-400">
              <span>SYSTEM OUTCOME:</span>
              <span className="font-semibold">PREDICTABLE TRANSACTION</span>
            </div>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}

export default TheProblem;
