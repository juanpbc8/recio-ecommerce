'use client';

import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import type { CartItemDto } from '@/types';

const CART_STORAGE_KEY = 'recio:cart';

interface CartContextState {
  items: CartItemDto[];
  isLoaded: boolean;
  addItem: (item: CartItemDto) => void;
  removeItem: (variantId: number) => void;
  updateQuantity: (variantId: number, quantity: number) => void;
  clearCart: () => void;
  subtotal: number;
  itemCount: number;
}

const CartContext = createContext<CartContextState | undefined>(undefined);

function readCartFromStorage(): CartItemDto[] {
  if (typeof window === 'undefined') return [];
  try {
    const raw = localStorage.getItem(CART_STORAGE_KEY);
    return raw ? (JSON.parse(raw) as CartItemDto[]) : [];
  } catch {
    return [];
  }
}

function writeCartToStorage(items: CartItemDto[]): void {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(items));
  } catch {
    // Silently fail if localStorage is full or unavailable
  }
}

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [items, setItems] = useState<CartItemDto[]>([]);
  const [isLoaded, setIsLoaded] = useState(false);

  // Hydrate from localStorage on mount (client-side only)
  useEffect(() => {
    setItems(readCartFromStorage());
    setIsLoaded(true);
  }, []);

  // Persist to localStorage whenever items change
  useEffect(() => {
    if (isLoaded) {
      writeCartToStorage(items);
    }
  }, [items, isLoaded]);

  const addItem = useCallback((newItem: CartItemDto) => {
    setItems((prev) => {
      const existing = prev.find((i) => i.variantId === newItem.variantId);
      if (existing) {
        return prev.map((i) =>
          i.variantId === newItem.variantId
            ? { ...i, quantity: Math.min(i.quantity + newItem.quantity, i.stockAvailable) }
            : i,
        );
      }
      return [...prev, newItem];
    });
  }, []);

  const removeItem = useCallback((variantId: number) => {
    setItems((prev) => prev.filter((i) => i.variantId !== variantId));
  }, []);

  const updateQuantity = useCallback((variantId: number, quantity: number) => {
    setItems((prev) =>
      prev.map((i) =>
        i.variantId === variantId
          ? { ...i, quantity: Math.max(1, Math.min(quantity, i.stockAvailable)) }
          : i,
      ),
    );
  }, []);

  const clearCart = useCallback(() => {
    setItems([]);
  }, []);

  const subtotal = items.reduce((acc, item) => acc + item.price * item.quantity, 0);
  const itemCount = items.reduce((acc, item) => acc + item.quantity, 0);

  return (
    <CartContext.Provider
      value={{ items, isLoaded, addItem, removeItem, updateQuantity, clearCart, subtotal, itemCount }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart(): CartContextState {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error('useCart must be used within CartProvider');
  return ctx;
}
