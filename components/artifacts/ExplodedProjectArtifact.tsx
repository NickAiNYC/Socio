'use client';

import { useState } from 'react';

export function ExplodedProjectArtifact() {
  const [exploded, setExploded] = useState(true);

  const satellites = [
    { label: 'PROPERTY', desc: 'Carroll Gardens Co-op · Tax Lot 354/19', active: true },
    { label: 'SCOPE', desc: 'CSI 09 20 00 · 42 Line Items Codified', active: true },
    { label: 'BUDGET', desc: '$85K–$105K Baseline Normalized', active: true },
    { label: 'CONTRACTORS', desc: '4 Brooklyn Vetted GCs Matched', active: true },
    { label: 'DOCUMENTS', desc: 'ACORD 25 COI & Alteration Agreement', active: true },
    { label: 'COMPLIANCE', desc: 'Managing Agent Work-Hour Rider Cleared', active: true },
    { label: 'MILESTONES', desc: 'MS-01 Prep → MS-04 Lien Waiver', active: true },
    { label: 'PAYMENTS', desc: 'Inspection-Gated Staged Rails', active: true },
    { label: 'CHANGES', desc: 'Zero Napkin Revisions · Digital Approval', active: true },
    { label: 'OUTCOME', desc: 'Audited Variance Recorded to Dataset', active: true },
  ];

  return (
    <div className="w-full bg-white border border-gray-200 shadow-xs overflow-hidden font-mono text-xs">
      {/* Console Bar */}
      <div className="px-6 py-3.5 bg-gray-50 border-b border-gray-200 flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <span className="w-2 h-2 bg-black" />
          <span className="font-bold text-black uppercase">
            EXPLODED AXONOMETRIC SCHEMA · DIGITAL PROJECT PRIMITIVE
          </span>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-[10px] text-gray-400 uppercase">[EXAMPLE ARTIFACT]</span>
          <button
            onClick={() => setExploded(!exploded)}
            className="bg-black text-white px-3 py-1 font-mono text-[10px] uppercase hover:bg-gray-800 transition-colors"
          >
            {exploded ? 'COLLAPSE RECORD ⤆' : 'EXPLODE ARCHITECTURE ⤇'}
          </button>
        </div>
      </div>

      <div className="p-6 sm:p-12 space-y-8 bg-[#FAFAFA]">
        {/* Central Core Object & Satellites */}
        <div className="relative max-w-4xl mx-auto flex flex-col items-center">
          {/* The Central Project Nexus */}
          <div className="w-full max-w-md p-6 bg-black text-white border border-black shadow-md text-center z-10 space-y-2">
            <span className="text-[10px] text-emerald-400 font-mono tracking-widest block uppercase">
              CENTRAL OPERATIONAL OBJECT
            </span>
            <h3 className="text-2xl sm:text-3xl font-serif tracking-tight">
              PROJECT [PRJ-7102-BK]
            </h3>
            <p className="font-sans text-xs text-gray-300">
              The single digital record governing scope, compliance, and capital.
            </p>
          </div>

          {/* Exploded Satellites Grid (Dynamic state based on toggle) */}
          <div
            className={`w-full grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3 mt-8 transition-all duration-500 ${
              exploded ? 'opacity-100 translate-y-0' : 'opacity-40 scale-95'
            }`}
          >
            {satellites.map((sat, idx) => (
              <div
                key={idx}
                className="p-3 bg-white border border-gray-200 hover:border-black transition-colors flex flex-col justify-between min-h-[90px]"
              >
                <div>
                  <span className="font-mono text-[9px] text-gray-400 uppercase block mb-1">
                    LAYER 0{idx + 1}
                  </span>
                  <span className="font-bold text-black text-xs block mb-1">
                    {sat.label}
                  </span>
                  <p className="font-sans text-[11px] text-gray-500 leading-snug">
                    {sat.desc}
                  </p>
                </div>
                <div className="mt-2 pt-1 border-t border-gray-100 flex items-center justify-between text-[9px] text-emerald-700 font-bold">
                  <span>ATTACHED</span>
                  <span>✓</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="pt-4 border-t border-gray-200 flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-[11px] text-gray-400 font-sans">
          <span>Instead of scattering details across emails, PDFs, and text threads.</span>
          <span className="font-mono">TEN GOVERNING SATELLITES UNIFIED</span>
        </div>
      </div>
    </div>
  );
}

export default ExplodedProjectArtifact;
