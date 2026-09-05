'use client';

import { useState } from 'react';

type RailStage = 'funded' | 'inspected' | 'released';

export function MilestoneRailArtifact() {
  const [stage, setStage] = useState<RailStage>('inspected');

  const advanceStage = () => {
    if (stage === 'funded') setStage('inspected');
    else if (stage === 'inspected') setStage('released');
    else setStage('funded');
  };

  return (
    <div className="w-full bg-white border border-gray-200 shadow-xs overflow-hidden font-mono text-xs">
      {/* Console Bar */}
      <div className="px-6 py-3.5 bg-gray-50 border-b border-gray-200 flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <span className="w-2 h-2 bg-black" />
          <span className="font-bold text-black uppercase">
            STAGED MILESTONE RAIL · VERIFIED DISBURSEMENT ENGINE
          </span>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-[10px] text-gray-400 uppercase">[EXAMPLE ARTIFACT]</span>
          <span className="bg-emerald-50 text-emerald-800 border border-emerald-200 px-2 py-0.5 text-[10px] font-semibold uppercase">
            ● MILESTONE 03 ACTIVE
          </span>
        </div>
      </div>

      <div className="p-6 sm:p-10 space-y-8">
        {/* Horizontal Milestone Lifecycle Track */}
        <div>
          <div className="flex items-center justify-between pb-3 text-[10px] text-gray-400 uppercase tracking-widest border-b border-gray-200">
            <span>GOVERNANCE PROTOCOL</span>
            <span className="text-black font-semibold">WORK → VERIFICATION → PAYMENT</span>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-6 gap-2 pt-4">
            {[
              { label: '01. SCOPE', status: 'LOCKED', active: true },
              { label: '02. CONTRACT', status: 'SIGNED', active: true },
              { label: '03. MILESTONE', status: 'IN PROGRESS', active: true },
              { label: '04. VERIFY', status: stage === 'funded' ? 'PENDING' : 'PASSED', active: stage !== 'funded' },
              { label: '05. RELEASE', status: stage === 'released' ? 'EXECUTED' : 'AWAITING', active: stage === 'released' },
              { label: '06. NEXT MS', status: 'QUEUED', active: false },
            ].map((step, idx) => (
              <div
                key={idx}
                className={`p-3 border text-center transition-all ${
                  step.active
                    ? 'bg-black text-white border-black font-bold'
                    : 'bg-[#FAFAFA] text-gray-400 border-gray-200'
                }`}
              >
                <span className="block text-[9px] uppercase tracking-wider">{step.label}</span>
                <span className="block text-[10px] mt-1">{step.status}</span>
              </div>
            ))}
          </div>
        </div>

        {/* The Interactive Milestone Card (As highlighted in user prompt) */}
        <div className="bg-[#FAFAFA] border border-gray-200 p-6 sm:p-8 space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-gray-200 gap-2">
            <div>
              <span className="text-[10px] text-gray-400 uppercase tracking-widest block mb-1">
                ACTIVE PHASE DISBURSEMENT RAIL
              </span>
              <h3 className="text-xl sm:text-2xl font-serif text-black">
                MILESTONE 03 · ROUGH-IN COMPLETE
              </h3>
            </div>
            <div className="text-left sm:text-right">
              <span className="text-[10px] text-gray-400 uppercase block">CONTRACT VALUE</span>
              <span className="text-2xl font-serif font-bold text-black">$14,500</span>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-4 gap-4 text-xs">
            <div className="p-3 bg-white border border-gray-200">
              <span className="text-gray-400 block text-[9px] uppercase">CAPITAL STATUS</span>
              <span className="font-bold text-black">
                {stage === 'released' ? 'DISBURSED' : 'SECURED ON RAIL'}
              </span>
            </div>
            <div className="p-3 bg-white border border-gray-200">
              <span className="text-gray-400 block text-[9px] uppercase">SITE INSPECTION</span>
              <span className={`font-bold ${stage === 'funded' ? 'text-amber-600' : 'text-emerald-700'}`}>
                {stage === 'funded' ? 'IN PROGRESS' : 'VERIFIED / PASSED'}
              </span>
            </div>
            <div className="p-3 bg-white border border-gray-200">
              <span className="text-gray-400 block text-[9px] uppercase">OWNER SIGNOFF</span>
              <span className="font-bold text-emerald-700">
                {stage === 'funded' ? 'PENDING' : '✓ EXECUTED'}
              </span>
            </div>
            <div className="p-3 bg-white border border-gray-200">
              <span className="text-gray-400 block text-[9px] uppercase">CREW SIGNOFF</span>
              <span className="font-bold text-emerald-700">
                {stage === 'funded' ? 'PENDING' : '✓ EXECUTED'}
              </span>
            </div>
          </div>

          {/* Interactive Simulation Action Button */}
          <div className="pt-2 flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-t border-gray-200">
            <span className="text-[11px] text-gray-500 font-sans">
              Simulate inspection approval &amp; disbursement state transition:
            </span>
            <button
              onClick={advanceStage}
              className="bg-black text-white font-mono text-xs uppercase tracking-wider px-5 py-3 hover:bg-gray-800 transition-colors flex items-center justify-center gap-2 shrink-0"
            >
              <span>
                {stage === 'funded' && '01. SIMULATE INSPECTION PASS →'}
                {stage === 'inspected' && '02. RELEASE PAYMENT ($14,500) →'}
                {stage === 'released' && 'RESET STATE TO FUNDED ↺'}
              </span>
            </button>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-[11px] text-gray-400 font-sans border-t border-gray-100 pt-3">
          <span>Staged milestone payments eliminate financial hostage situations.</span>
          <span className="font-mono">FUNDS RELEASED ONLY POST-APPROVAL</span>
        </div>
      </div>
    </div>
  );
}

export default MilestoneRailArtifact;
