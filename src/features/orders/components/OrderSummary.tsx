import { Box, Button, TableCell, TableRow, Typography } from "@mui/material";
import { OrderStatus, OrderStatusName, type Order as OrderType } from "../../../types/Order";
import { useNavigate } from "react-router-dom";

type Props = {
  order: OrderType;
};

export const OrderSummary = (props: Props) => {
  const navigate = useNavigate();
  const date = new Date(props.order.emisionDate);

  const formattedDateOrder = new Intl.DateTimeFormat("es-EC", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  }).format(date);

  return (
    <TableRow
      sx={{
        "&:last-child td, &:last-child th": {
          border: 0,
        },
      }}
    >
      <TableCell>
        <Typography fontWeight={600}>
          {props.order.orderNumber}
        </Typography>
      </TableCell>

      <TableCell>
        {formattedDateOrder}
      </TableCell>

      <TableCell align="center">
        {props.order.orderDetails.length}
      </TableCell>

      <TableCell align="right">
        ${props.order.total.toFixed(2)}
      </TableCell>

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
            size="small"
            variant="contained"
            color="info"
            onClick={()=>{navigate(`/orders/${props.order.orderNumber}`)}}
          >
            Ver
          </Button>

          <Button
            size="small"
            variant="contained"
            color="warning"
          >
            Cambiar estado
          </Button>

          <Button
            size="small"
            variant="contained"
            color="error"
          >
            Eliminar
          </Button>
        </Box>
      </TableCell>
    </TableRow>
  );
};