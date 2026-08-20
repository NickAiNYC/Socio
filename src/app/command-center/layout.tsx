import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Socio Command Center',
  robots: {
    index: false,
    follow: false,
    nocache: true,
  },
};

export default function CommandCenterLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
