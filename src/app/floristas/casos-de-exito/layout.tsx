import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Casos de Éxito de Floristerías NYC | Socio',
  description: 'Metodología y ejemplos de crecimiento basado en resultados para floristerías de NYC.',
  alternates: { canonical: 'https://socio.nyc/floristas/casos-de-exito' },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
