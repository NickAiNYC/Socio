'use client';

import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Menu, X } from 'lucide-react';

export function Navigation() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-white/90 backdrop-blur-md border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
        {/* Logomark with authentic Socio. logo */}
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
          <div className="hidden sm:flex items-center justify-center bg-gray-100 border border-gray-200 text-gray-500 font-mono text-[10px] uppercase tracking-widest px-2.5 py-1 ml-3">
            NYC Hub
          </div>
        </div>

        {/* Minimal Category Navigation */}
        <nav className="hidden md:flex items-center gap-8 font-mono text-xs uppercase tracking-wider">
          <Link
            href="#how-it-works"
            className="text-gray-500 hover:text-black transition-colors"
          >
            How It Works
          </Link>
          <Link
            href="#for-owners"
            className="text-gray-500 hover:text-black transition-colors"
          >
            For Owners
          </Link>
          <Link
            href="/contractors/join"
            className="text-gray-500 hover:text-black transition-colors"
          >
            For Contractors
          </Link>
          <Link
            href="#the-os"
            className="text-gray-500 hover:text-black transition-colors"
          >
            The OS
          </Link>
        </nav>

        {/* Desktop Primary Action */}
        <div className="hidden md:flex items-center gap-4">
          <Link
            href="/craft/estimate"
            className="bg-black text-white font-mono text-xs uppercase tracking-wider px-6 py-3 hover:bg-gray-800 transition-colors flex items-center gap-2"
          >
            <span>START A PROJECT</span>
            <span>→</span>
          </Link>
        </div>

        {/* Mobile Menu Button */}
        <button
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className="md:hidden p-2 text-black hover:text-gray-600 focus:outline-none"
          aria-label="Toggle Navigation Menu"
        >
          {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="md:hidden border-b border-gray-200 bg-white px-6 py-6 space-y-4 font-mono text-xs uppercase tracking-wider">
          <Link
            href="#how-it-works"
            onClick={() => setMobileMenuOpen(false)}
            className="block text-gray-700 hover:text-black py-2"
          >
            How It Works
          </Link>
          <Link
            href="#for-owners"
            onClick={() => setMobileMenuOpen(false)}
            className="block text-gray-700 hover:text-black py-2"
          >
            For Owners
          </Link>
          <Link
            href="/contractors/join"
            onClick={() => setMobileMenuOpen(false)}
            className="block text-gray-700 hover:text-black py-2"
          >
            For Contractors
          </Link>
          <Link
            href="#the-os"
            onClick={() => setMobileMenuOpen(false)}
            className="block text-gray-700 hover:text-black py-2"
          >
            The OS
          </Link>
          <div className="pt-2 border-t border-gray-100">
            <Link
              href="/craft/estimate"
              onClick={() => setMobileMenuOpen(false)}
              className="w-full bg-black text-white font-mono text-xs uppercase tracking-wider py-3.5 px-4 flex items-center justify-center gap-2"
            >
              <span>START A PROJECT</span>
              <span>→</span>
            </Link>
          </div>
        </div>
      )}
    </header>
  );
}

export default Navigation;
