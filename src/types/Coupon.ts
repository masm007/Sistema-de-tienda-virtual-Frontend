import type { OrderDetailRequestDto } from "./Order";
import type { ProductSummaryDto } from "./Product";

// Equivalente al enum de C# (Domain.Enum.DiscountType). No hay conversor a
// string configurado en el backend, así que viaja como número.
export const DiscountType = {
  Percentage: 0,
  FixedAmount: 1,
} as const;
export type DiscountType = (typeof DiscountType)[keyof typeof DiscountType];

export const DiscountTypeName: Record<DiscountType, string> = {
  [DiscountType.Percentage]: "Porcentaje",
  [DiscountType.FixedAmount]: "Monto fijo",
};

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