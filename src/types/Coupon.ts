import type { OrderDetailRequestDto } from "./Order";
import type { ProductSummaryDto } from "./Product";

export const DiscountType = {
  Percentage: "Percentage",
  Fixed: "Fixed",
} as const;
export type DiscountType = (typeof DiscountType)[keyof typeof DiscountType];

export interface CouponDto {
  id: number;
  code: string;
  type: DiscountType;
  discountValue: number;
  expirationDate: string; // llega como ISO string desde el backend
  isActive: boolean;
  usageLimit: number | null;
  usedCount: number;
  requiredProducts: ProductSummaryDto[];
}

export interface CreateCouponDto {
  code: string;
  type: DiscountType;
  discountValue: number;
  expirationDate: string; // enviar en formato ISO (ej. new Date(...).toISOString())
  usageLimit: number | null;
  productIds: number[];
}

export interface ValidateCouponRequest {
  code: string;
  details: OrderDetailRequestDto[];
}

export interface ApplyCouponResultDto {
  code: string;
  eligibleSubtotal: number;
  discountAmount: number;
}