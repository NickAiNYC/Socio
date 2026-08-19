'use client';

import React, { memo } from 'react';
import { Handle, Position, NodeProps } from '@xyflow/react';
import { 
  Bot, 
  ShieldCheck, 
  ListTodo, 
  Zap, 
  Play, 
  CheckCircle2, 
  Clock, 
  AlertCircle 
} from 'lucide-react';

/* =========================================================================
   TYPES & DATA CONTRACT
   ========================================================================= */

export type NodeCategory = 'AGENT' | 'GOVERNOR' | 'QUEUE' | 'PIPELINE';

export interface AgentNodeData {
  title: string;
  role: string;
  category: NodeCategory;
  emoji?: string;
  status: 'running' | 'online' | 'idle' | 'gated' | 'ready';
  currentJob: string;
  metricLabel: string;
  metricValue: string;
  riskTier?: 'LOW' | 'MEDIUM' | 'HIGH';
  onTrigger?: () => void;
  onInspect?: () => void;
}

/* =========================================================================
   CUSTOM REACT FLOW NODE COMPONENT
   ========================================================================= */

function AgentNodeComponent({ data, selected }: NodeProps<AgentNodeData>) {
  const isGovernor = data.category === 'GOVERNOR';
  const isQueue = data.category === 'QUEUE';

  return (
    <div
      className={`relative w-[280px] rounded-2xl bg-[#0D111B]/95 border transition-all duration-300 backdrop-blur-2xl p-4 shadow-2xl ${
        selected
          ? 'border-[#ccff00] shadow-[0_0_35px_rgba(204,255,0,0.3)] scale-[1.02]'
          : isGovernor
          ? 'border-amber-500/30 hover:border-amber-400/60 shadow-[0_0_30px_-5px_rgba(245,158,11,0.15)]'
          : isQueue
          ? 'border-emerald-500/30 hover:border-emerald-400/60 shadow-[0_0_30px_-5px_rgba(16,185,129,0.15)]'
          : 'border-white/10 hover:border-cyan-400/50 shadow-[0_0_30px_-5px_rgba(56,189,248,0.15)]'
      }`}
    >
      {/* React Flow Input Handle (Left) */}
      <Handle
        type="target"
        position={Position.Left}
        className="!w-3 !h-3 !bg-cyan-400 !border-2 !border-[#0A0D14] shadow-[0_0_10px_#38bdf8]"
      />

      {/* Header Row */}
      <div className="flex items-start justify-between mb-3">
        <div className="flex items-center gap-2.5">
          <div
            className={`w-9 h-9 rounded-xl flex items-center justify-center border ${
              isGovernor
                ? 'bg-amber-500/10 border-amber-500/20 text-amber-400'
                : isQueue
                ? 'bg-[#ccff00]/10 border-[#ccff00]/20 text-[#ccff00]'
                : 'bg-cyan-500/10 border-cyan-500/20 text-cyan-400'
            }`}
          >
            {data.emoji ? (
              <span className="text-lg">{data.emoji}</span>
            ) : isGovernor ? (
              <ShieldCheck className="w-5 h-5" />
            ) : isQueue ? (
              <ListTodo className="w-5 h-5" />
            ) : (
              <Bot className="w-5 h-5" />
            )}
          </div>
          <div>
            <h3 className="text-xs font-bold text-white font-mono tracking-tight truncate w-36">
              {data.title}
            </h3>
            <p className="text-[10px] text-slate-400 font-mono truncate">{data.role}</p>
          </div>
        </div>

        {/* Status Indicator Badge */}
        <span
          className={`px-2 py-0.5 rounded-full text-[9px] font-mono font-extrabold uppercase tracking-wider border ${
            data.status === 'running'
              ? 'bg-cyan-500/15 text-cyan-300 border-cyan-500/30 animate-pulse'
              : data.status === 'online'
              ? 'bg-emerald-500/15 text-emerald-300 border-emerald-500/30'
              : data.status === 'gated'
              ? 'bg-amber-500/15 text-amber-300 border-amber-500/30'
              : 'bg-white/5 text-slate-400 border-white/10'
          }`}
        >
          {data.status}
        </span>
      </div>

      {/* Current Operational Job Card */}
      <div className="p-2.5 rounded-xl bg-black/40 border border-white/5 space-y-1 mb-3">
        <div className="text-[9px] uppercase tracking-wider font-mono text-slate-500 font-bold">
          Current Job / Payload:
        </div>
        <p className="text-[11px] font-mono text-slate-200 font-medium truncate">
          {data.currentJob}
        </p>
      </div>

      {/* Metric Breakdown */}
      <div className="flex items-center justify-between text-xs font-mono px-1 mb-3">
        <span className="text-slate-400">{data.metricLabel}:</span>
        <span className="font-bold text-emerald-400">{data.metricValue}</span>
      </div>

      {/* Action Trigger Buttons */}
      <div className="flex items-center gap-2 pt-1 border-t border-white/5">
        <button
          onClick={(e) => {
            e.stopPropagation();
            data.onTrigger?.();
          }}
          className="flex-1 py-1.5 rounded-lg bg-white/[0.04] hover:bg-white/[0.08] border border-white/10 hover:border-cyan-400/40 text-[10px] font-mono font-bold text-cyan-300 hover:text-cyan-200 transition-all flex items-center justify-center gap-1.5"
        >
          <Play className="w-3 h-3 text-cyan-400 fill-cyan-400" />
          <span>Execute</span>
        </button>
        <button
          onClick={(e) => {
            e.stopPropagation();
            data.onInspect?.();
          }}
          className="px-2.5 py-1.5 rounded-lg bg-white/[0.02] hover:bg-white/[0.05] border border-white/10 text-[10px] font-mono text-slate-400 hover:text-slate-200 transition-all"
        >
          Inspect
        </button>
      </div>

      {/* React Flow Output Handle (Right) */}
      <Handle
        type="source"
        position={Position.Right}
        className="!w-3 !h-3 !bg-[#ccff00] !border-2 !border-[#0A0D14] shadow-[0_0_10px_#ccff00]"
      />
    </div>
  );
}

export const AgentNode = memo(AgentNodeComponent);
