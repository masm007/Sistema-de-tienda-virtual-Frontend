import React from "react";
import { Chip, Stack } from "@mui/material";

{
  /* Agotado/Oferta */
}

type Props = {
  text: string;
  sizeC: "small" | "medium";
};

export const InformationChip = (props: Props) => {
  return (
    <Stack sx={{ margin: "10px" }} direction="row" spacing={1}>
      <Chip label={props.text} color="success" size={props.sizeC} />
    </Stack>
  );
};
