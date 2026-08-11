import { CartItem } from "./CartItem";
import {
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Typography,
} from "@mui/material";
import { useCart } from "../../hooks/useCart";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import { createOrder } from "../../services/OrderService";
import type { CreateOrderDto } from "../../types/Order";
import { useAuth } from "../../hooks/useAuth";
import { useNotification } from "../../hooks/useNotification";

type Props = {};

export const Cart = (props: Props) => {
  const { token } = useAuth();
  const { cart, getSubtotal } = useCart();
  const { success, error } = useNotification();
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);

  const handleCreateOrder = async () => {
    if (!token) {
      error(
        "Debes iniciar sesión para realizar una compra.",
        "Crear una orden",
      );
      return;
    }

    const dto: CreateOrderDto = {
      details: cart.map((item) => ({
        productId: item.product.id,
        quantity: item.quantity,
      })),
    };

    try {
      let ord = await createOrder(dto, token);
      setOpen(false);
      success(
        `Se creó la orden con el número: ${ord.orderNumber}`,
        "Crear una orden",
      );
      navigate("/orders");
    } catch (err) {
      if (err instanceof Error) {
        error(err.message, "Crear una orden");
      } else {
        error("Ocurrió un error inesperado.", "Crear una orden");
      }
    }
  };

  return (
    <>
      <Box
        sx={{
          display: "flex",
          padding: "10px",
          flexDirection: "column",
          gap: "20px",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <Typography variant="h2" sx={{ fontWeight: 500, textAlign: "center" }}>
          Carrito de compras
        </Typography>
        <Box
          sx={{
            display: "flex",
            padding: "10px",
            flexDirection: "row",
            flexWrap: "wrap",
            gap: "20px",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          {cart.length === 0 ? (
            <Typography>No se ha agregado nada en el carrito</Typography>
          ) : (
            cart.map((item) => (
              <CartItem
                key={item.product.id}
                product={item.product}
                quantity={item.quantity}
              ></CartItem>
            ))
          )}
        </Box>
        <Typography>El Total a pagar es: {getSubtotal().toFixed(2)}</Typography>
        <Button variant="contained" onClick={() => setOpen(true)}>
          Finalizar compra
        </Button>
      </Box>

      <Dialog open={open} onClose={() => setOpen(false)}>
        <DialogTitle>Confirmar compra</DialogTitle>
        <DialogContent>
          <DialogContentText>
            ¿Está seguro de que desea finalizar la compra?
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpen(false)}>Cancelar</Button>
          <Button variant="contained" onClick={handleCreateOrder}>
            Confirmar
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};
