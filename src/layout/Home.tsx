import React from "react";
import { ProductCard } from "../features/products/ProductCard.tsx";
import { Box } from "@mui/material";
import { NavegationBar } from "../components/common/NavegationBar.tsx";

type Props = {};

export const Home = (props: Props) => {
  return (
    <div>
      <Box sx={{display: "flex", flexWrap: "wrap"}}>
        <ProductCard></ProductCard>
      </Box>
    </div>
  );
};
