'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import {
  getProject,
  awardContractor,
  verifyMilestone,
  disburseMilestone,
  submitContractorBid,
  SocioProject,
} from '@/lib/projectStore';
import { trackEvent } from '@/lib/analytics';

type TabKey = 'overview' | 'health' | 'economics' | 'variance' | 'milestones';

export default function ProjectRuntimePage() {
  const routeParams = useParams();
  const rawId = (routeParams?.id as string) || 'PRJ-7102-BK';
  const projectId = decodeURIComponent(rawId);

  const [project, setProject] = useState<SocioProject>(() => getProject(projectId));
  const [activeTab, setActiveTab] = useState<TabKey>('overview');
  const [showBidModal, setShowBidModal] = useState<boolean>(false);
  const [bidForm, setBidForm] = useState({
    contractorName: '',
    license: '',
    amount: '',
    specialty: '',
  });

  // Re-fetch project when route param changes
  useEffect(() => {
    setProject(getProject(projectId));
    trackEvent('contractor_match_viewed', { projectId });
  }, [projectId]);

  const handleAward = (contractorId: string) => {
    const updated = awardContractor(project.id, contractorId);
    setProject(updated);
    trackEvent('project_awarded', { projectId: project.id, contractorId });
  };

  const handleVerify = (milestoneId: string) => {
    const updated = verifyMilestone(project.id, milestoneId);
    setProject(updated);
  };

  const handleDisburse = (milestoneId: string) => {
    const updated = disburseMilestone(project.id, milestoneId);
    setProject(updated);
  };

  const handleBidSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const amountNum = parseInt(bidForm.amount.replace(/[^0-9]/g, '')) || project.budget.target;
    const updated = submitContractorBid(project.id, {
      contractorName: bidForm.contractorName || 'New York Fine Finishes',
      license: bidForm.license || 'NYC DOB Lic #Verified',
      amount: amountNum,
      specialty: bidForm.specialty || project.scope.trade,
    });
    setProject(updated);
    setShowBidModal(false);
    trackEvent('bid_submitted', { projectId: project.id, amount: amountNum });
  };

  const healthMetrics = [
    { label: 'SCOPE DEFINITION', percent: 100, status: 'LOCKED', bar: 'bg-black' },
    { label: 'DOCUMENTATION & COI', percent: 92, status: 'BOARD SUBMITTED', bar: 'bg-black' },
    { label: 'CONTRACTOR FIT', percent: project.awardedContractorId ? 100 : 94, status: project.awardedContractorId ? 'AWARDED & VERIFIED' : 'TOP MATCH READY', bar: 'bg-black' },
    { label: 'BUDGET CONTROL', percent: 88, status: 'NORMALIZED BASELINE', bar: 'bg-black' },
    { label: 'SCHEDULE VELOCITY', percent: 94, status: 'ON TRACK', bar: 'bg-black' },
    { label: 'MILESTONE COMPLIANCE', percent: 100, status: 'DUAL SIGNOFF ENFORCED', bar: 'bg-black' },
  ];

  const economicPhases = [
    { label: '01. CREATED', value: `$${project.budget.target.toLocaleString()}`, note: 'Owner Target Baseline', status: 'INITIATED' },
    { label: '02. SCOPE VALUE', value: `$${project.budget.normalizedMin.toLocaleString()} – $${project.budget.normalizedMax.toLocaleString()}`, note: 'CSI Division Normalization', status: 'STRUCTURED' },
    { label: '03. BID RANGE', value: `$${Math.round(project.budget.target * 0.96).toLocaleString()} – $${Math.round(project.budget.target * 1.04).toLocaleString()}`, note: `${project.contractors.length} Vetted NYC Crews`, status: 'COMPARED' },
    { label: '04. AWARDED GMV', value: `$${project.budget.awardedGmv.toLocaleString()}`, note: project.awardedContractorId ? 'Contract Executed' : 'Awaiting Selection', status: project.awardedContractorId ? 'AWARDED' : 'PENDING' },
    { label: '05. CAPITAL ON RAILS', value: `$${project.budget.activeRailAmount.toLocaleString()}`, note: 'Active Milestone Rail', status: 'SECURED' },
    { label: '06. COMPLETED', value: `$${project.budget.disbursed.toLocaleString()}`, note: 'Inspection Disbursed', status: project.budget.disbursed > 0 ? 'DISBURSED' : 'PENDING' },
    { label: '07. PLATFORM TAKE-RATE', value: `$${Math.round(project.budget.awardedGmv * 0.02).toLocaleString()}`, note: 'Flat Technology Fee (2%)', status: 'REVENUE' },
  ];

  const varianceIndex = [
    {
      metric: 'Cost Progression',
      estimated: `$${project.budget.target.toLocaleString()}`,
      contracted: `$${project.budget.awardedGmv.toLocaleString()}`,
      actual: `$${project.budget.awardedGmv.toLocaleString()}`,
      variance: project.telemetry.costVariance,
      note: 'Zero unapproved change orders detected; CSI scope adhered to.',
    },
    {
      metric: 'Schedule Duration',
      estimated: '6.0 Weeks',
      contracted: '6.0 Weeks',
      actual: '6.2 Weeks',
      variance: project.telemetry.scheduleVariance,
      note: 'Building freight elevator reservation schedule accounted for.',
    },
    {
      metric: 'Scope Line Items',
      estimated: `${project.scope.items.length} Items`,
      contracted: `${project.scope.items.length} Items`,
      actual: `${project.scope.items.length} Items`,
      variance: '0.0%',
      note: '100% adherence to CSI specifications without field revisions.',
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
                PROJECT #{project.id}
              </span>
              <span className="font-mono text-[10px] bg-emerald-50 text-emerald-700 border border-emerald-200 px-2 py-0.5 uppercase font-semibold">
                ● {project.lifecycleState.replace('_', ' ')}
              </span>
            </div>
            <h1 className="text-3xl sm:text-4xl font-serif text-black">
              {project.property.address} · {project.property.neighborhood}
            </h1>
            <p className="font-sans text-sm text-gray-500 mt-1">
              {project.property.type} · {project.scope.trade} · {project.property.squareFeet.toLocaleString()} SF · {project.property.taxLot}
            </p>
          </div>

          {/* Operational Integrity Badges */}
          <div className="flex flex-wrap items-center gap-2 font-mono text-[10px] uppercase">
            <span className="bg-white border border-gray-300 text-black px-2.5 py-1 font-semibold">
              [LIVE] TELEMETRY
            </span>
            <span className="bg-emerald-50 border border-emerald-200 text-emerald-800 px-2.5 py-1">
              [CSI] {project.scope.csiCode}
            </span>
            <span className="bg-gray-100 border border-gray-200 text-gray-600 px-2.5 py-1">
              [{project.property.borough.toUpperCase()}] HUB
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
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            <div className="lg:col-span-8 bg-white border border-gray-200 p-8 space-y-6">
              <div className="flex items-center justify-between pb-4 border-b border-gray-100 font-mono text-xs">
                <span className="font-semibold text-black uppercase tracking-widest">
                  Active Project Schema
                </span>
                <span className="text-gray-400">INSTANTIATED: {project.createdAt}</span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs font-mono">
                <div className="p-4 bg-[#FAFAFA] border border-gray-200">
                  <span className="text-gray-400 block mb-1">PROPERTY TAX LOT</span>
                  <p className="font-semibold text-black text-sm">{project.property.taxLot}</p>
                  <p className="text-gray-500 mt-1 font-sans">{project.property.neighborhood}, {project.property.borough}</p>
                </div>

                <div className="p-4 bg-[#FAFAFA] border border-gray-200">
                  <span className="text-gray-400 block mb-1">CSI TRADE CLASSIFICATION</span>
                  <p className="font-semibold text-black text-sm">{project.scope.csiCode}</p>
                  <p className="text-gray-500 mt-1 font-sans">{project.scope.trade}</p>
                </div>

                <div className="p-4 bg-[#FAFAFA] border border-gray-200">
                  <span className="text-gray-400 block mb-1">ASSIGNED CONTRACTOR</span>
                  <p className="font-semibold text-black text-sm">
                    {project.contractors.find((c) => c.id === project.awardedContractorId)?.name || 'Matching Vetted GCs...'}
                  </p>
                  <p className="text-gray-500 mt-1 font-sans">
                    {project.awardedContractorId ? 'Contract Executed · Mobilization Ready' : `${project.contractors.length} Bids in Review`}
                  </p>
                </div>

                <div className="p-4 bg-[#FAFAFA] border border-gray-200">
                  <span className="text-gray-400 block mb-1">MANAGING AGENT COMPLIANCE</span>
                  <p className="font-semibold text-black text-sm">ACORD 25 Cleared</p>
                  <p className="text-gray-500 mt-1 font-sans">Alteration Agreement Executed</p>
                </div>
              </div>

              {/* Scope Inclusions / Exclusions */}
              <div className="p-6 bg-[#FAFAFA] border border-gray-200 space-y-3">
                <h4 className="font-mono text-xs font-semibold text-black uppercase">
                  Scope Boundaries (Included / Excluded / Unknown)
                </h4>
                <div className="space-y-2 text-xs font-sans text-gray-600">
                  {project.scope.items.map((item) => (
                    <div key={item.id} className="flex items-start gap-2">
                      <span
                        className={`font-mono font-bold text-[10px] px-1.5 py-0.5 border ${
                          item.type === 'INCLUDED'
                            ? 'text-emerald-700 bg-emerald-50 border-emerald-200'
                            : item.type === 'EXCLUDED'
                            ? 'text-red-700 bg-red-50 border-red-200'
                            : 'text-amber-700 bg-amber-50 border-amber-200'
                        }`}
                      >
                        [{item.type}]
                      </span>
                      <span>
                        <strong className="text-black font-medium">{item.category}:</strong> {item.spec}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Contractor Match & Bidding Console */}
              <div className="border-t border-gray-200 pt-6 space-y-4">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 font-mono text-xs">
                  <div>
                    <span className="font-bold text-black uppercase block">
                      CONTRACTOR SELECTION &amp; BID COMPARISON
                    </span>
                    <span className="text-gray-400 text-[10px]">
                      Normalized against CSI line-item scope
                    </span>
                  </div>
                  <button
                    onClick={() => setShowBidModal(true)}
                    className="px-3 py-1.5 bg-white border border-gray-300 text-black hover:border-black font-mono text-[10px] uppercase transition-colors"
                  >
                    + SUBMIT CONTRACTOR BID
                  </button>
                </div>

                <div className="space-y-3">
                  {project.contractors.map((c) => {
                    const isAwarded = c.id === project.awardedContractorId;
                    return (
                      <div
                        key={c.id}
                        className={`p-4 border transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-4 ${
                          isAwarded
                            ? 'bg-emerald-50/50 border-emerald-300 ring-1 ring-emerald-400'
                            : 'bg-white border-gray-200 hover:border-gray-300'
                        }`}
                      >
                        <div className="space-y-1">
                          <div className="flex items-center gap-2">
                            <span className="font-mono text-xs font-bold text-black">{c.name}</span>
                            <span className="text-[10px] font-mono text-emerald-800 bg-emerald-50 border border-emerald-200 px-1.5 py-0.2">
                              {c.fitScore}% FIT
                            </span>
                            {isAwarded && (
                              <span className="text-[10px] font-mono bg-black text-white px-2 py-0.2 uppercase font-bold">
                                AWARDED
                              </span>
                            )}
                          </div>
                          <p className="font-sans text-xs text-gray-500">
                            {c.license} · {c.specialty} · {c.completedJobs} Verified NYC Projects
                          </p>
                        </div>

                        <div className="flex items-center gap-4 shrink-0">
                          <div className="text-right">
                            <span className="font-serif text-lg text-black font-bold block">
                              ${c.bidAmount.toLocaleString()}
                            </span>
                            <span className="font-mono text-[10px] text-gray-400 uppercase">
                              {c.bidStatus}
                            </span>
                          </div>

                          {!isAwarded && (
                            <button
                              onClick={() => handleAward(c.id)}
                              className="px-3.5 py-2 bg-black text-white font-mono text-[10px] uppercase tracking-wider hover:bg-gray-800 transition-colors"
                            >
                              AWARD CONTRACT →
                            </button>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>

            {/* Quick Actions & Telemetry Card */}
            <div className="lg:col-span-4 bg-white border border-gray-200 p-8 flex flex-col justify-between space-y-6">
              <div>
                <span className="font-mono text-xs text-gray-400 uppercase tracking-widest block mb-3">
                  Capital &amp; Milestone Rails
                </span>
                <h3 className="text-2xl font-serif text-black mb-1">
                  ${project.budget.activeRailAmount.toLocaleString()} Active Rail
                </h3>
                <p className="font-sans text-xs text-gray-500 leading-relaxed mb-6">
                  Capital is locked on milestone payment rails and released strictly upon photographic punchlist clearance.
                </p>

                <div className="space-y-3 font-mono text-xs">
                  <div className="flex items-center justify-between p-3 bg-gray-50 border border-gray-200">
                    <span className="text-gray-500 uppercase text-[10px]">TOTAL AWARDED GMV</span>
                    <span className="font-semibold text-black">${project.budget.awardedGmv.toLocaleString()}</span>
                  </div>
                  <div className="flex items-center justify-between p-3 bg-gray-50 border border-gray-200">
                    <span className="text-gray-500 uppercase text-[10px]">TOTAL DISBURSED</span>
                    <span className="font-semibold text-emerald-700">${project.budget.disbursed.toLocaleString()}</span>
                  </div>
                  <div className="flex items-center justify-between p-3 bg-gray-50 border border-gray-200">
                    <span className="text-gray-500 uppercase text-[10px]">PUNCH INSPECTION</span>
                    <span className="font-semibold text-black">DUAL CLEARANCE</span>
                  </div>
                </div>
              </div>

              <div className="border-t border-gray-100 pt-6 space-y-3">
                <a
                  href={`https://wa.me/16467504650?text=Socio%20Project%20Desk%20Inquiry%20#${project.id}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full bg-black text-white font-mono text-xs uppercase py-3.5 px-4 flex items-center justify-center gap-2 hover:bg-gray-800 transition-colors"
                >
                  <span>WhatsApp Project Desk</span>
                  <span>→</span>
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
                  <span className="text-emerald-700 font-bold text-lg">LOW (9.4/10)</span>
                </div>
                <div>
                  <span className="text-gray-400 block">VARIANCE</span>
                  <span className="text-black font-bold text-lg">{project.telemetry.costVariance}</span>
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
                The Project as a Monetizable Unit
              </h2>
              <p className="font-sans text-sm text-gray-600 mt-2 max-w-2xl">
                Socio monetizes transaction volume through standardized milestone payment rails and project preparation rather than charging for lead clicks.
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
          </div>
        )}

        {/* TAB 4: SOCIO VARIANCE INDEX (ILLUSTRATIVE BENCHMARK) */}
        {activeTab === 'variance' && (
          <div className="bg-white border border-gray-200 p-8 md:p-12 space-y-8">
            <div className="pb-6 border-b border-gray-200">
              <span className="font-mono text-xs uppercase tracking-widest text-gray-400 block mb-1">
                ILLUSTRATIVE BENCHMARK · [PILOT DATASET n=14]
              </span>
              <h2 className="text-3xl font-serif text-black">
                Socio Variance Index: Initial Model vs. Physical Reality
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
            <div className="pb-6 border-b border-gray-200 flex flex-col sm:flex-row sm:items-end justify-between gap-4">
              <div>
                <span className="font-mono text-xs uppercase tracking-widest text-gray-400 block mb-1">
                  Inspection-Gated Capital Release
                </span>
                <h2 className="text-3xl font-serif text-black">
                  Staged Milestone Payment Rails
                </h2>
                <p className="font-sans text-sm text-gray-600 mt-2 max-w-2xl">
                  Capital is secured on payment rails and disbursed strictly upon mutual photographic inspection clearance.
                </p>
              </div>
              <div className="font-mono text-xs text-right">
                <span className="text-gray-400 block text-[10px] uppercase">DISBURSED CAPITAL</span>
                <span className="text-2xl font-serif text-emerald-800 font-bold">
                  ${project.budget.disbursed.toLocaleString()} / ${project.budget.awardedGmv.toLocaleString()}
                </span>
              </div>
            </div>

            <div className="space-y-4">
              {project.milestones.map((ms) => {
                const isFunded = ms.status === 'FUNDED_ON_RAIL';
                const isVerified = ms.status === 'VERIFIED';
                const isDisbursed = ms.status === 'DISBURSED';

                return (
                  <div
                    key={ms.id}
                    className={`p-6 border transition-all flex flex-col lg:flex-row lg:items-center justify-between gap-6 ${
                      isDisbursed
                        ? 'bg-white border-gray-200'
                        : isFunded || isVerified
                        ? 'bg-emerald-50/40 border-emerald-300 ring-1 ring-emerald-300'
                        : 'bg-[#FAFAFA] border-gray-200 opacity-60'
                    }`}
                  >
                    <div className="space-y-1 max-w-xl font-mono text-xs">
                      <div className="flex items-center gap-3">
                        <span className="font-bold text-black">{ms.id}</span>
                        <span
                          className={`text-[10px] px-2 py-0.5 border uppercase font-semibold ${
                            isDisbursed
                              ? 'text-gray-500 bg-gray-50 border-gray-200'
                              : isVerified
                              ? 'text-emerald-900 bg-emerald-100 border-emerald-300'
                              : isFunded
                              ? 'text-black bg-white border-black font-bold'
                              : 'text-gray-400 bg-gray-50 border-gray-200'
                          }`}
                        >
                          ● {ms.status.replace('_', ' ')}
                        </span>
                        <span className="text-gray-400">{ms.allocationPercent}% OF CONTRACT</span>
                      </div>
                      <h3 className="text-lg font-serif text-black">{ms.title}</h3>
                      <p className="font-sans text-xs text-gray-500 leading-relaxed">
                        Verification Gate: {ms.verificationProof}
                      </p>
                    </div>

                    <div className="flex items-center gap-6 justify-between lg:justify-end shrink-0">
                      <div className="text-right font-mono">
                        <span className="text-2xl font-serif text-black block">
                          ${ms.amount.toLocaleString()}
                        </span>
                        <span className="text-[11px] text-gray-400">{ms.targetDate}</span>
                      </div>

                      {/* Interactive Simulation Controls */}
                      <div className="space-y-2">
                        {isFunded && (
                          <button
                            onClick={() => handleVerify(ms.id)}
                            className="w-full px-4 py-2.5 bg-black text-white font-mono text-[10px] uppercase hover:bg-gray-800 transition-colors"
                          >
                            SIMULATE PUNCHLIST PASS →
                          </button>
                        )}
                        {isVerified && (
                          <button
                            onClick={() => handleDisburse(ms.id)}
                            className="w-full px-4 py-2.5 bg-emerald-700 text-white font-mono text-[10px] uppercase hover:bg-emerald-800 transition-colors font-bold"
                          >
                            RELEASE PAYMENT (${ms.amount.toLocaleString()}) →
                          </button>
                        )}
                        {isDisbursed && (
                          <span className="text-emerald-700 font-mono text-xs font-bold block text-right">
                            ✓ DISBURSED &amp; ARCHIVED
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </div>

      {/* Contractor Bid Submission Modal */}
      {showBidModal && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white border border-black p-6 sm:p-8 max-w-lg w-full font-mono text-xs space-y-5">
            <div className="flex items-center justify-between pb-3 border-b border-gray-200">
              <span className="font-bold text-black uppercase">SUBMIT CONTRACTOR PROPOSAL</span>
              <button
                onClick={() => setShowBidModal(false)}
                className="text-gray-400 hover:text-black text-sm"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleBidSubmit} className="space-y-4">
              <div>
                <label className="block text-gray-500 uppercase tracking-wide mb-1 text-[11px]">
                  Contractor / Firm Name *
                </label>
                <input
                  type="text"
                  required
                  value={bidForm.contractorName}
                  onChange={(e) => setBidForm({ ...bidForm, contractorName: e.target.value })}
                  placeholder="e.g. Master Crew #41 (Apex Craft)"
                  className="w-full border border-gray-300 p-2 text-sm text-black font-sans"
                />
              </div>

              <div>
                <label className="block text-gray-500 uppercase tracking-wide mb-1 text-[11px]">
                  NYC DOB License Number *
                </label>
                <input
                  type="text"
                  required
                  value={bidForm.license}
                  onChange={(e) => setBidForm({ ...bidForm, license: e.target.value })}
                  placeholder="e.g. NYC DOB #619842"
                  className="w-full border border-gray-300 p-2 text-sm text-black font-sans"
                />
              </div>

              <div>
                <label className="block text-gray-500 uppercase tracking-wide mb-1 text-[11px]">
                  Lump Sum Contract Bid ($ USD) *
                </label>
                <input
                  type="text"
                  required
                  value={bidForm.amount}
                  onChange={(e) => setBidForm({ ...bidForm, amount: e.target.value })}
                  placeholder={`e.g. $${project.budget.target.toLocaleString()}`}
                  className="w-full border border-gray-300 p-2 text-sm text-black font-sans"
                />
              </div>

              <div className="pt-3 flex justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setShowBidModal(false)}
                  className="px-4 py-2 border border-gray-300 text-gray-600 hover:text-black"
                >
                  CANCEL
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-black text-white hover:bg-gray-800 uppercase font-semibold"
                >
                  SUBMIT FORMAL BID →
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
