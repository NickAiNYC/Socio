import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Alianza para Ferreterías de NYC | Socio',
  description: 'Programa de referidos de Socio para ferreterías y negocios de suministros de construcción en NYC.',
  alternates: { canonical: 'https://socio.nyc/proveedores/ferreterias' },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
