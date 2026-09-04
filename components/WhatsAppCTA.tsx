'use client';

import { MessageCircle } from 'lucide-react';

interface WhatsAppCTAProps {
  label?: string;
  className?: string;
  message?: string;
}

export function WhatsAppCTA({
  label = 'Habla con nuestro desk de operaciones por WhatsApp',
  className = '',
  message = 'Hola Socio, quiero hablar con el desk de operaciones para unirme a la red de maestros.',
}: WhatsAppCTAProps) {
  const phone = '16467504650';
  const url = `https://wa.me/${phone}?text=${encodeURIComponent(message)}`;

  return (
    <a
      href={url}
      target="_blank"
      rel="noopener noreferrer"
      className={`inline-flex items-center justify-center gap-3 bg-[#171717] hover:bg-black text-white font-sans font-medium text-sm md:text-base py-4 px-6 border border-black transition-all shadow-sm group ${className}`}
    >
      <MessageCircle className="w-5 h-5 text-emerald-400 group-hover:scale-110 transition-transform" />
      <span>{label}</span>
      <span className="font-mono text-xs text-gray-400 group-hover:translate-x-0.5 transition-transform">
        →
      </span>
    </a>
  );
}

export function FloatingWhatsAppButton() {
  const phone = '16467504650';
  const message = 'Hola Socio, quiero consultar sobre proyectos y unirme a la red de maestros en Brooklyn.';
  const url = `https://wa.me/${phone}?text=${encodeURIComponent(message)}`;

  return (
    <div className="fixed bottom-6 right-6 z-40">
      <a
        href={url}
        target="_blank"
        rel="noopener noreferrer"
        aria-label="Habla por WhatsApp con Socio"
        className="flex items-center gap-3 bg-white hover:bg-zinc-50 text-black border border-gray-300 shadow-md hover:shadow-lg px-4 py-3 transition-all group"
      >
        <div className="relative flex items-center justify-center">
          <MessageCircle className="w-5 h-5 text-emerald-600" />
          <span className="absolute -top-1 -right-1 w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
        </div>
        <div className="flex flex-col text-left">
          <span className="font-mono text-[10px] uppercase tracking-wider text-gray-400">
            Desk Directo
          </span>
          <span className="font-sans text-xs font-semibold text-black group-hover:underline">
            WhatsApp
          </span>
        </div>
      </a>
    </div>
  );
}

export default WhatsAppCTA;
