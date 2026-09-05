'use client';

import Link from 'next/link';

export function SystemCTA() {
  return (
    <section className="w-full bg-[#FAFAFA] py-36 px-6 border-b border-gray-200">
      <div className="max-w-4xl mx-auto text-center space-y-8">
        <p className="font-mono text-xs uppercase tracking-widest text-gray-400">
          Ready When You Are
        </p>
        <h2 className="text-4xl sm:text-6xl md:text-7xl font-serif text-black leading-tight tracking-tight">
          Start with a <br />
          better-defined project.
        </h2>
        <p className="font-sans text-gray-600 text-lg sm:text-xl max-w-xl mx-auto leading-relaxed">
          Turn your renovation into a structured Socio Project — with normalized scope, verified contractors, and inspection-gated milestone payments.
        </p>

        {/* Dual standardized CTAs */}
        <div className="pt-6 flex flex-col sm:flex-row items-center justify-center gap-4">
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

        <div className="pt-12 border-t border-gray-200 flex flex-col sm:flex-row items-center justify-between text-xs font-mono text-gray-400 gap-4">
          <span>SOCIO OPERATING SYSTEM · NYC</span>
          <a
            href="https://wa.me/16467504650?text=Hello%20Socio%20Operations%20Desk"
            target="_blank"
            rel="noopener noreferrer"
            className="text-gray-500 hover:text-black transition-colors flex items-center gap-1.5"
          >
            <span>Direct WhatsApp Desk: +1 (646) 750-4650</span>
            <span>↗</span>
          </a>
        </div>
      </div>
    </section>
  );
}

export default SystemCTA;
