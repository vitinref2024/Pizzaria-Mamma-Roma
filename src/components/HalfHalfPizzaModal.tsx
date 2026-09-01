import React from 'react';
import { ProductItem, StuffedCrust, CartItem } from '../types';
import { PizzaCustomizerModal } from './PizzaCustomizerModal';

interface HalfHalfPizzaModalProps {
  isOpen: boolean;
  onClose: () => void;
  products: ProductItem[];
  stuffedCrusts: StuffedCrust[];
  initialFlavor1Id?: string | null;
  onAddToCart: (item: CartItem) => void;
}

export const HalfHalfPizzaModal: React.FC<HalfHalfPizzaModalProps> = ({
  isOpen,
  onClose,
  products,
  stuffedCrusts,
  initialFlavor1Id,
  onAddToCart
}) => {
  const selectedPizza = initialFlavor1Id ? products.find(p => p.id === initialFlavor1Id) || null : null;

  return (
    <PizzaCustomizerModal
      isOpen={isOpen}
      onClose={onClose}
      selectedPizza={selectedPizza}
      products={products}
      stuffedCrusts={stuffedCrusts}
      onAddToCart={onAddToCart}
      initialMode={initialFlavor1Id ? 'choice' : 'half-half'}
    />
  );
};
