import React, { useState } from 'react';
import { X, Trash2, Plus, Minus, MessageCircle, ShoppingBag, ArrowRight, ArrowLeft, CheckCircle2, AlertCircle, MapPin, Store, Bike, DollarSign } from 'lucide-react';
import { CartItem, CheckoutForm, PaymentMethod, OrderType, StoreSettings } from '../types';
import { formatCurrency, generateWhatsAppLink, openWhatsApp } from '../utils/storeUtils';
import { formatWhatsAppReceipt } from '../utils/orderReceiptFormatter';

interface CartDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  cartItems: CartItem[];
  onUpdateQuantity: (cartId: string, quantity: number) => void;
  onRemoveItem: (cartId: string) => void;
  onClearCart: () => void;
  settings: StoreSettings;
}

export const CartDrawer: React.FC<CartDrawerProps> = ({
  isOpen,
  onClose,
  cartItems,
  onUpdateQuantity,
  onRemoveItem,
  onClearCart,
  settings
}) => {
  const [step, setStep] = useState<'cart' | 'checkout'>('cart');
  const [formData, setFormData] = useState<CheckoutForm>({
    orderType: 'delivery',
    name: '',
    phone: '',
    address: '',
    number: '',
    complement: '',
    neighborhood: '',
    reference: '',
    paymentMethod: 'pix',
    notes: '',
    changeFor: ''
  });
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  if (!isOpen) return null;

  const totalAmount = cartItems.reduce((acc, item) => acc + item.totalPrice, 0);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (errorMsg) setErrorMsg(null);
  };

  const validateForm = () => {
    if (!formData.name.trim()) return 'Por favor, informe o seu Nome.';
    if (!formData.phone.trim()) return 'Por favor, informe seu WhatsApp/Telefone.';
    
    if (formData.orderType === 'delivery') {
      if (!formData.address.trim()) return 'Por favor, informe a Rua/Avenida do seu endereço.';
      if (!formData.number.trim()) return 'Por favor, informe o Número da residência.';
      if (!formData.neighborhood.trim()) return 'Por favor, informe o Bairro.';
    }
    return null;
  };

  const handleSendToWhatsApp = () => {
    const error = validateForm();
    if (error) {
      setErrorMsg(error);
      return;
    }

    // Build the formatted professional comanda receipt
    const message = formatWhatsAppReceipt({
      cartItems,
      formData,
      settings
    });

    openWhatsApp(settings.whatsapp, message);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      {/* Backdrop */}
      <div
        onClick={onClose}
        className="absolute inset-0 bg-black/80 backdrop-blur-sm transition-opacity"
      />

      {/* Drawer Panel */}
      <div className="absolute inset-y-0 right-0 max-w-full flex pl-0 sm:pl-10">
        <div className="w-screen max-w-md bg-[#111111] border-l border-white/15 flex flex-col shadow-2xl">
          {/* Header */}
          <div className="px-5 py-4 bg-[#141414] border-b border-white/10 flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-full overflow-hidden bg-black border border-[#E52521]/60 flex items-center justify-center shrink-0 shadow-md">
                <img
                  src={settings.logo || '/logo.jpg'}
                  alt="Pizzaria Mamma Roma Logo"
                  width={36}
                  height={36}
                  loading="lazy"
                  decoding="async"
                  className="w-full h-full object-cover"
                  referrerPolicy="no-referrer"
                />
              </div>
              <div>
                <h3 className="text-base font-black text-white uppercase tracking-wider">
                  {step === 'cart' ? 'SEU PEDIDO' : 'FINALIZAR PEDIDO'}
                </h3>
                <span className="text-[10px] font-semibold text-[#FFD21A] uppercase tracking-wider block">
                  {settings.name} • Tradição
                </span>
              </div>
            </div>

            <button
              onClick={onClose}
              id="close-cart-drawer-btn"
              aria-label="Fechar painel do carrinho"
              className="p-2 rounded-xl bg-white/5 hover:bg-white/10 text-white/70 hover:text-white transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Body Content */}
          <div className="flex-1 overflow-y-auto p-5 space-y-4">
            {cartItems.length === 0 ? (
              <div className="h-full flex flex-col items-center justify-center text-center space-y-4 py-12">
                <div className="w-20 h-20 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-4xl">
                  🍕
                </div>
                <div className="space-y-1">
                  <h4 className="text-lg font-bold text-white uppercase">Seu carrinho está vazio</h4>
                  <p className="text-xs text-white/60 max-w-xs">
                    Adicione pizzas deliciosas, promoções ou bebidas para continuar seu pedido.
                  </p>
                </div>
                <button
                  onClick={onClose}
                  className="px-6 py-3 rounded-2xl bg-[#E52521] text-white text-xs font-bold uppercase tracking-wider shadow-lg shadow-[#E52521]/30 hover:scale-105 active:scale-95 transition-all cursor-pointer"
                >
                  Ver Cardápio
                </button>
              </div>
            ) : step === 'cart' ? (
              /* --- CART ITEMS LIST --- */
              <div className="space-y-3">
                <div className="flex items-center justify-between pb-2 border-b border-white/10">
                  <span className="text-xs font-bold text-white/70 uppercase">
                    Itens Adicionados ({cartItems.length})
                  </span>
                  <button
                    onClick={onClearCart}
                    className="text-[11px] text-red-400 hover:text-red-300 font-semibold cursor-pointer"
                  >
                    Limpar Tudo
                  </button>
                </div>

                {cartItems.map((item) => (
                  <div
                    key={item.cartId}
                    className="p-3.5 rounded-2xl bg-[#181818] border border-white/10 flex flex-col gap-2.5 shadow-md"
                  >
                    <div className="flex items-start justify-between gap-2">
                      <div className="space-y-1 flex-1">
                        
                        {/* Half-Half Item Representation */}
                        {item.isHalfHalf && item.halfFlavors ? (
                          <div className="space-y-1">
                            <div className="flex items-center gap-1.5 flex-wrap">
                              <span className="bg-[#E52521] text-white text-[9px] font-black uppercase px-2 py-0.5 rounded-md">
                                Meia a Meia
                              </span>
                              <h4 className="text-sm font-extrabold text-white uppercase tracking-tight">
                                Pizza Grande
                              </h4>
                            </div>

                            {/* Detailed halves list */}
                            <div className="text-xs font-bold text-[#FFD21A] space-y-0.5 pl-2 border-l-2 border-[#E52521] my-1">
                              <p>• 1ª Metade: {item.halfFlavors.flavor1?.name || 'Sabor 1'}</p>
                              <p>• 2ª Metade: {item.halfFlavors.flavor2?.name || 'Sabor 2'}</p>
                            </div>

                            <p className="text-[10px] text-white/50">
                              Cobrado pelo maior valor: {formatCurrency(Math.max(Number(item.halfFlavors.flavor1?.price) || 0, Number(item.halfFlavors.flavor2?.price) || 0))}
                            </p>
                          </div>
                        ) : (
                          /* Standard Item Representation */
                          <div>
                            <h4 className="text-sm font-extrabold text-white uppercase tracking-tight">
                              {item.name}
                            </h4>
                            {item.details && (
                              <p className="text-xs font-medium text-white/70 leading-tight mt-0.5">
                                {item.details}
                              </p>
                            )}
                          </div>
                        )}

                        {/* Stuffed Crust Display */}
                        {item.crust && (
                          <div className="mt-1 flex items-center gap-1.5 text-[11px] font-bold text-[#FFD21A] bg-[#FFD21A]/10 px-2 py-0.5 rounded-lg w-fit border border-[#FFD21A]/20">
                            <span>{item.crust.name.toLowerCase().includes('vulcão') || item.crust.name.toLowerCase().includes('vulcao') || item.crust.price === 28 ? '🌋' : '🧀'}</span>
                            <span>Borda: {item.crust.name} (+{formatCurrency(item.crust.price)})</span>
                          </div>
                        )}
                      </div>

                      <button
                        onClick={() => onRemoveItem(item.cartId)}
                        className="text-white/40 hover:text-red-400 p-1 transition-colors cursor-pointer"
                        title="Remover item"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>

                    {/* Quantity Stepper & Price */}
                    <div className="flex items-center justify-between pt-1 border-t border-white/5">
                      <div className="flex items-center bg-black/60 rounded-xl border border-white/10 p-0.5">
                        <button
                          onClick={() => onUpdateQuantity(item.cartId, item.quantity - 1)}
                          className="w-6 h-6 rounded bg-white/5 hover:bg-white/15 text-white flex items-center justify-center text-xs"
                          aria-label="Diminuir"
                        >
                          <Minus className="w-3 h-3" />
                        </button>
                        <span className="w-6 text-center text-xs font-bold text-white">
                          {item.quantity}
                        </span>
                        <button
                          onClick={() => onUpdateQuantity(item.cartId, item.quantity + 1)}
                          className="w-6 h-6 rounded bg-white/5 hover:bg-white/15 text-white flex items-center justify-center text-xs"
                          aria-label="Aumentar"
                        >
                          <Plus className="w-3 h-3" />
                        </button>
                      </div>

                      <span className="text-sm font-black text-[#FFD21A]">
                        {formatCurrency(item.totalPrice)}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="space-y-4">
                <button
                    onClick={() => setStep('cart')}
                    className="flex items-center gap-1.5 text-xs font-bold text-[#FFD21A] hover:underline cursor-pointer mb-2"
                  >
                    <ArrowLeft className="w-3.5 h-3.5" />
                    <span>Voltar para o carrinho</span>
                  </button>

                  {errorMsg && (
                    <div className="p-3 rounded-xl bg-red-500/20 border border-red-500/50 text-red-200 text-xs flex items-center gap-2">
                      <AlertCircle className="w-4 h-4 shrink-0 text-red-400" />
                      <span>{errorMsg}</span>
                    </div>
                  )}

                  {/* 1. Tipo de Pedido */}
                  <div className="space-y-2">
                    <h4 className="text-xs font-bold uppercase tracking-wider text-[#FFD21A]">
                      1. Tipo de Pedido
                    </h4>
                    <div className="grid grid-cols-2 gap-2">
                      <button
                        type="button"
                        onClick={() => setFormData(prev => ({ ...prev, orderType: 'delivery' }))}
                        className={`p-3 rounded-xl border flex flex-col items-center justify-center gap-1.5 transition-all cursor-pointer ${
                          formData.orderType === 'delivery'
                            ? 'bg-[#E52521] text-white border-[#E52521] font-bold shadow-md shadow-[#E52521]/30'
                            : 'bg-black text-white/70 border-white/10 hover:border-white/20'
                        }`}
                      >
                        <Bike className="w-5 h-5" />
                        <span className="text-xs">🛵 Entrega (Delivery)</span>
                      </button>

                      <button
                        type="button"
                        onClick={() => setFormData(prev => ({ ...prev, orderType: 'pickup' }))}
                        className={`p-3 rounded-xl border flex flex-col items-center justify-center gap-1.5 transition-all cursor-pointer ${
                          formData.orderType === 'pickup'
                            ? 'bg-[#E52521] text-white border-[#E52521] font-bold shadow-md shadow-[#E52521]/30'
                            : 'bg-black text-white/70 border-white/10 hover:border-white/20'
                        }`}
                      >
                        <Store className="w-5 h-5" />
                        <span className="text-xs">🏪 Retirada no Balcão</span>
                      </button>
                    </div>
                  </div>

                  {/* 2. Seus Dados para Contato */}
                  <div className="space-y-3 pt-2 border-t border-white/10">
                    <h4 className="text-xs font-bold uppercase tracking-wider text-[#FFD21A]">
                      2. Seus Dados de Contato
                    </h4>

                    <div>
                      <label className="text-[11px] font-semibold text-white/80 block mb-1">
                        Seu Nome Completo *
                      </label>
                      <input
                        type="text"
                        name="name"
                        value={formData.name}
                        onChange={handleInputChange}
                        placeholder="Ex: João da Silva"
                        className="w-full px-3 py-2 rounded-xl bg-black border border-white/15 text-white text-xs placeholder-white/40 focus:border-[#E52521] outline-none"
                      />
                    </div>

                    <div>
                      <label className="text-[11px] font-semibold text-white/80 block mb-1">
                        WhatsApp / Telefone *
                      </label>
                      <input
                        type="tel"
                        name="phone"
                        value={formData.phone}
                        onChange={handleInputChange}
                        placeholder="Ex: (11) 99999-9999"
                        className="w-full px-3 py-2 rounded-xl bg-black border border-white/15 text-white text-xs placeholder-white/40 focus:border-[#E52521] outline-none"
                      />
                    </div>
                  </div>

                  {/* 3. Endereço ou Informações de Retirada */}
                  <div className="space-y-3 pt-2 border-t border-white/10">
                    {formData.orderType === 'delivery' ? (
                      <>
                        <h4 className="text-xs font-bold uppercase tracking-wider text-[#FFD21A] flex items-center gap-1.5">
                          <MapPin className="w-3.5 h-3.5 text-[#E52521]" />
                          <span>3. Endereço de Entrega</span>
                        </h4>

                        <div className="grid grid-cols-3 gap-2">
                          <div className="col-span-2">
                            <label className="text-[11px] font-semibold text-white/80 block mb-1">
                              Rua / Avenida *
                            </label>
                            <input
                              type="text"
                              name="address"
                              value={formData.address}
                              onChange={handleInputChange}
                              placeholder="Ex: Av. Principal"
                              className="w-full px-3 py-2 rounded-xl bg-black border border-white/15 text-white text-xs placeholder-white/40 focus:border-[#E52521] outline-none"
                            />
                          </div>
                          <div>
                            <label className="text-[11px] font-semibold text-white/80 block mb-1">
                              Número *
                            </label>
                            <input
                              type="text"
                              name="number"
                              value={formData.number}
                              onChange={handleInputChange}
                              placeholder="123"
                              className="w-full px-3 py-2 rounded-xl bg-black border border-white/15 text-white text-xs placeholder-white/40 focus:border-[#E52521] outline-none"
                            />
                          </div>
                        </div>

                        <div className="grid grid-cols-2 gap-2">
                          <div>
                            <label className="text-[11px] font-semibold text-white/80 block mb-1">
                              Bairro *
                            </label>
                            <input
                              type="text"
                              name="neighborhood"
                              value={formData.neighborhood}
                              onChange={handleInputChange}
                              placeholder="Ex: Centro"
                              className="w-full px-3 py-2 rounded-xl bg-black border border-white/15 text-white text-xs placeholder-white/40 focus:border-[#E52521] outline-none"
                            />
                          </div>
                          <div>
                            <label className="text-[11px] font-semibold text-white/80 block mb-1">
                              Complemento
                            </label>
                            <input
                              type="text"
                              name="complement"
                              value={formData.complement}
                              onChange={handleInputChange}
                              placeholder="Apto 42, Bloco B"
                              className="w-full px-3 py-2 rounded-xl bg-black border border-white/15 text-white text-xs placeholder-white/40 focus:border-[#E52521] outline-none"
                            />
                          </div>
                        </div>

                        <div>
                          <label className="text-[11px] font-semibold text-white/80 block mb-1">
                            Ponto de Referência (Opcional)
                          </label>
                          <input
                            type="text"
                            name="reference"
                            value={formData.reference || ''}
                            onChange={handleInputChange}
                            placeholder="Ex: Próximo à padaria, portão preto"
                            className="w-full px-3 py-2 rounded-xl bg-black border border-white/15 text-white text-xs placeholder-white/40 focus:border-[#E52521] outline-none"
                          />
                        </div>
                      </>
                    ) : (
                      <>
                        <h4 className="text-xs font-bold uppercase tracking-wider text-[#FFD21A] flex items-center gap-1.5">
                          <Store className="w-3.5 h-3.5 text-[#168A45]" />
                          <span>3. Local de Retirada</span>
                        </h4>
                        <div className="p-3.5 rounded-2xl bg-[#181818] border border-white/15 text-white space-y-1">
                          <p className="text-xs font-bold text-[#FFD21A] flex items-center gap-1">
                            <span>🏪</span> Retirada no Balcão — {settings.name}
                          </p>
                          <p className="text-[11px] text-white/70">
                            {settings.address || 'Rua da Pizzaria Mamma Roma'}
                          </p>
                          <p className="text-[10px] text-[#168A45] font-semibold pt-1">
                            ✓ Sem taxa de entrega • Retirada rápida
                          </p>
                        </div>
                      </>
                    )}
                  </div>

                  {/* 4. Forma de Pagamento */}
                  <div className="space-y-3 pt-2 border-t border-white/10">
                    <h4 className="text-xs font-bold uppercase tracking-wider text-[#FFD21A]">
                      4. Forma de Pagamento
                    </h4>

                    <div className="grid grid-cols-3 gap-2">
                      {[
                        { id: 'pix', label: 'Pix', icon: '⚡' },
                        { id: 'cartao', label: 'Cartão', icon: '💳' },
                        { id: 'dinheiro', label: 'Dinheiro', icon: '💵' },
                      ].map((method) => (
                        <button
                          key={method.id}
                          type="button"
                          onClick={() => setFormData(prev => ({ ...prev, paymentMethod: method.id as PaymentMethod }))}
                          className={`p-2.5 rounded-xl border text-center transition-all cursor-pointer ${
                            formData.paymentMethod === method.id
                              ? 'bg-[#E52521] text-white border-[#E52521] font-bold shadow-md shadow-[#E52521]/30'
                              : 'bg-black text-white/70 border-white/10 hover:border-white/20'
                          }`}
                        >
                          <span className="text-base block mb-0.5">{method.icon}</span>
                          <span className="text-xs block">{method.label}</span>
                        </button>
                      ))}
                    </div>

                    {formData.paymentMethod === 'dinheiro' && (
                      <div className="space-y-1.5 p-3 rounded-xl bg-black/60 border border-white/10">
                        <label className="text-[11px] font-semibold text-white/80 block">
                          Troco para quanto? (Deixe em branco se não precisar)
                        </label>
                        <input
                          type="text"
                          name="changeFor"
                          value={formData.changeFor}
                          onChange={handleInputChange}
                          placeholder="Ex: R$ 100,00"
                          className="w-full px-3 py-2 rounded-xl bg-black border border-white/15 text-white text-xs placeholder-white/40 focus:border-[#E52521] outline-none"
                        />
                        {formData.changeFor && formData.changeFor.trim() && (() => {
                          const rawNumber = formData.changeFor.replace(/[^\d.,]/g, '').replace(',', '.');
                          const num = parseFloat(rawNumber);
                          if (!isNaN(num) && num > totalAmount) {
                            return (
                              <p className="text-[11px] text-[#FFD21A] font-bold pt-1">
                                Troco calculado: {formatCurrency(num - totalAmount)}
                              </p>
                            );
                          }
                          return null;
                        })()}
                      </div>
                    )}
                  </div>

                  {/* 5. Observações Gerais */}
                  <div className="space-y-2 pt-2 border-t border-white/10">
                    <label className="text-[11px] font-semibold text-white/80 block">
                      5. Observações do Pedido (Opcional)
                    </label>
                    <textarea
                      name="notes"
                      value={formData.notes}
                      onChange={handleInputChange}
                      rows={2}
                      placeholder="Ex: Campainha não funciona, talheres descartáveis, etc."
                      className="w-full px-3 py-2 rounded-xl bg-black border border-white/15 text-white text-xs placeholder-white/40 focus:border-[#E52521] outline-none resize-none"
                    />
                  </div>
                </div>
            )}
          </div>

          {/* Footer Actions */}
          {cartItems.length > 0 && (
            <div className="p-4 bg-[#141414] border-t border-white/10 space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs text-white/70 font-semibold uppercase">Total do Pedido:</span>
                <span className="text-xl font-black text-[#FFD21A]">
                  {formatCurrency(totalAmount)}
                </span>
              </div>

              {step === 'cart' ? (
                <button
                  onClick={() => setStep('checkout')}
                  id="checkout-next-btn"
                  className="w-full py-3.5 px-4 rounded-2xl bg-[#E52521] hover:bg-[#c71c18] text-white font-black text-xs uppercase tracking-wider flex items-center justify-center gap-2 shadow-lg shadow-[#E52521]/30 active:scale-95 transition-all cursor-pointer"
                >
                  <span>AVANÇAR PARA ENTREGA</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              ) : (
                <button
                  onClick={handleSendToWhatsApp}
                  id="send-whatsapp-order-btn"
                  className="w-full py-3.5 px-4 rounded-2xl bg-[#168A45] hover:bg-[#13743a] text-white font-black text-xs uppercase tracking-wider flex items-center justify-center gap-2 shadow-lg shadow-[#168A45]/40 active:scale-95 transition-all cursor-pointer"
                >
                  <MessageCircle className="w-4 h-4 fill-white" />
                  <span>ENVIAR PEDIDO NO WHATSAPP</span>
                </button>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
