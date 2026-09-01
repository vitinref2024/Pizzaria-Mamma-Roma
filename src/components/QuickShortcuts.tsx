import React from 'react';
import { ShoppingBag, Flame, Sparkles } from 'lucide-react';

interface QuickShortcutsProps {
  cartCount: number;
  onOpenCart: () => void;
  onSelectCategory: (category: string) => void;
  activeCategory: string;
}

export const QuickShortcuts: React.FC<QuickShortcutsProps> = ({
  cartCount,
  onOpenCart,
  onSelectCategory,
  activeCategory
}) => {
  const shortcuts = [
    { id: 'promocoes', label: 'Promoções', icon: '🔥', highlight: true, href: '#promocoes' },
    { id: 'combos', label: 'Combos', icon: '🍕', highlight: false, href: '#combos' },
    { id: 'salgadas', label: 'Pizzas Salgadas', icon: '🍕', highlight: false, href: '#cardapio' },
    { id: 'doces', label: 'Pizzas Doces', icon: '🍫', highlight: false, href: '#doces' },
    { id: 'bordas', label: 'Bordas', icon: '🧀', highlight: false, href: '#bordas' },
    { id: 'bebidas', label: 'Bebidas', icon: '🥤', highlight: false, href: '#bebidas' },
  ];

  const handleShortcut = (sc: typeof shortcuts[0]) => {
    onSelectCategory(sc.id);
    const element = document.querySelector(sc.href);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  return (
    <div className="sticky top-[60px] sm:top-[68px] z-40 bg-[#080808]/95 backdrop-blur-md border-y border-white/10 py-2.5 px-4 shadow-xl">
      <div className="max-w-7xl mx-auto flex items-center justify-between gap-2 overflow-x-auto no-scrollbar">
        <div className="flex items-center gap-1.5 sm:gap-2 flex-nowrap">
          {shortcuts.map((sc) => {
            const isActive = activeCategory === sc.id;
            return (
              <button
                key={sc.id}
                onClick={() => handleShortcut(sc)}
                id={`shortcut-${sc.id}`}
                className={`whitespace-nowrap px-3.5 sm:px-4 py-2 rounded-xl text-xs sm:text-sm font-bold flex items-center gap-1.5 transition-all cursor-pointer active:scale-95 ${
                  sc.highlight
                    ? 'bg-[#E52521] text-white hover:bg-[#c71c18] shadow-md shadow-[#E52521]/30'
                    : isActive
                    ? 'bg-[#FFD21A] text-black shadow-md'
                    : 'bg-[#141414] text-white/90 hover:bg-[#222222] border border-white/10'
                }`}
              >
                <span>{sc.icon}</span>
                <span>{sc.label}</span>
              </button>
            );
          })}
        </div>

        {/* Quick Cart Action on Shortcut Bar */}
        <button
          onClick={onOpenCart}
          id="shortcut-cart-btn"
          className="whitespace-nowrap px-3.5 sm:px-4 py-2 rounded-xl bg-white/10 hover:bg-white/15 text-white border border-white/15 text-xs sm:text-sm font-bold flex items-center gap-2 transition-all cursor-pointer active:scale-95 shrink-0"
        >
          <ShoppingBag className="w-4 h-4 text-[#FFD21A]" />
          <span>Meu Pedido</span>
          {cartCount > 0 && (
            <span className="bg-[#E52521] text-white text-[10px] px-1.5 py-0.5 rounded-full font-black">
              {cartCount}
            </span>
          )}
        </button>
      </div>
    </div>
  );
};
