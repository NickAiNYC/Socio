import Link from "next/link";
import { ShieldCheck, Zap, Compass, CheckCircle2 } from "lucide-react";

export default function HomePage() {
  return (
    <div className="w-full">
      {/* HERO SECTION */}
      <section className="pt-24 pb-16 px-4 max-w-4xl mx-auto text-center">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-zinc-200 bg-white text-xs text-zinc-600 font-medium mb-6 shadow-2xs">
          <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
          Vetted Brooklyn Trade Capacity · Q3 2026
        </div>

        <h1 className="text-4xl sm:text-6xl font-semibold tracking-tight text-zinc-950 max-w-3xl mx-auto leading-[1.12]">
          Infrastructure and precision front-office for local trades.
        </h1>

        <p className="mt-6 text-base sm:text-lg text-zinc-500 max-w-2xl mx-auto leading-relaxed">
          Socio pairs master-level independent craftsmen across Brooklyn with transparent, institutional-grade estimates for residential and commercial spaces.
        </p>

        <div className="mt-8 flex flex-wrap items-center justify-center gap-4">
          <Link
            href="/craft/estimate"
            className="px-6 py-3 rounded-xl bg-zinc-950 text-white font-medium text-sm hover:bg-zinc-800 shadow-sm transition-all"
          >
            Submit Project Scope
          </Link>
          <Link
            href="/craft"
            className="px-6 py-3 rounded-xl bg-white border border-zinc-200 text-zinc-800 font-medium text-sm hover:bg-zinc-50 transition-colors"
          >
            Explore the Trades
          </Link>
        </div>
      </section>

      {/* MOCK UI INTERFACE / PREVIEW CARD */}
      <section className="max-w-5xl mx-auto px-4 pb-20">
        <div className="bg-white border border-zinc-200/80 rounded-2xl shadow-xs overflow-hidden">
          {/* Mock Browser Header */}
          <div className="px-6 py-3.5 border-b border-zinc-100 bg-zinc-50/50 flex items-center justify-between text-xs text-zinc-500">
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-zinc-300" />
              <span className="w-2.5 h-2.5 rounded-full bg-zinc-300" />
              <span className="w-2.5 h-2.5 rounded-full bg-zinc-300" />
              <span className="ml-2 font-mono text-[11px] text-zinc-400">socio.nyc/portal/intake-preview</span>
            </div>
            <span className="font-mono text-[11px] bg-emerald-50 text-emerald-700 px-2 py-0.5 rounded border border-emerald-200">
              Live Verified Network
            </span>
          </div>

          {/* Mock Grid Inside Frame */}
          <div className="p-8 grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="p-5 rounded-xl border border-zinc-100 bg-zinc-50/40">
              <p className="text-xs font-mono uppercase text-zinc-400">Trade Verification</p>
              <p className="mt-2 text-xl font-semibold text-zinc-900">Level 5 Plaster & Skim</p>
              <p className="text-xs text-zinc-500 mt-1">Brownstone restoration specialist</p>
              <div className="mt-4 flex items-center gap-1.5 text-xs text-emerald-600 font-medium">
                <CheckCircle2 className="w-4 h-4" /> Insured & COI Ready
              </div>
            </div>

            <div className="p-5 rounded-xl border border-zinc-100 bg-zinc-50/40">
              <p className="text-xs font-mono uppercase text-zinc-400">Response Metric</p>
              <p className="mt-2 text-3xl font-semibold text-zinc-900 font-mono">&lt; 4 Hours</p>
              <p className="text-xs text-zinc-500 mt-1">Itemized English estimate delivery</p>
              <div className="mt-4 text-xs font-mono text-zinc-400">Zero vague napkin bids</div>
            </div>

            <div className="p-5 rounded-xl border border-zinc-100 bg-zinc-50/40">
              <p className="text-xs font-mono uppercase text-zinc-400">Active Boroughs</p>
              <p className="mt-2 text-xl font-semibold text-zinc-900">Kings & Queens</p>
              <p className="text-xs text-zinc-500 mt-1">Park Slope, Heights, Williamsburg</p>
              <div className="mt-4 text-xs font-mono text-zinc-400">12 Verified Master Crews</div>
            </div>
          </div>
        </div>
      </section>

      {/* THE BENTO SECTION */}
      <section className="max-w-5xl mx-auto px-4 py-16 border-t border-zinc-200/60">
        <div className="mb-12">
          <p className="text-xs font-semibold uppercase tracking-widest text-zinc-400 font-mono">The Architecture</p>
          <h2 className="text-2xl sm:text-3xl font-semibold text-zinc-950 mt-2 tracking-tight">
            How Socio standardizes the physical trade experience.
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Bento Item 1 */}
          <div className="bg-white border border-zinc-200/80 rounded-2xl p-7 flex flex-col justify-between shadow-2xs hover:border-zinc-300 transition-colors">
            <div>
              <div className="w-9 h-9 rounded-lg bg-zinc-100 flex items-center justify-center text-zinc-800 mb-5">
                <Compass className="w-5 h-5" />
              </div>
              <h3 className="font-semibold text-zinc-900 text-base">Standardized Scope Prep</h3>
              <p className="mt-2 text-sm text-zinc-500 leading-relaxed">
                We translate complex homeowner expectations into rigorous, itemized scope documents that eliminate price surprises and change orders.
              </p>
            </div>
            <span className="mt-6 text-xs font-mono text-zinc-400 uppercase">Step 01 / Input</span>
          </div>

          {/* Bento Item 2 */}
          <div className="bg-white border border-zinc-200/80 rounded-2xl p-7 flex flex-col justify-between shadow-2xs hover:border-zinc-300 transition-colors">
            <div>
              <div className="w-9 h-9 rounded-lg bg-zinc-100 flex items-center justify-center text-zinc-800 mb-5">
                <ShieldCheck className="w-5 h-5" />
              </div>
              <h3 className="font-semibold text-zinc-900 text-base">Vetted Craftsmen Only</h3>
              <p className="mt-2 text-sm text-zinc-500 leading-relaxed">
                Direct access to top-tier Spanish-speaking master tradesmen with decades of New York brownstone and commercial project history.
              </p>
            </div>
            <span className="mt-6 text-xs font-mono text-zinc-400 uppercase">Step 02 / Routing</span>
          </div>

          {/* Bento Item 3 */}
          <div className="bg-white border border-zinc-200/80 rounded-2xl p-7 flex flex-col justify-between shadow-2xs hover:border-zinc-300 transition-colors">
            <div>
              <div className="w-9 h-9 rounded-lg bg-zinc-100 flex items-center justify-center text-zinc-800 mb-5">
                <Zap className="w-5 h-5" />
              </div>
              <h3 className="font-semibold text-zinc-900 text-base">Board & Insurance Ready</h3>
              <p className="mt-2 text-sm text-zinc-500 leading-relaxed">
                We coordinate building management documentation, Certificate of Insurance (COI) packages, and pre-scheduled walkthrough slots.
              </p>
            </div>
            <span className="mt-6 text-xs font-mono text-zinc-400 uppercase">Step 03 / Clearance</span>
          </div>
        </div>
      </section>
    </div>
  );
}
