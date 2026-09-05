'use client';

export function CoreOutcomes() {
  return (
    <section className="w-full bg-[#FAFAFA] py-32 px-6 border-b border-gray-200">
      <div className="max-w-7xl mx-auto space-y-28">
        {/* Section Intro */}
        <div className="max-w-3xl">
          <p className="font-mono text-xs uppercase tracking-widest text-gray-400 mb-3">
            Core Outcomes
          </p>
          <h2 className="text-4xl sm:text-5xl md:text-6xl font-serif text-black leading-tight">
            Structure. Match. Control.
          </h2>
          <p className="font-sans text-gray-600 text-lg mt-4 leading-relaxed">
            Three principles that turn unpredictable construction jobs into governed, verified transactions.
          </p>
        </div>

        {/* 01. STRUCTURE */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center border-t border-gray-200 pt-16">
          <div className="lg:col-span-5 space-y-6">
            <span className="font-mono text-xs font-semibold text-black uppercase tracking-widest block">
              [01] · STRUCTURE
            </span>
            <h3 className="text-3xl sm:text-4xl font-serif text-black leading-tight">
              Know exactly what <br />you&apos;re building.
            </h3>
            <p className="font-sans text-gray-600 leading-relaxed text-base">
              Turn vague renovation requests into structured scopes with defined materials, labor, explicit exclusions, and surfaced unknowns. Contractors estimate real specifications, not guesses.
            </p>
            <div className="pt-2">
              <span className="font-mono text-xs text-gray-500 block">
                RESULT: Bids compare apple-to-apple on true labor &amp; material items.
              </span>
            </div>
          </div>

          {/* Scope Builder Artifact */}
          <div className="lg:col-span-7 bg-white border border-gray-200 shadow-xs font-mono text-xs">
            <div className="px-6 py-3.5 bg-gray-50 border-b border-gray-200 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 bg-black" />
                <span className="font-bold text-black uppercase">SCOPE BUILDER · CSI MATRIX</span>
              </div>
              <span className="text-[10px] text-gray-400 uppercase">[EXAMPLE ARTIFACT]</span>
            </div>
            <div className="p-6 space-y-4 font-sans text-xs">
              <div className="p-4 bg-emerald-50/50 border border-emerald-200 space-y-2">
                <span className="font-mono text-[10px] uppercase font-bold text-emerald-800 block tracking-wider">
                  [INCLUDED] IN BASE BID
                </span>
                <ul className="space-y-1 text-gray-700 font-mono text-xs">
                  <li>• Custom solid oak shaker cabinetry with Blum soft-close hardware</li>
                  <li>• 2cm honed Calacatta quartz countertops with mitered waterfall edge</li>
                  <li>• Rough-in plumbing relocation for 36&quot; undermount fireclay sink</li>
                </ul>
              </div>

              <div className="p-4 bg-red-50/50 border border-red-200 space-y-2">
                <span className="font-mono text-[10px] uppercase font-bold text-red-800 block tracking-wider">
                  [EXCLUDED] SEPARATE OWNER CONTRACT
                </span>
                <ul className="space-y-1 text-gray-700 font-mono text-xs">
                  <li>• Sub-Zero &amp; Wolf appliance package delivery &amp; final commissioning</li>
                  <li>• Structural joist sistering (requires DOB Alteration Type II filing)</li>
                </ul>
              </div>

              <div className="p-4 bg-amber-50/50 border border-amber-200 space-y-2">
                <span className="font-mono text-[10px] uppercase font-bold text-amber-800 block tracking-wider">
                  [UNKNOWN] SITE DISCOVERY CONTINGENCY
                </span>
                <ul className="space-y-1 text-gray-700 font-mono text-xs">
                  <li>• Subfloor moisture rating behind rear masonry wall ($2,500 locked cap)</li>
                </ul>
              </div>
            </div>
          </div>
        </div>

        {/* 02. MATCH */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center border-t border-gray-200 pt-16">
          <div className="lg:col-span-5 lg:order-2 space-y-6">
            <span className="font-mono text-xs font-semibold text-black uppercase tracking-widest block">
              [02] · MATCH
            </span>
            <h3 className="text-3xl sm:text-4xl font-serif text-black leading-tight">
              Find contractors who <br />actually fit the project.
            </h3>
            <p className="font-sans text-gray-600 leading-relaxed text-base">
              Socio matches projects against trade classification, local NYC borough geography, historical co-op/condo board experience, and active crew capacity. No random directory solicitations.
            </p>
            <div className="pt-2">
              <span className="font-mono text-xs text-gray-500 block">
                RESULT: You meet crews with verified track records in your exact neighborhood.
              </span>
            </div>
          </div>

          {/* Project Match Artifact */}
          <div className="lg:col-span-7 lg:order-1 bg-white border border-gray-200 shadow-xs font-mono text-xs">
            <div className="px-6 py-3.5 bg-gray-50 border-b border-gray-200 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 bg-emerald-500 rounded-full" />
                <span className="font-bold text-black uppercase">PROJECT MATCH RUNTIME</span>
              </div>
              <span className="text-[10px] text-gray-400 uppercase">[VERIFIED RECORD]</span>
            </div>
            <div className="p-6 space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-gray-100 gap-2">
                <div>
                  <span className="text-[10px] text-gray-400 block uppercase">SELECTED PROFILE</span>
                  <span className="font-bold text-black text-sm">Vetted General Contractor #41</span>
                </div>
                <div className="text-right">
                  <span className="text-[10px] text-gray-400 block uppercase">MATCH CONFIDENCE</span>
                  <span className="text-emerald-700 font-bold text-sm bg-emerald-50 border border-emerald-200 px-2 py-0.5 inline-block">
                    94% MATCH SCORE
                  </span>
                </div>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 pt-2">
                <div className="p-3 bg-[#FAFAFA] border border-gray-200">
                  <span className="text-gray-400 block text-[10px] uppercase">NYC CO-OP EXP</span>
                  <span className="font-bold text-black">YES (14 BLDGS)</span>
                </div>
                <div className="p-3 bg-[#FAFAFA] border border-gray-200">
                  <span className="text-gray-400 block text-[10px] uppercase">TRADE FIT</span>
                  <span className="font-bold text-black">98% RATED</span>
                </div>
                <div className="p-3 bg-[#FAFAFA] border border-gray-200">
                  <span className="text-gray-400 block text-[10px] uppercase">CREW DISTANCE</span>
                  <span className="font-bold text-black">1.2 MI (LOCAL)</span>
                </div>
                <div className="p-3 bg-[#FAFAFA] border border-gray-200">
                  <span className="text-gray-400 block text-[10px] uppercase">DOB PERMITS</span>
                  <span className="font-bold text-black">CLEAN / 0 VIOL</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* 03. CONTROL */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center border-t border-gray-200 pt-16">
          <div className="lg:col-span-5 space-y-6">
            <span className="font-mono text-xs font-semibold text-black uppercase tracking-widest block">
              [03] · CONTROL
            </span>
            <h3 className="text-3xl sm:text-4xl font-serif text-black leading-tight">
              Keep the project moving.
            </h3>
            <p className="font-sans text-gray-600 leading-relaxed text-base">
              Connect milestones, alteration agreements, photographic verification, and escrow payments into one immutable project record. Never pay ahead of verified progress.
            </p>
            <div className="pt-2">
              <span className="font-mono text-xs text-gray-500 block">
                RESULT: Zero financial hostage situations and zero surprise budget leaks.
              </span>
            </div>
          </div>

          {/* Milestone Control Artifact */}
          <div className="lg:col-span-7 bg-white border border-gray-200 shadow-xs font-mono text-xs">
            <div className="px-6 py-3.5 bg-gray-50 border-b border-gray-200 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 bg-black" />
                <span className="font-bold text-black uppercase">MILESTONE 03 ESCROW RAIL</span>
              </div>
              <span className="bg-emerald-50 text-emerald-800 border border-emerald-200 px-2 py-0.5 text-[10px] font-semibold uppercase">
                ● CAPITAL LOCKED
              </span>
            </div>
            <div className="p-6 space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-gray-100 gap-2">
                <div>
                  <span className="text-[10px] text-gray-400 block uppercase">ACTIVE PHASE</span>
                  <span className="font-bold text-black text-sm">Cabinetry &amp; Finish Millwork Installation</span>
                </div>
                <div className="text-right">
                  <span className="text-[10px] text-gray-400 block uppercase">ESCROW AMOUNT</span>
                  <span className="font-serif text-2xl text-black font-semibold">$14,500</span>
                </div>
              </div>

              <div className="space-y-2 text-xs font-sans text-gray-600 bg-[#FAFAFA] border border-gray-200 p-4">
                <div className="flex items-center justify-between font-mono text-[11px]">
                  <span className="text-gray-500">ESCROW DEPOSIT STATE:</span>
                  <span className="font-bold text-black">FUNDED IN ESCROW</span>
                </div>
                <div className="flex items-center justify-between font-mono text-[11px]">
                  <span className="text-gray-500">VERIFICATION GATES:</span>
                  <span className="font-bold text-emerald-700">AWAITING ON-SITE PUNCH INSPECTION</span>
                </div>
                <div className="flex items-center justify-between font-mono text-[11px]">
                  <span className="text-gray-500">DISBURSEMENT CONDITION:</span>
                  <span className="font-bold text-black">DUAL SIGNOFF (OWNER + GC)</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export default CoreOutcomes;
