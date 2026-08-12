import React, { useState, useEffect } from "react";
import {
  Box,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
} from "@mui/material";
import { OrderSummary } from "../components/OrderSummary";
import type { Order } from "../../../types/Order";
import { useAuth } from "../../../hooks/useAuth";
import { getAllOrdersForUser } from "../../../services/OrderService";
import { useNotification } from "../../../hooks/useNotification";

type Props = {};

export const Orders = (props: Props) => {
  const [orders, setOrders] = useState<Order[] | null>(null);
  const { user, token } = useAuth();
  const { error } = useNotification();

  useEffect(() => {
    if (!token) {
      return;
    }
    const loadData = async () => {
      try {
        const ordersData = await getAllOrdersForUser(token);
        setOrders(ordersData);
      } catch (err) {
        if (err instanceof Error) {
          error(err.message, "Obtener órdenes");
        } else {
          error("Ocurrió un error inesperado.", "Obtener órdenes");
        }
      }
    };
    loadData();
  }, []);

  return (
    <Box
      sx={{
        padding: 4,
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
        gap: 2
      }}
    >
      <Typography variant="h4">
        Mis órdenes
      </Typography>
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Número de orden</TableCell>
              <TableCell>Fecha</TableCell>
              <TableCell align="center">Cantidad de productos</TableCell>
              <TableCell align="right">Total</TableCell>
              <TableCell align="center">Estado</TableCell>
              <TableCell align="center">Acciones</TableCell>
            </TableRow>
          </TableHead>

          <TableBody>
            {orders?.map((order) => (
              <OrderSummary key={order.orderNumber} order={order} />
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
};
