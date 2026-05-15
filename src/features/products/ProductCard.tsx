import { Button, Typography, Box, IconButton } from "@mui/material";
import foto from "../../assets/images/tiendaVirtual.png";
import { InformationChip } from "../../components/ui/InformationChip";
import { ShoppingCart } from "@mui/icons-material";
import React from "react";

type Props = {};

export const ProductCard = (props: Props) => {
  const textStyle = {
    fontWeight: 400,
    textAlign: "center",
    margin: "3px",
  };

  return (
    <>
      <Box
        sx={{
          width: {
            xs: "90%",
            sm: "260px",
          },
          "& img": {
            width: {
              xs: "90%",
              sm: "85%",
            },
            height: "auto",
          },
          //maxHeight: "400px",
          //maxWidth: "300px",
          display: "flex",
          flexDirection: "column",
          padding: "15px",
          justifyContent: "flex-start",
          alignItems: "center",
          margin: "15px",
          borderRadius: 2,
          boxShadow: 2,
          transition: "0.3s",
          "&:hover": {
            transform: "scale(1.03)",
            boxShadow: 5,
          },
        }}
      >
        {/*tendra un hoover*/}
        <img
          src={foto}
          alt="sustituto"
        />
        <InformationChip
          text="Esta en promocion!!"
          sizeC="medium"
        ></InformationChip>
        <Typography sx={textStyle}>Categoria</Typography>
        <Typography
          sx={{ fontWeight: 500, textAlign: "center", margin: "3px" }}
        >
          Esto es una demo del titulo
        </Typography>
        <Typography sx={textStyle}>Precio</Typography>
        <Button variant="contained" endIcon={<ShoppingCart />}>
          Agregar al carrito
        </Button>
      </Box>
    </>
  );
};
