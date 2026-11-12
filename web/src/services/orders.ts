import type { CartItem, Order } from '../types/domain';
import { storage } from './storage';

export const orderService = {
  create(userId: string, items: CartItem[]): Order {
    if (items.length === 0) {
      throw new Error('Não é possível registrar um pedido com o carrinho vazio.');
    }

    const order: Order = {
      id: crypto.randomUUID(),
      userId,
      createdAt: new Date().toISOString(),
      status: 'Realizado',
      items: items.map((item) => ({ ...item })),
      total: items.reduce((total, item) => total + (item.price ?? 0) * item.quantity, 0),
    };

    storage.saveOrders([...storage.getOrders(), order]);
    return order;
  },

  getForUser(userId: string): Order[] {
    return storage.getOrders().filter((order) => order.userId === userId);
  },
};
