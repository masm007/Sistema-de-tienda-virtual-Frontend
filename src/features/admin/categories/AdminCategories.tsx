import {
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  IconButton,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TextField,
  Typography,
} from "@mui/material";
import { Add, Cached } from "@mui/icons-material";
import { useEffect, useMemo, useState } from "react";
import { useAuth } from "../../../hooks/useAuth";
import { useNotification } from "../../../hooks/useNotification";
import {
  createCategoryRequest,
  deleteCategoryRequest,
  getCategoriesRequest,
  updateCategoryRequest,
} from "../../../services/CategoryService";
import type { Category, CreateCategoryDto } from "../../../types/Category";
import { AdminCategorySummary } from "./components/AdminCategorySummary";
import { AdminModalCategory } from "./components/AdminModalCategory";

type Props = {};

export const AdminCategories = (props: Props) => {
  const [categories, setCategories] = useState<Category[] | null>(null);
  const { token } = useAuth();
  const { error, success } = useNotification();
  const [searchParam, setSearchParam] = useState<string>("");
  const [modalOpen, setModalOpen] = useState<boolean>(false);
  // Categoría que se está editando; null cuando el modal está en modo "crear"
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);
  const [categoryToDelete, setCategoryToDelete] = useState<Category | null>(null);
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState(false);

  const loadData = async () => {
    try {
      const categoriesData = await getCategoriesRequest();
      setCategories(categoriesData);
    } catch (err) {
      error(
        err instanceof Error ? err.message : "Ocurrió un error inesperado.",
        "Obtener categorías",
      );
    }
  };

  useEffect(() => {
    loadData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const filteredCategories = useMemo(() => {
    if (!categories) return [];
    return categories.filter(
      (cat) =>
        searchParam.trim().length === 0 ||
        cat.name.toLowerCase().includes(searchParam.trim().toLowerCase()),
    );
  }, [categories, searchParam]);

  const handleOpenCreate = () => {
    setEditingCategory(null);
    setModalOpen(true);
  };

  const handleOpenEdit = (category: Category) => {
    setEditingCategory(category);
    setModalOpen(true);
  };

  const handleConfirmCategory = async (dto: CreateCategoryDto | Category) => {
    if (!token) return;
    const isEdit = "id" in dto;
    setSaving(true);
    try {
      const saved = isEdit
        ? await updateCategoryRequest(dto, token)
        : await createCategoryRequest(dto, token);
      success(
        `Categoría "${saved.name}" ${isEdit ? "actualizada" : "creada"} correctamente.`,
        isEdit ? "Editar categoría" : "Crear categoría",
      );
      setModalOpen(false);
      await loadData();
    } catch (err) {
      error(
        err instanceof Error ? err.message : "Ocurrió un error inesperado.",
        isEdit ? "Editar categoría" : "Crear categoría",
      );
    } finally {
      setSaving(false);
    }
  };

  const handleConfirmDelete = async () => {
    if (!token || !categoryToDelete) return;
    setDeleting(true);
    try {
      await deleteCategoryRequest(categoryToDelete.id, token);
      success(
        `Categoría "${categoryToDelete.name}" eliminada correctamente.`,
        "Eliminar categoría",
      );
      setCategoryToDelete(null);
      await loadData();
    } catch (err) {
      error(
        err instanceof Error ? err.message : "Ocurrió un error inesperado.",
        "Eliminar categoría",
      );
    } finally {
      setDeleting(false);
    }
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
          Gestión de categorías
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
          <TextField
            sx={{ width: "40%" }}
            type="text"
            label="Buscar categoría por nombre"
            value={searchParam}
            onChange={(e) => setSearchParam(e.target.value)}
          />
          <Box sx={{ display: "flex", maxWidth: "40%", gap: "10px" }}>
            <IconButton onClick={loadData}>
              <Cached />
            </IconButton>
            <Button
              variant="contained"
              startIcon={<Add />}
              onClick={handleOpenCreate}
            >
              Nueva Categoría
            </Button>
          </Box>
        </Box>
        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell align="center">ID</TableCell>
                <TableCell align="center">Nombre</TableCell>
                <TableCell align="center">Descripción</TableCell>
                <TableCell align="center">Acciones</TableCell>
              </TableRow>
            </TableHead>

            <TableBody>
              {filteredCategories.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={4}>
                    <Typography color="text.secondary" sx={{ py: 3 }}>
                      No se encontraron categorías.
                    </Typography>
                  </TableCell>
                </TableRow>
              ) : (
                filteredCategories.map((category) => (
                  <AdminCategorySummary
                    key={category.id}
                    category={category}
                    onEdit={handleOpenEdit}
                    onDelete={setCategoryToDelete}
                  />
                ))
              )}
            </TableBody>
          </Table>
        </TableContainer>
      </Box>

      <AdminModalCategory
        open={modalOpen}
        category={editingCategory}
        onClose={() => setModalOpen(false)}
        onConfirm={handleConfirmCategory}
        loading={saving}
      />

      <Dialog
        open={Boolean(categoryToDelete)}
        onClose={() => setCategoryToDelete(null)}
      >
        <DialogTitle>Eliminar categoría</DialogTitle>
        <DialogContent>
          <DialogContentText>
            ¿Seguro que deseas eliminar la categoría "{categoryToDelete?.name}
            "? Si tiene productos asociados, no podrá eliminarse.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setCategoryToDelete(null)} disabled={deleting}>
            Cancelar
          </Button>
          <Button
            variant="contained"
            color="error"
            onClick={handleConfirmDelete}
            disabled={deleting}
          >
            {deleting ? "Eliminando..." : "Eliminar"}
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};
