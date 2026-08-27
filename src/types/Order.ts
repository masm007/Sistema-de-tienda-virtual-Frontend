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

//reemplazo de enum para que ts no de error
export const OrderStatus = {
    Pending: "Pending",
    Paid: "Paid",
    ReadyForPickup: "ReadyForPickup",
    Shipped: "Shipped",
    Delivered: "Delivered",
    Completed: "Completed",
    Cancelled: "Cancelled",
} as const;

export type OrderStatus = (typeof OrderStatus)[keyof typeof OrderStatus];