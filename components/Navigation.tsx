'use client';

import Link from 'next/link';
import Image from 'next/image';

export function Navigation() {
  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-white/80 backdrop-blur-md border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
        {/* Logomark with authentic Socio. bluish dot logo */}
        <div className="flex items-center gap-3">
          <Link href="/" className="flex items-center group">
            <Image
              src="/socio-logo.png"
              alt="Socio."
              width={112}
              height={32}
              className="h-7 w-auto object-contain transition-opacity group-hover:opacity-80"
              priority
            />
          </Link>
          <div className="hidden md:flex items-center justify-center bg-gray-100 border border-gray-200 text-gray-500 font-mono text-[10px] uppercase tracking-widest px-3 py-1.5 ml-3">
            Brooklyn Hub
          </div>
        </div>

        {/* Minimal Category Navigation */}
        <nav className="hidden md:flex items-center gap-8">
          <Link
            href="#how-it-works"
            className="font-sans text-sm text-gray-500 hover:text-black transition-colors"
          >
            How It Works
          </Link>
          <Link
            href="/craft"
            className="font-sans text-sm text-gray-500 hover:text-black transition-colors"
          >
            For Owners
          </Link>
          <Link
            href="/contractors/join"
            className="font-sans text-sm text-gray-500 hover:text-black transition-colors"
          >
            For Contractors
          </Link>
          <Link
            href="#platform"
            className="font-sans text-sm text-gray-500 hover:text-black transition-colors"
          >
            The OS
          </Link>
        </nav>

        {/* Primary Action */}
        <Link
          href="/craft/estimate"
          className="bg-black text-white font-sans text-sm font-medium px-6 py-3 hover:bg-gray-800 transition-colors flex items-center gap-2 rounded-none"
        >
          Build a Project
          <span className="font-mono">→</span>
        </Link>
      </div>
    </header>
  );
}

export default Navigation;
