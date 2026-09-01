import React, { useState } from 'react';
import { Plus, Check, Flame, Sparkles } from 'lucide-react';
import { StuffedCrust, CartItem } from '../types';
import { formatCurrency } from '../utils/storeUtils';

interface StuffedCrustsSectionProps {
  stuffedCrusts: StuffedCrust[];
  onAddToCart: (item: CartItem) => void;
  onOpenCart: () => void;
}

export const StuffedCrustsSection: React.FC<StuffedCrustsSectionProps> = ({
  stuffedCrusts,
  onAddToCart,
  onOpenCart
}) => {
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const traditionalCrusts = stuffedCrusts.filter(c => !c.isVulcao && c.category !== 'vulcao');
  const vulcaoCrust = stuffedCrusts.find(c => c.isVulcao || c.category === 'vulcao');

  const handleAddCrust = (crust: StuffedCrust) => {
    const isVulcao = crust.isVulcao || crust.category === 'vulcao';
    const cartItem: CartItem = {
      cartId: `crust-${crust.id}-${Date.now()}`,
      type: 'borda',
      name: isVulcao ? 'Borda Vulcão' : `Borda Tradicional: ${crust.name}`,
      details: crust.description || (isVulcao ? 'Borda especial Vulcão' : 'Adicional de borda recheada tradicional'),
      crust: {
        name: crust.name,
        price: crust.price
      },
      unitPrice: crust.price,
      quantity: 1,
      totalPrice: crust.price
    };

    onAddToCart(cartItem);
    setToastMessage(`${crust.name} adicionada ao pedido!`);
    setTimeout(() => setToastMessage(null), 2500);
  };

  return (
    <section id="bordas" className="py-12 sm:py-16 px-4 bg-[#080808] border-t border-white/10 relative">
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

      <div className="max-w-7xl mx-auto space-y-10">
        {/* Section Header */}
        <div className="text-center space-y-2 max-w-2xl mx-auto">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#FFD21A]/20 border border-[#FFD21A]/40 text-[#FFD21A] text-xs font-black uppercase tracking-widest">
            <span>Turbine Sua Pizza</span>
          </div>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-black uppercase tracking-tight text-white">
            🧀 ESCOLHA SUA BORDA RECHEADA
          </h2>
          <p className="text-sm sm:text-base text-white/70">
            Deixe sua pizza ainda mais irresistível com nossas bordas tradicionais ou a surpreendente Borda Vulcão.
          </p>
        </div>

        {/* 1. Traditional Crusts Area */}
        <div className="space-y-4">
          <div className="flex items-center justify-between border-b border-white/10 pb-3">
            <div className="flex items-center gap-2">
              <span className="text-2xl">🧀</span>
              <div>
                <h3 className="text-lg sm:text-xl font-black text-white uppercase tracking-tight">
                  Bordas Tradicionais
                </h3>
                <p className="text-xs text-white/60">Preço fixo de {formatCurrency(16.00)} para qualquer sabor tradicional</p>
              </div>
            </div>
            <span className="px-3 py-1 rounded-full bg-[#FFD21A]/10 border border-[#FFD21A]/30 text-[#FFD21A] font-black text-xs">
              R$ 16,00
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {traditionalCrusts.map((crust) => (
              <div
                key={crust.id}
                id={`crust-card-${crust.id}`}
                className="rounded-3xl bg-[#141414] border border-white/10 hover:border-[#FFD21A] p-5 flex flex-col justify-between shadow-xl transition-all duration-300 hover:-translate-y-1 group"
              >
                <div className="space-y-3">
                  <div className="w-12 h-12 rounded-2xl bg-[#FFD21A]/10 border border-[#FFD21A]/30 flex items-center justify-center text-2xl group-hover:scale-110 transition-transform">
                    🧀
                  </div>
                  <div>
                    <div className="flex items-center justify-between">
                      <h4 className="text-base font-black text-white uppercase">
                        {crust.name}
                      </h4>
                      <span className="text-xs font-bold text-white/50">Tradicional</span>
                    </div>
                    <p className="text-xs text-white/60 mt-1 line-clamp-2">
                      {crust.description}
                    </p>
                  </div>
                </div>

                <div className="pt-4 mt-4 border-t border-white/10 flex items-center justify-between gap-2">
                  <span className="text-lg font-black text-[#FFD21A]">
                    +{formatCurrency(crust.price)}
                  </span>
                  <button
                    type="button"
                    onClick={() => handleAddCrust(crust)}
                    id={`btn-add-crust-${crust.id}`}
                    aria-label={`Adicionar borda tradicional ${crust.name} por ${formatCurrency(crust.price)}`}
                    className="px-3.5 py-2 rounded-xl bg-[#E52521] hover:bg-[#c71c18] text-white text-xs font-bold uppercase tracking-wider flex items-center gap-1.5 shadow-md shadow-[#E52521]/30 active:scale-95 transition-all cursor-pointer"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>Adicionar</span>
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* 2. Special Option: Borda Vulcão (Displayed Separately) */}
        {vulcaoCrust && (
          <div className="space-y-4 pt-4">
            <div className="flex items-center justify-between border-b border-orange-500/20 pb-3">
              <div className="flex items-center gap-2">
                <span className="text-2xl">🌋</span>
                <div>
                  <h3 className="text-lg sm:text-xl font-black text-white uppercase tracking-tight flex items-center gap-2">
                    <span>Opção Especial: Borda Vulcão</span>
                    <span className="px-2 py-0.5 rounded-full bg-gradient-to-r from-amber-500 to-red-600 text-white text-[10px] font-black uppercase tracking-wider">
                      Destaque da Casa
                    </span>
                  </h3>
                  <p className="text-xs text-white/60">Experiência premium com recheio cremoso e crocante transbordante</p>
                </div>
              </div>
              <span className="px-3 py-1 rounded-full bg-orange-500/20 border border-orange-500/40 text-orange-400 font-black text-xs">
                R$ 28,00
              </span>
            </div>

            <div
              id={`crust-card-${vulcaoCrust.id}`}
              className="relative rounded-3xl bg-gradient-to-br from-[#1c120c] via-[#141414] to-[#1a0f0a] border-2 border-orange-500/50 hover:border-orange-500 p-6 sm:p-8 flex flex-col md:flex-row items-start md:items-center justify-between gap-6 shadow-2xl shadow-orange-950/40 transition-all duration-300 group"
            >
              <div className="flex items-start gap-4 sm:gap-5 flex-1">
                <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl bg-gradient-to-br from-orange-500 to-red-600 text-white flex items-center justify-center text-3xl sm:text-4xl shadow-lg shadow-orange-600/30 shrink-0 group-hover:scale-105 transition-transform">
                  🌋
                </div>
                <div className="space-y-1.5">
                  <div className="flex flex-wrap items-center gap-2">
                    <h4 className="text-xl sm:text-2xl font-black text-white uppercase tracking-tight">
                      {vulcaoCrust.name}
                    </h4>
                    <span className="px-2.5 py-0.5 rounded-full bg-[#FFD21A] text-black text-[10px] font-black uppercase tracking-wider flex items-center gap-1">
                      <Sparkles className="w-3 h-3" />
                      Sensação
                    </span>
                  </div>
                  <p className="text-xs sm:text-sm text-white/80 max-w-2xl leading-relaxed">
                    {vulcaoCrust.description}
                  </p>
                  <div className="flex flex-wrap items-center gap-x-3 gap-y-1 pt-1 text-[11px] sm:text-xs text-orange-400 font-semibold">
                    <span>🔥 Recheio generoso</span>
                    <span className="hidden sm:inline">•</span>
                    <span>🧀 Queijo derretido</span>
                    <span className="hidden sm:inline">•</span>
                    <span>⭐ Mais pedida</span>
                  </div>
                </div>
              </div>

              <div className="flex items-center justify-between w-full md:w-auto md:flex-col md:items-end gap-3 pt-4 md:pt-0 border-t md:border-t-0 border-white/10">
                <div className="text-left md:text-right">
                  <span className="text-xs text-white/50 block font-semibold">Adicional</span>
                  <span className="text-2xl sm:text-3xl font-black text-[#FFD21A]">
                    +{formatCurrency(vulcaoCrust.price)}
                  </span>
                </div>
                <button
                  type="button"
                  onClick={() => handleAddCrust(vulcaoCrust)}
                  id={`btn-add-crust-${vulcaoCrust.id}`}
                  aria-label={`Adicionar borda especial Vulcão ${vulcaoCrust.name} por ${formatCurrency(vulcaoCrust.price)}`}
                  className="px-6 py-3.5 rounded-2xl bg-gradient-to-r from-orange-500 via-red-600 to-[#E52521] hover:from-orange-400 hover:to-[#c71c18] text-white text-xs sm:text-sm font-extrabold uppercase tracking-wider flex items-center gap-2 shadow-xl shadow-red-600/30 active:scale-95 transition-all cursor-pointer border border-orange-400/40"
                >
                  <Flame className="w-4 h-4 text-[#FFD21A]" />
                  <span>Adicionar Borda Vulcão</span>
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </section>
  );
};
