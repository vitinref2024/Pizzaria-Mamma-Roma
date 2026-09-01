import React, { useState, useMemo } from 'react';
import { Search, ShoppingBag, Check, Sparkles, X, Star, Heart, Flame } from 'lucide-react';
import { ProductItem, StuffedCrust, CartItem, ProductCategory } from '../types';
import { formatCurrency } from '../utils/storeUtils';
import { searchAndRankProducts, SearchScoreResult } from '../utils/searchUtils';
import { PizzaCustomizerModal } from './PizzaCustomizerModal';
import { ErrorBoundary } from './ErrorBoundary';

interface MenuSectionProps {
  products: ProductItem[];
  stuffedCrusts: StuffedCrust[];
  activeCategory: ProductCategory;
  onCategoryChange: (category: ProductCategory) => void;
  onAddToCart: (item: CartItem) => void;
  onOpenCart: () => void;
}

export const MenuSection: React.FC<MenuSectionProps> = ({
  products,
  stuffedCrusts,
  activeCategory,
  onCategoryChange,
  onAddToCart,
  onOpenCart
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Pizza Customization Modal State
  const [isCustomizerOpen, setIsCustomizerOpen] = useState<boolean>(false);
  const [selectedPizzaForModal, setSelectedPizzaForModal] = useState<ProductItem | null>(null);
  const [customizerMode, setCustomizerMode] = useState<'choice' | 'half-half'>('choice');

  const categories: { id: ProductCategory; label: string; icon: string }[] = [
    { id: 'todas', label: 'Todas', icon: '✨' },
    { id: 'salgadas', label: 'Salgadas', icon: '🍕' },
    { id: 'doces', label: 'Doces', icon: '🍫' },
    { id: 'promocoes', label: 'Promoções', icon: '🔥' },
    { id: 'combos', label: 'Combos', icon: '🍕' },
    { id: 'bordas', label: 'Bordas', icon: '🧀' },
    { id: 'bebidas', label: 'Bebidas', icon: '🥤' },
  ];

  // Base products filtered by category (if search is not active or scoped)
  const categoryScopedProducts = useMemo(() => {
    return products.filter((product) => {
      if (activeCategory === 'salgadas' && product.category !== 'salgadas') return false;
      if (activeCategory === 'doces' && product.category !== 'doces') return false;
      if (activeCategory === 'promocoes' && !product.promotion) return false;
      if (activeCategory === 'bordas') return false;
      if (activeCategory === 'bebidas') return false;
      return true;
    });
  }, [products, activeCategory]);

  // Intelligent contextual search results
  const searchResults = useMemo(() => {
    if (!searchQuery.trim()) {
      return null;
    }
    // When searching, we search in all pizza products (or within category if specified)
    const baseList = activeCategory === 'todas' || activeCategory === 'promocoes'
      ? products.filter(p => p.category === 'salgadas' || p.category === 'doces')
      : categoryScopedProducts;

    return searchAndRankProducts(baseList, searchQuery);
  }, [products, categoryScopedProducts, activeCategory, searchQuery]);

  const handleOpenCustomizer = (product: ProductItem, mode: 'choice' | 'half-half' = 'choice') => {
    setSelectedPizzaForModal(product);
    setCustomizerMode(mode);
    setIsCustomizerOpen(true);
  };

  const handleOpenGenericHalfHalf = () => {
    const firstPizza = products.find(p => p.category === 'salgadas') || products[0];
    setSelectedPizzaForModal(firstPizza || null);
    setCustomizerMode('half-half');
    setIsCustomizerOpen(true);
  };

  const handleAddToCartWithToast = (item: CartItem) => {
    onAddToCart(item);
    setToastMessage(`${item.name} adicionada ao pedido!`);
    setTimeout(() => setToastMessage(null), 2500);
  };

  const renderProductCard = (product: ProductItem, searchMeta?: SearchScoreResult) => {
    const isIngredientMatch = searchMeta && !searchMeta.isNameMatch && searchMeta.matchedIngredient;

    return (
      <div
        key={product.id}
        id={`product-card-${product.id}`}
        className="rounded-3xl bg-[#141414] border border-white/10 hover:border-white/25 overflow-hidden flex flex-col justify-between shadow-xl transition-all duration-300 hover:-translate-y-1 group cursor-pointer"
        onClick={() => handleOpenCustomizer(product, 'choice')}
      >
        {/* Card Image Banner */}
        <div className="relative h-48 sm:h-52 overflow-hidden bg-black">
          <img
            src={product.image}
            alt={product.name}
            loading="lazy"
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#141414] via-transparent to-transparent" />

          {/* Product Number Badge */}
          {product.number && (
            <div className="absolute top-3 left-3 bg-[#E52521] text-white text-xs font-black px-2.5 py-1 rounded-xl shadow-md border border-white/10">
              Nº {product.number}
            </div>
          )}

          {/* Tag Badges */}
          <div className="absolute top-3 right-3 flex flex-col gap-1 items-end">
            {product.tags?.map((tag) => (
              <span
                key={tag}
                className={`text-[10px] font-black uppercase tracking-wider px-2.5 py-0.5 rounded-full shadow-md ${
                  tag === 'Mais pedida'
                    ? 'bg-[#FFD21A] text-black'
                    : tag === 'Promoção'
                    ? 'bg-[#E52521] text-white'
                    : tag === 'Doce'
                    ? 'bg-amber-600 text-white'
                    : 'bg-black/80 text-white border border-white/20'
                }`}
              >
                {tag}
              </span>
            ))}
          </div>

          {/* Price Tag in Image */}
          <div className="absolute bottom-2.5 right-3 bg-black/80 backdrop-blur-md px-3.5 py-1.5 rounded-xl border border-[#FFD21A]/30">
            <span className="text-lg sm:text-xl font-black text-[#FFD21A]">
              {formatCurrency(product.price)}
            </span>
          </div>
        </div>

        {/* Card Content Body */}
        <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
          <div className="space-y-2">
            <div className="flex items-start justify-between gap-2">
              <h3 className="text-xl font-extrabold text-white uppercase tracking-tight group-hover:text-[#FFD21A] transition-colors leading-tight">
                {product.name}
              </h3>
            </div>

            {/* Contextual Search Match Notice */}
            {isIngredientMatch && (
              <div className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-amber-500/15 border border-amber-500/30 text-amber-300 text-xs font-medium">
                <span>🍃</span>
                <span>Contém {searchMeta.matchedIngredient}</span>
              </div>
            )}

            <p className="text-xs text-white/70 line-clamp-3 leading-relaxed">
              {product.description}
            </p>
          </div>

          {/* Action Buttons */}
          <div className="pt-2 flex items-center gap-2">
            {/* Main Choose / Customize Button */}
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                handleOpenCustomizer(product, 'choice');
              }}
              id={`btn-choose-pizza-${product.id}`}
              className="flex-1 py-3 px-3 rounded-xl bg-[#E52521] hover:bg-[#c71c18] text-white font-extrabold text-xs uppercase tracking-wider flex items-center justify-center gap-1.5 shadow-lg shadow-[#E52521]/30 active:scale-95 transition-all cursor-pointer border border-[#E52521]/50"
            >
              <ShoppingBag className="w-4 h-4 text-[#FFD21A] shrink-0" />
              <span className="truncate">ESCOLHER PIZZA</span>
            </button>

            {/* Half-Half Direct Button */}
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                handleOpenCustomizer(product, 'half-half');
              }}
              id={`btn-half-pizza-${product.id}`}
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
  };

  return (
    <section id="cardapio" className="py-12 sm:py-16 px-4 bg-[#080808] border-t border-white/10 relative">
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
      <ErrorBoundary fallbackTitle="Erro ao abrir personalização de pizza">
        <PizzaCustomizerModal
          isOpen={isCustomizerOpen}
          onClose={() => setIsCustomizerOpen(false)}
          selectedPizza={selectedPizzaForModal}
          products={products}
          stuffedCrusts={stuffedCrusts}
          onAddToCart={handleAddToCartWithToast}
          initialMode={customizerMode}
        />
      </ErrorBoundary>

      <div className="max-w-7xl mx-auto space-y-8">
        {/* Header */}
        <div className="text-center space-y-3 max-w-3xl mx-auto">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#E52521]/15 border border-[#E52521]/40 text-[#E52521] text-xs font-black uppercase tracking-widest">
            <span>Cardápio Completo</span>
          </div>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-black uppercase tracking-tight text-white">
            🍕 NOSSO CARDÁPIO
          </h2>
          <p className="text-sm sm:text-base text-white/70">
            Mais de 50 opções de pizzas salgadas e doces preparadas com ingredientes selecionados e massa fresca. Escolha inteira ou monte <strong>meia a meia</strong>.
          </p>

          {/* Quick Half-Half Banner Button */}
          <div className="pt-2">
            <button
              onClick={handleOpenGenericHalfHalf}
              id="btn-montar-meia-meia-banner"
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-2xl bg-gradient-to-r from-amber-500/20 via-red-500/20 to-amber-500/20 border border-[#FFD21A]/40 text-[#FFD21A] text-xs sm:text-sm font-extrabold uppercase tracking-wider hover:bg-[#FFD21A]/20 transition-all cursor-pointer shadow-lg active:scale-95"
            >
              <span>🌓</span>
              <span>Quer combinar 2 sabores? Toque aqui para Montar Meia a Meia</span>
              <Sparkles className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Search Bar & Category Tabs */}
        <div className="space-y-4 max-w-4xl mx-auto">
          {/* Search Input */}
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
              <Search className="h-5 w-5 text-[#FFD21A]" />
            </div>
            <input
              type="text"
              id="menu-search-input"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Qual pizza você está procurando? (Ex: Calabresa, Mussarela, Frango, Bacon...)"
              className="w-full pl-12 pr-10 py-3.5 sm:py-4 rounded-2xl bg-[#141414] border-2 border-white/10 focus:border-[#E52521] text-white placeholder-white/40 text-sm sm:text-base font-medium outline-none transition-all shadow-inner"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute inset-y-0 right-0 pr-4 flex items-center text-white/50 hover:text-white"
                title="Limpar busca"
              >
                <X className="w-5 h-5" />
              </button>
            )}
          </div>

          {/* Search Active Indicator / Quick Summary */}
          {searchQuery && (
            <div className="flex flex-wrap items-center justify-between gap-2 px-4 py-2.5 rounded-xl bg-white/5 border border-white/10 text-xs text-white/80">
              <div className="flex items-center gap-2">
                <span className="font-bold text-[#FFD21A]">Busca inteligente:</span>
                <span>Resultados para &ldquo;<strong className="text-white">{searchQuery}</strong>&rdquo;</span>
                <span className="px-2 py-0.5 rounded-full bg-[#E52521] text-white font-extrabold text-[10px]">
                  {searchResults ? searchResults.allResults.length : 0} encontrados
                </span>
              </div>
              <button
                onClick={() => setSearchQuery('')}
                className="text-xs text-white/60 hover:text-white underline cursor-pointer"
              >
                Limpar pesquisa
              </button>
            </div>
          )}

          {/* Category Filter Tabs */}
          <div className="flex items-center gap-2 overflow-x-auto pb-2 no-scrollbar justify-start sm:justify-center">
            {categories.map((cat) => {
              const isActive = activeCategory === cat.id;
              return (
                <button
                  key={cat.id}
                  onClick={() => {
                    onCategoryChange(cat.id);
                    if (cat.id === 'promocoes') {
                      document.querySelector('#promocoes')?.scrollIntoView({ behavior: 'smooth' });
                    } else if (cat.id === 'combos') {
                      document.querySelector('#combos')?.scrollIntoView({ behavior: 'smooth' });
                    } else if (cat.id === 'bordas') {
                      document.querySelector('#bordas')?.scrollIntoView({ behavior: 'smooth' });
                    } else if (cat.id === 'bebidas') {
                      document.querySelector('#bebidas')?.scrollIntoView({ behavior: 'smooth' });
                    }
                  }}
                  id={`tab-cat-${cat.id}`}
                  className={`whitespace-nowrap px-4 py-2.5 rounded-xl text-xs sm:text-sm font-bold flex items-center gap-1.5 transition-all cursor-pointer active:scale-95 ${
                    isActive
                      ? 'bg-[#E52521] text-white shadow-lg shadow-[#E52521]/30 border border-[#E52521]'
                      : 'bg-[#141414] text-white/80 hover:bg-[#222222] border border-white/10 hover:border-white/20'
                  }`}
                >
                  <span>{cat.icon}</span>
                  <span>{cat.label}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Dynamic Display: Search View vs Standard Grid */}
        {searchResults ? (
          /* Search Results Mode */
          searchResults.allResults.length === 0 ? (
            <div className="py-16 text-center space-y-4 bg-[#141414] rounded-3xl border border-white/10 max-w-lg mx-auto p-8 shadow-2xl">
              <p className="text-5xl">🔍</p>
              <h3 className="text-xl font-bold text-white">Nenhum sabor encontrado para &ldquo;{searchQuery}&rdquo;</h3>
              <p className="text-xs text-white/60 leading-relaxed">
                Não encontramos correspondência exata ou pizzas com esse ingrediente. Experimente buscar por outro nome ou explore os sabores abaixo:
              </p>
              <div className="flex flex-wrap justify-center gap-2 pt-2">
                {['Mussarela', 'Calabresa', 'Frango', 'Portuguesa', 'Bacon', 'Chocolate'].map(term => (
                  <button
                    key={term}
                    onClick={() => setSearchQuery(term)}
                    className="px-3 py-1.5 rounded-xl bg-white/5 hover:bg-[#FFD21A]/20 hover:text-[#FFD21A] text-white text-xs font-semibold border border-white/10 transition-colors"
                  >
                    {term}
                  </button>
                ))}
              </div>
              <div className="pt-2">
                <button
                  onClick={() => setSearchQuery('')}
                  className="px-6 py-2.5 rounded-xl bg-[#E52521] text-white text-xs font-bold uppercase tracking-wider"
                >
                  Ver Cardápio Completo
                </button>
              </div>
            </div>
          ) : (
            <div className="space-y-10">
              {/* SECTION 1: Mais Relevantes (Direct name matches) */}
              {searchResults.directMatches.length > 0 && (
                <div className="space-y-4">
                  <div className="flex items-center gap-2 border-b border-white/10 pb-3">
                    <div className="p-1.5 rounded-lg bg-[#FFD21A]/20 text-[#FFD21A]">
                      <Star className="w-5 h-5 fill-[#FFD21A]" />
                    </div>
                    <div>
                      <h3 className="text-xl font-extrabold text-white uppercase tracking-tight flex items-center gap-2">
                        Mais Relevantes
                        <span className="text-xs font-bold px-2 py-0.5 rounded-full bg-[#FFD21A] text-black">
                          {searchResults.directMatches.length}
                        </span>
                      </h3>
                      <p className="text-xs text-white/60">
                        Pizzas que correspondem diretamente à busca por &ldquo;{searchQuery}&rdquo;
                      </p>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                    {searchResults.directMatches.map(res => renderProductCard(res.product, res))}
                  </div>
                </div>
              )}

              {/* SECTION 2: Você também pode gostar (Related / Ingredient matches) */}
              {searchResults.relatedMatches.length > 0 && (
                <div className="space-y-4 pt-2">
                  <div className="flex items-center gap-2 border-b border-white/10 pb-3">
                    <div className="p-1.5 rounded-lg bg-[#168A45]/20 text-[#168A45]">
                      <Heart className="w-5 h-5 fill-[#168A45]" />
                    </div>
                    <div>
                      <h3 className="text-xl font-extrabold text-white uppercase tracking-tight flex items-center gap-2">
                        Você Também Pode Gostar
                        <span className="text-xs font-bold px-2 py-0.5 rounded-full bg-white/10 text-white">
                          {searchResults.relatedMatches.length}
                        </span>
                      </h3>
                      <p className="text-xs text-white/60">
                        {searchResults.directMatches.length > 0
                          ? `Outras opções deliciosas que contêm ingredientes relacionados a "${searchQuery}"`
                          : `Pizzas que contêm "${searchQuery}" nos ingredientes e receita`}
                      </p>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                    {searchResults.relatedMatches.map(res => renderProductCard(res.product, res))}
                  </div>
                </div>
              )}
            </div>
          )
        ) : (
          /* Standard Category Grid Mode */
          categoryScopedProducts.length === 0 ? (
            <div className="py-16 text-center space-y-3 bg-[#141414] rounded-3xl border border-white/10 max-w-lg mx-auto p-8">
              <p className="text-4xl">🍕</p>
              <p className="text-lg font-bold text-white">Nenhuma pizza nesta categoria</p>
              <p className="text-xs text-white/60">
                Selecione outra categoria acima para ver as opções disponíveis.
              </p>
              <button
                onClick={() => onCategoryChange('todas')}
                className="px-5 py-2.5 rounded-xl bg-[#E52521] text-white text-xs font-bold uppercase tracking-wider"
              >
                Ver Todas as Pizzas
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {categoryScopedProducts.map((product) => renderProductCard(product))}
            </div>
          )
        )}
      </div>
    </section>
  );
};
