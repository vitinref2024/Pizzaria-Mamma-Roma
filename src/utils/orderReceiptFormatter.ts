import { CartItem, CheckoutForm, StoreSettings } from '../types';
import { formatCurrency } from './storeUtils';

/**
 * Generates a unique 4-digit order identifier (e.g. #MR-8392)
 */
export function generateOrderId(): string {
  const randomNum = Math.floor(1000 + Math.random() * 9000);
  return `#MR-${randomNum}`;
}

/**
 * Returns formatted date and time in Brazilian format (DD/MM/YYYY às HH:mm)
 */
export function formatOrderDateTime(date: Date = new Date()): string {
  const pad = (n: number) => n.toString().padStart(2, '0');
  const day = pad(date.getDate());
  const month = pad(date.getMonth() + 1);
  const year = date.getFullYear();
  const hours = pad(date.getHours());
  const minutes = pad(date.getMinutes());

  return `${day}/${month}/${year} às ${hours}:${minutes}`;
}

export interface ReceiptOptions {
  cartItems: CartItem[];
  formData: CheckoutForm;
  settings: StoreSettings;
  orderId?: string;
  orderDate?: Date;
  deliveryFee?: number | null;
  discount?: number | null;
}

/**
 * Builds the professional WhatsApp receipt (Comanda) for Pizzaria Mamma Roma
 */
export function formatWhatsAppReceipt({
  cartItems,
  formData,
  settings,
  orderId = generateOrderId(),
  orderDate = new Date(),
  deliveryFee = null,
  discount = null
}: ReceiptOptions): string {
  const lineSeparator = '━━━━━━━━━━━━━━━━━━━━━━━━━━';
  const subtotal = cartItems.reduce((acc, item) => acc + item.totalPrice, 0);
  const total = subtotal + (deliveryFee || 0) - (discount || 0);

  const lines: string[] = [];

  // 1. HEADER
  lines.push(`🍕 *NOVO PEDIDO — ${settings.name.toUpperCase()}*`);
  lines.push(lineSeparator);

  // 2. IDENTIFICAÇÃO DO PEDIDO
  lines.push(`📋 *Nº DO PEDIDO:* ${orderId}`);
  lines.push(`⏰ *HORÁRIO:* ${formatOrderDateTime(orderDate)}`);
  lines.push('');

  // 3. DADOS DO CLIENTE
  lines.push(`👤 *DADOS DO CLIENTE:*`);
  lines.push(`• *Nome:* ${formData.name.trim()}`);
  lines.push(`• *Telefone:* ${formData.phone.trim()}`);
  lines.push('');

  // 4. TIPO DO PEDIDO & ENDEREÇO
  const isDelivery = formData.orderType === 'delivery';
  lines.push(`🛵 *TIPO DE PEDIDO:* ${isDelivery ? 'ENTREGA (Delivery)' : 'RETIRADA NO LOCAL (Balcão)'}`);

  if (isDelivery) {
    lines.push(`📍 *ENDEREÇO DE ENTREGA:*`);
    lines.push(`• *Rua/Av:* ${formData.address.trim()}, Nº ${formData.number.trim()}`);
    if (formData.complement && formData.complement.trim()) {
      lines.push(`• *Complemento:* ${formData.complement.trim()}`);
    }
    lines.push(`• *Bairro:* ${formData.neighborhood.trim()}`);
    if (formData.reference && formData.reference.trim()) {
      lines.push(`• *Ponto de Referência:* ${formData.reference.trim()}`);
    }
  } else {
    lines.push(`🏪 *LOCAL DE RETIRADA:*`);
    lines.push(`• *Pizzaria Mamma Roma*`);
    if (settings.address) {
      lines.push(`• *Endereço da Loja:* ${settings.address}`);
    }
  }

  lines.push('');
  lines.push(lineSeparator);

  // 5. LISTA DE PRODUTOS (Comanda detalhada)
  lines.push(`📋 *ITENS DO PEDIDO:*`);
  lines.push('');

  cartItems.forEach((item, index) => {
    const itemNumber = index + 1;

    if (item.isHalfHalf && item.halfFlavors) {
      // --- PIZZA MEIA A MEIA ---
      const f1 = item.halfFlavors.flavor1;
      const f2 = item.halfFlavors.flavor2;
      const f1Name = f1 ? (f1.number ? `Nº ${f1.number} ${f1.name}` : f1.name) : '1ª Metade';
      const f2Name = f2 ? (f2.number ? `Nº ${f2.number} ${f2.name}` : f2.name) : '2ª Metade';
      const pizzaSize = item.size || 'Grande (8 fatias / 35cm)';

      lines.push(`${itemNumber}. 🍕 *${item.quantity}x Pizza Meia a Meia* — ${formatCurrency(item.totalPrice)}`);
      lines.push(`   • *Tamanho:* ${pizzaSize}`);
      lines.push(`   • *Tipo:* Meio a Meio (2 Sabores)`);
      lines.push(`   • *1ª Metade (50%):* ${f1Name}`);
      lines.push(`   • *2ª Metade (50%):* ${f2Name}`);

      if (item.crust) {
        const isVulcao = item.crust.name.toLowerCase().includes('vulcão') || item.crust.name.toLowerCase().includes('vulcao') || item.crust.price >= 25;
        const icon = isVulcao ? '🌋' : '🧀';
        lines.push(`   • *Borda:* ${icon} ${item.crust.name} (+${formatCurrency(item.crust.price)})`);
      } else {
        lines.push(`   • *Borda:* Sem borda recheada (Massa tradicional)`);
      }

      if (item.additionals && item.additionals.length > 0) {
        lines.push(`   • *Adicionais:* ${item.additionals.join(', ')}`);
      }

      if (item.notes && item.notes.trim()) {
        lines.push(`   • *Observação:* ${item.notes.trim()}`);
      }
    } else if (item.type === 'pizza') {
      // --- PIZZA INTEIRA ---
      const pNumber = item.number ? `Nº ${item.number} ` : '';
      const pFlavor = item.flavor || item.name.replace(/^Pizza (Grande|Doce|Brotinho)\s*—?\s*/i, '');
      const pizzaSize = item.size || (item.name.toLowerCase().includes('doce') || item.name.toLowerCase().includes('brotinho') ? 'Brotinho (4 fatias)' : 'Grande (8 fatias / 35cm)');

      lines.push(`${itemNumber}. 🍕 *${item.quantity}x ${item.name}* — ${formatCurrency(item.totalPrice)}`);
      lines.push(`   • *Tamanho:* ${pizzaSize}`);
      lines.push(`   • *Tipo:* Pizza Inteira (1 Sabor)`);
      lines.push(`   • *Sabor:* ${pNumber}${pFlavor}`);

      if (item.crust) {
        const isVulcao = item.crust.name.toLowerCase().includes('vulcão') || item.crust.name.toLowerCase().includes('vulcao') || item.crust.price >= 25;
        const icon = isVulcao ? '🌋' : '🧀';
        lines.push(`   • *Borda:* ${icon} ${item.crust.name} (+${formatCurrency(item.crust.price)})`);
      } else {
        lines.push(`   • *Borda:* Sem borda recheada (Massa tradicional)`);
      }

      if (item.additionals && item.additionals.length > 0) {
        lines.push(`   • *Adicionais:* ${item.additionals.join(', ')}`);
      }

      if (item.notes && item.notes.trim()) {
        lines.push(`   • *Observação:* ${item.notes.trim()}`);
      } else if (item.details && !item.details.startsWith('Borda') && !item.details.startsWith('Massa')) {
        lines.push(`   • *Detalhes:* ${item.details}`);
      }
    } else if (item.type === 'bebida') {
      // --- BEBIDA ---
      lines.push(`${itemNumber}. 🥤 *${item.quantity}x ${item.name}* — ${formatCurrency(item.totalPrice)}`);
      if (item.details && item.details.trim()) {
        lines.push(`   • *Volume/Detalhes:* ${item.details}`);
      }
    } else if (item.type === 'combo') {
      // --- COMBO ---
      lines.push(`${itemNumber}. 🎁 *${item.quantity}x ${item.name}* — ${formatCurrency(item.totalPrice)}`);
      if (item.details && item.details.trim()) {
        const cleanDetails = item.details.split(' • ').map(d => `• ${d}`).join('\n   ');
        lines.push(`   ${cleanDetails}`);
      }
    } else if (item.type === 'promo') {
      // --- PROMOÇÃO ---
      lines.push(`${itemNumber}. 🔥 *${item.quantity}x ${item.name}* — ${formatCurrency(item.totalPrice)}`);
      if (item.details && item.details.trim()) {
        lines.push(`   • *Sabores:* ${item.details}`);
      }
    } else {
      // --- OUTRO PRODUTO ---
      lines.push(`${itemNumber}. 📦 *${item.quantity}x ${item.name}* — ${formatCurrency(item.totalPrice)}`);
      if (item.details && item.details.trim()) {
        lines.push(`   • *Detalhes:* ${item.details}`);
      }
    }

    lines.push('');
  });

  lines.push(lineSeparator);

  // 6. VALORES & TOTAL
  lines.push(`💰 *RESUMO DE VALORES:*`);
  lines.push(`• *Subtotal dos Itens:* ${formatCurrency(subtotal)}`);

  if (isDelivery) {
    if (deliveryFee !== null && deliveryFee !== undefined && deliveryFee > 0) {
      lines.push(`• *Taxa de Entrega:* ${formatCurrency(deliveryFee)}`);
    } else {
      lines.push(`• *Taxa de Entrega:* A calcular / confirmar no atendimento`);
    }
  } else {
    lines.push(`• *Taxa de Entrega:* R$ 0,00 (Retirada no Local)`);
  }

  if (discount && discount > 0) {
    lines.push(`• *Desconto Aplicado:* -${formatCurrency(discount)}`);
  }

  lines.push(`• *VALOR TOTAL:* *${formatCurrency(total)}*`);
  lines.push('');
  lines.push(lineSeparator);

  // 7. FORMA DE PAGAMENTO & TROCO
  lines.push(`💳 *FORMA DE PAGAMENTO:*`);

  if (formData.paymentMethod === 'pix') {
    lines.push(`• *Método:* ⚡ PIX`);
    lines.push(`• *Status:* Aguardando envio da chave PIX pela pizzaria`);
  } else if (formData.paymentMethod === 'cartao') {
    lines.push(`• *Método:* 💳 Cartão (Débito / Crédito)`);
    lines.push(`• *Status:* Levar maquininha ${isDelivery ? 'na entrega' : 'no balcão'}`);
  } else if (formData.paymentMethod === 'dinheiro') {
    lines.push(`• *Método:* 💵 Dinheiro`);
    if (formData.changeFor && formData.changeFor.trim()) {
      // Try to parse numeric change
      const rawNumber = formData.changeFor.replace(/[^\d.,]/g, '').replace(',', '.');
      const changeNum = parseFloat(rawNumber);

      lines.push(`• *Pagar com nota de:* ${formData.changeFor.trim()}`);
      if (!isNaN(changeNum) && changeNum > total) {
        const changeDue = changeNum - total;
        lines.push(`• *Troco a levar:* *${formatCurrency(changeDue)}*`);
      } else {
        lines.push(`• *Troco:* Troco solicitado para ${formData.changeFor.trim()}`);
      }
    } else {
      lines.push(`• *Troco:* Não precisa de troco (Valor exato)`);
    }
  }

  // 8. OBSERVAÇÕES GERAIS DO CLIENTE
  if (formData.notes && formData.notes.trim()) {
    lines.push('');
    lines.push(lineSeparator);
    lines.push(`📝 *OBSERVAÇÕES DO CLIENTE:*`);
    lines.push(`"${formData.notes.trim()}"`);
  }

  lines.push(lineSeparator);
  lines.push(`_Mensagem gerada automaticamente pelo cardápio digital da ${settings.name}._`);

  return lines.join('\n');
}
