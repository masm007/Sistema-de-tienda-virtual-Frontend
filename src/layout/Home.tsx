import React from "react";
import { ProductCard } from "../features/products/ProductCard.tsx";
import { Box } from "@mui/material";
import { useState, useEffect } from "react";
import { getProductsRequest } from "../services/ProductService.ts";
import { getCategoriesRequest } from "../services/CategoryService.ts";
import type { Product } from "../types/Product.ts";
import type { Category } from "../types/Category.ts";
import { NavegationBar } from "../components/common/NavegationBar.tsx";

type Props = {};

export const Home = (props: Props) => {
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);

  useEffect(() => {
    const loadProducts = async () => {
      const productsData = await getProductsRequest();
      setProducts(productsData);
    };
    const loadCategories = async () => {
      const categoriesData = await getCategoriesRequest();
      setCategories(categoriesData);
    };
    loadProducts();
    loadCategories();
  }, []);

  return (
    <div>
      <Box sx={{ display: "flex", flexWrap: "wrap" }}>
        {products.map((prd) => (
          <ProductCard
            key={prd.id}
            product={prd}
            categories={categories}
          ></ProductCard>
        ))}
      </Box>
    </div>
  );
};
