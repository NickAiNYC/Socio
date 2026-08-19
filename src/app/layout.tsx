import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'Socio — Performance-Based Growth Partnership for NYC Local Merchants',
  description: "Socio is NYC's AI-powered growth partner for local merchants and contractors. Zero upfront fees. We only get paid when you grow.",
  metadataBase: new URL('https://socio-one.vercel.app'),
  openGraph: {
    title: "Socio — We Don't Get Paid Until You Do",
    description: "Performance-based growth engine for NYC businesses. Verified by POS and QuickBooks cleared deposits.",
    url: 'https://socio-one.vercel.app',
    siteName: 'Socio NYC',
    locale: 'en_US',
    type: 'website',
  },
  icons: {
    icon: '/assets/favicon.svg',
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
      </head>
      <body className="min-h-screen bg-slate-950 text-slate-100 antialiased font-sans">
        {children}
      </body>
    </html>
  );
}
