import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Socio for Contractors | Performance-Based Contract Acquisition in NYC',
  description:
    'Socio helps NYC remodeling and construction contractors recover and verify qualified opportunities. No upfront payment; commission is tied to verified revenue.',
  alternates: {
    canonical: 'https://socio.nyc/contractors',
    languages: {
      'en-US': 'https://socio.nyc/contractors',
      'es-US': 'https://socio.nyc/contratistas',
    },
  },
  openGraph: {
    title: 'Socio for Contractors | More Qualified NYC Projects',
    description:
      'Performance-based contract acquisition for NYC contractors, with DOB permit signals and cleared-deposit verification.',
    url: 'https://socio.nyc/contractors',
    siteName: 'Socio NYC',
    locale: 'en_US',
    type: 'website',
  },
};

const faq = [
  {
    q: 'When does Socio get paid?',
    a: 'Socio is designed around verified revenue: the commission is tied to money that has actually been received and cleared in the contractor’s verified business account.',
  },
  {
    q: 'What signals can Socio use to find opportunities?',
    a: 'The contractor workflow can use qualified opportunity signals such as NYC DOB permit activity, dormant estimates, and inbound or missed-call follow-up.',
  },
  {
    q: 'How is a Socio opportunity verified?',
    a: 'The verification workflow is based on an auditable evidence trail, including customer/contact matching and cleared-deposit evidence where available.',
  },
  {
    q: 'Is there an upfront retainer?',
    a: 'The contractor offer is positioned as performance-based rather than a traditional upfront retainer. The agreement governs the applicable commission and verification rules.',
  },
];

export default function ContractorsPage() {
  const schema = {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'ProfessionalService',
        name: 'Socio for Contractors',
        url: 'https://socio.nyc/contractors',
        areaServed: { '@type': 'City', name: 'New York City' },
        parentOrganization: { '@id': 'https://socio.nyc/#organization' },
      },
      {
        '@type': 'FAQPage',
        mainEntity: faq.map((item) => ({
          '@type': 'Question',
          name: item.q,
          acceptedAnswer: { '@type': 'Answer', text: item.a },
        })),
      },
    ],
  };

  return (
    <main className="min-h-screen bg-slate-950 text-white">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
      />

      <section className="relative overflow-hidden border-b border-slate-800">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_75%_20%,rgba(102,155,210,.22),transparent_30%),radial-gradient(circle_at_20%_80%,rgba(52,211,153,.14),transparent_28%)]" />
        <div className="relative mx-auto max-w-7xl px-6 py-20 lg:py-28">
          <div className="max-w-3xl">
            <div className="mb-6 inline-flex rounded-full border border-slate-700 bg-slate-900/80 px-4 py-2 font-mono text-xs font-bold uppercase tracking-[.14em] text-slate-300">
              NYC CONTRACTORS · PERFORMANCE-BASED
            </div>
            <h1 className="text-4xl font-black tracking-tight sm:text-6xl">
              Find better construction opportunities.
              <span className="block bg-gradient-to-r from-[#669bd2] to-[#34d399] bg-clip-text text-transparent">
                Pay for verified growth.
              </span>
            </h1>
            <p className="mt-6 max-w-2xl text-lg leading-8 text-slate-300">
              Socio combines opportunity signals, fast follow-up, and revenue verification for NYC remodeling and construction businesses. No invented leads, no vanity attribution—just a workflow built around qualified opportunities and cleared revenue.
            </p>
            <div className="mt-8 flex flex-wrap gap-4">
              <a
                href="https://wa.me/19175550199"
                target="_blank"
                rel="noopener noreferrer"
                className="rounded-xl bg-white px-6 py-3 font-black text-slate-950 shadow-xl transition hover:-translate-y-0.5"
              >
                Talk to Socio
              </a>
              <a
                href="#verification"
                className="rounded-xl border border-slate-700 bg-slate-900 px-6 py-3 font-bold text-white"
              >
                See how verification works
              </a>
            </div>
          </div>

          <div className="mt-14 grid gap-4 md:grid-cols-3">
            {[
              ['FIND', 'DOB permits', 'Opportunity signal'],
              ['CAPTURE', 'Estimate follow-up', 'Lead reactivated'],
              ['VERIFY', 'Cleared deposit', 'Revenue verified'],
            ].map(([label, value, status], i) => (
              <article
                key={label}
                className="rounded-3xl border border-slate-700 bg-slate-900/80 p-6 shadow-2xl backdrop-blur"
              >
                <div className="font-mono text-xs font-bold tracking-widest text-slate-500">
                  0{i + 1}
                </div>
                <div className="mt-5 text-xs font-black tracking-widest text-[#669bd2]">
                  {label}
                </div>
                <div className="mt-2 text-xl font-bold">{value}</div>
                <div className="mt-6 rounded-xl border border-slate-700 bg-slate-950 px-4 py-3 font-mono text-xs text-emerald-400">
                  ● {status}
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section id="verification" className="mx-auto max-w-7xl px-6 py-20">
        <div className="grid gap-8 lg:grid-cols-2">
          <div>
            <div className="font-mono text-xs font-bold tracking-widest text-[#34d399]">
              TRUST / VERIFICATION
            </div>
            <h2 className="mt-3 text-3xl font-black sm:text-4xl">
              The trust layer is the product.
            </h2>
            <p className="mt-5 max-w-xl leading-7 text-slate-400">
              Instead of claiming credit for every inquiry, the contractor workflow is designed around concrete evidence: DOB permit signals, a one-page agreement, and cleared-deposit verification where applicable.
            </p>
          </div>

          <div className="grid gap-4 sm:grid-cols-3">
            {[
              ['01', 'DOB PERMIT', 'Qualified project signal'],
              ['02', 'AGREEMENT', 'One-page operating terms'],
              ['03', 'DEPOSIT', 'Cleared revenue evidence'],
            ].map(([n, title, body]) => (
              <div key={n} className="rounded-2xl border border-slate-800 bg-slate-900 p-5">
                <div className="font-mono text-xs text-slate-500">{n}</div>
                <div className="mt-5 font-black text-[#669bd2]">{title}</div>
                <p className="mt-2 text-sm leading-6 text-slate-400">{body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="border-y border-slate-800 bg-slate-900/50">
        <div className="mx-auto max-w-7xl px-6 py-20">
          <div className="grid gap-6 md:grid-cols-3">
            <div className="rounded-3xl border border-slate-800 bg-slate-950 p-7">
              <div className="font-mono text-xs text-slate-500">MODEL</div>
              <div className="mt-3 text-3xl font-black">Performance-based</div>
              <p className="mt-3 text-sm leading-6 text-slate-400">
                The commercial model is tied to the agreed verification rules rather than an upfront marketing retainer.
              </p>
            </div>
            <div className="rounded-3xl border border-[#669bd2]/40 bg-gradient-to-br from-[#669bd2]/15 to-[#34d399]/10 p-7">
              <div className="font-mono text-xs text-[#34d399]">FOUNDING COHORT</div>
              <div className="mt-3 text-3xl font-black">5 slots</div>
              <p className="mt-3 text-sm leading-6 text-slate-300">
                The existing contractor offer includes a founding pilot structure. Confirm the current commercial terms in the agreement before signing.
              </p>
            </div>
            <div className="rounded-3xl border border-slate-800 bg-slate-950 p-7">
              <div className="font-mono text-xs text-slate-500">SCOPE</div>
              <div className="mt-3 text-3xl font-black">NYC</div>
              <p className="mt-3 text-sm leading-6 text-slate-400">
                Built around local remodeling and construction opportunity signals and contractor follow-up.
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-4xl px-6 py-20">
        <div className="font-mono text-xs font-bold tracking-widest text-[#669bd2]">
          FAQ
        </div>
        <h2 className="mt-3 text-3xl font-black">Questions contractors ask.</h2>
        <div className="mt-8 space-y-3">
          {faq.map((item) => (
            <details key={item.q} className="group rounded-2xl border border-slate-800 bg-slate-900 p-5">
              <summary className="cursor-pointer list-none font-bold">
                {item.q}
              </summary>
              <p className="mt-4 text-sm leading-7 text-slate-400">{item.a}</p>
            </details>
          ))}
        </div>
      </section>
    </main>
  );
}
