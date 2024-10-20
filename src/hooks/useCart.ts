'use client';

import { useState } from 'react';
import { Product } from '@/types/types';

interface CartItem {
  id: number;
  name: string;
  quantity: number;
  price: number;
}

export const useCart = (products: Product[]) => {
  const [cart, setCart] = useState<CartItem[]>([]);

  const addToCart = (id: number) => {
    const product = products.find(p => p.id === id);
    if (!product) return;

    setCart(prevCart => {
      const existingItem = prevCart.find(item => item.id === id);
      if (existingItem) {
        return prevCart.map(item => (item.id === id ? { ...item, quantity: item.quantity + 1 } : item));
      }
      return [...prevCart, { id: product.id, name: product.name, price: product.price, quantity: 1 }];
    });
  };

  const decreaseQuantity = (id: number) => {
    setCart(prevCart => {
      const existingItem = prevCart.find(item => item.id === id);
      if (existingItem?.quantity === 1) {
        return prevCart.filter(item => item.id !== id);
      }
      return prevCart.map(item => (item.id === id ? { ...item, quantity: item.quantity - 1 } : item));
    });
  };

  const getCartTotals = (serviceChargePercentage: number) => {
    const subtotal = cart.reduce((total, item) => total + item.price * item.quantity, 0);
    const serviceChargeAmount = (subtotal * serviceChargePercentage) / 100;
    const totalAmount = subtotal + serviceChargeAmount;

    return { subtotal, serviceChargeAmount, totalAmount };
  };
  const resetCart = () => {
    setCart([]);
  };

  return { cart, addToCart, decreaseQuantity, getCartTotals, resetCart };
};
