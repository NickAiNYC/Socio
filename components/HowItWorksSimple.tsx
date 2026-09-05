'use client';

import { motion } from 'framer-motion';

export function HowItWorksSimple() {
  const steps = [
    {
      num: '01',
      action: 'DESCRIBE',
      title: 'Tell Socio what you’re planning',
      description: 'Share your property type, neighborhood, desired trade scope, timeline, and budget parameters through our simple intake.',
      artifact: 'Owner Request Captured',
    },
    {
      num: '02',
      action: 'STRUCTURE',
      title: 'Turn the idea into a defined project',
      description: 'Socio structures a CSI line-item scope, defines explicit inclusions and exclusions, and sets up a realistic baseline budget.',
      artifact: 'Project Record Instantiated',
    },
    {
      num: '03',
      action: 'MATCH',
      title: 'Connect with qualified contractors',
      description: 'The structured project is reviewed by 3–4 vetted local crews matched on trade fit, DOB permit history, and co-op experience.',
      artifact: 'Bids Compared Apple-to-Apple',
    },
    {
      num: '04',
      action: 'BUILD',
      title: 'Manage milestones, docs, and payment',
      description: 'Alteration agreement packages are cleared with your building. Project funds sit in escrow, released strictly post-inspection.',
      artifact: 'Inspection-Gated Escrow Rails',
    },
    {
      num: '05',
      action: 'RECORD',
      title: 'Capture the completed project and outcome',
      description: 'Statutory lien waivers and managing agent sign-offs are archived, recording actual cost and duration into the empirical benchmark.',
      artifact: 'Permanent Property Ledger',
    },
  ];

  return (
    <section id="how-it-works" className="w-full bg-white py-32 px-6 border-b border-gray-200">
      <div className="max-w-7xl mx-auto">
        {/* Section Header */}
        <div className="max-w-3xl mb-20">
          <p className="font-mono text-xs uppercase tracking-widest text-gray-400 mb-3">
            How It Works
          </p>
          <h2 className="text-4xl sm:text-5xl md:text-6xl font-serif text-black leading-tight mb-6">
            From idea to <br />
            completed project.
          </h2>
          <p className="font-sans text-gray-600 text-lg leading-relaxed">
            A simple five-step journey that replaces chaotic contractor bidding with an orderly, governed renovation process.
          </p>
        </div>

        {/* 5-Step Editorial Timeline */}
        <div className="border-t border-gray-200 divide-y divide-gray-200">
          {steps.map((step) => (
            <motion.div
              key={step.num}
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-40px' }}
              transition={{ duration: 0.5 }}
              className="py-10 grid grid-cols-1 md:grid-cols-12 gap-6 items-baseline"
            >
              <div className="md:col-span-2 font-mono text-xs text-gray-400 font-semibold">
                [{step.num}]
              </div>
              <div className="md:col-span-3">
                <span className="font-mono text-xs font-bold text-emerald-700 bg-emerald-50 border border-emerald-200 px-2 py-0.5 inline-block mb-2">
                  {step.action}
                </span>
                <h3 className="font-serif text-xl sm:text-2xl text-black">
                  {step.title}
                </h3>
              </div>
              <div className="md:col-span-5">
                <p className="font-sans text-sm sm:text-base text-gray-600 leading-relaxed">
                  {step.description}
                </p>
              </div>
              <div className="md:col-span-2 text-left md:text-right font-mono text-[11px] text-gray-400">
                <span>{step.artifact}</span>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

export default HowItWorksSimple;
