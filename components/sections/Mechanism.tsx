"use client";
import { useEffect, useRef } from "react";
import { gsap } from "@/lib/gsap";
import FilingCard from "@/components/ui/FilingCard";

const SCOPE_BADGES = [
  { k: "Scope of work", v: "Kitchen + 2 baths", note: "Floors 2–3, from the filing" },
  { k: "Budget band", v: "$180K – $220K", note: "Illustrative band, not on the filing" },
  { k: "Timeline", v: "8–11 weeks", note: "Illustrative estimate" },
  { k: "Photo checklist", v: "6 requested", note: "Kitchen, baths, egress, panel" },
];

const BIDS = ["A", "B", "C"];

const STAGES = [
  { key: "indexed", label: "Indexed" },
  { key: "standardized", label: "Standardized" },
  { key: "dispatched", label: "Dispatched" },
] as const;

/**
 * The peak. One pinned act, one GSAP timeline, three handoffs. The badges and
 * bid cards are independent siblings of the filing card — nesting them
 * inside it (so a parent fading to 0 would hide children that should still
 * be visible) was the bug the vanilla build's verification pass caught.
 */
export default function Mechanism() {
  const root = useRef<HTMLElement>(null);
  const stageRefs = useRef<Record<string, HTMLSpanElement | null>>({});
  const captionRef = useRef<HTMLParagraphElement>(null);

  useEffect(() => {
    const captions: Record<string, string> = {
      indexed: "Indexed from the public filing.",
      standardized: "Scope standardized: budget band, timeline, photo checklist.",
      dispatched: "2–3 licensed GCs quote the identical scope.",
    };

    const ctx = gsap.context(() => {
      const filing = ".mech-filing";
      const stamp = ".mech-stamp";
      const badges = ".mech-badge";
      const bids = ".mech-bid";

      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: root.current,
          start: "top top",
          end: "+=320%",
          pin: true,
          scrub: 0.4,
          anticipatePin: 1,
          onUpdate: (self) => {
            const stage = self.progress < 0.28 ? "indexed" : self.progress < 0.6 ? "standardized" : "dispatched";
            for (const s of STAGES) {
              stageRefs.current[s.key]?.classList.toggle("text-accent", s.key === stage);
              stageRefs.current[s.key]?.classList.toggle("font-semibold", s.key === stage);
            }
            if (captionRef.current) captionRef.current.textContent = captions[stage];
            window.dispatchEvent(new CustomEvent("socio:stage", { detail: stage }));
          },
        },
      });

      tl.to(filing, { opacity: 0, y: -14, duration: 0.3 }, 0)
        .fromTo(stamp, { opacity: 0 }, { opacity: 1, duration: 0.06 }, 0.03)
        .fromTo(
          badges,
          { opacity: 0, y: 14 },
          { opacity: 1, y: 0, duration: 0.18, stagger: 0.04, ease: "power2.out" },
          0.22,
        )
        .to(badges, { opacity: 0, y: -14, duration: 0.14, stagger: 0.03 }, 0.55)
        .fromTo(
          bids,
          { opacity: 0, y: 14 },
          { opacity: 1, y: 0, duration: 0.16, stagger: 0.06, ease: "back.out(1.4)" },
          0.62,
        );
    }, root);

    return () => ctx.revert();
  }, []);

  return (
    <section ref={root} id="mechanism" className="relative flex h-screen items-center justify-center px-6">
      <div className="w-full max-w-2xl">
        <div className="mb-5 text-center">
          <p className="font-mono text-xs uppercase tracking-wide text-accent">How it works</p>
          <div className="mt-3 flex justify-center gap-4 font-mono text-xs uppercase tracking-wide text-ink-soft">
            {STAGES.map((s, i) => (
              <span key={s.key} className="flex items-center gap-4">
                <span ref={(el) => { stageRefs.current[s.key] = el; }} className="transition-colors">
                  {s.label}
                </span>
                {i < STAGES.length - 1 && <span className="text-hairline-strong">→</span>}
              </span>
            ))}
          </div>
        </div>

        <div className="relative min-h-[24rem]">
          <FilingCard full className="mech-filing absolute inset-0" />

          <span className="mech-stamp absolute right-4 top-4 inline-flex items-center gap-2 rounded-sm border border-emerald/30 bg-emerald-bg px-3 py-1.5 font-mono text-xs uppercase tracking-wide text-emerald opacity-0">
            <svg viewBox="0 0 20 20" fill="none" className="h-3.5 w-3.5" aria-hidden="true">
              <path d="M4 10.5l3.5 3.5L16 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
            DOB Alteration · Indexed
          </span>

          <div className="absolute inset-0 grid grid-cols-1 content-center gap-4 sm:grid-cols-2">
            {SCOPE_BADGES.map((b) => (
              <div key={b.k} className="mech-badge rounded-md border border-hairline-strong bg-surface p-5 opacity-0 shadow-e1">
                <p className="font-mono text-xs uppercase tracking-wide text-accent">{b.k}</p>
                <p className="mt-2 font-display text-lg">{b.v}</p>
                <p className="mt-1 text-xs text-ink-soft">{b.note}</p>
              </div>
            ))}
          </div>

          <div className="absolute inset-0 flex flex-col items-center justify-center gap-2 sm:flex-row sm:gap-4">
            {BIDS.map((id) => (
              <article key={id} className="mech-bid w-44 rounded-md border border-hairline-strong bg-surface p-4 opacity-0 shadow-e1">
                <p className="font-mono text-xs text-ink-soft">GC — {id}</p>
                <span className="mt-2 inline-block rounded-sm bg-emerald-bg px-2 py-0.5 font-mono text-[0.68rem] uppercase tracking-wide text-emerald">
                  Comparable
                </span>
                <p className="mt-2 text-xs leading-snug text-ink-soft">Same scope. Licensed, insured.</p>
              </article>
            ))}
          </div>
        </div>

        <p ref={captionRef} className="mt-6 min-h-[1.6em] text-center text-sm text-ink-soft">
          Indexed from the public filing.
        </p>
      </div>
    </section>
  );
}
