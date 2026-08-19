'use client';

import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Zap,
  Check,
  ShieldCheck,
  AlertTriangle,
  Clock,
  ArrowRight,
  Sparkles,
  TrendingUp,
  Layers,
  ChevronRight,
  Radio,
  ExternalLink
} from 'lucide-react';
import { DecisionResult } from '@/lib/ChiefOfStaffEngine';

/* =========================================================================
   PROPS CONTRACT
   ========================================================================= */

export interface NextBestActionHUDProps {
  decision: DecisionResult | null;
  onExecute: (actionId: string) => void;
  onInspectEvidence?: (actionId: string) => void;
  onDelegate?: (actionId: string) => void;
}

/* =========================================================================
   COMMAND HUD COMPONENT
   ========================================================================= */

export function NextBestActionHUD({
  decision,
  onExecute,
  onInspectEvidence,
  onDelegate
}: NextBestActionHUDProps) {
  if (!decision) return null;

  const action = decision.nextBestAction;
  const exp = decision.explanation;
  const isHighRisk = action.risk === 'HIGH' || action.risk === 'CRITICAL';
  const isHardBlocker = exp.winningTier === 'HARD_BLOCKER';

  return (
    <AnimatePresence>
      <motion.div
        initial={{ y: -50, opacity: 0, scale: 0.96 }}
        animate={{ y: 0, opacity: 1, scale: 1 }}
        exit={{ y: -50, opacity: 0, scale: 0.96 }}
        transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
        className="fixed top-6 left-1/2 -translate-x-1/2 w-full max-w-4xl px-4 z-50 pointer-events-none"
      >
        <div
          className={`pointer-events-auto relative p-6 rounded-2xl bg-[#0A0D14]/90 border backdrop-blur-2xl transition-all duration-300 shadow-2xl overflow-hidden ${
            isHardBlocker
              ? 'border-rose-500/50 shadow-[0_0_50px_rgba(239,68,68,0.25)]'
              : isHighRisk
              ? 'border-amber-500/40 shadow-[0_0_50px_rgba(245,158,11,0.2)]'
              : 'border-[#ccff00]/40 shadow-[0_0_50px_rgba(204,255,0,0.2)]'
          }`}
        >
          {/* Diffuse Backlight Glow Effect */}
          <div
            className={`absolute -top-16 -left-16 w-56 h-56 rounded-full blur-3xl pointer-events-none ${
              isHardBlocker ? 'bg-rose-500/10' : isHighRisk ? 'bg-amber-500/10' : 'bg-[#ccff00]/10'
            }`}
          />

          {/* Top Metadata & Tier Pill Bar */}
          <div className="flex items-center justify-between gap-4 border-b border-white/5 pb-3.5 mb-4 relative z-10">
            <div className="flex items-center gap-2.5">
              <motion.div
                animate={{ scale: [1, 1.2, 1] }}
                transition={{ duration: 2, repeat: Infinity }}
                className={`p-1.5 rounded-lg ${
                  isHardBlocker
                    ? 'bg-rose-500/15 text-rose-400'
                    : isHighRisk
                    ? 'bg-amber-500/15 text-amber-400'
                    : 'bg-[#ccff00]/15 text-[#ccff00]'
                }`}
              >
                {isHardBlocker ? <AlertTriangle className="w-4 h-4" /> : <Zap className="w-4 h-4 fill-current" />}
              </motion.div>

              <div>
                <span className="text-[10px] font-mono font-extrabold uppercase tracking-widest text-slate-400">
                  AI CHIEF OF STAFF • DECISION TIER:
                </span>
                <span className="ml-1.5 text-xs font-mono font-bold text-white uppercase tracking-wider">
                  {exp.winningTier}
                </span>
              </div>
            </div>

            <div className="flex items-center gap-2 font-mono text-[10px]">
              <span className="px-2 py-0.5 rounded bg-white/5 border border-white/10 text-slate-300">
                Confidence: <strong className="text-emerald-400">{(action.metrics.confidenceScore * 100).toFixed(0)}%</strong>
              </span>
              <span className="px-2 py-0.5 rounded bg-white/5 border border-white/10 text-slate-300">
                Time Req: <strong className="text-cyan-400">{action.metrics.founderTimeSeconds}s</strong>
              </span>
              <span
                className={`px-2 py-0.5 rounded font-extrabold border ${
                  action.risk === 'HIGH'
                    ? 'bg-rose-500/15 text-rose-400 border-rose-500/30'
                    : 'bg-amber-500/15 text-amber-400 border-amber-500/30'
                }`}
              >
                {action.risk} RISK
              </span>
            </div>
          </div>

          {/* Main Hero & Mathematical Leverage Display */}
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 relative z-10">
            
            {/* Action Title & Context */}
            <div className="space-y-2 max-w-2xl">
              <h2 className="text-lg sm:text-xl font-black text-white tracking-tight font-sans">
                {action.title}
              </h2>
              
              {/* The Math: Direct Value vs Downstream Leverage */}
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 pt-1 text-xs font-mono">
                <div className="p-2.5 rounded-xl bg-black/40 border border-white/5 space-y-0.5">
                  <div className="text-[9px] text-slate-500 uppercase">Direct EV Return</div>
                  <div className="text-sm font-bold text-emerald-400">
                    +${action.metrics.directRevenue.toLocaleString()}
                  </div>
                </div>

                <div className="p-2.5 rounded-xl bg-black/40 border border-white/5 space-y-0.5">
                  <div className="text-[9px] text-slate-500 uppercase">Downstream Unlocked</div>
                  <div className="text-sm font-bold text-sky-400">
                    +${action.causalChain.downstreamPipelineValue.toLocaleString()}
                  </div>
                </div>

                <div className="p-2.5 rounded-xl bg-black/40 border border-white/5 space-y-0.5 col-span-2 sm:col-span-1">
                  <div className="text-[9px] text-slate-500 uppercase">Waiting Agents</div>
                  <div className="text-sm font-bold text-[#ccff00]">
                    {action.causalChain.downstreamAgentIds.length} Agents Gated
                  </div>
                </div>
              </div>
            </div>

            {/* Execution CTA Buttons */}
            <div className="flex flex-col sm:flex-row lg:flex-col gap-2.5 shrink-0 justify-center">
              <motion.button
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => onExecute(action.id)}
                className="px-6 py-3 bg-[#ccff00] text-black font-black font-mono text-xs rounded-xl hover:brightness-110 shadow-[0_0_25px_rgba(204,255,0,0.4)] flex items-center justify-center gap-2 cursor-pointer transition-transform"
              >
                <Check className="w-4 h-4 stroke-[3]" />
                <span>Execute & Approve</span>
              </motion.button>

              <div className="flex gap-2">
                {onInspectEvidence && (
                  <button
                    onClick={() => onInspectEvidence(action.id)}
                    className="flex-1 px-3 py-2 bg-white/[0.04] hover:bg-white/[0.08] text-slate-300 font-mono text-[11px] rounded-lg border border-white/10 text-center transition-colors"
                  >
                    Audit Evidence
                  </button>
                )}
                {onDelegate && (
                  <button
                    onClick={() => onDelegate(action.id)}
                    className="px-3 py-2 bg-white/[0.04] hover:bg-white/[0.08] text-cyan-400 font-mono text-[11px] rounded-lg border border-white/10 text-center transition-colors"
                  >
                    Delegate
                  </button>
                )}
              </div>
            </div>

          </div>

          {/* Highlighted Footer: Why Now & Causal Explanation */}
          <div className="mt-4 pt-3.5 border-t border-white/5 flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-[11px] font-mono text-slate-400 relative z-10">
            <div className="flex items-center gap-2">
              <span className="text-[#ccff00] font-bold">WHY NOW:</span>
              <span className="text-slate-300">{action.whyNow}</span>
            </div>
            <div className="text-slate-500 text-[10px] truncate">
              {exp.breakdown}
            </div>
          </div>

        </div>
      </motion.div>
    </AnimatePresence>
  );
}

export default NextBestActionHUD;
