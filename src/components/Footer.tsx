import React from 'react';
import { Flame, Heart, MessageCircle, Phone } from 'lucide-react';
import { StoreSettings } from '../types';

interface FooterProps {
  settings: StoreSettings;
  onOpenAdmin?: () => void;
}

export const Footer: React.FC<FooterProps> = ({ settings, onOpenAdmin }) => {
  return (
    <footer className="bg-[#050505] border-t border-white/10 pt-12 pb-24 md:pb-12 px-4 text-white/70">
      <div className="max-w-7xl mx-auto space-y-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand Col */}
          <div className="space-y-3 md:col-span-2">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-full overflow-hidden bg-black border border-[#E52521]/60 shadow-lg shrink-0">
                <img
                  src={settings.logo || '/logo.jpg'}
                  alt="Pizzaria Mamma Roma Logo"
                  loading="lazy"
                  decoding="async"
                  width={48}
                  height={48}
                  className="w-full h-full object-cover"
                  referrerPolicy="no-referrer"
                />
              </div>
              <div>
                <span className="font-extrabold text-xl tracking-tight text-white block">
                  {settings.name}
                </span>
                <span className="text-xs text-[#FFD21A] font-semibold tracking-wider uppercase">
                  {settings.slogan}
                </span>
              </div>
            </div>
            <p className="text-xs text-white/60 max-w-md leading-relaxed">
              Pizzas artesanais assadas no capricho com fermentação lenta e os melhores ingredientes. Peça online com facilidade e receba quentinha via WhatsApp.
            </p>
          </div>

          {/* Quick Links */}
          <div className="space-y-3">
            <h4 className="text-xs font-black text-white uppercase tracking-wider">
              Navegação Rápida
            </h4>
            <ul className="space-y-2 text-xs">
              <li>
                <a href="#inicio" className="hover:text-[#FFD21A] transition-colors">Início</a>
              </li>
              <li>
                <a href="#promocoes" className="hover:text-[#FFD21A] transition-colors">🔥 Promoções Especiais</a>
              </li>
              <li>
                <a href="#combos" className="hover:text-[#FFD21A] transition-colors">🍕 Combos com Refri</a>
              </li>
              <li>
                <a href="#cardapio" className="hover:text-[#FFD21A] transition-colors">Cardápio Completo</a>
              </li>
              <li>
                <a href="#doces" className="hover:text-[#FFD21A] transition-colors">Pizzas Doces</a>
              </li>
              <li>
                <a href="#contato" className="hover:text-[#FFD21A] transition-colors">Contato & Horários</a>
              </li>
            </ul>
          </div>

          {/* Contact */}
          <div className="space-y-3">
            <h4 className="text-xs font-black text-white uppercase tracking-wider">
              Atendimento
            </h4>
            <p className="text-xs text-white/80">WhatsApp: {settings.whatsappDisplay}</p>
            <p className="text-xs text-white/80">Telefone: {settings.phoneDisplay}</p>
            <p className="text-xs text-white/80">
              Instagram:{' '}
              <a
                href={`https://www.instagram.com/${(settings.instagram || 'pizzariamammaroma').replace('@', '')}/`}
                target="_blank"
                rel="noopener noreferrer"
                className="text-[#FFD21A] hover:underline"
              >
                {settings.instagram || '@pizzariamammaroma'}
              </a>
            </p>
            <p className="text-xs text-white/80">{settings.hours}</p>
            <p className="text-xs text-[#168A45] font-semibold">Entrega rápida em toda a região</p>
          </div>
        </div>

        <div className="pt-8 border-t border-white/10 flex flex-col sm:flex-row items-center justify-between gap-4 text-[11px] text-white/50 text-center sm:text-left">
          <p className="break-words">© {new Date().getFullYear()} {settings.name}. Todos os direitos reservados. {settings.slogan}.</p>
          <div className="flex flex-wrap items-center justify-center sm:justify-end gap-3">
            <span>Desenvolvido para pedidos rápidos e alta conversão.</span>
            {onOpenAdmin && (
              <button
                type="button"
                onClick={onOpenAdmin}
                className="opacity-40 hover:opacity-100 text-[10px] text-white/60 hover:text-[#FFD21A] transition-opacity cursor-pointer flex items-center gap-1 shrink-0"
                title="Acesso Administrativo / Gerente"
              >
                <span>⚙️</span>
                <span>Admin</span>
              </button>
            )}
          </div>
        </div>
      </div>
    </footer>
  );
};
