'use client';

import React, { useState, useCallback, useMemo } from 'react';
import {
  ReactFlow,
  ReactFlowProvider,
  Background,
  Controls,
  MiniMap,
  useNodesState,
  useEdgesState,
  addEdge,
  Connection,
  Edge,
  Node,
  BackgroundVariant
} from '@xyflow/react';
import '@xyflow/react/dist/style.css';

import { motion, AnimatePresence } from 'framer-motion';
import {
  Sparkles,
  Zap,
  Check,
  ShieldAlert,
  Search,
  Scan,
  Store,
  Kanban,
  Receipt,
  Brain,
  Activity,
  ChevronUp,
  X,
  Radio,
  Download
} from 'lucide-react';

import { AgentNode, AgentNodeData } from './AgentNode';

/* =========================================================================
   NODE TYPES REGISTER
   ========================================================================= */

const nodeTypes = {
  agentNode: AgentNode,
};

/* =========================================================================
   INITIAL GRAPH NODES (FOUNDER QUEUE, AGENTS, GOVERNOR)
   ========================================================================= */

const initialNodes: Node<AgentNodeData>[] = [
  // 1. Central Governor Node
  {
    id: 'governor-node',
    type: 'agentNode',
    position: { x: 580, y: 220 },
    data: {
      title: 'Socio-Governor CAS',
      role: 'Safety & CAS Approval Matrix',
      category: 'GOVERNOR',
      status: 'gated',
      currentJob: 'Evaluating PROP-0042 ($400 Ad Spend)',
      metricLabel: 'Pending Proposals',
      metricValue: '3 Proposals Gated',
      riskTier: 'HIGH',
      emoji: '🛡️'
    }
  },
  // 2. Founder Action Queue Node
  {
    id: 'queue-node',
    type: 'agentNode',
    position: { x: 580, y: 520 },
    data: {
      title: 'Founder Action Queue',
      role: 'Priority Scored Execution',
      category: 'QUEUE',
      status: 'ready',
      currentJob: 'P0: Approve East Harlem Bites',
      metricLabel: 'Projected Uplift',
      metricValue: '+$4,400 (11x ROAS)',
      emoji: '⚡'
    }
  },
  // 3. Autonomous Fleet Agents (Left Flank)
  {
    id: 'prospect-agent',
    type: 'agentNode',
    position: { x: 120, y: 80 },
    data: {
      title: 'Socio-Prospect',
      role: 'Lead Gen & NYC Scraping',
      category: 'AGENT',
      status: 'running',
      currentJob: 'Scraping East Harlem Florists',
      metricLabel: 'Pipeline Scored',
      metricValue: '47 Scored (12 Qual)',
      emoji: '🕵️'
    }
  },
  {
    id: 'pitch-agent',
    type: 'agentNode',
    position: { x: 120, y: 300 },
    data: {
      title: 'Socio-Pitch',
      role: 'Outreach & VIP Touches',
      category: 'AGENT',
      status: 'idle',
      currentJob: 'WhatsApp sequence awaiting approval',
      metricLabel: 'Response Rate',
      metricValue: '71% Delivery',
      emoji: '📣'
    }
  },
  {
    id: 'onboard-agent',
    type: 'agentNode',
    position: { x: 120, y: 520 },
    data: {
      title: 'Socio-Onboard',
      role: 'Agreements & Twin Setup',
      category: 'AGENT',
      status: 'online',
      currentJob: 'DocuSign signed for El Nuevo Cafe',
      metricLabel: 'Twin Inits',
      metricValue: '2 Active Setups',
      emoji: '📋'
    }
  },
  // 4. Autonomous Fleet Agents (Right Flank)
  {
    id: 'content-agent',
    type: 'agentNode',
    position: { x: 1040, y: 80 },
    data: {
      title: 'Socio-Content',
      role: 'Content & Campaign Strikes',
      category: 'AGENT',
      status: 'running',
      currentJob: '30-Day Reels Calendar + Paid Strike',
      metricLabel: 'Engagement Uplift',
      metricValue: '4.2% Organic Avg',
      emoji: '✍️'
    }
  },
  {
    id: 'listings-agent',
    type: 'agentNode',
    position: { x: 1040, y: 300 },
    data: {
      title: 'Socio-Listings',
      role: 'Local SEO & Reviews',
      category: 'AGENT',
      status: 'online',
      currentJob: '12 Directory Sync for La Bodega',
      metricLabel: 'Local Rank',
      metricValue: 'Rank #1 Map Pack',
      emoji: '📍'
    }
  },
  {
    id: 'track-agent',
    type: 'agentNode',
    position: { x: 1040, y: 520 },
    data: {
      title: 'Socio-Track',
      role: 'POS Webhooks & Ledger',
      category: 'AGENT',
      status: 'online',
      currentJob: 'Square Webhook Match #tx_8104a',
      metricLabel: 'Verified Rev',
      metricValue: '+$15,870 MTD',
      emoji: '💳'
    }
  }
];

/* =========================================================================
   ANIMATED WIRE CONNECTIONS (EDGES)
   ========================================================================= */

const initialEdges: Edge[] = [
  {
    id: 'edge-prospect-pitch',
    source: 'prospect-agent',
    target: 'pitch-agent',
    animated: true,
    style: { stroke: '#38bdf8', strokeWidth: 2 }
  },
  {
    id: 'edge-pitch-governor',
    source: 'pitch-agent',
    target: 'governor-node',
    animated: true,
    style: { stroke: '#f59e0b', strokeWidth: 2.5 }
  },
  {
    id: 'edge-content-governor',
    source: 'content-agent',
    target: 'governor-node',
    animated: true,
    style: { stroke: '#ccff00', strokeWidth: 3 }
  },
  {
    id: 'edge-governor-queue',
    source: 'governor-node',
    target: 'queue-node',
    animated: true,
    style: { stroke: '#ccff00', strokeWidth: 3 }
  },
  {
    id: 'edge-onboard-governor',
    source: 'onboard-agent',
    target: 'governor-node',
    animated: false,
    style: { stroke: 'rgba(255,255,255,0.2)', strokeWidth: 1.5 }
  },
  {
    id: 'edge-track-governor',
    source: 'track-agent',
    target: 'governor-node',
    animated: true,
    style: { stroke: '#10B981', strokeWidth: 2 }
  }
];

/* =========================================================================
   MAIN CONTROL PLANE COMPONENT
   ========================================================================= */

export function ControlPlane() {
  const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);
  const [activeDock, setActiveDock] = useState<'merchants' | 'pipeline' | 'revenue' | 'learning' | null>(null);
  const [isHudCollapsed, setIsHudCollapsed] = useState(false);

  const onConnect = useCallback(
    (params: Connection) => setEdges((eds) => addEdge({ ...params, animated: true }, eds)),
    [setEdges]
  );

  return (
    <div className="relative w-screen h-screen bg-[#0A0D14] text-slate-100 overflow-hidden font-sans select-none antialiased">
      
      {/* ===================================================================
          1. PERSISTENT TOP APP BAR (Z-30)
          =================================================================== */}
      <header className="absolute top-0 left-0 right-0 h-14 border-b border-white/5 bg-[#080B10]/80 px-6 flex items-center justify-between backdrop-blur-xl z-30">
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1 text-base font-black tracking-tight text-white font-mono">
            <span>Socio</span>
            <span className="w-2 h-2 rounded-[2px] bg-[#669BD2] inline-block shadow-[0_0_8px_rgba(102,155,210,0.8)] ml-0.5 self-end mb-0.5" />
          </div>
          <span className="px-2 py-0.5 rounded bg-cyan-500/10 border border-cyan-500/20 text-[9px] font-mono font-extrabold uppercase text-cyan-300">
            AGENT CONTROL PLANE
          </span>
          <div className="h-3 w-px bg-white/10 hidden sm:block" />
          <div className="flex items-center gap-2 font-mono text-[11px] text-slate-400">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            <span>8 AGENTS LIVE</span>
            <span className="text-slate-600">•</span>
            <span className="text-emerald-400 font-bold">🟢 LIVE POS SYNC</span>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => setIsHudCollapsed(!isHudCollapsed)}
            className="px-3 py-1 rounded-xl text-xs font-mono font-bold bg-[#ccff00]/10 hover:bg-[#ccff00]/20 border border-[#ccff00]/30 text-[#ccff00] transition-all flex items-center gap-1.5"
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>{isHudCollapsed ? 'Show HUD' : 'HUD Focus'}</span>
          </button>
        </div>
      </header>

      {/* ===================================================================
          2. FLOATING FIGHTER-JET COMMAND HUD (Z-40, FRAMER MOTION PULSE)
          =================================================================== */}
      <AnimatePresence>
        {!isHudCollapsed && (
          <motion.div
            initial={{ opacity: 0, y: -20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -20, scale: 0.95 }}
            transition={{ duration: 0.35, ease: 'easeOut' }}
            className="absolute top-18 left-1/2 -translate-x-1/2 w-full max-w-4xl px-4 z-40"
          >
            <div className="relative p-5 rounded-2xl bg-gradient-to-b from-[#131826]/95 to-[#0A0D14]/95 border border-[#ccff00]/40 backdrop-blur-2xl shadow-[0_0_50px_-10px_rgba(204,255,0,0.25)] flex flex-col md:flex-row items-start md:items-center justify-between gap-5 overflow-hidden">
              
              {/* Diffuse Backlight Glow */}
              <div className="absolute -top-12 -left-12 w-48 h-48 bg-[#ccff00]/10 rounded-full blur-3xl pointer-events-none" />

              {/* Directive Summary */}
              <div className="space-y-1.5 min-w-0 flex-1 relative z-10">
                <div className="flex items-center gap-2">
                  <motion.span
                    animate={{ scale: [1, 1.2, 1] }}
                    transition={{ duration: 2, repeat: Infinity }}
                    className="p-1 rounded bg-[#ccff00]/10 text-[#ccff00]"
                  >
                    <Zap className="w-3.5 h-3.5 fill-[#ccff00]" />
                  </motion.span>
                  <span className="text-[10px] font-mono font-extrabold uppercase tracking-widest text-[#ccff00]">
                    AI CHIEF OF STAFF • NEXT BEST ACTION
                  </span>
                  <span className="px-1.5 py-0.5 rounded text-[9px] font-mono font-bold bg-[#ccff00]/10 border border-[#ccff00]/30 text-[#ccff00]">
                    P0 HIGH ROI
                  </span>
                </div>
                
                <h2 className="text-base sm:text-lg font-bold text-white tracking-tight font-sans truncate">
                  Approve East Harlem Bites Paid Campaign ($400 Budget)
                </h2>
                
                <div className="text-xs text-slate-300 font-mono flex items-center gap-3">
                  <span>Impact: <strong className="text-emerald-400 font-bold">+$4,400 Net Rev</strong></span>
                  <span className="text-slate-600">•</span>
                  <span>Projected Return: <strong className="text-sky-400 font-bold">11x ROAS</strong></span>
                </div>
              </div>

              {/* 1-Click Action Controls */}
              <div className="flex items-center gap-2.5 shrink-0 relative z-10">
                <button className="px-5 py-2.5 bg-[#ccff00] text-black font-extrabold font-mono text-xs rounded-xl hover:brightness-110 shadow-[0_0_20px_rgba(204,255,0,0.4)] flex items-center gap-1.5 transition-transform hover:scale-[1.03]">
                  <Check className="w-3.5 h-3.5" />
                  <span>Execute (+$4,400)</span>
                </button>
                <button className="px-3.5 py-2.5 bg-white/[0.04] hover:bg-white/[0.08] text-slate-300 font-mono text-xs rounded-xl border border-white/10">
                  Inspect Evidence
                </button>
              </div>

            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ===================================================================
          3. FULL SCREEN REACT FLOW EXECUTION CANVAS (Z-10)
          =================================================================== */}
      <div className="w-full h-full">
        <ReactFlow
          nodes={nodes}
          edges={edges}
          onNodesChange={onNodesChange}
          onEdgesChange={onEdgesChange}
          onConnect={onConnect}
          nodeTypes={nodeTypes}
          fitView
          fitViewOptions={{ padding: 0.2 }}
          minZoom={0.5}
          maxZoom={1.5}
          className="bg-[#06080D]"
        >
          <Background
            variant={BackgroundVariant.Dots}
            gap={28}
            size={1.5}
            color="rgba(56, 189, 248, 0.15)"
          />
          <Controls className="!bg-[#0D111B] !border-white/10 !fill-slate-300 rounded-xl overflow-hidden shadow-2xl" />
          <MiniMap
            nodeStrokeColor="#38bdf8"
            nodeColor="#0D111B"
            maskColor="rgba(6, 8, 13, 0.8)"
            className="!bg-[#0D111B] !border !border-white/10 rounded-2xl overflow-hidden shadow-2xl"
          />
        </ReactFlow>
      </div>

      {/* ===================================================================
          4. BOTTOM TELEMETRY DOCK & SLIDE-OUT DRAWERS (Z-50)
          =================================================================== */}
      <div className="absolute bottom-6 left-1/2 -translate-x-1/2 z-40 flex items-center gap-2 bg-[#0c101a]/90 border border-white/10 p-1.5 rounded-2xl backdrop-blur-2xl shadow-2xl">
        <button
          onClick={() => setActiveDock(activeDock === 'merchants' ? null : 'merchants')}
          className={`px-3.5 py-2 rounded-xl text-xs font-mono font-bold flex items-center gap-2 transition-all ${
            activeDock === 'merchants' ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40' : 'text-slate-400 hover:text-white'
          }`}
        >
          <Store className="w-4 h-4 text-sky-400" />
          <span>Merchants (10)</span>
        </button>

        <button
          onClick={() => setActiveDock(activeDock === 'pipeline' ? null : 'pipeline')}
          className={`px-3.5 py-2 rounded-xl text-xs font-mono font-bold flex items-center gap-2 transition-all ${
            activeDock === 'pipeline' ? 'bg-purple-500/20 text-purple-300 border border-purple-500/40' : 'text-slate-400 hover:text-white'
          }`}
        >
          <Kanban className="w-4 h-4 text-purple-400" />
          <span>Pipeline ($42.1k)</span>
        </button>

        <button
          onClick={() => setActiveDock(activeDock === 'revenue' ? null : 'revenue')}
          className={`px-3.5 py-2 rounded-xl text-xs font-mono font-bold flex items-center gap-2 transition-all ${
            activeDock === 'revenue' ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40' : 'text-slate-400 hover:text-white'
          }`}
        >
          <Receipt className="w-4 h-4 text-emerald-400" />
          <span>Revenue Proof</span>
        </button>

        <button
          onClick={() => setActiveDock(activeDock === 'learning' ? null : 'learning')}
          className={`px-3.5 py-2 rounded-xl text-xs font-mono font-bold flex items-center gap-2 transition-all ${
            activeDock === 'learning' ? 'bg-[#ccff00]/20 text-[#ccff00] border border-[#ccff00]/40' : 'text-slate-400 hover:text-white'
          }`}
        >
          <Brain className="w-4 h-4 text-[#ccff00]" />
          <span>Learning Loop</span>
        </button>
      </div>

      {/* Slide-out Bottom Drawer */}
      <AnimatePresence>
        {activeDock && (
          <motion.div
            initial={{ y: '100%' }}
            animate={{ y: 0 }}
            exit={{ y: '100%' }}
            transition={{ duration: 0.35, ease: 'easeOut' }}
            className="absolute inset-x-0 bottom-0 h-[480px] bg-[#0c101a]/95 border-t border-white/10 p-6 z-50 backdrop-blur-2xl shadow-[0_-20px_50px_rgba(0,0,0,0.9)] overflow-y-auto"
          >
            <div className="flex items-center justify-between border-b border-white/5 pb-4 mb-4">
              <div className="flex items-center gap-2 font-mono text-xs uppercase font-bold text-white tracking-widest">
                <Activity className="w-4 h-4 text-cyan-400" />
                <span>TELEMETRY DOCK: {activeDock.toUpperCase()}</span>
              </div>
              <button
                onClick={() => setActiveDock(null)}
                className="w-7 h-7 rounded-lg bg-white/5 hover:bg-white/10 flex items-center justify-center text-slate-400 hover:text-white"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {activeDock === 'merchants' && (
              <table className="w-full text-left text-xs font-mono">
                <thead>
                  <tr className="text-[10px] uppercase text-slate-500 border-b border-white/5">
                    <th className="p-3">Merchant Name</th>
                    <th>Borough</th>
                    <th>Lifecycle</th>
                    <th>Assigned Agent</th>
                    <th>Attributed Rev</th>
                    <th>Health</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5 text-slate-300">
                  <tr>
                    <td className="p-3 font-bold text-white">Cristal Flowers</td>
                    <td>East Harlem</td>
                    <td><span className="px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 text-[9px]">ACTIVE</span></td>
                    <td className="text-sky-400">Socio-Content</td>
                    <td className="text-emerald-400 font-bold">$4,820</td>
                    <td>94/100</td>
                  </tr>
                  <tr>
                    <td className="p-3 font-bold text-white">El Nuevo Cafe</td>
                    <td>Wash. Heights</td>
                    <td><span className="px-2 py-0.5 rounded bg-sky-500/10 text-sky-400 border border-sky-500/20 text-[9px]">ONBOARDING</span></td>
                    <td className="text-sky-400">Socio-Onboard</td>
                    <td className="text-emerald-400 font-bold">$0</td>
                    <td>88/100</td>
                  </tr>
                  <tr>
                    <td className="p-3 font-bold text-white">East Harlem Bites</td>
                    <td>East Harlem</td>
                    <td><span className="px-2 py-0.5 rounded bg-yellow-500/10 text-yellow-400 border border-yellow-500/20 text-[9px]">EXPANSION</span></td>
                    <td className="text-sky-400">Socio-Expand</td>
                    <td className="text-emerald-400 font-bold">$5,610</td>
                    <td>96/100</td>
                  </tr>
                </tbody>
              </table>
            )}

            {activeDock === 'revenue' && (
              <div className="space-y-4 font-mono text-xs">
                <div className="grid grid-cols-4 gap-4">
                  <div className="p-3.5 rounded-xl bg-black/40 border border-white/5">
                    <div className="text-[10px] text-slate-500">Gross Recovered</div>
                    <div className="text-xl font-bold text-white mt-1">$22,890.00</div>
                  </div>
                  <div className="p-3.5 rounded-xl bg-black/40 border border-white/5">
                    <div className="text-[10px] text-slate-500">Verified Delta</div>
                    <div className="text-xl font-bold text-sky-400 mt-1">$15,870.00</div>
                  </div>
                  <div className="p-3.5 rounded-xl bg-black/40 border border-white/5">
                    <div className="text-[10px] text-slate-500">Socio 15% Fee</div>
                    <div className="text-xl font-bold text-[#ccff00] mt-1">$2,380.50</div>
                  </div>
                  <div className="p-3.5 rounded-xl bg-black/40 border border-white/5">
                    <div className="text-[10px] text-slate-500">Store Payout (85%)</div>
                    <div className="text-xl font-bold text-white mt-1">$13,489.50</div>
                  </div>
                </div>
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>

    </div>
  );
}

export default function ControlPlanePage() {
  return (
    <ReactFlowProvider>
      <ControlPlane />
    </ReactFlowProvider>
  );
}
