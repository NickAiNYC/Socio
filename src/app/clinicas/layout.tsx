import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Socio para Clínicas NYC | Reactivación y Anti-No-Show',
  description: 'Socio ayuda a clínicas estéticas, dentales y medspas de NYC a reactivar pacientes y llenar cancelaciones con un modelo basado en resultados.',
  alternates: { canonical: 'https://socio.nyc/clinicas' },
  openGraph: {
    title: 'Socio para Clínicas NYC',
    description: 'Reactivación de pacientes y recuperación de citas con un modelo basado en resultados.',
    url: 'https://socio.nyc/clinicas',
    siteName: 'Socio NYC',
    locale: 'es_US',
    type: 'website',
  },
};

export default function ClinicasLayout({ children }: { children: React.ReactNode }) {
  return children;
}
