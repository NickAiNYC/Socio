'use client';

import { motion } from 'framer-motion';
import { bentoContainer, bentoCard } from '@/components/Animations';

export function TrustVerification() {
  const categories = [
    {
      target: 'PROPERTY',
      badge: 'Context Verification',
      checks: [
        { label: 'Address & Typology', detail: 'Cross-referenced against NYC Department of Finance & tax lot records' },
        { label: 'Building Classification', detail: 'Identified as landmarked, historic district, pre-war co-op, or condo' },
        { label: 'Alteration Guidelines', detail: 'Specific managing agent work-hour, elevator, and protection rules' },
        { label: 'DOB Public History', detail: 'Active job filings, open permits, and past alteration approvals' },
      ],
    },
    {
      target: 'CONTRACTOR',
      badge: 'Credential Verification',
      checks: [
        { label: 'Entity & Identity', detail: 'Verified NY Department of State active registration and tax ID' },
        { label: 'Trade Specialization', detail: 'Direct inspection of past finishes (e.g. Level 5 skim, historic masonry)' },
        { label: 'Insurance Verification', detail: 'ACORD 25 certificates vetted for $1M/$2M limits and statutory workers’ comp' },
        { label: 'NYC Track Record', detail: 'Minimum 5+ years verified physical execution across Brooklyn and Queens' },
      ],
    },
    {
      target: 'PROJECT',
      badge: 'Transaction Verification',
      checks: [
        { label: 'Normalized Scope', detail: 'Zero ambiguous line items; explicit included/excluded trade boundaries' },
        { label: 'Board Documentation', detail: 'Pre-assembled COI and alteration agreement riders submitted directly' },
        { label: 'Milestone Execution', detail: 'Physical photo telemetry and dual signoff required for phase clearance' },
        { label: 'Escrow Security', detail: 'Capital held safely in dedicated escrow rails until inspection signoff' },
      ],
    },
  ];

  return (
    <section className="w-full bg-white py-32 px-6 border-b border-gray-200">
      <div className="max-w-7xl mx-auto">
        <div className="max-w-3xl mb-16">
          <p className="font-mono text-xs uppercase tracking-widest text-gray-400 mb-3">
            Section 09 · Verification Infrastructure
          </p>
          <h2 className="text-3xl md:text-5xl font-serif text-black leading-tight mb-6">
            Trust is not a decorative badge. <br />
            It is a verification system.
          </h2>
          <p className="font-sans text-gray-600 text-lg leading-relaxed">
            Lead platforms rely on unverified self-reported reviews. Socio audits property context, contractor credentials, and project milestone events against objective public records and physical inspection signoffs.
          </p>
        </div>

        <motion.div
          variants={bentoContainer}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, margin: '-100px' }}
          className="grid grid-cols-1 md:grid-cols-3 gap-8"
        >
          {categories.map((cat, idx) => (
            <motion.div
              key={idx}
              variants={bentoCard}
              className="bg-[#FAFAFA] border border-gray-200 p-8 md:p-10 flex flex-col justify-between hover:border-black transition-colors"
            >
              <div>
                <div className="flex items-center justify-between pb-4 border-b border-gray-200 mb-6">
                  <span className="font-mono text-xs font-bold text-black tracking-widest uppercase">
                    {cat.target}
                  </span>
                  <span className="font-mono text-[10px] bg-white text-gray-600 px-2.5 py-1 border border-gray-200 uppercase tracking-widest">
                    {cat.badge}
                  </span>
                </div>

                <div className="space-y-4">
                  {cat.checks.map((c, i) => (
                    <div key={i} className="border-b border-gray-200/60 pb-3 last:border-0">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="w-1.5 h-1.5 bg-black shrink-0" />
                        <span className="font-mono text-xs font-semibold text-black">{c.label}</span>
                      </div>
                      <p className="font-sans text-xs text-gray-500 pl-3.5 leading-relaxed">
                        {c.detail}
                      </p>
                    </div>
                  ))}
                </div>
              </div>

              <div className="mt-8 pt-4 border-t border-gray-200 flex items-center justify-between font-mono text-xs text-gray-400">
                <span>AUDIT CRITERIA</span>
                <span className="text-black font-semibold">100% ENFORCED</span>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}

export default TrustVerification;
