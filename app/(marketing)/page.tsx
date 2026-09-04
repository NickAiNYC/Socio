import Link from "next/link";

export default function MarketingPage() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[80vh] px-4 text-center">
      <h1 className="font-display text-5xl md:text-7xl lg:text-8xl font-semibold tracking-tight text-ink max-w-4xl mx-auto leading-tight">
        Technology &amp; Front-Office Infrastructure for Brooklyn Trades &amp; Merchants.
      </h1>
      <p className="mt-8 max-w-2xl text-lg md:text-xl text-ink-soft font-sans mx-auto">
        We partner with independent tradesmen and local neighborhood merchants to modernize operations, handle estimating, and deliver high-trust experiences for property owners.
      </p>
      
      <div className="mt-12 flex flex-col sm:flex-row gap-4">
        <Link
          href="/craft"
          className="inline-flex items-center justify-center px-8 py-4 text-base font-medium text-white bg-accent text-accent-ink rounded-lg hover:opacity-90 transition-colors"
        >
          The Craftsman Network
        </Link>
        <Link
          href="/contractors/join"
          className="inline-flex items-center justify-center px-8 py-4 text-base font-medium text-ink bg-surface border border-hairline rounded-lg hover:bg-canvas transition-colors"
        >
          Partner with Socio
        </Link>
      </div>
    </div>
  );
}
