import React from 'react';
import { ShoppingBag, MessageCircle, Utensils } from 'lucide-react';
import { StoreSettings } from '../types';
import { openWhatsApp } from '../utils/storeUtils';

interface MobileStickyBarProps {
  cartCount: number;
  onOpenCart: () => void;
  settings: StoreSettings;
}

export const MobileStickyBar: React.FC<MobileStickyBarProps> = ({
  cartCount,
  onOpenCart,
  settings
}) => {
  const handleScrollToMenu = () => {
    document.querySelector('#cardapio')?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleWhatsApp = () => {
    openWhatsApp(settings.whatsapp, 'Olá, Pizzaria Mamma Roma! Gostaria de fazer um pedido.');
  };

  return (
    <div className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-[#0c0c0c]/95 backdrop-blur-lg border-t border-white/15 px-3 py-2 shadow-2xl flex items-center justify-between gap-2">
      {/* Scroll to Menu */}
      <button
        onClick={handleScrollToMenu}
        id="mobile-nav-menu-btn"
        className="flex-1 py-2.5 rounded-xl bg-white/5 hover:bg-white/10 text-white border border-white/10 text-xs font-bold uppercase tracking-wider flex flex-col items-center justify-center gap-0.5 active:scale-95 transition-transform"
      >
        <Utensils className="w-4 h-4 text-[#FFD21A]" />
        <span className="text-[10px]">Cardápio</span>
      </button>

      {/* Cart Drawer Trigger */}
      <button
        onClick={onOpenCart}
        id="mobile-nav-cart-btn"
        className="flex-1 py-2.5 rounded-xl bg-[#181818] hover:bg-[#202020] text-white border border-white/15 text-xs font-bold uppercase tracking-wider flex flex-col items-center justify-center gap-0.5 relative active:scale-95 transition-transform"
      >
        <div className="relative">
          <ShoppingBag className="w-4 h-4 text-[#FFD21A]" />
          {cartCount > 0 && (
            <span className="absolute -top-2 -right-3 bg-[#E52521] text-white text-[9px] font-black w-4 h-4 rounded-full flex items-center justify-center animate-bounce">
              {cartCount}
            </span>
          )}
        </div>
        <span className="text-[10px]">Meu Pedido</span>
      </button>

      {/* Direct WhatsApp CTA */}
      <button
        onClick={handleWhatsApp}
        id="mobile-nav-whatsapp-btn"
        className="flex-[1.5] py-2.5 rounded-xl bg-[#168A45] hover:bg-[#199d4f] text-white text-xs font-black uppercase tracking-wider flex items-center justify-center gap-1.5 shadow-lg shadow-[#168A45]/30 active:scale-95 transition-transform"
      >
        <MessageCircle className="w-4 h-4 fill-white/20" />
        <span className="text-[11px]">WhatsApp</span>
      </button>
    </div>
  );
};
