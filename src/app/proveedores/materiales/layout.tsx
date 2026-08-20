import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Alianza para Proveedores de Materiales NYC | Socio',
  description: 'Programa de referidos de Socio para proveedores de materiales y madereras de NYC.',
  alternates: { canonical: 'https://socio.nyc/proveedores/materiales' },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
