'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import { staggerContainer, wordItem } from '@/components/Animations';

export function HeroSection() {
  const headline = 'NYC construction, without the guesswork.';
  const words = headline.split(' ');

  return (
    <section className="relative w-full min-h-[85vh] flex flex-col justify-center items-center px-6 pt-36 pb-24 bg-[#FAFAFA] border-b border-gray-200">
      <div className="max-w-5xl mx-auto text-center">
        <div className="inline-flex items-center gap-2 px-3 py-1 border border-gray-200 bg-white text-xs font-mono text-gray-600 uppercase tracking-wider mb-8">
          <span className="w-1.5 h-1.5 bg-black" />
          Construction OS & Transaction Infrastructure · Brooklyn & Queens Hub
        </div>

        <motion.div
          variants={staggerContainer}
          initial="hidden"
          animate="show"
          className="overflow-hidden mb-8"
        >
          <h1 className="text-5xl sm:text-7xl md:text-8xl font-serif tracking-tight leading-[1.05] text-black max-w-4xl mx-auto">
            {words.map((word, index) => (
              <motion.span
                key={index}
                variants={wordItem}
                className="inline-block mr-[0.25em]"
              >
                {word}
              </motion.span>
            ))}
          </h1>
        </motion.div>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8, duration: 0.8, ease: 'easeOut' }}
          className="max-w-2xl mx-auto text-lg md:text-xl text-gray-500 font-sans leading-relaxed"
        >
          Socio turns renovation projects into structured, verifiable transactions — from scope and contractor selection to milestones and payment.
        </motion.p>

        {/* Two-Sided Transaction Doorways (Demand & Supply) */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1, duration: 0.8, ease: 'easeOut' }}
          className="mt-14 grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl mx-auto w-full text-left"
        >
          {/* Demand Track: Property Owners */}
          <Link
            href="/craft/estimate"
            className="group bg-white border border-gray-200 p-8 hover:border-black transition-all flex flex-col justify-between min-h-[220px]"
          >
            <div>
              <div className="flex items-center justify-between mb-4">
                <span className="font-mono text-[10px] uppercase tracking-widest text-gray-400 bg-gray-50 border border-gray-200 px-2 py-0.5">
                  Demand Track
                </span>
                <span className="font-mono text-sm group-hover:translate-x-1 transition-transform">
                  →
                </span>
              </div>
              <h2 className="text-2xl font-serif text-black mb-2">
                For Property Owners
              </h2>
              <p className="font-sans text-sm text-gray-500 leading-relaxed mb-6">
                Turn your renovation into a structured project with normalized scope, DOB intelligence, vetted trade capacity, and milestone rails.
              </p>
            </div>
            <div className="font-mono text-xs font-semibold text-black border-t border-gray-100 pt-4 flex items-center justify-between">
              <span className="group-hover:underline">Build a structured project</span>
              <span className="text-gray-400">01</span>
            </div>
          </Link>

          {/* Supply Track: Contractors */}
          <Link
            href="/contractors/join"
            className="group bg-white border border-gray-200 p-8 hover:border-black transition-all flex flex-col justify-between min-h-[220px]"
          >
            <div>
              <div className="flex items-center justify-between mb-4">
                <span className="font-mono text-[10px] uppercase tracking-widest text-gray-400 bg-gray-50 border border-gray-200 px-2 py-0.5">
                  Supply Track
                </span>
                <span className="font-mono text-sm group-hover:translate-x-1 transition-transform">
                  →
                </span>
              </div>
              <h2 className="text-2xl font-serif text-black mb-2">
                For Contractors
              </h2>
              <p className="font-sans text-sm text-gray-500 leading-relaxed mb-6">
                Receive fully scoped, qualified opportunities with transparent client budgets, line-item specs, and guaranteed milestone disbursements.
              </p>
            </div>
            <div className="font-mono text-xs font-semibold text-black border-t border-gray-100 pt-4 flex items-center justify-between">
              <span className="group-hover:underline">Receive qualified opportunities</span>
              <span className="text-gray-400">02</span>
            </div>
          </Link>
        </motion.div>
      </div>
    </section>
  );
}

export default HeroSection;
