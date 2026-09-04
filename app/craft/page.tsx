import Link from "next/link";

export default function CraftPage() {
  return (
    <div className="w-full bg-surface">
      {/* Hero Section */}
      <section className="py-24 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <h1 className="font-display text-5xl md:text-7xl lg:text-8xl font-semibold tracking-tight text-ink max-w-5xl leading-tight">
          Master-Level Brooklyn Trades. Backed by Institutional Estimates.
        </h1>
        <p className="mt-8 text-xl text-ink-soft font-sans max-w-2xl">
          We match Brooklyn property owners with independent, master-level tradesmen for historical restorations and architectural renovations.
        </p>
        <div className="mt-12">
          <Link
            href="/craft/estimate"
            className="inline-flex items-center justify-center px-8 py-4 text-lg font-medium text-white bg-accent text-accent-ink rounded-lg hover:opacity-90 transition-colors"
          >
            Start an Estimate
          </Link>
        </div>
      </section>

      {/* The Trade Matrix */}
      <section className="py-24 bg-canvas border-y border-hairline">
        <div className="px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
          <h2 className="font-sans text-xs font-semibold tracking-widest text-ink-soft uppercase mb-12">
            The Trade Matrix
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="bg-surface p-8 border border-hairline rounded-2xl shadow-sm">
              <div className="font-mono text-sm text-ink-soft mb-4">01</div>
              <h3 className="font-display text-2xl text-ink mb-3">Plaster &amp; Skim-Coating</h3>
              <p className="text-ink-soft text-sm">Brownstone plaster restoration and Level 5 skim-coating for flawless surfaces.</p>
            </div>
            <div className="bg-surface p-8 border border-hairline rounded-2xl shadow-sm">
              <div className="font-mono text-sm text-ink-soft mb-4">02</div>
              <h3 className="font-display text-2xl text-ink mb-3">Architectural Painting</h3>
              <p className="text-ink-soft text-sm">Precision interior painting strictly adhering to Benjamin Moore and Farrow &amp; Ball specifications.</p>
            </div>
            <div className="bg-surface p-8 border border-hairline rounded-2xl shadow-sm">
              <div className="font-mono text-sm text-ink-soft mb-4">03</div>
              <h3 className="font-display text-2xl text-ink mb-3">Custom Tile &amp; Masonry</h3>
              <p className="text-ink-soft text-sm">Precision custom tile work, bathroom masonry, and specialized stonework.</p>
            </div>
            <div className="bg-surface p-8 border border-hairline rounded-2xl shadow-sm">
              <div className="font-mono text-sm text-ink-soft mb-4">04</div>
              <h3 className="font-display text-2xl text-ink mb-3">Architectural Millwork</h3>
              <p className="text-ink-soft text-sm">Custom architectural millwork and meticulous historic wood trim repair.</p>
            </div>
          </div>
        </div>
      </section>

      {/* The "Socio Standard" Process Section */}
      <section className="py-24 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <h2 className="font-sans text-xs font-semibold tracking-widest text-ink-soft uppercase mb-12">
          The Socio Standard Process
        </h2>
        <div className="space-y-12 max-w-3xl">
          <div className="flex gap-6">
            <div className="flex-shrink-0 w-12 h-12 rounded-full bg-canvas border border-hairline flex items-center justify-center font-mono text-ink">
              1
            </div>
            <div>
              <h3 className="font-display text-2xl text-ink mb-2">Digital Scope Submission</h3>
              <p className="text-ink-soft">Submit your project details, room specifications, and photos through our guided intake flow.</p>
            </div>
          </div>
          <div className="flex gap-6">
            <div className="flex-shrink-0 w-12 h-12 rounded-full bg-canvas border border-hairline flex items-center justify-center font-mono text-ink">
              2
            </div>
            <div>
              <h3 className="font-display text-2xl text-ink mb-2">Itemized English Proposal</h3>
              <p className="text-ink-soft">Receive a transparent, clearly written proposal detailing the labor and materials breakdown for your scope.</p>
            </div>
          </div>
          <div className="flex gap-6">
            <div className="flex-shrink-0 w-12 h-12 rounded-full bg-canvas border border-hairline flex items-center justify-center font-mono text-ink">
              3
            </div>
            <div>
              <h3 className="font-display text-2xl text-ink mb-2">Verified On-Site Walkthrough</h3>
              <p className="text-ink-soft">We arrange a walkthrough at your property directly with the vetted Master Craftsman to confirm details.</p>
            </div>
          </div>
          <div className="flex gap-6">
            <div className="flex-shrink-0 w-12 h-12 rounded-full bg-canvas border border-hairline flex items-center justify-center font-mono text-ink">
              4
            </div>
            <div>
              <h3 className="font-display text-2xl text-ink mb-2">Direct Contract Execution</h3>
              <p className="text-ink-soft">Sign directly with the craftsman. We facilitate the delivery of building board approvals and Certificates of Insurance (COI).</p>
            </div>
          </div>
        </div>
      </section>

      {/* Legal Safeguard Banner */}
      <div className="bg-canvas border-t border-hairline py-8 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto flex gap-4 items-start">
          <div className="text-ink-soft mt-0.5">
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>
          </div>
          <p className="text-sm text-ink-soft leading-relaxed">
            Socio operates as a technology and front-office estimating desk. Licensed, insured tradesmen perform all physical work. Socio does not act as an unlicensed home improvement general contractor under NYC Admin Code § 20-387. Homeowner agreements and warranties are contracted directly with the licensed, insured craftsman.
          </p>
        </div>
      </div>
    </div>
  );
}
