export type ProductCategory = 'todas' | 'salgadas' | 'doces' | 'promocoes' | 'combos' | 'bordas' | 'bebidas';

export type ProductTag = 'Mais pedida' | 'Promoção' | 'Doce' | 'Tradicional' | 'Especial' | 'Novidade';

export interface ProductItem {
  id: string;
  number?: string;
  name: string;
  category: 'salgadas' | 'doces' | 'bebidas' | 'bordas';
  description: string;
  ingredients?: string[];
  price: number;
  promoPrice?: number;
  image: string;
  available: boolean;
  featured?: boolean;
  promotion?: boolean;
  tags?: ProductTag[];
  order?: number;
}

export interface PromotionOffer {
  id: string;
  title: string;
  price: number;
  flavors: string[];
  badge?: string;
  description?: string;
}

export interface ComboOffer {
  id: string;
  title: string;
  price: number;
  description: string;
  items: string[];
  badge?: string;
  image: string;
}

export interface StuffedCrust {
  id: string;
  name: string;
  price: number;
  description?: string;
  image?: string;
  available: boolean;
  isVulcao?: boolean;
  category?: 'tradicional' | 'vulcao';
}

export interface BeverageItem {
  id: string;
  name: string;
  price: number;
  volume: string;
  image: string;
  available: boolean;
}

export interface CartItem {
  cartId: string;
  type: 'pizza' | 'promo' | 'combo' | 'borda' | 'bebida';
  name: string;
  number?: string;
  flavor?: string;
  size?: string;
  isHalfHalf?: boolean;
  halfFlavors?: {
    flavor1: { id: string; name: string; price: number; number?: string };
    flavor2: { id: string; name: string; price: number; number?: string };
  };
  details?: string;
  crust?: { name: string; price: number };
  beverage?: { name: string; price: number };
  additionals?: string[];
  notes?: string;
  unitPrice: number;
  quantity: number;
  totalPrice: number;
  image?: string;
}

export type PaymentMethod = 'dinheiro' | 'pix' | 'cartao';
export type OrderType = 'delivery' | 'pickup';

export interface CheckoutForm {
  orderType: OrderType;
  name: string;
  phone: string;
  address: string;
  number: string;
  complement: string;
  neighborhood: string;
  reference?: string;
  paymentMethod: PaymentMethod;
  notes: string;
  changeFor?: string;
}

export interface StoreSettings {
  name: string;
  slogan: string;
  logo?: string;
  whatsapp: string;
  whatsappDisplay: string;
  phone: string;
  phoneDisplay: string;
  instagram: string;
  hours: string;
  address: string;
  openHour: number;
  closeHour: number;
  isManuallyOpen?: boolean | null; // null = auto calculate
}
