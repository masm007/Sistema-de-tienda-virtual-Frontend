import { Box, IconButton, Typography } from "@mui/material";
import { ArrowBackIosNew, ArrowForwardIos } from "@mui/icons-material";
import type { ReactNode } from "react";
import { useEffect, useState } from "react";

type Props<T> = {
  lista: T[];
  renderItem: (item: T) => ReactNode;
  itemsPerView?: number; // cuántos ítems se ven a la vez, default 1
  loop?: boolean; // si al llegar al final vuelve al principio
};

export function Gallery<T>({
  lista,
  renderItem,
  itemsPerView = 1,
  loop = false,
}: Props<T>) {
  const [index, setIndex] = useState(0);
  const maxIndex = Math.max(0, lista.length - itemsPerView);
  const showArrows = lista.length > itemsPerView;

  // Si itemsPerView cambia (ej. al redimensionar y pasar de desktop a mobile)
  // o si la lista se achica (se eliminó un producto), el índice actual puede
  // quedar apuntando más allá del nuevo límite. Lo recalculamos acá.
  useEffect(() => {
    setIndex((current) => Math.min(current, Math.max(0, lista.length - itemsPerView)));
  }, [lista.length, itemsPerView]);

  const handlePrev = () => {
    setIndex((current) => {
      if (current === 0) return loop ? maxIndex : 0;
      return current - 1;
    });
  };

  const handleNext = () => {
    setIndex((current) => {
      if (current >= maxIndex) return loop ? 0 : maxIndex;
      return current + 1;
    });
  };

  if (lista.length === 0) {
    return (
      <Typography sx={{ textAlign: "center" }}>
        No hay elementos para mostrar
      </Typography>
    );
  }

  const visibleItems = lista.slice(index, index + itemsPerView);
  const canGoPrev = loop || index > 0;
  const canGoNext = loop || index < maxIndex;

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "row",
        alignItems: "center",
        gap: 1,
        width: "100%",
      }}
    >
      {showArrows && (
        <IconButton onClick={handlePrev} disabled={!canGoPrev}>
          <ArrowBackIosNew color={canGoPrev ? "success" : "disabled"} />
        </IconButton>
      )}

      <Box
        sx={{
          display: "flex",
          flexDirection: "row",
          gap: 2,
          flex: 1,
          justifyContent: "center",
          overflow: "hidden",
        }}
      >
        {visibleItems.map((item, i) => (
          <Box key={index + i}>{renderItem(item)}</Box>
        ))}
      </Box>

      {showArrows && (
        <IconButton onClick={handleNext} disabled={!canGoNext}>
          <ArrowForwardIos color={canGoNext ? "success" : "disabled"} />
        </IconButton>
      )}
    </Box>
  );
}