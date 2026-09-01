import React, { useState } from 'react';
import { X, Plus, Minus, Check, Sparkles, ArrowRight } from 'lucide-react';
import { BeverageItem, CartItem } from '../types';
import { formatCurrency } from '../utils/storeUtils';

interface BeverageUpsellModalProps {
  isOpen: boolean;
  onClose: () => void;
  beverages: BeverageItem[];
  onAddBeverage: (item: CartItem) => void;
  lastAddedPizzaName?: string;
}

export const BeverageUpsellModal: React.FC<BeverageUpsellModalProps> = ({
  isOpen,
  onClose,
  beverages,
  onAddBeverage,
  lastAddedPizzaName
}) => {
  const [quantities, setQuantities] = useState<{ [id: string]: number }>({});
  const [addedItem, setAddedItem] = useState<string | null>(null);

  if (!isOpen) return null;

  // Filter available beverages
  const availableBeverages = beverages.filter(b => b.available !== false);

  const handleQty = (id: string, delta: number) => {
    setQuantities(prev => {
      const current = prev[id] || 1;
      const next = Math.max(1, current + delta);
      return { ...prev, [id]: next };
    });
  };

  const handleAdd = (bev: BeverageItem) => {
    const qty = quantities[bev.id] || 1;
    const totalPrice = bev.price * qty;

    const cartItem: CartItem = {
      cartId: `bev-upsell-${bev.id}-${Date.now()}`,
      type: 'bebida',
      name: bev.name,
      details: bev.volume ? `Tamanho: ${bev.volume}` : 'Bebida Gelada',
      unitPrice: bev.price,
      quantity: qty,
      totalPrice,
      image: bev.image
    };

    onAddBeverage(cartItem);
    setAddedItem(bev.id);

    setTimeout(() => {
      setAddedItem(null);
      onClose();
    }, 600);
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-200"
      onClick={onClose}
      id="beverage-upsell-backdrop"
    >
      <div
        className="w-full sm:max-w-2xl bg-[#0F0F0F] border border-white/15 rounded-t-3xl sm:rounded-3xl shadow-2xl overflow-hidden max-h-[90vh] flex flex-col animate-in slide-in-from-bottom-6 sm:zoom-in-95 duration-200"
        onClick={(e) => e.stopPropagation()}
        id="beverage-upsell-modal"
      >
        {/* Top Header Banner */}
        <div className="relative bg-gradient-to-r from-[#E52521] via-[#c41e1a] to-[#91120f] p-5 sm:p-6 text-white">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-2 rounded-full bg-black/30 hover:bg-black/50 text-white/90 hover:text-white transition-colors cursor-pointer"
            aria-label="Fechar"
            id="close-upsell-btn"
          >
            <X className="w-5 h-5" />
          </button>

          <div className="flex items-center gap-2 mb-1.5">
            <span className="text-2xl sm:text-3xl">🥤</span>
            <span className="px-2.5 py-0.5 rounded-full bg-[#FFD21A] text-black text-[10px] font-black uppercase tracking-wider">
              Acompanhamento Perfeito
            </span>
          </div>

          <h3 className="text-lg sm:text-2xl font-black tracking-tight leading-tight">
            QUE TAL UMA BEBIDA PARA ACOMPANHAR?
          </h3>
          <p className="text-white/90 text-xs sm:text-sm mt-1 font-medium">
            Complete seu pedido com uma bebida geladinha para sua pizza.
          </p>

          {lastAddedPizzaName && (
            <div className="mt-3 inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-black/30 text-white/90 text-xs font-semibold backdrop-blur-xs">
              <Sparkles className="w-3.5 h-3.5 text-[#FFD21A]" />
              <span>Pizza adicionada: <strong className="text-white">{lastAddedPizzaName}</strong></span>
            </div>
          )}
        </div>

        {/* Beverage Cards Grid */}
        <div className="p-4 sm:p-6 overflow-y-auto flex-1 space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 sm:gap-4">
            {availableBeverages.map((bev) => {
              const qty = quantities[bev.id] || 1;
              const isJustAdded = addedItem === bev.id;

              return (
                <div
                  key={bev.id}
                  className={`group relative rounded-2xl bg-[#171717] border transition-all duration-200 p-3.5 flex flex-col justify-between ${
                    isJustAdded
                      ? 'border-[#168A45] bg-[#168A45]/10 scale-[0.98]'
                      : 'border-white/10 hover:border-[#FFD21A]/50 hover:bg-[#1f1f1f]'
                  }`}
                >
                  <div className="flex gap-3">
                    {/* Image */}
                    <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-xl overflow-hidden bg-black/40 shrink-0 relative border border-white/5">
                      <img
                        src={bev.image}
                        alt={`Bebida ${bev.name}`}
                        width={96}
                        height={96}
                        loading="lazy"
                        decoding="async"
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                        referrerPolicy="no-referrer"
                      />
                      {bev.volume && (
                        <span className="absolute bottom-1 right-1 bg-black/80 backdrop-blur-xs text-[#FFD21A] text-[10px] font-black px-1.5 py-0.5 rounded">
                          {bev.volume}
                        </span>
                      )}
                    </div>

                    {/* Details */}
                    <div className="flex-1 flex flex-col justify-between min-w-0">
                      <div>
                        <h4 className="font-extrabold text-white text-sm sm:text-base leading-snug line-clamp-2">
                          {bev.name}
                        </h4>
                        <span className="text-[11px] text-white/50 block mt-0.5">
                          Bebida Gelada
                        </span>
                      </div>

                      <div className="mt-2">
                        <span className="text-base sm:text-lg font-black text-[#FFD21A]">
                          {formatCurrency(bev.price)}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Actions (Quantity + Add Button) */}
                  <div className="mt-3 pt-3 border-t border-white/10 flex items-center justify-between gap-2">
                    {/* Quantity controls */}
                    <div className="flex items-center bg-black/60 rounded-xl border border-white/10 p-0.5">
                      <button
                        onClick={() => handleQty(bev.id, -1)}
                        className="w-7 h-7 rounded-lg flex items-center justify-center text-white/70 hover:text-white hover:bg-white/10 transition-colors"
                        aria-label="Diminuir"
                      >
                        <Minus className="w-3.5 h-3.5" />
                      </button>
                      <span className="w-7 text-center font-black text-xs text-white">
                        {qty}
                      </span>
                      <button
                        onClick={() => handleQty(bev.id, 1)}
                        className="w-7 h-7 rounded-lg flex items-center justify-center text-white/70 hover:text-white hover:bg-white/10 transition-colors"
                        aria-label="Aumentar"
                      >
                        <Plus className="w-3.5 h-3.5" />
                      </button>
                    </div>

                    {/* Add Button */}
                    <button
                      onClick={() => handleAdd(bev)}
                      id={`upsell-add-${bev.id}`}
                      className={`flex-1 flex items-center justify-center gap-1.5 py-2 px-3 rounded-xl font-extrabold text-xs transition-all duration-200 cursor-pointer ${
                        isJustAdded
                          ? 'bg-[#168A45] text-white shadow-lg shadow-[#168A45]/30'
                          : 'bg-[#E52521] hover:bg-[#c91d1a] text-white shadow-md shadow-[#E52521]/20 active:scale-95'
                      }`}
                    >
                      {isJustAdded ? (
                        <>
                          <Check className="w-4 h-4" />
                          <span>ADICIONADO!</span>
                        </>
                      ) : (
                        <>
                          <Plus className="w-4 h-4" />
                          <span>ADICIONAR</span>
                        </>
                      )}
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Footer / Skip action */}
        <div className="p-4 bg-[#0A0A0A] border-t border-white/10 flex flex-col sm:flex-row items-center justify-between gap-3">
          <span className="text-[11px] sm:text-xs text-white/50 text-center sm:text-left">
            Você pode adicionar bebidas ao pedido a qualquer momento.
          </span>

          <button
            onClick={onClose}
            id="upsell-skip-btn"
            className="w-full sm:w-auto px-6 py-3 rounded-xl bg-white/10 hover:bg-white/15 text-white/90 hover:text-white font-bold text-xs sm:text-sm transition-all text-center cursor-pointer flex items-center justify-center gap-2 border border-white/10 active:scale-95"
          >
            <span>CONTINUAR SEM BEBIDA</span>
            <ArrowRight className="w-4 h-4 text-white/60" />
          </button>
        </div>
      </div>
    </div>
  );
};
