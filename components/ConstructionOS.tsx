'use client';

import { ExplodedProjectArtifact } from './artifacts/ExplodedProjectArtifact';

export function ConstructionOS() {
  const pillars = [
    {
      step: '01',
      title: 'SCOPE',
      simple: 'Define exactly what you’re building.',
      detail: 'CSI line-item structure with unambiguous labor, materials, exclusions, and flagged site contingencies.',
    },
    {
      step: '02',
      title: 'MATCHING',
      simple: 'Find contractors who actually fit the project.',
      detail: 'Targeted matching based on trade specialization, active DOB permit history, and co-op board experience.',
    },
    {
      step: '03',
      title: 'COMPLIANCE',
      simple: 'Get the documentation your building requires.',
      detail: 'Standardized ACORD 25 COIs, lead-safe disclosures, and managing agent alteration riders pre-assembled.',
    },
    {
      step: '04',
      title: 'MILESTONES & PAYMENTS',
      simple: 'Connect payments to project milestones.',
      detail: 'Capital secured on milestone payment rails and disbursed strictly upon mutual inspection clearance.',
    },
  ];

  const loop = [
    { label: 'EXPECTED', desc: 'Predictive scope & baseline model' },
    { label: 'BID', desc: 'Normalized contractor submissions' },
    { label: 'EXECUTION', desc: 'Weekly milestone progression & logs' },
    { label: 'ACTUAL', desc: 'Final audited cost & duration' },
    { label: 'BENCHMARK', desc: 'Feeds model for next building' },
  ];

  const benchmarks = [
    { label: 'COST VARIANCE', value: '-0.6%', note: 'Initial model vs. final completion cost' },
    { label: 'SCHEDULE VARIANCE', value: '+3.3%', note: 'Factoring building freight elevator access' },
    { label: 'SCOPE VARIANCE', value: '0.0%', note: 'Zero unapproved change-order expansions' },
  ];

  return (
    <section id="the-os" className="w-full bg-[#FAFAFA] py-32 px-6 border-b border-gray-200">
      <div className="max-w-7xl mx-auto space-y-24">
        {/* Section Header */}
        <div className="max-w-3xl">
          <p className="font-mono text-xs uppercase tracking-widest text-gray-400 mb-3">
            The System Behind The Service
          </p>
          <h2 className="text-4xl sm:text-5xl md:text-6xl font-serif text-black leading-tight mb-6">
            Connecting what is <br />normally broken.
          </h2>
          <p className="font-sans text-gray-600 text-lg leading-relaxed">
            Socio connects the pieces that are normally scattered across contractors, architects, managing agents, paper documents, spreadsheets, email threads, and payment systems.
          </p>
        </div>

        {/* Signature Exploded Project Primitive Artifact */}
        <ExplodedProjectArtifact />

        {/* 4 Pillars Grid (Clean, minimalist architectural lines) */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 border-t border-gray-200 pt-16">
          {pillars.map((p) => (
            <div key={p.step} className="space-y-3 font-mono text-xs">
              <span className="text-gray-400 block font-semibold">[{p.step}]</span>
              <h3 className="font-bold text-black uppercase tracking-wider text-sm">
                {p.title}
              </h3>
              <p className="font-sans text-black font-semibold text-sm">
                {p.simple}
              </p>
              <p className="font-sans text-gray-500 leading-relaxed text-xs">
                {p.detail}
              </p>
            </div>
          ))}
        </div>

        {/* The Compounding Data Feedback Moat */}
        <div className="bg-white border border-gray-200 p-8 sm:p-12 shadow-xs space-y-12">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 pb-6 border-b border-gray-200">
            <div>
              <span className="font-mono text-xs uppercase tracking-widest text-gray-400 block mb-1">
                Empirical Feedback Moat
              </span>
              <h3 className="text-2xl sm:text-3xl font-serif text-black">
                Every project makes the next one smarter.
              </h3>
            </div>
            <p className="font-sans text-xs text-gray-500 max-w-md">
              Socio is actively building a project-level benchmark dataset across NYC residential renovations.
            </p>
          </div>

          {/* Flow Indicator: EXPECTED -> BID -> EXECUTION -> ACTUAL -> BENCHMARK */}
          <div className="grid grid-cols-1 sm:grid-cols-5 gap-4 font-mono text-xs">
            {loop.map((step, idx) => (
              <div key={idx} className="p-4 bg-[#FAFAFA] border border-gray-200 flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-bold text-black text-xs">{step.label}</span>
                    {idx < loop.length - 1 && (
                      <span className="text-gray-400 hidden sm:inline">→</span>
                    )}
                  </div>
                  <p className="font-sans text-[11px] text-gray-500 leading-relaxed">
                    {step.desc}
                  </p>
                </div>
                <span className="text-[10px] text-gray-400 mt-4 block">NODE 0{idx + 1}</span>
              </div>
            ))}
          </div>

          {/* Benchmark Variance Outputs */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 pt-4 border-t border-gray-100 font-mono text-xs">
            {benchmarks.map((b, idx) => (
              <div key={idx} className="p-4 bg-gray-50/70 border border-gray-200">
                <span className="text-gray-400 block text-[10px] uppercase mb-1">{b.label}</span>
                <span className="text-2xl font-serif text-black font-bold block mb-1">{b.value}</span>
                <span className="font-sans text-[11px] text-gray-500">{b.note}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

export default ConstructionOS;
