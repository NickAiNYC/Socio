'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { trackEvent } from '@/lib/analytics';

type ContractorFormState = {
  companyName: string;
  principalName: string;
  email: string;
  phone: string;
  trade: string;
  csiCode: string;
  boroughs: string[];
  dobLicense: string;
  coiVerified: boolean;
  coopExperience: boolean;
};

const INITIAL_FORM: ContractorFormState = {
  companyName: '',
  principalName: '',
  email: '',
  phone: '',
  trade: 'Plaster & Architectural Finishes',
  csiCode: 'CSI 09 20 00',
  boroughs: ['Brooklyn', 'Manhattan'],
  dobLicense: '',
  coiVerified: true,
  coopExperience: true,
};

export function TradesmanForm() {
  const [step, setStep] = useState<number>(1);
  const [formData, setFormData] = useState<ContractorFormState>(INITIAL_FORM);
  const [isCompleted, setIsCompleted] = useState<boolean>(false);

  const updateField = (field: keyof ContractorFormState, value: unknown) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleNext = (e: React.FormEvent) => {
    e.preventDefault();
    if (step === 1) {
      trackEvent('application_started', { company: formData.companyName });
      setStep(2);
    } else if (step === 2) {
      setStep(3);
    } else {
      trackEvent('profile_completed', {
        trade: formData.trade,
        csiCode: formData.csiCode,
        boroughs: formData.boroughs,
      });
      trackEvent('verification_started', {
        license: formData.dobLicense,
        coi: formData.coiVerified,
      });
      trackEvent('opportunity_viewed', { matchedProject: 'PRJ-7102-BK' });
      setIsCompleted(true);
    }
  };

  if (isCompleted) {
    return (
      <div className="space-y-6 font-mono text-xs">
        <div className="flex items-center justify-between pb-4 border-b border-gray-200">
          <div className="flex items-center gap-2 text-emerald-800 bg-emerald-50 border border-emerald-200 px-2.5 py-1">
            <span>●</span>
            <span className="font-semibold uppercase">TRADE CREDENTIALS LOGGED</span>
          </div>
          <span className="text-gray-400">[MATCH ENGINE ACTIVE]</span>
        </div>

        <div className="space-y-2">
          <h3 className="text-2xl font-serif text-black">
            Welcome, {formData.companyName || 'Master Tradesman'}.
          </h3>
          <p className="font-sans text-xs text-gray-600 leading-relaxed">
            Your profile has been indexed into the Socio Match Engine. We matched your trade classification ({formData.csiCode}) against 1 active, funded opportunity ready for bid review.
          </p>
        </div>

        {/* Matched Opportunity Card */}
        <div className="p-6 bg-[#FAFAFA] border border-black space-y-4 shadow-sm">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-3 border-b border-gray-200 gap-2">
            <div>
              <span className="font-bold text-black uppercase text-sm block">
                PROJECT #PRJ-7102-BK
              </span>
              <span className="text-[11px] text-gray-500 font-sans">
                172 Union St · Carroll Gardens Pre-war Co-op
              </span>
            </div>
            <span className="bg-emerald-100 text-emerald-900 border border-emerald-300 px-2 py-0.5 font-bold text-[10px] uppercase w-fit">
              94% TRADE FIT MATCH
            </span>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-[11px]">
            <div>
              <span className="text-gray-400 block text-[9px] uppercase">BUDGET BASELINE</span>
              <span className="font-bold text-black">$85K – $105K</span>
            </div>
            <div>
              <span className="text-gray-400 block text-[9px] uppercase">SCOPE SPEC</span>
              <span className="font-bold text-black">42 Line Items</span>
            </div>
            <div>
              <span className="text-gray-400 block text-[9px] uppercase">CAPITAL STATUS</span>
              <span className="font-bold text-emerald-700">RAIL VERIFIED</span>
            </div>
            <div>
              <span className="text-gray-400 block text-[9px] uppercase">TARGET TIMELINE</span>
              <span className="font-bold text-black">6 Weeks</span>
            </div>
          </div>

          <div className="p-3 bg-white border border-gray-200 text-[11px] font-sans text-gray-600">
            <span className="font-mono text-black font-semibold uppercase block mb-1">
              REQUIRED TRADE CLASSIFICATION:
            </span>
            Level 5 skim coat plaster restoration, custom white oak millwork cabinetry, and managing agent compliance rider adherence.
          </div>

          <Link
            href="/project/PRJ-7102-BK"
            className="w-full bg-black text-white font-mono text-xs uppercase tracking-wider py-3.5 px-6 hover:bg-gray-800 transition-colors flex items-center justify-between"
          >
            <span>INSPECT OPPORTUNITY &amp; SUBMIT BID</span>
            <span>→</span>
          </Link>
        </div>

        <div className="pt-2 flex items-center justify-between text-[11px] text-gray-400">
          <span>CO-OP BOARD ALTERATION DOSSIER PRE-ASSEMBLED</span>
          <span className="font-semibold text-black">ZERO RACE-TO-THE-BOTTOM FEES</span>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8 font-mono text-xs">
      {/* Header & Steps */}
      <div className="pb-4 border-b border-gray-200 flex items-center justify-between">
        <div>
          <span className="font-bold text-black uppercase tracking-wider block">
            CONTRACTOR ONBOARDING &amp; TRADE FIT
          </span>
          <span className="text-gray-400 text-[10px]">
            PHASE {step} OF 3 · {step === 1 ? 'CREDENTIALS' : step === 2 ? 'CLASSIFICATION' : 'COMPLIANCE'}
          </span>
        </div>
        <div className="flex gap-1.5">
          {[1, 2, 3].map((s) => (
            <span
              key={s}
              className={`w-5 h-1.5 ${s <= step ? 'bg-black' : 'bg-gray-200'}`}
            />
          ))}
        </div>
      </div>

      <form onSubmit={handleNext} className="space-y-6">
        {step === 1 && (
          <div className="space-y-4">
            <div>
              <label className="block text-gray-500 uppercase tracking-wide mb-1 text-[11px]">
                Company / Business Name *
              </label>
              <input
                type="text"
                required
                value={formData.companyName}
                onChange={(e) => updateField('companyName', e.target.value)}
                placeholder="e.g. Apex Craft Construction LLC"
                className="w-full bg-transparent border-b border-gray-300 py-2.5 text-sm text-black font-sans focus:outline-none focus:border-black transition-colors"
              />
            </div>

            <div>
              <label className="block text-gray-500 uppercase tracking-wide mb-1 text-[11px]">
                Principal / Master Craftsman Name *
              </label>
              <input
                type="text"
                required
                value={formData.principalName}
                onChange={(e) => updateField('principalName', e.target.value)}
                placeholder="e.g. Michael Vance"
                className="w-full bg-transparent border-b border-gray-300 py-2.5 text-sm text-black font-sans focus:outline-none focus:border-black transition-colors"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-gray-500 uppercase tracking-wide mb-1 text-[11px]">
                  Email Address *
                </label>
                <input
                  type="email"
                  required
                  value={formData.email}
                  onChange={(e) => updateField('email', e.target.value)}
                  placeholder="name@company.nyc"
                  className="w-full bg-transparent border-b border-gray-300 py-2.5 text-sm text-black font-sans focus:outline-none focus:border-black transition-colors"
                />
              </div>

              <div>
                <label className="block text-gray-500 uppercase tracking-wide mb-1 text-[11px]">
                  Mobile / WhatsApp Phone *
                </label>
                <input
                  type="tel"
                  required
                  value={formData.phone}
                  onChange={(e) => updateField('phone', e.target.value)}
                  placeholder="(646) 555-0192"
                  className="w-full bg-transparent border-b border-gray-300 py-2.5 text-sm text-black font-sans focus:outline-none focus:border-black transition-colors"
                />
              </div>
            </div>
          </div>
        )}

        {step === 2 && (
          <div className="space-y-5">
            <div>
              <label className="block text-gray-500 uppercase tracking-wide mb-1 text-[11px]">
                Primary CSI Trade Classification *
              </label>
              <select
                value={formData.csiCode}
                onChange={(e) => {
                  const val = e.target.value;
                  const tradeName =
                    val === 'CSI 09 20 00'
                      ? 'Plaster & Architectural Finishes'
                      : val === 'CSI 06 20 00'
                      ? 'Finish Carpentry & Architectural Millwork'
                      : val === 'CSI 09 30 00'
                      ? 'Tiling & Stone Substrates'
                      : val === 'CSI 22 00 00'
                      ? 'Plumbing & Mechanical Rough-in'
                      : 'Residential General Contracting';
                  updateField('csiCode', val);
                  updateField('trade', tradeName);
                }}
                className="w-full bg-[#FAFAFA] border border-gray-300 p-3 text-sm text-black font-sans focus:outline-none focus:border-black"
              >
                <option value="CSI 09 20 00">CSI 09 20 00 · Plaster, Drywall &amp; Finishes</option>
                <option value="CSI 06 20 00">CSI 06 20 00 · Millwork &amp; Finish Carpentry</option>
                <option value="CSI 09 30 00">CSI 09 30 00 · Tile &amp; Stone Waterproofing</option>
                <option value="CSI 22 00 00">CSI 22 00 00 · Licensed Plumbing &amp; MEP</option>
                <option value="CSI 01 00 00">CSI 01 00 00 · Full-Service General Construction</option>
              </select>
            </div>

            <div>
              <label className="block text-gray-500 uppercase tracking-wide mb-2 text-[11px]">
                Borough Coverage (Select All Applicable)
              </label>
              <div className="grid grid-cols-3 gap-2">
                {['Brooklyn', 'Manhattan', 'Queens'].map((b) => {
                  const checked = formData.boroughs.includes(b);
                  return (
                    <button
                      type="button"
                      key={b}
                      onClick={() => {
                        if (checked) {
                          updateField('boroughs', formData.boroughs.filter((x) => x !== b));
                        } else {
                          updateField('boroughs', [...formData.boroughs, b]);
                        }
                      }}
                      className={`p-2.5 text-center border font-mono text-[11px] uppercase transition-colors ${
                        checked ? 'border-black bg-black text-white font-bold' : 'border-gray-200 bg-gray-50 text-gray-600'
                      }`}
                    >
                      {b} {checked && '✓'}
                    </button>
                  );
                })}
              </div>
            </div>
          </div>
        )}

        {step === 3 && (
          <div className="space-y-4">
            <div>
              <label className="block text-gray-500 uppercase tracking-wide mb-1 text-[11px]">
                NYC DOB / DCA License Number *
              </label>
              <input
                type="text"
                required
                value={formData.dobLicense}
                onChange={(e) => updateField('dobLicense', e.target.value)}
                placeholder="e.g. NYC DOB #619842 or DCA #2081944"
                className="w-full bg-transparent border-b border-gray-300 py-2.5 text-sm text-black font-sans focus:outline-none focus:border-black transition-colors"
              />
            </div>

            <div className="p-4 bg-[#FAFAFA] border border-gray-200 space-y-3">
              <label className="flex items-start gap-3 cursor-pointer">
                <input
                  type="checkbox"
                  checked={formData.coiVerified}
                  onChange={(e) => updateField('coiVerified', e.target.checked)}
                  className="mt-1 w-4 h-4 rounded-none text-black focus:ring-0"
                />
                <span className="font-sans text-xs text-gray-600">
                  <strong className="text-black block font-mono text-[11px]">ACORD 25 COI Standing:</strong>
                  Active Commercial General Liability ($1M / $2M aggregate) and NY Workers Comp (C-105.2) can be issued naming buildings as additional insured.
                </span>
              </label>

              <label className="flex items-start gap-3 cursor-pointer pt-2 border-t border-gray-200">
                <input
                  type="checkbox"
                  checked={formData.coopExperience}
                  onChange={(e) => updateField('coopExperience', e.target.checked)}
                  className="mt-1 w-4 h-4 rounded-none text-black focus:ring-0"
                />
                <span className="font-sans text-xs text-gray-600">
                  <strong className="text-black block font-mono text-[11px]">NYC Co-op / Condo Alteration Experience:</strong>
                  Familiar with managing agent alteration riders, Masonite floor protection, freight elevator reservations, and 9:00 AM – 4:30 PM quiet hours.
                </span>
              </label>
            </div>
          </div>
        )}

        <div className="pt-4 flex items-center justify-between gap-4">
          {step > 1 ? (
            <button
              type="button"
              onClick={() => setStep(step - 1)}
              className="px-4 py-3 font-mono text-xs uppercase border border-gray-300 text-gray-600 hover:text-black hover:border-black transition-colors"
            >
              ← PREVIOUS
            </button>
          ) : (
            <span />
          )}

          <button
            type="submit"
            className="px-6 py-3.5 bg-black text-white font-mono text-xs uppercase tracking-wider hover:bg-gray-800 transition-colors flex items-center gap-2"
          >
            <span>{step === 3 ? 'COMPLETE & VIEW MATCHED PROJECTS' : 'CONTINUE'}</span>
            <span>→</span>
          </button>
        </div>
      </form>
    </div>
  );
}

export default TradesmanForm;
