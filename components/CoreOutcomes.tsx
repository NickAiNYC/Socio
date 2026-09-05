'use client';

export function CoreOutcomes() {
  return (
    <section className="w-full bg-[#FAFAFA] py-24 px-6 border-b border-gray-200">
      <div className="max-w-7xl mx-auto space-y-16">
        {/* Eyebrow & Headline */}
        <div className="max-w-3xl">
          <p className="font-mono text-xs uppercase tracking-widest text-gray-400 mb-2">
            The Three Principles
          </p>
          <h2 className="text-3xl sm:text-5xl font-serif text-black leading-tight">
            Structure. Match. Control.
          </h2>
        </div>

        {/* 3 Outcome Bento Stories */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* 01. STRUCTURE */}
          <div className="bg-white border border-gray-200 p-6 sm:p-8 flex flex-col justify-between shadow-xs">
            <div>
              {/* Product Artifact */}
              <div className="bg-[#FAFAFA] border border-gray-200 p-5 font-mono text-xs space-y-4 mb-6">
                <div className="flex items-center justify-between pb-3 border-b border-gray-200">
                  <span className="font-bold text-black uppercase">SCOPE BUILDER</span>
                  <span className="text-[10px] text-gray-400 uppercase">[EXAMPLE ARTIFACT]</span>
                </div>
                <div className="space-y-3 font-sans text-xs">
                  <div className="space-y-1">
                    <span className="font-mono text-[10px] font-bold text-emerald-800 uppercase tracking-wider block">
                      [INCLUDED]
                    </span>
                    <p className="text-gray-700 font-mono text-[11px]">
                      • Custom solid oak shaker millwork<br />
                      • 2cm honed Calacatta quartz countertops
                    </p>
                  </div>
                  <div className="space-y-1 pt-1">
                    <span className="font-mono text-[10px] font-bold text-red-800 uppercase tracking-wider block">
                      [EXCLUDED]
                    </span>
                    <p className="text-gray-700 font-mono text-[11px]">
                      • Appliance commissioning &amp; venting
                    </p>
                  </div>
                  <div className="space-y-1 pt-1">
                    <span className="font-mono text-[10px] font-bold text-amber-800 uppercase tracking-wider block">
                      [UNKNOWN]
                    </span>
                    <p className="text-gray-700 font-mono text-[11px]">
                      • Subfloor moisture rating ($1,800 cap)
                    </p>
                  </div>
                </div>
              </div>

              {/* Outcome Statement */}
              <div className="space-y-2">
                <span className="font-mono text-xs uppercase tracking-widest text-gray-400 block font-semibold">
                  01 · STRUCTURE
                </span>
                <h3 className="text-2xl font-serif text-black">
                  Know exactly what you&apos;re building.
                </h3>
                <p className="font-sans text-sm text-gray-600 leading-relaxed pt-1">
                  Turn vague requests into structured line items with explicit inclusions, exclusions, and allowances before anyone estimates.
                </p>
              </div>
            </div>
          </div>

          {/* 02. MATCH */}
          <div className="bg-white border border-gray-200 p-6 sm:p-8 flex flex-col justify-between shadow-xs">
            <div>
              {/* Product Artifact */}
              <div className="bg-[#FAFAFA] border border-gray-200 p-5 font-mono text-xs space-y-4 mb-6">
                <div className="flex items-center justify-between pb-3 border-b border-gray-200">
                  <span className="font-bold text-black uppercase">PROJECT MATCH</span>
                  <span className="text-[10px] text-gray-400 uppercase">[EXAMPLE ARTIFACT]</span>
                </div>
                <div className="space-y-2.5">
                  <div className="flex justify-between items-baseline">
                    <span className="font-bold text-black text-sm">Crew #41 · Brooklyn</span>
                    <span className="text-emerald-700 bg-emerald-50 border border-emerald-200 px-1.5 py-0.5 text-[10px] font-bold">
                      94% MATCH
                    </span>
                  </div>
                  <div className="grid grid-cols-2 gap-2 pt-1 text-[11px]">
                    <div className="p-2 bg-white border border-gray-200">
                      <span className="text-gray-400 block text-[9px] uppercase">CO-OP EXP</span>
                      <span className="font-bold text-black">14 BUILDINGS</span>
                    </div>
                    <div className="p-2 bg-white border border-gray-200">
                      <span className="text-gray-400 block text-[9px] uppercase">DOB STANDING</span>
                      <span className="font-bold text-black">CLEAN / 0 VIOL</span>
                    </div>
                    <div className="p-2 bg-white border border-gray-200">
                      <span className="text-gray-400 block text-[9px] uppercase">TRADE FIT</span>
                      <span className="font-bold text-black">98% RATED</span>
                    </div>
                    <div className="p-2 bg-white border border-gray-200">
                      <span className="text-gray-400 block text-[9px] uppercase">DISTANCE</span>
                      <span className="font-bold text-black">1.2 MI (LOCAL)</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Outcome Statement */}
              <div className="space-y-2">
                <span className="font-mono text-xs uppercase tracking-widest text-gray-400 block font-semibold">
                  02 · MATCH
                </span>
                <h3 className="text-2xl font-serif text-black">
                  Find contractors who actually fit.
                </h3>
                <p className="font-sans text-sm text-gray-600 leading-relaxed pt-1">
                  Match projects against trade classification, NYC co-op board experience, license standing, and neighborhood crew capacity.
                </p>
              </div>
            </div>
          </div>

          {/* 03. CONTROL */}
          <div className="bg-white border border-gray-200 p-6 sm:p-8 flex flex-col justify-between shadow-xs">
            <div>
              {/* Product Artifact (As requested in user prompt) */}
              <div className="bg-[#FAFAFA] border border-gray-200 p-5 font-mono text-xs space-y-4 mb-6">
                <div className="flex items-center justify-between pb-3 border-b border-gray-200">
                  <span className="font-bold text-black uppercase">MILESTONE 03</span>
                  <span className="text-[10px] text-gray-400 uppercase">[EXAMPLE ARTIFACT]</span>
                </div>
                <div className="space-y-2">
                  <span className="font-bold text-black block text-sm pb-2 border-b border-gray-200">
                    ROUGH-IN COMPLETE
                  </span>
                  <div className="space-y-1 pt-1 text-[11px]">
                    <div className="flex justify-between text-gray-600">
                      <span>Contract Value</span>
                      <span className="font-bold text-black">$14,500</span>
                    </div>
                    <div className="flex justify-between text-gray-600">
                      <span>Funding Status</span>
                      <span className="font-bold text-black">SECURED</span>
                    </div>
                    <div className="flex justify-between text-gray-600">
                      <span>Site Inspection</span>
                      <span className="font-bold text-emerald-700">PASSED</span>
                    </div>
                    <div className="flex justify-between text-gray-600">
                      <span>Disbursement</span>
                      <span className="font-bold text-black">DUAL SIGNOFF PENDING</span>
                    </div>
                  </div>
                  <div className="pt-3 flex items-center justify-between border-t border-gray-200 text-[10px]">
                    <span>OWNER SIGNOFF: ✓</span>
                    <span>CREW SIGNOFF: ✓</span>
                  </div>
                </div>
              </div>

              {/* Outcome Statement */}
              <div className="space-y-2">
                <span className="font-mono text-xs uppercase tracking-widest text-gray-400 block font-semibold">
                  03 · CONTROL
                </span>
                <h3 className="text-2xl font-serif text-black">
                  Payments move with the work.
                </h3>
                <p className="font-sans text-sm text-gray-600 leading-relaxed pt-1">
                  Funds are secured on payment rails and disbursed strictly upon mutual inspection approval. Never pay ahead of verified progress.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export default CoreOutcomes;
