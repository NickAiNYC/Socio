'use client';

import { useState } from 'react';
import { ChevronDown } from 'lucide-react';

export function FaqSection() {
  const [openIdx, setOpenIdx] = useState<number | null>(0);

  const faqs = [
    {
      q: 'What is Socio?',
      a: 'Socio is the Construction Operating System for NYC residential renovation. We turn chaotic renovation ideas into structured, verifiable digital projects — organizing scope, contractor selection, board compliance, and milestone payments in one unified record.',
    },
    {
      q: 'Who is Socio for?',
      a: 'Property owners planning co-op, condo, brownstone, or townhouse renovations who want clear scopes and financial protection, and vetted NYC general contractors and master trades who want serious, pre-scoped projects with real budgets.',
    },
    {
      q: 'How does Socio match contractors?',
      a: 'We match projects objectively against trade specialization (e.g., Level 5 plastering, architectural millwork), active NYC Department of Buildings (DOB) permit history, verified insurance, geographic proximity, and specific co-op/condo board experience.',
    },
    {
      q: 'What does a structured project include?',
      a: 'A 42+ line-item CSI division scope with explicit inclusions, exclusions, and identified unknowns, an architectural baseline budget model, target timeline, and a board-ready alteration compliance kit.',
    },
    {
      q: 'Does Socio manage construction?',
      a: 'Socio is not a general contractor. We provide the operating system that governs the transaction: structuring the project, matching the right licensed trade crews, providing milestone payment rails, and enforcing milestone inspections before capital is disbursed.',
    },
    {
      q: 'How does payment work?',
      a: 'Funds are never paid upfront blindly. Capital for each project phase is secured on staged milestone payment rails and released to the contractor only after inspection clearance and mutual sign-off from both the owner and contractor.',
    },
    {
      q: 'What types of NYC properties does Socio support?',
      a: 'Pre-war co-ops, post-war condos, historic brownstones, rowhouses, townhouses, and single-family residential properties across Brooklyn, Manhattan, and Queens.',
    },
    {
      q: 'How are contractors verified?',
      a: 'Every crew undergoes strict verification: active NYC Department of Consumer and Worker Protection (DCWP) or DOB licensing, clean permit and violation history, $1M/$2M general liability and workers’ comp (ACORD 25), and verified past client references.',
    },
  ];

  return (
    <section className="w-full bg-white py-32 px-6 border-b border-gray-200">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="mb-16">
          <p className="font-mono text-xs uppercase tracking-widest text-gray-400 mb-3">
            Frequently Asked Questions
          </p>
          <h2 className="text-4xl sm:text-5xl font-serif text-black leading-tight">
            Clear answers before you begin.
          </h2>
        </div>

        {/* Accordion List */}
        <div className="border-t border-gray-200 divide-y divide-gray-200 font-mono text-xs">
          {faqs.map((faq, idx) => {
            const isOpen = openIdx === idx;
            return (
              <div key={idx} className="py-6">
                <button
                  onClick={() => setOpenIdx(isOpen ? null : idx)}
                  className="w-full flex items-center justify-between text-left gap-4 group"
                  aria-expanded={isOpen}
                >
                  <span className="font-serif text-xl sm:text-2xl text-black group-hover:text-gray-600 transition-colors">
                    {faq.q}
                  </span>
                  <ChevronDown
                    className={`w-5 h-5 text-gray-400 shrink-0 transition-transform duration-300 ${
                      isOpen ? 'rotate-180 text-black' : ''
                    }`}
                  />
                </button>
                {isOpen && (
                  <div className="pt-4 pr-12 font-sans text-sm sm:text-base text-gray-600 leading-relaxed animate-in fade-in duration-200">
                    {faq.a}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

export default FaqSection;
