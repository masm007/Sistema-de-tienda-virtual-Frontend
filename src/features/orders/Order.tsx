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
import { useCart } from "../../hooks/useCart";
import type { Order as Ord } from "../../types/Order";

type Props = {
  order: Ord;
};

export const Order = (props: Props) => {
  const { cart } = useCart();
  return (
    <Box
      sx={{
        display: "flex",
        padding: "20px",
        flexDirection: "column",
        gap: "10px",
      }}
    >
      <Typography>{props.order.emisionDate}</Typography>
      <Typography variant="h5">{props.order.orderNumber} #1001</Typography>
      <Typography>
        {props.order.user.firstName + " " + props.order.user.lastName}
      </Typography>
      <Typography>{props.order.user.email}</Typography>
      <Typography>{props.order.state}</Typography>
      <Typography>Productos</Typography>
      <TableContainer component={Paper}>
        <Table sx={{ minWidth: 650 }} aria-label="simple table">
          <TableHead>
            <TableRow>
              <TableCell>Nombre</TableCell>
              <TableCell align="right">Precio</TableCell>
              <TableCell align="right">Cantidad</TableCell>
              <TableCell align="right">Total</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {props.order.orderDetails.map((item) => (
              <TableRow
                key={item.product.name}
                sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
              >
                <TableCell component="th" scope="row">
                  {item.product.name}
                </TableCell>
                <TableCell component="th" scope="row">
                  {item.unitPrice.toFixed(2)}
                </TableCell>
                <TableCell align="right">{item.quantity}</TableCell>
                <TableCell align="right">{item.subtotal.toFixed(2)}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      <Typography>Subtotal: {props.order.subtotal}</Typography>
      <Typography>Descuento: {props.order.discount}</Typography>
      <Typography>IVA: {props.order.iva}</Typography>
      <Typography>Total: {props.order.total}</Typography>
    </Box>
  );
};
