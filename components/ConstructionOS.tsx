'use client';

import { ExplodedProjectArtifact } from './artifacts/ExplodedProjectArtifact';
import { DataMoatVisualArtifact } from './artifacts/DataMoatVisualArtifact';

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
            Socio connects the pieces that are normally scattered across contractors, architects, managing agents, paper documents, spreadsheets, email threads, and payment systems into one governing record.
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

        {/* The Compounding Data Feedback Moat Artifact */}
        <div className="space-y-6 border-t border-gray-200 pt-16">
          <div className="max-w-3xl space-y-2">
            <span className="font-mono text-xs font-semibold text-black uppercase tracking-widest block">
              ILLUSTRATIVE BENCHMARK · [PILOT DATASET n=14]
            </span>
            <h3 className="text-3xl sm:text-4xl font-serif text-black leading-snug">
              Every project makes the next one smarter.
            </h3>
            <p className="font-sans text-sm sm:text-base text-gray-600 leading-relaxed">
              Socio converts completed NYC renovation projects into an illustrative benchmark dataset. As pilot projects close out, variance telemetry refines predictive scopes, trade pricing, and schedule baselines for the next building.
            </p>
          </div>

          <DataMoatVisualArtifact />
        </div>
      </div>
    </section>
  );
}

export default ConstructionOS;
