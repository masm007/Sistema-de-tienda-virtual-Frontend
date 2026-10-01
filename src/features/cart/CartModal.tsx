import {
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Divider,
  Typography,
} from "@mui/material";
import { ShoppingCart } from "@mui/icons-material";
import { useCart } from "../../hooks/useCart";
import { useNavigate } from "react-router-dom";
import foto from "../../assets/images/tiendaVirtual.png";

type Props = {
  open: boolean;
  onClose: () => void;
};

export const CartModal = (props: Props) => {
  const navigate = useNavigate();
  const { cart, getSubtotal } = useCart();

  const handleCart = () => {
    navigate(`/cart`);
    props.onClose();
  };

  return (
    <Dialog
      open={props.open}
      onClose={props.onClose}
      fullWidth
      maxWidth="xs"
      PaperProps={{ sx: { borderRadius: "16px", overflow: "hidden" } }}
    >
      <DialogTitle
        sx={{
          textAlign: "center",
          backgroundColor: "#78BF9E",
          fontWeight: 700,
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          gap: 1,
        }}
      >
        Carrito de compras <ShoppingCart />
      </DialogTitle>

      <DialogContent sx={{ p: 3 }}>
        {cart.length === 0 ? (
          <Typography color="text.secondary" sx={{ textAlign: "center", py: 3 }}>
            No hay productos en el carrito.
          </Typography>
        ) : (
          <Box sx={{ display: "flex", flexDirection: "column", gap: 1.5 }}>
            {cart.map((item) => (
              <Box
                key={item.product.sku}
                sx={{
                  display: "flex",
                  alignItems: "center",
                  gap: 1.5,
                  borderRadius: 2,
                  bgcolor: "#F5F5F5",
                  p: 1,
                }}
              >
                <Box
                  component="img"
                  src={item.product.images?.[0]?.url ?? foto}
                  alt={item.product.name}
                  sx={{
                    width: 56,
                    height: 56,
                    borderRadius: 1.5,
                    objectFit: "cover",
                    flexShrink: 0,
                  }}
                />
                <Box sx={{ flex: 1, minWidth: 0, textAlign: "left" }}>
                  <Typography fontWeight={700} noWrap>
                    {item.product.name}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    {item.quantity} x ${item.product.price.toFixed(2)}
                  </Typography>
                </Box>
                <Typography fontWeight={600} sx={{ flexShrink: 0 }}>
                  ${(item.product.price * item.quantity).toFixed(2)}
                </Typography>
              </Box>
            ))}

            <Divider sx={{ my: 0.5 }} />

            <Typography
              sx={{ fontWeight: 700, color: "#2E7D32", textAlign: "center" }}
            >
              Total a pagar: ${getSubtotal().toFixed(2)}
            </Typography>
          </Box>
        )}
      </DialogContent>

      <DialogActions sx={{ justifyContent: "flex-end", gap: 1, px: 3, pb: 3 }}>
        <Button onClick={props.onClose}>Cerrar</Button>
        <Button
          variant="contained"
          color="secondary"
          onClick={handleCart}
          disabled={cart.length === 0}
          endIcon={<ShoppingCart />}
        >
          Ver carrito
        </Button>
      </DialogActions>
    </Dialog>
  );
};
