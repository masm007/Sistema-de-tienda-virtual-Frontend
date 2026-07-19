import React, { useState, useEffect, useContext } from "react";
import { useParams } from "react-router-dom";
import type { Product } from "../../types/Product";
import { getProductById } from "../../services/ProductService";
import { Alert, Box, Button, TextField, Typography } from "@mui/material";
import Tabs from "@mui/material/Tabs";
import Tab from "@mui/material/Tab";
import { CartContext } from "../../providers/CartProvider";
import { useCart } from "../../hooks/useCart";
import { Favorite, ShoppingCart, WhatsApp } from "@mui/icons-material";

type Props = {};

export const ProductDetail = (props: Props) => {
  const { id } = useParams();
  const { cart, addToCart } = useCart();
  const [product, setProduct] = useState<Product>();
  const [value, setValue] = React.useState("one");
  const [quantity, setQuantity] = useState("");

  const handleChange = (event: React.SyntheticEvent, newValue: string) => {
    setValue(newValue);
  };

  const spinnerStyles = {
    WebkitAppearance: "none",
    background:
      "#000 url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACMAAAAcCAYAAADr9QYhAAAAAXNSR0IArs4c6QAAAERlWElmTU0AKgAAAAgAAYdpAAQAAAABAAAAGgAAAAAAA6ABAAMAAAABAAEAAKACAAQAAAABAAAAI6ADAAQAAAABAAAAHAAAAACbzWzwAAABB0lEQVRIDe2XMQ6DMAxFf6suwAjszLDCTeASHALEyFlg5hLsXIJDtPIQVFkkgrhDVCWLcQzJ84/liEeSJG84MIqiwMMVmCAI8HRAlAPBwxxSsIf/VKZpGozjiCiKWL7X3Z8oQyB1XSPLMnRdZw0khlEgKn8JkAiGg0iBrJse1UZZlmr/U7vvO7ZtO43xSWp61jB8ManvO7BJQVEBmxa2iXkYnWpOKfPSUV6Zb9sWaZpqX12WBeu6auM8IOozBNL3/SnQNE2Y55nvp/XFfYY67DAMIPs97oKob8U1w4FsQQhIdEwqI7J0ZFVVgerEZvi7yaSauGZMi9+NOQMThqEbP3FxHCPPc3wAmdpEetL9b2QAAAAASUVORK5CYII=) no-repeat center center",
    width: "2em",
    opacity: 1,
    position: "absolute",
    top: 0,
    right: 0,
    bottom: 0,
    overflow: "hidden",
    borderTopRightRadius: "0.25rem",
    borderBottomRightRadius: "0.25rem",
  };

  const buttonStyles = {};

  const buttonStyle = {
    fontWeight: 400,
    textAlign: "center",
    margin: "3px",
  };

  useEffect(() => {
    const loadProduct = async () => {
      const productId = Number(id);
      if (Number.isNaN(productId)) {
        return;
      }
      const response = await getProductById(productId);
      setProduct(response);
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
                {/* Tambien se puede usar && para solo dar una respuesta al ser true */}
                {product?.isAvailable ? (
                  <Box sx={{ display: "flex", gap: "10px" }}>
                    <TextField
                      type="number"
                      sx={{
                        "input[type=number]::-webkit-outer-spin-button": {
                          ...spinnerStyles,
                        },
                        "input[type=number]::-webkit-inner-spin-button": {
                          ...spinnerStyles,
                        },
                      }}
                      onChange={(e) => {
                        setQuantity(e.target.value);
                      }}
                    />
                    <Button
                      fullWidth
                      sx={{
                        ...buttonStyles,
                        backgroundColor: "#9C27B0",
                        "&:hover": {
                          backgroundColor: "#7B1FA2",
                        },
                      }}
                      onClick={() => {
                        const value = quantity.trim();
                        if (!value) {
                          console.log("No hay ningun valor");
                          return;
                        }
                        if (!value) {
                          console.log("No hay ningún valor");
                          return;
                        }
                        const amount = Number(value);
                        if (Number.isNaN(amount)) {
                          console.log("Debe ingresar un número");
                          return;
                        }
                        if (amount <= 0) {
                          console.log("La cantidad debe ser mayor que 0");
                          return;
                        }
                        if (amount > product.quantity) {
                          console.log("Intentó agregar una cantidad no válida");
                          return;
                        }
                        addToCart(product, Number(quantity));
                      }}
                      variant="contained"
                      endIcon={<ShoppingCart />}
                    >
                      Agregar al carrito
                    </Button>
                  </Box>
                ) : null}
              </Box>
              <Box
                className="productActions"
                sx={{ display: "flex", gap: "10px", flexDirection: "column" }}
              >
                <Button
                  fullWidth
                  sx={{
                    ...buttonStyles,
                    backgroundColor: "#25D366",
                    "&:hover": {
                      backgroundColor: "#128C7E",
                    },
                  }}
                  variant="contained"
                  endIcon={<WhatsApp />}
                >
                  Enviar un msj a un asesor
                </Button>
                <Button
                  fullWidth
                  sx={{ ...buttonStyles }}
                  variant="outlined"
                  endIcon={<Favorite />}
                >
                  Añadir a la lista de deseados
                </Button>
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
