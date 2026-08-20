import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Cómo Funciona | Socio para Contratistas NYC',
  description: 'Cómo funciona el sistema de oportunidades, seguimiento y verificación de ingresos de Socio para contratistas de NYC.',
  alternates: { canonical: 'https://socio.nyc/contratistas/como-funciona' },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
