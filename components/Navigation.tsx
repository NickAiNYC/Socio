'use client';

import Link from 'next/link';

export function Navigation() {
  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-white/80 backdrop-blur-md border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
        {/* Logomark */}
        <div className="flex items-center gap-3">
          <Link href="/" className="text-xl tracking-tight text-black flex items-baseline gap-1">
            <span className="font-bold">socio</span>
            <span className="font-mono text-gray-400 text-sm">.nyc</span>
          </Link>
          <div className="hidden md:flex items-center justify-center px-2 py-1 bg-gray-100 text-gray-500 font-mono text-[10px] uppercase tracking-widest ml-4 border border-gray-200">
            Brooklyn Hub
          </div>
        </div>

        {/* Center Links */}
        <nav className="hidden md:flex items-center gap-8">
          <Link
            href="/craft"
            className="font-sans text-sm text-gray-500 hover:text-black transition-colors"
          >
            Craftsman Network
          </Link>
          <Link
            href="/contractors/join"
            className="font-sans text-sm text-gray-500 hover:text-black transition-colors"
          >
            For Tradesmen
          </Link>
        </nav>

        {/* CTA Button */}
        <Link
          href="/craft/estimate"
          className="bg-black text-white font-sans text-sm font-medium px-6 py-3 hover:bg-gray-800 transition-colors flex items-center gap-2 rounded-none"
        >
          Get an Estimate
          <span className="font-mono">↗</span>
        </Link>
      </div>
    </header>
  );
}

export default Navigation;
