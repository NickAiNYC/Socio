'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { Menu, X, ArrowUpRight, ShieldCheck } from 'lucide-react';

interface NavItem {
  name: string;
  href: string;
  badge?: string;
}

const NAV_ITEMS: NavItem[] = [
  { name: 'Evidence', href: '/merchant-evidence.html' },
  { name: 'Attribution Protocol', href: '/trust-and-proof.html' },
  { name: 'Command Center', href: '/command-center.html', badge: 'LIVE' },
];

export function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState<boolean>(false);

  return (
    <motion.header
      initial={{ y: -100, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
      className="fixed top-0 left-0 right-0 w-full z-50 bg-gradient-to-b from-slate-900/95 via-slate-900/90 to-slate-800/85 backdrop-blur-md border-b border-white/10 shadow-[0_4px_30px_rgba(0,0,0,0.5)]"
    >
      <div className="max-w-7xl mx-auto px-6 h-18 sm:h-20 flex items-center justify-between">
        
        {/* Left Column: Brand Logo */}
        <div className="flex items-center gap-6">
          <Link
            href="/"
            className="flex items-center gap-1 text-xl sm:text-2xl font-bold text-white tracking-tight group"
          >
            <span>Socio</span>
            <span className="text-slate-400 group-hover:text-cyan-400 transition-colors">.</span>
          </Link>

          {/* Sub-pill (Desktop Only) */}
          <div className="hidden lg:flex items-center gap-2 border-l border-white/10 pl-4 py-1 text-xs font-mono text-slate-400">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
            <span>NYC Growth OS</span>
          </div>
        </div>

        {/* Center Column: Navigation Links (Desktop) */}
        <nav className="hidden md:flex items-center gap-8">
          {NAV_ITEMS.map((item) => (
            <Link
              key={item.name}
              href={item.href}
              className="text-sm font-medium text-slate-300 hover:text-white transition-colors duration-200 flex items-center gap-1.5 relative group"
            >
              <span>{item.name}</span>
              {item.badge && (
                <span className="text-[10px] font-mono font-bold px-1.5 py-0.5 rounded bg-cyan-500/15 text-cyan-300 border border-cyan-500/30">
                  {item.badge}
                </span>
              )}
              {/* Subtle underline hover effect */}
              <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-gradient-to-r from-white to-slate-400 group-hover:w-full transition-all duration-300" />
            </Link>
          ))}
        </nav>

        {/* Right Column: CTA Buttons (Desktop) */}
        <div className="hidden md:flex items-center gap-5">
          <Link
            href="/command-center.html"
            className="text-sm font-medium text-slate-300 hover:text-white transition-colors duration-200"
          >
            Client Login
          </Link>

          <Link
            href="#audit"
            className="relative inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-full text-xs font-bold font-sans tracking-tight text-slate-950 bg-gradient-to-b from-white via-slate-100 to-gray-200 hover:from-white hover:to-white shadow-[0_0_20px_rgba(255,255,255,0.25)] hover:shadow-[0_0_25px_rgba(255,255,255,0.45)] hover:scale-[1.02] active:scale-[0.98] transition-all duration-200 cursor-pointer"
          >
            <span>Start Free Audit</span>
            <ArrowUpRight className="w-3.5 h-3.5 stroke-[2.5]" />
          </Link>
        </div>

        {/* Mobile Hamburger Button */}
        <div className="flex md:hidden items-center gap-3">
          <Link
            href="#audit"
            className="px-3.5 py-1.5 rounded-full text-xs font-bold text-slate-950 bg-gradient-to-b from-white to-gray-200"
          >
            Audit
          </Link>

          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="p-2 rounded-lg bg-white/5 border border-white/10 text-slate-300 hover:text-white focus:outline-none"
            aria-label="Toggle navigation menu"
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>

      </div>

      {/* Mobile Drawer Menu */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.25, ease: 'easeInOut' }}
            className="md:hidden border-t border-white/10 bg-slate-900/98 backdrop-blur-xl px-6 py-6 space-y-4 shadow-2xl"
          >
            <nav className="flex flex-col space-y-3">
              {NAV_ITEMS.map((item) => (
                <Link
                  key={item.name}
                  href={item.href}
                  onClick={() => setMobileMenuOpen(false)}
                  className="text-base font-medium text-slate-200 hover:text-white py-2 flex items-center justify-between border-b border-white/5"
                >
                  <span>{item.name}</span>
                  {item.badge ? (
                    <span className="text-[10px] font-mono font-bold px-1.5 py-0.5 rounded bg-cyan-500/15 text-cyan-300 border border-cyan-500/30">
                      {item.badge}
                    </span>
                  ) : (
                    <ArrowUpRight className="w-4 h-4 text-slate-500" />
                  )}
                </Link>
              ))}
            </nav>

            <div className="pt-4 flex flex-col gap-3">
              <Link
                href="/command-center.html"
                onClick={() => setMobileMenuOpen(false)}
                className="w-full text-center py-2.5 text-sm font-medium text-slate-300 hover:text-white rounded-xl bg-white/5 border border-white/10"
              >
                Client Login
              </Link>
              <Link
                href="#audit"
                onClick={() => setMobileMenuOpen(false)}
                className="w-full text-center py-3 text-xs font-bold text-slate-950 rounded-full bg-gradient-to-b from-white to-gray-200 shadow-lg"
              >
                Start Free Audit
              </Link>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.header>
  );
}

export default Header;
