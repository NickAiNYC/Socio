'use client';

import Link from 'next/link';

export function SystemCTA() {
  return (
    <section className="w-full bg-[#FAFAFA] py-32 px-6 border-b border-gray-200">
      <div className="max-w-7xl mx-auto">
        <div className="max-w-4xl mx-auto text-center mb-16">
          <p className="font-mono text-xs uppercase tracking-widest text-gray-400 mb-3">
            Transaction Execution
          </p>
          <h2 className="text-4xl md:text-6xl font-serif text-black leading-tight mb-6">
            Ready to execute NYC construction <br />
            without the guesswork?
          </h2>
          <p className="font-sans text-gray-600 text-lg md:text-xl max-w-2xl mx-auto leading-relaxed">
            Whether you are a property owner planning a pre-war renovation or a master craftsman seeking verified demand, Socio replaces fragmentation with control.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-5xl mx-auto">
          {/* FOR PROPERTY OWNERS */}
          <div className="bg-white border border-gray-200 p-8 md:p-12 flex flex-col justify-between hover:border-black transition-colors shadow-xs">
            <div>
              <div className="flex items-center justify-between pb-4 border-b border-gray-100 mb-6">
                <span className="font-mono text-xs uppercase tracking-widest text-gray-500 bg-gray-50 border border-gray-200 px-2.5 py-1">
                  Property Owners
                </span>
                <span className="font-mono text-xs text-gray-400">DEMAND</span>
              </div>
              <h3 className="text-3xl font-serif text-black mb-3">
                Build a Structured Project
              </h3>
              <p className="font-sans text-sm text-gray-500 mb-8 leading-relaxed">
                Submit your preliminary renovation details. Receive a normalized CSI scope breakdown, pre-vetted master trade matches, and guaranteed milestone escrow protection.
              </p>
            </div>
            <Link
              href="/craft/estimate"
              className="w-full bg-black text-white font-sans text-sm font-medium py-4 px-6 hover:bg-gray-800 transition-colors flex items-center justify-between group"
            >
              <span>BUILD A STRUCTURED PROJECT</span>
              <span className="font-mono group-hover:translate-x-1 transition-transform">→</span>
            </Link>
          </div>

          {/* FOR CONTRACTORS */}
          <div className="bg-white border border-gray-200 p-8 md:p-12 flex flex-col justify-between hover:border-black transition-colors shadow-xs">
            <div>
              <div className="flex items-center justify-between pb-4 border-b border-gray-100 mb-6">
                <span className="font-mono text-xs uppercase tracking-widest text-gray-500 bg-gray-50 border border-gray-200 px-2.5 py-1">
                  Contractors &amp; Trades
                </span>
                <span className="font-mono text-xs text-gray-400">SUPPLY</span>
              </div>
              <h3 className="text-3xl font-serif text-black mb-3">
                Receive Qualified Opportunities
              </h3>
              <p className="font-sans text-sm text-gray-500 mb-8 leading-relaxed">
                Stop wasting unpaid nights calculating estimates on cold leads. Receive verified project scopes with transparent client budgets and guaranteed milestone bank rails.
              </p>
            </div>
            <Link
              href="/contractors/join"
              className="w-full bg-black text-white font-sans text-sm font-medium py-4 px-6 hover:bg-gray-800 transition-colors flex items-center justify-between group"
            >
              <span>RECEIVE QUALIFIED OPPORTUNITIES</span>
              <span className="font-mono group-hover:translate-x-1 transition-transform">→</span>
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}

export default SystemCTA;
