'use client';

import { useState } from 'react';

type Tab = 'project' | 'scope' | 'contractors' | 'documents' | 'milestones' | 'payments';

export function ProductShowcase() {
  const [activeTab, setActiveTab] = useState<Tab>('project');

  const tabs: { id: Tab; label: string }[] = [
    { id: 'project', label: 'PROJECT' },
    { id: 'scope', label: 'SCOPE' },
    { id: 'contractors', label: 'CONTRACTORS' },
    { id: 'documents', label: 'DOCUMENTS' },
    { id: 'milestones', label: 'MILESTONES' },
    { id: 'payments', label: 'PAYMENTS' },
  ];

  return (
    <section className="w-full bg-white py-32 px-6 border-b border-gray-200">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="max-w-3xl mb-16">
          <p className="font-mono text-xs uppercase tracking-widest text-gray-400 mb-3">
            One Project. One Source of Truth.
          </p>
          <h2 className="text-4xl sm:text-5xl md:text-6xl font-serif text-black leading-tight mb-6">
            Everything your renovation <br />needs, in one place.
          </h2>
          <p className="font-sans text-gray-600 text-lg leading-relaxed">
            Click through the project modules below to see how Socio unifies scope, contractor matching, board compliance, and payment rails into a single operational interface.
          </p>
        </div>

        {/* Product Console Mockup */}
        <div className="border border-gray-200 bg-[#FAFAFA] shadow-xs">
          {/* Tab Navigation */}
          <div className="border-b border-gray-200 bg-white px-6 flex items-center gap-6 overflow-x-auto">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`py-4 font-mono text-xs uppercase tracking-wider transition-colors whitespace-nowrap border-b-2 ${
                  activeTab === tab.id
                    ? 'border-black text-black font-bold'
                    : 'border-transparent text-gray-400 hover:text-black'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          {/* Tab Contents */}
          <div className="p-8 sm:p-12 min-h-[420px] flex flex-col justify-center">
            {/* 1. PROJECT OVERVIEW */}
            {activeTab === 'project' && (
              <div className="space-y-6 animate-in fade-in duration-300">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-gray-200 gap-2 font-mono text-xs">
                  <div>
                    <span className="text-gray-400 block text-[10px] uppercase">PROJECT RECORD</span>
                    <span className="text-black font-bold text-sm">PRJ-7102-BK · Carroll Gardens Co-op</span>
                  </div>
                  <span className="bg-emerald-50 text-emerald-800 border border-emerald-200 px-2 py-0.5 self-start sm:self-auto font-semibold">
                    STATUS: READY FOR BID
                  </span>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 font-mono text-xs">
                  <div className="p-4 bg-white border border-gray-200">
                    <span className="text-gray-400 block text-[10px] uppercase">PROPERTY TYPE</span>
                    <span className="font-bold text-black text-sm">Pre-War Co-op</span>
                    <span className="text-gray-500 text-[11px] block mt-1">1,450 sq ft · 3 Units</span>
                  </div>
                  <div className="p-4 bg-white border border-gray-200">
                    <span className="text-gray-400 block text-[10px] uppercase">TARGET BUDGET</span>
                    <span className="font-bold text-black text-sm">$85K – $105K</span>
                    <span className="text-gray-500 text-[11px] block mt-1">Baseline normalized</span>
                  </div>
                  <div className="p-4 bg-white border border-gray-200">
                    <span className="text-gray-400 block text-[10px] uppercase">MATCHED CREWS</span>
                    <span className="font-bold text-black text-sm">4 Brooklyn GCs</span>
                    <span className="text-gray-500 text-[11px] block mt-1">Level 5 verified</span>
                  </div>
                  <div className="p-4 bg-white border border-gray-200">
                    <span className="text-gray-400 block text-[10px] uppercase">DOCUMENTS</span>
                    <span className="font-bold text-black text-sm">8 Prepared</span>
                    <span className="text-gray-500 text-[11px] block mt-1">Board package ready</span>
                  </div>
                </div>

                <p className="font-sans text-xs text-gray-500 pt-2">
                  The project record aggregates property specifications, DOB filing history, and architectural guidelines into a single actionable brief.
                </p>
              </div>
            )}

            {/* 2. SCOPE SHEET */}
            {activeTab === 'scope' && (
              <div className="space-y-4 animate-in fade-in duration-300 font-mono text-xs">
                <div className="flex items-center justify-between pb-3 border-b border-gray-200">
                  <span className="font-bold text-black uppercase">CSI 09 20 00 · SPECIFICATION BREAKDOWN</span>
                  <span className="text-gray-400 text-[10px]">42 LINE ITEMS CODIFIED</span>
                </div>
                <div className="space-y-2 bg-white border border-gray-200 p-4">
                  <div className="flex items-center justify-between py-2 border-b border-gray-100">
                    <span>01. Demolition &amp; Historic Lath Extraction</span>
                    <span className="text-black font-semibold">[INCLUDED] · 1,450 SF</span>
                  </div>
                  <div className="flex items-center justify-between py-2 border-b border-gray-100">
                    <span>02. 3-Coat Skim Coat to USG Level 5 Specification</span>
                    <span className="text-black font-semibold">[INCLUDED] · Level 5 Standard</span>
                  </div>
                  <div className="flex items-center justify-between py-2 border-b border-gray-100">
                    <span>03. Structural Subfloor Joist Sistering</span>
                    <span className="text-red-600 font-semibold">[EXCLUDED] · DOB Alt-II Required</span>
                  </div>
                  <div className="flex items-center justify-between py-2">
                    <span>04. Behind-Wall Moisture Remediation Allowance</span>
                    <span className="text-amber-600 font-semibold">[UNKNOWN] · $2,500 Contingency Lock</span>
                  </div>
                </div>
                <p className="font-sans text-xs text-gray-500">
                  By defining scope down to CSI standards, Socio eliminates contractor guesswork and prevents unexpected mid-project change orders.
                </p>
              </div>
            )}

            {/* 3. CONTRACTOR MATCH */}
            {activeTab === 'contractors' && (
              <div className="space-y-4 animate-in fade-in duration-300 font-mono text-xs">
                <div className="flex items-center justify-between pb-3 border-b border-gray-200">
                  <span className="font-bold text-black uppercase">MATCHED CREWS (4 QUALIFIED MATCHES)</span>
                  <span className="text-emerald-700 font-bold bg-emerald-50 px-2 py-0.5 border border-emerald-200">
                    VERIFIED DOB RECORDS
                  </span>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="p-4 bg-white border border-gray-200 space-y-2">
                    <div className="flex justify-between items-center">
                      <span className="font-bold text-black text-sm">Apex Craft LLC</span>
                      <span className="text-emerald-700 font-bold">96% FIT</span>
                    </div>
                    <p className="font-sans text-xs text-gray-500">
                      12 Brownstone projects in Carroll Gardens · Clean DOB permit history · $2M General Liability active.
                    </p>
                  </div>
                  <div className="p-4 bg-white border border-gray-200 space-y-2">
                    <div className="flex justify-between items-center">
                      <span className="font-bold text-black text-sm">Vanguard Building Co.</span>
                      <span className="text-emerald-700 font-bold">93% FIT</span>
                    </div>
                    <p className="font-sans text-xs text-gray-500">
                      Pre-war co-op specialist · In-house architectural woodworking · Available starting Week 4.
                    </p>
                  </div>
                </div>
                <p className="font-sans text-xs text-gray-500">
                  Contractors are matched objectively on trade fit, geographical proximity, and co-op board compliance records.
                </p>
              </div>
            )}

            {/* 4. DOCUMENTS */}
            {activeTab === 'documents' && (
              <div className="space-y-4 animate-in fade-in duration-300 font-mono text-xs">
                <div className="flex items-center justify-between pb-3 border-b border-gray-200">
                  <span className="font-bold text-black uppercase">BOARD COMPLIANCE &amp; ALTERATION DOSSIER</span>
                  <span className="text-gray-500">8 / 8 REQUIRED FILES CLEARED</span>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 bg-white border border-gray-200 p-4">
                  <div className="flex items-center justify-between p-2 bg-gray-50">
                    <span>ACORD 25 Certificate of Insurance</span>
                    <span className="text-emerald-700 font-bold">✓ VERIFIED</span>
                  </div>
                  <div className="flex items-center justify-between p-2 bg-gray-50">
                    <span>Alteration Agreement Standard Rider</span>
                    <span className="text-emerald-700 font-bold">✓ SIGNED</span>
                  </div>
                  <div className="flex items-center justify-between p-2 bg-gray-50">
                    <span>EPA Lead-Safe RRP Certification</span>
                    <span className="text-emerald-700 font-bold">✓ ACTIVE</span>
                  </div>
                  <div className="flex items-center justify-between p-2 bg-gray-50">
                    <span>Managing Agent Work-Hour Schedule</span>
                    <span className="text-emerald-700 font-bold">✓ COMPLIANT</span>
                  </div>
                </div>
                <p className="font-sans text-xs text-gray-500">
                  Socio packages and audits every required building document prior to submittal, avoiding weeks of administrative back-and-forth.
                </p>
              </div>
            )}

            {/* 5. MILESTONES */}
            {activeTab === 'milestones' && (
              <div className="space-y-4 animate-in fade-in duration-300 font-mono text-xs">
                <div className="flex items-center justify-between pb-3 border-b border-gray-200">
                  <span className="font-bold text-black uppercase">STAGED MILESTONE SCHEDULE</span>
                  <span className="text-black font-semibold">TOTAL GMV: $84,500</span>
                </div>
                <div className="space-y-2 bg-white border border-gray-200 p-4">
                  <div className="flex items-center justify-between py-2 border-b border-gray-100">
                    <span>MS-01: Site Protection &amp; Surface Prep (25%)</span>
                    <span className="text-gray-400 font-semibold">$21,125 · DISBURSED</span>
                  </div>
                  <div className="flex items-center justify-between py-2 border-b border-gray-100 bg-emerald-50/50 px-2">
                    <span className="font-bold text-emerald-900">MS-02: Level 5 Plaster &amp; Skim Coating (35%)</span>
                    <span className="font-bold text-emerald-800">$29,575 · LOCKED IN ESCROW</span>
                  </div>
                  <div className="flex items-center justify-between py-2 border-b border-gray-100">
                    <span>MS-03: Architectural Finish &amp; Primer (30%)</span>
                    <span className="text-gray-400 font-semibold">$25,350 · UPCOMING</span>
                  </div>
                  <div className="flex items-center justify-between py-2">
                    <span>MS-04: Punch Inspection &amp; Final Lien Waiver (10%)</span>
                    <span className="text-gray-400 font-semibold">$8,450 · RETAINAGE</span>
                  </div>
                </div>
                <p className="font-sans text-xs text-gray-500">
                  Payments are locked into escrow rails and released only upon inspection and mutual owner and contractor sign-off.
                </p>
              </div>
            )}

            {/* 6. PAYMENTS */}
            {activeTab === 'payments' && (
              <div className="space-y-4 animate-in fade-in duration-300 font-mono text-xs">
                <div className="flex items-center justify-between pb-3 border-b border-gray-200">
                  <span className="font-bold text-black uppercase">PAYMENT RAILS &amp; ESCROW TELEMETRY</span>
                  <span className="text-black font-bold">100% AUDITABLE LEDGER</span>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div className="p-4 bg-white border border-gray-200">
                    <span className="text-gray-400 block text-[10px] uppercase">TOTAL CONTRACT</span>
                    <span className="text-2xl font-serif text-black font-bold">$84,500</span>
                    <span className="text-gray-500 text-[11px] block mt-1">Zero unapproved change orders</span>
                  </div>
                  <div className="p-4 bg-white border border-gray-200">
                    <span className="text-gray-400 block text-[10px] uppercase">LOCKED IN ESCROW</span>
                    <span className="text-2xl font-serif text-emerald-700 font-bold">$29,575</span>
                    <span className="text-gray-500 text-[11px] block mt-1">Held securely on Stripe rail</span>
                  </div>
                  <div className="p-4 bg-white border border-gray-200">
                    <span className="text-gray-400 block text-[10px] uppercase">DISBURSED TO DATE</span>
                    <span className="text-2xl font-serif text-black font-bold">$21,125</span>
                    <span className="text-gray-500 text-[11px] block mt-1">Released post-inspection</span>
                  </div>
                </div>
                <p className="font-sans text-xs text-gray-500">
                  Escrow rails ensure contractors know capital is funded, while owners retain 100% inspection control prior to release.
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}

export default ProductShowcase;
