import type { CategorySummary } from "./Category";

export interface CreateProductDto {
  name: string,
  description: string,
  categoryId: number,
  price: number;
  sku: string,
  quantity: number,
  images: File[]
}

export interface UpdateProductDto {
  id: number,
  name: string,
  description: string,
  categoryId: number,
  price: number;
  sku: string,
  quantity: number,
  isAvailable: boolean,
  isActive: boolean,
  // Ids de las imágenes existentes que se conservan
  keepImageIds: number[],
  // Archivos nuevos a subir
  newImages: File[]
}

export interface Product {
  id: number,
  name: string,
  description: string,
  category: CategorySummary,
  price: number;
  sku: string,
  quantity: number,
  isAvailable: boolean,
  isActive: boolean,
  images: ProductImage[]
}

export interface ProductRequest {
  name: string,
  description: string,
  categoryName: string,
  price: number;
  sku: string,
  quantity: number,
  isAvailable: boolean,
  isActive: boolean,
  images: ProductImage[]
}

export interface ProductSummaryDto {
  id: number,
  name: string
}

export interface ProductImage {
  id: number,
  url: string,
}

export const Status = {
  Inactivo: "0",
  Activo: "1",
} as const;

export type Status =
  (typeof Status)[keyof typeof Status];

export const StatusName: Record<Status, string> = {
  [Status.Inactivo]: "Inactivo",
  [Status.Activo]: "Activo",
};