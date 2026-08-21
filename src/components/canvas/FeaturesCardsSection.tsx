'use client';

import { useEffect, useRef, useState } from 'react';
import { motion, useInView, useReducedMotion } from 'framer-motion';
import { FeaturesScene } from './FeaturesScene';
import type { GlassCardContent } from './GlassCard';

export interface FeaturesCardsSectionProps {
  cards: Array<{ title: string; body: string }>;
}

function useIsMobile(breakpointPx = 768) {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const query = window.matchMedia(`(max-width: ${breakpointPx - 1}px)`);
    const update = () => setIsMobile(query.matches);
    update();
    query.addEventListener('change', update);
    return () => query.removeEventListener('change', update);
  }, [breakpointPx]);

  return isMobile;
}

/** Tailwind-only frosted-glass approximation for mobile: avoids a WebGL context on small/battery-constrained devices. */
function StaticGlassCards({ cards }: { cards: GlassCardContent[] }) {
  const reducedMotion = useReducedMotion();

  return (
    <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
      {cards.map((card, i) => (
        <motion.article
          key={card.title}
          initial={reducedMotion ? false : { opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.4 }}
          transition={{ duration: 0.5, delay: i * 0.08, ease: [0.16, 1, 0.3, 1] }}
          className="relative overflow-hidden rounded-3xl border border-white/15 bg-gradient-to-br from-white/[0.14] to-white/[0.04] p-6 shadow-2xl backdrop-blur-xl [@media(prefers-reduced-transparency:reduce)]:bg-[#fdfcf8] [@media(prefers-reduced-transparency:reduce)]:backdrop-blur-none"
        >
          <div className="pointer-events-none absolute inset-x-0 top-0 h-24 bg-gradient-to-b from-[#e7b285]/25 to-transparent" />
          <span className="font-mono text-[11px] font-bold tracking-[0.2em] text-[#e7b285]">
            0{i + 1}
          </span>
          <h3 className="mt-5 font-sans text-2xl font-black tracking-tight text-white">
            {card.title}
          </h3>
          <p className="mt-3 font-sans text-sm leading-relaxed text-slate-300">{card.body}</p>
        </motion.article>
      ))}
    </div>
  );
}

export function FeaturesCardsSection({ cards }: FeaturesCardsSectionProps) {
  const isMobile = useIsMobile();
  const reducedMotion = useReducedMotion() ?? false;
  const sectionRef = useRef<HTMLDivElement>(null);
  const revealed = useInView(sectionRef, { once: true, amount: 0.35 });

  const content: GlassCardContent[] = cards.map((card, index) => ({
    index,
    title: card.title,
    body: card.body,
  }));

  return (
    <div ref={sectionRef}>
      {isMobile ? (
        <StaticGlassCards cards={content} />
      ) : (
        <div className="h-[420px] w-full lg:h-[460px]">
          <FeaturesScene cards={content} reducedMotion={reducedMotion} revealed={revealed} />
        </div>
      )}
    </div>
  );
}
