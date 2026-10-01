import { Box, Button, TableCell, TableRow, Typography } from "@mui/material";
import { useNavigate } from "react-router-dom";
import {
  ChangeCircle,
  Delete,
  Edit,
  OpenInNew,
  Preview,
} from "@mui/icons-material";
import { useState } from "react";
import { useAuth } from "../../../../hooks/useAuth";
import { useNotification } from "../../../../hooks/useNotification";
import { updateProductRequest } from "../../../../services/ProductService";
import type { Product, UpdateProductDto } from "../../../../types/Product";

type Props = {
  product: Product;
  onUpdated?: () => void;
  onEdit?: (product: Product) => void;
};

export const AdminProductSummary = (props: Props) => {
  const { token } = useAuth();
  const { error, success } = useNotification();
  const [saving, setSaving] = useState(false);

  const cellStyle = {
    textAlign: "center",
  };

  const handleToggleActive = async () => {
    if (!token) {
      error(
        "Debes tener una sesión activa para realizar este proceso",
        "Actualizar producto",
      );
      return;
    }
    const willActivate = !props.product.isActive;
    setSaving(true);
    try {
      const dto: UpdateProductDto = {
        id: props.product.id,
        name: props.product.name,
        description: props.product.description,
        categoryId: props.product.category.id,
        price: props.product.price,
        sku: props.product.sku,
        quantity: props.product.quantity,
        isAvailable: props.product.isAvailable,
        isActive: willActivate,
        keepImageIds: props.product.images.map((img) => img.id),
        newImages: [],
      };
      await updateProductRequest(dto, token);
      success(
        `Producto "${props.product.name}" ${willActivate ? "activado" : "desactivado"} correctamente.`,
        "Actualizar producto",
      );
      props.onUpdated?.();
    } catch (err) {
      error(
        err instanceof Error ? err.message : "Ocurrió un error inesperado.",
        "Actualizar producto",
      );
    } finally {
      setSaving(false);
    }
  };

  return (
    <>
      <TableRow
        sx={{
          "&:last-child td, &:last-child th": {
            border: 0,
          },
        }}
      >
        <TableCell sx={cellStyle}>
          <Typography fontWeight={600}>{props.product.id}</Typography>
        </TableCell>

        <TableCell sx={cellStyle}>
          <Typography>{props.product.name}</Typography>
        </TableCell>

        <TableCell sx={cellStyle}>
          <Typography>{props.product.category.name}</Typography>
        </TableCell>

        <TableCell sx={cellStyle}>
          <Typography>{props.product.sku}</Typography>
        </TableCell>

        <TableCell sx={cellStyle}>
          <Typography>{props.product.quantity}</Typography>
        </TableCell>

        <TableCell sx={cellStyle}>
          <Typography>{props.product.price.toFixed(2)}</Typography>
        </TableCell>

        <TableCell sx={cellStyle}>
          <Typography
            component="span"
            sx={{
              display: "inline-block",
              padding: "4px 10px",
              borderRadius: 2,
              backgroundColor:
                props.product.isAvailable === true ? "#FFF3CD" : "#E8F5E9",
              fontSize: "0.85rem",
              border: "10px",
            }}
          >
            {props.product.isAvailable === true
              ? "Disponible"
              : "No disponible"}
          </Typography>
          <Typography
            component="span"
            sx={{
              display: "inline-block",
              padding: "4px 10px",
              borderRadius: 2,
              backgroundColor:
                props.product.isActive === true ? "#25c813" : "#a31c12",
              fontSize: "0.85rem",
            }}
          >
            {props.product.isActive === true ? "Activo" : "Inactivo"}
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
              component="a"
              href={`/admin/products/${props.product.id}`}
              target="_blank"
              rel="noopener noreferrer"
              size="small"
              variant="contained"
              color="info"
              endIcon={<OpenInNew />}
            >
              Consultar
            </Button>
            <Button
              size="small"
              variant="contained"
              color="warning"
              endIcon={<Edit />}
              onClick={() => props.onEdit?.(props.product)}
            >
              Editar
            </Button>
            <Button
              size="small"
              variant="contained"
              color={props.product.isActive ? "error" : "success"}
              endIcon={<Delete />}
              disabled={saving}
              onClick={handleToggleActive}
            >
              {props.product.isActive ? "Desactivar" : "Activar"}
            </Button>
          </Box>
        </TableCell>
      </TableRow>
    </>
  );
};
