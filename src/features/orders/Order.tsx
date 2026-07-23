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

type Props = {};

export const Order = (props: Props) => {
  const { cart } = useCart();
  return (
    <Box sx={{ display: "flex", padding: "20px", flexDirection: "column", gap: "10px" }}>
      {/* SIMULACION */}
      <Typography>{new Date().toLocaleString()}</Typography>
      <Typography variant="h5">Orden #1001</Typography>
      <Typography>Nombre del cliente</Typography>
      <Typography>Dirección del cliente</Typography>
      <Typography>Estado</Typography>
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
            {cart.map((item) => (
              <TableRow
                key={item.product.name}
                sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
              >
                <TableCell component="th" scope="row">
                  {item.product.name}
                </TableCell>
                <TableCell component="th" scope="row">
                  {item.product.price.toFixed(2)}
                </TableCell>
                <TableCell align="right">{item.quantity}</TableCell>
                <TableCell align="right">
                  {(item.product.price * item.quantity).toFixed(2)}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      <Typography>Subtotal</Typography>
      <Typography>IVA</Typography>
      <Typography>Total</Typography>
    </Box>
  );
};
