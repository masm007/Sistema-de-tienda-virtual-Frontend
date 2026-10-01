import {
  Box,
  Button,
  FormControl,
  FormControlLabel,
  FormHelperText,
  IconButton,
  InputAdornment,
  InputLabel,
  MenuItem,
  Modal,
  OutlinedInput,
  Select,
  Switch,
  TextField,
  Typography,
} from "@mui/material";
import { Close } from "@mui/icons-material";
import { useEffect, useRef, useState, type ChangeEvent } from "react";
import { Gallery } from "../../../../assets/components/ui/Gallery";
import { useNotification } from "../../../../hooks/useNotification";
import { getCategoriesRequest } from "../../../../services/CategoryService";
import { getTaxSettingRequest } from "../../../../services/TaxSettingService";
import type { Category } from "../../../../types/Category";
import type {
  CreateProductDto,
  Product,
  UpdateProductDto,
} from "../../../../types/Product";

const MAX_PRODUCT_IMAGES = 5;
const SKU_PATTERN = /^[A-Z]{3,10}-[A-Z0-9]{3,20}-\d{3,5}$/;

type ExistingImage = {
  kind: "existing";
  id: number;
  url: string;
};

type NewImage = {
  kind: "new";
  file: File;
  previewUrl: string;
};

type ImageItem = ExistingImage | NewImage;

type FormState = {
  name: string;
  description: string;
  categoryId: number | "";
  sku: string;
  quantity: string;
  price: string;
  isAvailable: boolean;
  isActive: boolean;
};

const EMPTY_FORM: FormState = {
  name: "",
  description: "",
  categoryId: "",
  sku: "",
  quantity: "",
  price: "",
  isAvailable: true,
  isActive: true,
};

const productToForm = (product: Product): FormState => ({
  name: product.name,
  description: product.description,
  categoryId: product.category.id,
  sku: product.sku,
  quantity: String(product.quantity),
  price: String(product.price),
  isAvailable: product.isAvailable,
  isActive: product.isActive,
});

type Props = {
  open: boolean;
  // Si viene, el modal edita ese producto; si no, crea uno nuevo.
  product?: Product | null;
  onClose: () => void;
  onConfirm: (dto: CreateProductDto | UpdateProductDto) => void | Promise<void>;
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
  width: { xs: "90vw", sm: 450, md: 600 },
  bgcolor: "background.paper",
  borderRadius: "16px",
  boxShadow: 24,
  p: 4,
};

export const AdminModalCreateProduct = ({
  open,
  product,
  onClose,
  onConfirm,
  loading,
}: Props) => {
  const { warning, error } = useNotification();
  const isEditMode = Boolean(product);
  const [form, setForm] = useState<FormState>(EMPTY_FORM);
  const [categories, setCategories] = useState<Category[]>([]);
  const [ivaPercentage, setIvaPercentage] = useState<number | null>(null);
  const [images, setImages] = useState<ImageItem[]>([]);
  const [submitted, setSubmitted] = useState(false);
  const imagesRef = useRef<ImageItem[]>([]);

  useEffect(() => {
    imagesRef.current = images;
  }, [images]);

  const revokeNewImages = (items: ImageItem[]) => {
    items.forEach((img) => {
      if (img.kind === "new") URL.revokeObjectURL(img.previewUrl);
    });
  };

  useEffect(() => {
    if (!open) {
      revokeNewImages(imagesRef.current);
      setImages([]);
      setForm(EMPTY_FORM);
      setSubmitted(false);
      return;
    }
    setForm(product ? productToForm(product) : EMPTY_FORM);
    setImages(
      product
        ? product.images.map((img) => ({
            kind: "existing" as const,
            id: img.id,
            url: img.url,
          }))
        : [],
    );
    const loadCategories = async () => {
      try {
        setCategories(await getCategoriesRequest());
      } catch (err) {
        error(
          err instanceof Error ? err.message : "Ocurrió un error inesperado.",
          "Obtener categorías",
        );
      }
    };
    loadCategories();
    // Si falla, simplemente no se muestra la vista previa de precio con IVA
    getTaxSettingRequest()
      .then((setting) => setIvaPercentage(setting.ivaPercentage))
      .catch(() => setIvaPercentage(null));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open, product]);

  useEffect(() => {
    return () => {
      revokeNewImages(imagesRef.current);
    };
  }, []);

  const setField = <K extends keyof FormState>(key: K, value: FormState[K]) =>
    setForm((current) => ({ ...current, [key]: value }));

  const sku = form.sku.trim().toUpperCase();
  const quantity = Number(form.quantity);
  const price = Number(form.price);

  const errors = {
    name:
      form.name.trim().length < 5 || form.name.trim().length > 50
        ? "El nombre debe tener entre 5 y 50 caracteres."
        : "",
    description:
      form.description.trim().length < 20 ||
      form.description.trim().length > 100
        ? "La descripción debe tener entre 20 y 100 caracteres."
        : "",
    categoryId: form.categoryId === "" ? "Selecciona una categoría." : "",
    sku: !SKU_PATTERN.test(sku)
      ? "Formato inválido. Debe ser CATEGORIA-PRODUCTO-NUMERO, ej: ELEC-MOUSE-001."
      : "",
    quantity:
      !Number.isInteger(quantity) || quantity < 1
        ? "La cantidad debe ser un entero mayor o igual a 1."
        : "",
    price: form.price === "" || price < 0 ? "Ingresa un precio válido." : "",
    images: images.length === 0 ? "Agrega al menos una imagen." : "",
  };
  const hasErrors = Object.values(errors).some(Boolean);
  const show = (field: keyof typeof errors) => submitted && errors[field];

  const handleFilesSelected = (e: ChangeEvent<HTMLInputElement>) => {
    const selected = Array.from(e.target.files ?? []);
    e.target.value = "";
    if (selected.length === 0) return;

    const available = MAX_PRODUCT_IMAGES - images.length;
    if (selected.length > available) {
      warning(
        `Solo puedes subir hasta ${MAX_PRODUCT_IMAGES} imágenes por producto.`,
        "Imágenes del producto",
      );
    }
    const accepted = selected.slice(0, Math.max(0, available));
    setImages((current) => [
      ...current,
      ...accepted.map(
        (file): ImageItem => ({
          kind: "new",
          file,
          previewUrl: URL.createObjectURL(file),
        }),
      ),
    ]);
  };

  const handleRemoveImage = (target: ImageItem) => {
    if (target.kind === "new") URL.revokeObjectURL(target.previewUrl);
    setImages((current) => current.filter((img) => img !== target));
  };

  const handleSubmit = () => {
    setSubmitted(true);
    if (hasErrors || form.categoryId === "") return;

    const newFiles = images
      .filter((img): img is NewImage => img.kind === "new")
      .map((img) => img.file);

    if (isEditMode && product) {
      const keepImageIds = images
        .filter((img): img is ExistingImage => img.kind === "existing")
        .map((img) => img.id);
      const dto: UpdateProductDto = {
        id: product.id,
        name: form.name.trim(),
        description: form.description.trim(),
        categoryId: form.categoryId,
        price,
        sku,
        quantity,
        isAvailable: form.isAvailable,
        isActive: form.isActive,
        keepImageIds,
        newImages: newFiles,
      };
      onConfirm(dto);
      return;
    }

    const dto: CreateProductDto = {
      name: form.name.trim(),
      description: form.description.trim(),
      categoryId: form.categoryId,
      price,
      sku,
      quantity,
      images: newFiles,
    };
    onConfirm(dto);
  };

  return (
    <Modal open={open} onClose={onClose}>
      <Box sx={style}>
        <Typography variant="h6" fontWeight={700} sx={{ mb: 2 }}>
          {isEditMode ? "Editar Producto" : "Crear Producto"}
        </Typography>

        <TextField
          label="Nombre del producto"
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
          minRows={2}
          required
        />

        <FormControl fullWidth required error={Boolean(show("categoryId"))}>
          <InputLabel id="category-label">Categoría</InputLabel>
          <Select
            labelId="category-label"
            label="Categoría"
            value={form.categoryId}
            onChange={(e) => setField("categoryId", Number(e.target.value))}
          >
            {categories.map((category) => (
              <MenuItem key={category.id} value={category.id}>
                {category.name}
              </MenuItem>
            ))}
          </Select>
          {show("categoryId") && (
            <FormHelperText>{errors.categoryId}</FormHelperText>
          )}
        </FormControl>

        <TextField
          label="Sku"
          value={form.sku}
          onChange={(e) => setField("sku", e.target.value)}
          placeholder="ELEC-MOUSE-001"
          error={Boolean(show("sku"))}
          helperText={
            show("sku") ||
            "Formato: CATEGORIA-PRODUCTO-NUMERO (Ej: ELEC-MOUSE-001). Letras y números, sin espacios ni tildes; el número lleva de 3 a 5 dígitos."
          }
          required
        />

        <TextField
          label="Cantidad en stock"
          type="number"
          value={form.quantity}
          onChange={(e) => setField("quantity", e.target.value)}
          error={Boolean(show("quantity"))}
          helperText={show("quantity")}
          inputProps={{ min: 1, step: 1 }}
          required
        />

        <FormControl fullWidth required error={Boolean(show("price"))}>
          <InputLabel htmlFor="precio">Precio de venta</InputLabel>
          <OutlinedInput
            id="precio"
            type="number"
            value={form.price}
            onChange={(e) => setField("price", e.target.value)}
            startAdornment={<InputAdornment position="start">$</InputAdornment>}
            label="Precio de venta"
            inputProps={{ min: 0, step: "0.01" }}
          />
          {show("price") && <FormHelperText>{errors.price}</FormHelperText>}
        </FormControl>

        {ivaPercentage !== null && form.price.trim() !== "" && !Number.isNaN(price) && price >= 0 && (
          <Typography variant="body2" color="text.secondary" sx={{ mt: -1 }}>
            Precio publicado con IVA ({ivaPercentage}%): $
            {(price * (1 + ivaPercentage / 100)).toFixed(2)}
          </Typography>
        )}

        {isEditMode && (
          <Box sx={{ display: "flex", gap: 2, flexWrap: "wrap" }}>
            <FormControlLabel
              control={
                <Switch
                  checked={form.isAvailable}
                  onChange={(e) => setField("isAvailable", e.target.checked)}
                />
              }
              label="Disponible"
            />
            <FormControlLabel
              control={
                <Switch
                  checked={form.isActive}
                  onChange={(e) => setField("isActive", e.target.checked)}
                />
              }
              label="Activo"
            />
          </Box>
        )}

        <Button
          component="label"
          variant="outlined"
          color={show("images") ? "error" : "primary"}
          disabled={images.length >= MAX_PRODUCT_IMAGES}
        >
          Agregar imágenes ({images.length}/{MAX_PRODUCT_IMAGES})
          <input
            type="file"
            accept="image/*"
            multiple
            hidden
            onChange={handleFilesSelected}
          />
        </Button>
        {show("images") && (
          <FormHelperText error sx={{ mt: -1 }}>
            {errors.images}
          </FormHelperText>
        )}

        <Gallery
          lista={images}
          itemsPerView={2}
          renderItem={(img) => (
            <Box sx={{ position: "relative", width: 140, height: 140 }}>
              <Box
                component="img"
                src={img.kind === "existing" ? img.url : img.previewUrl}
                alt={img.kind === "existing" ? "Imagen del producto" : img.file.name}
                sx={{
                  width: "100%",
                  height: "100%",
                  objectFit: "cover",
                  borderRadius: 2,
                }}
              />
              <IconButton
                size="small"
                onClick={() => handleRemoveImage(img)}
                sx={{
                  position: "absolute",
                  top: 4,
                  right: 4,
                  bgcolor: "rgba(255,255,255,0.85)",
                  "&:hover": { bgcolor: "white" },
                }}
              >
                <Close fontSize="small" />
              </IconButton>
            </Box>
          )}
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
