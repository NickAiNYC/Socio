"use client";
import { useEffect, useRef } from "react";
import Lenis from "lenis";
import { gsap, ScrollTrigger } from "@/lib/gsap";
import { useReducedMotion } from "@/lib/useReducedMotion";

export default function SmoothScroll({ children }: { children: React.ReactNode }) {
  const lenisRef = useRef<Lenis | null>(null);
  const reduceMotion = useReducedMotion();

  useEffect(() => {
    if (reduceMotion) return; // native scroll only — accessibility floor, not an afterthought

    const lenis = new Lenis({ duration: 1.1, smoothWheel: true, syncTouch: false });
    lenisRef.current = lenis;

    // hand Lenis's scroll position to ScrollTrigger instead of window's
    lenis.on("scroll", ScrollTrigger.update);
    const tick = (time: number) => lenis.raf(time * 1000);
    gsap.ticker.add(tick);
    gsap.ticker.lagSmoothing(0);

    return () => {
      lenis.destroy();
      gsap.ticker.remove(tick);
    };
  }, [reduceMotion]);

  return <>{children}</>;
}
