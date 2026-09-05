'use client';

import React, { useState, useEffect, useRef } from 'react';

export function DataMoatVisualArtifact() {
  const [activeStage, setActiveStage] = useState<number>(0);
  const [isAutoPlaying, setIsAutoPlaying] = useState<boolean>(true);
  const [isVisible, setIsVisible] = useState<boolean>(false);
  const containerRef = useRef<HTMLDivElement>(null);

  const stages = [
    {
      id: 'projects',
      num: '01',
      title: 'PROJECTS',
      sub: 'Individual Renovation Records',
      summary: 'Every renovation runs on the same structured digital project object.',
    },
    {
      id: 'data',
      num: '02',
      title: 'DATA CONVERGENCE',
      sub: 'Empirical Operational Signals',
      summary: 'Actual bids, elevator delays, inspection clearances, and material lead times flow inward.',
    },
    {
      id: 'benchmarks',
      num: '03',
      title: 'BENCHMARKS',
      sub: 'Statistical Variance Baselines',
      summary: 'NYC residential renovation is converted into predictable, audited benchmarks.',
    },
    {
      id: 'better',
      num: '04',
      title: 'BETTER PROJECTS',
      sub: 'Closed Feedback Loop',
      summary: 'The next project automatically starts with higher accuracy and zero guesswork.',
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

  // Autoplay through the 4-phase transformation loop
  useEffect(() => {
    if (!isAutoPlaying || !isVisible) return;
    const timer = setInterval(() => {
      setActiveStage((prev) => (prev + 1) % stages.length);
    }, 4000);
    return () => clearInterval(timer);
  }, [isAutoPlaying, isVisible, stages.length]);

  const projects = [
    { id: 'PRJ-7102-BK', type: 'Carroll Gardens Co-op', sf: '1,450 SF', cost: '$98K', var: '-0.6%' },
    { id: 'PRJ-6840-MN', type: 'UWS Pre-war Co-op', sf: '2,100 SF', cost: '$165K', var: '+1.2%' },
    { id: 'PRJ-7210-BK', type: 'Park Slope Townhouse', sf: '3,200 SF', cost: '$240K', var: '-0.2%' },
    { id: 'PRJ-6955-QN', type: 'LIC High-rise Condo', sf: '1,100 SF', cost: '$74K', var: '+0.5%' },
    { id: 'PRJ-7301-MN', type: 'Chelsea Historic Loft', sf: '1,800 SF', cost: '$135K', var: '-0.4%' },
  ];

  const benchmarks = [
    { label: 'COST VARIANCE', value: '-0.6%', sub: 'Model vs. Final Payout', highlight: 'text-emerald-700' },
    { label: 'SCHEDULE VARIANCE', value: '+3.3%', sub: 'Elevator & DOB Factored', highlight: 'text-black' },
    { label: 'CHANGE ORDERS', value: '0.0%', sub: 'Zero Scope Ambiguity', highlight: 'text-emerald-700' },
    { label: 'CONTRACTOR PERFORMANCE', value: '94 / 100', sub: 'Verified Closeout Score', highlight: 'text-black' },
  ];

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
            LIFECYCLE STATE 07 · PROJECT BECOMES DATA
          </span>
          <span className="text-gray-400">[SOCIO BENCHMARK — n=14 PROJECTS (BROOKLYN PILOT)]</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-[10px] text-gray-400 uppercase">[ILLUSTRATIVE BENCHMARK]</span>
          <button
            onClick={() => setIsAutoPlaying(!isAutoPlaying)}
            className="text-[10px] uppercase font-mono px-2.5 py-1 bg-white border border-gray-300 text-gray-700 hover:text-black hover:border-black transition-colors"
          >
            {isAutoPlaying ? 'PAUSE LOOP ❚❚' : 'PLAY LOOP ▶'}
          </button>
        </div>
      </div>

      {/* Interactive Transformation Stage Rail */}
      <div className="grid grid-cols-2 md:grid-cols-4 border-b border-gray-200 divide-x divide-gray-200 bg-white">
        {stages.map((st, idx) => (
          <button
            key={st.id}
            onClick={() => {
              setActiveStage(idx);
              setIsAutoPlaying(false);
            }}
            className={`p-4 text-left transition-all ${
              activeStage === idx
                ? 'bg-[#FAFAFA] border-b-2 border-b-black'
                : 'hover:bg-gray-50 text-gray-500'
            }`}
          >
            <div className="flex items-center justify-between mb-1">
              <span className="text-[10px] font-mono text-gray-400">PHASE {st.num}</span>
              {activeStage === idx && (
                <span className="text-[9px] bg-black text-white px-1.5 py-0.2 uppercase">ACTIVE</span>
              )}
            </div>
            <span className="block font-bold text-black text-xs uppercase tracking-wider">{st.title}</span>
            <span className="block text-[11px] text-gray-500 font-sans truncate">{st.sub}</span>
          </button>
        ))}
      </div>

      {/* Visual Canvas Area: The Transformation System */}
      <div className="p-6 sm:p-10 bg-[#FAFAFA] space-y-8 min-h-[380px] flex flex-col justify-between">
        {/* Stage 1: PROJECTS (● ● ● ● ●) */}
        {activeStage === 0 && (
          <div className="space-y-6 transition-all duration-300">
            <div className="flex items-center justify-between border-b border-gray-200 pb-3">
              <div>
                <span className="text-[10px] text-gray-400 uppercase tracking-widest block font-mono">
                  STEP 01 · STRUCTURED PROJECT PRIMITIVES
                </span>
                <span className="text-xl font-serif text-black">
                  Discrete projects run on the Socio Project record.
                </span>
              </div>
              <span className="text-xs font-mono text-emerald-700 bg-emerald-50 border border-emerald-200 px-2 py-1">
                5 ACTIVE LEDGERS RECORDING
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3">
              {projects.map((p, idx) => (
                <div
                  key={idx}
                  className={`p-4 bg-white border transition-all ${
                    p.id === 'PRJ-7102-BK'
                      ? 'border-black ring-1 ring-black shadow-xs'
                      : 'border-gray-200 hover:border-gray-400'
                  }`}
                >
                  <div className="flex items-center justify-between mb-2">
                    <span className="w-2 h-2 rounded-full bg-black" />
                    <span className="text-[10px] font-mono text-gray-400">ID #{p.id.split('-')[1]}</span>
                  </div>
                  <span className="font-bold text-black text-xs block font-mono mb-1">{p.id}</span>
                  <p className="text-[11px] font-sans text-gray-600 mb-2 leading-tight">{p.type}</p>
                  <div className="pt-2 border-t border-gray-100 flex items-center justify-between text-[10px] font-mono text-gray-500">
                    <span>{p.sf}</span>
                    <span className="font-bold text-black">{p.cost}</span>
                  </div>
                </div>
              ))}
            </div>

            <p className="font-sans text-xs text-gray-500 text-center pt-2">
              Every completed milestone and payment across these projects feeds the empirical normalization layer.
            </p>
          </div>
        )}

        {/* Stage 2: DATA CONVERGENCE (╲ │ / ─●─ ╱ │ ╲) */}
        {activeStage === 1 && (
          <div className="space-y-6 transition-all duration-300">
            <div className="flex items-center justify-between border-b border-gray-200 pb-3">
              <div>
                <span className="text-[10px] text-gray-400 uppercase tracking-widest block font-mono">
                  STEP 02 · MULTI-POINT CONVERGENCE
                </span>
                <span className="text-xl font-serif text-black">
                  Operational telemetry collapses into the normalization engine.
                </span>
              </div>
              <span className="text-xs font-mono text-black bg-gray-100 border border-gray-300 px-2 py-1">
                CONVERGING INWARD
              </span>
            </div>

            {/* Visual Ray Convergence */}
            <div className="relative bg-white border border-gray-200 p-8 flex flex-col items-center justify-center overflow-hidden">
              <svg
                viewBox="0 0 600 220"
                className="w-full max-w-xl h-auto stroke-gray-300 fill-none"
                style={{ strokeWidth: 1.2 }}
              >
                {/* Background grid lines */}
                <line x1="50" y1="110" x2="550" y2="110" strokeDasharray="3,3" />
                <line x1="300" y1="20" x2="300" y2="200" strokeDasharray="3,3" />

                {/* Converging Rays */}
                <line x1="80" y1="30" x2="270" y2="100" stroke="#000" strokeWidth="1.5" />
                <line x1="300" y1="20" x2="300" y2="90" stroke="#000" strokeWidth="1.5" />
                <line x1="520" y1="30" x2="330" y2="100" stroke="#000" strokeWidth="1.5" />

                <line x1="60" y1="110" x2="260" y2="110" stroke="#000" strokeWidth="1.5" />
                <line x1="540" y1="110" x2="340" y2="110" stroke="#000" strokeWidth="1.5" />

                <line x1="80" y1="190" x2="270" y2="120" stroke="#000" strokeWidth="1.5" />
                <line x1="300" y1="200" x2="300" y2="130" stroke="#000" strokeWidth="1.5" />
                <line x1="520" y1="190" x2="330" y2="120" stroke="#000" strokeWidth="1.5" />

                {/* Central Normalization Core Node */}
                <circle cx="300" cy="110" r="24" fill="#000" stroke="#10b981" strokeWidth="3" />
                <circle cx="300" cy="110" r="10" fill="#fff" />

                {/* Outer Project Sources */}
                <circle cx="80" cy="30" r="5" fill="#000" />
                <circle cx="520" cy="30" r="5" fill="#000" />
                <circle cx="60" cy="110" r="5" fill="#000" />
                <circle cx="540" cy="110" r="5" fill="#000" />
                <circle cx="80" cy="190" r="5" fill="#000" />
                <circle cx="520" cy="190" r="5" fill="#000" />
              </svg>

              {/* Text labels floating */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 w-full mt-4 text-[10px] font-mono text-center">
                <div className="p-2 bg-gray-50 border border-gray-200">
                  <span className="text-gray-400 block">INCOMING</span>
                  <span className="font-bold text-black">CSI 09 Material Bids</span>
                </div>
                <div className="p-2 bg-gray-50 border border-gray-200">
                  <span className="text-gray-400 block">INCOMING</span>
                  <span className="font-bold text-black">Freight Elevator Logs</span>
                </div>
                <div className="p-2 bg-gray-50 border border-gray-200">
                  <span className="text-gray-400 block">INCOMING</span>
                  <span className="font-bold text-black">Inspection Milestones</span>
                </div>
                <div className="p-2 bg-gray-50 border border-gray-200">
                  <span className="text-gray-400 block">INCOMING</span>
                  <span className="font-bold text-black">Closeout Lien Waivers</span>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Stage 3: BENCHMARKS */}
        {activeStage === 2 && (
          <div className="space-y-6 transition-all duration-300">
            <div className="flex items-center justify-between border-b border-gray-200 pb-3">
              <div>
                <span className="text-[10px] text-gray-400 uppercase tracking-widest block font-mono">
                  STEP 03 · ILLUSTRATIVE BENCHMARK · [PILOT DATASET n=14]
                </span>
                <span className="text-xl font-serif text-black">
                  Statistical baselines replace contractor guesswork.
                </span>
              </div>
              <span className="text-xs font-mono text-emerald-800 bg-emerald-50 border border-emerald-200 px-2 py-1 font-semibold">
                PILOT BASELINES (n=14)
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {benchmarks.map((bm, idx) => (
                <div key={idx} className="p-5 bg-white border border-gray-200 flex flex-col justify-between">
                  <div>
                    <span className="text-[10px] font-mono text-gray-400 uppercase block mb-1">
                      {bm.label}
                    </span>
                    <span className={`text-3xl font-serif font-bold ${bm.highlight} block mb-2`}>
                      {bm.value}
                    </span>
                  </div>
                  <p className="text-[11px] font-sans text-gray-500 border-t border-gray-100 pt-2">
                    {bm.sub}
                  </p>
                </div>
              ))}
            </div>

            <div className="p-4 bg-white border border-gray-200 font-mono text-[11px] text-gray-600 flex flex-col sm:flex-row justify-between items-center gap-2">
              <span>CALIBRATED FOR: BROOKLYN PRE-WAR &amp; MANHATTAN HIGH-RISE CORRIDORS</span>
              <span className="font-bold text-black">DERIVED FROM n=14 COMPLETED PILOT RECORDS</span>
            </div>
          </div>
        )}

        {/* Stage 4: BETTER PROJECTS (CLOSED LOOP) */}
        {activeStage === 3 && (
          <div className="space-y-6 transition-all duration-300">
            <div className="flex items-center justify-between border-b border-gray-200 pb-3">
              <div>
                <span className="text-[10px] text-gray-400 uppercase tracking-widest block font-mono">
                  STEP 04 · THE CLOSED LOOP
                </span>
                <span className="text-xl font-serif text-black">
                  Every completed project calibrates the next contract.
                </span>
              </div>
              <span className="text-xs font-mono text-black bg-gray-100 border border-gray-300 px-2 py-1 font-semibold">
                CYCLE COMPLETE · REFEEDING
              </span>
            </div>

            <div className="bg-white border border-gray-200 p-6 space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4 items-center">
                <div className="p-4 bg-gray-50 border border-gray-200 text-center">
                  <span className="text-[10px] text-gray-400 uppercase block mb-1">COMPLETED PROJECT</span>
                  <span className="font-mono font-bold text-black text-xs block">PRJ-7102-BK</span>
                  <span className="text-[11px] text-gray-500 font-sans">Carroll Gardens Co-op</span>
                </div>

                <div className="text-center font-mono text-gray-400 hidden md:block">
                  <span className="text-lg">→</span>
                  <span className="block text-[9px] uppercase">ACTUAL TELEMETRY</span>
                </div>

                <div className="p-4 bg-emerald-50/70 border border-emerald-200 text-center">
                  <span className="text-[10px] text-emerald-800 uppercase block mb-1">BENCHMARK REFINED</span>
                  <span className="font-mono font-bold text-emerald-900 text-xs block">BROOKLYN CO-OP BASELINE</span>
                  <span className="text-[11px] text-emerald-700 font-sans">Cost variance narrowed by 0.3%</span>
                </div>

                <div className="text-center font-mono text-gray-400 hidden md:block">
                  <span className="text-lg">→</span>
                  <span className="block text-[9px] uppercase">NEW PROJECT INTAKE</span>
                </div>
              </div>

              <div className="p-4 bg-[#FAFAFA] border border-gray-200 flex flex-col sm:flex-row items-center justify-between gap-4">
                <div className="space-y-1">
                  <span className="font-bold text-black text-xs block uppercase">
                    NEXT PROJECT INITIATION: PRJ-7103-BK
                  </span>
                  <p className="font-sans text-xs text-gray-600">
                    The next Carroll Gardens owner gets an instant pre-calibrated scope, realistic trade pricing, and pre-screened crews.
                  </p>
                </div>
                <span className="font-mono text-xs bg-black text-white px-4 py-2 shrink-0">
                  PROJECT → DATA → BENCHMARK → BETTER PROJECT
                </span>
              </div>
            </div>
          </div>
        )}

        {/* Footer Loop Bar */}
        <div className="pt-4 border-t border-gray-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-gray-500 font-mono text-[11px]">
          <div className="flex items-center gap-2">
            <span className="font-bold text-black uppercase">THE CLOSED SOCIO LOOP:</span>
            <span>PROJECTS</span>
            <span>→</span>
            <span>DATA</span>
            <span>→</span>
            <span>BENCHMARKS</span>
            <span>→</span>
            <span className="font-bold text-black">BETTER PROJECTS</span>
          </div>
          <span className="text-gray-400">SOCIO.NYC INFRASTRUCTURE RUNTIME</span>
        </div>
      </div>
    </div>
  );
}

export default DataMoatVisualArtifact;
