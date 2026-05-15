import {
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Typography,
} from "@mui/material";
import React from "react";

type Props = {
  open: boolean;
  onClose: () => void;
};

export const CartModal = (props: Props) => {
  return (
    <>
      <Dialog open={props.open} onClose={props.onClose}>
        <DialogTitle>Carrito de compras</DialogTitle>
        {/* Renderizar CartItem */}
        <DialogContent>
          <Typography>Subtotal: $0,00</Typography>
        </DialogContent>
        <DialogActions>
          <Button>Ver carrito</Button>
          <Button variant="contained">Finalizar compra</Button>
        </DialogActions>
      </Dialog>
    </>
  );
};
