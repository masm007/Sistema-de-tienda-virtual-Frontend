import {
  Box,
  Button,
  Dialog,
  DialogContent,
  DialogTitle,
  Typography,
} from "@mui/material";
import { ShoppingCart } from "@mui/icons-material";
import { useCart } from "../../hooks/useCart";
import { useNavigate } from "react-router-dom";

type Props = {
  open: boolean;
  onClose: () => void;
};

export const CartModal = (props: Props) => {
  const navigate = useNavigate();
  const { cart, getSubtotal } = useCart();

  const handleCart = () => {
    navigate(`/cart`);
    //onclose();
  };

  return (
    <>
      <Dialog open={props.open} onClose={props.onClose}>
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
          Carrito de compras <ShoppingCart></ShoppingCart>{" "}
        </DialogTitle>
        {/* Renderizar CartItem */}
        <DialogContent>
          <Box
            sx={{
              display: "flex",
              padding: "10px",
              flexDirection: "column",
              justifyContent: "center",
              gap: 1,
            }}
          >
            {cart.map((item) => (
              <Box
                key={item.product.id}
                sx={{
                  textAlign: "center",
                  borderRadius: 2,
                  bgcolor: "#F5F5F5",
                }}
              >
                <Typography sx={{ fontWeight: 700 }}>
                  {item.product.name}
                </Typography>
                <Typography>
                  Subtotal: ${(item.product.price * item.quantity).toFixed(2)}
                </Typography>
              </Box>
            ))}
            <Typography
              sx={{ fontWeight: 500, color: "#2E7D32", textAlign: "center" }}
            >
              Total a pagar: ${getSubtotal().toFixed(2)}
            </Typography>
            <Button
              fullWidth
              variant="contained"
              color="secondary"
              onClick={handleCart}
              endIcon={<ShoppingCart />}
            >
              Ver carrito
            </Button>
          </Box>
        </DialogContent>
      </Dialog>
    </>
  );
};
