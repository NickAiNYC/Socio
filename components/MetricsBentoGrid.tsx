'use client';

import { motion } from 'framer-motion';
import { bentoContainer, bentoCard } from '@/components/Animations';

export function MetricsBentoGrid() {
  const neighborhoods = [
    'Park Slope',
    'Brooklyn Heights',
    'Carroll Gardens',
    'Cobble Hill',
    'Crown Heights',
    'Williamsburg',
    'Greenpoint',
    'Astoria',
    'Long Island City',
  ];

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
            <div className="flex items-center justify-between">
              <div className="font-mono text-xs uppercase tracking-widest text-gray-500">
                Quality Standard
              </div>
              <span className="font-mono text-[10px] bg-white border border-gray-200 px-2 py-0.5 text-gray-500 uppercase tracking-widest">
                DOB / Board Aligned
              </span>
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
            <div className="flex items-center justify-between">
              <div className="font-mono text-xs uppercase tracking-widest text-gray-500">
                Turnaround Time
              </div>
              <span className="font-mono text-[10px] bg-white border border-gray-200 px-2 py-0.5 text-gray-500 uppercase tracking-widest">
                Digital Desk
              </span>
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

          {/* Full Width Bottom Card with Neighborhoods */}
          <motion.div
            variants={bentoCard}
            className="md:col-span-3 group bg-black text-white p-10 flex flex-col justify-between min-h-[280px]"
          >
            <div className="flex flex-col md:flex-row md:items-start justify-between gap-6 mb-8">
              <div>
                <div className="font-mono text-xs uppercase tracking-widest text-gray-400 mb-4">
                  Borough Coverage Area
                </div>
                <div className="text-5xl md:text-6xl font-serif">Kings & Queens</div>
              </div>
              <p className="font-sans text-base md:text-lg text-gray-400 max-w-lg md:text-right">
                Operating strictly within verified residential corridors in Brooklyn & Queens to guarantee direct site supervision, rapid mobilization, and verified co-op/condo compliance.
              </p>
            </div>

            <div className="border-t border-gray-800 pt-6">
              <span className="font-mono text-[10px] uppercase tracking-widest text-gray-400 block mb-3">
                Active Neighborhood Hubs:
              </span>
              <div className="flex flex-wrap gap-2">
                {neighborhoods.map((nh, idx) => (
                  <span
                    key={idx}
                    className="font-mono text-xs bg-zinc-900 border border-zinc-700/80 px-3 py-1 text-gray-300 tracking-wide"
                  >
                    {nh}
                  </span>
                ))}
              </div>
            </div>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}

export default MetricsBentoGrid;
