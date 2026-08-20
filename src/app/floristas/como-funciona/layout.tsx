import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Cómo Funciona Socio para Floristas NYC',
  description: 'Cómo Socio identifica oportunidades, recupera pedidos y concilia ingresos para floristerías de NYC.',
  alternates: { canonical: 'https://socio.nyc/floristas/como-funciona' },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
