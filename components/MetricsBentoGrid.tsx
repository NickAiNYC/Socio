'use client';

import { motion } from 'framer-motion';
import { bentoContainer, bentoCard } from '@/components/Animations';

export function MetricsBentoGrid() {
  return (
    <section className="w-full bg-white py-32 px-6 border-b border-gray-200">
      <div className="max-w-7xl mx-auto">
        <div className="mb-16">
          <p className="font-mono text-xs uppercase tracking-widest text-gray-400 mb-3">
            Institutional Standards
          </p>
          <h2 className="text-3xl md:text-5xl font-serif text-black leading-tight">
            Built for precision.<br />Measured in outcomes.
          </h2>
        </div>

        <motion.div
          variants={bentoContainer}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, margin: '-100px' }}
          className="grid grid-cols-1 md:grid-cols-3 gap-6"
        >
          {/* Large Card - Span 2 Columns */}
          <motion.div
            variants={bentoCard}
            className="md:col-span-2 group bg-[#FAFAFA] border border-gray-200 p-10 hover:border-black transition-colors duration-300 flex flex-col justify-between min-h-[320px]"
          >
            <div className="font-mono text-xs uppercase tracking-widest text-gray-500 mb-8">
              Quality Standard
            </div>
            <div>
              <div className="text-6xl md:text-7xl font-serif text-black mb-4">Level 5</div>
              <p className="font-sans text-xl text-gray-600 max-w-md">
                Plaster and skim coat finishes executed to the highest architectural standards. No imperfections.
              </p>
            </div>
          </motion.div>

          {/* Standard Card */}
          <motion.div
            variants={bentoCard}
            className="group bg-[#FAFAFA] border border-gray-200 p-10 hover:border-black transition-colors duration-300 flex flex-col justify-between min-h-[320px]"
          >
            <div className="font-mono text-xs uppercase tracking-widest text-gray-500 mb-8">
              Turnaround Time
            </div>
            <div>
              <div className="text-6xl md:text-7xl font-serif text-black mb-4 flex items-center gap-2">
                <span className="text-4xl font-sans text-gray-400">&lt;</span> 4
              </div>
              <p className="font-sans text-lg text-gray-600">
                Hours to receive a fully digitized, line-item scope after the initial site visit.
              </p>
            </div>
          </motion.div>

          {/* Full Width Bottom Card */}
          <motion.div
            variants={bentoCard}
            className="md:col-span-3 group bg-black text-white p-10 flex flex-col md:flex-row md:items-end justify-between min-h-[240px]"
          >
            <div className="mb-8 md:mb-0">
              <div className="font-mono text-xs uppercase tracking-widest text-gray-400 mb-8">
                Coverage Area
              </div>
              <div className="text-5xl md:text-6xl font-serif">Kings & Queens</div>
            </div>
            <p className="font-sans text-lg text-gray-400 max-w-lg md:text-right">
              Currently operating exclusively within Brooklyn and Queens to maintain strict quality control and ultra-fast deployment times.
            </p>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}

export default MetricsBentoGrid;
