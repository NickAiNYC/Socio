'use client';

import { useState } from 'react';
import Link from 'next/link';

type AssemblyStep = 1 | 2 | 3 | 4 | 5;

export function HeroSection() {
  const [step, setStep] = useState<AssemblyStep>(5);

  const steps = [
    { num: 1 as AssemblyStep, label: '01. PROPERTY' },
    { num: 2 as AssemblyStep, label: '02. SCOPE' },
    { num: 3 as AssemblyStep, label: '03. CREWS' },
    { num: 4 as AssemblyStep, label: '04. COMPLIANCE' },
    { num: 5 as AssemblyStep, label: '05. MILESTONES' },
  ];

  return (
    <section className="relative w-full bg-[#FAFAFA] pt-36 pb-20 px-6 border-b border-gray-200">
      <div className="max-w-6xl mx-auto flex flex-col items-center text-center">
        {/* Eyebrow badge */}
        <div className="inline-flex items-center gap-2 px-3 py-1 border border-gray-200 bg-white text-xs font-mono text-gray-500 uppercase tracking-widest mb-8">
          <span className="w-1.5 h-1.5 bg-black" />
          Construction Operating System for NYC
        </div>

        {/* Display Headline */}
        <h1 className="text-5xl sm:text-7xl md:text-8xl font-serif tracking-tight leading-[1.05] text-black max-w-4xl">
          NYC construction, <br className="hidden sm:inline" />
          without the guesswork.
        </h1>

        {/* One-sentence value proposition */}
        <p className="mt-6 text-lg sm:text-xl text-gray-600 font-sans max-w-2xl leading-relaxed">
          Socio turns renovation projects into structured, verifiable transactions — from scope and contractor selection to milestones and payment.
        </p>

        {/* Dual Primary / Secondary CTAs */}
        <div className="mt-10 flex flex-col sm:flex-row items-center gap-4 w-full sm:w-auto">
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
        </div>

        {/* Interactive Digital Project Assembly Artifact */}
        <div className="mt-16 w-full max-w-4xl bg-white border border-gray-200 text-left shadow-xs font-mono text-xs">
          {/* Top terminal-style bar */}
          <div className="px-6 py-3.5 bg-gray-50 border-b border-gray-200 flex flex-wrap items-center justify-between gap-3">
            <div className="flex items-center gap-3">
              <span className={`w-2 h-2 rounded-full ${step >= 4 ? 'bg-emerald-500' : 'bg-amber-500'}`} />
              <span className="font-semibold text-black uppercase tracking-wider">
                SOCIO PROJECT INSTANCE
              </span>
              <span className="text-gray-400">#PRJ-7102-BK</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="bg-gray-100 text-gray-600 border border-gray-200 px-2 py-0.5 text-[10px] uppercase">
                [EXAMPLE PROJECT]
              </span>
              <span className="bg-emerald-50 text-emerald-800 border border-emerald-200 px-2.5 py-0.5 text-[10px] uppercase font-semibold">
                {step === 5 ? '● FULLY STRUCTURED RUNTIME' : `● ASSEMBLING STEP ${step} OF 5`}
              </span>
            </div>
          </div>

          {/* Assembly Stepper Scrubber */}
          <div className="px-6 py-3 bg-[#FAFAFA] border-b border-gray-200 flex items-center justify-between overflow-x-auto gap-4">
            <span className="text-[10px] text-gray-400 uppercase tracking-widest shrink-0">
              SCRUB DIGITAL ASSEMBLY:
            </span>
            <div className="flex items-center gap-2 shrink-0">
              {steps.map((s) => (
                <button
                  key={s.num}
                  onClick={() => setStep(s.num)}
                  className={`px-2.5 py-1 text-[10px] uppercase border transition-colors ${
                    step >= s.num
                      ? 'bg-black text-white border-black font-bold'
                      : 'bg-white text-gray-400 border-gray-200 hover:border-black'
                  }`}
                >
                  {s.label}
                </button>
              ))}
            </div>
          </div>

          {/* Project Body */}
          <div className="p-6 sm:p-8 space-y-6">
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

            {/* Step-by-Step Progressive Assembly Layers */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 py-2 font-mono text-xs">
              <div className={`p-4 border transition-all duration-300 ${step >= 2 ? 'bg-[#FAFAFA] border-gray-200' : 'bg-white border-dashed border-gray-200 opacity-40'}`}>
                <span className="text-gray-400 block text-[10px] uppercase tracking-widest mb-1">
                  {step >= 2 ? 'STRUCTURED SCOPE' : 'SCOPE DEFINITION'}
                </span>
                <span className="text-xl font-serif text-black font-semibold block">
                  {step >= 2 ? '42 Line Items' : 'Assembling...'}
                </span>
                <span className="text-gray-500 text-[11px] block mt-1">
                  {step >= 2 ? 'CSI 09 20 00 Inclusions & Exclusions' : 'Normalizing requests'}
                </span>
              </div>

              <div className={`p-4 border transition-all duration-300 ${step >= 3 ? 'bg-[#FAFAFA] border-gray-200' : 'bg-white border-dashed border-gray-200 opacity-40'}`}>
                <span className="text-gray-400 block text-[10px] uppercase tracking-widest mb-1">
                  {step >= 3 ? 'CONTRACTOR FIT' : 'TRADE MATCHING'}
                </span>
                <span className="text-xl font-serif text-black font-semibold block">
                  {step >= 3 ? '4 Matched GCs' : 'Filtering NYC crews...'}
                </span>
                <span className="text-gray-500 text-[11px] block mt-1">
                  {step >= 3 ? '94% Top Match · DOB Verified' : 'Checking permit history'}
                </span>
              </div>

              <div className={`p-4 border transition-all duration-300 ${step >= 5 ? 'bg-[#FAFAFA] border-gray-200' : 'bg-white border-dashed border-gray-200 opacity-40'}`}>
                <span className="text-gray-400 block text-[10px] uppercase tracking-widest mb-1">
                  {step >= 5 ? 'STAGED MILESTONES' : 'PAYMENT RAILS'}
                </span>
                <span className="text-xl font-serif text-black font-semibold block">
                  {step >= 5 ? '4 Gated Phases' : 'Securing rails...'}
                </span>
                <span className="text-gray-500 text-[11px] block mt-1">
                  {step >= 5 ? 'Inspection-controlled release' : 'Dual signoff setup'}
                </span>
              </div>
            </div>

            {/* Footer Telemetry */}
            <div className="pt-4 flex flex-wrap items-center justify-between gap-4 font-mono text-xs text-gray-500 border-t border-gray-100">
              <div className="flex flex-wrap items-center gap-4">
                <span className="flex items-center gap-1.5 text-black">
                  <span className="w-1.5 h-1.5 bg-black" />
                  Budget Baseline: $85,000 – $105,000
                </span>
                <span className="flex items-center gap-1.5 text-black">
                  <span className="w-1.5 h-1.5 bg-black" />
                  ACORD 25 Insurance Cleared
                </span>
              </div>
              <span className="text-[11px] text-gray-400 font-sans">
                Interactive assembly simulation
              </span>
            </div>
          </div>
        </div>

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
