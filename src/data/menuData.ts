import { ProductItem, PromotionOffer, ComboOffer, StuffedCrust, BeverageItem, StoreSettings } from '../types';

import imgBaconMussarela from '../assets/images/bacon_mussarela_real.jpg';
import imgBauru from '../assets/images/bauru_real.jpg';
import imgCalabresa from '../assets/images/calabresa_real.jpg';
import imgCombo2 from '../assets/images/combo_2_real.jpg';
import imgEscarola from '../assets/images/escarola_real.jpg';
import imgFrangoCatupiry from '../assets/images/frango_catupiry_real.jpg';
import imgMilhoRequeijao from '../assets/images/milho_requeijao_real.jpg';
import imgMussarela from '../assets/images/mussarela_real.jpg';
import imgPortuguesa from '../assets/images/portuguesa_real.jpg';
import imgToscana2 from '../assets/images/toscana_2_real.jpg';

import imgAguaMineral from '../assets/images/agua_mineral_real.jpg';
import imgCoca2L from '../assets/images/coca_2l_real.jpg';
import imgCoca600ml from '../assets/images/coca_600ml_real.jpg';
import imgCocaLata from '../assets/images/coca_lata_real.jpg';
import imgDolly2L from '../assets/images/dolly_2l_real.jpg';
import imgFantaLaranja2L from '../assets/images/fanta_laranja_2l_real.jpg';
import imgGuaranaAntarctica from '../assets/images/guarana_antarctica_real.jpg';
import imgSkolLata from '../assets/images/skol_lata_real.jpg';

export const DEFAULT_STORE_SETTINGS: StoreSettings = {
  name: 'Pizzaria Mamma Roma',
  slogan: 'Desde 2002 — Tradição',
  logo: '/logo.jpg',
  whatsapp: '5511954813464',
  whatsappDisplay: '(11) 95481-3464',
  phone: '1139657161',
  phoneDisplay: '3965-7161',
  instagram: '@pizzariamammaroma',
  hours: 'Todos os dias — 18h às 1h',
  address: 'Consulte região de entrega no WhatsApp',
  openHour: 18,
  closeHour: 1,
  isManuallyOpen: null
};

export const PROMOTIONS: PromotionOffer[] = [
  {
    id: 'promo-1',
    title: 'PROMOÇÃO 1',
    price: 40.00,
    badge: 'Super Oferta',
    description: 'Sabores clássicos e doces favoritos por apenas R$ 40,00!',
    flavors: [
      'Mussarela',
      'Calabresa',
      'Milho com Requeijão',
      'Baiana 2',
      'Banana 2',
      'Romeu e Julieta'
    ]
  },
  {
    id: 'promo-2',
    title: 'PROMOÇÃO 2',
    price: 45.00,
    badge: 'Mais Pedida',
    description: 'Grande variedade de sabores tradicionais por apenas R$ 45,00!',
    flavors: [
      'Baiana 1',
      'Dois Queijos',
      'Beringela',
      'Napolitana',
      'Toscana 2',
      'Marguerita',
      'Milho com Mussarela',
      'Escarola',
      'Bauru'
    ]
  },
  {
    id: 'promo-3',
    title: 'PROMOÇÃO 3',
    price: 58.00,
    badge: 'Especial da Casa',
    description: 'Pizzas nobres e repletas de recheio por apenas R$ 58,00!',
    flavors: [
      'Portuguesa',
      'Siciliana',
      'Frango com Catupiry',
      'Palmito com Mussarela',
      'Jardineira',
      'Peruana'
    ]
  }
];

export const COMBOS: ComboOffer[] = [
  {
    id: 'combo-1',
    title: 'COMBO 1',
    price: 65.00,
    badge: 'Combo Família',
    description: 'A combinação perfeita para o seu jantar completo.',
    items: [
      '1 Pizza Grande (Meia Mussarela / Meia Calabresa)',
      '1 Pizza Pequena (Chocolate com Chocolate Branco)',
      '1 Guaraná 1,5L'
    ],
    image: 'https://images.unsplash.com/photo-1513104890138-7c749659a591?auto=format&fit=crop&w=800&q=80'
  },
  {
    id: 'combo-2',
    title: 'COMBO 2',
    price: 100.00,
    badge: 'Combo Galera',
    description: 'Fartura para reunir a família e amigos com sobremesa e refri 2L.',
    items: [
      '1 Pizza Grande de Mussarela',
      '1 Pizza Grande de Calabresa',
      '1 Brotinho Doce de Brigadeiro',
      '1 Coca-Cola 2 Litros'
    ],
    image: imgCombo2
  }
];

export const STUFFED_CRUSTS: StuffedCrust[] = [
  {
    id: 'borda-catupiry',
    name: 'Catupiry',
    price: 16.00,
    description: 'Borda tradicional recheada com legítimo Catupiry cremoso',
    available: true,
    category: 'tradicional'
  },
  {
    id: 'borda-cheddar',
    name: 'Cheddar',
    price: 16.00,
    description: 'Borda tradicional com queijo cheddar quente e marcante',
    available: true,
    category: 'tradicional'
  },
  {
    id: 'borda-chocolate',
    name: 'Chocolate',
    price: 16.00,
    description: 'Borda tradicional doce recheada com chocolate aveludado',
    available: true,
    category: 'tradicional'
  },
  {
    id: 'borda-goiabada',
    name: 'Goiabada',
    price: 16.00,
    description: 'Borda tradicional com deliciosa goiabada cremosa',
    available: true,
    category: 'tradicional'
  },
  {
    id: 'borda-vulcao',
    name: 'Borda Vulcão',
    price: 28.00,
    description: 'Opção especial! Efeito vulcânico espetacular com recheio cremoso e generoso transbordando em cada fatia',
    available: true,
    isVulcao: true,
    category: 'vulcao'
  }
];

export const BEVERAGES: BeverageItem[] = [
  {
    id: 'coca-2l',
    name: 'Coca-Cola 2 litros',
    price: 20.00,
    volume: '2L',
    image: imgCoca2L,
    available: true
  },
  {
    id: 'guarana-antarctica',
    name: 'Guaraná Antarctica',
    price: 18.00,
    volume: '2L',
    image: imgGuaranaAntarctica,
    available: true
  },
  {
    id: 'coca-lata',
    name: 'Coca-Cola lata',
    price: 7.00,
    volume: '350ml',
    image: imgCocaLata,
    available: true
  },
  {
    id: 'agua-mineral',
    name: 'Água mineral',
    price: 5.00,
    volume: '500ml',
    image: imgAguaMineral,
    available: true
  },
  {
    id: 'coca-600ml',
    name: 'Coca-Cola 600 ml',
    price: 12.00,
    volume: '600ml',
    image: imgCoca600ml,
    available: true
  },
  {
    id: 'skol-lata',
    name: 'Skol lata',
    price: 6.00,
    volume: '350ml',
    image: imgSkolLata,
    available: true
  },
  {
    id: 'dolly-2l',
    name: 'Dolly 2 litros',
    price: 12.00,
    volume: '2L',
    image: imgDolly2L,
    available: true
  },
  {
    id: 'fanta-laranja-2l',
    name: 'Fanta Laranja 2 litros',
    price: 18.00,
    volume: '2L',
    image: imgFantaLaranja2L,
    available: true
  }
];

export const INITIAL_PRODUCTS: ProductItem[] = [
  // --- PIZZAS SALGADAS (49 Sabores) ---
  {
    id: 'pizza-03',
    number: '03',
    name: 'Alho e Óleo',
    category: 'salgadas',
    description: 'Molho de tomate especial, alho frito dourado, parmesão ralado e orégano.',
    price: 56.00,
    image: 'https://images.unsplash.com/photo-1513104890138-7c749659a591?auto=format&fit=crop&w=600&q=80',
    available: true,
    tags: ['Tradicional'],
    order: 3
  },
  {
    id: 'pizza-04',
    number: '04',
    name: 'Americana',
    category: 'salgadas',
    description: 'Molho de tomate, presunto, palmito, ervilha, mussarela e bacon crocante.',
    price: 68.00,
    image: 'https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?auto=format&fit=crop&w=600&q=80',
    available: true,
    tags: ['Especial'],
    order: 4
  },
  {
    id: 'pizza-05',
    number: '05',
    name: 'Atum',
    category: 'salgadas',
    description: 'Molho de tomate, atum sólido de primeira qualidade, cebola fatiada e azeitonas.',
    price: 56.00,
    image: 'https://images.unsplash.com/photo-1534308983496-4fabb1a015ee?auto=format&fit=crop&w=600&q=80',
    available: true,
    tags: ['Tradicional'],
    order: 5
  },
  {
    id: 'pizza-06',
    number: '06',
    name: 'A Moda da Casa',
    category: 'salgadas',
    description: 'Molho de tomate, presunto cozido, palmito nobre, mussarela derretida e bacon especial.',
    price: 68.00,
    image: 'https://images.unsplash.com/photo-1593560708920-61dd98c46a4e?auto=format&fit=crop&w=600&q=80',
    available: true,
    featured: true,
    tags: ['Mais pedida', 'Especial'],
    order: 6
  },
  {
    id: 'pizza-07',
    number: '07',
    name: 'Bacon com Mussarela',
    category: 'salgadas',
    description: 'Molho de tomate, generosa camada de mussarela e fatias crocantes de bacon selecionado.',
    price: 58.00,
    image: imgBaconMussarela,
    available: true,
    tags: ['Tradicional'],
    order: 7
  },
  {
    id: 'pizza-08',
    number: '08',
    name: 'Baiana 1',
    category: 'salgadas',
    description: 'Molho de tomate, calabresa moída temperada, ovos picados, cebola, pimenta calabresa e orégano.',
    price: 45.00,
    promoPrice: 45.00,
    promotion: true,
    image: 'https://images.unsplash.com/photo-1534308983496-4fabb1a015ee?auto=format&fit=crop&w=600&q=80',
    available: true,
    tags: ['Promoção', 'Tradicional'],
    order: 8
  },
  {
    id: 'pizza-08b',
    name: 'Baiana 2',
    category: 'salgadas',
    description: 'Molho de tomate, calabresa moída apimentada, cebola fatiada, pimenta calabresa e mussarela derretida.',
    price: 40.00,
    promoPrice: 40.00,
    promotion: true,
    image: 'https://images.unsplash.com/photo-1534308983496-4fabb1a015ee?auto=format&fit=crop&w=600&q=80',
    available: true,
    tags: ['Promoção', 'Tradicional'],
    order: 8
  },
  {
    id: 'pizza-09',
    number: '09',
    name: 'Bauru',
    category: 'salgadas',
    description: 'Molho de tomate, presunto fatiado, rodelas de tomate fresco e mussarela gratinada.',
    price: 45.00,
    promoPrice: 45.00,
    promotion: true,
    image: imgBauru,
    available: true,
    tags: ['Promoção', 'Tradicional'],
    order: 9
  },
  {
    id: 'pizza-10',
    number: '10',
    name: 'Beija-Flor',
    category: 'salgadas',
    description: 'Molho de tomate, peito de frango desfiado temperado, palmito macio, mussarela e orégano.',
    price: 68.00,
    image: 'https://images.unsplash.com/photo-1574071318508-1cdbab80d002?auto=format&fit=crop&w=600&q=80',
    available: true,
    tags: ['Especial'],
    order: 10
  },
  {
    id: 'pizza-11',
    number: '11',
    name: 'Beringela',
    category: 'salgadas',
    description: 'Molho de tomate, berinjela temperada refogada da casa, mussarela e azeitonas pretas.',
    price: 45.00,
    promoPrice: 45.00,
    promotion: true,
    image: 'https://images.unsplash.com/photo-1574071318508-1cdbab80d002?auto=format&fit=crop&w=600&q=80',
    available: true,
    tags: ['Promoção', 'Tradicional'],
    order: 11
  },
  {
    id: 'pizza-12',
    number: '12',
    name: 'Batata Palha',
    category: 'salgadas',
    description: 'Molho de tomate, frango desfiado com catupiry coberto com crocante batata palha.',
    price: 68.00,
    image: 'https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?auto=format&fit=crop&w=600&q=80',
    available: true,
    tags: ['Especial'],
    order: 12
  },
  {
    id: 'pizza-13',
    number: '13',
    name: 'Brócolis com Palmito',
    category: 'salgadas',
    description: 'Molho de tomate, brócolis fresco refogado ao alho, palmito nobre e mussarela.',
    price: 68.00,
    image: 'https://images.unsplash.com/photo-1574071318508-1cdbab80d002?auto=format&fit=crop&w=600&q=80',
    available: true,
    tags: ['Especial'],
    order: 13
  },
  {
    id: 'pizza-14',
    number: '14',
    name: 'Caipira',
    category: 'salgadas',
    description: 'Molho de tomate, frango desfiado suculento, milho verde selecionado, catupiry e bacon.',
    price: 72.00,
    image: 'https://images.unsplash.com/photo-1593560708920-61dd98c46a4e?auto=format&fit=crop&w=600&q=80',
    available: true,
    tags: ['Mais pedida', 'Especial'],
    order: 14
  },
  {
    id: 'pizza-15',
    number: '15',
    name: 'Calabresa',
    category: 'salgadas',
    description: 'Molho de tomate especial, fatias de calabresa defumada artesanal, cebola fresca e azeitonas.',
    price: 40.00,
    promoPrice: 40.00,
    promotion: true,
    image: imgCalabresa,
    available: true,
    featured: true,
    tags: ['Mais pedida', 'Promoção', 'Tradicional'],
    order: 15
  },
  {
    id: 'pizza-16',
    number: '16',
    name: 'Cinco Queijos',
    category: 'salgadas',
    description: 'Molho de tomate, mussarela, provolone defumado, catupiry, parmesão e gorgonzola.',
    price: 72.00,
    image: 'https://images.unsplash.com/photo-1513104890138-7c749659a591?auto=format&fit=crop&w=600&q=80',
    available: true,
    tags: ['Especial'],
    order: 16
  },
  {
    id: 'pizza-17',
    number: '17',
    name: 'Moda do Chefe',
    category: 'salgadas',
    description: 'Molho de tomate, lombo canadense fatiado, palmito, mussarela, catupiry e bacon.',
    price: 68.00,
    image: 'https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?auto=format&fit=crop&w=600&q=80',
    available: true,
    tags: ['Especial'],
    order: 17
  },
  {
    id: 'pizza-18',
    number: '18',
    name: 'Carne Seca',
    category: 'salgadas',
    description: 'Molho de tomate, carne seca desfiada e temperada, mussarela derretida e cebola.',
    price: 72.00,
    image: 'https://images.unsplash.com/photo-1593560708920-61dd98c46a4e?auto=format&fit=crop&w=600&q=80',
    available: true,
    tags: ['Especial'],
    order: 18
  },
  {
    id: 'pizza-19',
    number: '19',
    name: 'Catupiry',
    category: 'salgadas',
    description: 'Molho de tomate, generosa camada do autêntico queijo Catupiry cremoso e azeitonas.',
    price: 72.00,
    image: 'https://images.unsplash.com/photo-1513104890138-7c749659a591?auto=format&fit=crop&w=600&q=80',
    available: true,
    tags: ['Especial'],
    order: 19
  },
  {
    id: 'pizza-20',
    number: '20',
    name: 'Dois Queijos',
    category: 'salgadas',
    description: 'Molho de tomate coberto com deliciosa combinação de mussarela e Catupiry.',
    price: 45.00,
    promoPrice: 45.00,
    promotion: true,
    image: 'https://images.unsplash.com/photo-1513104890138-7c749659a591?auto=format&fit=crop&w=600&q=80',
    available: true,
    tags: ['Promoção', 'Tradicional'],
    order: 20
  },
  {
    id: 'pizza-21',
    number: '21',
    name: 'Escarola',
    category: 'salgadas',
    description: 'Molho de tomate, escarola fresca refogada ao azeite e alho, mussarela e bacon crocante.',
    price: 45.00,
    promoPrice: 45.00,
    promotion: true,
    image: imgEscarola,
    available: true,
    tags: ['Promoção', 'Tradicional'],
    order: 21
  },
  {
    id: 'pizza-22',
    number: '22',
    name: 'Espanhola',
    category: 'salgadas',
    description: 'Molho de tomate, atum sólido, palmito nobre, mussarela e rodelas de tomate fresco.',
    price: 68.00,
    image: 'https://images.unsplash.com/photo-1534308983496-4fabb1a015ee?auto=format&fit=crop&w=600&q=80',
    available: true,
    tags: ['Especial'],
    order: 22
  },
  {
    id: 'pizza-23',
    number: '23',
    name: 'Ferrari',
    category: 'salgadas',
    description: 'Molho de tomate, peito de peru defumado, palmito, mussarela derretida e bacon.',
    price: 68.00,
    image: 'https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?auto=format&fit=crop&w=600&q=80',
    available: true,
    tags: ['Especial'],
    order: 23
  },
  {
    id: 'pizza-24',
    number: '24',
    name: 'Frango com Catupiry',
    category: 'salgadas',
    description: 'Molho de tomate, peito de frango desfiado bem temperado coberto com Catupiry original.',
    price: 58.00,
    promoPrice: 58.00,
    promotion: true,
    image: imgFrangoCatupiry,
    available: true,
    featured: true,
    tags: ['Mais pedida', 'Promoção', 'Tradicional'],
    order: 24
  },
  {
    id: 'pizza-25',
    number: '25',
    name: 'Frango Palmito',
    category: 'salgadas',
    description: 'Molho de tomate, frango desfiado temperado, palmito macio, mussarela e orégano.',
    price: 65.00,
    image: 'https://images.unsplash.com/photo-1574071318508-1cdbab80d002?auto=format&fit=crop&w=600&q=80',
    available: true,
    tags: ['Especial'],
    order: 25
  },
  {
    id: 'pizza-27',
    number: '27',
    name: 'Grega',
    category: 'salgadas',
    description: 'Molho de tomate, palmito macio picado, ervilhas frescas, mussarela e orégano.',
    price: 68.00,
    image: 'https://images.unsplash.com/photo-1574071318508-1cdbab80d002?auto=format&fit=crop&w=600&q=80',
    available: true,
    tags: ['Especial'],
    order: 27
  },
  {
    id: 'pizza-28',
    number: '28',
    name: 'Jardineira',
    category: 'salgadas',
    description: 'Molho de tomate, palmito, ervilha, milho, presunto, ovos picados e mussarela.',
    price: 58.00,
    promoPrice: 58.00,
    promotion: true,
    image: 'https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?auto=format&fit=crop&w=600&q=80',
    available: true,
    tags: ['Promoção', 'Especial'],
    order: 28
  },
  {
    id: 'pizza-29',
    number: '29',
    name: 'Light',
    category: 'salgadas',
    description: 'Molho de tomate, peito de peru defumado, palmito, queijo branco fresco e tomate picado.',
    price: 68.00,
    image: 'https://images.unsplash.com/photo-1604382355076-af4b0eb60143?auto=format&fit=crop&w=600&q=80',
    available: true,
    tags: ['Especial'],
    order: 29
  },
  {
    id: 'pizza-30',
    number: '30',
    name: 'Frango Especial',
    category: 'salgadas',
    description: 'Molho de tomate, frango desfiado, milho verde, mussarela derretida, catupiry e bacon.',
    price: 72.00,
    image: 'https://images.unsplash.com/photo-1593560708920-61dd98c46a4e?auto=format&fit=crop&w=600&q=80',
    available: true,
    tags: ['Especial'],
    order: 30
  },
  {
    id: 'pizza-31',
    number: '31',
    name: 'Las Vegas',
    category: 'salgadas',
    description: 'Molho de tomate, lombo canadense, champignon fatiado, mussarela e catupiry cremoso.',
    price: 68.00,
    image: 'https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?auto=format&fit=crop&w=600&q=80',
    available: true,
    tags: ['Especial'],
    order: 31
  },
  {
    id: 'pizza-32',
    number: '32',
    name: 'Lombo Canadense',
    category: 'salgadas',
    description: 'Molho de tomate, fatias de lombo canadense defumado, cebola fatiada e mussarela.',
    price: 72.00,
    image: 'https://images.unsplash.com/photo-1534308983496-4fabb1a015ee?auto=format&fit=crop&w=600&q=80',
    available: true,
    tags: ['Especial'],
    order: 32
  },
  {
    id: 'pizza-33',
    number: '33',
    name: 'Mamma Roma',
    category: 'salgadas',
    description: 'Molho de tomate especial da casa, calabresa fatiada, palmito, catupiry, mussarela e bacon.',
    price: 68.00,
    image: 'https://images.unsplash.com/photo-1593560708920-61dd98c46a4e?auto=format&fit=crop&w=600&q=80',
    available: true,
    featured: true,
    tags: ['Mais pedida', 'Especial'],
    order: 33
  },
  {
    id: 'pizza-34',
    number: '34',
    name: 'Marguerita',
    category: 'salgadas',
    description: 'Molho de tomate, mussarela abundante, rodelas de tomate fresco, parmesão e manjericão fresco.',
    price: 45.00,
    promoPrice: 45.00,
    promotion: true,
    image: 'https://images.unsplash.com/photo-1604382355076-af4b0eb60143?auto=format&fit=crop&w=600&q=80',
    available: true,
    tags: ['Promoção', 'Tradicional'],
    order: 34
  },
  {
    id: 'pizza-35',
    number: '35',
    name: 'Macilari',
    category: 'salgadas',
    description: 'Molho de tomate, peito de frango desfiado, presunto picado, mussarela e bacon.',
    price: 68.00,
    image: 'https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?auto=format&fit=crop&w=600&q=80',
    available: true,
    tags: ['Especial'],
    order: 35
  },
  {
    id: 'pizza-36',
    number: '36',
    name: 'Milho com Mussarela',
    category: 'salgadas',
    description: 'Molho de tomate, milho verde adocicado selecionado coberto com generosa mussarela.',
    price: 45.00,
    promoPrice: 45.00,
    promotion: true,
    image: 'https://images.unsplash.com/photo-1513104890138-7c749659a591?auto=format&fit=crop&w=600&q=80',
    available: true,
    tags: ['Promoção', 'Tradicional'],
    order: 36
  },
  {
    id: 'pizza-36b',
    name: 'Milho com Requeijão',
    category: 'salgadas',
    description: 'Molho de tomate especial, milho verde selecionado coberto com requeijão cremoso e orégano.',
    price: 40.00,
    promoPrice: 40.00,
    promotion: true,
    image: imgMilhoRequeijao,
    available: true,
    tags: ['Promoção', 'Tradicional'],
    order: 36
  },
  {
    id: 'pizza-37',
    number: '37',
    name: 'Mussarela',
    category: 'salgadas',
    description: 'Molho de tomate artesanal, coberta com mussarela de primeiríssima qualidade gratinada e azeitonas.',
    price: 40.00,
    promoPrice: 40.00,
    promotion: true,
    image: imgMussarela,
    available: true,
    featured: true,
    tags: ['Mais pedida', 'Promoção', 'Tradicional'],
    order: 37
  },
  {
    id: 'pizza-38',
    number: '38',
    name: 'Mussarela de Búfala',
    category: 'salgadas',
    description: 'Molho de tomate, legítima mussarela de búfala fresca, tomate seco e folhas de manjericão.',
    price: 72.00,
    image: 'https://images.unsplash.com/photo-1604382355076-af4b0eb60143?auto=format&fit=crop&w=600&q=80',
    available: true,
    tags: ['Especial'],
    order: 38
  },
  {
    id: 'pizza-39',
    number: '39',
    name: 'Napolitana',
    category: 'salgadas',
    description: 'Molho de tomate, mussarela farta, rodelas de tomate fresco, parmesão ralado e orégano.',
    price: 45.00,
    promoPrice: 45.00,
    promotion: true,
    image: 'https://images.unsplash.com/photo-1604382355076-af4b0eb60143?auto=format&fit=crop&w=600&q=80',
    available: true,
    tags: ['Promoção', 'Tradicional'],
    order: 39
  },
  {
    id: 'pizza-40',
    number: '40',
    name: 'Palmito com Mussarela',
    category: 'salgadas',
    description: 'Molho de tomate, palmito nobre fatiado e generosa camada de mussarela derretida.',
    price: 58.00,
    promoPrice: 58.00,
    promotion: true,
    image: 'https://images.unsplash.com/photo-1574071318508-1cdbab80d002?auto=format&fit=crop&w=600&q=80',
    available: true,
    tags: ['Promoção', 'Tradicional'],
    order: 40
  },
  {
    id: 'pizza-41',
    number: '41',
    name: 'Peperoni Especial',
    category: 'salgadas',
    description: 'Molho de tomate, pepperoni fatiado crocante, mussarela, catupiry e orégano.',
    price: 72.00,
    image: 'https://images.unsplash.com/photo-1628840042765-356cda07504e?auto=format&fit=crop&w=600&q=80',
    available: true,
    tags: ['Mais pedida', 'Especial'],
    order: 41
  },
  {
    id: 'pizza-42',
    number: '42',
    name: 'Peito de Peru',
    category: 'salgadas',
    description: 'Molho de tomate, peito de peru defumado fatiado, cebola e mussarela ou catupiry.',
    price: 68.00,
    image: 'https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?auto=format&fit=crop&w=600&q=80',
    available: true,
    tags: ['Especial'],
    order: 42
  },
  {
    id: 'pizza-43',
    number: '43',
    name: 'Peperoni',
    category: 'salgadas',
    description: 'Molho de tomate, fatias de pepperoni selecionado e mussarela gratinada.',
    price: 68.00,
    image: 'https://images.unsplash.com/photo-1628840042765-356cda07504e?auto=format&fit=crop&w=600&q=80',
    available: true,
    tags: ['Especial'],
    order: 43
  },
  {
    id: 'pizza-44',
    number: '44',
    name: 'Peruana',
    category: 'salgadas',
    description: 'Molho de tomate, atum sólido temperado, cebola fatiada, mussarela derretida e bacon.',
    price: 58.00,
    promoPrice: 58.00,
    promotion: true,
    image: 'https://images.unsplash.com/photo-1534308983496-4fabb1a015ee?auto=format&fit=crop&w=600&q=80',
    available: true,
    tags: ['Promoção', 'Especial'],
    order: 44
  },
  {
    id: 'pizza-45',
    number: '45',
    name: 'Portuguesa',
    category: 'salgadas',
    description: 'Molho de tomate, presunto cozido, ovos cozidos picados, cebola, ervilha, mussarela e azeitonas.',
    price: 58.00,
    promoPrice: 58.00,
    promotion: true,
    image: imgPortuguesa,
    available: true,
    featured: true,
    tags: ['Mais pedida', 'Promoção', 'Tradicional'],
    order: 45
  },
  {
    id: 'pizza-46',
    number: '46',
    name: 'Provolone',
    category: 'salgadas',
    description: 'Molho de tomate, farta camada de queijo provolone defumado gratinado com orégano.',
    price: 86.00,
    image: 'https://images.unsplash.com/photo-1513104890138-7c749659a591?auto=format&fit=crop&w=600&q=80',
    available: true,
    tags: ['Especial'],
    order: 46
  },
  {
    id: 'pizza-47',
    number: '47',
    name: 'Quatro Queijos',
    category: 'salgadas',
    description: 'Molho de tomate, mussarela, provolone, catupiry cremoso e parmesão ralado.',
    price: 68.00,
    image: 'https://images.unsplash.com/photo-1513104890138-7c749659a591?auto=format&fit=crop&w=600&q=80',
    available: true,
    tags: ['Mais pedida', 'Tradicional'],
    order: 47
  },
  {
    id: 'pizza-50',
    number: '50',
    name: 'Rúcula',
    category: 'salgadas',
    description: 'Molho de tomate, mussarela de búfala, folhas frescas de rúcula e tomate seco.',
    price: 72.00,
    image: 'https://images.unsplash.com/photo-1604382355076-af4b0eb60143?auto=format&fit=crop&w=600&q=80',
    available: true,
    tags: ['Especial'],
    order: 50
  },
  {
    id: 'pizza-51',
    number: '51',
    name: 'Siciliana',
    category: 'salgadas',
    description: 'Molho de tomate, champignon fatiado temperado, mussarela derretida e bacon crocante.',
    price: 58.00,
    promoPrice: 58.00,
    promotion: true,
    image: 'https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?auto=format&fit=crop&w=600&q=80',
    available: true,
    tags: ['Promoção', 'Especial'],
    order: 51
  },
  {
    id: 'pizza-53',
    number: '53',
    name: 'Toscana 2',
    category: 'salgadas',
    description: 'Molho de tomate, calabresa fatiada artesanal coberta com mussarela derretida.',
    price: 45.00,
    promoPrice: 45.00,
    promotion: true,
    image: imgToscana2,
    available: true,
    tags: ['Promoção', 'Tradicional'],
    order: 53
  },
  {
    id: 'pizza-54',
    number: '54',
    name: 'Vegetariana',
    category: 'salgadas',
    description: 'Molho de tomate, palmito, ervilha, milho verde, brócolis fresco e mussarela.',
    price: 68.00,
    image: 'https://images.unsplash.com/photo-1574071318508-1cdbab80d002?auto=format&fit=crop&w=600&q=80',
    available: true,
    tags: ['Especial'],
    order: 54
  },
  {
    id: 'pizza-55',
    number: '55',
    name: 'Zácaro',
    category: 'salgadas',
    description: 'Molho de tomate, atum sólido, cebola, palmito, mussarela e catupiry.',
    price: 68.00,
    image: 'https://images.unsplash.com/photo-1534308983496-4fabb1a015ee?auto=format&fit=crop&w=600&q=80',
    available: true,
    tags: ['Especial'],
    order: 55
  },

  // --- PIZZAS DOCES (11 Sabores) ---
  {
    id: 'pizza-56',
    number: '56',
    name: 'Banana Mix',
    category: 'doces',
    description: 'Banana fatiada, leite condensado, canela em pó, chocolate ao leite e chocolate branco.',
    price: 58.00,
    image: 'https://images.unsplash.com/photo-1588315029754-2dd089d39a1a?auto=format&fit=crop&w=600&q=80',
    available: true,
    tags: ['Doce', 'Especial'],
    order: 56
  },
  {
    id: 'pizza-57',
    number: '57',
    name: 'Banana 2',
    category: 'doces',
    description: 'Banana caramelizada, açúcar com canela e cobertura suave de mussarela ou leite condensado.',
    price: 40.00,
    promoPrice: 40.00,
    promotion: true,
    image: 'https://images.unsplash.com/photo-1588315029754-2dd089d39a1a?auto=format&fit=crop&w=600&q=80',
    available: true,
    tags: ['Promoção', 'Doce', 'Tradicional'],
    order: 57
  },
  {
    id: 'pizza-58',
    number: '58',
    name: 'Chocolate puro',
    category: 'doces',
    description: 'Generosa camada de chocolate ao leite aveludado e granulado crocante.',
    price: 58.00,
    image: 'https://images.unsplash.com/photo-1588315029754-2dd089d39a1a?auto=format&fit=crop&w=600&q=80',
    available: true,
    tags: ['Doce', 'Tradicional'],
    order: 58
  },
  {
    id: 'pizza-59',
    number: '59',
    name: 'Chocolate com banana',
    category: 'doces',
    description: 'Camada de chocolate ao leite derretido coberto com fatias de banana fresca.',
    price: 62.00,
    image: 'https://images.unsplash.com/photo-1588315029754-2dd089d39a1a?auto=format&fit=crop&w=600&q=80',
    available: true,
    tags: ['Doce'],
    order: 59
  },
  {
    id: 'pizza-60',
    number: '60',
    name: 'Chocolate com morango',
    category: 'doces',
    description: 'Chocolate ao leite cremoso coberto com morangos frescos fatiados na hora.',
    price: 68.00,
    image: 'https://images.unsplash.com/photo-1588315029754-2dd089d39a1a?auto=format&fit=crop&w=600&q=80',
    available: true,
    featured: true,
    tags: ['Mais pedida', 'Doce', 'Especial'],
    order: 60
  },
  {
    id: 'pizza-61',
    number: '61',
    name: 'Prestígio',
    category: 'doces',
    description: 'Chocolate ao leite cremoso coberto com coco ralado fresco e leite condensado.',
    price: 58.00,
    image: 'https://images.unsplash.com/photo-1588315029754-2dd089d39a1a?auto=format&fit=crop&w=600&q=80',
    available: true,
    tags: ['Doce'],
    order: 61
  },
  {
    id: 'pizza-62',
    number: '62',
    name: 'Romeu e Julieta',
    category: 'doces',
    description: 'Mussarela derretida no forno com generosa camada de goiabada cascão cremosa.',
    price: 40.00,
    promoPrice: 40.00,
    promotion: true,
    image: 'https://images.unsplash.com/photo-1571407970349-bc81e7e96d47?auto=format&fit=crop&w=600&q=80',
    available: true,
    tags: ['Promoção', 'Doce', 'Tradicional'],
    order: 62
  },
  {
    id: 'pizza-63',
    number: '63',
    name: 'MM',
    category: 'doces',
    description: 'Base de chocolate ao leite cremosa coberta com confeitos coloridos crocantes de M&M.',
    price: 68.00,
    image: 'https://images.unsplash.com/photo-1588315029754-2dd089d39a1a?auto=format&fit=crop&w=600&q=80',
    available: true,
    tags: ['Doce', 'Especial'],
    order: 63
  },
  {
    id: 'pizza-mm-brotinho',
    name: 'MM pequena/brotinho',
    category: 'doces',
    description: 'Tamanho brotinho/pequena: Base de chocolate ao leite cremosa coberta com confeitos coloridos crocantes de M&M.',
    price: 52.00,
    image: 'https://images.unsplash.com/photo-1588315029754-2dd089d39a1a?auto=format&fit=crop&w=600&q=80',
    available: true,
    tags: ['Doce'],
    order: 63
  },
  {
    id: 'pizza-64',
    number: '64',
    name: 'Sensação',
    category: 'doces',
    description: 'Chocolate ao leite com pedaços de morango fresco e toque especial de chocolate branco.',
    price: 72.00,
    image: 'https://images.unsplash.com/photo-1588315029754-2dd089d39a1a?auto=format&fit=crop&w=600&q=80',
    available: true,
    tags: ['Doce', 'Mais pedida'],
    order: 64
  },
  {
    id: 'pizza-sensacao-brotinho',
    name: 'Sensação pequena/brotinho',
    category: 'doces',
    description: 'Tamanho brotinho/pequena: Chocolate ao leite com pedaços de morango fresco e chocolate branco.',
    price: 52.00,
    image: 'https://images.unsplash.com/photo-1588315029754-2dd089d39a1a?auto=format&fit=crop&w=600&q=80',
    available: true,
    tags: ['Doce'],
    order: 64
  }
];
