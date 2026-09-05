'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import { staggerContainer, wordItem } from '@/components/Animations';

export function HeroSection() {
  const line1 = ['NYC', 'construction,'];
  const line2 = ['without', 'the', 'guesswork.'];

  const ownerPoints = [
    'Normalized scope.',
    'DOB intelligence.',
    'Verified trade capacity.',
    'Compliance documentation.',
    'Milestone-controlled payments.',
  ];

  const contractorPoints = [
    'Transparent client budgets.',
    'Line-item specifications.',
    'Verified project requirements.',
    'Milestone payment rails.',
  ];

  return (
    <section className="relative w-full min-h-[85vh] flex flex-col justify-center items-center px-6 pt-36 pb-24 bg-[#FAFAFA] border-b border-gray-200">
      <div className="max-w-5xl mx-auto text-center">
        <div className="inline-flex items-center gap-2 px-3 py-1 border border-gray-200 bg-white text-xs font-mono text-gray-600 uppercase tracking-wider mb-8">
          <span className="w-1.5 h-1.5 bg-black" />
          Construction Operating System for NYC · Brooklyn & Queens Hub
        </div>

        <motion.div
          variants={staggerContainer}
          initial="hidden"
          animate="show"
          className="overflow-hidden mb-8"
        >
          <h1 className="text-5xl sm:text-7xl md:text-8xl font-serif tracking-tight leading-[1.04] text-black max-w-4xl mx-auto">
            <span className="block">
              {line1.map((word, index) => (
                <motion.span
                  key={index}
                  variants={wordItem}
                  className="inline-block mr-[0.25em]"
                >
                  {word}
                </motion.span>
              ))}
            </span>
            <span className="block">
              {line2.map((word, index) => (
                <motion.span
                  key={index}
                  variants={wordItem}
                  className="inline-block mr-[0.25em]"
                >
                  {word}
                </motion.span>
              ))}
            </span>
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

        {/* Two-Sided Transaction Doorways */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1, duration: 0.8, ease: 'easeOut' }}
          className="mt-16 grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl mx-auto w-full text-left"
        >
          {/* FOR PROPERTY OWNERS */}
          <div className="bg-white border border-gray-200 p-8 flex flex-col justify-between hover:border-black transition-colors">
            <div>
              <div className="flex items-center justify-between mb-4">
                <span className="font-mono text-[10px] uppercase tracking-widest text-gray-500 bg-gray-100 border border-gray-200 px-2.5 py-1">
                  Demand Side
                </span>
                <span className="font-mono text-xs text-gray-400">01</span>
              </div>
              <h2 className="text-2xl font-serif text-black mb-2">
                For Property Owners
              </h2>
              <p className="font-sans text-sm text-gray-600 mb-6 font-medium">
                Turn your renovation into a structured project.
              </p>
              <ul className="space-y-2 mb-8 border-t border-gray-100 pt-4">
                {ownerPoints.map((point, idx) => (
                  <li key={idx} className="flex items-center gap-2 font-mono text-xs text-gray-500">
                    <span className="w-1.5 h-1.5 bg-black shrink-0" />
                    {point}
                  </li>
                ))}
              </ul>
            </div>
            <Link
              href="/craft/estimate"
              className="w-full bg-black text-white font-sans text-sm font-medium py-3.5 px-6 hover:bg-gray-800 transition-colors flex items-center justify-between group"
            >
              <span>BUILD A STRUCTURED PROJECT</span>
              <span className="font-mono group-hover:translate-x-1 transition-transform">→</span>
            </Link>
          </div>

          {/* FOR CONTRACTORS */}
          <div className="bg-white border border-gray-200 p-8 flex flex-col justify-between hover:border-black transition-colors">
            <div>
              <div className="flex items-center justify-between mb-4">
                <span className="font-mono text-[10px] uppercase tracking-widest text-gray-500 bg-gray-100 border border-gray-200 px-2.5 py-1">
                  Supply Side
                </span>
                <span className="font-mono text-xs text-gray-400">02</span>
              </div>
              <h2 className="text-2xl font-serif text-black mb-2">
                For Contractors
              </h2>
              <p className="font-sans text-sm text-gray-600 mb-6 font-medium">
                Receive qualified projects instead of anonymous leads.
              </p>
              <ul className="space-y-2 mb-8 border-t border-gray-100 pt-4">
                {contractorPoints.map((point, idx) => (
                  <li key={idx} className="flex items-center gap-2 font-mono text-xs text-gray-500">
                    <span className="w-1.5 h-1.5 bg-black shrink-0" />
                    {point}
                  </li>
                ))}
              </ul>
            </div>
            <Link
              href="/contractors/join"
              className="w-full bg-black text-white font-sans text-sm font-medium py-3.5 px-6 hover:bg-gray-800 transition-colors flex items-center justify-between group"
            >
              <span>RECEIVE QUALIFIED OPPORTUNITIES</span>
              <span className="font-mono group-hover:translate-x-1 transition-transform">→</span>
            </Link>
          </div>
        </motion.div>
      </div>
    </section>
  );
}

export default HeroSection;
