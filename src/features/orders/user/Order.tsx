import { useState, useEffect } from "react";
import {
  Box,
  CircularProgress,
} from "@mui/material";
import { useLocation, useParams } from "react-router-dom";
import { useAuth } from "../../../hooks/useAuth";
import { getOrderByOrderNumberForUser } from "../../../services/OrderService";
import type { Order as OrderType } from "../../../types/Order";
import { useNotification } from "../../../hooks/useNotification";
import {OrderDetailsTable} from "../components/OrderDetailsTable";

export const Order = () => {
  const { token } = useAuth();
  const { error } = useNotification();
  const { orderNumber } = useParams();
  const location = useLocation();
  const [order, setOrder] = useState<OrderType | null>(
    location.state?.order ?? null,
  );

  useEffect(() => {
    if (order || !orderNumber || !token) {
      return;
    }
    const loadOrder = async () => {
      try {
        const data = await getOrderByOrderNumberForUser(orderNumber, token);
        setOrder(data);
      } catch (err) {
        if (err instanceof Error) {
          error(err.message, "Ver orden");
        } else {
          error("Ocurrió un error inesperado.", "Ver orden");
        }
      }
    };

    loadOrder();
  }, [order, orderNumber, token]);

  if (!order) {
    return (
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          minHeight: "100vh",
        }}
      >
        <CircularProgress />
      </Box>
    );
  }

  return (
    <OrderDetailsTable order={order}></OrderDetailsTable>
  );
};
