'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';

export function HeroSection() {
  return (
    <section className="relative w-full bg-[#FAFAFA] pt-36 pb-20 px-6 border-b border-gray-200">
      <div className="max-w-6xl mx-auto flex flex-col items-center text-center">
        {/* Eyebrow badge */}
        <motion.div
          initial={{ opacity: 0, y: -8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="inline-flex items-center gap-2 px-3 py-1 border border-gray-200 bg-white text-xs font-mono text-gray-500 uppercase tracking-widest mb-8"
        >
          <span className="w-1.5 h-1.5 bg-black" />
          Construction Operating System for NYC
        </motion.div>

        {/* Display Headline */}
        <motion.h1
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.1 }}
          className="text-5xl sm:text-7xl md:text-8xl font-serif tracking-tight leading-[1.05] text-black max-w-4xl"
        >
          NYC construction, <br className="hidden sm:inline" />
          without the guesswork.
        </motion.h1>

        {/* Single clear value proposition */}
        <motion.p
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.2 }}
          className="mt-6 text-lg sm:text-xl text-gray-600 font-sans max-w-2xl leading-relaxed"
        >
          Socio turns renovation projects into structured, verifiable transactions — from scope and contractor selection to milestones and payment.
        </motion.p>

        {/* Dual Primary / Secondary CTAs */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.3 }}
          className="mt-10 flex flex-col sm:flex-row items-center gap-4 w-full sm:w-auto"
        >
          <Link
            href="/craft/estimate"
            className="w-full sm:w-auto bg-black text-white font-mono text-xs uppercase tracking-wider px-8 py-4 hover:bg-gray-800 transition-colors flex items-center justify-center gap-3"
          >
            <span>START A PROJECT</span>
            <span>→</span>
          </Link>
          <Link
            href="/contractors/join"
            className="w-full sm:w-auto bg-white border border-gray-300 text-black font-mono text-xs uppercase tracking-wider px-8 py-4 hover:border-black transition-colors flex items-center justify-center gap-3"
          >
            <span>I&apos;M A CONTRACTOR</span>
            <span>→</span>
          </Link>
        </motion.div>

        {/* Realistic Product Artifact: Example Project */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          className="mt-16 w-full max-w-4xl bg-white border border-gray-200 text-left shadow-xs"
        >
          {/* Top terminal-style bar */}
          <div className="px-6 py-3.5 bg-gray-50 border-b border-gray-200 flex flex-wrap items-center justify-between gap-3 font-mono text-xs">
            <div className="flex items-center gap-3">
              <span className="w-2 h-2 bg-emerald-500 rounded-full" />
              <span className="font-semibold text-black uppercase tracking-wider">
                SOCIO PROJECT
              </span>
              <span className="text-gray-400">#PRJ-7102-BK</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="bg-gray-100 text-gray-600 border border-gray-200 px-2 py-0.5 text-[10px] uppercase font-mono">
                [EXAMPLE PROJECT]
              </span>
              <span className="bg-emerald-50 text-emerald-800 border border-emerald-200 px-2.5 py-0.5 text-[10px] uppercase font-semibold">
                ● READY FOR CONTRACTOR REVIEW
              </span>
            </div>
          </div>

          {/* Project Body */}
          <div className="p-6 sm:p-8">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-gray-100">
              <div>
                <h3 className="text-2xl sm:text-3xl font-serif text-black">
                  Park Slope · Co-op · Kitchen Renovation
                </h3>
                <p className="font-sans text-xs sm:text-sm text-gray-500 mt-1">
                  1892 Brownstone · Complete Mechanical Rough-in &amp; Custom Millwork Assembly
                </p>
              </div>
              <Link
                href="/project/PRJ-7102-BK"
                className="inline-flex items-center gap-1.5 font-mono text-xs text-black border border-gray-300 px-3 py-1.5 hover:bg-gray-50 transition-colors shrink-0"
              >
                <span>Inspect Runtime</span>
                <span>→</span>
              </Link>
            </div>

            {/* Metrics 3-column row */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 py-6 border-b border-gray-100 font-mono text-xs">
              <div>
                <span className="text-gray-400 block text-[10px] uppercase tracking-widest mb-1">
                  ESTIMATED BUDGET
                </span>
                <span className="text-xl sm:text-2xl font-serif text-black font-semibold">
                  $85,000 – $105,000
                </span>
                <span className="text-gray-500 text-[11px] block mt-0.5">
                  Normalized labor &amp; material baseline
                </span>
              </div>
              <div>
                <span className="text-gray-400 block text-[10px] uppercase tracking-widest mb-1">
                  STRUCTURED SCOPE
                </span>
                <span className="text-xl sm:text-2xl font-serif text-black font-semibold">
                  42 Line Items
                </span>
                <span className="text-gray-500 text-[11px] block mt-0.5">
                  CSI-aligned inclusions &amp; exclusions
                </span>
              </div>
              <div>
                <span className="text-gray-400 block text-[10px] uppercase tracking-widest mb-1">
                  TARGET SCHEDULE
                </span>
                <span className="text-xl sm:text-2xl font-serif text-black font-semibold">
                  14 Weeks
                </span>
                <span className="text-gray-500 text-[11px] block mt-0.5">
                  Board quiet-hours factored
                </span>
              </div>
            </div>

            {/* Footer highlights */}
            <div className="pt-4 flex flex-wrap items-center justify-between gap-4 font-mono text-xs text-gray-500">
              <div className="flex flex-wrap items-center gap-4 sm:gap-6">
                <span className="flex items-center gap-1.5 text-black">
                  <span className="w-1.5 h-1.5 bg-black" />
                  4 qualified contractors matched
                </span>
                <span className="flex items-center gap-1.5 text-black">
                  <span className="w-1.5 h-1.5 bg-black" />
                  6 inspection-gated milestones
                </span>
                <span className="flex items-center gap-1.5 text-black">
                  <span className="w-1.5 h-1.5 bg-black" />
                  8 building compliance docs prepared
                </span>
              </div>
              <span className="text-[11px] text-gray-400 font-sans">
                Updated in real time
              </span>
            </div>
          </div>
        </motion.div>

        {/* Minimal Typographic Trust Strip */}
        <div className="mt-16 pt-8 border-t border-gray-200 w-full flex flex-col md:flex-row md:items-center justify-between gap-4 font-mono text-xs text-gray-500">
          <span className="uppercase tracking-widest text-black font-semibold">
            BUILT FOR NYC RENOVATION:
          </span>
          <div className="flex flex-wrap items-center gap-4 sm:gap-8 text-gray-600">
            <span>Co-ops</span>
            <span className="text-gray-300">/</span>
            <span>Condos</span>
            <span className="text-gray-300">/</span>
            <span>Brownstones</span>
            <span className="text-gray-300">/</span>
            <span>Townhouses</span>
            <span className="text-gray-300">/</span>
            <span>Pre-war Buildings</span>
          </div>
        </div>
      </div>
    </section>
  );
}

export default HeroSection;
