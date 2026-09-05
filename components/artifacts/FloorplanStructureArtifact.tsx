'use client';

import { useState } from 'react';

type RoomKey = 'kitchen' | 'living' | 'bathroom' | 'bedroom';

interface RoomScope {
  name: string;
  sqft: string;
  csi: string;
  included: string[];
  excluded: string[];
  unknown: string[];
}

const ROOM_DATA: Record<RoomKey, RoomScope> = {
  kitchen: {
    name: 'KITCHEN ASSEMBLY',
    sqft: '210 SF',
    csi: 'CSI 12 35 30 · RESIDENTIAL CASEWORK',
    included: [
      'Custom solid white oak cabinetry with integrated soft-close Blum hardware',
      '2cm honed Calacatta quartz countertops with bookmatched waterfall miter',
      'Rough-in plumbing relocation for 36" undermount fireclay farmhouse sink',
      'Dedicated 50A induction range circuit with architectural line-voltage drops',
    ],
    excluded: [
      'Wolf & Sub-Zero appliance package delivery and final line commissioning',
      'Structural bearing wall modification (requires DOB Alteration Type-II)',
    ],
    unknown: [
      'Behind-wall mechanical stack integrity ($1,800 contingency allowance locked)',
    ],
  },
  living: {
    name: 'MAIN PARLOR & LIVING',
    sqft: '480 SF',
    csi: 'CSI 09 20 00 · PLASTER ASSEMBLIES',
    included: [
      'Demolition of failing historic plaster down to original sound wood lath',
      '3-coat skim coat over fiberglass mesh to Level 5 architectural finish',
      'Crown moulding restoration: hand-cast plaster profiles matching 1892 original',
      'Refinishing 3/4" rift-sawn red oak herringbone flooring with matte Bona Traffic HD',
    ],
    excluded: [
      'Subfloor structural joist replacement (separate engineer signoff required)',
    ],
    unknown: [
      'Historical decorative medallion ceiling pocket stability ($1,200 contingency)',
    ],
  },
  bathroom: {
    name: 'PRIMARY BATHROOM',
    sqft: '95 SF',
    csi: 'CSI 09 30 00 · TILING & WATERPROOFING',
    included: [
      'Complete substrate strip down to rough masonry framing',
      'Schluter Kerdi waterproof membrane with flood testing prior to tile lay',
      'Handmade Zellige ceramic wall tile with epoxy antimicrobial grout',
      'Concealed in-wall thermostatic mixing valves with Grohe architectural trim',
    ],
    excluded: [
      'Lead soil-stack replacement outside apartment property line boundary',
    ],
    unknown: [
      'Branch waste line pitch behind rear wet wall ($1,500 locked cap)',
    ],
  },
  bedroom: {
    name: 'CHAMBER / BEDROOM',
    sqft: '240 SF',
    csi: 'CSI 06 20 00 · FINISH CARPENTRY',
    included: [
      'Floor-to-ceiling built-in white oak wardrobes with integrated LED channel lighting',
      'Solid core panel door hanging with Baldwin oil-rubbed bronze mortise hardware',
      'Acoustic sound-dampening underlayment beneath hardwood restoration',
    ],
    excluded: [
      'Exterior window sash fabrication (managed under building-wide landmark contract)',
    ],
    unknown: [
      'Radiator valve steam packing tightness (routine super inspection)',
    ],
  },
};

export function FloorplanStructureArtifact() {
  const [activeRoom, setActiveRoom] = useState<RoomKey>('kitchen');
  const room = ROOM_DATA[activeRoom];

  return (
    <div className="w-full bg-white border border-gray-200 shadow-xs overflow-hidden font-mono text-xs">
      {/* Top Console Bar */}
      <div className="px-6 py-3.5 bg-gray-50 border-b border-gray-200 flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-2.5">
          <span className="w-2 h-2 bg-black" />
          <span className="font-bold text-black uppercase tracking-wider">
            ARCHITECTURAL SCOPE ENGINE · 3D APARTMENT FLOORPLAN
          </span>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-[10px] text-gray-400 uppercase">[EXAMPLE ARTIFACT]</span>
          <span className="bg-emerald-50 text-emerald-800 border border-emerald-200 px-2 py-0.5 text-[10px] font-semibold uppercase">
            ● 42 ITEMS CODIFIED
          </span>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12">
        {/* Left: Blueprint Isometric Floorplan Diagram */}
        <div className="lg:col-span-5 p-6 sm:p-8 bg-[#FAFAFA] border-b lg:border-b-0 lg:border-r border-gray-200 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between pb-3 mb-6 border-b border-gray-200">
              <span className="text-gray-400 text-[10px] uppercase tracking-widest">
                SELECT ROOM TO INSPECT
              </span>
              <span className="text-[10px] text-black font-semibold">UNIT 3A · 1,450 SF</span>
            </div>

            {/* Interactive Blueprint Grid SVG */}
            <div className="relative w-full aspect-[4/3] bg-white border border-gray-200 p-3 shadow-2xs">
              <svg viewBox="0 0 400 300" className="w-full h-full select-none">
                {/* Blueprint Grid Lines */}
                <defs>
                  <pattern id="blueprintGrid" width="20" height="20" patternUnits="userSpaceOnUse">
                    <path d="M 20 0 L 0 0 0 20" fill="none" stroke="#F1F1F1" strokeWidth="1" />
                  </pattern>
                </defs>
                <rect width="400" height="300" fill="url(#blueprintGrid)" />

                {/* Exterior Wall Outline */}
                <rect
                  x="20"
                  y="20"
                  width="360"
                  height="260"
                  fill="none"
                  stroke="#000"
                  strokeWidth="3"
                />

                {/* ROOM 1: KITCHEN (Top Right) */}
                <g
                  onClick={() => setActiveRoom('kitchen')}
                  className="cursor-pointer group"
                >
                  <rect
                    x="210"
                    y="30"
                    width="160"
                    height="120"
                    fill={activeRoom === 'kitchen' ? '#000' : '#FAFAFA'}
                    stroke="#000"
                    strokeWidth="1.5"
                    className="transition-colors duration-200"
                  />
                  {/* Island icon */}
                  <rect
                    x="250"
                    y="60"
                    width="80"
                    height="40"
                    fill={activeRoom === 'kitchen' ? '#FFF' : '#E5E5E5'}
                    stroke="#000"
                    strokeWidth="1"
                  />
                  <text
                    x="290"
                    y="125"
                    textAnchor="middle"
                    fill={activeRoom === 'kitchen' ? '#FFF' : '#000'}
                    fontSize="11"
                    fontFamily="monospace"
                    fontWeight="bold"
                  >
                    KITCHEN (210 SF)
                  </text>
                </g>

                {/* ROOM 2: LIVING / PARLOR (Bottom Right) */}
                <g
                  onClick={() => setActiveRoom('living')}
                  className="cursor-pointer group"
                >
                  <rect
                    x="150"
                    y="160"
                    width="220"
                    height="110"
                    fill={activeRoom === 'living' ? '#000' : '#FAFAFA'}
                    stroke="#000"
                    strokeWidth="1.5"
                    className="transition-colors duration-200"
                  />
                  <text
                    x="260"
                    y="220"
                    textAnchor="middle"
                    fill={activeRoom === 'living' ? '#FFF' : '#000'}
                    fontSize="11"
                    fontFamily="monospace"
                    fontWeight="bold"
                  >
                    PARLOR / LIVING (480 SF)
                  </text>
                </g>

                {/* ROOM 3: PRIMARY BATHROOM (Middle Left) */}
                <g
                  onClick={() => setActiveRoom('bathroom')}
                  className="cursor-pointer group"
                >
                  <rect
                    x="30"
                    y="30"
                    width="170"
                    height="100"
                    fill={activeRoom === 'bathroom' ? '#000' : '#FAFAFA'}
                    stroke="#000"
                    strokeWidth="1.5"
                    className="transition-colors duration-200"
                  />
                  <text
                    x="115"
                    y="85"
                    textAnchor="middle"
                    fill={activeRoom === 'bathroom' ? '#FFF' : '#000'}
                    fontSize="11"
                    fontFamily="monospace"
                    fontWeight="bold"
                  >
                    PRIMARY BATH (95 SF)
                  </text>
                </g>

                {/* ROOM 4: CHAMBER / BEDROOM (Bottom Left) */}
                <g
                  onClick={() => setActiveRoom('bedroom')}
                  className="cursor-pointer group"
                >
                  <rect
                    x="30"
                    y="140"
                    width="110"
                    height="130"
                    fill={activeRoom === 'bedroom' ? '#000' : '#FAFAFA'}
                    stroke="#000"
                    strokeWidth="1.5"
                    className="transition-colors duration-200"
                  />
                  <text
                    x="85"
                    y="210"
                    textAnchor="middle"
                    fill={activeRoom === 'bedroom' ? '#FFF' : '#000'}
                    fontSize="10"
                    fontFamily="monospace"
                    fontWeight="bold"
                  >
                    CHAMBER (240 SF)
                  </text>
                </g>
              </svg>
            </div>
          </div>

          {/* Quick Room Picker buttons */}
          <div className="grid grid-cols-2 gap-2 mt-6">
            {(['kitchen', 'living', 'bathroom', 'bedroom'] as RoomKey[]).map((key) => (
              <button
                key={key}
                onClick={() => setActiveRoom(key)}
                className={`px-3 py-2 text-left border uppercase font-mono text-[11px] transition-colors ${
                  activeRoom === key
                    ? 'bg-black text-white border-black font-bold'
                    : 'bg-white text-gray-700 border-gray-200 hover:border-black'
                }`}
              >
                {key}
              </button>
            ))}
          </div>
        </div>

        {/* Right: Live Room CSI Scope Detail */}
        <div className="lg:col-span-7 p-6 sm:p-8 space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-baseline justify-between pb-4 border-b border-gray-200 gap-2">
            <div>
              <span className="text-[10px] text-gray-400 uppercase tracking-widest block mb-1">
                {room.csi}
              </span>
              <h3 className="text-2xl font-serif text-black">{room.name}</h3>
            </div>
            <span className="font-mono text-xs font-semibold text-black bg-gray-100 border border-gray-200 px-2.5 py-1">
              ALLOCATED AREA: {room.sqft}
            </span>
          </div>

          {/* Explicit Boundary Breakdown */}
          <div className="space-y-4">
            {/* INCLUDED */}
            <div className="p-4 bg-emerald-50/40 border border-emerald-200 space-y-2">
              <span className="text-[10px] font-bold text-emerald-800 uppercase tracking-wider block">
                [INCLUDED] SCOPE BASELINE
              </span>
              <ul className="space-y-1 text-gray-700 font-mono text-xs">
                {room.included.map((item, idx) => (
                  <li key={idx} className="flex items-start gap-2">
                    <span className="text-emerald-700 font-bold shrink-0">✓</span>
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* EXCLUDED */}
            <div className="p-4 bg-red-50/40 border border-red-200 space-y-2">
              <span className="text-[10px] font-bold text-red-800 uppercase tracking-wider block">
                [EXCLUDED] SEPARATE OWNER CONTRACT
              </span>
              <ul className="space-y-1 text-gray-700 font-mono text-xs">
                {room.excluded.map((item, idx) => (
                  <li key={idx} className="flex items-start gap-2">
                    <span className="text-red-700 font-bold shrink-0">✕</span>
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* UNKNOWN */}
            <div className="p-4 bg-amber-50/40 border border-amber-200 space-y-2">
              <span className="text-[10px] font-bold text-amber-800 uppercase tracking-wider block">
                [UNKNOWN] PRE-WAR CONTINGENCY LOCK
              </span>
              <ul className="space-y-1 text-gray-700 font-mono text-xs">
                {room.unknown.map((item, idx) => (
                  <li key={idx} className="flex items-start gap-2">
                    <span className="text-amber-700 font-bold shrink-0">?</span>
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          <div className="pt-2 flex items-center justify-between text-[11px] text-gray-400 font-sans border-t border-gray-100">
            <span>Deterministic CSI division structuring</span>
            <span>Zero vague napkin estimates</span>
          </div>
        </div>
      </div>
    </div>
  );
}

export default FloorplanStructureArtifact;
