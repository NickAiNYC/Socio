import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Radar de Permisos DOB NYC | Socio para Contratistas',
  description: 'Explora cómo Socio usa señales de permisos DOB para identificar oportunidades relevantes para contratistas de NYC.',
  alternates: { canonical: 'https://socio.nyc/contratistas/radar-de-permisos' },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
