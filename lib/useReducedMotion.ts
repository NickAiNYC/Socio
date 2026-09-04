"use client";
import { useEffect, useState } from "react";

/** Mirrors the shipped scroll-craft build's reduced-motion gate: fewer and
 * gentler, not zero. Every ScrollTrigger/Lenis effect in this port checks
 * this before it registers. */
export function useReducedMotion() {
  const [reduced, setReduced] = useState(false);

  useEffect(() => {
    const mql = window.matchMedia("(prefers-reduced-motion: reduce)");
    setReduced(mql.matches);
    const onChange = () => setReduced(mql.matches);
    mql.addEventListener("change", onChange);
    return () => mql.removeEventListener("change", onChange);
  }, []);

  return reduced;
}
