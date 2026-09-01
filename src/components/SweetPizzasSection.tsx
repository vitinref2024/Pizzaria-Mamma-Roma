import React, { useState } from 'react';
import { ShoppingBag, Check, Sparkles } from 'lucide-react';
import { ProductItem, StuffedCrust, CartItem } from '../types';
import { formatCurrency } from '../utils/storeUtils';
import { PizzaCustomizerModal } from './PizzaCustomizerModal';
import { ErrorBoundary } from './ErrorBoundary';

interface SweetPizzasSectionProps {
  products: ProductItem[];
  stuffedCrusts?: StuffedCrust[];
  onAddToCart: (item: CartItem) => void;
  onOpenCart: () => void;
}

export const SweetPizzasSection: React.FC<SweetPizzasSectionProps> = ({
  products,
  stuffedCrusts = [],
  onAddToCart,
  onOpenCart
}) => {
  const sweetProducts = products.filter(p => p.category === 'doces');
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Customizer Modal State
  const [isCustomizerOpen, setIsCustomizerOpen] = useState(false);
  const [selectedSweetPizza, setSelectedSweetPizza] = useState<ProductItem | null>(null);
  const [customizerMode, setCustomizerMode] = useState<'choice' | 'half-half'>('choice');

  const handleOpenCustomizer = (product: ProductItem, mode: 'choice' | 'half-half' = 'choice') => {
    setSelectedSweetPizza(product);
    setCustomizerMode(mode);
    setIsCustomizerOpen(true);
  };

  const handleAddToCartWithToast = (item: CartItem) => {
    onAddToCart(item);
    setToastMessage(`${item.name} adicionada ao pedido!`);
    setTimeout(() => setToastMessage(null), 2500);
  };

  return (
    <section id="doces" className="py-12 sm:py-16 px-4 bg-[#0a0a0a] border-t border-white/10 relative">
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

      {/* Pizza Customizer Modal */}
      <ErrorBoundary fallbackTitle="Erro ao abrir personalização de pizza doce">
        <PizzaCustomizerModal
          isOpen={isCustomizerOpen}
          onClose={() => setIsCustomizerOpen(false)}
          selectedPizza={selectedSweetPizza}
          products={products}
          stuffedCrusts={stuffedCrusts}
          onAddToCart={handleAddToCartWithToast}
          initialMode={customizerMode}
        />
      </ErrorBoundary>

      <div className="max-w-7xl mx-auto space-y-8">
        {/* Section Header */}
        <div className="text-center space-y-2 max-w-2xl mx-auto">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/20 border border-amber-500/40 text-amber-400 text-xs font-black uppercase tracking-widest">
            <span>Sobremesas Especiais</span>
          </div>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-black uppercase tracking-tight text-white">
            🍫 PIZZAS DOCES
          </h2>
          <p className="text-sm sm:text-base text-white/70">
            Finalize seu jantar com chave de ouro! Escolha pizzas doces inteiras ou combine meia a meia.
          </p>
        </div>

        {/* Sweet Pizzas Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {sweetProducts.map((product) => {
            return (
              <div
                key={product.id}
                id={`sweet-card-${product.id}`}
                className="rounded-3xl bg-[#141414] border border-amber-500/20 hover:border-amber-500/50 overflow-hidden flex flex-col justify-between shadow-xl transition-all duration-300 hover:-translate-y-1 group cursor-pointer"
                onClick={() => handleOpenCustomizer(product, 'choice')}
              >
                {/* Image & Badges */}
                <div className="relative h-48 overflow-hidden bg-black">
                  <img
                    src={product.image}
                    alt={product.name}
                    loading="lazy"
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#141414] via-transparent to-transparent" />

                  {product.number && (
                    <div className="absolute top-3 left-3 bg-amber-600 text-white text-xs font-black px-2.5 py-1 rounded-xl shadow-md">
                      Nº {product.number}
                    </div>
                  )}

                  {product.tags?.map((tag) => (
                    <div key={tag} className="absolute top-3 right-3 bg-[#FFD21A] text-black text-[10px] font-black uppercase px-2.5 py-0.5 rounded-full shadow-md">
                      {tag}
                    </div>
                  ))}

                  <div className="absolute bottom-2.5 right-3 bg-black/80 backdrop-blur-md px-3.5 py-1.5 rounded-xl border border-amber-400/30">
                    <span className="text-lg sm:text-xl font-black text-[#FFD21A]">
                      {formatCurrency(product.price)}
                    </span>
                  </div>
                </div>

                {/* Content */}
                <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
                  <div className="space-y-1.5">
                    <h3 className="text-xl font-extrabold text-white uppercase tracking-tight break-words group-hover:text-[#FFD21A] transition-colors">
                      {product.name}
                    </h3>
                    <p className="text-xs text-white/70 line-clamp-2 leading-relaxed">
                      {product.description}
                    </p>
                  </div>

                  {/* Action Buttons */}
                  <div className="pt-2 flex items-center gap-2">
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleOpenCustomizer(product, 'choice');
                      }}
                      id={`btn-choose-sweet-${product.id}`}
                      className="flex-1 py-3 px-3 rounded-xl bg-gradient-to-r from-amber-600 to-amber-700 hover:from-amber-500 hover:to-amber-600 text-white font-extrabold text-xs uppercase tracking-wider flex items-center justify-center gap-1.5 shadow-lg shadow-amber-600/30 active:scale-95 transition-all cursor-pointer border border-amber-500/40"
                    >
                      <ShoppingBag className="w-4 h-4 text-[#FFD21A] shrink-0" />
                      <span className="truncate">ESCOLHER PIZZA</span>
                    </button>

                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleOpenCustomizer(product, 'half-half');
                      }}
                      id={`btn-half-sweet-${product.id}`}
                      title="Montar Meia a Meia com este sabor"
                      className="py-3 px-3 rounded-xl bg-white/10 hover:bg-[#FFD21A] hover:text-black text-white font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-1 border border-white/15 transition-all cursor-pointer shrink-0 active:scale-95"
                    >
                      <span>🌓</span>
                      <span className="hidden sm:inline">Meia a Meia</span>
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
