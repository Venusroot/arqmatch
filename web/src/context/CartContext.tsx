import { useEffect, useState, type ReactNode } from 'react';
import type { CartItem } from '../types/domain';
import { storage } from '../services/storage';
import { useAuth } from './useAuth';
import { CartContext } from './cart-context';

export function CartProvider({ children }: { children: ReactNode }) {
  const { currentUser } = useAuth();
  const [items, setItems] = useState<CartItem[]>([]);

  useEffect(() => {
    const timeoutId = window.setTimeout(() => {
      setItems(currentUser ? storage.getCart(currentUser.id) : []);
    }, 0);

    return () => window.clearTimeout(timeoutId);
  }, [currentUser]);

  const addItem = (item: Omit<CartItem, 'quantity'>): void => {
    if (!currentUser) {
      throw new Error('É necessário entrar para adicionar um projeto.');
    }

    setItems((currentItems) => {
      if (currentItems.some((currentItem) => currentItem.projectId === item.projectId)) {
        return currentItems;
      }

      const nextItems = [...currentItems, { ...item, quantity: 1 }];
      storage.saveCart(currentUser.id, nextItems);
      return nextItems;
    });
  };

  const removeItem = (projectId: number): void => {
    if (!currentUser) {
      return;
    }

    setItems((currentItems) => {
      const nextItems = currentItems.filter((item) => item.projectId !== projectId);
      storage.saveCart(currentUser.id, nextItems);
      return nextItems;
    });
  };

  const clearCart = (): void => {
    if (!currentUser) {
      return;
    }

    storage.saveCart(currentUser.id, []);
    setItems([]);
  };

  const value = {
    items,
    itemCount: items.reduce((total, item) => total + item.quantity, 0),
    total: items.reduce((total, item) => total + (item.price ?? 0) * item.quantity, 0),
    addItem,
    removeItem,
    clearCart,
  };

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}
