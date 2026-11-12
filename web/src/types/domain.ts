export interface User {
  id: string;
  fullName: string;
  email: string;
  passwordHash: string;
  passwordSalt: string;
  createdAt: string;
}

export interface Session {
  userId: string;
}

export interface CartItem {
  projectId: number;
  title: string;
  image?: string;
  /** Optional to keep carts created before prices were introduced readable. */
  price?: number;
  quantity: number;
}

export type OrderStatus = 'Realizado' | 'Em andamento' | 'Concluído';

export interface OrderItem extends CartItem {
  price?: number;
}

export interface Order {
  id: string;
  userId: string;
  createdAt: string;
  status: OrderStatus;
  items: OrderItem[];
  total?: number;
}
