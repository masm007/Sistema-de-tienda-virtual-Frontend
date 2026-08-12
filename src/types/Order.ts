import type { UserDto } from "./User.ts";
import type { ProductSummaryDto } from "./Product.ts";

export interface Order {
  orderNumber: string,
  emisionDate: string,
  user: UserDto,
  orderDetails: OrderDetailResponseDto[],
  subtotal: number,
  discount: number,
  iva: number,
  total: number,
  state: OrderStatus
}

export interface CreateOrderDto {
  details: OrderDetailRequestDto[],
}

export interface OrderDetailResponseDto {
  quantity: number,
  product: ProductSummaryDto,
  unitPrice: number,
  subtotal: number,
}

export interface OrderDetailRequestDto {
  quantity: number,
  productId: number,
}

// Equivalente al enum de C#
export const OrderStatus = {
  Pending: 0,
  Paid: 1,
  ReadyForPickup: 2,
  Shipped: 3,
  Delivered: 4,
  Completed: 5,
  Cancelled: 6,
} as const;

export type OrderStatus =
  (typeof OrderStatus)[keyof typeof OrderStatus];

export const OrderStatusName: Record<OrderStatus, string> = {
  [OrderStatus.Pending]: "Pendiente",
  [OrderStatus.Paid]: "Pagada",
  [OrderStatus.ReadyForPickup]: "Lista para retirar",
  [OrderStatus.Shipped]: "Enviada",
  [OrderStatus.Delivered]: "Entregada",
  [OrderStatus.Completed]: "Completada",
  [OrderStatus.Cancelled]: "Cancelada",
};