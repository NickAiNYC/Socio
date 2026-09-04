"use client";
import { useEffect, useRef } from "react";
import { gsap, ScrollTrigger } from "@/lib/gsap";

const BOROUGHS = [
  { slug: "manhattan", name: "Manhattan", chip: "ALT-2 · Facade", note: "Typically prewar and brownstone alteration filings: facade, egress, interior combination work." },
  { slug: "brooklyn", name: "Brooklyn", chip: "ALT-2 · Rowhouse", note: "Typically rowhouse and townhouse alterations, interior combinations and extensions." },
  { slug: "queens", name: "Queens", chip: "ALT-1 · Addition", note: "Typically two-family and semi-detached alterations, additions and dormers." },
  { slug: "bronx", name: "Bronx", chip: "ALT-2 · Multi-family", note: "Typically multi-family alteration and legalization filings." },
  { slug: "statenisland", name: "Staten Island", chip: "ALT-2 · Detached", note: "Typically single-family additions, garages and detached structures." },
];

export default function BoroughRail() {
  const section = useRef<HTMLElement>(null);
  const rail = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduceMotion || !section.current || !rail.current) return;

    const ctx = gsap.context(() => {
      const travel = () => Math.max(0, rail.current!.scrollWidth - window.innerWidth);
      const tween = gsap.to(rail.current, {
        x: () => -travel(),
        ease: "none",
        scrollTrigger: {
          trigger: section.current,
          start: "top top",
          end: () => `+=${travel()}`,
          scrub: true,
          pin: true,
          invalidateOnRefresh: true,
        },
      });

      gsap.utils.toArray<HTMLElement>(".borough-card").forEach((card) => {
        ScrollTrigger.create({
          trigger: card,
          containerAnimation: tween,
          start: "left center",
          end: "right center",
          onEnter: () => window.dispatchEvent(new CustomEvent("socio:borough", { detail: card.dataset.borough })),
        });
      });
    }, section);

    return () => ctx.revert();
  }, []);

  return (
    <section ref={section} className="relative h-screen overflow-clip">
      {/* reduced-motion floor: a native horizontal scroll region, same items,
          no ScrollTrigger — matches the shipped build's pan-device fallback */}
      <div
        ref={rail}
        className="flex h-full items-center gap-5 overflow-x-auto px-6 [-webkit-overflow-scrolling:touch] motion-safe:overflow-x-hidden"
      >
        <div className="w-[min(22rem,70vw)] shrink-0">
          <p className="font-mono text-xs uppercase tracking-wide text-accent">Public record, borough by borough</p>
          <h2 className="mt-3 text-balance font-display text-[clamp(2.1rem,1.6rem+2.4vw,3.4rem)]">
            Every filing here is public.
          </h2>
          <p className="mt-3 text-sm text-ink-soft">Socio does not file, inspect, or perform construction work.</p>
        </div>
        {BOROUGHS.map((b) => (
          <article
            key={b.slug}
            data-borough={b.slug}
            className="borough-card w-60 shrink-0 snap-center rounded-md border border-hairline bg-surface p-5 shadow-e1"
          >
            <p className="font-display text-xl">{b.name}</p>
            <span className="mt-3 inline-block rounded-sm border border-accent/25 bg-accent/[0.06] px-2 py-1 font-mono text-[0.68rem] uppercase tracking-wide text-accent">
              {b.chip}
            </span>
            <p className="mt-3 text-xs leading-relaxed text-ink-soft">{b.note}</p>
          </article>
        ))}
      </div>
    </section>
  );
}
