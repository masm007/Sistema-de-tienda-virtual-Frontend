import { useState, useEffect, useMemo } from "react";
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
  TextField,
  Button,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  type SelectChangeEvent,
} from "@mui/material";
import { OrderSummary } from "../../orders/components/OrderSummary";
import {
  OrderStatus,
  OrderStatusName,
  type OrderSummary as OrderSummaryDto,
} from "../../../types/Order";
import { useAuth } from "../../../hooks/useAuth";
import { getAllOrdersForAdmin } from "../../../services/OrderService";
import { useNotification } from "../../../hooks/useNotification";

type Props = {};

const ALL_STATUSES = "all";

export const AdminOrders = (props: Props) => {
  const [orders, setOrders] = useState<OrderSummaryDto[] | null>(null);
  const { token, isAdmin } = useAuth();
  const [searchParam, setSearchParam] = useState<string>("");
  const [statusFilter, setStatusFilter] = useState<OrderStatus | typeof ALL_STATUSES>(
    ALL_STATUSES,
  );
  const { error } = useNotification();

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
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [token]);

  const filteredOrders = useMemo(() => {
    if (!orders) return [];
    return orders.filter((order) => {
      const matchesSearch = searchParam.trim().length === 0
        || order.orderNumber.toLowerCase().includes(searchParam.trim().toLowerCase());
      const matchesStatus = statusFilter === ALL_STATUSES || order.state === statusFilter;
      return matchesSearch && matchesStatus;
    });
  }, [orders, searchParam, statusFilter]);

  const handleStatusChange = (e: SelectChangeEvent<OrderStatus | typeof ALL_STATUSES>) => {
    const value = e.target.value;
    setStatusFilter(value === ALL_STATUSES ? ALL_STATUSES : (Number(value) as OrderStatus));
  };

  const reloadOrders = async () => {
    if (!token) return;
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

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        textAlign: "center",
        padding: 4,
        gap: 3,
      }}
    >
      <Typography variant="h1" fontWeight={500}>
        Todas las órdenes
      </Typography>
      <Box
        sx={{
          display: "flex",
          gap: "10px",
          textAlign: "center",
          justifyContent: "flex-start",
          alignItems: "center",
        }}
      >
        <FormControl sx={{ maxWidth: "20%" }}>
          <InputLabel id="status-filter-label">Estado</InputLabel>
          <Select
            labelId="status-filter-label"
            label="Estado"
            value={statusFilter}
            onChange={handleStatusChange}
          >
            <MenuItem value={ALL_STATUSES}>Todos</MenuItem>
            {Object.values(OrderStatus)
              .filter((v) => typeof v === "number")
              .map((status) => (
                <MenuItem key={status} value={status}>
                  {OrderStatusName[status as OrderStatus]}
                </MenuItem>
              ))}
          </Select>
        </FormControl>
        <TextField sx={{ width: "40%" }}
          type="text"
          label="Ingresa el número de la orden a buscar"
          value={searchParam}
          onChange={(e) => setSearchParam(e.target.value)}
        />
      </Box>
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
            {filteredOrders.length === 0 ? (
              <TableRow>
                <TableCell colSpan={7}>
                  <Typography color="text.secondary" sx={{ py: 3 }}>
                    No se encontraron órdenes.
                  </Typography>
                </TableCell>
              </TableRow>
            ) : (
              filteredOrders.map((order) => (
                <OrderSummary
                  key={order.orderNumber}
                  order={order}
                  isAdmin={isAdmin}
                  onUpdated={reloadOrders}
                />
              ))
            )}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
};