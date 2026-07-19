import {
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Typography,
} from "@mui/material";
import { useCart } from "../../hooks/useCart";

type Props = {
  open: boolean;
  onClose: () => void;
};

export const CartModal = (props: Props) => {
  const {cart, getSubtotal} = useCart();

  return (
    <>
      <Dialog open={props.open} onClose={props.onClose}>
        <DialogTitle>Carrito de compras</DialogTitle>
        {/* Renderizar CartItem */}
        <DialogContent>
          <Typography>Subtotal: {getSubtotal().toFixed(2)}</Typography>
        </DialogContent>
        <DialogActions>
          <Button>Ver carrito</Button>
          <Button variant="contained">Finalizar compra</Button>
        </DialogActions>
      </Dialog>
    </>
  );
};
