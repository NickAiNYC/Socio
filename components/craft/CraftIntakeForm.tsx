"use client";

import { useState } from "react";

type FormData = {
  propertyType: string;
  neighborhood: string;
  trade: string;
  scope: string;
  schedule: string;
  budget: string;
  photos: File[];
  name: string;
  email: string;
  phone: string;
  walkthroughWindow: string;
};

const INITIAL_DATA: FormData = {
  propertyType: "",
  neighborhood: "",
  trade: "",
  scope: "",
  schedule: "",
  budget: "",
  photos: [],
  name: "",
  email: "",
  phone: "",
  walkthroughWindow: "",
};

export default function CraftIntakeForm() {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState<FormData>(INITIAL_DATA);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const updateFields = (fields: Partial<FormData>) => {
    setFormData((prev) => ({ ...prev, ...fields }));
  };

  const nextStep = () => setStep((s) => Math.min(s + 1, 4));
  const prevStep = () => setStep((s) => Math.max(s - 1, 1));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (step < 4) {
      nextStep();
      return;
    }

    setIsSubmitting(true);
    // Placeholder for actual webhook/Airtable API handler
    try {
      const response = await fetch('/api/intake', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...formData, type: 'homeowner_estimate' })
      });
      
      if (!response.ok) throw new Error('Network response was not ok');
      
      alert("Submission successful. A master craftsman will contact you shortly.");
      setFormData(INITIAL_DATA);
      setStep(1);
    } catch {
      alert("Something went wrong. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="w-full max-w-3xl mx-auto bg-surface border border-hairline rounded-xl shadow-sm overflow-hidden">
      <div className="bg-canvas px-8 py-6 border-b border-hairline">
        <div className="flex items-center justify-between text-sm font-medium text-ink-soft mb-4">
          <span>Step {step} of 4</span>
          <span>
            {step === 1 && "Property Details"}
            {step === 2 && "Scope & Trade"}
            {step === 3 && "Timeline & Budget"}
            {step === 4 && "Contact & Walkthrough"}
          </span>
        </div>
        <div className="w-full bg-hairline rounded-full h-1.5">
          <div
            className="bg-accent text-accent-ink h-1.5 rounded-full transition-all duration-300"
            style={{ width: `${(step / 4) * 100}%` }}
          ></div>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="p-8">
        {step === 1 && (
          <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div>
              <label className="block text-sm font-semibold text-ink mb-2">Property Type</label>
              <select
                required
                className="w-full rounded-md border border-hairline-strong px-4 py-3 text-ink focus:border-neutral-900 focus:outline-none focus:ring-1 focus:ring-neutral-900 bg-surface"
                value={formData.propertyType}
                onChange={(e) => updateFields({ propertyType: e.target.value })}
              >
                <option value="" disabled>Select a property type...</option>
                <option value="Brownstone">Brownstone / Townhouse</option>
                <option value="Pre-war Co-op">Pre-war Co-op</option>
                <option value="Post-war Condo">Post-war Condo</option>
                <option value="Commercial Space">Commercial Space</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-semibold text-ink mb-2">Neighborhood</label>
              <select
                required
                className="w-full rounded-md border border-hairline-strong px-4 py-3 text-ink focus:border-neutral-900 focus:outline-none focus:ring-1 focus:ring-neutral-900 bg-surface"
                value={formData.neighborhood}
                onChange={(e) => updateFields({ neighborhood: e.target.value })}
              >
                <option value="" disabled>Select neighborhood...</option>
                <option value="Park Slope">Park Slope</option>
                <option value="Brooklyn Heights">Brooklyn Heights</option>
                <option value="Carroll Gardens">Carroll Gardens</option>
                <option value="Crown Heights">Crown Heights</option>
                <option value="Williamsburg">Williamsburg</option>
                <option value="Other">Other (Brooklyn)</option>
              </select>
            </div>
          </div>
        )}

        {step === 2 && (
          <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div>
              <label className="block text-sm font-semibold text-ink mb-2">Primary Trade Needed</label>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {["Plaster & Skim-Coating", "Architectural Painting", "Custom Tile & Masonry", "Architectural Millwork"].map((trade) => (
                  <label
                    key={trade}
                    className={`cursor-pointer flex items-center justify-between p-4 border rounded-lg transition-colors ${
                      formData.trade === trade ? "border-neutral-900 bg-canvas" : "border-hairline hover:border-hairline-strong"
                    }`}
                  >
                    <span className="text-sm font-medium text-ink">{trade}</span>
                    <input
                      type="radio"
                      name="trade"
                      value={trade}
                      checked={formData.trade === trade}
                      onChange={(e) => updateFields({ trade: e.target.value })}
                      className="hidden"
                      required
                    />
                  </label>
                ))}
              </div>
            </div>
            <div>
              <label className="block text-sm font-semibold text-ink mb-2">Project Scope</label>
              <p className="text-xs text-ink-soft mb-3">Include room dimensions, wall condition, and any specific requirements.</p>
              <textarea
                required
                rows={4}
                className="w-full rounded-md border border-hairline-strong px-4 py-3 text-ink focus:border-neutral-900 focus:outline-none focus:ring-1 focus:ring-neutral-900 bg-surface"
                placeholder="e.g., Living room is 20x15. Current plaster is cracking near the ceiling cornice..."
                value={formData.scope}
                onChange={(e) => updateFields({ scope: e.target.value })}
              />
            </div>
          </div>
        )}

        {step === 3 && (
          <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div>
              <label className="block text-sm font-semibold text-ink mb-2">Desired Schedule</label>
              <select
                required
                className="w-full rounded-md border border-hairline-strong px-4 py-3 text-ink focus:border-neutral-900 focus:outline-none focus:ring-1 focus:ring-neutral-900 bg-surface"
                value={formData.schedule}
                onChange={(e) => updateFields({ schedule: e.target.value })}
              >
                <option value="" disabled>When should work begin?</option>
                <option value="ASAP">As soon as possible</option>
                <option value="1-2 Months">1-2 Months</option>
                <option value="3+ Months">3+ Months / Exploring Options</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-semibold text-ink mb-2">Budget Bracket</label>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                {["$3k–$5k", "$5k–$10k", "$10k–$25k+"].map((bracket) => (
                  <label
                    key={bracket}
                    className={`cursor-pointer flex items-center justify-center text-center p-4 border rounded-lg transition-colors ${
                      formData.budget === bracket ? "border-neutral-900 bg-canvas" : "border-hairline hover:border-hairline-strong"
                    }`}
                  >
                    <span className="text-sm font-medium text-ink">{bracket}</span>
                    <input
                      type="radio"
                      name="budget"
                      value={bracket}
                      checked={formData.budget === bracket}
                      onChange={(e) => updateFields({ budget: e.target.value })}
                      className="hidden"
                      required
                    />
                  </label>
                ))}
              </div>
            </div>
            <div>
              <label className="block text-sm font-semibold text-ink mb-2">Photos (Optional but recommended)</label>
              <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-hairline-strong border-dashed rounded-md bg-canvas hover:bg-canvas transition-colors cursor-pointer">
                <div className="space-y-1 text-center">
                  <div className="flex text-sm text-ink-soft justify-center">
                    <label className="relative cursor-pointer rounded-md font-medium text-ink hover:text-neutral-700">
                      <span>Upload files</span>
                      <input type="file" className="sr-only" multiple accept="image/*" />
                    </label>
                    <p className="pl-1">or drag and drop</p>
                  </div>
                  <p className="text-xs text-ink-soft">PNG, JPG, GIF up to 10MB</p>
                </div>
              </div>
            </div>
          </div>
        )}

        {step === 4 && (
          <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div>
              <label className="block text-sm font-semibold text-ink mb-2">Full Name</label>
              <input
                required
                type="text"
                className="w-full rounded-md border border-hairline-strong px-4 py-3 text-ink focus:border-neutral-900 focus:outline-none focus:ring-1 focus:ring-neutral-900 bg-surface"
                value={formData.name}
                onChange={(e) => updateFields({ name: e.target.value })}
              />
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-semibold text-ink mb-2">Email</label>
                <input
                  required
                  type="email"
                  className="w-full rounded-md border border-hairline-strong px-4 py-3 text-ink focus:border-neutral-900 focus:outline-none focus:ring-1 focus:ring-neutral-900 bg-surface"
                  value={formData.email}
                  onChange={(e) => updateFields({ email: e.target.value })}
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-ink mb-2">Phone</label>
                <input
                  required
                  type="tel"
                  className="w-full rounded-md border border-hairline-strong px-4 py-3 text-ink focus:border-neutral-900 focus:outline-none focus:ring-1 focus:ring-neutral-900 bg-surface"
                  value={formData.phone}
                  onChange={(e) => updateFields({ phone: e.target.value })}
                />
              </div>
            </div>
            <div>
              <label className="block text-sm font-semibold text-ink mb-2">Preferred Walkthrough Window</label>
              <input
                required
                type="text"
                placeholder="e.g., Weekday mornings, or Saturday afternoons"
                className="w-full rounded-md border border-hairline-strong px-4 py-3 text-ink focus:border-neutral-900 focus:outline-none focus:ring-1 focus:ring-neutral-900 bg-surface"
                value={formData.walkthroughWindow}
                onChange={(e) => updateFields({ walkthroughWindow: e.target.value })}
              />
            </div>
          </div>
        )}

        <div className="mt-8 flex justify-between items-center border-t border-hairline pt-6">
          {step > 1 ? (
            <button
              type="button"
              onClick={prevStep}
              className="px-6 py-3 text-sm font-medium text-ink-soft hover:text-ink transition-colors"
            >
              Back
            </button>
          ) : (
            <div></div>
          )}
          
          <button
            type="submit"
            disabled={isSubmitting}
            className="px-8 py-3 text-sm font-medium text-white bg-accent text-accent-ink rounded-md hover:opacity-90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {step === 4 ? (isSubmitting ? "Submitting..." : "Submit Request") : "Continue"}
          </button>
        </div>
      </form>
    </div>
  );
}
