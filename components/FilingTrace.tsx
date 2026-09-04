"use client";
import { useEffect, useMemo, useState } from "react";

const STAGES = ["indexed", "standardized", "dispatched"] as const;
const BOROUGH_LABELS: Record<string, string> = {
  manhattan: "MN",
  brooklyn: "BK",
  queens: "QN",
  bronx: "BX",
  statenisland: "SI",
};
const BOROUGHS = Object.keys(BOROUGH_LABELS);
const ALT_TYPES = ["ALT-1", "ALT-2", "ALT-CO"];

/** The signature move: a persistent record of what the visitor has passed,
 * not a live feed. See BRIEF.md "Signature move: the Filing Trace" in the
 * scroll-craft build this ports — the label below is load-bearing, not
 * decoration: taste.md bans a fake dashboard presented as real. */
export default function FilingTrace() {
  const [stage, setStage] = useState<string | null>(null);
  const [lit, setLit] = useState<Set<string>>(() => new Set());

  useEffect(() => {
    const onStage = (e: Event) => setStage((e as CustomEvent<string>).detail);
    const onBorough = (e: Event) =>
      setLit((prev) => new Set(prev).add((e as CustomEvent<string>).detail));
    window.addEventListener("socio:stage", onStage);
    window.addEventListener("socio:borough", onBorough);
    return () => {
      window.removeEventListener("socio:stage", onStage);
      window.removeEventListener("socio:borough", onBorough);
    };
  }, []);

  const entries = useMemo(() => {
    const list: { key: string; borough: string; alt: string; status: "pending" | "live" }[] = [];
    for (let i = 0; i < 18; i++) {
      const borough = BOROUGHS[i % BOROUGHS.length];
      list.push({
        key: `${i}`,
        borough,
        alt: ALT_TYPES[(i * 3) % ALT_TYPES.length],
        status: i % 2 === 0 ? "pending" : "live",
      });
    }
    return list;
  }, []);

  return (
    <div
      className="fixed inset-x-0 bottom-0 z-50 flex h-10 items-center gap-4 border-t border-hairline bg-canvas/90 px-6 font-mono text-[0.68rem] backdrop-blur-md"
      aria-hidden="true"
    >
      <span className="shrink-0 uppercase tracking-wide text-ink-soft">Illustrative filing stream</span>

      <div className="relative h-5 flex-1 overflow-hidden [mask-image:linear-gradient(90deg,transparent_0,black_6%,black_94%,transparent_100%)]">
        <div className="absolute left-0 top-0 flex animate-ticker gap-10 whitespace-nowrap motion-reduce:animate-none">
          {[...entries, ...entries].map((e, i) => (
            <span key={`${e.key}-${i}`} className="text-ink-soft">
              <b className="font-medium text-ink">{BOROUGH_LABELS[e.borough]}</b> · {e.alt} ·{" "}
              <span className={e.status === "live" ? "text-emerald" : "text-amber"}>
                {e.status === "live" ? "standardized" : "indexed"}
              </span>
            </span>
          ))}
        </div>
      </div>

      <div className="hidden shrink-0 gap-3 uppercase tracking-wide text-ink-soft md:flex">
        {STAGES.map((s) => (
          <span key={s} className={stage === s ? "text-accent" : undefined}>
            {s}
          </span>
        ))}
      </div>

      <div className="flex shrink-0 gap-1.5">
        {BOROUGHS.map((b) => (
          <span
            key={b}
            title={b}
            className={`h-1.5 w-1.5 rounded-full transition-colors ${lit.has(b) ? "bg-accent" : "bg-hairline-strong"}`}
          />
        ))}
      </div>
    </div>
  );
}
