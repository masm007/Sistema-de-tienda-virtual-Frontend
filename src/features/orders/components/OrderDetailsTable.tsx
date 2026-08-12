import React from "react";
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
import { type Order as OrderType, OrderStatus } from "../../../types/Order";
import logo from "../../../assets/images/Store.png";

type Props = {
  order: OrderType;
};

export const OrderDetailsTable = (props: Props) => {
  const date = new Date(props.order.emisionDate);

  const formattedDate = new Intl.DateTimeFormat("es-EC", {
    dateStyle: "long",
    timeStyle: "short",
  }).format(date);

  const formattedDateOrder = new Intl.DateTimeFormat("es-EC", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  }).format(date);

  const createSpan = (word: string) => {
    return (
      <Typography component="span" fontWeight={700}>
        {word}:{" "}
      </Typography>
    );
  };

  return (
    <Box
      className="order"
      sx={{
        display: "flex",
        padding: 5,
        flexDirection: "column",
        gap: 4,
      }}
    >
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          gap: 4,
        }}
      >
        <Box
          className="company-header"
          sx={{
            display: "flex",
            flexDirection: "row",
            justifyContent: "space-between",
            alignItems: "flex-start",
          }}
        >
          <Box
            sx={{
              display: "flex",
              width: "70%",
              //margin: "auto",
              flexDirection: "row",
              justifyContent: "flex-start",
              alignItems: "flex-start",
              gap: 5,
            }}
          >
            <Box
              component="img"
              src={logo}
              alt="Logo"
              sx={{
                width: "10vw",
                height: "auto",
                my: 2,
                cursor: "pointer",
                borderRadius: 3,
                boxShadow: 4,
              }}
            />
            <Box sx={{ display: "flex", flexDirection: "column" }}>
              <Typography variant="h3">Masm Store</Typography>
              <Typography>Dirección: Avenida Siempreviva 742</Typography>
              <Typography>Teléfono: 0987654321</Typography>
              <Typography>Email: masm.store@example.com</Typography>
              <Typography>Web: masm.store.com</Typography>
            </Box>
          </Box>
          <Box
            sx={{
              border: "1px solid black",
              borderRadius: "5px",
              padding: "10px",
            }}
          >
            <Typography variant="h5" fontWeight={700}>
              {props.order.orderNumber}
            </Typography>
          </Box>
        </Box>
        <Box
          className="client-header"
          sx={{
            display: "flex",
            flexDirection: "row",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <Box sx={{ display: "flex", flexDirection: "column" }}>
            <Typography>
              {createSpan("Cliente")}
              {props.order.user.firstName + " " + props.order.user.lastName}
            </Typography>
            <Typography>
              {createSpan("Correo")}
              {props.order.user.email}
            </Typography>
          </Box>
          <Box sx={{ display: "flex", flexDirection: "column" }}>
            <Typography>
              {createSpan("F. Emisión")}
              {formattedDateOrder}
            </Typography>
            <Typography>
              {createSpan("Estado de la orden")}
              {props.order.state + " - " + OrderStatus.Pending}
            </Typography>
          </Box>
        </Box>
      </Box>

      <Box
        className="table-body"
        sx={{
          display: "flex",
          flexDirection: "column",
          gap: 4,
        }}
      >
        <Box>
          <TableContainer component={Paper}>
            <Table sx={{ minWidth: "auto" }} aria-label="simple table">
              <TableHead>
                <TableRow>
                  <TableCell>Nombre</TableCell>
                  <TableCell>Precio Unitario</TableCell>
                  <TableCell>Cantidad</TableCell>
                  <TableCell>Total</TableCell>
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
                    <TableCell component="th" scope="row">
                      {item.quantity}
                    </TableCell>
                    <TableCell component="th" scope="row">
                      {item.subtotal.toFixed(2)}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </Box>
        <Box
          sx={{
            width: "100%",
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            alignItems: "flex-end",
          }}
        >
          <Typography>
            {createSpan("Subtotal")} ${props.order.subtotal.toFixed(2)}
          </Typography>
          <Typography>
            {createSpan("Descuento")} ${props.order.discount.toFixed(2)}
          </Typography>
          <Typography>
            {createSpan("IVA")} ${props.order.iva.toFixed(2)}
          </Typography>
          <Typography>
            {createSpan("Total")} ${props.order.total.toFixed(2)}
          </Typography>
        </Box>
      </Box>
    </Box>
  );
};
