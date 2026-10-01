export interface Category{
  id: number,
  name: string,
  description: string,
}

export interface CreateCategoryDto {
  name: string,
  description: string,
}

export interface CategorySummary{
  id: number,
  name: string,
}