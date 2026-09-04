'use client';

import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

export function ArchitectureSection() {
  const containerRef = useRef<HTMLDivElement>(null);
  const leftColRef = useRef<HTMLDivElement>(null);
  const rightColRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (typeof window === 'undefined') return;
    gsap.registerPlugin(ScrollTrigger);

    const mm = gsap.matchMedia();

    mm.add('(min-width: 768px)', () => {
      if (!containerRef.current || !leftColRef.current) return;
      // Pin the left column while the right column scrolls
      ScrollTrigger.create({
        trigger: containerRef.current,
        start: 'top top',
        end: 'bottom bottom',
        pin: leftColRef.current,
        pinSpacing: false,
        markers: false,
      });
    });

    return () => mm.revert();
  }, []);

  const steps = [
    {
      num: '01',
      title: 'Standardized Scope Prep',
      desc: 'Every project begins with a granular, line-item breakdown. No guessing, no hidden variables.',
    },
    {
      num: '02',
      title: 'Vetted Craftsmen Only',
      desc: 'We exclusively route work to specialized tradesmen with verified NYC experience and flawless track records.',
    },
    {
      num: '03',
      title: 'Board & Insurance Ready',
      desc: 'Full COI management, license verification, and compliance documentation handled instantly for strict co-ops.',
    },
  ];

  return (
    <section
      ref={containerRef}
      className="relative w-full bg-[#FAFAFA] border-b border-gray-200"
    >
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-12 px-6">
        {/* Pinned Left Column */}
        <div
          ref={leftColRef}
          className="md:h-screen flex flex-col justify-center py-24 md:py-0"
        >
          <p className="font-mono text-sm uppercase tracking-widest text-gray-400 mb-6">
            The Architecture
          </p>
          <h2 className="text-4xl md:text-5xl font-serif leading-tight text-black pr-8">
            How Socio standardizes the physical trade experience.
          </h2>
        </div>

        {/* Scrolling Right Column */}
        <div ref={rightColRef} className="flex flex-col py-24 md:py-[40vh] gap-32">
          {steps.map((step, idx) => (
            <div key={idx} className="flex flex-col border-t border-gray-200 pt-8">
              <span className="font-mono text-xl text-black mb-6">{step.num}</span>
              <h3 className="text-2xl font-serif text-black mb-4">{step.title}</h3>
              <p className="font-sans text-gray-500 leading-relaxed text-lg">
                {step.desc}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

export default ArchitectureSection;
