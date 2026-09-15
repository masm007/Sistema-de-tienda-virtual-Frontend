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
} from "@mui/material";
import { OrderSummary } from "../components/OrderSummary";
import type {
  Order,
  OrderSummary as OrderSummaryDto,
} from "../../../types/Order";
import { useAuth } from "../../../hooks/useAuth";
import { getAllOrdersForAdmin } from "../../../services/OrderService";
import { useNotification } from "../../../hooks/useNotification";
import { UserRole } from "../../../types/User";

type Props = {};

export const AdminOrders = (props: Props) => {
  const [orders, setOrders] = useState<OrderSummaryDto[] | null>(null);
  const { user, token } = useAuth();
  const { error } = useNotification();
  const isAdmin = user?.role === UserRole.Admin;

  useEffect(() => {
    if (!token) {
      return;
    }
    const loadData = async () => {
      try {
        const ordersData = await getAllOrdersForAdmin(token);
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
    <Box sx={{ padding: 4 }}>
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Número de orden</TableCell>
              <TableCell>Fecha</TableCell>
              <TableCell>Cliente</TableCell>
              <TableCell align="center">Cantidad de productos</TableCell>
              <TableCell align="right">Total</TableCell>
              <TableCell align="center">Estado</TableCell>
              <TableCell align="center">Acciones</TableCell>
            </TableRow>
          </TableHead>

          <TableBody>
            {orders?.map((order) => (
              <OrderSummary
                key={order.orderNumber}
                order={order}
                isAdmin={isAdmin}
              />
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
};
