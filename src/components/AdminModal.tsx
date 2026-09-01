import React, { useState } from 'react';
import { X, Save, RotateCcw, Lock, DollarSign, Store, Utensils, Sparkles } from 'lucide-react';
import { StoreSettings, ProductItem, PromotionOffer, ComboOffer, StuffedCrust, BeverageItem } from '../types';
import { STUFFED_CRUSTS, DEFAULT_STORE_SETTINGS, INITIAL_PRODUCTS, PROMOTIONS, COMBOS, BEVERAGES } from '../data/menuData';
import { formatCurrency } from '../utils/storeUtils';

interface AdminModalProps {
  isOpen: boolean;
  onClose: () => void;
  settings: StoreSettings;
  onSaveSettings: (settings: StoreSettings) => void;
  stuffedCrusts: StuffedCrust[];
  onSaveCrusts: (crusts: StuffedCrust[]) => void;
  beverages: BeverageItem[];
  onSaveBeverages: (beverages: BeverageItem[]) => void;
  products: ProductItem[];
  onSaveProducts: (products: ProductItem[]) => void;
  promotions: PromotionOffer[];
  onSavePromotions: (promotions: PromotionOffer[]) => void;
  combos: ComboOffer[];
  onSaveCombos: (combos: ComboOffer[]) => void;
}

export const AdminModal: React.FC<AdminModalProps> = ({
  isOpen,
  onClose,
  settings,
  onSaveSettings,
  stuffedCrusts,
  onSaveCrusts,
  beverages,
  onSaveBeverages,
  products,
  onSaveProducts,
  promotions,
  onSavePromotions,
  combos,
  onSaveCombos
}) => {
  const [activeTab, setActiveTab] = useState<'crusts' | 'settings' | 'menu'>('crusts');
  const [localSettings, setLocalSettings] = useState<StoreSettings>(settings);
  const [localCrusts, setLocalCrusts] = useState<StuffedCrust[]>(stuffedCrusts);
  const [savedSuccess, setSavedSuccess] = useState(false);

  if (!isOpen) return null;

  const handleCrustPriceChange = (id: string, newPrice: number) => {
    setLocalCrusts(prev =>
      prev.map(c => (c.id === id ? { ...c, price: Math.max(0, newPrice) } : c))
    );
  };

  const handleSaveAll = () => {
    onSaveSettings(localSettings);
    onSaveCrusts(localCrusts);
    setSavedSuccess(true);
    setTimeout(() => {
      setSavedSuccess(false);
      onClose();
    }, 1200);
  };

  const handleResetDefaults = () => {
    if (window.confirm('Deseja restaurar os preços padrão das bordas (R$ 16,00 tradicionais / R$ 28,00 vulcão)?')) {
      setLocalCrusts(STUFFED_CRUSTS);
      onSaveCrusts(STUFFED_CRUSTS);
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/85 backdrop-blur-md flex items-center justify-center p-4">
      <div className="bg-[#141414] border border-white/15 rounded-3xl w-full max-w-2xl overflow-hidden shadow-2xl flex flex-col max-h-[90vh]">
        {/* Modal Header */}
        <div className="px-6 py-4 bg-[#1a1a1a] border-b border-white/10 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-[#E52521] text-white flex items-center justify-center">
              <Lock className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-black text-white uppercase tracking-wider">
                Painel Administrativo
              </h3>
              <p className="text-[11px] text-white/60">Configuração de preços e cardápio</p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-xl bg-white/5 hover:bg-white/10 text-white/70 hover:text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab Navigation */}
        <div className="flex border-b border-white/10 bg-[#111] px-6 pt-3 gap-2">
          <button
            onClick={() => setActiveTab('crusts')}
            className={`px-4 py-2.5 rounded-t-xl text-xs font-bold uppercase tracking-wider flex items-center gap-1.5 transition-colors border-b-2 ${
              activeTab === 'crusts'
                ? 'bg-[#1a1a1a] text-[#FFD21A] border-[#FFD21A]'
                : 'text-white/60 hover:text-white border-transparent'
            }`}
          >
            <span>🧀</span>
            <span>Bordas Recheadas</span>
          </button>

          <button
            onClick={() => setActiveTab('settings')}
            className={`px-4 py-2.5 rounded-t-xl text-xs font-bold uppercase tracking-wider flex items-center gap-1.5 transition-colors border-b-2 ${
              activeTab === 'settings'
                ? 'bg-[#1a1a1a] text-[#FFD21A] border-[#FFD21A]'
                : 'text-white/60 hover:text-white border-transparent'
            }`}
          >
            <Store className="w-4 h-4" />
            <span>Dados da Pizzaria</span>
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 overflow-y-auto space-y-6 flex-1">
          {activeTab === 'crusts' && (
            <div className="space-y-6">
              <div className="bg-white/5 p-4 rounded-2xl border border-white/10 flex items-center justify-between">
                <div>
                  <h4 className="text-sm font-bold text-white uppercase">Valores das Bordas Recheadas</h4>
                  <p className="text-xs text-white/60">
                    Ajuste os preços das bordas tradicionais e da opção especial Borda Vulcão.
                  </p>
                </div>
                <button
                  type="button"
                  onClick={handleResetDefaults}
                  className="px-3 py-1.5 rounded-xl bg-white/10 hover:bg-white/20 text-white text-xs font-semibold flex items-center gap-1"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                  <span>Padrões</span>
                </button>
              </div>

              {/* Traditional Crusts */}
              <div className="space-y-3">
                <h5 className="text-xs font-extrabold uppercase tracking-wider text-[#FFD21A] flex items-center gap-1.5">
                  <span>🧀 Bordas Tradicionais (Padrão: R$ 16,00)</span>
                </h5>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {localCrusts
                    .filter(c => !c.isVulcao && c.category !== 'vulcao')
                    .map(crust => (
                      <div
                        key={crust.id}
                        className="p-3.5 rounded-2xl bg-[#1c1c1c] border border-white/10 flex items-center justify-between gap-3"
                      >
                        <div>
                          <span className="text-xs font-extrabold text-white block uppercase">{crust.name}</span>
                          <span className="text-[10px] text-white/50">{crust.description}</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <span className="text-xs font-bold text-white/60">R$</span>
                          <input
                            type="number"
                            step="1.00"
                            min="0"
                            value={crust.price}
                            onChange={e => handleCrustPriceChange(crust.id, parseFloat(e.target.value) || 0)}
                            className="w-20 px-2.5 py-1.5 rounded-xl bg-black border border-white/20 text-right font-black text-[#FFD21A] text-sm focus:border-[#FFD21A] outline-none"
                          />
                        </div>
                      </div>
                    ))}
                </div>
              </div>

              {/* Special Borda Vulcão */}
              <div className="space-y-3 pt-2">
                <h5 className="text-xs font-extrabold uppercase tracking-wider text-orange-400 flex items-center gap-1.5">
                  <span>🌋 Opção Especial: Borda Vulcão (Padrão: R$ 28,00)</span>
                </h5>
                {localCrusts
                  .filter(c => c.isVulcao || c.category === 'vulcao')
                  .map(crust => (
                    <div
                      key={crust.id}
                      className="p-4 rounded-2xl bg-gradient-to-r from-orange-950/40 via-[#1c1c1c] to-[#1c1c1c] border border-orange-500/40 flex items-center justify-between gap-4"
                    >
                      <div>
                        <span className="text-sm font-black text-white block uppercase flex items-center gap-1.5">
                          <span>🌋</span>
                          <span>{crust.name}</span>
                        </span>
                        <span className="text-xs text-white/60">{crust.description}</span>
                      </div>
                      <div className="flex items-center gap-1 shrink-0">
                        <span className="text-xs font-bold text-white/60">R$</span>
                        <input
                          type="number"
                          step="1.00"
                          min="0"
                          value={crust.price}
                          onChange={e => handleCrustPriceChange(crust.id, parseFloat(e.target.value) || 0)}
                          className="w-24 px-3 py-2 rounded-xl bg-black border border-orange-500/50 text-right font-black text-[#FFD21A] text-base focus:border-[#FFD21A] outline-none"
                        />
                      </div>
                    </div>
                  ))}
              </div>
            </div>
          )}

          {activeTab === 'settings' && (
            <div className="space-y-4">
              <div>
                <label className="text-xs font-bold text-white/80 block mb-1">Nome da Pizzaria</label>
                <input
                  type="text"
                  value={localSettings.name}
                  onChange={e => setLocalSettings(prev => ({ ...prev, name: e.target.value }))}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-black border border-white/15 text-white text-xs"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-white/80 block mb-1">WhatsApp para Pedidos (com DDD)</label>
                <input
                  type="text"
                  value={localSettings.whatsapp}
                  onChange={e => setLocalSettings(prev => ({ ...prev, whatsapp: e.target.value }))}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-black border border-white/15 text-white text-xs"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-white/80 block mb-1">Instagram (@usuario)</label>
                <input
                  type="text"
                  value={localSettings.instagram}
                  onChange={e => setLocalSettings(prev => ({ ...prev, instagram: e.target.value }))}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-black border border-white/15 text-white text-xs"
                  placeholder="@pizzariamammaroma"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-white/80 block mb-1">Endereço da Loja</label>
                <input
                  type="text"
                  value={localSettings.address}
                  onChange={e => setLocalSettings(prev => ({ ...prev, address: e.target.value }))}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-black border border-white/15 text-white text-xs"
                />
              </div>
            </div>
          )}
        </div>

        {/* Modal Footer */}
        <div className="p-4 bg-[#1a1a1a] border-t border-white/10 flex items-center justify-between">
          <button
            type="button"
            onClick={onClose}
            className="px-5 py-2.5 rounded-xl bg-white/10 hover:bg-white/20 text-white text-xs font-bold uppercase tracking-wider"
          >
            Cancelar
          </button>

          <button
            type="button"
            onClick={handleSaveAll}
            className="px-6 py-2.5 rounded-xl bg-[#168A45] hover:bg-[#127038] text-white text-xs font-extrabold uppercase tracking-wider flex items-center gap-2 shadow-lg shadow-green-900/30"
          >
            <Save className="w-4 h-4" />
            <span>{savedSuccess ? 'Salvo com Sucesso!' : 'Salvar Alterações'}</span>
          </button>
        </div>
      </div>
    </div>
  );
};
