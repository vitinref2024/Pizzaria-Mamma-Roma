import React from 'react';
import { MessageCircle, Phone, Instagram, Clock, MapPin, Sparkles } from 'lucide-react';
import { StoreSettings } from '../types';
import { isStoreOpen, openWhatsApp } from '../utils/storeUtils';

interface ContactSectionProps {
  settings: StoreSettings;
}

export const ContactSection: React.FC<ContactSectionProps> = ({ settings }) => {
  const isOpen = isStoreOpen(settings);

  const handleWhatsApp = () => {
    openWhatsApp(settings.whatsapp, 'Olá, Pizzaria Mamma Roma! Gostaria de fazer um pedido.');
  };

  const handleInstagram = () => {
    const cleanInsta = (settings.instagram || 'pizzariamammaroma').replace('@', '').trim();
    const url = `https://www.instagram.com/${cleanInsta || 'pizzariamammaroma'}/`;
    const anchor = document.createElement('a');
    anchor.href = url;
    anchor.target = '_blank';
    anchor.rel = 'noopener noreferrer';
    document.body.appendChild(anchor);
    anchor.click();
    document.body.removeChild(anchor);
  };

  return (
    <section id="contato" className="py-14 sm:py-20 px-4 bg-[#080808] border-t border-white/10 relative">
      <div className="max-w-6xl mx-auto space-y-10">
        {/* Section Title */}
        <div className="text-center space-y-2 max-w-2xl mx-auto">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#168A45]/20 border border-[#168A45]/40 text-[#168A45] text-xs font-black uppercase tracking-widest">
            <span>Canais de Atendimento</span>
          </div>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-black uppercase tracking-tight text-white">
            FALE COM A MAMMA ROMA
          </h2>
          <p className="text-sm sm:text-base text-white/70">
            Estamos prontos para preparar sua pizza com carinho e agilidade. Faça seu pedido!
          </p>
        </div>

        {/* Contact Info Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* WhatsApp Card */}
          <div className="p-6 sm:p-8 rounded-3xl bg-[#141414] border-2 border-[#168A45]/40 hover:border-[#168A45] flex flex-col justify-between space-y-6 shadow-xl transition-all group">
            <div className="space-y-3">
              <div className="w-12 h-12 rounded-2xl bg-[#168A45]/20 border border-[#168A45]/40 flex items-center justify-center text-[#168A45] group-hover:scale-110 transition-transform">
                <MessageCircle className="w-6 h-6 fill-[#168A45]/20" />
              </div>
              <h3 className="text-lg sm:text-xl font-black text-white uppercase">WhatsApp Delivery</h3>
              <p className="text-xl sm:text-2xl md:text-3xl font-black text-[#168A45] break-words">
                {settings.whatsappDisplay}
              </p>
              <p className="text-xs text-white/60">
                Atendimento rápido para pedidos e consultas de entrega.
              </p>
            </div>

            <button
              onClick={handleWhatsApp}
              id="btn-contact-whatsapp"
              aria-label="Chamar Pizzaria Mamma Roma no WhatsApp"
              className="w-full py-3.5 rounded-2xl bg-[#168A45] hover:bg-[#199d4f] text-white font-extrabold text-xs uppercase tracking-wider flex items-center justify-center gap-2 shadow-lg shadow-[#168A45]/30 active:scale-95 transition-all cursor-pointer"
            >
              <MessageCircle className="w-4 h-4 fill-white/20 shrink-0" />
              <span>CHAMAR NO WHATSAPP</span>
            </button>
          </div>

          {/* Telephone Card */}
          <div className="p-6 sm:p-8 rounded-3xl bg-[#141414] border-2 border-white/15 hover:border-[#FFD21A] flex flex-col justify-between space-y-6 shadow-xl transition-all group">
            <div className="space-y-3">
              <div className="w-12 h-12 rounded-2xl bg-[#FFD21A]/20 border border-[#FFD21A]/40 flex items-center justify-center text-[#FFD21A] group-hover:scale-110 transition-transform">
                <Phone className="w-6 h-6" />
              </div>
              <h3 className="text-lg sm:text-xl font-black text-white uppercase">Telefone Fixo</h3>
              <p className="text-xl sm:text-2xl md:text-3xl font-black text-[#FFD21A] break-words">
                {settings.phoneDisplay}
              </p>
              <p className="text-xs text-white/60">
                Ligue diretamente para nossa equipe na pizzaria.
              </p>
            </div>

            <a
              href={`tel:${settings.phone}`}
              id="btn-contact-phone"
              aria-label={`Ligar para Pizzaria Mamma Roma no telefone ${settings.phoneDisplay}`}
              className="w-full py-3.5 rounded-2xl bg-white/10 hover:bg-white/20 text-white font-extrabold text-xs uppercase tracking-wider flex items-center justify-center gap-2 border border-white/20 active:scale-95 transition-all cursor-pointer text-center"
            >
              <Phone className="w-4 h-4 text-[#FFD21A] shrink-0" />
              <span>LIGAR AGORA</span>
            </a>
          </div>

          {/* Instagram / Social Card */}
          <div className="p-6 sm:p-8 rounded-3xl bg-[#141414] border-2 border-white/15 hover:border-[#E52521] flex flex-col justify-between space-y-6 shadow-xl transition-all group">
            <div className="space-y-3">
              <div className="w-12 h-12 rounded-2xl bg-[#E52521]/20 border border-[#E52521]/40 flex items-center justify-center text-[#E52521] group-hover:scale-110 transition-transform">
                <Instagram className="w-6 h-6" />
              </div>
              <h3 className="text-lg sm:text-xl font-black text-white uppercase">Instagram</h3>
              <p className="text-lg sm:text-2xl font-black text-[#E52521] truncate">
                {settings.instagram}
              </p>
              <p className="text-xs text-white/60">
                Acompanhe fotos diárias, novidades e bastidores.
              </p>
            </div>

            <button
              onClick={handleInstagram}
              id="btn-contact-instagram"
              aria-label="Acessar perfil do Instagram da Pizzaria Mamma Roma"
              className="w-full py-3.5 rounded-2xl bg-[#E52521] hover:bg-[#c71c18] text-white font-extrabold text-xs uppercase tracking-wider flex items-center justify-center gap-2 shadow-lg shadow-[#E52521]/30 active:scale-95 transition-all cursor-pointer"
            >
              <Instagram className="w-4 h-4 shrink-0" />
              <span>ACESSAR INSTAGRAM</span>
            </button>
          </div>
        </div>

        {/* Operating Hours Bar */}
        <div className="p-6 rounded-3xl bg-[#111111] border border-white/15 flex flex-col sm:flex-row items-center justify-between gap-4 text-center sm:text-left">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center text-[#FFD21A]">
              <Clock className="w-5 h-5" />
            </div>
            <div>
              <p className="text-xs text-white/60 uppercase font-bold tracking-wider">Horário de Funcionamento</p>
              <p className="text-base sm:text-lg font-black text-white">{settings.hours}</p>
            </div>
          </div>

          <div className="flex items-center gap-2 px-4 py-2 rounded-2xl bg-black/60 border border-white/10">
            <span className={`w-3 h-3 rounded-full ${isOpen ? 'bg-[#168A45] animate-ping' : 'bg-red-500'}`} />
            <span className={`text-xs font-black uppercase tracking-wider ${isOpen ? 'text-[#168A45]' : 'text-red-400'}`}>
              {isOpen ? '🟢 ABERTO AGORA • FAÇA SEU PEDIDO' : '🔴 FECHADO AGORA • ABRE ÀS 18H'}
            </span>
          </div>
        </div>
      </div>
    </section>
  );
};
