"use client";
import { useEffect, useRef } from "react";
import { gsap, ScrollTrigger } from "@/lib/gsap";
import Button from "@/components/ui/Button";

type Room = { x: number; y: number; w: number; h: number };
const ROOMS: Room[] = [
  { x: 0.1, y: 0.58, w: 0.16, h: 0.2 },
  { x: 0.3, y: 0.66, w: 0.12, h: 0.14 },
  { x: 0.66, y: 0.6, w: 0.18, h: 0.22 },
  { x: 0.82, y: 0.3, w: 0.1, h: 0.16 },
];

export default function Hero() {
  const sectionRef = useRef<HTMLElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const progress = useRef(0);

  useEffect(() => {
    const canvas = canvasRef.current;
    const section = sectionRef.current;
    if (!canvas || !section) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const vp = { x: 0.5, y: 0.42 };
    const target = { x: 0.5, y: 0.42 };
    let raf = 0;
    let W = 0;
    let H = 0;

    const resize = () => {
      W = canvas.clientWidth;
      H = canvas.clientHeight;
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      canvas.width = W * dpr;
      canvas.height = H * dpr;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };
    resize();
    window.addEventListener("resize", resize);

    const fine = window.matchMedia("(hover: hover) and (pointer: fine)").matches;
    const onMove = (e: PointerEvent) => {
      const r = canvas.getBoundingClientRect();
      target.x = gsap.utils.clamp(0, 1, (e.clientX - r.left) / r.width);
      target.y = gsap.utils.clamp(0, 1, (e.clientY - r.top) / r.height);
    };
    const onLeave = () => {
      target.x = 0.5;
      target.y = 0.42;
    };
    const parent = canvas.parentElement;
    if (fine && parent) {
      parent.addEventListener("pointermove", onMove);
      parent.addEventListener("pointerleave", onLeave);
    }

    const st = ScrollTrigger.create({
      trigger: section,
      start: "top top",
      end: "+=110%",
      scrub: true,
      onUpdate: (self) => {
        progress.current = self.progress;
      },
    });

    const draw = () => {
      const lerp = reduceMotion ? 1 : 0.06;
      vp.x += (target.x - vp.x) * lerp;
      vp.y += (target.y - vp.y) * lerp;

      ctx.clearRect(0, 0, W, H);

      const vpx = W * (0.5 + (vp.x - 0.5) * 0.16);
      const vpy = H * (0.3 + (vp.y - 0.42) * 0.1) - progress.current * H * 0.06;

      ctx.strokeStyle = "rgba(10,92,255,0.10)";
      ctx.lineWidth = 1;
      const rays = 22;
      for (let i = 0; i <= rays; i++) {
        const edgeX = (i / rays) * W;
        ctx.beginPath();
        ctx.moveTo(vpx, vpy);
        ctx.lineTo(edgeX, H);
        ctx.stroke();
      }

      ctx.strokeStyle = "rgba(10,92,255,0.085)";
      const depths = 14;
      for (let d = 1; d <= depths; d++) {
        const f = Math.pow(d / depths, 1.7);
        const y = vpy + (H - vpy) * f;
        ctx.beginPath();
        ctx.moveTo(0, y);
        ctx.lineTo(W, y);
        ctx.stroke();
      }

      ctx.strokeStyle = "rgba(23,21,17,0.16)";
      ctx.lineWidth = 1.25;
      ROOMS.forEach((r) => {
        const rx = r.x * W;
        const ry = r.y * H;
        const rw = r.w * W;
        const rh = r.h * H;
        ctx.strokeRect(rx, ry, rw, rh);
        ctx.beginPath();
        ctx.arc(rx, ry + rh, rh * 0.5, -Math.PI / 2, 0);
        ctx.stroke();
      });

      if (fine || reduceMotion) {
        const px = vp.x * W;
        const py = vp.y * H;
        ctx.fillStyle = "rgba(10,92,255,0.55)";
        for (let gx = 0; gx <= W; gx += W / rays) {
          const dx = gx - px;
          if (Math.abs(dx) < W * 0.14) {
            const dist = Math.abs(dx) / (W * 0.14);
            const r2 = (1 - dist) * 2.4;
            if (r2 > 0.4) {
              ctx.beginPath();
              ctx.arc(gx, py, r2, 0, Math.PI * 2);
              ctx.fill();
            }
          }
        }
      }

      raf = requestAnimationFrame(draw);
    };
    raf = requestAnimationFrame(draw);

    return () => {
      cancelAnimationFrame(raf);
      st.kill();
      window.removeEventListener("resize", resize);
      if (parent) {
        parent.removeEventListener("pointermove", onMove);
        parent.removeEventListener("pointerleave", onLeave);
      }
    };
  }, []);

  return (
    <section ref={sectionRef} className="relative h-screen overflow-clip">
      <canvas ref={canvasRef} className="absolute inset-0 h-full w-full" aria-hidden="true" />
      <div className="pointer-events-none absolute inset-0 z-[1] bg-gradient-to-b from-canvas/10 via-transparent to-canvas/60" />
      <div className="relative z-10 mx-auto flex h-full max-w-3xl flex-col justify-center px-6 text-center">
        <p className="font-mono text-xs uppercase tracking-wide text-accent">
          Scope prep + dormant-bid recovery · NYC
        </p>
        <h1 className="mt-5 text-balance font-display text-[clamp(2.6rem,2rem+3.6vw,5.2rem)] leading-none text-ink">
          We read NYC DOB filings so a renovation starts with a real scope, not a guess.
        </h1>
        <p className="mx-auto mt-5 max-w-xl text-lg text-ink-soft">
          Homeowners get scoped for free. Contractors turn dead estimates into signable work.
        </p>
        <div className="mt-7 flex flex-wrap justify-center gap-4">
          <Button variant="primary" magnetic href="#persona">
            Start on WhatsApp
          </Button>
          <Button variant="ghost" href="#mechanism">
            See how it works
          </Button>
        </div>
      </div>
    </section>
  );
}
