import type { CartItem, Order, Session, User } from '../types/domain';

const STORAGE_KEYS = {
  users: 'app_users',
  session: 'app_session',
  orders: 'app_orders',
} as const;

const isRecord = (value: unknown): value is Record<string, unknown> =>
  typeof value === 'object' && value !== null;

const isUser = (value: unknown): value is User =>
  isRecord(value) &&
  typeof value.id === 'string' &&
  typeof value.fullName === 'string' &&
  typeof value.email === 'string' &&
  typeof value.passwordHash === 'string' &&
  typeof value.passwordSalt === 'string' &&
  typeof value.createdAt === 'string';

const isSession = (value: unknown): value is Session =>
  isRecord(value) && typeof value.userId === 'string';

const isCartItem = (value: unknown): value is CartItem =>
  isRecord(value) &&
  typeof value.projectId === 'number' &&
  Number.isInteger(value.projectId) &&
  typeof value.title === 'string' &&
  (value.image === undefined || typeof value.image === 'string') &&
  (value.price === undefined ||
    (typeof value.price === 'number' && Number.isFinite(value.price) && value.price >= 0)) &&
  typeof value.quantity === 'number' &&
  Number.isInteger(value.quantity) &&
  value.quantity > 0;

const isOrder = (value: unknown): value is Order =>
  isRecord(value) &&
  typeof value.id === 'string' &&
  typeof value.userId === 'string' &&
  typeof value.createdAt === 'string' &&
  (value.status === 'Realizado' ||
    value.status === 'Em andamento' ||
    value.status === 'Concluído') &&
  Array.isArray(value.items) &&
  value.items.every(isCartItem) &&
  (value.total === undefined ||
    (typeof value.total === 'number' && Number.isFinite(value.total) && value.total >= 0));

const readJson = (key: string): unknown => {
  try {
    const rawValue = localStorage.getItem(key);
    return rawValue === null ? null : JSON.parse(rawValue);
  } catch (error) {
    console.error(`Não foi possível ler os dados locais de "${key}".`, error);
    return null;
  }
};

const writeJson = (key: string, value: unknown): void => {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch (error) {
    console.error(`Não foi possível salvar os dados locais de "${key}".`, error);
    throw new Error('Não foi possível salvar os dados no navegador.', {
      cause: error,
    });
  }
};

const cartKey = (userId: string): string => `app_cart_${userId}`;

export const storage = {
  getUsers(): User[] {
    const value = readJson(STORAGE_KEYS.users);
    return Array.isArray(value) ? value.filter(isUser) : [];
  },

  saveUsers(users: User[]): void {
    writeJson(STORAGE_KEYS.users, users);
  },

  getSession(): Session | null {
    const value = readJson(STORAGE_KEYS.session);
    return isSession(value) ? value : null;
  },

  saveSession(session: Session): void {
    writeJson(STORAGE_KEYS.session, session);
  },

  clearSession(): void {
    try {
      localStorage.removeItem(STORAGE_KEYS.session);
    } catch (error) {
      console.error('Não foi possível encerrar a sessão local.', error);
      throw new Error('Não foi possível encerrar a sessão.', { cause: error });
    }
  },

  getCart(userId: string): CartItem[] {
    const value = readJson(cartKey(userId));
    return Array.isArray(value) ? value.filter(isCartItem) : [];
  },

  saveCart(userId: string, items: CartItem[]): void {
    writeJson(cartKey(userId), items);
  },

  getOrders(): Order[] {
    const value = readJson(STORAGE_KEYS.orders);
    return Array.isArray(value) ? value.filter(isOrder) : [];
  },

  saveOrders(orders: Order[]): void {
    writeJson(STORAGE_KEYS.orders, orders);
  },
};
