import React from 'react';
import { MessageCircle } from 'lucide-react';
import { StoreSettings } from '../types';
import { openWhatsApp } from '../utils/storeUtils';

interface FloatingWhatsAppProps {
  settings: StoreSettings;
}

export const FloatingWhatsApp: React.FC<FloatingWhatsAppProps> = ({ settings }) => {
  const handleClick = () => {
    openWhatsApp(settings.whatsapp, 'Olá, Pizzaria Mamma Roma! Gostaria de fazer um pedido.');
  };

  return (
    <button
      onClick={handleClick}
      id="floating-whatsapp-btn"
      title="Pedir no WhatsApp"
      className="hidden md:flex fixed bottom-6 right-6 z-40 p-4 rounded-full bg-[#168A45] hover:bg-[#199d4f] text-white shadow-2xl shadow-[#168A45]/50 border-2 border-white/20 items-center gap-2.5 group hover:scale-110 active:scale-95 transition-all cursor-pointer"
    >
      <MessageCircle className="w-6 h-6 fill-white/20" />
      <span className="font-extrabold text-xs uppercase tracking-wider pr-1">
        Pedir no WhatsApp
      </span>
    </button>
  );
};
