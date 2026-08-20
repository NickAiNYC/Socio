import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'Socio — Performance-Based Growth Partnership for NYC Local Merchants',
  description: "Socio is NYC's AI-powered growth partner for local merchants and contractors. Zero upfront fees. We only get paid when you grow.",
  metadataBase: new URL('https://socio.nyc'),
  openGraph: {
    title: "Socio — We Don't Get Paid Until You Do",
    description: "Performance-based growth engine for NYC businesses. Verified by POS and QuickBooks cleared deposits.",
    url: 'https://socio.nyc',
    siteName: 'Socio NYC',
    locale: 'en_US',
    type: 'website',
  },
  icons: {
    icon: '/assets/favicon.svg',
  },
  alternates: {
    canonical: 'https://socio.nyc',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800;900&family=JetBrains+Mono:wght@400;500;700;800&display=swap"
          rel="stylesheet"
        />

        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              '@context': 'https://schema.org',
              '@graph': [
                {
                  '@type': 'Organization',
                  '@id': 'https://socio.nyc/#organization',
                  name: 'Socio',
                  url: 'https://socio.nyc',
                  description: "Performance-based growth partnership for NYC local businesses."
                },
                {
                  '@type': 'ProfessionalService',
                  '@id': 'https://socio.nyc/#professional-service',
                  name: 'Socio NYC',
                  url: 'https://socio.nyc',
                  description: "Performance-based growth engine for NYC businesses, with revenue verification through POS and cleared deposits.",
                  areaServed: {
                    '@type': 'City',
                    name: 'New York City'
                  },
                  parentOrganization: {
                    '@id': 'https://socio.nyc/#organization'
                  }
                },
                {
                  '@type': 'WebSite',
                  '@id': 'https://socio.nyc/#website',
                  url: 'https://socio.nyc',
                  name: 'Socio NYC',
                  publisher: {
                    '@id': 'https://socio.nyc/#organization'
                  }
                }
              ]
            })
          }}
        />
      </head>
      <body className="min-h-screen bg-slate-950 text-slate-100 antialiased font-sans">
        {children}
      </body>
    </html>
  );
}
