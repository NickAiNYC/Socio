'use client';

import React from 'react';
import Link from 'next/link';
import { HardHat, CheckCircle2, ShieldCheck, Mail, ArrowUpRight, Flower2, UtensilsCrossed, Stethoscope } from 'lucide-react';

export function Footer() {
  return (
    <footer className="bg-slate-950 text-white py-16 px-6 border-t border-slate-800">
      <div className="max-w-7xl mx-auto space-y-12">
        
        {/* Top Callout Banner for NYC General Contractors */}
        <div className="p-6 md:p-8 rounded-2xl bg-gradient-to-r from-slate-900 via-slate-800 to-slate-900 border border-slate-700/80 shadow-2xl flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div className="space-y-1.5">
            <div className="inline-flex items-center gap-2 px-2.5 py-0.5 rounded-full bg-orange-500/10 border border-orange-500/20 text-orange-400 text-xs font-mono font-bold">
              <HardHat className="w-3.5 h-3.5" />
              <span>VERTICAL EXCLUSIVO NYC</span>
            </div>
            <h4 className="text-lg md:text-xl font-bold text-white">
              ¿Eres Contratista General o de Remodelación en NYC?
            </h4>
            <p className="text-xs md:text-sm text-slate-400 max-w-2xl">
              Descubre nuestro sistema de adquisición de contratos bilingüe conectado a permisos DOB y depósitos de QuickBooks. Cero costo por adelantado.
            </p>
          </div>

          <Link
            href="/contratistas"
            className="inline-flex items-center gap-2 px-6 py-3.5 rounded-xl bg-[#FF5500] text-white text-xs font-black uppercase tracking-wider hover:bg-[#E04B00] shadow-lg shadow-orange-600/20 transition-all shrink-0 group"
          >
            <span>Ver Socio para Contratistas</span>
            <ArrowUpRight className="w-4 h-4 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
          </Link>
        </div>

        {/* Footer Link Columns */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10">
          
          {/* Col 1: Brand Info */}
          <div className="space-y-4">
            <Link href="/" className="flex items-center text-2xl font-bold tracking-tight text-white">
              <span>Socio</span>
              <span className="w-1.5 h-1.5 rounded-[1px] bg-[#669BD2] inline-block shadow-[0_0_6px_rgba(102,155,210,0.8)] ml-[1.5px] self-end mb-1"></span>
            </Link>
            <p className="text-xs text-slate-400 leading-relaxed">
              NYC&apos;s performance-based growth platform. We only get paid when our local merchant and contractor partners generate verified new revenue.
            </p>
            <div className="flex items-center gap-2 text-xs font-mono text-emerald-400">
              <ShieldCheck className="w-4 h-4" />
              <span>Tamper-Evident Ledger Backed</span>
            </div>
          </div>

          {/* Col 2: Platform Links */}
          <div className="space-y-3">
            <h5 className="text-xs font-mono font-bold uppercase tracking-widest text-slate-400">Platform</h5>
            <ul className="space-y-2 text-xs text-slate-400">
              <li><Link href="/#how-it-works" className="hover:text-white transition-colors">How It Works</Link></li>
              <li><Link href="/merchant-evidence.html" className="hover:text-white transition-colors">Evidence Ledger 🔒</Link></li>
              <li><Link href="/trust-and-proof.html" className="hover:text-white transition-colors">Attribution Protocol</Link></li>
              <li><Link href="/command-center.html" className="hover:text-white transition-colors">Command Center ⚡</Link></li>
            </ul>
          </div>

          {/* Col 3: Industries & Verticals */}
          <div className="space-y-3">
            <h5 className="text-xs font-mono font-bold uppercase tracking-widest text-slate-400">Industries & Verticals</h5>
            <ul className="space-y-2 text-xs text-slate-400">
              <li>
                <Link href="/contratistas" className="text-orange-400 hover:text-orange-300 font-semibold flex items-center gap-1.5">
                  <HardHat className="w-3.5 h-3.5" />
                  <span>Construction Partners (Español)</span>
                </Link>
              </li>
              <li>
                <Link href="/floristas" className="text-rose-400 hover:text-rose-300 font-semibold flex items-center gap-1.5">
                  <Flower2 className="w-3.5 h-3.5" />
                  <span>Florists & Botanical (NYC)</span>
                </Link>
              </li>
              <li>
                <Link href="/restaurantes" className="text-amber-400 hover:text-amber-300 font-semibold flex items-center gap-1.5">
                  <UtensilsCrossed className="w-3.5 h-3.5" />
                  <span>Restaurants & Catering (NYC)</span>
                </Link>
              </li>
              <li>
                <Link href="/clinicas" className="text-sky-400 hover:text-sky-300 font-semibold flex items-center gap-1.5">
                  <Stethoscope className="w-3.5 h-3.5" />
                  <span>Clinics & MedSpas (NYC)</span>
                </Link>
              </li>
              <li><Link href="/supplier-cards" className="hover:text-white transition-colors">Supplier Pro-Desk Nodes</Link></li>
              <li><Link href="/pilot-agreement" className="hover:text-white transition-colors">Contractor Pilot Agreement</Link></li>
              <li><Link href="/#how-it-works" className="hover:text-white transition-colors">Retail & POS Merchants</Link></li>
            </ul>
          </div>

          {/* Col 4: The Socio Promise */}
          <div className="space-y-3">
            <h5 className="text-xs font-mono font-bold uppercase tracking-widest text-slate-400">The Socio Guarantee</h5>
            <ul className="space-y-2 text-xs text-slate-400">
              <li className="flex items-center gap-2">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                <span>Zero upfront retainers</span>
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                <span>QuickBooks/POS verified</span>
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                <span>Cancel anytime without lock-in</span>
              </li>
            </ul>
          </div>

        </div>

        {/* Bottom Bar */}
        <div className="pt-8 border-t border-slate-800/80 flex flex-col md:flex-row items-center justify-between text-xs text-slate-500 gap-4">
          <div className="flex items-center">
            <span>Socio Inc. © {new Date().getFullYear()}. NYC Local Performance Growth Partner.</span>
          </div>
          <div className="flex items-center gap-6">
            <a href="mailto:hello@socio.nyc" className="hover:text-slate-300 flex items-center gap-1">
              <Mail className="w-3.5 h-3.5" />
              <span>hello@socio.nyc</span>
            </a>
          </div>
        </div>

      </div>
    </footer>
  );
}

export default Footer;
