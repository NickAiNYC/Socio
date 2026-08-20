import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Radar Floral NYC | Socio para Floristerías',
  description: 'Señales de oportunidades para hoteles, restaurantes, eventos y clientes de floristerías en NYC.',
  alternates: { canonical: 'https://socio.nyc/floristas/radar-floral' },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
