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
            flexDirection: { xs: "column-reverse", md: "row" },
            justifyContent: "space-between",
            gap: 2,
            padding: 1,
            alignItems: "flex-start",
          }}
        >
          <Box
            className="company-info"
            sx={{
              display: "flex",
              width: "70%",
              //margin: "auto",
              flexDirection: { xs: "column", md: "row" },
              justifyContent: "flex-start",
              alignItems: "flex-start",
              gap: { xs: 2, md: 5 },
            }}
          >
            <Box
              component="img"
              src={logo}
              alt="Logo"
              sx={{
                width: { xs: "120px", md: "10vw" },
                height: "auto",
                borderRadius: 3,
                boxShadow: 4,
              }}
            />
            <Box sx={{ display: "flex", flexDirection: "column", gap: "5px" }}>
              <Typography variant="h3">Masm Store</Typography>
              <Typography>
                {createSpan("Dirección")} Avenida Siempreviva 742
              </Typography>
              <Typography>{createSpan("Teléfono")} 0987654321</Typography>
              <Typography>
                {createSpan("Email")} store.masm.com
              </Typography>
              <Typography>{createSpan("Web")} masm.store.com</Typography>
            </Box>
          </Box>
          <Box
            className="order-info"
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
            gap: 2,
            padding: 1,
            flexWrap: "wrap",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <Box sx={{ display: "flex", flexDirection: "column"}}>
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
                  <TableCell align="center" sx={{ fontWeight: "bold" }}>
                    Nombre
                  </TableCell>
                  <TableCell align="center" sx={{ fontWeight: "bold" }}>
                    Precio Unitario
                  </TableCell>
                  <TableCell align="center" sx={{ fontWeight: "bold" }}>
                    Cantidad
                  </TableCell>
                  <TableCell align="center" sx={{ fontWeight: "bold" }}>
                    Total
                  </TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {props.order.orderDetails.map((item) => (
                  <TableRow
                    key={item.product.name}
                    sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
                  >
                    <TableCell component="th" scope="row" align="center">
                      {item.product.name}
                    </TableCell>
                    <TableCell component="th" scope="row" align="center">
                      {item.unitPrice.toFixed(2)}
                    </TableCell>
                    <TableCell component="th" scope="row" align="center">
                      {item.quantity}
                    </TableCell>
                    <TableCell component="th" scope="row" align="center">
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
          <TableContainer
            component={Paper}
            sx={{ maxWidth: { sm: "30vw", md: "20vw" } }}
          >
            <Table sx={{ maxWidth: "auto" }} aria-label="order-resume">
              <TableBody>
                <TableRow>
                  <TableCell sx={{ fontWeight: "bold" }}>Subtotal</TableCell>
                  <TableCell align="right">
                    ${props.order.subtotal.toFixed(2)}
                  </TableCell>
                </TableRow>

                <TableRow>
                  <TableCell sx={{ fontWeight: "bold" }}>Descuento</TableCell>
                  <TableCell align="right">
                    ${props.order.discount.toFixed(2)}
                  </TableCell>
                </TableRow>

                <TableRow>
                  <TableCell sx={{ fontWeight: "bold" }}>IVA</TableCell>
                  <TableCell align="right">
                    ${props.order.iva.toFixed(2)}
                  </TableCell>
                </TableRow>

                <TableRow>
                  <TableCell sx={{ fontWeight: "bold" }}>Total</TableCell>
                  <TableCell align="right" sx={{ fontWeight: "bold" }}>
                    ${props.order.total.toFixed(2)}
                  </TableCell>
                </TableRow>
              </TableBody>
            </Table>
          </TableContainer>
        </Box>
      </Box>
    </Box>
  );
};
