"use client";
import { motion } from "framer-motion";
import FilingCard from "@/components/ui/FilingCard";

const STRIP = [
  {
    k: "Public records",
    v: "Built only on public NYC DOB filings. Your filing is already public record.",
  },
  {
    k: "Licensing",
    v: "We verify each contractor's DCWP or DOB license and insurance.",
  },
  {
    k: "Pricing",
    v: "$0 upfront. Free for homeowners; contractors pay only when a bid closes.",
  },
];

export default function RawFiling() {
  return (
    <section className="px-6 py-[clamp(4.5rem,9vw,11rem)]">
      <div className="mx-auto grid max-w-5xl grid-cols-1 divide-y divide-hairline overflow-hidden rounded-md border border-hairline bg-surface shadow-e1 sm:grid-cols-3 sm:divide-x sm:divide-y-0">
        {STRIP.map((cell, i) => (
          <motion.div
            key={cell.k}
            initial={{ opacity: 0, y: 14 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-12%" }}
            transition={{ duration: 0.62, delay: i * 0.06, ease: [0.23, 1, 0.32, 1] }}
            className="p-6"
          >
            <p className="font-mono text-xs uppercase tracking-wide text-accent">{cell.k}</p>
            <p className="mt-2 text-sm text-ink-soft">{cell.v}</p>
          </motion.div>
        ))}
      </div>

      <motion.div
        initial={{ opacity: 0, y: 14 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-12%" }}
        transition={{ duration: 0.62, ease: [0.23, 1, 0.32, 1] }}
        className="mx-auto mt-[12rem] max-w-2xl text-center"
      >
        <h2 className="text-balance font-display text-[clamp(2.1rem,1.6rem+2.4vw,3.4rem)]">
          Before Socio, a renovation starts here.
        </h2>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 14 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-12%" }}
        transition={{ duration: 0.62, delay: 0.08, ease: [0.23, 1, 0.32, 1] }}
        className="mt-7"
      >
        <FilingCard full className="mx-auto max-w-2xl" />
        <p className="mx-auto mt-6 max-w-md text-center text-lg text-ink-soft">
          A filing tells you a renovation is happening. It doesn&apos;t tell you what it
          costs, how long it takes, or who should bid on it.
        </p>
      </motion.div>
    </section>
  );
}
