"use client";
import { motion } from "framer-motion";
import PersonaToggle from "@/components/PersonaToggle";

export default function PersonaSection() {
  return (
    <section id="persona" className="px-6 py-[clamp(4.5rem,9vw,11rem)]">
      <motion.h2
        initial={{ opacity: 0, y: 14 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-12%" }}
        transition={{ duration: 0.62, ease: [0.23, 1, 0.32, 1] }}
        className="text-balance text-center font-display text-[clamp(2.1rem,1.6rem+2.4vw,3.4rem)]"
      >
        Built for both sides of the filing.
      </motion.h2>
      <div className="mt-8">
        <PersonaToggle />
      </div>
    </section>
  );
}
