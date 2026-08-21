'use client';

import React from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import {
  HardHat,
  CheckCircle2,
  ShieldCheck,
  Mail,
  ArrowUpRight,
  Flower2,
  UtensilsCrossed,
  Stethoscope,
  ChevronRight,
  Terminal,
} from 'lucide-react';

/**
 * SystemLink — a nav item that reads as a terminal route, not a menu item.
 * Framer Motion drives the horizontal slide; a chevron and glow-dot reveal on hover.
 */
function SystemLink({
  href,
  children,
  accentClass = 'text-neutral-400 hover:text-neutral-100',
}: {
  href: string;
  children: React.ReactNode;
  accentClass?: string;
}) {
  return (
    <li>
      <Link href={href} className="group inline-block">
        <motion.span
          initial={{ x: 0 }}
          whileHover={{ x: 6 }}
          transition={{ type: 'spring', stiffness: 400, damping: 28 }}
          className={`inline-flex items-center gap-2 text-xs ${accentClass} transition-colors duration-200`}
        >
          <span className="relative flex h-3 w-3 items-center justify-center shrink-0">
            <span className="absolute h-1 w-1 rounded-full bg-emerald-500 opacity-0 shadow-[0_0_6px_2px_rgba(16,185,129,0.7)] transition-opacity duration-200 group-hover:opacity-100" />
            <ChevronRight
              className="h-3 w-3 -translate-x-1 text-neutral-600 opacity-0 transition-all duration-200 group-hover:translate-x-0 group-hover:opacity-100 group-hover:text-neutral-300"
              strokeWidth={2.5}
            />
          </span>
          <span>{children}</span>
        </motion.span>
      </Link>
    </li>
  );
}

/** StatusBadge — one "Socio Promise" item, rendered as a system telemetry pill. */
function StatusBadge({ label }: { label: string }) {
  return (
    <div className="inline-flex w-full items-center gap-2 rounded-full border border-emerald-900/50 bg-emerald-950/30 px-3 py-1.5 font-mono text-[10px] uppercase tracking-widest text-emerald-500 sm:w-auto">
      <span className="relative flex h-1.5 w-1.5 shrink-0">
        <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-500 opacity-40" />
        <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-emerald-500" />
      </span>
      <span>{label}</span>
    </div>
  );
}

export function Footer() {
  return (
    <footer className="relative border-t border-white/10 bg-[#1C1917] px-6 pt-24 pb-10 text-white sm:pt-28">
      {/* Baseplate texture: faint architectural grid + noise, purely decorative */}
      <div
        className="pointer-events-none absolute inset-0 opacity-[0.05]"
        style={{
          backgroundImage:
            'linear-gradient(to right, #ffffff 1px, transparent 1px), linear-gradient(to bottom, #ffffff 1px, transparent 1px)',
          backgroundSize: '48px 48px',
        }}
        aria-hidden="true"
      />
      <div
        className="pointer-events-none absolute inset-0 opacity-[0.04] mix-blend-overlay"
        style={{
          backgroundImage:
            "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='120' height='120'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='2' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E\")",
        }}
        aria-hidden="true"
      />
      <div
        className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-white/20 to-transparent"
        aria-hidden="true"
      />

      <div className="relative mx-auto max-w-7xl">
        {/* THE ACTIVE WEDGE — breaks the plane, overlaps the top edge */}
        <div className="relative -mt-32 mb-16 sm:-mt-36">
          <div className="rounded-2xl border border-white/10 bg-white/5 p-6 shadow-2xl shadow-black/40 backdrop-blur-xl sm:p-8">
            <div className="flex flex-col items-start justify-between gap-6 md:flex-row md:items-center">
              <div className="space-y-2">
                <div className="inline-flex items-center gap-2 rounded-full border border-orange-500/20 bg-orange-500/10 px-2.5 py-0.5 font-mono text-[10px] font-bold text-orange-400">
                  <HardHat className="h-3.5 w-3.5" />
                  <span>VERTICAL EXCLUSIVO · NYC</span>
                </div>
                <h4 className="text-lg font-bold text-white md:text-xl">
                  Are you an NYC General Contractor?
                </h4>
                <p className="max-w-2xl text-xs text-neutral-400 md:text-sm">
                  Bilingual lead acquisition wired to live DOB permits and QuickBooks-verified
                  deposits. Zero cost up front.
                </p>
              </div>

              <Link
                href="/contratistas"
                className="cta-pulse group inline-flex shrink-0 items-center gap-2 rounded-xl border border-amber-500/30 bg-neutral-950 px-6 py-3.5 font-mono text-xs font-bold uppercase tracking-wider text-amber-400 transition-colors hover:bg-neutral-900"
              >
                <Terminal className="h-3.5 w-3.5" />
                <span>Explore Socio Contratistas</span>
                <ArrowUpRight className="h-4 w-4 transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
              </Link>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-12 sm:grid-cols-2 lg:grid-cols-5">
          {/* Col 1: Founder Node — spans 2 cols on desktop */}
          <div className="space-y-5 lg:col-span-2">
            <Link href="/" className="flex items-center text-2xl font-bold tracking-tight text-white">
              <span>Socio</span>
              <span className="ml-[1.5px] mb-1 inline-block h-1.5 w-1.5 self-end rounded-[1px] bg-[#669BD2] shadow-[0_0_6px_rgba(102,155,210,0.8)]" />
            </Link>

            <div className="flex items-start gap-4 rounded-xl border border-white/5 bg-white/[0.02] p-4">
              <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-lg border border-neutral-700 bg-neutral-900 text-lg font-bold text-neutral-200 shadow-[0_0_12px_rgba(102,155,210,0.25)]">
                N
              </div>
              <div className="space-y-1.5">
                <div className="flex items-center gap-2">
                  <span className="text-sm font-semibold text-neutral-100">Nick</span>
                  <span className="font-mono text-[10px] uppercase tracking-widest text-neutral-500">
                    Founder · Solo Operator
                  </span>
                </div>
                <p className="text-xs leading-relaxed text-neutral-400">
                  Building a performance-based growth partnership for NYC contractors. Powered by
                  AI. Built by one founder. Scaled for the neighborhoods that need it most.
                </p>
                <a
                  href="mailto:hello@socio.nyc"
                  className="inline-flex items-center gap-1.5 pt-1 text-xs font-medium text-[#669BD2] hover:text-[#8AB4E0]"
                >
                  <span>Let&apos;s Talk Growth</span>
                  <ArrowUpRight className="h-3.5 w-3.5" />
                </a>
              </div>
            </div>

            <div className="flex items-center gap-2 font-mono text-[11px] text-emerald-500">
              <ShieldCheck className="h-4 w-4" />
              <span>Tamper-Evident Ledger Backed</span>
            </div>
          </div>

          {/* Col 2: Platform */}
          <div className="space-y-3">
            <h5 className="font-mono text-[10px] font-bold uppercase tracking-widest text-neutral-500">
              Platform
            </h5>
            <ul className="space-y-2.5">
              <SystemLink href="/#how-it-works">How It Works</SystemLink>
              <SystemLink href="/merchant-evidence.html">Evidence Ledger</SystemLink>
              <SystemLink href="/trust-and-proof.html">Attribution Protocol</SystemLink>
              <SystemLink href="/command-center.html">Command Center</SystemLink>
            </ul>
          </div>

          {/* Col 3: Industries & Verticals */}
          <div className="space-y-3">
            <h5 className="font-mono text-[10px] font-bold uppercase tracking-widest text-neutral-500">
              Industries &amp; Verticals
            </h5>
            <ul className="space-y-2.5">
              <SystemLink href="/contratistas" accentClass="text-orange-400 hover:text-orange-300">
                <span className="inline-flex items-center gap-1.5">
                  <HardHat className="h-3.5 w-3.5" />
                  Construction Partners (ES)
                </span>
              </SystemLink>
              <SystemLink href="/floristas" accentClass="text-rose-400 hover:text-rose-300">
                <span className="inline-flex items-center gap-1.5">
                  <Flower2 className="h-3.5 w-3.5" />
                  Florists &amp; Botanical
                </span>
              </SystemLink>
              <SystemLink href="/restaurantes" accentClass="text-amber-400 hover:text-amber-300">
                <span className="inline-flex items-center gap-1.5">
                  <UtensilsCrossed className="h-3.5 w-3.5" />
                  Restaurants &amp; Catering
                </span>
              </SystemLink>
              <SystemLink href="/clinicas" accentClass="text-sky-400 hover:text-sky-300">
                <span className="inline-flex items-center gap-1.5">
                  <Stethoscope className="h-3.5 w-3.5" />
                  Clinics &amp; MedSpas
                </span>
              </SystemLink>
              <SystemLink href="/supplier-cards">Supplier Pro-Desk Nodes</SystemLink>
              <SystemLink href="/pilot-agreement">Contractor Pilot Agreement</SystemLink>
            </ul>
          </div>

          {/* Col 4: The Socio Promise — telemetry badges */}
          <div className="space-y-3">
            <h5 className="font-mono text-[10px] font-bold uppercase tracking-widest text-neutral-500">
              System Status
            </h5>
            <div className="flex flex-col items-start gap-2">
              <StatusBadge label="Zero Upfront Retainers" />
              <StatusBadge label="QuickBooks / POS Verified" />
              <StatusBadge label="DOB Permit-Matched Leads" />
              <StatusBadge label="Bilingual EN / ES Intake" />
              <StatusBadge label="Cancel Anytime · No Lock-In" />
            </div>
          </div>
        </div>

        {/* Bottom Bar — terminal output */}
        <div className="mt-16 flex flex-col items-center justify-between gap-4 border-t border-white/10 pt-8 font-mono text-[11px] text-neutral-600 md:flex-row">
          <span>
            © {new Date().getFullYear()} SOCIO INC. · NYC LOCAL PERFORMANCE GROWTH PARTNER · ALL
            SYSTEMS NOMINAL
          </span>
          <a
            href="mailto:hello@socio.nyc"
            className="flex items-center gap-1.5 text-neutral-600 transition-colors hover:text-neutral-400"
          >
            <Mail className="h-3.5 w-3.5" />
            <span>hello@socio.nyc</span>
          </a>
        </div>
      </div>

      <style jsx>{`
        @keyframes pulse-glow {
          0%,
          100% {
            box-shadow:
              0 0 0 0 rgba(245, 158, 11, 0.35),
              0 0 18px 2px rgba(245, 158, 11, 0.2);
          }
          50% {
            box-shadow:
              0 0 0 5px rgba(245, 158, 11, 0),
              0 0 26px 5px rgba(245, 158, 11, 0.35);
          }
        }
        .cta-pulse {
          animation: pulse-glow 2.6s ease-in-out infinite;
        }
        @media (prefers-reduced-motion: reduce) {
          .cta-pulse {
            animation: none;
          }
        }
      `}</style>
    </footer>
  );
}

export default Footer;
