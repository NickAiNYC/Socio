'use client';

import React, { useState } from 'react';

export function computeTieredCommission(contractAmount: number) {
  let fee = 0;
  if (contractAmount <= 10000) {
    fee = contractAmount * 0.12;
  } else if (contractAmount <= 50000) {
    fee = (10000 * 0.12) + ((contractAmount - 10000) * 0.08);
  } else {
    fee = (10000 * 0.12) + (40000 * 0.08) + ((contractAmount - 50000) * 0.05);
  }
  const effectiveRate = Number((fee / contractAmount).toFixed(4));
  return { fee: Number(fee.toFixed(2)), effectiveRate };
}

export function CommissionSimulator({ lang = 'es' }: { lang?: 'es' | 'en' }) {
  const [contractValue, setContractValue] = useState<number>(45000);
  const { fee, effectiveRate } = computeTieredCommission(contractValue);
  const deposit = contractValue * 0.30;
  const contractorNet = contractValue - fee;

  return (
    <div className="bg-white rounded-2xl p-8 border border-slate-300 shadow-xl space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-200 pb-6">
        <div>
          <h3 className="text-2xl font-black text-slate-900">
            {lang === 'es' ? 'Calculadora de Comisión por Tramos' : 'Tiered Project Commission Simulator'}
          </h3>
          <p className="text-xs text-slate-500 font-mono mt-1">
            {lang === 'es' 
              ? 'Tramos: 12% (<$10k) · 8% ($10k–$50k) · 5% (>$50k) | Tope Anual: $40,000'
              : 'Tiers: 12% (<$10k) · 8% ($10k–$50k) · 5% (>$50k) | Annual Cap: $40,000'}
          </p>
        </div>
        <div className="px-3.5 py-1.5 bg-blue-50 border border-blue-200 text-blue-800 font-mono text-xs font-bold rounded-xl self-start md:self-auto">
          {lang === 'es' ? 'Tasa Efectiva:' : 'Effective Fee:'} {(effectiveRate * 100).toFixed(1)}%
        </div>
      </div>

      <div className="space-y-4">
        <div className="flex justify-between items-center">
          <label className="text-sm font-bold text-slate-700">
            {lang === 'es' ? 'Valor Total del Contrato:' : 'Total Contract Value:'}
          </label>
          <span className="text-3xl font-black font-mono text-blue-700">
            ${contractValue.toLocaleString()}
          </span>
        </div>
        <input
          type="range"
          min="5000"
          max="150000"
          step="2500"
          value={contractValue}
          onChange={(e) => setContractValue(Number(e.target.value))}
          className="w-full h-3 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-blue-700"
        />
        <div className="flex justify-between text-[11px] font-mono text-slate-400">
          <span>$5,000 (Menor)</span>
          <span>$50,000 (Remodelación)</span>
          <span>$150,000+ (Comercial / Gut Rehab)</span>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2">
        <div className="p-4 rounded-xl bg-slate-50 border border-slate-200">
          <div className="text-xs text-slate-500 font-bold uppercase">{lang === 'es' ? 'Depósito Estimado (30%)' : 'Deposit Required (30%)'}</div>
          <div className="text-2xl font-black font-mono text-slate-900 mt-1">${Math.round(deposit).toLocaleString()}</div>
          <div className="text-[10px] text-emerald-600 font-bold mt-1">✓ Condición para cobrar comisión</div>
        </div>

        <div className="p-4 rounded-xl bg-red-50 border border-red-200">
          <div className="text-xs text-red-800 font-bold uppercase">{lang === 'es' ? 'Comisión Socio' : 'Socio Commission'}</div>
          <div className="text-2xl font-black font-mono text-red-600 mt-1">${Math.round(fee).toLocaleString()}</div>
          <div className="text-[10px] text-red-700 font-medium mt-1">✓ Solo cuando el anticipo se cobra</div>
        </div>

        <div className="p-4 rounded-xl bg-emerald-50 border border-emerald-200">
          <div className="text-xs text-emerald-800 font-bold uppercase">{lang === 'es' ? 'Neto para su Empresa' : 'Contractor Retained'}</div>
          <div className="text-2xl font-black font-mono text-emerald-700 mt-1">${Math.round(contractorNet).toLocaleString()}</div>
          <div className="text-[10px] text-emerald-800 font-bold mt-1">✓ 100% materiales y cuadrillas</div>
        </div>
      </div>
    </div>
  );
}
