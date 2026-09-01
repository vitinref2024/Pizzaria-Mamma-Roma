import React from 'react';
import { MessageCircle, ArrowDown, Clock, Truck, Award, Sparkles } from 'lucide-react';
import { StoreSettings } from '../types';
import { isStoreOpen, openWhatsApp } from '../utils/storeUtils';

interface HeroProps {
  settings: StoreSettings;
  onExploreMenu: () => void;
}

export const Hero: React.FC<HeroProps> = ({ settings, onExploreMenu }) => {
  const isOpen = isStoreOpen(settings);

  const handleWhatsApp = () => {
    openWhatsApp(settings.whatsapp, 'Olá, Pizzaria Mamma Roma! Gostaria de ver o cardápio e fazer um pedido.');
  };

  return (
    <section id="inicio" className="relative min-h-[90vh] sm:min-h-[85vh] flex items-center justify-center pt-24 pb-16 px-4 sm:px-6 overflow-hidden">
      {/* Background Image with Dark Contrast Gradients */}
      <div className="absolute inset-0 z-0">
        <img
          src="https://images.unsplash.com/photo-1513104890138-7c749659a591?auto=format&fit=crop&w=2000&q=85"
          alt="Pizza Tradicional Mamma Roma Forno a Lenha"
          width={1920}
          height={1080}
          loading="eager"
          fetchPriority="high"
          decoding="async"
          className="w-full h-full object-cover object-center scale-105 filter brightness-50"
        />
        {/* Layered overlays to guarantee ultra crisp readability */}
        <div className="absolute inset-0 bg-gradient-to-t from-[#080808] via-[#080808]/80 to-[#080808]/60" />
        <div className="absolute inset-0 bg-radial-at-c from-transparent via-[#080808]/60 to-[#080808]" />
      </div>

      <div className="relative z-10 w-full max-w-4xl mx-auto text-center space-y-6 sm:space-y-8">
        {/* Quick Badges Bar */}
        <div className="inline-flex flex-wrap items-center justify-center gap-1.5 sm:gap-2.5 p-1.5 sm:p-2 rounded-3xl sm:rounded-full bg-white/10 backdrop-blur-md border border-white/15 shadow-xl max-w-full">
          <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#E52521] text-white text-[11px] sm:text-xs font-bold uppercase tracking-wider shadow-sm shrink-0">
            <Award className="w-3.5 h-3.5 text-[#FFD21A]" />
            <span>Desde 2002</span>
          </div>

          <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/10 text-white text-[11px] sm:text-xs font-medium shrink-0">
            <Truck className="w-3.5 h-3.5 text-[#FFD21A]" />
            <span>Delivery Rápido</span>
          </div>

          <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-black/40 text-white text-[11px] sm:text-xs font-medium shrink-0">
            <Clock className="w-3.5 h-3.5 text-white/80" />
            <span className="hidden xs:inline">Todos os dias • </span>
            <span>18h à 1h</span>
          </div>

          {/* Store Status Light */}
          <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-black/50 text-[11px] sm:text-xs font-bold shrink-0">
            <span className={`w-2 h-2 rounded-full ${isOpen ? 'bg-[#168A45] animate-pulse' : 'bg-red-500'}`} />
            <span className={isOpen ? 'text-[#168A45]' : 'text-red-400'}>
              {isOpen ? 'Aberto' : 'Fechado'}
            </span>
          </div>
        </div>

        {/* Official Logo Emblem */}
        <div className="flex justify-center -my-1 sm:my-0">
          <div className="relative group">
            <div className="w-24 h-24 sm:w-36 sm:h-36 md:w-40 md:h-40 rounded-full p-1 bg-gradient-to-tr from-[#E52521] via-[#FFD21A] to-[#168A45] shadow-2xl shadow-black/90 group-hover:scale-105 transition-transform duration-300">
              <div className="w-full h-full rounded-full overflow-hidden bg-black border-2 border-black">
                <img
                  src={settings.logo || '/logo.jpg'}
                  alt="Pizzaria Mamma Roma - Logo Oficial"
                  width={160}
                  height={160}
                  loading="eager"
                  fetchPriority="high"
                  decoding="async"
                  className="w-full h-full object-cover"
                  referrerPolicy="no-referrer"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Hero Title & Subtitles */}
        <div className="space-y-3 px-2">
          <h1 className="text-3xl sm:text-5xl md:text-6xl lg:text-7xl font-black tracking-tight text-white uppercase drop-shadow-2xl leading-tight break-words">
            Pizzaria <span className="text-[#E52521]">Mamma Roma</span>
          </h1>
          <p className="text-base sm:text-2xl md:text-3xl font-bold text-[#FFD21A] tracking-wide serif italic leading-snug">
            Desde 2002 levando sabor e tradição até você.
          </p>
          <p className="text-xs sm:text-base md:text-lg text-white/80 max-w-2xl mx-auto font-normal leading-relaxed">
            Pizzas salgadas e doces, promoções especiais e delivery com a máxima rapidez e recheios fartos.
          </p>
        </div>

        {/* Call to Actions (Order-Focused) */}
        <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-4 w-full max-w-md sm:max-w-none mx-auto">
          {/* Main CTA */}
          <button
            onClick={onExploreMenu}
            id="hero-menu-cta"
            aria-label="Ver cardápio completo da Pizzaria Mamma Roma"
            className="w-full sm:w-auto px-6 sm:px-8 py-3.5 sm:py-4 rounded-2xl bg-gradient-to-r from-[#E52521] to-[#c71c18] hover:from-[#f02f2b] hover:to-[#E52521] text-white font-extrabold text-xs sm:text-base uppercase tracking-wider flex items-center justify-center gap-2.5 shadow-xl shadow-[#E52521]/40 hover:scale-105 active:scale-95 transition-all cursor-pointer border border-[#E52521]/50 group"
          >
            <span className="text-lg sm:text-xl" aria-hidden="true">🍕</span>
            <span>VER CARDÁPIO COMPLETO</span>
            <ArrowDown className="w-4 h-4 text-white/80 group-hover:translate-y-1 transition-transform" />
          </button>

          {/* Secondary WhatsApp CTA */}
          <button
            onClick={handleWhatsApp}
            id="hero-whatsapp-cta"
            aria-label="Fazer pedido pelo WhatsApp"
            className="w-full sm:w-auto px-6 sm:px-7 py-3.5 sm:py-4 rounded-2xl bg-[#168A45] hover:bg-[#199d4f] text-white font-bold text-xs sm:text-base uppercase tracking-wider flex items-center justify-center gap-2.5 shadow-lg shadow-[#168A45]/30 hover:scale-105 active:scale-95 transition-all cursor-pointer border border-[#168A45]/50"
          >
            <MessageCircle className="w-5 h-5 fill-white/20" />
            <span>PEDIR PELO WHATSAPP</span>
          </button>
        </div>

        {/* Quick Highlights Guarantee */}
        <div className="pt-4 grid grid-cols-3 gap-1 sm:gap-4 max-w-xl mx-auto text-center border-t border-white/10">
          <div className="p-1.5 sm:p-2">
            <p className="text-sm sm:text-xl font-extrabold text-[#FFD21A]">24+ Anos</p>
            <p className="text-[9px] sm:text-xs text-white/70 uppercase">Tradição & Sabor</p>
          </div>
          <div className="p-1.5 sm:p-2 border-x border-white/10">
            <p className="text-sm sm:text-xl font-extrabold text-white">50+ Sabores</p>
            <p className="text-[9px] sm:text-xs text-white/70 uppercase">Salgadas & Doces</p>
          </div>
          <div className="p-1.5 sm:p-2">
            <p className="text-sm sm:text-xl font-extrabold text-[#168A45]">Delivery Ágil</p>
            <p className="text-[9px] sm:text-xs text-white/70 uppercase">Na sua casa</p>
          </div>
        </div>
      </div>
    </section>
  );
};
