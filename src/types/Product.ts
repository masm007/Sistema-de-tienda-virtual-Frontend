export interface Product{
  id: number;
  name: string,
  description: string,
  categoryId: number,
  price: number;
  sku: string,
  quantity: number,
  isAvailable: boolean,
  isActive: boolean,
  images: ProductImage[]
}

export interface ProductImage{
  url: string;
}