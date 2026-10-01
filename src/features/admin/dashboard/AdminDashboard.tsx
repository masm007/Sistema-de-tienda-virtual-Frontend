import {
  Assignment,
  Category,
  Group,
  Inventory,
  Percent,
  Sell,
} from "@mui/icons-material";
import { Box, Button, Typography } from "@mui/material";
import React from "react";
import { useNavigate } from "react-router-dom";

type Props = {};

export const AdminDashboard = (props: Props) => {
  const navigate = useNavigate();
  const createButtonMenu = (
    name: string,
    icon: React.ReactNode,
    route: string,
  ) => (
    <Button
      variant="outlined"
      size="large"
      sx={{
        "&:hover": {
          backgroundColor: "primary.main",
          color: "white",
        },
      }}
      color="primary"
      endIcon={icon}
      onClick={() => {
        navigate(route);
      }}
    >
      {name}
    </Button>
  );
  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        padding: 4,
        gap: 3,
        textAlign: "center",
        justifyContent: "flex-start",
        alignItems: "center",
        minHeight: "70vh",
      }}
    >
      <Typography variant="h1" fontWeight={500}>
        Panel del Administrador
      </Typography>
      <Box
        sx={{
          display: "flex",
          flexDirection: "row",
          gap: 3,
          textAlign: "center",
          justifyContent: "center",
          alignItems: "center",
          flexWrap: "wrap",
        }}
      >
        {createButtonMenu("Categorías", <Category />, "categories")}
        {createButtonMenu("Productos", <Inventory />, "products")}
        {createButtonMenu("Órdenes", <Assignment />, "orders")}
        {createButtonMenu("Cupones", <Sell />, "coupons")}
        {createButtonMenu("Usuarios", <Group />, "users")}
        {createButtonMenu("Impuestos", <Percent />, "settings/tax")}
      </Box>
    </Box>
  );
};
