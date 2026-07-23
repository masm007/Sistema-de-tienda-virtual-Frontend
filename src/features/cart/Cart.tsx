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

type Props = {};

export const Cart = (props: Props) => {
  const { cart, getSubtotal } = useCart();
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);

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
          <Button
            variant="contained"
            onClick={() => {
              setOpen(false);
              navigate("/orders");
            }}
          >
            Confirmar
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};
