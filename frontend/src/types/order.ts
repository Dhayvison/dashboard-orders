export const OrderStatus = {
  PENDING: 'PENDING',
  DELIVERED: 'DELIVERED',
  CANCELLED: 'CANCELLED',
} as const;

export type OrderStatus = (typeof OrderStatus)[keyof typeof OrderStatus];

export interface OrderItem {
  id: string;
  productName: string;
  quantity: number;
  price: number;
}

export interface Order {
  id: string;
  customerName: string;
  status: OrderStatus;
  totalValue: number;
  items: OrderItem[];
  createdAt: string;
}

export interface CreateOrderItemPayload {
  productName: string;
  quantity: number;
  price: number;
}

export interface CreateOrderPayload {
  customerName: string;
  items: CreateOrderItemPayload[];
}
