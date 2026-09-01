import React, { useState, useEffect } from 'react';
import { Navbar } from './components/Navbar';
import { Hero } from './components/Hero';
import { QuickShortcuts } from './components/QuickShortcuts';
import { PromotionsSection } from './components/PromotionsSection';
import { CombosSection } from './components/CombosSection';
import { MenuSection } from './components/MenuSection';
import { SweetPizzasSection } from './components/SweetPizzasSection';
import { StuffedCrustsSection } from './components/StuffedCrustsSection';
import { BeveragesSection } from './components/BeveragesSection';
import { AboutSection } from './components/AboutSection';
import { ContactSection } from './components/ContactSection';
import { Footer } from './components/Footer';
import { CartDrawer } from './components/CartDrawer';
import { MobileStickyBar } from './components/MobileStickyBar';
import { FloatingWhatsApp } from './components/FloatingWhatsApp';
import { BeverageUpsellModal } from './components/BeverageUpsellModal';
import { AdminModal } from './components/AdminModal';
import { ErrorBoundary } from './components/ErrorBoundary';

import {
  DEFAULT_STORE_SETTINGS,
  INITIAL_PRODUCTS,
  PROMOTIONS,
  COMBOS,
  STUFFED_CRUSTS,
  BEVERAGES
} from './data/menuData';

import {
  StoreSettings,
  ProductItem,
  PromotionOffer,
  ComboOffer,
  StuffedCrust,
  BeverageItem,
  CartItem,
  ProductCategory
} from './types';

const STORAGE_KEYS = {
  SETTINGS: 'mamma_roma_settings_v2',
  PRODUCTS: 'mamma_roma_products_v10_real',
  PROMOTIONS: 'mamma_roma_promotions_v4',
  COMBOS: 'mamma_roma_combos_v10_real',
  CRUSTS: 'mamma_roma_crusts_v2',
  BEVERAGES: 'mamma_roma_beverages_v3',
  CART: 'mamma_roma_cart_v2'
};

// Helper to guarantee latest images from code are never overridden by old cached strings
const syncProductsWithCodeImages = (items: ProductItem[]): ProductItem[] => {
  const initialMap = new Map(INITIAL_PRODUCTS.map(p => [p.id, p]));
  return items.map(item => {
    const fresh = initialMap.get(item.id);
    if (fresh) {
      return { ...item, image: fresh.image };
    }
    return item;
  });
};

const syncCombosWithCodeImages = (items: ComboOffer[]): ComboOffer[] => {
  const initialMap = new Map(COMBOS.map(c => [c.id, c]));
  return items.map(item => {
    const fresh = initialMap.get(item.id);
    if (fresh) {
      return { ...item, image: fresh.image };
    }
    return item;
  });
};

const syncBeveragesWithCodeImages = (items: BeverageItem[]): BeverageItem[] => {
  const initialMap = new Map(BEVERAGES.map(b => [b.id, b]));
  return items.map(item => {
    const fresh = initialMap.get(item.id);
    if (fresh) {
      return { ...item, image: fresh.image };
    }
    return item;
  });
};

export default function App() {
  // Store state initialized from localStorage or initial data
  const [settings, setSettings] = useState<StoreSettings>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.SETTINGS);
      return saved ? { ...DEFAULT_STORE_SETTINGS, ...JSON.parse(saved), logo: '/logo.jpg', instagram: '@pizzariamammaroma' } : DEFAULT_STORE_SETTINGS;
    } catch {
      return DEFAULT_STORE_SETTINGS;
    }
  });

  const [products, setProducts] = useState<ProductItem[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.PRODUCTS);
      if (saved) {
        const parsed: ProductItem[] = JSON.parse(saved);
        return syncProductsWithCodeImages(parsed);
      }
      return INITIAL_PRODUCTS;
    } catch {
      return INITIAL_PRODUCTS;
    }
  });

  const [promotions, setPromotions] = useState<PromotionOffer[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.PROMOTIONS);
      return saved ? JSON.parse(saved) : PROMOTIONS;
    } catch {
      return PROMOTIONS;
    }
  });

  const [combos, setCombos] = useState<ComboOffer[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.COMBOS);
      if (saved) {
        const parsed: ComboOffer[] = JSON.parse(saved);
        return syncCombosWithCodeImages(parsed);
      }
      return COMBOS;
    } catch {
      return COMBOS;
    }
  });

  const [stuffedCrusts, setStuffedCrusts] = useState<StuffedCrust[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.CRUSTS);
      if (saved) {
        const parsed: StuffedCrust[] = JSON.parse(saved);
        const hasVulcao = parsed.some(c => c.id === 'borda-vulcao');
        const hasTrad16 = parsed.some(c => c.price === 16);
        if (hasVulcao && hasTrad16) {
          return parsed;
        }
      }
      return STUFFED_CRUSTS;
    } catch {
      return STUFFED_CRUSTS;
    }
  });

  const [beverages, setBeverages] = useState<BeverageItem[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.BEVERAGES);
      if (saved) {
        const parsed: BeverageItem[] = JSON.parse(saved);
        return syncBeveragesWithCodeImages(parsed);
      }
      return BEVERAGES;
    } catch {
      return BEVERAGES;
    }
  });

  // Cart state
  const [cartItems, setCartItems] = useState<CartItem[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.CART);
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isAdminOpen, setIsAdminOpen] = useState(false);
  const [activeCategory, setActiveCategory] = useState<ProductCategory>('todas');

  // Upsell state for beverages
  const [isUpsellOpen, setIsUpsellOpen] = useState(false);
  const [lastAddedPizzaName, setLastAddedPizzaName] = useState<string>('');
  const [hasSkippedUpsell, setHasSkippedUpsell] = useState(false);

  // Persistence effects
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEYS.SETTINGS, JSON.stringify(settings));
    } catch (e) {
      console.error(e);
    }
  }, [settings]);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEYS.PRODUCTS, JSON.stringify(products));
    } catch (e) {
      console.error(e);
    }
  }, [products]);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEYS.PROMOTIONS, JSON.stringify(promotions));
    } catch (e) {
      console.error(e);
    }
  }, [promotions]);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEYS.COMBOS, JSON.stringify(combos));
    } catch (e) {
      console.error(e);
    }
  }, [combos]);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEYS.CRUSTS, JSON.stringify(stuffedCrusts));
    } catch (e) {
      console.error(e);
    }
  }, [stuffedCrusts]);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEYS.BEVERAGES, JSON.stringify(beverages));
    } catch (e) {
      console.error(e);
    }
  }, [beverages]);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEYS.CART, JSON.stringify(cartItems));
    } catch (e) {
      console.error(e);
    }
  }, [cartItems]);

  // Cart Handlers
  const handleAddToCart = (item: CartItem) => {
    setCartItems(prev => {
      // If exact same name and crust exists, increment quantity
      const existingIdx = prev.findIndex(
        i => i.name === item.name && i.details === item.details && i.crust?.name === item.crust?.name
      );

      let updated: CartItem[];
      if (existingIdx > -1) {
        const copy = [...prev];
        const current = copy[existingIdx];
        const newQty = current.quantity + item.quantity;
        copy[existingIdx] = {
          ...current,
          quantity: newQty,
          totalPrice: current.unitPrice * newQty
        };
        updated = copy;
      } else {
        updated = [...prev, item];
      }

      // Check if item is a pizza (regular, sweet, or promo)
      const isPizza = item.type === 'pizza' || item.type === 'promo';
      const hasBeverageInCart = updated.some(i => i.type === 'bebida' || i.type === 'combo');

      // Trigger beverage upsell if it's a pizza, user doesn't already have drinks in cart, and hasn't explicitly dismissed upsell in current shopping round
      if (isPizza && !hasBeverageInCart && !hasSkippedUpsell) {
        setLastAddedPizzaName(item.flavor || item.name);
        // Small delay for smooth transition after adding
        setTimeout(() => {
          setIsUpsellOpen(true);
        }, 300);
      }

      return updated;
    });
  };

  const handleAddUpsellBeverage = (bevItem: CartItem) => {
    // Add beverage to cart directly
    handleAddToCart(bevItem);
    setIsUpsellOpen(false);
  };

  const handleCloseUpsell = () => {
    setIsUpsellOpen(false);
    setHasSkippedUpsell(true); // Don't annoy repeatedly if they chose to continue without drink
  };

  const handleUpdateQuantity = (cartId: string, quantity: number) => {
    if (quantity <= 0) {
      handleRemoveItem(cartId);
      return;
    }

    setCartItems(prev =>
      prev.map(item => {
        if (item.cartId === cartId) {
          return {
            ...item,
            quantity,
            totalPrice: item.unitPrice * quantity
          };
        }
        return item;
      })
    );
  };

  const handleRemoveItem = (cartId: string) => {
    setCartItems(prev => prev.filter(item => item.cartId !== cartId));
  };

  const handleClearCart = () => {
    setCartItems([]);
    setHasSkippedUpsell(false);
  };

  const totalCartCount = cartItems.reduce((sum, item) => sum + item.quantity, 0);

  return (
    <div className="min-h-screen bg-[#080808] text-white selection:bg-[#E52521] selection:text-white relative">
      {/* 1. Header / Navbar */}
      <Navbar
        settings={settings}
        cartCount={totalCartCount}
        onOpenCart={() => setIsCartOpen(true)}
      />

      <main>
        {/* 2. Hero Section */}
        <Hero
          settings={settings}
          onExploreMenu={() => {
            document.querySelector('#cardapio')?.scrollIntoView({ behavior: 'smooth' });
          }}
        />

        {/* 3. Quick Shortcuts Navigation Bar */}
        <QuickShortcuts
          cartCount={totalCartCount}
          onOpenCart={() => setIsCartOpen(true)}
          activeCategory={activeCategory}
          onSelectCategory={(cat) => setActiveCategory(cat as ProductCategory)}
        />

        {/* 4. Special Promotions Area */}
        <PromotionsSection
          promotions={promotions}
          stuffedCrusts={stuffedCrusts}
          onAddToCart={handleAddToCart}
          onOpenCart={() => setIsCartOpen(true)}
        />

        {/* 5. Combos Section */}
        <CombosSection
          combos={combos}
          onAddToCart={handleAddToCart}
          onOpenCart={() => setIsCartOpen(true)}
        />

        {/* 6. Complete Menu Section (Salgadas e Doces com Busca) */}
        <MenuSection
          products={products}
          stuffedCrusts={stuffedCrusts}
          activeCategory={activeCategory}
          onCategoryChange={setActiveCategory}
          onAddToCart={handleAddToCart}
          onOpenCart={() => setIsCartOpen(true)}
        />

        {/* 7. Sweet Pizzas Dedicated Showcase */}
        <SweetPizzasSection
          products={products}
          stuffedCrusts={stuffedCrusts}
          onAddToCart={handleAddToCart}
          onOpenCart={() => setIsCartOpen(true)}
        />

        {/* 8. Stuffed Crusts Showcase */}
        <StuffedCrustsSection
          stuffedCrusts={stuffedCrusts}
          onAddToCart={handleAddToCart}
          onOpenCart={() => setIsCartOpen(true)}
        />

        {/* 9. Beverages Showcase */}
        <BeveragesSection
          beverages={beverages}
          onAddToCart={handleAddToCart}
          onOpenCart={() => setIsCartOpen(true)}
        />

        {/* 10. About & Authentic Tradition */}
        <AboutSection settings={settings} />

        {/* 11. Contact, Hours & Status */}
        <ContactSection settings={settings} />
      </main>

      {/* 12. Footer */}
      <Footer
        settings={settings}
        onOpenAdmin={() => setIsAdminOpen(true)}
      />

      {/* 13. Mobile Bottom Sticky Navigation */}
      <MobileStickyBar
        cartCount={totalCartCount}
        onOpenCart={() => setIsCartOpen(true)}
        settings={settings}
      />

      {/* 14. Desktop Floating WhatsApp Button */}
      <FloatingWhatsApp settings={settings} />

      {/* 15. Cart Drawer & Simplified Checkout & WhatsApp Order Formatter */}
      <CartDrawer
        isOpen={isCartOpen}
        onClose={() => setIsCartOpen(false)}
        cartItems={cartItems}
        onUpdateQuantity={handleUpdateQuantity}
        onRemoveItem={handleRemoveItem}
        onClearCart={handleClearCart}
        settings={settings}
      />

      {/* 16. Automatic Beverage Upsell Modal */}
      <BeverageUpsellModal
        isOpen={isUpsellOpen}
        onClose={handleCloseUpsell}
        beverages={beverages}
        onAddBeverage={handleAddUpsellBeverage}
        lastAddedPizzaName={lastAddedPizzaName}
      />

      {/* 17. Admin Modal (Price & Store Configuration) */}
      <AdminModal
        isOpen={isAdminOpen}
        onClose={() => setIsAdminOpen(false)}
        settings={settings}
        onSaveSettings={setSettings}
        stuffedCrusts={stuffedCrusts}
        onSaveCrusts={setStuffedCrusts}
        beverages={beverages}
        onSaveBeverages={setBeverages}
        products={products}
        onSaveProducts={setProducts}
        promotions={promotions}
        onSavePromotions={setPromotions}
        combos={combos}
        onSaveCombos={setCombos}
      />
    </div>
  );
}
