'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  LayoutDashboard,
  Users,
  Zap,
  BarChart3,
  ShieldCheck,
  Search,
  Download,
  Terminal,
  Lock,
  ArrowUpRight,
  CheckCircle2,
  AlertTriangle,
  Clock,
  ExternalLink,
  ChevronRight,
  Sparkles,
  Receipt,
  Layers,
  Radio
} from 'lucide-react';

/* =========================================================================
   TYPES & INTERFACES
   ========================================================================= */

type EventType = 'STRIKE' | 'VERIFIED_REVENUE' | 'DORMANT_LEAD' | 'AUDIT' | 'SEO_SYNC';

interface GrowthEvent {
  id: string;
  timestamp: string;
  type: EventType;
  title: string;
  target: string;
  channel: 'WhatsApp' | 'SMS' | 'Google Maps' | 'POS Webhook' | 'Resend';
  amount?: number;
  commission?: number;
  status: 'DISPATCHED' | 'VERIFIED' | 'PENDING_MATCH' | 'FAILED';
  evidence: {
    receiptId?: string;
    posSource?: string;
    latencyMs?: number;
    dormantDays?: number;
    scoreConfidence?: number;
    hashProof?: string;
    attributedItems?: string[];
  };
}

/* =========================================================================
   MOCK TELEMETRY DATA
   ========================================================================= */

const MOCK_EVENTS: GrowthEvent[] = [
  {
    id: 'EV-8902',
    timestamp: '14:22:04',
    type: 'VERIFIED_REVENUE',
    title: 'WhatsApp VIP Offer Converted',
    target: 'Maria R. (Dormant 124 Days)',
    channel: 'WhatsApp',
    amount: 185.00,
    commission: 27.75,
    status: 'VERIFIED',
    evidence: {
      receiptId: 'sq_pos_tx_8104a',
      posSource: 'Square POS Cloud Webhook',
      latencyMs: 142,
      dormantDays: 124,
      scoreConfidence: 99.4,
      hashProof: '0x7f4e8b91...c2a9',
      attributedItems: ['1x Seasonal Bouquet Deluxe ($145.00)', '1x Custom Vase ($40.00)']
    }
  },
  {
    id: 'EV-8901',
    timestamp: '14:18:33',
    type: 'STRIKE',
    title: 'Outbound Strike Dispatched',
    target: 'Bloom & Branch (Astoria)',
    channel: 'Resend',
    status: 'DISPATCHED',
    evidence: {
      latencyMs: 48,
      scoreConfidence: 86.0,
      hashProof: '0x1a2b3c4d...99ef'
    }
  },
  {
    id: 'EV-8900',
    timestamp: '13:50:11',
    type: 'DORMANT_LEAD',
    title: 'Dormant Lead Re-engaged',
    target: 'Carlos D. (Dormant 88 Days)',
    channel: 'SMS',
    amount: 92.50,
    commission: 13.88,
    status: 'VERIFIED',
    evidence: {
      receiptId: 'clover_tx_9011e',
      posSource: 'Clover POS Ingestion',
      latencyMs: 89,
      dormantDays: 88,
      scoreConfidence: 97.8,
      hashProof: '0x55aa66bb...1122',
      attributedItems: ['2x Special Roast Bag ($42.50)', '1x Cold Brew Pack ($50.00)']
    }
  },
  {
    id: 'EV-8899',
    timestamp: '13:30:05',
    type: 'SEO_SYNC',
    title: 'Google Pack Rank #1 Synced',
    target: 'La Bodega NYC (12 Directories)',
    channel: 'Google Maps',
    status: 'DISPATCHED',
    evidence: {
      latencyMs: 312,
      scoreConfidence: 94.2,
      hashProof: '0x99887766...4433'
    }
  }
];

/* =========================================================================
   MAIN COMPONENT
   ========================================================================= */

export default function SocioCommandCenter() {
  const [activeNav, setActiveNav] = useState<'home' | 'leads' | 'automation' | 'analytics' | 'settings'>('home');
  const [selectedFilter, setSelectedFilter] = useState<'ALL' | 'VERIFIED' | 'STRIKES' | 'DORMANT'>('ALL');
  const [selectedEvent, setSelectedEvent] = useState<GrowthEvent | null>(null);
  const [searchQuery, setSearchQuery] = useState('');

  // Keyboard shortcut listener (⌘K)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        document.getElementById('socio-command-input')?.focus();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  const filteredEvents = MOCK_EVENTS.filter((ev) => {
    if (selectedFilter === 'VERIFIED') return ev.status === 'VERIFIED';
    if (selectedFilter === 'STRIKES') return ev.type === 'STRIKE';
    if (selectedFilter === 'DORMANT') return ev.type === 'DORMANT_LEAD';
    return true;
  }).filter((ev) => 
    ev.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    ev.target.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="flex h-screen w-full bg-[#0A0D14] text-slate-100 font-sans overflow-hidden antialiased selection:bg-cyan-500/20 selection:text-cyan-300">
      
      {/* ===================================================================
          1. LEFT NAVIGATION SIDEBAR
          =================================================================== */}
      <aside className="w-16 border-r border-white/5 bg-[#080B10]/80 backdrop-blur-2xl flex flex-col items-center justify-between py-6 z-30 shrink-0">
        <div className="flex flex-col items-center gap-8 w-full">
          {/* Logo Mark */}
          <div className="h-9 w-9 rounded-xl bg-gradient-to-br from-cyan-400/20 to-blue-600/10 border border-cyan-500/30 flex items-center justify-center shadow-[0_0_20px_rgba(56,189,248,0.25)]">
            <Radio className="w-4 h-4 text-cyan-400 animate-pulse" />
          </div>

          {/* Navigation Icon List */}
          <nav className="flex flex-col gap-3 w-full px-3">
            {[
              { id: 'home', icon: LayoutDashboard, label: 'Dashboard' },
              { id: 'leads', icon: Users, label: 'Leads & CRM' },
              { id: 'automation', icon: Zap, label: 'Automation Strikes' },
              { id: 'analytics', icon: BarChart3, label: 'Revenue Analytics' },
            ].map((item) => {
              const Icon = item.icon;
              const isActive = activeNav === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => setActiveNav(item.id as any)}
                  className={`relative w-10 h-10 rounded-xl flex items-center justify-center transition-all duration-300 group ${
                    isActive
                      ? 'bg-cyan-500/10 text-cyan-400 border border-cyan-500/30 shadow-[0_0_25px_-5px_rgba(56,189,248,0.4)]'
                      : 'text-slate-500 hover:text-slate-200 hover:bg-white/[0.03] border border-transparent'
                  }`}
                  title={item.label}
                >
                  <Icon className="w-4 h-4 transition-transform group-hover:scale-110" />
                  {isActive && (
                    <motion.div
                      layoutId="activeNavIndicator"
                      className="absolute left-0 w-0.5 h-4 bg-cyan-400 rounded-r-full shadow-[0_0_10px_#38bdf8]"
                    />
                  )}
                </button>
              );
            })}
          </nav>
        </div>

        {/* Bottom Shield/Governance Icon */}
        <button
          onClick={() => setActiveNav('settings')}
          className={`w-10 h-10 rounded-xl flex items-center justify-center transition-all ${
            activeNav === 'settings'
              ? 'bg-cyan-500/10 text-cyan-400 border border-cyan-500/30 shadow-[0_0_25px_-5px_rgba(56,189,248,0.4)]'
              : 'text-slate-500 hover:text-slate-200 hover:bg-white/[0.03] border border-transparent'
          }`}
          title="Security & Compliance"
        >
          <ShieldCheck className="w-4 h-4" />
        </button>
      </aside>

      {/* ===================================================================
          2. MAIN OPERATING THEATER (HEADER + KPIS + SPLIT VIEW)
          =================================================================== */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        
        {/* TOP HEADER BAR */}
        <header className="h-16 border-b border-white/5 px-8 flex items-center justify-between bg-[#0A0D14]/80 backdrop-blur-xl shrink-0 z-20">
          <div className="flex items-center gap-4">
            <h1 className="text-sm font-semibold tracking-wider uppercase text-white font-mono flex items-center gap-2.5">
              <span>Socio Command Center</span>
              <span className="text-slate-600">•</span>
              <span className="text-xs text-slate-400 font-normal">Autonomous Growth OS</span>
            </h1>

            {/* Live Status Pill */}
            <div className="inline-flex items-center gap-2 px-2.5 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 font-mono text-[10px] tracking-wider uppercase font-semibold">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping" />
              <span>LIVE POS SYNC</span>
            </div>
          </div>

          <div className="flex items-center gap-4">
            {/* Command Palette Search Bar */}
            <div className="relative flex items-center bg-white/[0.02] border border-white/5 rounded-xl px-3 py-1.5 w-72 focus-within:border-cyan-500/40 focus-within:bg-white/[0.04] transition-all">
              <Search className="w-3.5 h-3.5 text-slate-500 mr-2 shrink-0" />
              <input
                id="socio-command-input"
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search or jump... Cmd K"
                className="bg-transparent text-xs text-slate-200 placeholder:text-slate-500 focus:outline-none w-full font-mono"
              />
              <kbd className="hidden sm:inline-block text-[9px] font-mono text-slate-500 bg-white/5 border border-white/10 px-1.5 py-0.5 rounded">
                ⌘K
              </kbd>
            </div>

            {/* Export Action */}
            <button className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-white/[0.02] hover:bg-white/[0.05] border border-white/5 text-xs text-slate-300 font-mono transition-colors">
              <Download className="w-3.5 h-3.5 text-slate-400" />
              <span>Export Proof</span>
            </button>
          </div>
        </header>

        {/* SCROLLABLE WORKSPACE */}
        <main className="flex-1 overflow-y-auto p-8 space-y-8">
          
          {/* ===============================================================
              3. TOP KPI GRID (4 CARDS WITH SOCIO GLOW & STAGGER ANIMATION)
              =============================================================== */}
          <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {[
              {
                title: 'Recovery Pipeline',
                value: '$16,420',
                delta: '+18.4% MTD',
                icon: Layers,
                valueColor: 'text-white'
              },
              {
                title: 'Active Automated Strikes',
                value: '142',
                delta: '8 Agents Active',
                icon: Zap,
                valueColor: 'text-white'
              },
              {
                title: 'Dormant Leads Intercepted',
                value: '84',
                delta: '92.4% Delivery',
                icon: Users,
                valueColor: 'text-white'
              },
              {
                title: 'Verified Commission Revenue',
                value: '$2,463',
                delta: '15% Matched Fee',
                icon: Receipt,
                valueColor: 'text-emerald-400'
              }
            ].map((kpi, idx) => {
              const Icon = kpi.icon;
              return (
                <motion.div
                  key={kpi.title}
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.35, delay: idx * 0.08, ease: 'easeOut' }}
                  whileHover={{ y: -2 }}
                  className="relative p-5 rounded-2xl bg-white/[0.02] border border-white/5 backdrop-blur-xl shadow-[0_0_40px_-10px_rgba(56,189,248,0.08)] hover:shadow-[0_0_50px_-5px_rgba(56,189,248,0.22)] hover:border-cyan-500/30 transition-all duration-300 group"
                >
                  <div className="flex items-center justify-between">
                    <span className="text-[11px] font-mono uppercase tracking-widest text-slate-400 font-medium">
                      {kpi.title}
                    </span>
                    <div className="w-8 h-8 rounded-xl bg-white/[0.02] border border-white/5 flex items-center justify-center text-slate-400 group-hover:text-cyan-400 group-hover:border-cyan-500/20 transition-colors">
                      <Icon className="w-4 h-4" />
                    </div>
                  </div>

                  <div className="mt-4 flex items-baseline justify-between">
                    <div className={`text-2xl lg:text-3xl font-medium tracking-tight font-sans ${kpi.valueColor}`}>
                      {kpi.value}
                    </div>
                    <span className="text-[10px] font-mono text-slate-500 group-hover:text-slate-400 transition-colors">
                      {kpi.delta}
                    </span>
                  </div>
                </motion.div>
              );
            })}
          </section>

          {/* ===============================================================
              4. MAIN SPLIT VIEW (EVENT STREAM + ATTRIBUTION PROTOCOL)
              =============================================================== */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            
            {/* LEFT PANEL: LIVE GROWTH EVENT STREAM (7 COLS) */}
            <motion.div
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: 0.35 }}
              className="lg:col-span-7 rounded-2xl bg-white/[0.02] border border-white/5 backdrop-blur-xl shadow-[0_0_40px_-10px_rgba(56,189,248,0.12)] p-6 space-y-5"
            >
              {/* Header with Filters */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-white/5 pb-4">
                <div className="flex items-center gap-2.5">
                  <Terminal className="w-4 h-4 text-cyan-400" />
                  <span className="text-xs font-mono uppercase tracking-widest text-slate-200 font-semibold">
                    LIVE GROWTH EVENT STREAM
                  </span>
                </div>

                {/* Filter Tabs */}
                <div className="flex items-center gap-1 bg-white/[0.02] border border-white/5 p-1 rounded-xl">
                  {(['ALL', 'VERIFIED', 'STRIKES', 'DORMANT'] as const).map((tab) => (
                    <button
                      key={tab}
                      onClick={() => setSelectedFilter(tab)}
                      className={`px-3 py-1 rounded-lg text-[10px] font-mono font-medium tracking-wider uppercase transition-all ${
                        selectedFilter === tab
                          ? 'bg-cyan-500/10 text-cyan-400 border border-cyan-500/20 shadow-[0_0_15px_rgba(56,189,248,0.2)]'
                          : 'text-slate-400 hover:text-slate-200'
                      }`}
                    >
                      {tab}
                    </button>
                  ))}
                </div>
              </div>

              {/* Event Stream List */}
              <div className="space-y-3">
                {filteredEvents.length === 0 ? (
                  <div className="py-12 text-center text-xs font-mono text-slate-500">
                    No matching growth events recorded.
                  </div>
                ) : (
                  filteredEvents.map((ev) => {
                    const isSelected = selectedEvent?.id === ev.id;
                    return (
                      <div
                        key={ev.id}
                        onClick={() => setSelectedEvent(ev)}
                        className={`p-4 rounded-xl border transition-all duration-200 cursor-pointer flex items-center justify-between group ${
                          isSelected
                            ? 'bg-cyan-500/[0.04] border-cyan-500/40 shadow-[0_0_25px_-5px_rgba(56,189,248,0.2)]'
                            : 'bg-white/[0.01] hover:bg-white/[0.03] border-white/5 hover:border-white/10'
                        }`}
                      >
                        <div className="flex items-start gap-3.5 min-w-0">
                          <div
                            className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 border ${
                              ev.status === 'VERIFIED'
                                ? 'bg-emerald-500/10 border-emerald-500/20 text-emerald-400'
                                : 'bg-cyan-500/10 border-cyan-500/20 text-cyan-400'
                            }`}
                          >
                            {ev.status === 'VERIFIED' ? (
                              <CheckCircle2 className="w-4 h-4" />
                            ) : (
                              <Zap className="w-4 h-4" />
                            )}
                          </div>

                          <div className="min-w-0 space-y-1">
                            <div className="flex items-center gap-2">
                              <span className="text-xs font-medium text-slate-100 truncate group-hover:text-cyan-300 transition-colors">
                                {ev.title}
                              </span>
                              <span className="text-[10px] font-mono text-slate-500">• {ev.timestamp}</span>
                            </div>
                            <p className="text-[11px] font-mono text-slate-400 truncate">
                              Target: <span className="text-slate-300">{ev.target}</span> via {ev.channel}
                            </p>
                          </div>
                        </div>

                        <div className="text-right shrink-0 ml-4 flex flex-col items-end gap-1">
                          {ev.amount ? (
                            <span className="text-xs font-mono font-semibold text-emerald-400">
                              +${ev.amount.toFixed(2)}
                            </span>
                          ) : (
                            <span className="text-[10px] font-mono text-slate-500">DISPATCHED</span>
                          )}
                          <div className="flex items-center gap-1 text-[9px] font-mono text-slate-400">
                            <span>Inspect</span>
                            <ChevronRight className="w-3 h-3 text-slate-500 group-hover:translate-x-0.5 transition-transform" />
                          </div>
                        </div>
                      </div>
                    );
                  })
                )}
              </div>
            </motion.div>

            {/* RIGHT PANEL: ATTRIBUTION PROTOCOL CENTER (5 COLS) */}
            <motion.div
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: 0.45 }}
              className="lg:col-span-5 rounded-2xl bg-white/[0.02] border border-white/5 backdrop-blur-xl shadow-[0_0_40px_-10px_rgba(56,189,248,0.12)] p-6 space-y-6"
            >
              <div className="flex items-center justify-between border-b border-white/5 pb-4">
                <div className="flex items-center gap-2.5">
                  <ShieldCheck className="w-4 h-4 text-cyan-400" />
                  <span className="text-xs font-mono uppercase tracking-widest text-slate-200 font-semibold">
                    ATTRIBUTION PROTOCOL CENTER
                  </span>
                </div>
                {selectedEvent && (
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-cyan-500/10 text-cyan-400 border border-cyan-500/20">
                    {selectedEvent.id}
                  </span>
                )}
              </div>

              <AnimatePresence mode="wait">
                {!selectedEvent ? (
                  /* Lock Screen State */
                  <motion.div
                    key="unselected"
                    initial={{ opacity: 0, scale: 0.98 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.98 }}
                    className="py-20 flex flex-col items-center justify-center text-center space-y-4"
                  >
                    <div className="w-14 h-14 rounded-2xl bg-white/[0.02] border border-white/5 flex items-center justify-center text-slate-500 shadow-[0_0_30px_rgba(0,0,0,0.5)]">
                      <Lock className="w-6 h-6 text-slate-500" />
                    </div>
                    <div className="space-y-1 max-w-xs">
                      <h3 className="text-xs font-mono uppercase tracking-wider text-slate-300 font-semibold">
                        No Event Selected
                      </h3>
                      <p className="text-[11px] font-mono text-slate-500 leading-relaxed">
                        Select any real-time growth strike or conversion from the live stream to inspect POS receipt verification and causal attribution proof.
                      </p>
                    </div>
                  </motion.div>
                ) : (
                  /* Detailed Attribution Evidence Card */
                  <motion.div
                    key={selectedEvent.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    className="space-y-6"
                  >
                    {/* Top Outcome Badge */}
                    <div className="p-4 rounded-xl bg-emerald-500/[0.04] border border-emerald-500/20 space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="text-[10px] font-mono uppercase tracking-widest text-emerald-400 font-bold">
                          VERIFIED POS ATTESTATION
                        </span>
                        <span className="text-xs font-mono font-bold text-emerald-400">
                          {selectedEvent.evidence.scoreConfidence}% CONFIDENCE
                        </span>
                      </div>
                      <div className="text-xl font-medium text-white font-sans">
                        {selectedEvent.amount ? `$${selectedEvent.amount.toFixed(2)} Gross Recovered` : 'Strike Active'}
                      </div>
                    </div>

                    {/* Forensic Receipt Breakdown */}
                    <div className="space-y-3 font-mono text-xs">
                      <div className="text-[10px] uppercase tracking-widest text-slate-500 font-semibold">
                        POS RECEIPT METADATA
                      </div>

                      <div className="p-3.5 rounded-xl bg-black/40 border border-white/5 space-y-2.5">
                        <div className="flex justify-between">
                          <span className="text-slate-500">Transaction ID:</span>
                          <span className="text-slate-200">{selectedEvent.evidence.receiptId || 'Pending Ingestion'}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-slate-500">Telemetry Source:</span>
                          <span className="text-cyan-400">{selectedEvent.evidence.posSource || 'Direct API'}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-slate-500">Latency:</span>
                          <span className="text-slate-200">{selectedEvent.evidence.latencyMs}ms</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-slate-500">Cryptographic Proof:</span>
                          <span className="text-slate-400 font-mono text-[10px]">{selectedEvent.evidence.hashProof}</span>
                        </div>
                      </div>
                    </div>

                    {/* Attributed Item Basket */}
                    {selectedEvent.evidence.attributedItems && (
                      <div className="space-y-3 font-mono text-xs">
                        <div className="text-[10px] uppercase tracking-widest text-slate-500 font-semibold">
                          VERIFIED BASKET ITEMS
                        </div>
                        <div className="space-y-1.5">
                          {selectedEvent.evidence.attributedItems.map((item, i) => (
                            <div
                              key={i}
                              className="p-2 rounded-lg bg-white/[0.02] border border-white/5 text-[11px] text-slate-300 flex items-center justify-between"
                            >
                              <span>{item}</span>
                              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0 ml-2" />
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Performance Fee Split */}
                    {selectedEvent.commission && (
                      <div className="p-3 rounded-xl bg-white/[0.02] border border-white/5 flex items-center justify-between text-xs font-mono">
                        <span className="text-slate-400">Socio 15% Performance Fee:</span>
                        <span className="text-emerald-400 font-semibold">+${selectedEvent.commission.toFixed(2)}</span>
                      </div>
                    )}

                    <button
                      onClick={() => setSelectedEvent(null)}
                      className="w-full py-2 bg-white/[0.02] hover:bg-white/[0.05] border border-white/10 rounded-xl text-xs font-mono text-slate-400 hover:text-slate-200 transition-colors"
                    >
                      Clear Selection
                    </button>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>

          </div>

        </main>
      </div>

    </div>
  );
}
