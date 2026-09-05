'use client';

import React, { useState, useEffect, useRef } from 'react';

export function ExplodedProjectArtifact() {
  const [exploded, setExploded] = useState<boolean>(true);
  const [activeStep, setActiveStep] = useState<number>(10);
  const [isAutoPlaying, setIsAutoPlaying] = useState<boolean>(false);
  const [hoveredSatellite, setHoveredSatellite] = useState<number | null>(null);
  const [isVisible, setIsVisible] = useState<boolean>(false);
  const containerRef = useRef<HTMLDivElement>(null);

  const satellites = [
    {
      label: 'PROPERTY',
      spec: 'Tax Lot 354/19',
      desc: 'Carroll Gardens Pre-war Co-op · 172 Union St · 1,450 SF',
      detail: 'Includes freight elevator booking window, cellar storage staging access, and managing agent alteration rules.',
    },
    {
      label: 'SCOPE',
      spec: 'CSI 09 20 00',
      desc: '42 Line Items Codified · Explicit Exclusions & Inclusions',
      detail: 'Partition framing, Level 5 skim coat plaster, custom white oak millwork, subfloor leveling, and licensed MEP rough-ins.',
    },
    {
      label: 'BUDGET',
      spec: '$85K–$105K Normalized',
      desc: 'Baseline Pricing Model · Normalized Labor & Materials',
      detail: 'No hidden mobilization fees. Normalized across 14 comparable pre-war kitchen & bath projects in Brooklyn.',
    },
    {
      label: 'CONTRACTORS',
      spec: 'Master Crew #41',
      desc: 'NYC DOB Lic #619842 · Co-op Board Cleared · 94% Fit Score',
      detail: '14 completed brownstone & co-op projects within 1.2 miles. Clean zero-complaint DOB safety record.',
    },
    {
      label: 'DOCUMENTS',
      spec: 'ACORD 25 + Riders',
      desc: 'Commercial General Liability $1M/$2M · Workers Comp C-105.2',
      detail: 'Building Corporation & Managing Agent named as additional insureds with primary & non-contributory endorsements.',
    },
    {
      label: 'COMPLIANCE',
      spec: 'Managing Agent Rider',
      desc: '9:00 AM – 4:30 PM Work Hours · Masonite Hallway Protection',
      detail: 'Lead-Safe EPA RRP protocol verified. Daily debris haul schedule and neighbor notification letters archived.',
    },
    {
      label: 'MILESTONES',
      spec: 'MS-01 → MS-04',
      desc: 'Demolition → Rough-in → Finishes → Final Lien Waiver',
      detail: 'Every milestone requires high-resolution photographic punchlist verification signed off by both owner and crew.',
    },
    {
      label: 'PAYMENTS',
      spec: 'Milestone Rails',
      desc: 'Inspection-Gated Disbursement · $14,500 Current Phase Rail',
      detail: 'Capital secured on milestone rails before mobilization and released only after verified milestone clearance.',
    },
    {
      label: 'CHANGES',
      spec: 'Digital Change Ledger',
      desc: 'Zero Napkin Revisions · Formal Pricing & Time Impact Log',
      detail: 'Any latent field condition (e.g. concealed BX wiring) requires digital addendum approval prior to execution.',
    },
    {
      label: 'OUTCOME',
      spec: 'Empirical Benchmark Feed',
      desc: 'Audited Variance (-0.6% Cost, +3.3% Sched) Recorded to Dataset',
      detail: 'Permanent immutable project archive retained for building resale disclosure and next-project normalization.',
    },
  ];

  // Pause rendering/updates when offscreen
  useEffect(() => {
    if (!containerRef.current) return;
    const observer = new IntersectionObserver(
      ([entry]) => setIsVisible(entry.isIntersecting),
      { threshold: 0.2 }
    );
    observer.observe(containerRef.current);
    return () => observer.disconnect();
  }, []);

  // Autoplay progression from 0 (collapsed) -> 1..10 (exploded) -> hold -> collapse
  useEffect(() => {
    if (!isAutoPlaying || !isVisible) return;
    const timer = setInterval(() => {
      setActiveStep((prev) => {
        if (prev >= 10) {
          // Hold at fully exploded, then reset to 0
          setExploded(false);
          return 0;
        } else {
          setExploded(true);
          return prev + 1;
        }
      });
    }, 1800);

    return () => clearInterval(timer);
  }, [isAutoPlaying, isVisible]);

  const handleCollapse = () => {
    setExploded(false);
    setActiveStep(0);
    setIsAutoPlaying(false);
  };

  const handleExplode = () => {
    setExploded(true);
    setActiveStep(10);
    setIsAutoPlaying(false);
  };

  return (
    <div
      ref={containerRef}
      className="w-full bg-white border border-gray-200 shadow-sm overflow-hidden font-mono text-xs"
    >
      {/* Console Bar */}
      <div className="px-6 py-3.5 bg-gray-50 border-b border-gray-200 flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <span className="w-2 h-2 rounded-full bg-black animate-pulse" />
          <span className="font-semibold text-black uppercase tracking-wider">
            LIFECYCLE STATE 06 · PROJECT RECORDED
          </span>
          <span className="text-gray-400">#PRJ-7102-BK</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-[10px] text-gray-400 uppercase">[EXAMPLE ARTIFACT]</span>
          <button
            onClick={() => setIsAutoPlaying(!isAutoPlaying)}
            className="text-[10px] uppercase font-mono px-2.5 py-1 bg-white border border-gray-300 text-gray-700 hover:text-black hover:border-black transition-colors"
          >
            {isAutoPlaying ? 'PAUSE SEQUENCE ❚❚' : 'AUTO-CYCLE ▶'}
          </button>
          <button
            onClick={exploded ? handleCollapse : handleExplode}
            className="bg-black text-white px-3 py-1 font-mono text-[10px] uppercase hover:bg-gray-800 transition-colors"
          >
            {exploded ? 'COLLAPSE RECORD ⤆' : 'EXPLODE ARCHITECTURE ⤇'}
          </button>
        </div>
      </div>

      {/* Assembly Scrubber Bar */}
      <div className="px-6 py-2.5 bg-white border-b border-gray-200 flex items-center justify-between overflow-x-auto gap-2">
        <span className="text-[10px] text-gray-400 uppercase font-mono shrink-0">
          REVEAL SATELLITES:
        </span>
        <div className="flex items-center gap-1 shrink-0">
          <button
            onClick={handleCollapse}
            className={`px-2 py-0.5 text-[10px] font-mono transition-colors ${
              activeStep === 0
                ? 'bg-black text-white'
                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
            }`}
          >
            00. CORE
          </button>
          {satellites.map((s, idx) => {
            const stepNum = idx + 1;
            const isRevealed = stepNum <= activeStep;
            return (
              <button
                key={idx}
                onClick={() => {
                  setActiveStep(stepNum);
                  setExploded(true);
                  setIsAutoPlaying(false);
                }}
                className={`px-2 py-0.5 text-[10px] font-mono transition-colors ${
                  isRevealed
                    ? 'bg-emerald-50 text-emerald-800 border border-emerald-300 font-semibold'
                    : 'bg-gray-50 text-gray-400 hover:bg-gray-100'
                }`}
              >
                0{stepNum}. {s.label}
              </button>
            );
          })}
        </div>
      </div>

      <div className="p-6 sm:p-12 space-y-10 bg-[#FAFAFA]">
        {/* Central Core Object & Axonometric Satellites */}
        <div className="relative max-w-5xl mx-auto flex flex-col items-center">
          {/* The Central Project Nexus */}
          <div
            className={`w-full max-w-lg p-6 sm:p-8 bg-black text-white border border-black shadow-lg text-center z-20 space-y-3 transition-all duration-500 ${
              !exploded || activeStep === 0 ? 'scale-105 ring-2 ring-emerald-400' : ''
            }`}
          >
            <div className="flex items-center justify-between border-b border-gray-800 pb-2 text-[10px] font-mono">
              <span className="text-emerald-400 tracking-widest uppercase">
                CENTRAL OPERATIONAL PRIMITIVE
              </span>
              <span className="text-gray-400">STATUS: VERIFIED &amp; RECORDED</span>
            </div>
            <h3 className="text-3xl sm:text-4xl font-serif tracking-tight">
              PROJECT [PRJ-7102-BK]
            </h3>
            <p className="font-sans text-xs text-gray-300 max-w-md mx-auto leading-relaxed">
              The single immutable digital record governing scope, compliance, contractor execution, and capital rails.
            </p>

            {(!exploded || activeStep === 0) && (
              <div className="pt-3 border-t border-gray-800 flex items-center justify-center gap-2 text-[11px] text-emerald-400 font-mono">
                <span>●</span>
                <span>ALL 10 GOVERNING SATELLITES ENCAPSULATED IN ONE RECORD</span>
              </div>
            )}
          </div>

          {/* Active Detail Inspection Drawer (when hovering a satellite) */}
          {hoveredSatellite !== null && (
            <div className="w-full max-w-xl mt-4 p-4 bg-white border border-black shadow-md z-30 transition-all font-mono text-xs">
              <div className="flex items-center justify-between border-b border-gray-200 pb-2 mb-2">
                <span className="font-bold text-black uppercase">
                  SATELLITE 0{hoveredSatellite + 1} · {satellites[hoveredSatellite].label}
                </span>
                <span className="text-emerald-700 bg-emerald-50 border border-emerald-200 px-2 py-0.5 text-[10px] font-semibold">
                  {satellites[hoveredSatellite].spec}
                </span>
              </div>
              <p className="font-sans text-xs text-gray-700 mb-1 font-semibold">
                {satellites[hoveredSatellite].desc}
              </p>
              <p className="font-sans text-[11px] text-gray-500 leading-relaxed">
                {satellites[hoveredSatellite].detail}
              </p>
            </div>
          )}

          {/* Exploded Satellites Grid */}
          <div
            className={`w-full grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3 mt-8 transition-all duration-500 ${
              exploded && activeStep > 0 ? 'opacity-100' : 'opacity-20 pointer-events-none scale-95'
            }`}
          >
            {satellites.map((sat, idx) => {
              const stepNum = idx + 1;
              const isRevealed = stepNum <= activeStep && exploded;
              const isHovered = hoveredSatellite === idx;

              return (
                <div
                  key={idx}
                  onMouseEnter={() => setHoveredSatellite(idx)}
                  onMouseLeave={() => setHoveredSatellite(null)}
                  className={`p-3.5 bg-white border transition-all duration-300 flex flex-col justify-between min-h-[110px] cursor-pointer ${
                    isHovered
                      ? 'border-black ring-1 ring-black shadow-md -translate-y-1'
                      : isRevealed
                      ? 'border-gray-200 hover:border-gray-400'
                      : 'border-dashed border-gray-200 opacity-20'
                  }`}
                >
                  <div>
                    <div className="flex items-center justify-between mb-1">
                      <span className="font-mono text-[9px] text-gray-400 uppercase">
                        LAYER 0{stepNum}
                      </span>
                      {isRevealed && (
                        <span className="text-[8px] bg-emerald-50 text-emerald-800 border border-emerald-200 px-1 py-0.2 font-mono uppercase">
                          ACTIVE
                        </span>
                      )}
                    </div>
                    <span className="font-bold text-black text-xs block mb-0.5">
                      {sat.label}
                    </span>
                    <span className="text-[10px] font-mono text-gray-500 block mb-1">
                      {sat.spec}
                    </span>
                    <p className="font-sans text-[11px] text-gray-600 leading-snug line-clamp-2">
                      {sat.desc}
                    </p>
                  </div>
                  <div className="mt-2 pt-1 border-t border-gray-100 flex items-center justify-between text-[9px] text-emerald-700 font-bold font-mono">
                    <span>GOVERNING</span>
                    <span>✓</span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Footnote */}
        <div className="pt-4 border-t border-gray-200 flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-[11px] text-gray-400 font-sans">
          <span>Instead of scattering details across emails, PDFs, and text threads.</span>
          <span className="font-mono text-black font-semibold">
            {exploded ? 'ALL 10 SATELLITES CODIFIED UNDER ONE GOVERNING RECORD' : 'ONE SINGLE RECORD · FULLY ENCAPSULATED'}
          </span>
        </div>
      </div>
    </div>
  );
}

export default ExplodedProjectArtifact;
