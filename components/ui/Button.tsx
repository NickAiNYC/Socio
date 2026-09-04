"use client";
import { useRef } from "react";
import { motion, useMotionValue, useSpring } from "framer-motion";

type ButtonProps = {
  href: string;
  variant?: "primary" | "ghost";
  magnetic?: boolean;
  className?: string;
  children: React.ReactNode;
};

const base =
  "inline-flex items-center justify-center gap-2 rounded-md px-6 py-3.5 text-sm font-medium whitespace-nowrap transition-shadow";
const variants: Record<NonNullable<ButtonProps["variant"]>, string> = {
  primary: "bg-accent text-accent-ink shadow-e1 hover:shadow-e2",
  ghost: "bg-surface text-ink border border-hairline-strong hover:border-accent hover:text-accent",
};

export default function Button({ href, variant = "primary", magnetic = false, className = "", children }: ButtonProps) {
  const ref = useRef<HTMLAnchorElement>(null);
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const sx = useSpring(x, { stiffness: 260, damping: 20 });
  const sy = useSpring(y, { stiffness: 260, damping: 20 });

  const strength = 0.24;

  function onMove(e: React.PointerEvent<HTMLAnchorElement>) {
    if (!magnetic || !ref.current) return;
    if (!window.matchMedia("(hover: hover) and (pointer: fine)").matches) return;
    const r = ref.current.getBoundingClientRect();
    x.set((e.clientX - (r.left + r.width / 2)) * strength);
    y.set((e.clientY - (r.top + r.height / 2)) * strength);
  }
  function onLeave() {
    x.set(0);
    y.set(0);
  }

  return (
    <motion.a
      ref={ref}
      href={href}
      onPointerMove={onMove}
      onPointerLeave={onLeave}
      style={magnetic ? { x: sx, y: sy } : undefined}
      whileTap={{ scale: 0.97 }}
      className={`${base} ${variants[variant]} ${className}`}
    >
      {children}
    </motion.a>
  );
}
