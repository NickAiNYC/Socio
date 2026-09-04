"use client";
import { useRef } from "react";
import { motion, useMotionTemplate, useMotionValue, useSpring } from "framer-motion";
import Button from "@/components/ui/Button";

export default function Close() {
  const stageRef = useRef<HTMLDivElement>(null);
  const mx = useMotionValue(50);
  const my = useMotionValue(50);
  const sx = useSpring(mx, { stiffness: 120, damping: 20 });
  const sy = useSpring(my, { stiffness: 120, damping: 20 });
  const background = useMotionTemplate`radial-gradient(28rem 28rem at ${sx}% ${sy}%, rgba(10,92,255,0.16), transparent 70%)`;

  function onPointerMove(e: React.PointerEvent<HTMLDivElement>) {
    const r = stageRef.current?.getBoundingClientRect();
    if (!r) return;
    mx.set(((e.clientX - r.left) / r.width) * 100);
    my.set(((e.clientY - r.top) / r.height) * 100);
  }

  return (
    <section id="close" className="relative flex h-screen items-center justify-center px-6">
      <div ref={stageRef} onPointerMove={onPointerMove} className="relative w-full max-w-xl text-center">
        <motion.div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-500 hover:opacity-100"
          style={{ background }}
        />
        <h2 className="text-balance font-display text-[clamp(2.2rem,1.8rem+2.6vw,3.6rem)]">
          Nobody pays Socio until a deal closes.
        </h2>
        <p className="mt-4 text-lg text-ink-soft">
          $0 upfront for homeowners. A flat fee for contractors, only when a repackaged bid closes.
        </p>
        <Button variant="primary" magnetic href="#top" className="mt-7">
          Reactivate a Bid
        </Button>

        <footer className="mt-16">
          <p className="flex items-baseline justify-center gap-1 font-display text-base text-ink">
            <span>Socio</span>
            <span className="inline-block h-[0.42em] w-[0.42em] -translate-y-[0.05em] rounded-full bg-accent" />
          </p>
          <p className="mx-auto mt-3 max-w-md text-xs leading-relaxed text-ink-soft">
            Socio is a software and workflow layer. Licensed contractors perform the work;
            homeowners contract with them directly. Socio does not act as a general
            contractor, holds no construction licenses, and performs no construction work.
          </p>
        </footer>
      </div>
    </section>
  );
}
