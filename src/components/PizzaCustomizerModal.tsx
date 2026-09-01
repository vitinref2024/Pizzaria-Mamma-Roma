import React, { useState, useMemo, useEffect } from 'react';
import { X, Check, ShoppingBag, Plus, Minus, Search, AlertCircle, Info, ArrowLeft, ArrowRight, Edit3 } from 'lucide-react';
import { ProductItem, StuffedCrust, CartItem } from '../types';
import { formatCurrency } from '../utils/storeUtils';
import { searchAndRankProducts } from '../utils/searchUtils';

interface PizzaCustomizerModalProps {
  isOpen: boolean;
  onClose: () => void;
  selectedPizza: ProductItem | null;
  products: ProductItem[];
  stuffedCrusts: StuffedCrust[];
  onAddToCart: (item: CartItem) => void;
  initialMode?: 'choice' | 'half-half';
}

export const PizzaCustomizerModal: React.FC<PizzaCustomizerModalProps> = ({
  isOpen,
  onClose,
  selectedPizza,
  products = [],
  stuffedCrusts = [],
  onAddToCart,
  initialMode = 'choice'
}) => {
  // Safe products array filtering only available pizzas (salgadas and doces)
  const availablePizzas = useMemo(() => {
    if (!Array.isArray(products)) return [];
    return products.filter(
      p => p && (p.category === 'salgadas' || p.category === 'doces') && p.available !== false
    );
  }, [products]);

  // Modal Step: 'choice' (Escolher Inteira vs Meia a Meia) | 'half-half' (Selecionar Sabores) | 'border' (Borda & Quantidade)
  const [currentStep, setCurrentStep] = useState<'choice' | 'half-half' | 'border'>('choice');
  const [isHalfHalf, setIsHalfHalf] = useState<boolean>(false);

  // Flavors for halves
  const [flavor1, setFlavor1] = useState<ProductItem | null>(null);
  const [flavor2, setFlavor2] = useState<ProductItem | null>(null);

  // Active half being selected by user: 1 or 2
  const [activeHalfSlot, setActiveHalfSlot] = useState<1 | 2>(2);

  // Stuffed Crust, Quantity & Observation
  const [selectedCrustId, setSelectedCrustId] = useState<string>('');
  const [quantity, setQuantity] = useState<number>(1);
  const [observation, setObservation] = useState<string>('');

  // Search & Filters for half-half selection
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [categoryFilter, setCategoryFilter] = useState<'todas' | 'salgadas' | 'doces'>('todas');
  const [validationError, setValidationError] = useState<string | null>(null);

  // Sync state whenever modal opens or props change
  useEffect(() => {
    if (isOpen) {
      const fallbackPizza = availablePizzas.length > 0 ? availablePizzas[0] : null;
      const initialFlavor = selectedPizza || fallbackPizza;

      setFlavor1(initialFlavor);
      setFlavor2(null);
      setSelectedCrustId('');
      setQuantity(1);
      setObservation('');
      setSearchQuery('');
      setCategoryFilter('todas');
      setValidationError(null);

      if (initialMode === 'half-half') {
        setIsHalfHalf(true);
        setCurrentStep('half-half');
        // If we already have a 1st flavor, prompt user for 2nd flavor; otherwise prompt 1st
        setActiveHalfSlot(initialFlavor ? 2 : 1);
      } else {
        setIsHalfHalf(false);
        setCurrentStep('choice');
        setActiveHalfSlot(2);
      }
    }
  }, [isOpen, selectedPizza, availablePizzas, initialMode]);

  // Filter and rank list for flavors using search
  const filteredFlavors = useMemo(() => {
    const baseList = availablePizzas.filter(p => {
      if (!p) return false;
      if (categoryFilter === 'salgadas' && p.category !== 'salgadas') return false;
      if (categoryFilter === 'doces' && p.category !== 'doces') return false;
      return true;
    });

    if (!searchQuery.trim()) {
      return baseList;
    }

    const ranked = searchAndRankProducts(baseList, searchQuery);
    return ranked.allResults.map(r => r.product).filter(Boolean);
  }, [availablePizzas, categoryFilter, searchQuery]);

  // Safe early return if closed (after all hooks are called)
  if (!isOpen) return null;

  // Selected Crust Object
  const chosenCrust = (Array.isArray(stuffedCrusts) ? stuffedCrusts : []).find(c => c && c.id === selectedCrustId) || null;
  const crustPrice = chosenCrust ? Number(chosenCrust.price) || 0 : 0;

  // Safe flavor prices
  const flavor1Price = flavor1 ? Number(flavor1.price) || 0 : 0;
  const flavor2Price = flavor2 ? Number(flavor2.price) || 0 : 0;

  // Base price calculation:
  // For Half-Half: always the price of the most expensive flavor between the two!
  // For Single Pizza: price of flavor1
  const basePizzaPrice = isHalfHalf
    ? (flavor1 && flavor2 ? Math.max(flavor1Price, flavor2Price) : (flavor1 ? flavor1Price : (flavor2 ? flavor2Price : 0)))
    : flavor1Price;

  const unitPrice = basePizzaPrice + crustPrice;
  const totalPrice = unitPrice * (Math.max(1, quantity) || 1);

  // ==========================================
  // HANDLERS
  // ==========================================

  // Action: Choose "Pizza Inteira"
  const handleChooseInteira = () => {
    setIsHalfHalf(false);
    setFlavor2(null);
    setValidationError(null);
    setCurrentStep('border');
  };

  // Action: Choose "Meia a Meia"
  const handleChooseMeiaMeia = () => {
    setIsHalfHalf(true);
    setValidationError(null);
    setCurrentStep('half-half');
    setActiveHalfSlot(flavor1 ? 2 : 1);
  };

  // Action: Select a flavor for the active half slot
  const handleSelectFlavorForSlot = (product: ProductItem) => {
    if (!product) return;
    setValidationError(null);

    if (activeHalfSlot === 1) {
      setFlavor1(product);
      // If flavor 2 is already selected and identical, clear flavor 2
      if (flavor2 && flavor2.id === product.id) {
        setFlavor2(null);
      }
      // If 2nd flavor is not selected yet, automatically focus 2nd slot
      if (!flavor2) {
        setActiveHalfSlot(2);
      }
    } else {
      // Slot 2
      if (flavor1 && flavor1.id === product.id) {
        setValidationError(`Você já selecionou "${flavor1.name}" para a 1ª metade. Para pizza de 1 só sabor, escolha 'Pizza Inteira', ou escolha outro sabor para combinar.`);
        return;
      }
      setFlavor2(product);
    }
  };

  // Action: Advance from half-half to border
  const handleProceedFromHalfHalfToBorder = () => {
    if (!flavor1) {
      setValidationError('Por favor, escolha o 1º sabor da pizza.');
      setActiveHalfSlot(1);
      return;
    }
    if (!flavor2) {
      setValidationError('Por favor, escolha o 2º sabor da pizza.');
      setActiveHalfSlot(2);
      return;
    }
    setValidationError(null);
    setCurrentStep('border');
  };

  // Action: Final Add to Cart
  const handleAddToCart = () => {
    if (isHalfHalf) {
      if (!flavor1 || !flavor2) {
        setValidationError('Por favor, selecione os 2 sabores da pizza meia a meia.');
        setCurrentStep('half-half');
        return;
      }

      const f1Name = flavor1.number ? `Nº ${flavor1.number} ${flavor1.name}` : flavor1.name;
      const f2Name = flavor2.number ? `Nº ${flavor2.number} ${flavor2.name}` : flavor2.name;

      const detailsList = [
        `• 1ª Metade (50%): ${f1Name}`,
        `• 2ª Metade (50%): ${f2Name}`
      ];
      if (chosenCrust) {
        detailsList.push(`• Borda Recheada: ${chosenCrust.name}`);
      }
      if (observation.trim()) {
        detailsList.push(`• Obs: ${observation.trim()}`);
      }

      const cartItem: CartItem = {
        cartId: `half-${flavor1.id}-${flavor2.id}-${Date.now()}`,
        type: 'pizza',
        isHalfHalf: true,
        name: 'Pizza Grande — Meia a Meia',
        size: 'Grande (8 fatias / 35cm)',
        details: detailsList.join('\n'),
        flavor: `Meia ${flavor1.name} / Meia ${flavor2.name}`,
        notes: observation.trim() || undefined,
        halfFlavors: {
          flavor1: {
            id: flavor1.id,
            name: flavor1.name,
            price: Number(flavor1.price) || 0,
            number: flavor1.number
          },
          flavor2: {
            id: flavor2.id,
            name: flavor2.name,
            price: Number(flavor2.price) || 0,
            number: flavor2.number
          }
        },
        crust: chosenCrust ? { name: chosenCrust.name, price: Number(chosenCrust.price) || 0 } : undefined,
        unitPrice,
        quantity,
        totalPrice,
        image: flavor1.image || flavor2.image
      };

      onAddToCart(cartItem);
    } else {
      // Single Pizza
      if (!flavor1) {
        setValidationError('Por favor, selecione um sabor de pizza.');
        return;
      }

      const isSweet = flavor1.category === 'doces';
      const sizeLabel = isSweet ? 'Brotinho Doce (4 fatias)' : 'Grande (8 fatias / 35cm)';
      const detailsList: string[] = [];
      if (chosenCrust) {
        detailsList.push(`Borda Recheada: ${chosenCrust.name}`);
      } else {
        detailsList.push('Massa tradicional crocante');
      }
      if (observation.trim()) {
        detailsList.push(`Obs: ${observation.trim()}`);
      }

      const cartItem: CartItem = {
        cartId: `pizza-${flavor1.id}-${Date.now()}`,
        type: 'pizza',
        isHalfHalf: false,
        name: isSweet ? `Pizza Doce — ${flavor1.name}` : `Pizza Grande — ${flavor1.name}`,
        size: sizeLabel,
        number: flavor1.number,
        flavor: flavor1.name,
        notes: observation.trim() || undefined,
        details: detailsList.join(' • '),
        crust: chosenCrust ? { name: chosenCrust.name, price: Number(chosenCrust.price) || 0 } : undefined,
        unitPrice,
        quantity,
        totalPrice,
        image: flavor1.image
      };

      onAddToCart(cartItem);
    }

    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto flex items-center justify-center p-3 sm:p-4 animate-in fade-in duration-200">
      {/* Backdrop */}
      <div
        onClick={onClose}
        className="fixed inset-0 bg-black/85 backdrop-blur-sm transition-opacity"
      />

      {/* Modal Card */}
      <div
        className="relative w-full max-w-2xl bg-[#111111] border border-white/15 rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[92vh] z-10 animate-in zoom-in-95 duration-200"
        onClick={(e) => e.stopPropagation()}
      >
        {/* ========================================================= */}
        {/* HEADER                                                    */}
        {/* ========================================================= */}
        <div className="p-4 sm:p-5 bg-[#161616] border-b border-white/10 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-[#E52521] text-white flex items-center justify-center text-xl shadow-lg shadow-[#E52521]/30 shrink-0">
              🍕
            </div>
            <div>
              <h3 className="text-base sm:text-lg font-black text-white uppercase tracking-tight">
                {currentStep === 'choice' && 'Personalizar sua Pizza'}
                {currentStep === 'half-half' && 'Montar Pizza Meia a Meia (2 Sabores)'}
                {currentStep === 'border' && 'Escolha a Borda e Quantidade'}
              </h3>
              <p className="text-xs text-[#FFD21A] font-semibold">
                Pizzaria Mamma Roma • Tradição & Qualidade
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            id="close-pizza-customizer-btn"
            className="p-2 rounded-xl bg-white/5 hover:bg-white/10 text-white/70 hover:text-white transition-colors cursor-pointer"
            aria-label="Fechar"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* ========================================================= */}
        {/* SCROLLABLE BODY                                           */}
        {/* ========================================================= */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-5">

          {/* ========================================================= */}
          {/* STEP 1: CHOICE ("Como você quer sua pizza?")               */}
          {/* ========================================================= */}
          {currentStep === 'choice' && (
            <div className="space-y-5 animate-in fade-in">
              {/* Selected Pizza Card Summary */}
              {flavor1 ? (
                <div className="p-4 rounded-2xl bg-[#181818] border border-white/10 flex items-center gap-3.5">
                  <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-xl overflow-hidden bg-black shrink-0 border border-white/10 flex items-center justify-center">
                    {flavor1.image ? (
                      <img
                        src={flavor1.image}
                        alt={flavor1.name}
                        width={80}
                        height={80}
                        loading="lazy"
                        decoding="async"
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <span className="text-3xl">🍕</span>
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-1.5 flex-wrap">
                      {flavor1.number && (
                        <span className="bg-[#E52521] text-white text-[10px] font-black px-2 py-0.5 rounded-md">
                          Nº {flavor1.number}
                        </span>
                      )}
                      <h4 className="text-base sm:text-lg font-extrabold text-white uppercase tracking-tight truncate">
                        {flavor1.name}
                      </h4>
                    </div>
                    {flavor1.description && (
                      <p className="text-xs text-white/70 line-clamp-2 mt-0.5">
                        {flavor1.description}
                      </p>
                    )}
                    <span className="text-sm sm:text-base font-black text-[#FFD21A] mt-1 block">
                      {formatCurrency(flavor1.price)}
                    </span>
                  </div>
                </div>
              ) : (
                <div className="p-4 rounded-2xl bg-[#181818] border border-white/10 text-center">
                  <p className="text-sm text-white/80">Selecione como deseja montar sua pizza:</p>
                </div>
              )}

              {/* Question Heading */}
              <div className="text-center space-y-1 py-1">
                <h3 className="text-lg sm:text-xl font-black text-white uppercase tracking-tight">
                  Como você deseja pedir esta pizza?
                </h3>
                <p className="text-xs sm:text-sm text-white/60">
                  Escolha se deseja a pizza inteira deste sabor ou combinada em 2 metades (meia a meia).
                </p>
              </div>

              {/* Two Prominent Options */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                
                {/* OPTION 1: Pizza Inteira */}
                <div
                  onClick={handleChooseInteira}
                  id="option-pizza-inteira"
                  className="p-5 rounded-2xl bg-[#181818] hover:bg-[#202020] border-2 border-white/10 hover:border-[#E52521] transition-all cursor-pointer flex flex-col justify-between group shadow-lg hover:shadow-[#E52521]/15 active:scale-[0.98]"
                >
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-3xl">🍕</span>
                      <span className="bg-white/10 text-white/90 text-[10px] font-extrabold uppercase px-2.5 py-1 rounded-full">
                        100% este sabor
                      </span>
                    </div>
                    <div>
                      <h4 className="text-base sm:text-lg font-black text-white uppercase tracking-tight group-hover:text-[#FFD21A] transition-colors">
                        Pizza Inteira
                      </h4>
                      <p className="text-xs text-white/70 mt-1 leading-relaxed">
                        A pizza será feita inteiramente com o sabor <strong>{flavor1?.name || 'escolhido'}</strong>.
                      </p>
                    </div>
                  </div>

                  <div className="mt-5 pt-3 border-t border-white/10 flex items-center justify-between">
                    <span className="text-xs font-black text-[#FFD21A]">
                      {formatCurrency(flavor1?.price)}
                    </span>
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleChooseInteira();
                      }}
                      id="btn-continuar-inteira"
                      className="px-3.5 py-2 rounded-xl bg-[#E52521] group-hover:bg-[#ff2f2b] text-white text-xs font-black uppercase tracking-wider flex items-center gap-1.5 shadow-md shadow-[#E52521]/30 transition-colors cursor-pointer"
                    >
                      <span>Avançar com este sabor</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>

                {/* OPTION 2: Meia a Meia */}
                <div
                  onClick={handleChooseMeiaMeia}
                  id="option-pizza-meia-meia"
                  className="p-5 rounded-2xl bg-[#181818] hover:bg-[#202020] border-2 border-[#FFD21A]/30 hover:border-[#FFD21A] transition-all cursor-pointer flex flex-col justify-between group shadow-lg hover:shadow-[#FFD21A]/15 active:scale-[0.98]"
                >
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-3xl">🌓</span>
                      <span className="bg-[#FFD21A] text-black text-[10px] font-black uppercase px-2.5 py-1 rounded-full shadow-sm">
                        2 Sabores (50% / 50%)
                      </span>
                    </div>
                    <div>
                      <h4 className="text-base sm:text-lg font-black text-white uppercase tracking-tight group-hover:text-[#FFD21A] transition-colors">
                        Pizza Meia a Meia
                      </h4>
                      <p className="text-xs text-white/70 mt-1 leading-relaxed">
                        Combine <strong>{flavor1?.name || 'este sabor'}</strong> com qualquer outro sabor do cardápio.
                      </p>
                    </div>
                  </div>

                  <div className="mt-5 pt-3 border-t border-white/10 flex items-center justify-between">
                    <span className="text-[10px] text-white/50 leading-tight">
                      Preço pelo maior valor
                    </span>
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleChooseMeiaMeia();
                      }}
                      id="btn-escolher-segundo-sabor"
                      className="px-3.5 py-2 rounded-xl bg-[#FFD21A] hover:bg-yellow-300 text-black text-xs font-black uppercase tracking-wider flex items-center gap-1.5 shadow-md shadow-[#FFD21A]/30 transition-colors cursor-pointer"
                    >
                      <span>Montar Meia a Meia</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>

              </div>
            </div>
          )}

          {/* ========================================================= */}
          {/* STEP 2: HALF-HALF FLAVORS SELECTION                       */}
          {/* ========================================================= */}
          {currentStep === 'half-half' && (
            <div className="space-y-4 animate-in fade-in">
              
              {/* Back to Choice & Step Info */}
              <div className="flex items-center justify-between">
                <button
                  type="button"
                  onClick={() => setCurrentStep('choice')}
                  className="text-xs text-white/70 hover:text-white flex items-center gap-1 font-bold cursor-pointer py-1.5 px-3 rounded-lg bg-white/5 hover:bg-white/10 transition-colors"
                >
                  <ArrowLeft className="w-3.5 h-3.5" />
                  <span>Voltar</span>
                </button>
                <div className="flex items-center gap-2">
                  <span className="text-xs font-black text-[#FFD21A] uppercase tracking-wider">
                    Etapa: Seleção das Metades
                  </span>
                </div>
              </div>

              {/* Visual 2-Halves Interactive Selection Cards */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                
                {/* 1ª Metade Card */}
                <div
                  onClick={() => {
                    setActiveHalfSlot(1);
                    setValidationError(null);
                  }}
                  id="slot-half-1"
                  className={`p-3.5 rounded-2xl border-2 transition-all cursor-pointer flex flex-col justify-between gap-2 ${
                    activeHalfSlot === 1
                      ? 'bg-[#1e1e1e] border-[#168A45] ring-2 ring-[#168A45]/30 shadow-lg'
                      : flavor1
                      ? 'bg-[#161616] border-[#168A45]/60 hover:border-[#168A45]'
                      : 'bg-[#141414] border-dashed border-white/20'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className={`text-[10px] font-black uppercase px-2 py-0.5 rounded-md flex items-center gap-1 ${
                      flavor1 ? 'bg-[#168A45] text-white' : 'bg-white/10 text-white/70'
                    }`}>
                      <span>1ª Metade (50%)</span>
                      {flavor1 && <Check className="w-3 h-3 text-white" />}
                    </span>

                    {activeHalfSlot === 1 ? (
                      <span className="text-[10px] font-extrabold text-[#168A45] bg-[#168A45]/15 px-2 py-0.5 rounded-md flex items-center gap-1">
                        <Edit3 className="w-3 h-3" />
                        <span>Escolhendo agora</span>
                      </span>
                    ) : (
                      <span className="text-[10px] text-white/40 hover:text-white/80">
                        Clique para alterar
                      </span>
                    )}
                  </div>

                  <div className="min-w-0">
                    <h5 className="text-sm font-black text-white uppercase truncate">
                      {flavor1 ? (flavor1.number ? `Nº ${flavor1.number} ${flavor1.name}` : flavor1.name) : 'Selecione o 1º sabor abaixo'}
                    </h5>
                    {flavor1 ? (
                      <div className="flex items-center justify-between mt-1">
                        <p className="text-[11px] text-white/60 truncate max-w-[170px]">
                          {flavor1.description || ''}
                        </p>
                        <span className="text-xs font-black text-[#FFD21A] shrink-0">
                          {formatCurrency(flavor1.price)}
                        </span>
                      </div>
                    ) : (
                      <span className="text-[11px] text-amber-400 font-bold">
                        Pendente de seleção
                      </span>
                    )}
                  </div>
                </div>

                {/* 2ª Metade Card */}
                <div
                  onClick={() => {
                    setActiveHalfSlot(2);
                    setValidationError(null);
                  }}
                  id="slot-half-2"
                  className={`p-3.5 rounded-2xl border-2 transition-all cursor-pointer flex flex-col justify-between gap-2 ${
                    activeHalfSlot === 2
                      ? 'bg-[#1e1e1e] border-[#FFD21A] ring-2 ring-[#FFD21A]/30 shadow-lg'
                      : flavor2
                      ? 'bg-[#161616] border-[#FFD21A]/60 hover:border-[#FFD21A]'
                      : 'bg-[#141414] border-dashed border-amber-500/40 hover:border-amber-500'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className={`text-[10px] font-black uppercase px-2 py-0.5 rounded-md flex items-center gap-1 ${
                      flavor2 ? 'bg-[#FFD21A] text-black' : 'bg-amber-500/20 text-amber-300'
                    }`}>
                      <span>2ª Metade (50%)</span>
                      {flavor2 && <Check className="w-3 h-3 text-black" />}
                    </span>

                    {activeHalfSlot === 2 ? (
                      <span className="text-[10px] font-extrabold text-[#FFD21A] bg-[#FFD21A]/15 px-2 py-0.5 rounded-md flex items-center gap-1">
                        <Edit3 className="w-3 h-3" />
                        <span>Escolhendo agora</span>
                      </span>
                    ) : (
                      <span className="text-[10px] text-white/40 hover:text-white/80">
                        Clique para alterar
                      </span>
                    )}
                  </div>

                  <div className="min-w-0">
                    <h5 className="text-sm font-black text-white uppercase truncate">
                      {flavor2 ? (flavor2.number ? `Nº ${flavor2.number} ${flavor2.name}` : flavor2.name) : 'Toque em um sabor da lista'}
                    </h5>
                    {flavor2 ? (
                      <div className="flex items-center justify-between mt-1">
                        <p className="text-[11px] text-white/60 truncate max-w-[170px]">
                          {flavor2.description || ''}
                        </p>
                        <span className="text-xs font-black text-[#FFD21A] shrink-0">
                          {formatCurrency(flavor2.price)}
                        </span>
                      </div>
                    ) : (
                      <span className="text-[11px] text-amber-400 font-bold">
                        Pendente de seleção
                      </span>
                    )}
                  </div>
                </div>

              </div>

              {/* Price Calculation Rule Callout */}
              <div className="p-3 rounded-2xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-between gap-3 text-xs">
                <div className="flex items-center gap-2 text-amber-200 min-w-0">
                  <Info className="w-4 h-4 text-[#FFD21A] shrink-0" />
                  <span className="truncate sm:whitespace-normal">
                    Preço da meia a meia: <strong>Cobrado pelo sabor de maior valor</strong>.
                  </span>
                </div>
                {flavor1 && flavor2 && (
                  <div className="text-right shrink-0 bg-black/50 px-2.5 py-1 rounded-xl border border-amber-400/30">
                    <span className="text-[10px] text-white/60 block">Base:</span>
                    <span className="text-xs font-black text-[#FFD21A]">
                      {formatCurrency(Math.max(flavor1Price, flavor2Price))}
                    </span>
                  </div>
                )}
              </div>

              {/* Error Message if any */}
              {validationError && (
                <div className="p-3 rounded-xl bg-red-500/20 border border-red-500/50 text-red-200 text-xs flex items-center gap-2 animate-in fade-in">
                  <AlertCircle className="w-4 h-4 shrink-0 text-red-400" />
                  <span>{validationError}</span>
                </div>
              )}

              {/* Search Bar & Category Filter */}
              <div className="space-y-2.5 pt-1">
                <div className="flex items-center justify-between text-xs font-bold text-white/80">
                  <span className="flex items-center gap-1.5">
                    <span>Lista de Sabores para a</span>
                    <span className={`px-2 py-0.5 rounded text-[11px] font-black ${
                      activeHalfSlot === 1 ? 'bg-[#168A45] text-white' : 'bg-[#FFD21A] text-black'
                    }`}>
                      {activeHalfSlot === 1 ? '1ª Metade' : '2ª Metade'}
                    </span>
                  </span>
                  <span className="text-white/40 text-[11px]">
                    {filteredFlavors.length} opções
                  </span>
                </div>

                <div className="relative">
                  <Search className="w-4 h-4 text-[#FFD21A] absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    id="half-flavor-search"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Pesquisar sabor ou ingrediente (Ex: Calabresa, Frango, 08...)"
                    className="w-full pl-10 pr-9 py-2.5 rounded-xl bg-black border border-white/20 text-white text-xs placeholder-white/40 focus:border-[#E52521] outline-none"
                  />
                  {searchQuery && (
                    <button
                      type="button"
                      onClick={() => setSearchQuery('')}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-white/50 hover:text-white"
                    >
                      <X className="w-3.5 h-3.5" />
                    </button>
                  )}
                </div>

                {/* Category Pills */}
                <div className="flex items-center gap-1.5">
                  {(['todas', 'salgadas', 'doces'] as const).map((cat) => (
                    <button
                      key={cat}
                      type="button"
                      onClick={() => setCategoryFilter(cat)}
                      className={`px-3 py-1 rounded-lg text-xs font-bold capitalize transition-colors cursor-pointer ${
                        categoryFilter === cat
                          ? 'bg-[#E52521] text-white shadow-sm'
                          : 'bg-white/5 text-white/70 hover:bg-white/10'
                      }`}
                    >
                      {cat}
                    </button>
                  ))}
                </div>
              </div>

              {/* Flavors List Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 max-h-56 overflow-y-auto pr-1">
                {filteredFlavors.length === 0 ? (
                  <div className="col-span-full py-8 text-center text-white/50 text-xs">
                    Nenhum sabor encontrado para "{searchQuery}".
                  </div>
                ) : (
                  filteredFlavors.map((item) => {
                    const isSelectedAs1 = flavor1?.id === item.id;
                    const isSelectedAs2 = flavor2?.id === item.id;
                    const isCurrentlyActiveSlotSelected = (activeHalfSlot === 1 && isSelectedAs1) || (activeHalfSlot === 2 && isSelectedAs2);

                    return (
                      <button
                        key={item.id}
                        type="button"
                        onClick={() => handleSelectFlavorForSlot(item)}
                        id={`flavor-item-${item.id}`}
                        className={`p-3 rounded-xl text-left border transition-all cursor-pointer flex items-center justify-between gap-2.5 ${
                          isCurrentlyActiveSlotSelected
                            ? activeHalfSlot === 1
                              ? 'bg-[#168A45] text-white border-[#168A45] font-black shadow-md'
                              : 'bg-[#FFD21A] text-black border-[#FFD21A] font-black shadow-md'
                            : isSelectedAs1
                            ? 'bg-[#168A45]/20 text-white border-[#168A45]/60 hover:bg-[#168A45]/30'
                            : isSelectedAs2
                            ? 'bg-[#FFD21A]/20 text-white border-[#FFD21A]/60 hover:bg-[#FFD21A]/30'
                            : 'bg-[#161616] text-white hover:bg-[#222222] border-white/10 hover:border-white/25'
                        }`}
                      >
                        <div className="min-w-0 flex-1">
                          <div className="flex items-center gap-1.5 flex-wrap">
                            {item.number && (
                              <span className={`text-[10px] font-black px-1.5 py-0.5 rounded ${
                                isCurrentlyActiveSlotSelected
                                  ? 'bg-black/30 text-white'
                                  : 'bg-[#E52521] text-white'
                              }`}>
                                Nº {item.number}
                              </span>
                            )}
                            <span className="text-xs font-extrabold truncate block">
                              {item.name}
                            </span>
                            {isSelectedAs1 && (
                              <span className="text-[9px] bg-[#168A45] text-white font-bold px-1.5 py-0.2 rounded shrink-0">
                                1ª Metade
                              </span>
                            )}
                            {isSelectedAs2 && (
                              <span className="text-[9px] bg-[#FFD21A] text-black font-bold px-1.5 py-0.2 rounded shrink-0">
                                2ª Metade
                              </span>
                            )}
                          </div>
                          {item.description && (
                            <p className={`text-[10px] truncate mt-0.5 ${
                              isCurrentlyActiveSlotSelected ? (activeHalfSlot === 2 ? 'text-black/80' : 'text-white/90') : 'text-white/60'
                            }`}>
                              {item.description}
                            </p>
                          )}
                        </div>

                        <div className="text-right shrink-0">
                          <span className={`text-xs font-black ${
                            isCurrentlyActiveSlotSelected ? (activeHalfSlot === 2 ? 'text-black' : 'text-white') : 'text-[#FFD21A]'
                          }`}>
                            {formatCurrency(item.price)}
                          </span>
                        </div>
                      </button>
                    );
                  })
                )}
              </div>

              {/* Advance Button */}
              <div className="pt-2">
                <button
                  type="button"
                  onClick={handleProceedFromHalfHalfToBorder}
                  disabled={!flavor1 || !flavor2}
                  id="btn-proceed-to-border-half"
                  className={`w-full py-3.5 px-4 rounded-xl font-extrabold text-xs sm:text-sm uppercase tracking-wider flex items-center justify-center gap-2 shadow-lg transition-all cursor-pointer ${
                    flavor1 && flavor2
                      ? 'bg-[#E52521] hover:bg-[#c91d1a] text-white shadow-[#E52521]/30 active:scale-95'
                      : 'bg-white/10 text-white/40 border border-white/10 cursor-not-allowed'
                  }`}
                >
                  <span>
                    {flavor1 && flavor2
                      ? `CONTINUAR PARA A BORDA (${formatCurrency(Math.max(flavor1Price, flavor2Price))})`
                      : !flavor1
                      ? 'SELECIONE O 1º SABOR ACIMA'
                      : 'SELECIONE O 2º SABOR ACIMA'}
                  </span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>

            </div>
          )}

          {/* ========================================================= */}
          {/* STEP 3: BORDER, QUANTITY & NOTES                          */}
          {/* ========================================================= */}
          {currentStep === 'border' && (
            <div className="space-y-4 animate-in fade-in">
              
              {/* Back Button */}
              <div className="flex items-center justify-between">
                <button
                  type="button"
                  onClick={() => {
                    if (isHalfHalf) {
                      setCurrentStep('half-half');
                    } else {
                      setCurrentStep('choice');
                    }
                  }}
                  className="text-xs text-white/70 hover:text-white flex items-center gap-1 font-bold cursor-pointer py-1.5 px-3 rounded-lg bg-white/5 hover:bg-white/10 transition-colors"
                >
                  <ArrowLeft className="w-3.5 h-3.5" />
                  <span>Voltar</span>
                </button>
                <span className="text-xs font-black text-[#FFD21A] uppercase tracking-wider">
                  Borda, Quantidade & Observação
                </span>
              </div>

              {/* Pizza Summary Card */}
              <div className="p-3.5 rounded-2xl bg-black border border-white/15 space-y-1.5">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-black text-white uppercase flex items-center gap-1.5">
                    <span>{isHalfHalf ? '🌓 Meia a Meia:' : '🍕 Pizza Inteira:'}</span>
                    <span className="text-[#FFD21A]">
                      {isHalfHalf
                        ? `Meia ${flavor1?.name || ''} + Meia ${flavor2?.name || ''}`
                        : flavor1?.name || ''}
                    </span>
                  </span>
                  <span className="text-xs font-black text-[#FFD21A]">
                    {formatCurrency(basePizzaPrice)}
                  </span>
                </div>
                {isHalfHalf && flavor1 && flavor2 && (
                  <p className="text-[10px] text-white/50">
                    Preço base calculado pelo maior valor entre {flavor1.name} ({formatCurrency(flavor1Price)}) e {flavor2.name} ({formatCurrency(flavor2Price)}).
                  </p>
                )}
              </div>

              {/* Stuffed Crust Selection */}
              <div className="space-y-2">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-black uppercase tracking-wider text-white">
                    Deseja Borda Recheada? (Opcional)
                  </span>
                  {chosenCrust ? (
                    <span className="text-[#FFD21A] font-bold">
                      +{formatCurrency(chosenCrust.price)}
                    </span>
                  ) : (
                    <span className="text-white/50">Massa tradicional padrão</span>
                  )}
                </div>

                {/* Option: Sem Borda */}
                <button
                  type="button"
                  onClick={() => setSelectedCrustId('')}
                  className={`w-full p-2.5 rounded-xl text-left border transition-all cursor-pointer flex items-center justify-between text-xs ${
                    selectedCrustId === ''
                      ? 'bg-white/15 text-white border-white/40 font-bold'
                      : 'bg-white/5 text-white/70 border-white/10 hover:border-white/20'
                  }`}
                >
                  <span>Massa Tradicional Padrão (Sem Borda Recheada)</span>
                  <span className="text-[10px] opacity-75 font-semibold">Grátis</span>
                </button>

                {/* Traditional Crusts */}
                <div className="grid grid-cols-2 gap-1.5">
                  {stuffedCrusts
                    .filter(c => c && !c.isVulcao && c.category !== 'vulcao')
                    .map((crust) => {
                      const isSelected = selectedCrustId === crust.id;
                      return (
                        <button
                          key={crust.id}
                          type="button"
                          onClick={() => setSelectedCrustId(prev => prev === crust.id ? '' : crust.id)}
                          className={`p-2.5 rounded-xl text-[11px] text-left border transition-all cursor-pointer flex items-center justify-between gap-1 ${
                            isSelected
                              ? 'bg-[#FFD21A] text-black border-[#FFD21A] font-black shadow-sm'
                              : 'bg-white/5 text-white/80 border-white/10 hover:border-white/25 hover:text-white'
                          }`}
                        >
                          <span className="truncate font-semibold">{crust.name}</span>
                          <span className="text-[10px] font-black shrink-0">+{formatCurrency(crust.price)}</span>
                        </button>
                      );
                    })}
                </div>

                {/* Vulcão Crusts */}
                {stuffedCrusts
                  .filter(c => c && (c.isVulcao || c.category === 'vulcao'))
                  .map((crust) => {
                    const isSelected = selectedCrustId === crust.id;
                    return (
                      <button
                        key={crust.id}
                        type="button"
                        onClick={() => setSelectedCrustId(prev => prev === crust.id ? '' : crust.id)}
                        className={`w-full px-3 py-2.5 rounded-xl text-xs text-left border transition-all cursor-pointer flex items-center justify-between gap-2 mt-1.5 ${
                          isSelected
                            ? 'bg-gradient-to-r from-orange-500 to-red-600 text-white border-orange-400 font-black shadow-md shadow-orange-900/50'
                            : 'bg-orange-500/10 text-orange-200 border-orange-500/30 hover:bg-orange-500/20 hover:border-orange-500/60'
                        }`}
                      >
                        <span className="font-extrabold flex items-center gap-1.5 truncate">
                          <span>🌋</span>
                          <span>{crust.name} (Borda Vulcão Especial)</span>
                        </span>
                        <span className="text-xs font-black text-[#FFD21A] shrink-0">
                          +{formatCurrency(crust.price)}
                        </span>
                      </button>
                    );
                  })}
              </div>

              {/* Observation Field */}
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-white/80 uppercase">
                  Observações para a cozinha (Opcional):
                </label>
                <input
                  type="text"
                  value={observation}
                  onChange={(e) => setObservation(e.target.value)}
                  placeholder="Ex: Sem cebola na metade calabresa, massa bem passada..."
                  className="w-full px-3.5 py-2.5 rounded-xl bg-black border border-white/20 text-white text-xs placeholder-white/40 focus:border-[#E52521] outline-none"
                />
              </div>

              {/* Calculation Breakdown Box */}
              <div className="p-4 rounded-2xl bg-black border border-white/15 space-y-2">
                <div className="flex items-center justify-between text-xs text-white/70">
                  <span>Preço da Pizza:</span>
                  <span>{formatCurrency(basePizzaPrice)}</span>
                </div>
                {chosenCrust && (
                  <div className="flex items-center justify-between text-xs text-[#FFD21A]">
                    <span>Borda Recheada ({chosenCrust.name}):</span>
                    <span>+{formatCurrency(chosenCrust.price)}</span>
                  </div>
                )}
                <div className="flex items-center justify-between text-xs text-white/70">
                  <span>Quantidade:</span>
                  <span>{quantity}x</span>
                </div>
                <div className="pt-2 border-t border-white/15 flex items-center justify-between">
                  <span className="text-sm font-black text-white uppercase">Total do Item:</span>
                  <span className="text-xl font-black text-[#FFD21A]">
                    {formatCurrency(totalPrice)}
                  </span>
                </div>
              </div>

            </div>
          )}

        </div>

        {/* ========================================================= */}
        {/* FOOTER ACTIONS (Border Step)                              */}
        {/* ========================================================= */}
        {currentStep === 'border' && (
          <div className="p-4 sm:p-5 bg-[#161616] border-t border-white/10 flex items-center gap-3">
            {/* Quantity Stepper */}
            <div className="flex items-center bg-black rounded-xl border border-white/15 p-1 shrink-0">
              <button
                type="button"
                onClick={() => setQuantity(prev => Math.max(1, prev - 1))}
                className="w-8 h-8 rounded-lg bg-white/5 hover:bg-white/15 text-white flex items-center justify-center cursor-pointer active:scale-95"
                title="Diminuir"
              >
                <Minus className="w-3.5 h-3.5" />
              </button>
              <span className="w-8 text-center text-sm font-extrabold text-white">
                {quantity}
              </span>
              <button
                type="button"
                onClick={() => setQuantity(prev => prev + 1)}
                className="w-8 h-8 rounded-lg bg-white/5 hover:bg-white/15 text-white flex items-center justify-center cursor-pointer active:scale-95"
                title="Aumentar"
              >
                <Plus className="w-3.5 h-3.5" />
              </button>
            </div>

            {/* Confirm & Add Button */}
            <button
              type="button"
              onClick={handleAddToCart}
              id="btn-confirm-add-pizza"
              className="flex-1 py-3.5 px-4 rounded-xl bg-gradient-to-r from-[#E52521] to-[#b81b18] hover:from-[#f02f2b] hover:to-[#E52521] text-white font-black text-xs sm:text-sm uppercase tracking-wider flex items-center justify-center gap-2 shadow-lg shadow-[#E52521]/40 active:scale-95 border border-[#E52521] transition-all cursor-pointer"
            >
              <ShoppingBag className="w-4 h-4 text-[#FFD21A]" />
              <span className="truncate">ADICIONAR AO PEDIDO ({formatCurrency(totalPrice)})</span>
            </button>
          </div>
        )}

      </div>
    </div>
  );
};
