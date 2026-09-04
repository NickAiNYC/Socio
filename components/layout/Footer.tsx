import Link from 'next/link';

export default function Footer() {
  return (
    <footer className="border-t border-gray-200 bg-white py-16 px-6">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-start md:items-center justify-between gap-8 text-xs font-sans text-gray-500">
        <div className="flex flex-col sm:flex-row sm:items-center gap-3">
          <Link href="/" className="text-black font-semibold text-sm">
            socio<span className="font-mono text-gray-400">.nyc</span>
          </Link>
          <span className="hidden sm:inline text-gray-300">|</span>
          <span className="font-mono text-[11px] text-gray-400 uppercase tracking-wider">
            Infrastructure & Precision Front-Office for NYC Trades
          </span>
        </div>

        <div className="flex flex-wrap items-center gap-8 font-mono text-[11px] uppercase tracking-wider">
          <Link href="/craft" className="hover:text-black transition-colors">
            Craftsman Network
          </Link>
          <Link href="/contractors/join" className="hover:text-black transition-colors">
            For Tradesmen
          </Link>
          <Link href="/craft/estimate" className="hover:text-black transition-colors">
            Get an Estimate
          </Link>
          <span className="text-gray-300">© 2026 Socio</span>
        </div>
      </div>
    </footer>
  );
}
