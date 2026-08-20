import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Socio para Restaurantes NYC | Catering y Eventos',
  description: 'Socio ayuda a restaurantes de NYC a recuperar oportunidades de catering y eventos privados con un modelo basado en resultados.',
  alternates: { canonical: 'https://socio.nyc/restaurantes' },
  openGraph: {
    title: 'Socio para Restaurantes NYC',
    description: 'Más catering y eventos privados con un modelo basado en resultados.',
    url: 'https://socio.nyc/restaurantes',
    siteName: 'Socio NYC',
    locale: 'es_US',
    type: 'website',
  },
};

export default function RestaurantesLayout({ children }: { children: React.ReactNode }) {
  return children;
}
