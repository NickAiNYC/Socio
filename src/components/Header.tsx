'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { Menu, X, ArrowUpRight } from 'lucide-react';

interface NavLink {
  name: string;
  href: string;
}

// "Process" isn't a distinct section on the live homepage — the closest
// real anchors are #protocol (the step-by-step explanation) and
// #verification (the proof/evidence section). Rather than link "Process"
// to a dead anchor, it's folded into "How It Works" here. Say the word if
// you want a real fourth section built instead.
const NAV_LINKS: NavLink[] = [
  { name: 'How It Works', href: '/#protocol' },
  { name: 'Proof', href: '/#verification' },
  { name: 'FAQ', href: '/#faq' },
];

export function Header() {
  const [hovered, setHovered] = useState<string | null>(null);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <motion.div
      initial={{ y: -40, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
      className="fixed inset-x-0 top-4 z-50 px-4"
    >
      <header
        className="mx-auto flex h-16 w-full max-w-5xl items-center justify-between rounded-full border border-[#E5E0D8] bg-[#FBF9F5]/70 px-4 backdrop-blur-md sm:px-6"
        style={{
          boxShadow:
            '0 8px 30px rgba(0,0,0,0.04), inset 0 1px 0 0 rgba(255,255,255,0.6)',
        }}
      >
        {/* Logo */}
        <Link href="/" className="flex shrink-0 items-center gap-2 text-lg font-bold tracking-tight text-[#1C1917]">
          <span>Socio</span>
          <span className="relative flex h-2 w-2">
            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-[#FF5A1F] opacity-50" />
            <span className="relative inline-flex h-2 w-2 rounded-full bg-[#FF5A1F] shadow-[0_0_6px_rgba(255,90,31,0.7)]" />
          </span>
        </Link>

        {/* Nav links — animated layoutId hover pill, desktop only */}
        <nav
          onMouseLeave={() => setHovered(null)}
          className="hidden items-center gap-1 md:flex"
        >
          {NAV_LINKS.map((link) => (
            <Link
              key={link.name}
              href={link.href}
              onMouseEnter={() => setHovered(link.name)}
              className="relative rounded-full px-4 py-2 text-sm font-medium tracking-tight text-stone-600 transition-colors duration-150 hover:text-stone-900"
            >
              {hovered === link.name && (
                <motion.span
                  layoutId="nav-hover-pill"
                  className="absolute inset-0 rounded-full bg-stone-200/50"
                  transition={{ type: 'spring', stiffness: 420, damping: 32 }}
                />
              )}
              <span className="relative z-10">{link.name}</span>
            </Link>
          ))}
        </nav>

        {/* Right: locale toggle + primary CTA, desktop only */}
        <div className="hidden items-center gap-3 md:flex">
          <Link
            href="/contratistas"
            className="inline-flex items-center gap-1.5 rounded-full border border-[#E5E0D8] bg-[#F4F1EA] px-3.5 py-1.5 text-xs font-medium text-stone-700 transition-colors duration-150 hover:bg-[#EFEBE1]"
            style={{ boxShadow: 'inset 0 1px 2px rgba(0,0,0,0.06)' }}
          >
            <span>Contratistas</span>
            <span className="font-mono text-[10px] tracking-wide text-stone-500">(ES)</span>
          </Link>

          <Link
            href="#lead-capture"
            className="relative inline-flex items-center gap-2 rounded-full border-t border-white/20 bg-[#1C1917] px-5 py-2.5 text-xs font-bold tracking-tight text-[#FBF9F5] transition-all duration-150 hover:brightness-110 active:scale-95"
            style={{
              boxShadow:
                'inset 0 1px 0 0 rgba(255,255,255,0.1), 0 0 20px rgba(255,90,31,0.25)',
            }}
          >
            <span>Become a Socio</span>
            <ArrowUpRight className="h-3.5 w-3.5 stroke-[2.5]" />
          </Link>
        </div>

        {/* Mobile hamburger */}
        <button
          onClick={() => setMobileMenuOpen((v) => !v)}
          className="flex h-9 w-9 items-center justify-center rounded-full border border-[#E5E0D8] bg-[#F4F1EA] text-stone-700 md:hidden"
          aria-label="Toggle navigation menu"
          aria-expanded={mobileMenuOpen}
        >
          {mobileMenuOpen ? <X className="h-4 w-4" /> : <Menu className="h-4 w-4" />}
        </button>
      </header>

      {/* Mobile panel */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -8, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -8, scale: 0.98 }}
            transition={{ duration: 0.18, ease: 'easeOut' }}
            className="mx-auto mt-2 w-full max-w-5xl rounded-3xl border border-[#E5E0D8] bg-[#FBF9F5]/95 p-4 backdrop-blur-md md:hidden"
            style={{ boxShadow: '0 8px 30px rgba(0,0,0,0.06)' }}
          >
            <nav className="flex flex-col divide-y divide-[#E5E0D8]/80">
              {NAV_LINKS.map((link) => (
                <Link
                  key={link.name}
                  href={link.href}
                  onClick={() => setMobileMenuOpen(false)}
                  className="py-3 text-sm font-medium text-stone-700 hover:text-stone-900"
                >
                  {link.name}
                </Link>
              ))}
            </nav>

            <div className="mt-3 flex flex-col gap-2.5">
              <Link
                href="/contratistas"
                onClick={() => setMobileMenuOpen(false)}
                className="inline-flex items-center justify-center gap-1.5 rounded-full border border-[#E5E0D8] bg-[#F4F1EA] px-4 py-2.5 text-xs font-medium text-stone-700"
                style={{ boxShadow: 'inset 0 1px 2px rgba(0,0,0,0.06)' }}
              >
                <span>Contratistas</span>
                <span className="font-mono text-[10px] tracking-wide text-stone-500">(ES)</span>
              </Link>

              <Link
                href="#lead-capture"
                onClick={() => setMobileMenuOpen(false)}
                className="inline-flex items-center justify-center gap-2 rounded-full border-t border-white/20 bg-[#1C1917] px-4 py-3 text-xs font-bold tracking-tight text-[#FBF9F5] active:scale-95"
                style={{
                  boxShadow:
                    'inset 0 1px 0 0 rgba(255,255,255,0.1), 0 0 20px rgba(255,90,31,0.25)',
                }}
              >
                <span>Become a Socio</span>
                <ArrowUpRight className="h-3.5 w-3.5 stroke-[2.5]" />
              </Link>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

export default Header;
