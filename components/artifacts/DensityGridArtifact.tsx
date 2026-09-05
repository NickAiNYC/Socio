'use client';

import { useState } from 'react';

interface Corridor {
  id: string;
  name: string;
  borough: string;
  projectsActive: number;
  tradeDensity: string;
  boardPrecedent: string;
}

const CORRIDORS: Corridor[] = [
  { id: 'cg', name: 'Carroll Gardens', borough: 'Brooklyn', projectsActive: 6, tradeDensity: 'Level 5 Plaster Specialists', boardPrecedent: 'Pre-War Brownstone Riders' },
  { id: 'ps', name: 'Park Slope', borough: 'Brooklyn', projectsActive: 9, tradeDensity: 'Architectural Woodworking', boardPrecedent: 'Co-op Alteration Agreements' },
  { id: 'bh', name: 'Brooklyn Heights', borough: 'Brooklyn', projectsActive: 4, tradeDensity: 'Historic Masonry & Façade', boardPrecedent: 'Landmarks Preservation Commission' },
  { id: 'ch', name: 'Cobble Hill', borough: 'Brooklyn', projectsActive: 5, tradeDensity: 'Custom Cabinetry & Tile', boardPrecedent: 'Brownstone Multi-Unit Clearance' },
  { id: 'crh', name: 'Crown Heights', borough: 'Brooklyn', projectsActive: 7, tradeDensity: 'Plaster & Finish Carpentry', boardPrecedent: 'Limestone Rowhouse Precedents' },
  { id: 'wb', name: 'Williamsburg', borough: 'Brooklyn', projectsActive: 8, tradeDensity: 'Structural Steel & MEP', boardPrecedent: 'Post-War Loft & Condo Packages' },
  { id: 'gp', name: 'Greenpoint', borough: 'Brooklyn', projectsActive: 4, tradeDensity: 'Architectural Millwork', boardPrecedent: 'Townhouse Conversion Riders' },
  { id: 'ast', name: 'Astoria', borough: 'Queens', projectsActive: 5, tradeDensity: 'Masonry & Wet-Area Tile', boardPrecedent: '2-Family Residential Clearances' },
  { id: 'lic', name: 'Long Island City', borough: 'Queens', projectsActive: 6, tradeDensity: 'Condo Interior Systems', boardPrecedent: 'High-Rise Elevator Reservations' },
];

export function DensityGridArtifact() {
  const [selected, setSelected] = useState<Corridor>(CORRIDORS[0]);

  return (
    <div className="w-full bg-white border border-gray-200 shadow-xs overflow-hidden font-mono text-xs">
      {/* Console Bar */}
      <div className="px-6 py-3.5 bg-gray-50 border-b border-gray-200 flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <span className="w-2 h-2 bg-emerald-500 rounded-full" />
          <span className="font-bold text-black uppercase">
            NYC HYPERLOCAL DENSITY NODE GRID
          </span>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-[10px] text-gray-400 uppercase">[ILLUSTRATIVE ARTIFACT]</span>
          <span className="bg-gray-100 text-gray-700 border border-gray-200 px-2 py-0.5 text-[10px] font-semibold uppercase">
            9 CORRIDORS TRACKED
          </span>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12">
        {/* Left: 9 Interactive Corridor Nodes */}
        <div className="lg:col-span-7 p-6 sm:p-8 bg-[#FAFAFA] border-b lg:border-b-0 lg:border-r border-gray-200">
          <span className="text-[10px] text-gray-400 uppercase tracking-widest block mb-4">
            SELECT CORRIDOR TO INSPECT LOCAL COMPOUNDING
          </span>

          <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
            {CORRIDORS.map((c) => (
              <button
                key={c.id}
                onClick={() => setSelected(c)}
                className={`p-3 text-left border transition-all ${
                  selected.id === c.id
                    ? 'bg-black text-white border-black shadow-2xs font-bold'
                    : 'bg-white text-gray-700 border-gray-200 hover:border-black'
                }`}
              >
                <div className="flex items-center justify-between mb-1">
                  <span className="text-[9px] uppercase tracking-wider text-gray-400">
                    {c.borough}
                  </span>
                  <span className={`w-1.5 h-1.5 rounded-full ${selected.id === c.id ? 'bg-emerald-400' : 'bg-gray-300'}`} />
                </div>
                <span className="font-bold block text-xs truncate">{c.name}</span>
                <span className="text-[10px] text-gray-400 block mt-1">
                  {c.projectsActive} Active Hubs
                </span>
              </button>
            ))}
          </div>
        </div>

        {/* Right: Compounding Local Knowledge Readout */}
        <div className="lg:col-span-5 p-6 sm:p-8 space-y-6 flex flex-col justify-between">
          <div className="space-y-4">
            <div className="pb-3 border-b border-gray-200">
              <span className="text-[10px] text-gray-400 uppercase tracking-widest block mb-1">
                CORRIDOR INTELLIGENCE · {selected.borough.toUpperCase()}
              </span>
              <h3 className="text-2xl font-serif text-black">{selected.name}</h3>
            </div>

            <div className="space-y-3 text-xs font-mono">
              <div className="p-3 bg-[#FAFAFA] border border-gray-200">
                <span className="text-gray-400 block text-[9px] uppercase">PRIMARY TRADE CLUSTERING</span>
                <span className="font-bold text-black">{selected.tradeDensity}</span>
              </div>
              <div className="p-3 bg-[#FAFAFA] border border-gray-200">
                <span className="text-gray-400 block text-[9px] uppercase">CO-OP / CONDO PRECEDENTS</span>
                <span className="font-bold text-black">{selected.boardPrecedent}</span>
              </div>
              <div className="p-3 bg-[#FAFAFA] border border-gray-200">
                <span className="text-gray-400 block text-[9px] uppercase">COMPOUNDING EFFICIENCY</span>
                <span className="font-bold text-emerald-700">SUB-48HR BOARD COMPLIANCE PACKAGING</span>
              </div>
            </div>

            <p className="font-sans text-xs text-gray-500 leading-relaxed pt-1">
              Local concentration allows Socio to pre-empt managing agent riders, freight elevator constraints, and quiet-hour rules before estimating begins.
            </p>
          </div>

          <div className="pt-3 border-t border-gray-100 flex items-center justify-between text-[11px] text-gray-400">
            <span>Local knowledge compounds</span>
            <span className="font-mono">NYC CLUSTER EFFICIENCY</span>
          </div>
        </div>
      </div>
    </div>
  );
}

export default DensityGridArtifact;
