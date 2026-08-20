import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Alianza para Renta de Maquinaria y Equipos NYC | Socio',
  description: 'Programa de alianzas de Socio para renta de maquinaria y equipos de construcción en NYC.',
  alternates: { canonical: 'https://socio.nyc/proveedores/equipos' },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
