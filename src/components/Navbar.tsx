import React, { useState, useEffect } from 'react';
import { ShoppingBag, Menu, X, Phone, MessageCircle, Flame } from 'lucide-react';
import { StoreSettings } from '../types';
import { isStoreOpen, openWhatsApp } from '../utils/storeUtils';

interface NavbarProps {
  settings: StoreSettings;
  cartCount: number;
  onOpenCart: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  settings,
  cartCount,
  onOpenCart
}) => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const isOpen = isStoreOpen(settings);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { name: 'Início', href: '#inicio' },
    { name: 'Cardápio', href: '#cardapio' },
    { name: 'Promoções', href: '#promocoes' },
    { name: 'Pizzas Doces', href: '#doces' },
    { name: 'Bebidas', href: '#bebidas' },
    { name: 'Contato', href: '#contato' },
  ];

  const handleLinkClick = (href: string) => {
    setMobileMenuOpen(false);
    const element = document.querySelector(href);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const handleDirectWhatsApp = () => {
    openWhatsApp(settings.whatsapp, 'Olá, Pizzaria Mamma Roma! Gostaria de fazer um pedido.');
  };

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled
          ? 'bg-[#080808]/95 backdrop-blur-md border-b border-white/10 shadow-2xl py-2.5'
          : 'bg-gradient-to-b from-[#080808]/90 to-[#080808]/70 border-b border-white/5 py-3.5'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between">
        {/* Brand / Logo */}
        <a
          href="#inicio"
          className="flex items-center gap-3 group focus:outline-none"
          id="logo-button"
        >
          <div className="w-11 h-11 sm:w-12 sm:h-12 rounded-full overflow-hidden shadow-lg shadow-black/80 border border-[#E52521]/60 group-hover:scale-105 transition-transform bg-black flex items-center justify-center shrink-0">
            <img
              src={settings.logo || '/logo.jpg'}
              alt="Pizzaria Mamma Roma Logo Oficial"
              className="w-full h-full object-cover"
              referrerPolicy="no-referrer"
            />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-extrabold text-lg sm:text-xl tracking-tight text-white flex items-center gap-1.5">
                MAMMA ROMA
              </span>
              <div className="flex items-center h-3 w-4.5 rounded overflow-hidden shadow-sm" title="Tradição">
                <span className="w-1.5 h-full bg-[#168A45]"></span>
                <span className="w-1.5 h-full bg-white"></span>
                <span className="w-1.5 h-full bg-[#E52521]"></span>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-[10px] sm:text-xs font-semibold text-[#FFD21A] tracking-wider uppercase">
                {settings.slogan}
              </span>
              <span className="text-white/20 text-[10px] hidden sm:inline">•</span>
              {/* Status Badge */}
              <div className="hidden sm:inline-flex items-center gap-1.5">
                <span
                  className={`w-2 h-2 rounded-full ${
                    isOpen ? 'bg-[#168A45] animate-pulse' : 'bg-red-500'
                  }`}
                />
                <span
                  className={`text-[10px] font-bold uppercase tracking-wider ${
                    isOpen ? 'text-[#168A45]' : 'text-red-400'
                  }`}
                >
                  {isOpen ? 'Aberto Agora' : 'Fechado Agora'}
                </span>
              </div>
            </div>
          </div>
        </a>

        {/* Desktop Navigation Links */}
        <nav className="hidden lg:flex items-center gap-6">
          {navLinks.map((link) => (
            <button
              key={link.name}
              onClick={() => handleLinkClick(link.href)}
              className="text-xs font-bold uppercase tracking-wider text-white/80 hover:text-[#FFD21A] transition-colors cursor-pointer py-1"
            >
              {link.name}
            </button>
          ))}
        </nav>

        {/* Right Actions */}
        <div className="flex items-center gap-2 sm:gap-3">
          {/* Cart Trigger */}
          <button
            onClick={onOpenCart}
            id="navbar-cart-btn"
            className="relative flex items-center gap-2 px-3 sm:px-4 py-2 sm:py-2.5 rounded-xl bg-[#141414] hover:bg-[#1a1a1a] text-white border border-white/10 transition-all shadow-md active:scale-95 cursor-pointer"
          >
            <div className="relative">
              <ShoppingBag className="w-5 h-5 text-[#FFD21A]" />
              {cartCount > 0 && (
                <span className="absolute -top-2 -right-2 bg-[#E52521] text-white text-[10px] font-extrabold w-4.5 h-4.5 rounded-full flex items-center justify-center animate-bounce shadow-sm">
                  {cartCount}
                </span>
              )}
            </div>
            <span className="hidden sm:inline text-xs font-bold uppercase tracking-wider">
              Meu Pedido
            </span>
          </button>

          {/* WhatsApp Primary CTA */}
          <button
            onClick={handleDirectWhatsApp}
            id="navbar-whatsapp-cta"
            className="hidden sm:flex items-center gap-2 px-4 sm:px-5 py-2 sm:py-2.5 rounded-xl bg-gradient-to-r from-[#168A45] to-[#116b35] hover:from-[#199d4f] hover:to-[#168A45] text-white text-xs font-bold uppercase tracking-wider shadow-lg shadow-[#168A45]/30 transition-all hover:scale-105 active:scale-95 cursor-pointer border border-[#168A45]/40"
          >
            <MessageCircle className="w-4 h-4 text-white fill-white/20" />
            <span>Pedir no WhatsApp</span>
          </button>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            id="mobile-menu-toggle"
            className="lg:hidden p-2 rounded-xl bg-white/5 border border-white/10 text-white hover:bg-white/10 transition-colors"
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div className="lg:hidden bg-[#0a0a0a] border-b border-white/10 px-4 pt-3 pb-6 space-y-3 mt-2 shadow-2xl animate-in slide-in-from-top duration-200">
          <div className="flex items-center justify-between pb-3 border-b border-white/10">
            <div className="flex items-center gap-2">
              <span
                className={`w-2.5 h-2.5 rounded-full ${
                  isOpen ? 'bg-[#168A45] animate-pulse' : 'bg-red-500'
                }`}
              />
              <span
                className={`text-xs font-bold uppercase tracking-wider ${
                  isOpen ? 'text-[#168A45]' : 'text-red-400'
                }`}
              >
                {isOpen ? 'Aberto Agora • 18h à 1h' : 'Fechado Agora • Abre às 18h'}
              </span>
            </div>
            <span className="text-xs text-[#FFD21A] font-semibold">{settings.slogan}</span>
          </div>

          <div className="grid grid-cols-2 gap-2 pt-1">
            {navLinks.map((link) => (
              <button
                key={link.name}
                onClick={() => handleLinkClick(link.href)}
                className="text-left px-3 py-2.5 rounded-lg bg-white/5 hover:bg-white/10 text-sm font-semibold text-white/90 hover:text-[#FFD21A] transition-colors"
              >
                {link.name}
              </button>
            ))}
          </div>

          <div className="pt-2 flex flex-col gap-2">
            <button
              onClick={() => {
                setMobileMenuOpen(false);
                handleDirectWhatsApp();
              }}
              className="w-full py-3 rounded-xl bg-[#168A45] text-white text-xs font-bold uppercase tracking-wider flex items-center justify-center gap-2 shadow-lg shadow-[#168A45]/30"
            >
              <MessageCircle className="w-4 h-4 fill-white/20" />
              <span>Pedir pelo WhatsApp</span>
            </button>

            <a
              href={`tel:${settings.phone}`}
              className="w-full py-2.5 rounded-xl bg-white/5 border border-white/10 text-white/80 hover:text-white text-xs font-semibold flex items-center justify-center gap-2"
            >
              <Phone className="w-3.5 h-3.5 text-[#FFD21A]" />
              <span>Ligar: {settings.phoneDisplay}</span>
            </a>
          </div>
        </div>
      )}
    </header>
  );
};
