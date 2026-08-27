import { ProductCard } from "../products/ProductCard.tsx";
import { Box, CircularProgress, Typography } from "@mui/material";
import { useState, useEffect } from "react";
import { getProductsRequest } from "../../services/ProductService.ts";
import { getCategoriesRequest } from "../../services/CategoryService.ts";
import type { Product } from "../../types/Product.ts";
import type { Category } from "../../types/Category.ts";

type Props = {};

export const Home = (props: Props) => {
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    const loadData = async () => {
      try {
        const [productsData, categoriesData] = await Promise.all([
          getProductsRequest(),
          getCategoriesRequest(),
        ]);
        setProducts(productsData);
        setCategories(categoriesData);
      } catch {
        setError(true);
      } finally {
        setLoading(false);
      }
    };
    loadData();
  }, []);

  if (loading) {
    return (
      <Box
        sx={{
          minHeight: "80vh",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Box
        sx={{
          minHeight: "80vh",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          textAlign: "center",
          px: 2,
        }}
      >
        <Typography color="error">
          No se pudo conectar con el servidor.
        </Typography>
      </Box>
    );
  }

  if (products.length === 0) {
    return (
      <Box
        sx={{
          minHeight: "80vh",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          textAlign: "center",
          px: 2,
        }}
      >
        <Typography>No hay productos disponibles.</Typography>
      </Box>
    );
  }

  return (
    <Box sx={{ display: "flex", flexWrap: "wrap" }}>
      {products.map((prd) => (
        <ProductCard key={prd.id} product={prd} categories={categories} />
      ))}
    </Box>
  );
};
