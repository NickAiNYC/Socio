'use client';

import { DensityGridArtifact } from './artifacts/DensityGridArtifact';

export function CompliancePreview() {
  const complianceItems = [
    { label: 'COI (ACORD 25)', detail: 'Explicit $1M/$2M endorsements naming building & managing agent', status: 'VERIFIED' },
    { label: 'SCOPE PACKAGE', detail: 'Line-item CSI specifications with explicit boundaries', status: 'STRUCTURED' },
    { label: 'BUILDING RULES', detail: 'Hallway Masonite protection, elevator reservations & trash haul routes', status: 'CLEARED' },
    { label: 'WORK-HOUR SCHEDULE', detail: 'Strict 9:00 AM – 4:30 PM weekday compliance rider', status: 'SIGNED' },
    { label: 'LEAD-SAFE REQUIREMENTS', detail: 'EPA Lead-Safe RRP certified containment protocols', status: 'ACTIVE' },
    { label: 'MANAGING AGENT DOSSIER', detail: 'Standardized alteration agreement rider attached', status: 'CLEARED' },
  ];

  return (
    <section className="w-full bg-white py-32 px-6 border-b border-gray-200">
      <div className="max-w-7xl mx-auto space-y-28">
        {/* Header */}
        <div className="max-w-3xl">
          <p className="font-mono text-xs uppercase tracking-widest text-gray-400 mb-3">
            Built For NYC
          </p>
          <h2 className="text-4xl sm:text-5xl md:text-6xl font-serif text-black leading-tight mb-6">
            Renovating in New York isn&apos;t the same as renovating anywhere else.
          </h2>
          <p className="font-sans text-gray-600 text-lg leading-relaxed">
            Co-op boards, managing agents, DOB requirements, insurance riders, building quiet hours, and pre-war conditions create layers of friction. Socio organizes those requirements before they stall your job.
          </p>
        </div>

        {/* Alteration Package Artifact */}
        <div className="bg-[#FAFAFA] border border-gray-200 p-8 sm:p-12 shadow-xs">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-6 border-b border-gray-200 gap-2 font-mono text-xs mb-8">
            <div>
              <span className="font-bold text-black uppercase tracking-wider block">
                NYC BOARD &amp; ALTERATION COMPLIANCE DOSSIER
              </span>
              <span className="text-gray-400 text-[11px]">PROJECT #PRJ-7102-BK · PRE-WAR CO-OP SPECIFICATION</span>
            </div>
            <span className="bg-emerald-50 text-emerald-800 border border-emerald-200 px-2.5 py-0.5 font-semibold text-[10px] uppercase">
              ● 6 / 6 REQUIREMENTS CLEARED
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 font-mono text-xs">
            {complianceItems.map((item, idx) => (
              <div key={idx} className="p-5 bg-white border border-gray-200 flex flex-col justify-between space-y-3">
                <div>
                  <div className="flex items-center justify-between mb-1">
                    <span className="font-bold text-black uppercase">{item.label}</span>
                    <span className="text-emerald-700 font-bold">✓</span>
                  </div>
                  <p className="font-sans text-xs text-gray-500 leading-relaxed">
                    {item.detail}
                  </p>
                </div>
                <span className="text-[10px] text-gray-400 uppercase pt-2 border-t border-gray-100">
                  STATUS: {item.status}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Local Density Compounds Artifact */}
        <div className="space-y-8 border-t border-gray-200 pt-16">
          <div className="max-w-3xl space-y-2">
            <span className="font-mono text-xs font-semibold text-black uppercase tracking-widest block">
              LOCAL KNOWLEDGE COMPOUNDS
            </span>
            <h3 className="text-3xl sm:text-4xl font-serif text-black leading-snug">
              Density beats broad directories.
            </h3>
            <p className="font-sans text-sm sm:text-base text-gray-600 leading-relaxed">
              The more projects Socio coordinates in a neighborhood, the deeper our institutional memory of building rules, trusted trade crews, superintendent preferences, and historical alteration timelines becomes.
            </p>
          </div>

          <DensityGridArtifact />
        </div>
      </div>
    </section>
  );
}

export default CompliancePreview;
