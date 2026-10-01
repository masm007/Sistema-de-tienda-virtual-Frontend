import {
  Box,
  Button,
  Checkbox,
  FormControl,
  FormHelperText,
  InputLabel,
  ListItemText,
  MenuItem,
  Modal,
  Select,
  TextField,
  Typography,
  type SelectChangeEvent,
} from "@mui/material";
import { useEffect, useState } from "react";
import { useAuth } from "../../../../hooks/useAuth";
import { useNotification } from "../../../../hooks/useNotification";
import { getAllProductsRequest } from "../../../../services/ProductService";
import {
  DiscountType,
  DiscountTypeName,
  type CreateCouponDto,
} from "../../../../types/Coupon";
import type { Product } from "../../../../types/Product";

type FormState = {
  code: string;
  type: DiscountType;
  discountValue: string;
  expirationDate: string;
  usageLimit: string;
  productIds: number[];
};

const EMPTY_FORM: FormState = {
  code: "",
  type: DiscountType.Percentage,
  discountValue: "",
  expirationDate: "",
  usageLimit: "",
  productIds: [],
};

type Props = {
  open: boolean;
  onClose: () => void;
  onConfirm: (dto: CreateCouponDto) => void | Promise<void>;
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
  width: { xs: "90vw", sm: 450, md: 550 },
  bgcolor: "background.paper",
  borderRadius: "16px",
  boxShadow: 24,
  p: 4,
};

export const AdminModalCreateCoupon = ({
  open,
  onClose,
  onConfirm,
  loading,
}: Props) => {
  const { token } = useAuth();
  const { error } = useNotification();
  const [form, setForm] = useState<FormState>(EMPTY_FORM);
  const [products, setProducts] = useState<Product[]>([]);
  const [submitted, setSubmitted] = useState(false);

  useEffect(() => {
    if (!open) {
      setForm(EMPTY_FORM);
      setSubmitted(false);
      return;
    }
    const loadProducts = async () => {
      if (!token) return;
      try {
        setProducts(await getAllProductsRequest(token));
      } catch (err) {
        error(
          err instanceof Error ? err.message : "Ocurrió un error inesperado.",
          "Obtener productos",
        );
      }
    };
    loadProducts();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open]);

  const setField = <K extends keyof FormState>(key: K, value: FormState[K]) =>
    setForm((current) => ({ ...current, [key]: value }));

  const code = form.code.trim().toUpperCase();
  const discountValue = Number(form.discountValue);
  const usageLimit = form.usageLimit.trim() === "" ? null : Number(form.usageLimit);
  const isPercentage = form.type === DiscountType.Percentage;

  const errors = {
    code:
      code.length < 3 || code.length > 30
        ? "El código debe tener entre 3 y 30 caracteres."
        : "",
    discountValue: isPercentage
      ? discountValue < 1 || discountValue > 100
        ? "El porcentaje debe estar entre 1 y 100."
        : ""
      : discountValue < 0.01
        ? "El monto debe ser mayor a 0."
        : "",
    expirationDate:
      form.expirationDate === "" ||
      new Date(`${form.expirationDate}T23:59:59`) <= new Date()
        ? "La fecha de expiración debe ser futura."
        : "",
    usageLimit:
      usageLimit !== null && (!Number.isInteger(usageLimit) || usageLimit <= 0)
        ? "El límite de usos debe ser un entero mayor a cero."
        : "",
    productIds:
      form.productIds.length === 0
        ? "Selecciona al menos un producto."
        : "",
  };
  const hasErrors = Object.values(errors).some(Boolean);
  const show = (field: keyof typeof errors) => submitted && errors[field];

  const handleProductsChange = (e: SelectChangeEvent<number[]>) => {
    const value = e.target.value;
    setField(
      "productIds",
      typeof value === "string" ? value.split(",").map(Number) : value,
    );
  };

  const handleSubmit = () => {
    setSubmitted(true);
    if (hasErrors) return;

    const dto: CreateCouponDto = {
      code,
      type: form.type,
      discountValue,
      expirationDate: new Date(`${form.expirationDate}T23:59:59`).toISOString(),
      usageLimit,
      productIds: form.productIds,
    };
    onConfirm(dto);
  };

  return (
    <Modal open={open} onClose={onClose}>
      <Box sx={style}>
        <Typography variant="h6" fontWeight={700} sx={{ mb: 2 }}>
          Crear Cupón
        </Typography>

        <TextField
          label="Código"
          value={form.code}
          onChange={(e) => setField("code", e.target.value)}
          placeholder="VERANO2026"
          error={Boolean(show("code"))}
          helperText={show("code")}
          required
        />

        <FormControl fullWidth>
          <InputLabel id="discount-type-label">Tipo de descuento</InputLabel>
          <Select
            labelId="discount-type-label"
            label="Tipo de descuento"
            value={form.type}
            onChange={(e) => setField("type", Number(e.target.value) as DiscountType)}
          >
            {Object.values(DiscountType)
              .filter((v): v is DiscountType => typeof v === "number")
              .map((type) => (
                <MenuItem key={type} value={type}>
                  {DiscountTypeName[type]}
                </MenuItem>
              ))}
          </Select>
        </FormControl>

        <TextField
          label={isPercentage ? "Porcentaje de descuento" : "Monto de descuento"}
          type="number"
          value={form.discountValue}
          onChange={(e) => setField("discountValue", e.target.value)}
          error={Boolean(show("discountValue"))}
          helperText={show("discountValue")}
          inputProps={isPercentage ? { min: 1, max: 100, step: 1 } : { min: 0.01, step: "0.01" }}
          required
        />

        <TextField
          label="Fecha de expiración"
          type="date"
          value={form.expirationDate}
          onChange={(e) => setField("expirationDate", e.target.value)}
          error={Boolean(show("expirationDate"))}
          helperText={show("expirationDate") || "El cupón es válido hasta el final de ese día."}
          InputLabelProps={{ shrink: true }}
          required
        />

        <TextField
          label="Límite de usos (opcional)"
          type="number"
          value={form.usageLimit}
          onChange={(e) => setField("usageLimit", e.target.value)}
          error={Boolean(show("usageLimit"))}
          helperText={show("usageLimit") || "Déjalo vacío para uso ilimitado."}
          inputProps={{ min: 1, step: 1 }}
        />

        <FormControl fullWidth error={Boolean(show("productIds"))}>
          <InputLabel id="products-label">Productos requeridos</InputLabel>
          <Select
            labelId="products-label"
            label="Productos requeridos"
            multiple
            value={form.productIds}
            onChange={handleProductsChange}
            renderValue={(selected) =>
              products
                .filter((p) => selected.includes(p.id))
                .map((p) => p.name)
                .join(", ")
            }
          >
            {products.map((product) => (
              <MenuItem key={product.id} value={product.id}>
                <Checkbox checked={form.productIds.includes(product.id)} />
                <ListItemText primary={product.name} secondary={product.sku} />
              </MenuItem>
            ))}
          </Select>
          <FormHelperText>
            {show("productIds") ||
              "El descuento solo se calcula sobre estos productos cuando están en el carrito."}
          </FormHelperText>
        </FormControl>

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
