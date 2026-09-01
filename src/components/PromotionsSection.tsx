import React, { useState } from 'react';
import { Flame, Check, Plus, ShoppingBag, Sparkles, ChevronRight } from 'lucide-react';
import { PromotionOffer, StuffedCrust, CartItem } from '../types';
import { formatCurrency } from '../utils/storeUtils';

interface PromotionsSectionProps {
  promotions: PromotionOffer[];
  stuffedCrusts: StuffedCrust[];
  onAddToCart: (item: CartItem) => void;
  onOpenCart: () => void;
}

export const PromotionsSection: React.FC<PromotionsSectionProps> = ({
  promotions,
  stuffedCrusts,
  onAddToCart,
  onOpenCart
}) => {
  // Store selected flavor per promotion
  const [selectedFlavors, setSelectedFlavors] = useState<{ [promoId: string]: string }>({
    'promo-1': 'Calabresa',
    'promo-2': 'Marguerita',
    'promo-3': 'Portuguesa'
  });

  const [selectedCrusts, setSelectedCrusts] = useState<{ [promoId: string]: string }>({
    'promo-1': '',
    'promo-2': '',
    'promo-3': ''
  });

  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const handleSelectFlavor = (promoId: string, flavor: string) => {
    setSelectedFlavors(prev => ({ ...prev, [promoId]: flavor }));
  };

  const handleSelectCrust = (promoId: string, crustId: string) => {
    setSelectedCrusts(prev => ({
      ...prev,
      [promoId]: prev[promoId] === crustId ? '' : crustId
    }));
  };

  const handleOrderPromo = (promo: PromotionOffer) => {
    const chosenFlavor = selectedFlavors[promo.id] || promo.flavors[0];
    const crustObj = stuffedCrusts.find(c => c.id === selectedCrusts[promo.id]);
    const crustPrice = crustObj ? crustObj.price : 0;
    const finalPrice = promo.price + crustPrice;

    const cartItem: CartItem = {
      cartId: `promo-${promo.id}-${Date.now()}`,
      type: 'promo',
      name: `${promo.title} — ${chosenFlavor}`,
      flavor: chosenFlavor,
      details: crustObj ? `Borda Recheada: ${crustObj.name}` : 'Sem borda recheada',
      crust: crustObj ? { name: crustObj.name, price: crustObj.price } : undefined,
      unitPrice: finalPrice,
      quantity: 1,
      totalPrice: finalPrice
    };

    onAddToCart(cartItem);
    setToastMessage(`Adicionado: ${promo.title} (${chosenFlavor})`);
    setTimeout(() => setToastMessage(null), 2500);
  };

  return (
    <section id="promocoes" className="py-12 sm:py-16 px-4 bg-[#080808] relative">
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
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#E52521]/20 border border-[#E52521]/40 text-[#E52521] text-xs font-black uppercase tracking-widest">
            <Flame className="w-4 h-4 fill-[#E52521]" />
            <span>Área de Maior Destaque</span>
          </div>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-black uppercase tracking-tight text-white">
            🔥 PROMOÇÕES ESPECIAIS
          </h2>
          <p className="text-sm sm:text-base text-white/70">
            Pizzas grandes deliciosas com os melhores preços da região. Escolha seu sabor favorito e peça agora!
          </p>
        </div>

        {/* Promo Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {promotions.map((promo, idx) => {
            const currentFlavor = selectedFlavors[promo.id] || promo.flavors[0];
            const currentCrustId = selectedCrusts[promo.id];
            const chosenCrust = stuffedCrusts.find(c => c.id === currentCrustId);
            const totalPrice = promo.price + (chosenCrust ? chosenCrust.price : 0);

            return (
              <div
                key={promo.id}
                id={`promo-card-${promo.id}`}
                className="relative rounded-3xl bg-[#141414] border-2 border-[#E52521]/40 hover:border-[#E52521] p-5 sm:p-6 flex flex-col justify-between transition-all duration-300 shadow-xl shadow-black/60 hover:shadow-2xl hover:shadow-[#E52521]/20 group"
              >
                {/* Top Badge */}
                <div className="flex items-center justify-between gap-2 mb-4">
                  <span className="px-3 py-1 rounded-full bg-[#E52521] text-white text-[11px] font-black uppercase tracking-wider shadow-sm">
                    {promo.title}
                  </span>
                  {promo.badge && (
                    <span className="px-2.5 py-0.5 rounded-full bg-[#FFD21A]/20 border border-[#FFD21A]/40 text-[#FFD21A] text-[10px] font-bold uppercase tracking-wider">
                      {promo.badge}
                    </span>
                  )}
                </div>

                {/* Price Display */}
                <div className="mb-4 bg-black/40 rounded-2xl p-4 border border-white/5 text-center">
                  <p className="text-xs text-white/60 font-semibold uppercase tracking-wider">Por Apenas</p>
                  <p className="text-3xl sm:text-4xl font-black text-[#FFD21A] tracking-tight">
                    {formatCurrency(promo.price)}
                  </p>
                  <p className="text-[11px] text-white/50 mt-0.5">Tamanho Grande (8 fatias)</p>
                </div>

                {/* Flavor Selection List */}
                <div className="space-y-2 mb-4">
                  <div className="text-xs font-bold uppercase tracking-wider text-white/90 flex flex-wrap items-center justify-between gap-1">
                    <span>1. Escolha o Sabor:</span>
                    <span className="text-[#FFD21A] font-bold text-xs">{currentFlavor}</span>
                  </div>
                  <div className="grid grid-cols-2 gap-1.5 max-h-48 overflow-y-auto pr-1">
                    {promo.flavors.map((flavor) => {
                      const isSelected = currentFlavor === flavor;
                      return (
                        <button
                          key={flavor}
                          type="button"
                          onClick={() => handleSelectFlavor(promo.id, flavor)}
                          className={`px-2.5 py-2 rounded-xl text-[11px] sm:text-xs font-bold text-left transition-all flex items-center justify-between gap-1 border cursor-pointer ${
                            isSelected
                              ? 'bg-[#E52521] text-white border-[#E52521] shadow-md shadow-[#E52521]/30'
                              : 'bg-white/5 text-white/80 hover:bg-white/10 border-white/10 hover:border-white/20'
                          }`}
                        >
                          <span className="truncate">{flavor}</span>
                          {isSelected && <Check className="w-3.5 h-3.5 shrink-0 text-white" />}
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Stuffed Crust Quick Option */}
                <div className="space-y-2 mb-5 pt-2 border-t border-white/10">
                  <div className="flex flex-wrap items-center justify-between text-[11px] gap-1">
                    <span className="font-bold uppercase tracking-wider text-white/80">
                      2. Deseja Borda Recheada?
                    </span>
                    {chosenCrust ? (
                      <span className="text-[#FFD21A] font-bold">+{formatCurrency(chosenCrust.price)}</span>
                    ) : (
                      <span className="text-white/40 text-[10px]">Opcional</span>
                    )}
                  </div>

                  <div className="space-y-1">
                    {/* Traditional Crusts */}
                    <div className="grid grid-cols-2 gap-1">
                      {stuffedCrusts
                        .filter(c => !c.isVulcao && c.category !== 'vulcao')
                        .map((crust) => {
                          const isCrustSelected = currentCrustId === crust.id;
                          return (
                            <button
                              key={crust.id}
                              type="button"
                              onClick={() => handleSelectCrust(promo.id, crust.id)}
                              className={`px-2 py-1.5 rounded-lg text-[10px] text-left border transition-all cursor-pointer flex items-center justify-between gap-1 ${
                                isCrustSelected
                                  ? 'bg-[#FFD21A] text-black border-[#FFD21A] font-black shadow-sm'
                                  : 'bg-white/5 text-white/70 border-white/10 hover:border-white/20 hover:text-white'
                              }`}
                            >
                              <span className="truncate font-semibold">{crust.name}</span>
                              <span className="text-[9px] font-bold shrink-0">+{formatCurrency(crust.price)}</span>
                            </button>
                          );
                        })}
                    </div>

                    {/* Special Borda Vulcão */}
                    {stuffedCrusts
                      .filter(c => c.isVulcao || c.category === 'vulcao')
                      .map((crust) => {
                        const isVulcaoSelected = currentCrustId === crust.id;
                        return (
                          <button
                            key={crust.id}
                            type="button"
                            onClick={() => handleSelectCrust(promo.id, crust.id)}
                            className={`w-full px-2.5 py-1.5 rounded-lg text-[10px] text-left border transition-all cursor-pointer flex items-center justify-between gap-1.5 ${
                              isVulcaoSelected
                                ? 'bg-gradient-to-r from-orange-500 to-red-600 text-white border-orange-400 font-black shadow-md shadow-orange-900/50'
                                : 'bg-orange-500/10 text-orange-200 border-orange-500/30 hover:bg-orange-500/20 hover:border-orange-500/60'
                            }`}
                          >
                            <span className="font-extrabold flex items-center gap-1 truncate">
                              <span>🌋</span>
                              <span className="truncate">{crust.name} (Especial)</span>
                            </span>
                            <span className="text-[10px] font-black text-[#FFD21A] shrink-0">
                              +{formatCurrency(crust.price)}
                            </span>
                          </button>
                        );
                      })}
                  </div>
                </div>

                {/* Primary Conversion CTA */}
                <button
                  onClick={() => handleOrderPromo(promo)}
                  id={`btn-order-${promo.id}`}
                  className="w-full py-3.5 sm:py-4 px-4 rounded-2xl bg-gradient-to-r from-[#E52521] to-[#b81b18] hover:from-[#f02f2b] hover:to-[#E52521] text-white font-extrabold text-xs sm:text-sm uppercase tracking-wider flex items-center justify-center gap-2 shadow-lg shadow-[#E52521]/40 transition-all hover:scale-105 active:scale-95 cursor-pointer border border-[#E52521]"
                >
                  <ShoppingBag className="w-4 h-4 text-[#FFD21A] shrink-0" />
                  <span className="truncate">PEDIR AGORA • {formatCurrency(totalPrice)}</span>
                </button>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};
