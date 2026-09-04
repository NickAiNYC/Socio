import Link from "next/link";

export default function MarketingPage() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[80vh] px-4 text-center">
      <h1 className="font-display text-5xl md:text-7xl lg:text-8xl font-semibold tracking-tight text-neutral-900 max-w-4xl mx-auto leading-tight">
        Technology &amp; Front-Office Infrastructure for Brooklyn Trades &amp; Merchants.
      </h1>
      <p className="mt-8 max-w-2xl text-lg md:text-xl text-neutral-600 font-sans mx-auto">
        We partner with independent tradesmen and local neighborhood merchants to modernize operations, handle estimating, and deliver high-trust experiences for property owners.
      </p>
      
      <div className="mt-12 flex flex-col sm:flex-row gap-4">
        <Link
          href="/craft"
          className="inline-flex items-center justify-center px-8 py-4 text-base font-medium text-white bg-neutral-900 rounded-lg hover:bg-neutral-800 transition-colors"
        >
          The Craftsman Network
        </Link>
        <Link
          href="/contractors/join"
          className="inline-flex items-center justify-center px-8 py-4 text-base font-medium text-neutral-900 bg-white border border-neutral-200 rounded-lg hover:bg-neutral-50 transition-colors"
        >
          Partner with Socio
        </Link>
      </div>
    </div>
  );
}
