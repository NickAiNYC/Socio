'use client';

import { motion } from 'framer-motion';
import { staggerContainer, wordItem } from '@/components/Animations';

export function HeroSection() {
  const headline = "Infrastructure and precision front-office for local trades.";
  const words = headline.split(" ");

  return (
    <section className="relative w-full min-h-[80vh] flex flex-col justify-center items-center px-6 pt-32 pb-24 bg-[#FAFAFA] border-b border-gray-200">
      <div className="max-w-5xl mx-auto text-center">
        <div className="inline-flex items-center gap-2 px-3 py-1 border border-gray-200 bg-white text-xs font-mono text-gray-600 uppercase tracking-wider mb-8">
          <span className="w-1.5 h-1.5 bg-black" />
          Vetted Brooklyn Trade Capacity · Q3 2026
        </div>

        <motion.div
          variants={staggerContainer}
          initial="hidden"
          animate="show"
          className="overflow-hidden mb-8"
        >
          <h1 className="text-5xl sm:text-7xl md:text-8xl font-serif tracking-tight leading-[1.05] text-black">
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
          transition={{ delay: 0.8, duration: 0.8, ease: "easeOut" }}
          className="max-w-2xl mx-auto text-lg md:text-xl text-gray-500 font-sans leading-relaxed"
        >
          Socio pairs master-level independent craftsmen across Brooklyn with transparent, institutional-grade estimates.
        </motion.p>
      </div>
    </section>
  );
}

export default HeroSection;
