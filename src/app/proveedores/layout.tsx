import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Socio para Proveedores NYC | Referidos de Construcción',
  description: 'Alianzas de referidos de Socio para ferreterías, equipos y proveedores de materiales de NYC.',
  alternates: { canonical: 'https://socio.nyc/proveedores' },
};

export default function ProveedoresLayout({ children }: { children: React.ReactNode }) {
  return children;
}
