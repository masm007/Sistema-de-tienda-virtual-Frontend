import { CartItem } from "./CartItem";
import {
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  TextField,
  Typography,
  keyframes,
  CircularProgress,
} from "@mui/material";
import { PriceCheck, Close } from "@mui/icons-material";
import { useCart } from "../../hooks/useCart";
import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { createOrder } from "../../services/OrderService";
import { validateCouponRequest } from "../../services/CouponService";
import type { CreateOrderDto } from "../../types/Order";
import type {
  ApplyCouponResultDto,
  ValidateCouponRequest,
} from "../../types/Coupon";
import { useAuth } from "../../hooks/useAuth";
import { useNotification } from "../../hooks/useNotification";
import { Gallery } from "../../assets/components/ui/Gallery";
import { useMediaQuery, useTheme } from "@mui/material";

type Props = {};

export const Cart = (props: Props) => {
  const { token } = useAuth();
  const { cart, getSubtotal, emptyCart } = useCart();
  const { success, error } = useNotification();
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);
  const [coupon, setCoupon] = useState<string>("");
  const [appliedCoupon, setAppliedCoupon] =
    useState<ApplyCouponResultDto | null>(null);
  const [validating, setValidating] = useState(false);
  const theme = useTheme();
  const isBelowMd = useMediaQuery(theme.breakpoints.down("md"));
  const itemsPerView = isBelowMd ? 1 : Math.min(cart.length, 3);

  const pulse = keyframes`
    0%   { transform: scale(1); }
    50%  { transform: scale(1.08); }
    100% { transform: scale(1); }
  `;

  const subtotal = getSubtotal();
  const total = appliedCoupon
    ? subtotal - appliedCoupon.discountAmount
    : subtotal;

  // Si el carrito cambia después de aplicar un cupón, invalidamos el descuento:
  // el eligibleSubtotal que calculó el backend quedó atado a ese snapshot del carrito.
  useEffect(() => {
    if (appliedCoupon) {
      setAppliedCoupon(null);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [cart]);

  const handleValidateCoupon = async () => {
    if (!token) {
      error("Debes iniciar sesión para usar un cupón.", "Validar cupón");
      return;
    }
    if (validating) return; // evita doble clic mientras hay una petición en curso

    setValidating(true);
    try {
      const dto: ValidateCouponRequest = {
        code: coupon,
        details: cart.map((item) => ({
          productId: item.product.id,
          quantity: item.quantity,
        })),
      };
      const response = await validateCouponRequest(dto, token);
      setAppliedCoupon(response); // reemplaza, no acumula
      success(
        `El código de cupón "${response.code}" es aplicable a tu orden`,
        "Validar cupón",
      );
    } catch (err) {
      setAppliedCoupon(null);
      if (err instanceof Error) {
        error(err.message, "Validar cupón");
      } else {
        error("Ocurrió un error inesperado.", "Validar cupón");
      }
    } finally {
      setValidating(false);
    }
  };

  const handleRemoveCoupon = () => {
    setAppliedCoupon(null);
    setCoupon("");
  };

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
      const ord = await createOrder(dto, token);
      setOpen(false);
      success(
        `Se creó la orden con el número: ${ord.orderNumber}`,
        "Crear una orden",
      );
      emptyCart();
      navigate(`/orders/${ord.orderNumber}`, {
        state: { order: ord },
      });
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
          boxShadow: "10px 10px 5px rgba(0, 0, 0, 0.08)",
          border: "1px solid black",
          borderRadius: "5px",
          margin: "30px 20px",
          display: "flex",
          padding: "15px",
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
            gap: "10px",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          {cart.length === 0 ? (
            <Typography>No se ha agregado nada en el carrito</Typography>
          ) : (
            <Gallery
              lista={cart}
              itemsPerView={itemsPerView}
              renderItem={(item) => (
                <CartItem product={item.product} quantity={item.quantity} />
              )}
            />
          )}
        </Box>

        {appliedCoupon ? (
          <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
            <Typography color="success.main" fontWeight={600}>
              Cupón "{appliedCoupon.code}" aplicado: -$
              {appliedCoupon.discountAmount.toFixed(2)}
            </Typography>
            <Button
              size="small"
              onClick={handleRemoveCoupon}
              endIcon={<Close />}
            >
              Quitar
            </Button>
          </Box>
        ) : (
          <>
            <Typography>Tienes un código de cupón?</Typography>
            <TextField
              label="Ingresalo aquí"
              value={coupon}
              onChange={(e) => setCoupon(e.target.value)}
            />
            {coupon.length >= 1 && (
              <Button
                onClick={handleValidateCoupon}
                variant="contained"
                color="success"
                disabled={validating}
                endIcon={
                  validating ? (
                    <CircularProgress size={16} color="inherit" />
                  ) : (
                    <PriceCheck />
                  )
                }
              >
                {validating ? "Validando..." : "Validar Cupón"}
              </Button>
            )}
          </>
        )}

        <Typography fontWeight={500}>
          El Total a pagar es: ${total.toFixed(2)}
        </Typography>
        <Button
          variant="contained"
          sx={{
            backgroundColor: "#9C27B0",
            "&:hover": {
              backgroundColor: "#7B1FA2",
            },
            animation: `${pulse} 2s ease-in-out infinite`,
          }}
          onClick={() => setOpen(true)}
        >
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
          <Button color="error" onClick={() => setOpen(false)}>
            Cancelar
          </Button>
          <Button
            sx={{
              backgroundColor: "#9C27B0",
              "&:hover": {
                backgroundColor: "#7B1FA2",
              },
            }}
            variant="contained"
            onClick={handleCreateOrder}
          >
            Confirmar
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};
