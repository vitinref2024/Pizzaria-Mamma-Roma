import React, { useState } from 'react';
import { Plus, Minus, Check, ShoppingBag } from 'lucide-react';
import { BeverageItem, CartItem } from '../types';
import { formatCurrency } from '../utils/storeUtils';

interface BeveragesSectionProps {
  beverages: BeverageItem[];
  onAddToCart: (item: CartItem) => void;
  onOpenCart: () => void;
}

export const BeveragesSection: React.FC<BeveragesSectionProps> = ({
  beverages,
  onAddToCart,
  onOpenCart
}) => {
  const [quantities, setQuantities] = useState<{ [bevId: string]: number }>({});
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const handleQtyChange = (bevId: string, delta: number) => {
    setQuantities(prev => {
      const current = prev[bevId] || 1;
      const next = Math.max(1, current + delta);
      return { ...prev, [bevId]: next };
    });
  };

  const handleAddBeverage = (bev: BeverageItem) => {
    const qty = quantities[bev.id] || 1;
    const totalPrice = bev.price * qty;

    const cartItem: CartItem = {
      cartId: `bev-${bev.id}-${Date.now()}`,
      type: 'bebida',
      name: bev.name,
      details: `Volume: ${bev.volume}`,
      unitPrice: bev.price,
      quantity: qty,
      totalPrice,
      image: bev.image
    };

    onAddToCart(cartItem);
    setToastMessage(`${qty}x ${bev.name} adicionada!`);
    setTimeout(() => setToastMessage(null), 2500);
  };

  return (
    <section id="bebidas" className="py-12 sm:py-16 px-4 bg-[#0a0a0a] border-t border-white/10 relative">
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
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#168A45]/20 border border-[#168A45]/40 text-[#168A45] text-xs font-black uppercase tracking-widest">
            <span>Bebidas Geladas</span>
          </div>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-black uppercase tracking-tight text-white">
            🥤 BEBIDAS
          </h2>
          <p className="text-sm sm:text-base text-white/70">
            Refrigerantes gelados, sucos e águas para acompanhar suas pizzas favoritas.
          </p>
        </div>

        {/* Beverages Grid */}
        <div className="grid grid-cols-1 xs:grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
          {beverages.map((bev) => {
            const qty = quantities[bev.id] || 1;
            const currentTotal = bev.price * qty;

            return (
              <div
                key={bev.id}
                id={`bev-card-${bev.id}`}
                className="rounded-3xl bg-[#141414] border border-white/10 hover:border-white/25 overflow-hidden flex flex-col justify-between shadow-xl transition-all duration-300 hover:-translate-y-1 group p-4"
              >
                {/* Beverage Image */}
                <div className="relative h-36 sm:h-44 rounded-2xl overflow-hidden bg-black mb-3">
                  <img
                    src={bev.image}
                    alt={bev.name}
                    loading="lazy"
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute top-2 left-2 bg-black/80 px-2 py-0.5 rounded-md text-[10px] font-bold text-white">
                    {bev.volume}
                  </div>
                  <div className="absolute bottom-2 right-2 bg-black/80 backdrop-blur-md px-2.5 py-1 rounded-lg border border-[#FFD21A]/30">
                    <span className="text-sm sm:text-base font-black text-[#FFD21A]">
                      {formatCurrency(bev.price)}
                    </span>
                  </div>
                </div>

                <div className="space-y-3">
                  <div>
                    <h3 className="text-sm sm:text-base font-bold text-white uppercase truncate">
                      {bev.name}
                    </h3>
                    <p className="text-[11px] text-white/60">
                      Volume: {bev.volume} • Gelada
                    </p>
                  </div>

                  {/* Quantity & Add Button */}
                  <div className="flex items-center gap-2">
                    <div className="flex items-center bg-black/60 rounded-lg border border-white/15 p-0.5 shrink-0">
                      <button
                        type="button"
                        onClick={() => handleQtyChange(bev.id, -1)}
                        className="w-7 h-7 rounded bg-white/5 hover:bg-white/15 text-white flex items-center justify-center cursor-pointer text-xs"
                        title="Diminuir"
                      >
                        <Minus className="w-3 h-3" />
                      </button>
                      <span className="w-6 text-center text-xs font-bold text-white">
                        {qty}
                      </span>
                      <button
                        type="button"
                        onClick={() => handleQtyChange(bev.id, 1)}
                        className="w-7 h-7 rounded bg-white/5 hover:bg-white/15 text-white flex items-center justify-center cursor-pointer text-xs"
                        title="Aumentar"
                      >
                        <Plus className="w-3 h-3" />
                      </button>
                    </div>

                    <button
                      type="button"
                      onClick={() => handleAddBeverage(bev)}
                      id={`btn-add-bev-${bev.id}`}
                      className="flex-1 py-2 px-2 rounded-xl bg-[#E52521] hover:bg-[#c71c18] text-white font-bold text-[11px] uppercase tracking-wider flex items-center justify-center gap-1 shadow-md active:scale-95 transition-all cursor-pointer truncate"
                    >
                      <Plus className="w-3.5 h-3.5 shrink-0" />
                      <span className="truncate">{formatCurrency(currentTotal)}</span>
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};
