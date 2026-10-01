import {
  type SelectChangeEvent,
  Box,
  Typography,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  TextField,
  TableContainer,
  Paper,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  Button,
  IconButton,
} from "@mui/material";
import { useEffect, useMemo, useState } from "react";
import { useAuth } from "../../../hooks/useAuth";
import { useNotification } from "../../../hooks/useNotification";
import {
  createProductRequest,
  getAllProductsRequest,
  updateProductRequest,
} from "../../../services/ProductService";
import { Status, StatusName } from "../../../types/Product";
import type { CreateProductDto, UpdateProductDto } from "../../../types/Product";
import { AdminProductSummary } from "./components/AdminProductSummary";
import type { Product } from "../../../types/Product";
import { Add, Cached, Refresh } from "@mui/icons-material";
import { AdminModalCreateProduct } from "./components/AdminModalCreateProduct";

type Props = {};

const ALL_STATUSES = "all";

export const AdminProducts = (props: Props) => {
  const [products, setProducts] = useState<Product[] | null>(null);
  const { token } = useAuth();
  const [searchParam, setSearchParam] = useState<string>("");
  const { error, success } = useNotification();
  const [statusFilter, setStatusFilter] = useState<
    Status | typeof ALL_STATUSES
  >(ALL_STATUSES);
  const [modalOpen, setModalOpen] = useState<boolean>(false);
  // Producto que se está editando; null cuando el modal está en modo "crear"
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [saving, setSaving] = useState(false);

  const loadData = async () => {
    if (!token) return;
    try {
      const productsData = await getAllProductsRequest(token);
      setProducts(productsData);
    } catch (err) {
      if (err instanceof Error) {
        error(err.message, "Obtener productos");
      } else {
        error("Ocurrió un error inesperado.", "Obtener productos");
      }
    }
  };

  const handleConfirmProduct = async (
    dto: CreateProductDto | UpdateProductDto,
  ) => {
    if (!token) return;
    const isEdit = "id" in dto;
    setSaving(true);
    try {
      const saved = isEdit
        ? await updateProductRequest(dto, token)
        : await createProductRequest(dto, token);
      success(
        `Producto "${saved.name}" ${isEdit ? "actualizado" : "creado"} correctamente.`,
        isEdit ? "Editar producto" : "Crear producto",
      );
      setModalOpen(false);
      await loadData();
    } catch (err) {
      error(
        err instanceof Error ? err.message : "Ocurrió un error inesperado.",
        isEdit ? "Editar producto" : "Crear producto",
      );
    } finally {
      setSaving(false);
    }
  };

  const handleOpenCreate = () => {
    setEditingProduct(null);
    setModalOpen(true);
  };

  const handleOpenEdit = (product: Product) => {
    setEditingProduct(product);
    setModalOpen(true);
  };

  useEffect(() => {
    loadData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [token]);

  const filteredProducts = useMemo(() => {
    if (!products) return [];
    return products.filter((prd) => {
      const matchesSearch =
        searchParam.trim().length === 0 ||
        prd.name.toLowerCase().includes(searchParam.trim().toLowerCase());
      const matchesStatus =
        statusFilter === ALL_STATUSES ||
        prd.isActive === (statusFilter === Status.Activo);
      return matchesSearch && matchesStatus;
    });
  }, [products, searchParam, statusFilter]);

  const handleStatusChange = (
    e: SelectChangeEvent<Status | typeof ALL_STATUSES>,
  ) => {
    setStatusFilter(e.target.value as Status | typeof ALL_STATUSES);
  };

  return (
    <>
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          textAlign: "center",
          padding: 4,
          gap: 3,
        }}
      >
        <Typography variant="h1" fontWeight={500}>
          Gestión de productos
        </Typography>
        <Box
          sx={{
            display: "flex",
            gap: "10px",
            textAlign: "center",
            justifyContent: "flex-start",
            alignItems: "center",
          }}
        >
          <FormControl sx={{ maxWidth: "20%" }}>
            <InputLabel id="status-filter-label">Estado</InputLabel>
            <Select
              labelId="status-filter-label"
              label="Estado"
              value={statusFilter}
              onChange={handleStatusChange}
            >
              <MenuItem value={ALL_STATUSES}>Todos</MenuItem>
              {Object.values(Status).map((status) => (
                <MenuItem key={status} value={status}>
                  {StatusName[status]}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
          <TextField
            sx={{ width: "40%" }}
            type="text"
            label="Buscar producto por nombre"
            value={searchParam}
            onChange={(e) => setSearchParam(e.target.value)}
          />
          <Box sx={{ display: "flex", maxWidth: "40%", gap: "10px" }}>
            <IconButton
              onClick={() => {
                loadData();
              }}
            >
              <Cached />
            </IconButton>
            <Button
              variant="contained"
              startIcon={<Add />}
              onClick={handleOpenCreate}
            >
              Nuevo Producto
            </Button>
          </Box>
        </Box>
        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell align="center">ID</TableCell>
                <TableCell align="center">Nombre</TableCell>
                <TableCell align="center">Categoria</TableCell>
                <TableCell align="center">SKU</TableCell>
                <TableCell align="center">Cantidad</TableCell>
                <TableCell align="center">Precio</TableCell>
                <TableCell align="center">Disponibilidad / Estado</TableCell>
                <TableCell align="center">Acciones</TableCell>
              </TableRow>
            </TableHead>

            <TableBody>
              {filteredProducts.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={6}>
                    <Typography color="text.secondary" sx={{ py: 3 }}>
                      No se encontraron productos.
                    </Typography>
                  </TableCell>
                </TableRow>
              ) : (
                filteredProducts.map((product) => (
                  <AdminProductSummary
                    key={product.id}
                    product={product}
                    onUpdated={loadData}
                    onEdit={handleOpenEdit}
                  />
                ))
              )}
            </TableBody>
          </Table>
        </TableContainer>
      </Box>

      <AdminModalCreateProduct
        open={modalOpen}
        product={editingProduct}
        onClose={() => setModalOpen(false)}
        onConfirm={handleConfirmProduct}
        loading={saving}
      ></AdminModalCreateProduct>
    </>
  );
};
