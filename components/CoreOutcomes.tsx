'use client';

import { FloorplanStructureArtifact } from './artifacts/FloorplanStructureArtifact';
import { MatchNetworkArtifact } from './artifacts/MatchNetworkArtifact';
import { MilestoneRailArtifact } from './artifacts/MilestoneRailArtifact';

export function CoreOutcomes() {
  return (
    <section className="w-full bg-[#FAFAFA] py-28 px-6 border-b border-gray-200">
      <div className="max-w-7xl mx-auto space-y-32">
        {/* Intro */}
        <div className="max-w-3xl">
          <p className="font-mono text-xs uppercase tracking-widest text-gray-400 mb-2">
            The Three Principles
          </p>
          <h2 className="text-3xl sm:text-5xl md:text-6xl font-serif text-black leading-tight">
            Structure. Match. Control.
          </h2>
          <p className="font-sans text-gray-600 text-lg mt-3 leading-relaxed">
            Three interactive mechanisms that turn subjective renovation friction into governed, verifiable transactions.
          </p>
        </div>

        {/* 01. STRUCTURE ARTIFACT */}
        <div className="space-y-8 border-t border-gray-200 pt-16">
          <div className="max-w-3xl space-y-2">
            <span className="font-mono text-xs font-semibold text-black uppercase tracking-widest block">
              [01] · STRUCTURE
            </span>
            <h3 className="text-3xl sm:text-4xl font-serif text-black">
              Know exactly what you&apos;re building.
            </h3>
            <p className="font-sans text-gray-600 leading-relaxed text-sm sm:text-base">
              Turn ambiguous renovation requests into room-by-room CSI line items with explicit inclusions, exclusions, and allowances. Click any room in the floorplan below to inspect its codified scope.
            </p>
          </div>

          <FloorplanStructureArtifact />
        </div>

        {/* 02. MATCH ARTIFACT */}
        <div className="space-y-8 border-t border-gray-200 pt-16">
          <div className="max-w-3xl space-y-2">
            <span className="font-mono text-xs font-semibold text-black uppercase tracking-widest block">
              [02] · MATCH
            </span>
            <h3 className="text-3xl sm:text-4xl font-serif text-black">
              Find contractors who actually fit the project.
            </h3>
            <p className="font-sans text-gray-600 leading-relaxed text-sm sm:text-base">
              Socio matches projects against trade classification, NYC co-op board experience, license standing, and neighborhood crew capacity. Step through the filter pipeline to watch the network converge.
            </p>
          </div>

          <MatchNetworkArtifact />
        </div>

        {/* 03. CONTROL ARTIFACT */}
        <div className="space-y-8 border-t border-gray-200 pt-16">
          <div className="max-w-3xl space-y-2">
            <span className="font-mono text-xs font-semibold text-black uppercase tracking-widest block">
              [03] · CONTROL
            </span>
            <h3 className="text-3xl sm:text-4xl font-serif text-black">
              Keep the project moving.
            </h3>
            <p className="font-sans text-gray-600 leading-relaxed text-sm sm:text-base">
              Payments move strictly with verified work. Capital is held on milestone rails and released only upon mutual photographic punchlist clearance. Test the simulated release flow below.
            </p>
          </div>

          <MilestoneRailArtifact />
        </div>
      </div>
    </section>
  );
}

export default CoreOutcomes;
