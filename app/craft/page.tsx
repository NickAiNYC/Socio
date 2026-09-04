import Link from "next/link";

export default function CraftPage() {
  return (
    <div className="w-full bg-white">
      {/* Hero Section */}
      <section className="py-24 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <h1 className="font-display text-5xl md:text-7xl lg:text-8xl font-semibold tracking-tight text-neutral-900 max-w-5xl leading-tight">
          Master-Level Brooklyn Trades. Backed by Institutional Estimates.
        </h1>
        <p className="mt-8 text-xl text-neutral-600 font-sans max-w-2xl">
          We match Brooklyn property owners with independent, master-level tradesmen for historical restorations and architectural renovations.
        </p>
        <div className="mt-12">
          <Link
            href="/craft/estimate"
            className="inline-flex items-center justify-center px-8 py-4 text-lg font-medium text-white bg-neutral-900 rounded-lg hover:bg-neutral-800 transition-colors"
          >
            Start an Estimate
          </Link>
        </div>
      </section>

      {/* The Trade Matrix */}
      <section className="py-24 bg-neutral-50 border-y border-neutral-200">
        <div className="px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
          <h2 className="font-sans text-xs font-semibold tracking-widest text-neutral-500 uppercase mb-12">
            The Trade Matrix
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="bg-white p-8 border border-neutral-200 rounded-2xl shadow-sm">
              <div className="font-mono text-sm text-neutral-400 mb-4">01</div>
              <h3 className="font-display text-2xl text-neutral-900 mb-3">Plaster &amp; Skim-Coating</h3>
              <p className="text-neutral-600 text-sm">Brownstone plaster restoration and Level 5 skim-coating for flawless surfaces.</p>
            </div>
            <div className="bg-white p-8 border border-neutral-200 rounded-2xl shadow-sm">
              <div className="font-mono text-sm text-neutral-400 mb-4">02</div>
              <h3 className="font-display text-2xl text-neutral-900 mb-3">Architectural Painting</h3>
              <p className="text-neutral-600 text-sm">Precision interior painting strictly adhering to Benjamin Moore and Farrow &amp; Ball specifications.</p>
            </div>
            <div className="bg-white p-8 border border-neutral-200 rounded-2xl shadow-sm">
              <div className="font-mono text-sm text-neutral-400 mb-4">03</div>
              <h3 className="font-display text-2xl text-neutral-900 mb-3">Custom Tile &amp; Masonry</h3>
              <p className="text-neutral-600 text-sm">Precision custom tile work, bathroom masonry, and specialized stonework.</p>
            </div>
            <div className="bg-white p-8 border border-neutral-200 rounded-2xl shadow-sm">
              <div className="font-mono text-sm text-neutral-400 mb-4">04</div>
              <h3 className="font-display text-2xl text-neutral-900 mb-3">Architectural Millwork</h3>
              <p className="text-neutral-600 text-sm">Custom architectural millwork and meticulous historic wood trim repair.</p>
            </div>
          </div>
        </div>
      </section>

      {/* The "Socio Standard" Process Section */}
      <section className="py-24 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <h2 className="font-sans text-xs font-semibold tracking-widest text-neutral-500 uppercase mb-12">
          The Socio Standard Process
        </h2>
        <div className="space-y-12 max-w-3xl">
          <div className="flex gap-6">
            <div className="flex-shrink-0 w-12 h-12 rounded-full bg-neutral-100 border border-neutral-200 flex items-center justify-center font-mono text-neutral-900">
              1
            </div>
            <div>
              <h3 className="font-display text-2xl text-neutral-900 mb-2">Digital Scope Submission</h3>
              <p className="text-neutral-600">Submit your project details, room specifications, and photos through our guided intake flow.</p>
            </div>
          </div>
          <div className="flex gap-6">
            <div className="flex-shrink-0 w-12 h-12 rounded-full bg-neutral-100 border border-neutral-200 flex items-center justify-center font-mono text-neutral-900">
              2
            </div>
            <div>
              <h3 className="font-display text-2xl text-neutral-900 mb-2">Itemized English Proposal</h3>
              <p className="text-neutral-600">Receive a transparent, clearly written proposal detailing the labor and materials breakdown for your scope.</p>
            </div>
          </div>
          <div className="flex gap-6">
            <div className="flex-shrink-0 w-12 h-12 rounded-full bg-neutral-100 border border-neutral-200 flex items-center justify-center font-mono text-neutral-900">
              3
            </div>
            <div>
              <h3 className="font-display text-2xl text-neutral-900 mb-2">Verified On-Site Walkthrough</h3>
              <p className="text-neutral-600">We arrange a walkthrough at your property directly with the vetted Master Craftsman to confirm details.</p>
            </div>
          </div>
          <div className="flex gap-6">
            <div className="flex-shrink-0 w-12 h-12 rounded-full bg-neutral-100 border border-neutral-200 flex items-center justify-center font-mono text-neutral-900">
              4
            </div>
            <div>
              <h3 className="font-display text-2xl text-neutral-900 mb-2">Direct Contract Execution</h3>
              <p className="text-neutral-600">Sign directly with the craftsman. We facilitate the delivery of building board approvals and Certificates of Insurance (COI).</p>
            </div>
          </div>
        </div>
      </section>

      {/* Legal Safeguard Banner */}
      <div className="bg-neutral-50 border-t border-neutral-200 py-8 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto flex gap-4 items-start">
          <div className="text-neutral-400 mt-0.5">
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>
          </div>
          <p className="text-sm text-neutral-500 leading-relaxed">
            Socio operates as a technology and front-office estimating desk. Licensed, insured tradesmen perform all physical work. Socio does not act as an unlicensed home improvement general contractor under NYC Admin Code § 20-387. Homeowner agreements and warranties are contracted directly with the licensed, insured craftsman.
          </p>
        </div>
      </div>
    </div>
  );
}
