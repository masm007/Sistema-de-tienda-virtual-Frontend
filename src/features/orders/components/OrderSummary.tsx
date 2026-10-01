import { Box, Button, TableCell, TableRow, Typography } from "@mui/material";
import {
  OrderStatus,
  OrderStatusName,
  type OrderSummary as OrderSummaryDto,
} from "../../../types/Order";
import { useNavigate } from "react-router-dom";
import { ChangeCircle, Delete, OpenInNew, Preview } from "@mui/icons-material";
import { useState } from "react";
import { useAuth } from "../../../hooks/useAuth";
import {
  cancelOrderRequest,
  updateOrderStatusRequest,
} from "../../../services/OrderService";
import { useNotification } from "../../../hooks/useNotification";
import { ModalStateChange } from "../../admin/orders/components/ModalStateChange";

type Props = {
  order: OrderSummaryDto;
  isAdmin: boolean;
  onUpdated?: () => void; // para que el padre recargue la lista tras un cambio
};

export const OrderSummary = (props: Props) => {
  const { token } = useAuth();
  const { error, success } = useNotification();
  const [modalStateChange, setModalStateChange] = useState<boolean>(false);
  const [saving, setSaving] = useState(false);
  const date = new Date(props.order.emisionDate);

  const handleCancel = async (orderNumber: string) => {
    if (!token) {
      error(
        "Debes tener una sesión activa para realizar este proceso",
        "Cancelar Orden",
      );
      return;
    }
    try {
      await cancelOrderRequest(orderNumber, token);
      success("La orden ha sido cancelada correctamente", "Cancelar Orden");
    } catch (err) {
      if (err instanceof Error) {
        error(err.message, "Cancelar Orden");
      } else {
        error("Ocurrió un error inesperado.", "Cancelar Orden");
      }
    }
  };

  const handleConfirmStatusChange = async (newStatus: OrderStatus) => {
    if (!token) {
      error(
        "Debes tener una sesión activa para realizar este proceso",
        "Cambiar estado",
      );
      return;
    }
    setSaving(true);
    try {
      await updateOrderStatusRequest(props.order.orderNumber, newStatus, token);
      success("El estado de la orden fue actualizado", "Cambiar estado");
      setModalStateChange(false);
      props.onUpdated?.();
    } catch (err) {
      if (err instanceof Error) {
        error(err.message, "Cambiar estado");
      } else {
        error("Ocurrió un error inesperado.", "Cambiar estado");
      }
    } finally {
      setSaving(false);
    }
  };

  const formattedDateOrder = new Intl.DateTimeFormat("es-EC", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  }).format(date);

  return (
    <>
      <TableRow
        sx={{
          "&:last-child td, &:last-child th": {
            border: 0,
          },
        }}
      >
        <TableCell>
          <Typography fontWeight={600}>{props.order.orderNumber}</Typography>
        </TableCell>

        <TableCell>{formattedDateOrder}</TableCell>

        {props.isAdmin && props.order.user && (
          <TableCell>
            {props.order.user.firstName} {props.order.user.lastName}
          </TableCell>
        )}

        <TableCell align="center">{props.order.productsQuantity}</TableCell>

        <TableCell align="right">${props.order.total.toFixed(2)}</TableCell>

        <TableCell align="center">
          <Typography
            component="span"
            sx={{
              display: "inline-block",
              padding: "4px 10px",
              borderRadius: 2,
              backgroundColor:
                props.order.state === OrderStatus.Pending
                  ? "#FFF3CD"
                  : "#E8F5E9",
              fontSize: "0.85rem",
            }}
          >
            {OrderStatusName[props.order.state]}
          </Typography>
        </TableCell>

        <TableCell align="center">
          <Box
            sx={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              gap: 1,
              flexWrap: "wrap",
            }}
          >
            <Button
              component="a"
              href={`/orders/${props.order.orderNumber}`}
              target="_blank"
              rel="noopener noreferrer"
              size="small"
              variant="contained"
              color="info"
              endIcon={<OpenInNew />}
            >
              Ver
            </Button>

            {props.isAdmin && (
              <>
                <Button
                  size="small"
                  variant="contained"
                  color="warning"
                  endIcon={<ChangeCircle />}
                  onClick={() => {
                    setModalStateChange(true);
                  }}
                >
                  Cambiar estado
                </Button>
                <Button
                  size="small"
                  variant="contained"
                  color="error"
                  endIcon={<Delete />}
                  disabled={props.order.state !== OrderStatus.Pending}
                  onClick={() => {
                    handleCancel(props.order.orderNumber);
                  }}
                >
                  Cancelar
                </Button>
              </>
            )}
          </Box>
        </TableCell>
      </TableRow>

      <ModalStateChange
        open={modalStateChange}
        currentStatus={props.order.state}
        onClose={() => setModalStateChange(false)}
        onConfirm={handleConfirmStatusChange}
        loading={saving}
      />
    </>
  );
};
