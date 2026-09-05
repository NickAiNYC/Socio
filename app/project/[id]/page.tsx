'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useParams } from 'next/navigation';

type TabKey = 'overview' | 'health' | 'economics' | 'variance' | 'milestones';

export default function ProjectRuntimePage() {
  const routeParams = useParams();
  const projectId = (routeParams?.id as string) || 'PRJ-7102-BK';
  const [activeTab, setActiveTab] = useState<TabKey>('overview');

  const healthMetrics = [
    { label: 'SCOPE DEFINITION', percent: 100, status: 'LOCKED', bar: 'bg-black' },
    { label: 'DOCUMENTATION & COI', percent: 92, status: 'BOARD SUBMITTED', bar: 'bg-black' },
    { label: 'CONTRACTOR FIT', percent: 100, status: 'LEVEL 5 VERIFIED', bar: 'bg-black' },
    { label: 'BUDGET CONTROL', percent: 81, status: 'NORMALIZED BASELINE', bar: 'bg-black' },
    { label: 'SCHEDULE VELOCITY', percent: 94, status: 'ON TRACK (WK 3 OF 6)', bar: 'bg-black' },
    { label: 'MILESTONE COMPLIANCE', percent: 100, status: 'DUAL SIGNOFF ENFORCED', bar: 'bg-black' },
  ];

  const economicPhases = [
    { label: '01. CREATED', value: '$85,000', note: 'Owner Target Budget', status: 'INITIATED' },
    { label: '02. SCOPE VALUE', value: '$84,500', note: 'CSI Division Normalization', status: 'STRUCTURED' },
    { label: '03. BID RANGE', value: '$81K – $88K', note: '3 Vetted Brooklyn Crews', status: 'COMPARED' },
    { label: '04. AWARDED GMV', value: '$84,500', note: 'Single Trade Contract', status: 'AWARDED' },
    { label: '05. ESCROW VOLUME', value: '$29,575', note: 'Milestone 02 Locked', status: 'ACTIVE' },
    { label: '06. COMPLETED', value: '$21,125', note: 'Milestone 01 Released', status: 'DISBURSED' },
    { label: '07. DESK TAKE-RATE', value: '$1,690', note: 'Flat Technology Fee (2%)', status: 'REVENUE' },
  ];

  const varianceIndex = [
    { metric: 'Cost Progression', estimated: '$85,000', contracted: '$84,500', actual: '$84,500', variance: '-0.6%', note: 'Zero unapproved change orders' },
    { metric: 'Schedule Duration', estimated: '6.0 Weeks', contracted: '6.0 Weeks', actual: '6.2 Weeks', variance: '+3.3%', note: '1 day delay due to building freight elevator reservation' },
    { metric: 'Scope Item Count', estimated: '12 Line Items', contracted: '12 Line Items', actual: '12 Line Items', variance: '0.0%', note: '100% adherence to CSI specification' },
  ];

  const milestones = [
    {
      id: 'MS-01',
      title: 'Substrate Demolition & Surface Prep',
      amount: '$21,125',
      allocation: '25% of GMV',
      status: 'RELEASED',
      date: 'Aug 24, 2026',
      proof: 'Hallway Masonite in place · Dust containment verified · Dual signoff executed',
    },
    {
      id: 'MS-02',
      title: 'Level 5 Plaster Restoration & Skim-Coat',
      amount: '$29,575',
      allocation: '35% of GMV',
      status: 'ESCROW_LOCKED',
      date: 'Target: Sep 08, 2026',
      proof: 'Capital locked in Stripe Connect rail · Awaiting on-site punch inspection',
    },
    {
      id: 'MS-03',
      title: 'Architectural Primer & Fine Paint Coating',
      amount: '$25,350',
      allocation: '30% of GMV',
      status: 'UPCOMING',
      date: 'Target: Sep 20, 2026',
      proof: 'Benjamin Moore Aura specs · Pre-ordered batch verification',
    },
    {
      id: 'MS-04',
      title: 'Final Detailing, Punchlist & Lien Waiver',
      amount: '$8,450',
      allocation: '10% Retainage',
      status: 'RETAINAGE',
      date: 'Target: Sep 28, 2026',
      proof: 'Final managing agent signoff & statutory NYS mechanic lien waiver execution',
    },
  ];

  return (
    <div className="min-h-screen bg-[#FAFAFA] pt-28 pb-24 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Navigation Breadcrumb & System Identity */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-gray-200">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <Link href="/" className="font-mono text-xs text-gray-400 hover:text-black transition-colors">
                ← SYSTEM RUNTIME
              </Link>
              <span className="text-gray-300">/</span>
              <span className="font-mono text-xs font-semibold text-black uppercase">
                PROJECT #{projectId}
              </span>
              <span className="font-mono text-[10px] bg-emerald-50 text-emerald-700 border border-emerald-200 px-2 py-0.5">
                ● LIVE ESCROW
              </span>
            </div>
            <h1 className="text-3xl sm:text-4xl font-serif text-black">
              172 Union Street · Carroll Gardens
            </h1>
            <p className="font-sans text-sm text-gray-500 mt-1">
              Pre-War Brownstone Co-op · Level 5 Plaster &amp; Finish Restoration · 1,450 sq ft
            </p>
          </div>

          {/* Operational Integrity Badges */}
          <div className="flex flex-wrap items-center gap-2 font-mono text-[10px] uppercase">
            <span className="bg-white border border-gray-300 text-black px-2.5 py-1 font-semibold">
              [LIVE] TELEMETRY
            </span>
            <span className="bg-gray-100 border border-gray-200 text-gray-600 px-2.5 py-1">
              [VERIFIED] DOB #89211
            </span>
            <span className="bg-gray-100 border border-gray-200 text-gray-600 px-2.5 py-1">
              [PILOT] BROOKLYN HUB
            </span>
          </div>
        </div>

        {/* Tab Controls */}
        <div className="flex border-b border-gray-200 overflow-x-auto gap-8 text-xs font-mono uppercase tracking-wider">
          {([
            { id: 'overview' as TabKey, label: '01. Project Primitive' },
            { id: 'health' as TabKey, label: '02. Project Health' },
            { id: 'economics' as TabKey, label: '03. Monetizable GMV' },
            { id: 'variance' as TabKey, label: '04. Variance Index' },
            { id: 'milestones' as TabKey, label: '05. Milestone Rails' },
          ] as const).map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`pb-4 transition-colors whitespace-nowrap ${
                activeTab === tab.id
                  ? 'border-b-2 border-black text-black font-bold'
                  : 'text-gray-400 hover:text-black'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* TAB 1: PROJECT PRIMITIVE (THE CENTRAL OBJECT) */}
        {activeTab === 'overview' && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 bg-white border border-gray-200 p-8 space-y-6">
              <div className="flex items-center justify-between pb-4 border-b border-gray-100">
                <span className="font-mono text-xs font-semibold text-black uppercase tracking-widest">
                  Active Project Schema
                </span>
                <span className="font-mono text-xs text-gray-400">INSTANTIATED: 2026-08-14</span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 text-xs font-mono">
                <div className="p-4 bg-[#FAFAFA] border border-gray-200/80">
                  <span className="text-gray-400 block mb-1">PROPERTY TAX LOT</span>
                  <p className="font-semibold text-black text-sm">Block 354 · Lot 19</p>
                  <p className="text-gray-500 mt-1 font-sans">Carroll Gardens Historic District</p>
                </div>

                <div className="p-4 bg-[#FAFAFA] border border-gray-200/80">
                  <span className="text-gray-400 block mb-1">CSI TRADE CLASSIFICATION</span>
                  <p className="font-semibold text-black text-sm">CSI 09 20 00</p>
                  <p className="text-gray-500 mt-1 font-sans">Plaster &amp; Gypsum Board Assemblies</p>
                </div>

                <div className="p-4 bg-[#FAFAFA] border border-gray-200/80">
                  <span className="text-gray-400 block mb-1">ASSIGNED TRADE CREW</span>
                  <p className="font-semibold text-black text-sm">Master Crew #41 · Brooklyn</p>
                  <p className="text-gray-500 mt-1 font-sans">14 Verified Brownstone Projects</p>
                </div>

                <div className="p-4 bg-[#FAFAFA] border border-gray-200/80">
                  <span className="text-gray-400 block mb-1">MANAGING AGENT COMPLIANCE</span>
                  <p className="font-semibold text-black text-sm">ACORD 25 Cleared</p>
                  <p className="text-gray-500 mt-1 font-sans">Alteration Agreement Executed</p>
                </div>
              </div>

              <div className="p-6 bg-[#FAFAFA] border border-gray-200">
                <h4 className="font-mono text-xs font-semibold text-black uppercase mb-3">
                  Scope Boundaries (In / Out / Unknown)
                </h4>
                <div className="space-y-2 text-xs font-sans text-gray-600">
                  <div className="flex items-start gap-2">
                    <span className="font-mono text-emerald-600 font-bold">[INCLUDED]</span>
                    <span>Removal of failing plaster down to original lath; 3-coat skim finish to Level 5 standard.</span>
                  </div>
                  <div className="flex items-start gap-2">
                    <span className="font-mono text-red-600 font-bold">[EXCLUDED]</span>
                    <span>Sub-floor joist leveling and electrical rough-ins (contracted separately under DOB Alteration II).</span>
                  </div>
                  <div className="flex items-start gap-2">
                    <span className="font-mono text-amber-600 font-bold">[UNKNOWN]</span>
                    <span>Cornice interior water staining (cleared post-inspection; zero structural repair needed).</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Quick Actions & Contact */}
            <div className="bg-white border border-gray-200 p-8 flex flex-col justify-between space-y-6">
              <div>
                <span className="font-mono text-xs text-gray-400 uppercase tracking-widest block mb-4">
                  Execution State
                </span>
                <h3 className="text-2xl font-serif text-black mb-2">Milestone 02 Active</h3>
                <p className="font-sans text-xs text-gray-500 leading-relaxed mb-6">
                  Funds for Phase 02 ($29,575) are locked in escrow. The trade crew is executing the finish skim coats.
                </p>

                <div className="space-y-3 font-mono text-xs">
                  <div className="flex items-center justify-between p-3 bg-gray-50 border border-gray-200">
                    <span className="text-gray-500">ESCROW STATUS</span>
                    <span className="font-semibold text-black">LOCKED ($29,575)</span>
                  </div>
                  <div className="flex items-center justify-between p-3 bg-gray-50 border border-gray-200">
                    <span className="text-gray-500">CURE PERIOD</span>
                    <span className="font-semibold text-black">3 BUSINESS DAYS</span>
                  </div>
                  <div className="flex items-center justify-between p-3 bg-gray-50 border border-gray-200">
                    <span className="text-gray-500">PUNCH INSPECTION</span>
                    <span className="font-semibold text-emerald-700">SCHEDULED</span>
                  </div>
                </div>
              </div>

              <div className="border-t border-gray-100 pt-6 space-y-3">
                <a
                  href="https://wa.me/16467504650?text=Consulta%20sobre%20proyecto%20PRJ-7102-BK"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full bg-black text-white font-sans text-xs font-medium py-3 px-4 flex items-center justify-center gap-2 hover:bg-gray-800 transition-colors"
                >
                  <span>WhatsApp Operations Desk</span>
                  <span className="font-mono">→</span>
                </a>
              </div>
            </div>
          </div>
        )}

        {/* TAB 2: PROJECT HEALTH MONITOR */}
        {activeTab === 'health' && (
          <div className="bg-white border border-gray-200 p-8 md:p-12 space-y-10">
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 pb-6 border-b border-gray-200">
              <div>
                <span className="font-mono text-xs uppercase tracking-widest text-gray-400 block mb-1">
                  Active Telemetry Layer
                </span>
                <h2 className="text-3xl font-serif text-black">
                  Project Health &amp; Governance Monitor
                </h2>
              </div>
              <div className="flex items-center gap-6 font-mono text-xs">
                <div>
                  <span className="text-gray-400 block">RISK INDEX</span>
                  <span className="text-emerald-700 font-bold text-lg">LOW (9.2/10)</span>
                </div>
                <div>
                  <span className="text-gray-400 block">VARIANCE</span>
                  <span className="text-black font-bold text-lg">-3.2%</span>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {healthMetrics.map((hm, idx) => (
                <div key={idx} className="p-6 bg-[#FAFAFA] border border-gray-200 flex flex-col justify-between">
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <span className="font-mono text-xs font-bold text-black uppercase">
                        {hm.label}
                      </span>
                      <span className="font-mono text-xs font-bold text-black">
                        {hm.percent}%
                      </span>
                    </div>
                    <div className="w-full bg-gray-200 h-2 mb-3">
                      <div className={`${hm.bar} h-2 transition-all duration-500`} style={{ width: `${hm.percent}%` }} />
                    </div>
                  </div>
                  <span className="font-mono text-[11px] text-gray-500 uppercase tracking-wide">
                    STATUS: {hm.status}
                  </span>
                </div>
              ))}
            </div>

            {/* Health Governance Diagnostics */}
            <div className="border border-gray-200 bg-[#FAFAFA] p-6 font-mono text-xs space-y-3">
              <span className="text-gray-400 uppercase tracking-widest block mb-2 font-semibold">
                Autonomous Diagnostics
              </span>
              <div className="flex items-center gap-3 text-emerald-800">
                <span>✓</span>
                <span>Scope Expansion: Baseline confirmed; zero unapproved change orders detected.</span>
              </div>
              <div className="flex items-center gap-3 text-emerald-800">
                <span>✓</span>
                <span>Bid Variance: Awarded contractor is within 1.2% of the initial Socio predictive benchmark.</span>
              </div>
              <div className="flex items-center gap-3 text-emerald-800">
                <span>✓</span>
                <span>Compliance Gate: ACORD 25 COI active; managing agent work-hour rider signed.</span>
              </div>
            </div>
          </div>
        )}

        {/* TAB 3: MONETIZABLE GMV & ECONOMICS */}
        {activeTab === 'economics' && (
          <div className="bg-white border border-gray-200 p-8 md:p-12 space-y-8">
            <div className="pb-6 border-b border-gray-200">
              <span className="font-mono text-xs uppercase tracking-widest text-gray-400 block mb-1">
                Transaction Lifecycle Economics
              </span>
              <h2 className="text-3xl font-serif text-black">
                The Project as a Monetizable Primitive
              </h2>
              <p className="font-sans text-sm text-gray-600 mt-2 max-w-2xl">
                Socio does not sell anonymous lead clicks. Socio participates in the transaction volume, earning revenue as milestones are securely verified and disbursed.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {economicPhases.map((phase, idx) => (
                <div key={idx} className="p-6 bg-[#FAFAFA] border border-gray-200 flex flex-col justify-between min-h-[160px]">
                  <div>
                    <span className="font-mono text-[10px] text-gray-400 uppercase tracking-widest block mb-2">
                      {phase.label}
                    </span>
                    <p className="text-3xl font-serif text-black mb-1">{phase.value}</p>
                    <p className="font-sans text-xs text-gray-500">{phase.note}</p>
                  </div>
                  <div className="mt-4 pt-3 border-t border-gray-200 font-mono text-[10px] text-black font-semibold">
                    STATUS: {phase.status}
                  </div>
                </div>
              ))}
            </div>

            <div className="p-6 bg-black text-white font-mono text-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <span className="text-emerald-400 font-bold block mb-1">ECONOMIC INTEGRITY PRINCIPLE</span>
                <p className="font-sans text-gray-300 text-xs">
                  Zero subscription barriers during pilot. Socio monetizes transaction infrastructure, milestone escrow, and project preparation.
                </p>
              </div>
              <span className="text-gray-400 text-right shrink-0">
                SCALES WITH GMV TRANSACTED
              </span>
            </div>
          </div>
        )}

        {/* TAB 4: SOCIO VARIANCE INDEX (DATA MOAT) */}
        {activeTab === 'variance' && (
          <div className="bg-white border border-gray-200 p-8 md:p-12 space-y-8">
            <div className="pb-6 border-b border-gray-200">
              <span className="font-mono text-xs uppercase tracking-widest text-gray-400 block mb-1">
                Empirical Feedback Telemetry
              </span>
              <h2 className="text-3xl font-serif text-black">
                Socio Variance Index: Initial Model vs. Reality
              </h2>
              <p className="font-sans text-sm text-gray-600 mt-2 max-w-2xl">
                Every project measures the accuracy of Socio&apos;s initial predictive model against contracted bids and final physical execution.
              </p>
            </div>

            <div className="space-y-4">
              {varianceIndex.map((row, idx) => (
                <div key={idx} className="p-6 bg-[#FAFAFA] border border-gray-200 space-y-4 font-mono text-xs">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-gray-200 pb-3">
                    <span className="font-bold text-black uppercase text-sm">{row.metric}</span>
                    <span className="text-emerald-700 bg-emerald-50 border border-emerald-200 px-2 py-0.5 font-bold">
                      VARIANCE: {row.variance}
                    </span>
                  </div>

                  <div className="grid grid-cols-3 gap-4 text-center">
                    <div className="p-3 bg-white border border-gray-200">
                      <span className="text-gray-400 block text-[10px] uppercase">ESTIMATED</span>
                      <span className="font-bold text-black text-sm">{row.estimated}</span>
                    </div>
                    <div className="p-3 bg-white border border-gray-200">
                      <span className="text-gray-400 block text-[10px] uppercase">CONTRACTED</span>
                      <span className="font-bold text-black text-sm">{row.contracted}</span>
                    </div>
                    <div className="p-3 bg-white border border-gray-200">
                      <span className="text-gray-400 block text-[10px] uppercase">ACTUAL / CURRENT</span>
                      <span className="font-bold text-black text-sm">{row.actual}</span>
                    </div>
                  </div>

                  <p className="font-sans text-xs text-gray-500 italic">
                    Diagnostic Note: {row.note}
                  </p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* TAB 5: MILESTONE RAILS */}
        {activeTab === 'milestones' && (
          <div className="bg-white border border-gray-200 p-8 md:p-12 space-y-8">
            <div className="pb-6 border-b border-gray-200">
              <span className="font-mono text-xs uppercase tracking-widest text-gray-400 block mb-1">
                Inspection-Gated Capital Release
              </span>
              <h2 className="text-3xl font-serif text-black">
                Staged Milestone Payment Rails
              </h2>
              <p className="font-sans text-sm text-gray-600 mt-2 max-w-2xl">
                Capital is never handed over blindly upfront. Funds are held in escrow and released strictly upon photographic and physical inspection clearance.
              </p>
            </div>

            <div className="space-y-4">
              {milestones.map((ms) => (
                <div
                  key={ms.id}
                  className="p-6 bg-[#FAFAFA] border border-gray-200 flex flex-col md:flex-row md:items-center justify-between gap-6"
                >
                  <div className="space-y-1 max-w-xl">
                    <div className="flex items-center gap-3">
                      <span className="font-mono text-xs font-bold text-black">{ms.id}</span>
                      <span className="font-mono text-[10px] px-2 py-0.5 border uppercase font-semibold text-gray-600 bg-white border-gray-300">
                        {ms.status}
                      </span>
                      <span className="font-mono text-xs text-gray-400">{ms.allocation}</span>
                    </div>
                    <h3 className="text-lg font-serif text-black">{ms.title}</h3>
                    <p className="font-sans text-xs text-gray-500 leading-relaxed">
                      Verification Criteria: {ms.proof}
                    </p>
                  </div>

                  <div className="text-right shrink-0">
                    <span className="text-2xl font-serif text-black block">{ms.amount}</span>
                    <span className="font-mono text-[11px] text-gray-400">{ms.date}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
