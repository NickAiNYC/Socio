'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { Menu, X, ArrowUpRight, ChevronDown, HardHat, Building2, Store } from 'lucide-react';

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

const INDUSTRY_ITEMS = [
  {
    name: 'Construction (Español)',
    desc: 'NYC General Contractors & Remodelers (Zero Upfront)',
    href: '/contratistas',
    icon: HardHat,
    badge: 'ES-FIRST',
  },
  {
    name: 'Retail & POS Merchants',
    desc: 'Local NYC Storefronts & Restaurants',
    href: '/#how-it-works',
    icon: Store,
  },
];

export function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState<boolean>(false);
  const [industriesOpen, setIndustriesOpen] = useState<boolean>(false);

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
            className="flex items-center text-xl sm:text-2xl font-bold text-white tracking-tight group"
          >
            <span>Socio</span>
            <span className="w-1.5 h-1.5 rounded-[1px] bg-[#669BD2] inline-block shadow-[0_0_6px_rgba(102,155,210,0.8)] ml-[1.5px] self-end mb-1"></span>
          </Link>

          {/* Sub-pill (Desktop Only) */}
          <div className="hidden lg:flex items-center gap-2 border-l border-white/10 pl-4 py-1 text-xs font-mono text-slate-400">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
            <span>NYC Growth OS</span>
          </div>
        </div>

        {/* Center Column: Navigation Links (Desktop) */}
        <nav className="hidden md:flex items-center gap-8">
          
          {/* Industries Dropdown */}
          <div 
            className="relative"
            onMouseEnter={() => setIndustriesOpen(true)}
            onMouseLeave={() => setIndustriesOpen(false)}
          >
            <button
              className="text-sm font-medium text-slate-300 hover:text-white transition-colors duration-200 flex items-center gap-1.5 py-2 cursor-pointer focus:outline-none"
              aria-expanded={industriesOpen}
            >
              <span>Industries</span>
              <ChevronDown className={`w-3.5 h-3.5 transition-transform duration-200 ${industriesOpen ? 'rotate-180 text-white' : 'text-slate-400'}`} />
            </button>

            <AnimatePresence>
              {industriesOpen && (
                <motion.div
                  initial={{ opacity: 0, y: 10, scale: 0.95 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: 10, scale: 0.95 }}
                  transition={{ duration: 0.15, ease: 'easeOut' }}
                  className="absolute top-full left-0 w-80 p-2 bg-slate-900/98 backdrop-blur-2xl border border-white/15 rounded-2xl shadow-2xl space-y-1"
                >
                  {INDUSTRY_ITEMS.map((ind) => {
                    const Icon = ind.icon;
                    return (
                      <Link
                        key={ind.name}
                        href={ind.href}
                        className="flex items-start gap-3 p-3 rounded-xl hover:bg-white/10 transition-colors group"
                      >
                        <div className="w-8 h-8 rounded-lg bg-white/5 border border-white/10 flex items-center justify-center text-slate-300 group-hover:text-white group-hover:border-white/25 shrink-0 mt-0.5">
                          <Icon className="w-4 h-4" />
                        </div>
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="text-xs font-bold text-white group-hover:text-white">
                              {ind.name}
                            </span>
                            {ind.badge && (
                              <span className="text-[9px] font-mono font-bold px-1.5 py-0.2 rounded bg-orange-500/20 text-orange-400 border border-orange-500/30">
                                {ind.badge}
                              </span>
                            )}
                          </div>
                          <p className="text-[11px] text-slate-400 font-normal leading-tight mt-0.5">
                            {ind.desc}
                          </p>
                        </div>
                      </Link>
                    );
                  })}
                </motion.div>
              )}
            </AnimatePresence>
          </div>

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
            href="#audit-tool"
            className="relative inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-full text-xs font-bold font-sans tracking-tight text-slate-950 bg-gradient-to-b from-white via-slate-100 to-gray-200 hover:from-white hover:to-white shadow-[0_0_20px_rgba(255,255,255,0.25)] hover:shadow-[0_0_25px_rgba(255,255,255,0.45)] hover:scale-[1.02] active:scale-[0.98] transition-all duration-200 cursor-pointer"
          >
            <span>Start Free Audit</span>
            <ArrowUpRight className="w-3.5 h-3.5 stroke-[2.5]" />
          </Link>
        </div>

        {/* Mobile Hamburger Button */}
        <div className="flex md:hidden items-center gap-3">
          <Link
            href="#audit-tool"
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
              <div className="text-xs font-mono font-bold uppercase tracking-wider text-slate-500 px-1">
                Industries & Verticals
              </div>
              <Link
                href="/contratistas"
                onClick={() => setMobileMenuOpen(false)}
                className="text-base font-semibold text-orange-400 hover:text-orange-300 py-1.5 flex items-center justify-between border-b border-white/5"
              >
                <div className="flex items-center gap-2">
                  <HardHat className="w-4 h-4 text-orange-400" />
                  <span>Construction (Español)</span>
                </div>
                <span className="text-[9px] font-mono font-bold px-1.5 py-0.5 rounded bg-orange-500/20 text-orange-400">
                  ES
                </span>
              </Link>

              <div className="pt-2 text-xs font-mono font-bold uppercase tracking-wider text-slate-500 px-1">
                Platform
              </div>
              {NAV_ITEMS.map((item) => (
                <Link
                  key={item.name}
                  href={item.href}
                  onClick={() => setMobileMenuOpen(false)}
                  className="text-base font-medium text-slate-200 hover:text-white py-1.5 flex items-center justify-between border-b border-white/5"
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
