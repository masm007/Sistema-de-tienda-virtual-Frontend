import {
  Box,
  CircularProgress,
  Typography,
  useMediaQuery,
  useTheme,
} from "@mui/material";
import { useEffect, useState } from "react";
import { getAllActivesProductsRequest } from "../../services/ProductService";
import { getCategoriesRequest } from "../../services/CategoryService";
import type { ProductRequest } from "../../types/Product";
import type { Category } from "../../types/Category";
import { ProductCard } from "../products/ProductCard";
import { Gallery } from "../../assets/components/ui/Gallery";

type Props = {};

export const Categories = (props: Props) => {
  const [categories, setCategories] = useState<Category[]>([]);
  const [products, setProducts] = useState<ProductRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const theme = useTheme();
  const isBelowSm = useMediaQuery(theme.breakpoints.down("sm"));
  const isBelowMd = useMediaQuery(theme.breakpoints.down("md"));
  const itemsPerView = isBelowSm ? 1 : isBelowMd ? 2 : 3;

  useEffect(() => {
    const loadData = async () => {
      try {
        const [categoriesData, productsData] = await Promise.all([
          getCategoriesRequest(),
          getAllActivesProductsRequest(),
        ]);
        setCategories(categoriesData);
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

  // El catálogo público solo trae categoryName (no un id), así que se agrupa por nombre
  const categoriesWithProducts = categories
    .map((category) => ({
      category,
      products: products.filter((prd) => prd.categoryName === category.name),
    }))
    .filter((group) => group.products.length > 0);

  if (categoriesWithProducts.length === 0) {
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
        <Typography>No hay productos disponibles por categoría.</Typography>
      </Box>
    );
  }

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        gap: 4,
        p: { xs: 2, md: 4 },
      }}
    >
      {categoriesWithProducts.map(
        ({ category, products: categoryProducts }) => (
          <Box
            key={category.id}
            sx={{
              display: "flex",
              flexDirection: "column",
              gap: 1.5,
              textAlign: "center",
            }}
          >
            <Typography variant="h3" fontWeight={600}>
              {category.name}
            </Typography>
            <Gallery
              lista={categoryProducts}
              itemsPerView={itemsPerView}
              renderItem={(prd) => <ProductCard product={prd} />}
            />
          </Box>
        ),
      )}
    </Box>
  );
};
