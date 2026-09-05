'use client';

import { FloorplanStructureArtifact } from './artifacts/FloorplanStructureArtifact';
import { MatchNetworkArtifact } from './artifacts/MatchNetworkArtifact';
import { MilestoneRailArtifact } from './artifacts/MilestoneRailArtifact';

export function CoreOutcomes() {
  return (
    <section className="w-full bg-[#FAFAFA] py-32 px-6 border-b border-gray-200">
      <div className="max-w-7xl mx-auto space-y-40">
        {/* Intro */}
        <div className="max-w-3xl">
          <p className="font-mono text-xs uppercase tracking-widest text-gray-400 mb-2">
            The Three Principles
          </p>
          <h2 className="text-4xl sm:text-6xl font-serif text-black leading-tight">
            Structure. Match. Control.
          </h2>
          <p className="font-sans text-gray-600 text-lg mt-3 leading-relaxed">
            Three interactive mechanisms that turn unpredictable renovation friction into governed, verifiable transactions.
          </p>
        </div>

        {/* 01. STRUCTURE · PROJECT DEFINED */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 border-t border-gray-200 pt-20 items-start">
          <div className="lg:col-span-4 lg:sticky lg:top-28 space-y-4 pr-4">
            <div className="flex items-center gap-2 font-mono text-[10px] text-emerald-800 bg-emerald-50 border border-emerald-200 px-2.5 py-1 w-fit uppercase font-semibold">
              <span>●</span>
              <span>LIFECYCLE STATE 02 · PROJECT DEFINED</span>
            </div>
            <div className="space-y-1.5">
              <span className="font-mono text-xs font-semibold text-black uppercase tracking-widest block">
                01 · STRUCTURE → DEFINED
              </span>
              <h3 className="text-3xl sm:text-4xl font-serif text-black leading-tight">
                Know exactly what <br />you&apos;re building.
              </h3>
            </div>
            <p className="font-sans text-gray-600 leading-relaxed text-sm sm:text-base">
              Turn ambiguous renovation requests into room-by-room CSI line items with explicit inclusions, exclusions, and allowances. Click any room to inspect the codified scope.
            </p>
            <div className="pt-2 text-xs font-mono text-gray-400">
              <span>OBJECT: #PRJ-7102-BK · 1,450 SF CO-OP</span>
            </div>
          </div>

          <div className="lg:col-span-8">
            <FloorplanStructureArtifact />
          </div>
        </div>

        {/* 02. MATCH · PROJECT MATCHED */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 border-t border-gray-200 pt-20 items-start">
          <div className="lg:col-span-4 lg:sticky lg:top-28 space-y-4 pr-4">
            <div className="flex items-center gap-2 font-mono text-[10px] text-emerald-800 bg-emerald-50 border border-emerald-200 px-2.5 py-1 w-fit uppercase font-semibold">
              <span>●</span>
              <span>LIFECYCLE STATE 03 · PROJECT MATCHED</span>
            </div>
            <div className="space-y-1.5">
              <span className="font-mono text-xs font-semibold text-black uppercase tracking-widest block">
                02 · MATCH → FIT
              </span>
              <h3 className="text-3xl sm:text-4xl font-serif text-black leading-tight">
                Find contractors who <br />actually fit the project.
              </h3>
            </div>
            <p className="font-sans text-gray-600 leading-relaxed text-sm sm:text-base">
              Socio matches projects against trade classification, NYC co-op board experience, license standing, and neighborhood crew capacity. Step through the filter pipeline to watch the network converge.
            </p>
            <div className="pt-2 text-xs font-mono text-gray-400">
              <span>MATCHED CREW: MASTER CREW #41 (94%)</span>
            </div>
          </div>

          <div className="lg:col-span-8">
            <MatchNetworkArtifact />
          </div>
        </div>

        {/* 03. CONTROL · PROJECT IN PROGRESS */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 border-t border-gray-200 pt-20 items-start">
          <div className="lg:col-span-4 lg:sticky lg:top-28 space-y-4 pr-4">
            <div className="flex items-center gap-2 font-mono text-[10px] text-emerald-800 bg-emerald-50 border border-emerald-200 px-2.5 py-1 w-fit uppercase font-semibold">
              <span>●</span>
              <span>LIFECYCLE STATE 04 · PROJECT IN PROGRESS</span>
            </div>
            <div className="space-y-1.5">
              <span className="font-mono text-xs font-semibold text-black uppercase tracking-widest block">
                03 · CONTROL → VERIFIED
              </span>
              <h3 className="text-3xl sm:text-4xl font-serif text-black leading-tight">
                Payments move with the work.
              </h3>
            </div>
            <p className="font-sans text-gray-600 leading-relaxed text-sm sm:text-base">
              Payments move strictly with verified work. Capital is held on milestone rails and released only upon mutual photographic punchlist clearance. Test the simulated release flow below.
            </p>
            <div className="pt-2 text-xs font-mono text-gray-400">
              <span>ACTIVE RAIL: MILESTONE 03 ($14,500)</span>
            </div>
          </div>

          <div className="lg:col-span-8">
            <MilestoneRailArtifact />
          </div>
        </div>
      </div>
    </section>
  );
}

export default CoreOutcomes;
