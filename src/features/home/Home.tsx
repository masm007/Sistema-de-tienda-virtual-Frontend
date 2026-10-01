import { ProductCard } from "../products/ProductCard.tsx";
import { Box, CircularProgress, Typography } from "@mui/material";
import { useState, useEffect } from "react";
import { getAllActivesProductsRequest } from "../../services/ProductService.ts";
import type { ProductRequest } from "../../types/Product.ts";

type Props = {};

export const Home = (props: Props) => {
  const [products, setProducts] = useState<ProductRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    const loadData = async () => {
      try {
        const productsData = await getAllActivesProductsRequest();
        setProducts(productsData);
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
    <Box
      sx={{
        display: "flex",
        flexWrap: "wrap",
        alignItems: "flex-start",
        alignContent: "flex-start",
        minHeight: "85vh",
      }}
    >
      {products.map((prd) => (
        <ProductCard key={prd.sku} product={prd}/>
      ))}
    </Box>
  );
};
