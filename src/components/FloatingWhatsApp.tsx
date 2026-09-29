import React from 'react';
import { MessageCircle } from 'lucide-react';
import { getGenericWhatsAppLink } from '../types';

export const FloatingWhatsApp: React.FC = () => {
  return (
    <a
      href={getGenericWhatsAppLink()}
      target="_blank"
      rel="noopener noreferrer"
      aria-label="Chat with Mr. J Collections on WhatsApp"
      className="fixed bottom-5 right-5 z-40 inline-flex items-center gap-2.5 px-4 py-3 bg-[#0A0A0A] hover:bg-[#C5A059] text-[#F6F5F0] hover:text-[#0A0A0A] border border-[#0A0A0A] text-xs font-bold tracking-wider rounded-none shadow-lg transition-transform duration-150 hover:-translate-y-0.5 focus-visible:outline-2 focus-visible:outline-[#0A0A0A]"
    >
      <MessageCircle className="w-5 h-5 text-[#C5A059] group-hover:text-[#0A0A0A] shrink-0" />
      <span className="hidden sm:inline whitespace-nowrap">"CHAT ON WHATSAPP"</span>
    </a>
  );
};
