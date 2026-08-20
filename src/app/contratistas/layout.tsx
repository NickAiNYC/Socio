import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Socio para Contratistas | Adquisición de Contratos NYC',
  description: 'Sistema de adquisición y gestión de prospectos de construcción y remodelación en NYC. Conectado a permisos DOB y depósitos de QuickBooks. Cero pagos por adelantado.',
  openGraph: {
    title: 'Socio para Contratistas | Más Contratos en NYC',
    description: 'Adquisición de proyectos de remodelación y construcción. Conectado a WhatsApp y QuickBooks.',
    url: 'https://socio.nyc/contratistas',
    siteName: 'Socio Contratistas NYC',
    locale: 'es_US',
    type: 'website',
  },
  alternates: {
    canonical: 'https://socio.nyc/contratistas',
    languages: {
      'es-US': 'https://socio.nyc/contratistas',
      'en-US': 'https://socio.nyc/contractors',
    },
  },
};

export default function ContratistasLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <div className="contratistas-scope">{children}</div>;
}
