'use client';

import { useState, useEffect, useRef, useCallback } from 'react';

type FilterStage = 0 | 1 | 2 | 3;

interface ContractorNode {
  id: string;
  name: string;
  x: number;
  y: number;
  borough: 'Brooklyn' | 'Manhattan' | 'Queens';
  trade: string;
  dobClean: boolean;
  score: number;
  radius: number;
}

const INITIAL_NODES: ContractorNode[] = [
  { id: 'c1', name: 'Master Crew #41 (Apex Craft)', x: 180, y: 110, borough: 'Brooklyn', trade: 'Plaster/Millwork', dobClean: true, score: 94, radius: 6 },
  { id: 'c2', name: 'Vanguard Building Co.', x: 130, y: 190, borough: 'Brooklyn', trade: 'Plaster/Millwork', dobClean: true, score: 91, radius: 5 },
  { id: 'c3', name: 'Brownstone Restorations LLC', x: 230, y: 170, borough: 'Brooklyn', trade: 'Plaster/Masonry', dobClean: true, score: 89, radius: 5 },
  { id: 'c4', name: 'Manhattan Interiors Group', x: 70, y: 60, borough: 'Manhattan', trade: 'General Contractor', dobClean: true, score: 78, radius: 4 },
  { id: 'c5', name: 'Gotham Build LLC', x: 90, y: 140, borough: 'Manhattan', trade: 'HVAC/Plumbing', dobClean: false, score: 62, radius: 3 },
  { id: 'c6', name: 'Astoria Craft Corp', x: 290, y: 70, borough: 'Queens', trade: 'Cabinetry', dobClean: true, score: 81, radius: 4 },
  { id: 'c7', name: 'Flushing Masonry', x: 310, y: 130, borough: 'Queens', trade: 'Masonry', dobClean: true, score: 71, radius: 3 },
  { id: 'c8', name: 'Greenpoint Finishers', x: 200, y: 60, borough: 'Brooklyn', trade: 'Painting', dobClean: true, score: 84, radius: 4 },
  { id: 'c9', name: 'Red Hook Woodworking', x: 160, y: 230, borough: 'Brooklyn', trade: 'Millwork', dobClean: true, score: 87, radius: 4 },
  { id: 'c10', name: 'Midtown General Contracting', x: 120, y: 80, borough: 'Manhattan', trade: 'Commercial GC', dobClean: true, score: 69, radius: 3 },
  { id: 'c11', name: 'Crown Heights Artisans', x: 250, y: 220, borough: 'Brooklyn', trade: 'Plaster', dobClean: true, score: 88, radius: 4 },
];

export function MatchNetworkArtifact() {
  const [filterStage, setFilterStage] = useState<FilterStage>(3);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const isVisibleRef = useRef(true);

  // Progressive filter rules
  const getVisibleNodes = useCallback(() => {
    return INITIAL_NODES.filter((n) => {
      if (filterStage === 0) return true; // All NYC
      if (filterStage === 1) return n.borough === 'Brooklyn'; // Borough
      if (filterStage === 2) return n.borough === 'Brooklyn' && n.dobClean; // DOB Verified
      return n.score >= 89; // Top fit matches
    });
  }, [filterStage]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animId: number;

    // IntersectionObserver to pause loop when off-screen
    const observer = new IntersectionObserver(([entry]) => {
      isVisibleRef.current = entry.isIntersecting;
    }, { threshold: 0.1 });
    observer.observe(canvas);

    const render = () => {
      if (!isVisibleRef.current) {
        animId = requestAnimationFrame(render);
        return;
      }

      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // Central Project Node: PRJ-7102-BK
      const centerX = canvas.width / 2;
      const centerY = canvas.height / 2;

      // Draw subtle background radar rings
      ctx.strokeStyle = '#F0F0F0';
      ctx.lineWidth = 1;
      [40, 80, 120, 160].forEach((r) => {
        ctx.beginPath();
        ctx.arc(centerX, centerY, r, 0, Math.PI * 2);
        ctx.stroke();
      });

      const visible = getVisibleNodes();

      // Draw connection lines from center to visible nodes
      visible.forEach((node) => {
        const isMatched = node.score >= 89;
        ctx.strokeStyle = isMatched ? '#10B981' : '#D1D5DB';
        ctx.lineWidth = isMatched ? 1.5 : 0.75;
        if (!isMatched) ctx.setLineDash([3, 3]);
        else ctx.setLineDash([]);

        ctx.beginPath();
        ctx.moveTo(centerX, centerY);
        ctx.lineTo(node.x, node.y);
        ctx.stroke();
        ctx.setLineDash([]);

        // Draw Contractor Node
        ctx.fillStyle = isMatched ? '#000000' : '#9CA3AF';
        ctx.beginPath();
        ctx.arc(node.x, node.y, node.radius, 0, Math.PI * 2);
        ctx.fill();

        // Node ID label
        ctx.fillStyle = '#6B7280';
        ctx.font = '9px monospace';
        ctx.fillText(node.id.toUpperCase(), node.x + 8, node.y + 3);
      });

      // Draw Center Project Node
      ctx.fillStyle = '#000000';
      ctx.beginPath();
      ctx.arc(centerX, centerY, 8, 0, Math.PI * 2);
      ctx.fill();

      ctx.fillStyle = '#10B981';
      ctx.beginPath();
      ctx.arc(centerX, centerY, 3, 0, Math.PI * 2);
      ctx.fill();

      animId = requestAnimationFrame(render);
    };

    render();

    return () => {
      cancelAnimationFrame(animId);
      observer.disconnect();
    };
  }, [getVisibleNodes]);

  return (
    <div className="w-full bg-white border border-gray-200 shadow-xs overflow-hidden font-mono text-xs">
      {/* Console Bar */}
      <div className="px-6 py-3.5 bg-gray-50 border-b border-gray-200 flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <span className="w-2 h-2 bg-emerald-500 rounded-full" />
          <span className="font-bold text-black uppercase">
            TARGETED TRADE FIT ENGINE · TOPOLOGY MATRIX
          </span>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-[10px] text-gray-400 uppercase">[EXAMPLE ARTIFACT]</span>
          <span className="bg-emerald-50 text-emerald-800 border border-emerald-200 px-2 py-0.5 text-[10px] font-semibold uppercase">
            ● 94% TOP MATCH
          </span>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12">
        {/* Left: Canvas Network Visualization */}
        <div className="lg:col-span-6 p-6 sm:p-8 bg-[#FAFAFA] border-b lg:border-b-0 lg:border-r border-gray-200 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between pb-3 mb-4 border-b border-gray-200 text-[10px] text-gray-400 uppercase tracking-widest">
              <span>PROJECT CENTER: #PRJ-7102-BK</span>
              <span className="text-black font-semibold">
                ACTIVE CREWS: {getVisibleNodes().length}
              </span>
            </div>

            <div className="relative w-full aspect-[4/3] bg-white border border-gray-200 flex items-center justify-center">
              <canvas
                ref={canvasRef}
                width={360}
                height={270}
                className="w-full h-full"
              />
              <span className="absolute bottom-2 left-2 text-[9px] text-gray-400">
                PROXIMITY CONVERGENCE (1.2 MILE RADIUS)
              </span>
            </div>
          </div>

          {/* Stepper / Filter Controls */}
          <div className="mt-6 space-y-2">
            <span className="text-[10px] text-gray-400 uppercase tracking-wider block">
              FILTER PROGRESSION PIPELINE
            </span>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-1.5 text-[10px]">
              {[
                { stage: 0 as FilterStage, label: '01. ALL NYC' },
                { stage: 1 as FilterStage, label: '02. BOROUGH' },
                { stage: 2 as FilterStage, label: '03. DOB VERIFIED' },
                { stage: 3 as FilterStage, label: '04. TOP MATCH' },
              ].map((s) => (
                <button
                  key={s.stage}
                  onClick={() => setFilterStage(s.stage)}
                  className={`px-2.5 py-2 text-center border uppercase transition-colors ${
                    filterStage === s.stage
                      ? 'bg-black text-white border-black font-bold'
                      : 'bg-white text-gray-600 border-gray-200 hover:border-black'
                  }`}
                >
                  {s.label}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Right: Matched Contractor Scorecard */}
        <div className="lg:col-span-6 p-6 sm:p-8 space-y-6 flex flex-col justify-between">
          <div className="space-y-4">
            <div className="flex items-baseline justify-between pb-3 border-b border-gray-200">
              <div>
                <span className="text-[10px] text-gray-400 uppercase tracking-widest block mb-1">
                  TOP VERIFIED CREW MATCH
                </span>
                <h3 className="text-2xl font-serif text-black">Master Crew #41 · Brooklyn</h3>
              </div>
              <span className="text-emerald-700 bg-emerald-50 border border-emerald-200 px-2 py-0.5 font-bold text-sm">
                94% MATCH
              </span>
            </div>

            <p className="font-sans text-xs text-gray-600 leading-relaxed">
              Matched strictly by historic brownstone plaster restoration, verified active DOB permit standing, and zero active safety violations in Brooklyn.
            </p>

            <div className="grid grid-cols-2 gap-3 pt-2">
              <div className="p-3 bg-[#FAFAFA] border border-gray-200">
                <span className="text-gray-400 block text-[9px] uppercase">CO-OP BOARD EXP</span>
                <span className="font-bold text-black text-xs">14 NYC BUILDINGS</span>
              </div>
              <div className="p-3 bg-[#FAFAFA] border border-gray-200">
                <span className="text-gray-400 block text-[9px] uppercase">DOB LICENSE STATUS</span>
                <span className="font-bold text-emerald-700 text-xs">ACTIVE / 0 VIOLATIONS</span>
              </div>
              <div className="p-3 bg-[#FAFAFA] border border-gray-200">
                <span className="text-gray-400 block text-[9px] uppercase">TRADE SPECIALIZATION</span>
                <span className="font-bold text-black text-xs">LEVEL 5 PLASTER / MILL</span>
              </div>
              <div className="p-3 bg-[#FAFAFA] border border-gray-200">
                <span className="text-gray-400 block text-[9px] uppercase">CREW PROXIMITY</span>
                <span className="font-bold text-black text-xs">1.2 MI (LOCAL)</span>
              </div>
            </div>

            <div className="p-3 bg-gray-50 border border-gray-200 text-[11px] text-gray-600 space-y-1">
              <div className="flex justify-between">
                <span>INSURANCE:</span>
                <span className="font-bold text-black">$2M GENERAL LIABILITY (ACORD 25)</span>
              </div>
              <div className="flex justify-between">
                <span>ESTIMATING TIMELINE:</span>
                <span className="font-bold text-black">PRE-SCOPED / 48-HR CONFIRMATION</span>
              </div>
            </div>
          </div>

          <div className="pt-4 border-t border-gray-100 flex items-center justify-between text-[11px] text-gray-400">
            <span>Deterministic project-fit routing</span>
            <span>Zero blind lead solicitations</span>
          </div>
        </div>
      </div>
    </div>
  );
}

export default MatchNetworkArtifact;
