import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Casos de Éxito de Contratistas en NYC | Socio',
  description: 'Ejemplos y metodología de verificación para oportunidades y crecimiento de contratistas de NYC.',
  alternates: { canonical: 'https://socio.nyc/contratistas/casos-de-exito' },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
