import { Box, Button, InputAdornment, TextField, Typography } from "@mui/material";
import { useEffect, useState } from "react";
import { useAuth } from "../../../hooks/useAuth";
import { useNotification } from "../../../hooks/useNotification";
import {
  getTaxSettingRequest,
  updateTaxSettingRequest,
} from "../../../services/TaxSettingService";

type Props = {};

export const AdminTaxSettings = (props: Props) => {
  const { token } = useAuth();
  const { error, success } = useNotification();
  const [ivaPercentage, setIvaPercentage] = useState<string>("");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  useEffect(() => {
    const loadSetting = async () => {
      try {
        const setting = await getTaxSettingRequest();
        setIvaPercentage(String(setting.ivaPercentage));
      } catch (err) {
        error(
          err instanceof Error ? err.message : "Ocurrió un error inesperado.",
          "Configuración de impuestos",
        );
      } finally {
        setLoading(false);
      }
    };
    loadSetting();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const value = Number(ivaPercentage);
  const errorText =
    ivaPercentage.trim() === "" || Number.isNaN(value) || value < 0 || value > 100
      ? "Ingresa un porcentaje entre 0 y 100."
      : "";

  const handleSubmit = async () => {
    setSubmitted(true);
    if (!token || errorText) return;

    setSaving(true);
    try {
      const updated = await updateTaxSettingRequest({ ivaPercentage: value }, token);
      setIvaPercentage(String(updated.ivaPercentage));
      success("El porcentaje de IVA se actualizó correctamente.", "Configuración de impuestos");
    } catch (err) {
      error(
        err instanceof Error ? err.message : "Ocurrió un error inesperado.",
        "Configuración de impuestos",
      );
    } finally {
      setSaving(false);
    }
  };

  return (
    <Box
      sx={{
        maxWidth: 420,
        mx: "auto",
        p: 4,
        display: "flex",
        flexDirection: "column",
        gap: 2,
      }}
    >
      <Typography variant="h1" fontWeight={500} sx={{ textAlign: "center" }}>
        Configuración de impuestos
      </Typography>

      <Typography variant="body2" color="text.secondary">
        Este porcentaje de IVA se aplica sobre el subtotal (ya descontado el
        cupón, si aplica) de cada orden nueva que se cree.
      </Typography>

      <TextField
        label="Porcentaje de IVA"
        type="number"
        value={ivaPercentage}
        onChange={(e) => setIvaPercentage(e.target.value)}
        error={submitted && Boolean(errorText)}
        helperText={submitted ? errorText : undefined}
        disabled={loading}
        InputProps={{
          endAdornment: <InputAdornment position="end">%</InputAdornment>,
        }}
        inputProps={{ min: 0, max: 100, step: "0.01" }}
      />

      <Button variant="contained" onClick={handleSubmit} disabled={loading || saving}>
        {saving ? "Guardando..." : "Guardar cambios"}
      </Button>
    </Box>
  );
};
