'use client';

import { motion } from 'framer-motion';
import { bentoContainer, bentoCard } from '@/components/Animations';

export function HyperlocalMoat() {
  const corridors = [
    { name: 'Park Slope', type: 'Historic Brownstones & Co-ops', active: '18 Active Crews' },
    { name: 'Carroll Gardens', type: 'Pre-War Multi-Family & Townhomes', active: '14 Active Crews' },
    { name: 'Cobble Hill', type: 'Landmarked Residential Rowhouses', active: '12 Active Crews' },
    { name: 'Brooklyn Heights', type: 'Pre-1900 Architectural Historic District', active: '16 Active Crews' },
    { name: 'Crown Heights', type: 'Limestone & Brownstone Renovations', active: '11 Active Crews' },
    { name: 'Williamsburg', type: 'Cast-Iron Lofts & Modern Condos', active: '15 Active Crews' },
    { name: 'Greenpoint', type: 'Frame Homes & Post-Industrial Lofts', active: '10 Active Crews' },
    { name: 'Astoria', type: 'Low-Rise Residential & Co-ops', active: '12 Active Crews' },
    { name: 'Long Island City', type: 'High-Rise Condominium Buildouts', active: '14 Active Crews' },
  ];

  const advantages = [
    {
      num: '01',
      title: 'Faster Site Visits',
      desc: 'Local tradesmen reach properties within hours—not weeks of delayed coordination across outer boroughs.',
    },
    {
      num: '02',
      title: 'Better Contractor Matching',
      desc: 'Tradesmen are matched to construction typologies they have completed hundreds of times before.',
    },
    {
      num: '03',
      title: 'Building-Specific Intelligence',
      desc: 'Pre-existing relationships with building supers, managing agents, and co-op alteration boards.',
    },
    {
      num: '04',
      title: 'Faster Mobilization',
      desc: 'Zero transit gridlock or bridge delays. Local material sourcing from established Brooklyn supply houses.',
    },
    {
      num: '05',
      title: 'Compounding Project Data',
      desc: 'High local density builds the definitive historical price and variance index for NYC residential construction.',
    },
  ];

  return (
    <section className="w-full bg-[#FAFAFA] py-32 px-6 border-b border-gray-200">
      <div className="max-w-7xl mx-auto">
        <div className="max-w-3xl mb-16">
          <p className="font-mono text-xs uppercase tracking-widest text-gray-400 mb-3">
            Section 06 · Geographic Density Moat
          </p>
          <h2 className="text-3xl md:text-5xl font-serif text-black leading-tight mb-6">
            Hyperlocal density is not a constraint. <br />
            It is the mechanism for control.
          </h2>
          <p className="font-sans text-gray-600 text-lg leading-relaxed">
            National lead directories claim city-wide or nationwide coverage, generating diluted matching and untraceable quality. Socio deliberately concentrates in high-density Brooklyn and Queens corridors to achieve operational density.
          </p>
        </div>

        {/* 9 Corridors Grid */}
        <motion.div
          variants={bentoContainer}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, margin: '-100px' }}
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-16"
        >
          {corridors.map((c, idx) => (
            <motion.div
              key={idx}
              variants={bentoCard}
              className="bg-white border border-gray-200 p-6 flex flex-col justify-between hover:border-black transition-colors"
            >
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="font-mono text-xs font-semibold text-black uppercase tracking-wider">
                    {c.name}
                  </span>
                  <span className="font-mono text-[10px] text-emerald-700 bg-emerald-50 border border-emerald-200 px-2 py-0.5">
                    ● {c.active}
                  </span>
                </div>
                <p className="font-sans text-xs text-gray-500">{c.type}</p>
              </div>
            </motion.div>
          ))}
        </motion.div>

        {/* 5 Operational Advantages */}
        <div className="border border-gray-200 bg-white p-8 md:p-12">
          <div className="pb-6 border-b border-gray-100 mb-8 flex items-center justify-between">
            <h3 className="text-xl font-serif text-black">
              Why Local Density Creates Superior Outcomes
            </h3>
            <span className="font-mono text-xs text-gray-400 uppercase tracking-widest">
              5 System Advantages
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8">
            {advantages.map((adv, idx) => (
              <div key={idx} className="flex flex-col">
                <span className="font-mono text-sm text-gray-400 mb-3">{adv.num}</span>
                <h4 className="font-serif text-lg text-black mb-2">{adv.title}</h4>
                <p className="font-sans text-xs text-gray-500 leading-relaxed">
                  {adv.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

export default HyperlocalMoat;
