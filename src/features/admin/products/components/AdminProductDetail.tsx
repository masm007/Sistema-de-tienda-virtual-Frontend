import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { getProductById } from "../../../../services/ProductService";
import { Box, Button, TextField, Typography } from "@mui/material";
import Tabs from "@mui/material/Tabs";
import Tab from "@mui/material/Tab";
import { Favorite, WhatsApp } from "@mui/icons-material";
import { useNotification } from "../../../../hooks/useNotification";
import type { Product } from "../../../../types/Product";
import { useAuth } from "../../../../hooks/useAuth";

type Props = {};

export const AdminProductDetail = (props: Props) => {
  const { id } = useParams();
  const { token } = useAuth();
  const navigate = useNavigate();
  const [product, setProduct] = useState<Product>();
  const [value, setValue] = React.useState("one");
  const { error, success } = useNotification();

  const handleChange = (event: React.SyntheticEvent, newValue: string) => {
    setValue(newValue);
  };

  const buttonStyles = {};

  const buttonStyle = {
    fontWeight: 400,
    textAlign: "center",
    margin: "3px",
  };

  useEffect(() => {
    const loadProduct = async () => {
      if (!token) {
        error("Debes estar logeado para realizar esta acción", "Inicio de sesión");
        return;
      }
      const productId = Number.parseInt(id!);
      if (Number.isNaN(productId)) {
        return;
      }
      try {
        const response = await getProductById(productId, token);
        setProduct(response);
      } catch (err) {
        if (err instanceof Error) {
          error(err.message, "Obtener producto");
        } else {
          error("Ocurrió un error inesperado.", "Obtener producto");
        }
        navigate("/404");
      }
    };
    loadProduct();
  }, []);

  return (
    <>
      <Box
        sx={{
          padding: "10px",
          margin: "10px",
          maxWidth: { xs: "100vw" },
          display: "flex",
          flexDirection: "column",
          gap: "20px",
        }}
      >
        <Box
          className="product"
          sx={{
            display: "grid",
            gap: "20px",
            gridTemplateColumns: {
              xs: "1fr",
              md: "1fr 1fr",
            },
          }}
        >
          <Box sx={{ border: "1px solid black", padding: "5px" }}>
            <Box
              className="productInfo"
              sx={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                flexDirection: "column",
              }}
            >
              <Typography sx={{ fontWeight: 700, fontSize: "1.7em" }}>
                {product?.name}
              </Typography>
              <Typography sx={{ fontWeight: 500, fontSize: "1.3em" }}>
                ${product?.price}
              </Typography>
              <Typography>{product?.description}</Typography>
            </Box>
            <Box
              className="productOptions"
              sx={{ display: "flex", gap: "10px", flexDirection: "column" }}
            >
              <Box
                sx={{ display: "flex", flexDirection: "column", gap: "10px" }}
              >
                <Typography>
                  {product?.isAvailable
                    ? "Está disponible ✅"
                    : "No se encuentra disponible ❌"}
                </Typography>
              </Box>
              <Box
                className="productActions"
                sx={{ display: "flex", gap: "10px", flexDirection: "column" }}
              >
                <Box sx={{ width: "100%" }}>
                  <Tabs
                    value={value}
                    onChange={handleChange}
                    textColor="secondary"
                    indicatorColor="secondary"
                    aria-label="secondary tabs example"
                  >
                    <Tab value="one" label="Descripción" />
                    <Tab value="two" label="Especificaciones" />
                    <Tab value="three" label="Info adicional" />
                  </Tabs>
                </Box>
              </Box>
            </Box>
          </Box>
          <Box className="ImgContainer">
            <Box
              component="img"
              sx={{
                width: "80%",
                maxWidth: "500px",
                height: "auto",
                display: "block",
              }}
              src={product?.images[0].url}
              alt="imagenes del producto"
            ></Box>
          </Box>
        </Box>
      </Box>
    </>
  );
};
