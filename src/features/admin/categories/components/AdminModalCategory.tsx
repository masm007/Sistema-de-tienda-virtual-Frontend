import {
  Box,
  Button,
  Modal,
  TextField,
  Typography,
} from "@mui/material";
import { useEffect, useState } from "react";
import type { Category, CreateCategoryDto } from "../../../../types/Category";

type FormState = {
  name: string;
  description: string;
};

const EMPTY_FORM: FormState = {
  name: "",
  description: "",
};

const categoryToForm = (category: Category): FormState => ({
  name: category.name,
  description: category.description,
});

type Props = {
  open: boolean;
  // Si viene, el modal edita esa categoría; si no, crea una nueva.
  category?: Category | null;
  onClose: () => void;
  onConfirm: (dto: CreateCategoryDto | Category) => void | Promise<void>;
  loading?: boolean;
};

const style = {
  display: "flex",
  flexDirection: "column",
  gap: 2,
  overflow: "auto",
  position: "absolute" as const,
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  maxHeight: "90vh",
  width: { xs: "90vw", sm: 450 },
  bgcolor: "background.paper",
  borderRadius: "16px",
  boxShadow: 24,
  p: 4,
};

export const AdminModalCategory = ({
  open,
  category,
  onClose,
  onConfirm,
  loading,
}: Props) => {
  const isEditMode = Boolean(category);
  const [form, setForm] = useState<FormState>(EMPTY_FORM);
  const [submitted, setSubmitted] = useState(false);

  useEffect(() => {
    if (!open) {
      setForm(EMPTY_FORM);
      setSubmitted(false);
      return;
    }
    setForm(category ? categoryToForm(category) : EMPTY_FORM);
  }, [open, category]);

  const setField = <K extends keyof FormState>(key: K, value: FormState[K]) =>
    setForm((current) => ({ ...current, [key]: value }));

  const errors = {
    name:
      form.name.trim().length < 3 || form.name.trim().length > 50
        ? "El nombre debe tener entre 3 y 50 caracteres."
        : "",
    description:
      form.description.trim().length < 20 ||
      form.description.trim().length > 100
        ? "La descripción debe tener entre 20 y 100 caracteres."
        : "",
  };
  const hasErrors = Object.values(errors).some(Boolean);
  const show = (field: keyof typeof errors) => submitted && errors[field];

  const handleSubmit = () => {
    setSubmitted(true);
    if (hasErrors) return;

    if (isEditMode && category) {
      const dto: Category = {
        id: category.id,
        name: form.name.trim(),
        description: form.description.trim(),
      };
      onConfirm(dto);
      return;
    }

    const dto: CreateCategoryDto = {
      name: form.name.trim(),
      description: form.description.trim(),
    };
    onConfirm(dto);
  };

  return (
    <Modal open={open} onClose={onClose}>
      <Box sx={style}>
        <Typography variant="h6" fontWeight={700} sx={{ mb: 2 }}>
          {isEditMode ? "Editar Categoría" : "Crear Categoría"}
        </Typography>

        <TextField
          label="Nombre de la categoría"
          value={form.name}
          onChange={(e) => setField("name", e.target.value)}
          error={Boolean(show("name"))}
          helperText={show("name")}
          required
        />

        <TextField
          label="Descripción"
          value={form.description}
          onChange={(e) => setField("description", e.target.value)}
          error={Boolean(show("description"))}
          helperText={show("description")}
          multiline
          minRows={3}
          required
        />

        <Box
          sx={{ display: "flex", justifyContent: "flex-end", gap: 1, mt: 1 }}
        >
          <Button onClick={onClose} disabled={loading}>
            Cancelar
          </Button>
          <Button
            variant="contained"
            color="primary"
            onClick={handleSubmit}
            disabled={loading}
          >
            {loading ? "Guardando..." : "Guardar cambios"}
          </Button>
        </Box>
      </Box>
    </Modal>
  );
};
