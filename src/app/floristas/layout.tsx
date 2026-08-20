import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Socio para Floristerías NYC | Ventas y Pedidos por WhatsApp',
  description: 'Socio ayuda a floristerías de NYC a recuperar oportunidades, cerrar pedidos por WhatsApp y conciliar comisiones con POS o pagos acreditados.',
  alternates: { canonical: 'https://socio.nyc/floristas' },
  openGraph: {
    title: 'Socio para Floristerías NYC',
    description: 'Crecimiento basado en resultados para floristerías de NYC.',
    url: 'https://socio.nyc/floristas',
    siteName: 'Socio NYC',
    locale: 'es_US',
    type: 'website',
  },
};

export default function FloristasLayout({ children }: { children: React.ReactNode }) {
  return children;
}
