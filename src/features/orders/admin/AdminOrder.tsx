import { useEffect, useState } from 'react'
import { OrderDetailsTable } from '../components/OrderDetailsTable';
import { Box, CircularProgress } from '@mui/material';
import { getOrderByOrderNumberForAdmin } from '../../../services/OrderService';
import { useNotification } from '../../../hooks/useNotification';
import { useAuth } from '../../../hooks/useAuth';
import { useParams } from 'react-router-dom';
import type { Order as OrderType } from "../../../types/Order";

export const AdminOrder = () => {
  const { token } = useAuth();
  const { error } = useNotification();
  const { orderNumber } = useParams();
  const [order, setOrder] = useState<OrderType | null>(null);

  useEffect(() => {
    if (!orderNumber || !token) {
      return;
    }
    const loadOrder = async () => {
      try {
        const data = await getOrderByOrderNumberForAdmin(orderNumber, token);
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
  }, [orderNumber, token]);

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
}