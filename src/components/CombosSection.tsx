import React, { useState } from 'react';
import { ShoppingBag, Check, Sparkles, Layers } from 'lucide-react';
import { ComboOffer, CartItem } from '../types';
import { formatCurrency } from '../utils/storeUtils';

interface CombosSectionProps {
  combos: ComboOffer[];
  onAddToCart: (item: CartItem) => void;
  onOpenCart: () => void;
}

export const CombosSection: React.FC<CombosSectionProps> = ({
  combos,
  onAddToCart,
  onOpenCart
}) => {
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const handleOrderCombo = (combo: ComboOffer) => {
    const cartItem: CartItem = {
      cartId: `combo-${combo.id}-${Date.now()}`,
      type: 'combo',
      name: combo.title,
      details: combo.items.join(' + '),
      unitPrice: combo.price,
      quantity: 1,
      totalPrice: combo.price,
      image: combo.image
    };

    onAddToCart(cartItem);
    setToastMessage(`Combo adicionado: ${combo.title}!`);
    setTimeout(() => setToastMessage(null), 2500);
  };

  return (
    <section id="combos" className="py-12 sm:py-16 px-4 bg-[#0a0a0a] border-t border-white/10 relative">
      {/* Toast Alert */}
      {toastMessage && (
        <div className="fixed bottom-20 left-1/2 -translate-x-1/2 z-50 bg-[#168A45] text-white px-5 py-3 rounded-full font-bold shadow-2xl flex items-center gap-2 border border-white/20 animate-in fade-in slide-in-from-bottom-5">
          <Check className="w-5 h-5 text-[#FFD21A]" />
          <span>{toastMessage}</span>
          <button
            onClick={onOpenCart}
            className="ml-2 underline text-[#FFD21A] text-xs uppercase cursor-pointer"
          >
            Ver Pedido
          </button>
        </div>
      )}

      <div className="max-w-7xl mx-auto space-y-8">
        {/* Section Header */}
        <div className="text-center space-y-2 max-w-2xl mx-auto">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#FFD21A]/20 border border-[#FFD21A]/40 text-[#FFD21A] text-xs font-black uppercase tracking-widest">
            <Layers className="w-4 h-4" />
            <span>Mais Econômico</span>
          </div>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-black uppercase tracking-tight text-white">
            🍕 COMBOS MAMMA ROMA
          </h2>
          <p className="text-sm sm:text-base text-white/70">
            Kits completos com pizza salgada, sobremesa doce e refrigerante gelado com super desconto.
          </p>
        </div>

        {/* Combos Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-5xl mx-auto">
          {combos.map((combo) => (
            <div
              key={combo.id}
              id={`combo-card-${combo.id}`}
              className="rounded-3xl bg-[#141414] border-2 border-white/15 hover:border-[#FFD21A] overflow-hidden flex flex-col justify-between shadow-2xl transition-all duration-300 group"
            >
              {/* Image & Price Banner */}
              <div className="relative h-48 sm:h-56 overflow-hidden bg-black">
                <img
                  src={combo.image}
                  alt={combo.title}
                  loading="lazy"
                  decoding="async"
                  width={600}
                  height={350}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#141414] via-[#141414]/50 to-transparent" />
                
                {/* Top Badge */}
                <div className="absolute top-4 left-4">
                  <span className="px-3.5 py-1.5 rounded-full bg-[#E52521] text-white text-xs font-black uppercase tracking-wider shadow-lg">
                    {combo.badge || 'Imperdível'}
                  </span>
                </div>

                {/* Price Highlight */}
                <div className="absolute bottom-3 right-4 bg-black/85 backdrop-blur-md px-3.5 sm:px-4 py-1.5 sm:py-2 rounded-2xl border border-[#FFD21A]/40 shadow-xl">
                  <span className="text-[9px] sm:text-[10px] uppercase tracking-widest text-white/70 block text-right">Total do Combo</span>
                  <span className="text-xl sm:text-3xl font-black text-[#FFD21A]">
                    {formatCurrency(combo.price)}
                  </span>
                </div>
              </div>

              {/* Body Content */}
              <div className="p-5 sm:p-7 flex-1 flex flex-col justify-between space-y-6">
                <div className="space-y-3">
                  <h3 className="text-xl sm:text-2xl md:text-3xl font-black text-white uppercase tracking-tight break-words">
                    {combo.title}
                  </h3>
                  <p className="text-xs sm:text-sm text-white/70 leading-relaxed">
                    {combo.description}
                  </p>

                  {/* Included Items Checklist */}
                  <div className="pt-2 space-y-2">
                    <p className="text-xs font-bold uppercase tracking-wider text-[#FFD21A]">
                      O que vem neste combo:
                    </p>
                    <ul className="space-y-2">
                      {combo.items.map((item, i) => (
                        <li key={i} className="flex items-start gap-2.5 text-xs sm:text-sm font-medium text-white/90">
                          <span className="w-5 h-5 rounded-full bg-[#168A45]/30 border border-[#168A45] text-[#168A45] flex items-center justify-center shrink-0 mt-0.5 font-bold text-xs">
                            ✓
                          </span>
                          <span className="break-words">{item}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>

                {/* Order Combo Button */}
                <button
                  onClick={() => handleOrderCombo(combo)}
                  id={`btn-order-combo-${combo.id}`}
                  aria-label={`Pedir ${combo.title} por ${formatCurrency(combo.price)}`}
                  className="w-full py-3.5 sm:py-4 px-4 rounded-2xl bg-gradient-to-r from-[#E52521] to-[#b81b18] hover:from-[#f02f2b] hover:to-[#E52521] text-white font-extrabold text-xs sm:text-sm uppercase tracking-wider flex items-center justify-center gap-2 shadow-xl shadow-[#E52521]/30 hover:scale-105 active:scale-95 transition-all cursor-pointer border border-[#E52521]"
                >
                  <ShoppingBag className="w-4 h-4 text-[#FFD21A] shrink-0" />
                  <span className="truncate">PEDIR COMBO • {formatCurrency(combo.price)}</span>
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
