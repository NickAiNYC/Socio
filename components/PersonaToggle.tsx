"use client";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Button from "@/components/ui/Button";

type Persona = "homeowner" | "contractor";

function HomeownerPanel() {
  return (
    <div className="text-center">
      <p className="mx-auto max-w-xl text-xl leading-snug text-ink">
        Your renovation already has a public DOB filing. We prep your scope from it
        before a contractor ever quotes it.
      </p>
      <ul className="mx-auto mt-5 flex max-w-md flex-col gap-2 text-left">
        {[
          "Budget band, timeline and photo scope, prepared from your filing",
          "2–3 licensed NYC general contractors quote the identical scope",
          "Free for homeowners. You never pay Socio.",
        ].map((li) => (
          <li key={li} className="flex gap-3 text-sm text-ink-soft">
            <span className="text-accent">—</span>
            {li}
          </li>
        ))}
      </ul>
      <div className="mt-7">
        <Button variant="primary" magnetic href="#close">
          Start on WhatsApp
        </Button>
      </div>
    </div>
  );
}

function ContractorPanel() {
  return (
    <div className="text-center">
      <p className="mx-auto max-w-xl text-xl leading-snug text-ink">
        Sitting on a bid that went quiet? We repackage a dormant estimate into a
        standardized, signable scope and bring it back to the table.
      </p>
      <ul className="mx-auto mt-5 flex max-w-md flex-col gap-2 text-left">
        {[
          "Every project states what's included, excluded and assumed",
          "DCWP or DOB license and insurance verified before you quote",
          "$0 upfront. A flat fee only when a repackaged bid closes.",
        ].map((li) => (
          <li key={li} className="flex gap-3 text-sm text-ink-soft">
            <span className="text-accent">—</span>
            {li}
          </li>
        ))}
      </ul>
      <div className="mt-7">
        <Button variant="primary" magnetic href="#close">
          Reactivate a Bid
        </Button>
      </div>
    </div>
  );
}

export default function PersonaToggle() {
  const [active, setActive] = useState<Persona>("homeowner");

  return (
    <div className="mx-auto max-w-lg">
      <div className="relative mx-auto inline-flex rounded-full border border-hairline-strong bg-surface p-1 shadow-e1">
        {(["homeowner", "contractor"] as const).map((p) => (
          <button
            key={p}
            type="button"
            onClick={() => setActive(p)}
            aria-pressed={active === p}
            className={`relative z-10 rounded-full px-6 py-2.5 text-sm font-medium capitalize ${
              active === p ? "text-accent-ink" : "text-ink-soft"
            }`}
          >
            {p}
            {active === p && (
              <motion.span
                layoutId="persona-thumb"
                className="absolute inset-0 -z-10 rounded-full bg-accent"
                transition={{ type: "spring", stiffness: 420, damping: 34 }}
              />
            )}
          </button>
        ))}
      </div>

      {/* grid-stacked panels: both occupy the same cell, so swapping never
          shifts the layout the way collapsing an unmounted panel would */}
      <div className="relative mt-8 grid">
        <AnimatePresence mode="wait" initial={false}>
          <motion.div
            key={active}
            className="col-start-1 row-start-1"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.22 }}
          >
            {active === "homeowner" ? <HomeownerPanel /> : <ContractorPanel />}
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
}
