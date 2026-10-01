import {
  Box,
  Button,
  CircularProgress,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Divider,
  TextField,
  Typography,
} from "@mui/material";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../hooks/useAuth";
import { useNotification } from "../../hooks/useNotification";
import {
  deleteMyAccountRequest,
  getMyProfileRequest,
  updateMyProfileRequest,
} from "../../services/UserService";
import type { EditUserDto } from "../../types/User";

const PASSWORD_PATTERN = /^(?=.*[a-z])(?=.*[A-Z])(?=.*[&*])[A-Za-z\d&*]{12,20}$/;

type FormState = {
  firstName: string;
  lastName: string;
  email: string;
  newPassword: string;
  confirmPassword: string;
};

type Props = {};

export const Profile = (props: Props) => {
  const { token, updateProfile, logout } = useAuth();
  const { error, success } = useNotification();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [confirmDelete, setConfirmDelete] = useState(false);
  const [userId, setUserId] = useState<number | null>(null);
  const [form, setForm] = useState<FormState>({
    firstName: "",
    lastName: "",
    email: "",
    newPassword: "",
    confirmPassword: "",
  });

  useEffect(() => {
    const loadProfile = async () => {
      if (!token) return;
      try {
        const profile = await getMyProfileRequest(token);
        setUserId(profile.id);
        setForm((current) => ({
          ...current,
          firstName: profile.firstName,
          lastName: profile.lastName,
          email: profile.email,
        }));
      } catch (err) {
        error(
          err instanceof Error ? err.message : "Ocurrió un error inesperado.",
          "Obtener perfil",
        );
      } finally {
        setLoading(false);
      }
    };
    loadProfile();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [token]);

  const setField = <K extends keyof FormState>(key: K, value: FormState[K]) =>
    setForm((current) => ({ ...current, [key]: value }));

  const wantsPasswordChange = form.newPassword.trim().length > 0;

  const errors = {
    firstName:
      form.firstName.trim().length < 3 || form.firstName.trim().length > 100
        ? "El nombre debe tener entre 3 y 100 caracteres."
        : "",
    lastName:
      form.lastName.trim().length < 2 || form.lastName.trim().length > 100
        ? "El apellido debe tener entre 2 y 100 caracteres."
        : "",
    email: !/^\S+@\S+\.\S+$/.test(form.email.trim())
      ? "Ingresa un correo válido."
      : "",
    newPassword:
      wantsPasswordChange && !PASSWORD_PATTERN.test(form.newPassword)
        ? "Debe tener 12-20 caracteres, con mayúscula, minúscula y un carácter especial (& o *)."
        : "",
    confirmPassword:
      wantsPasswordChange && form.confirmPassword !== form.newPassword
        ? "Las contraseñas no coinciden."
        : "",
  };
  const hasErrors = Object.values(errors).some(Boolean);
  const show = (field: keyof typeof errors) => submitted && errors[field];

  const handleSubmit = async () => {
    setSubmitted(true);
    if (hasErrors || !token || userId === null) return;

    setSaving(true);
    try {
      const dto: EditUserDto = {
        id: userId,
        firstName: form.firstName.trim(),
        lastName: form.lastName.trim(),
        email: form.email.trim(),
        password: wantsPasswordChange ? form.newPassword : undefined,
      };
      const updated = await updateMyProfileRequest(dto, token);
      updateProfile(updated.firstName, updated.lastName, updated.email);
      setForm((current) => ({ ...current, newPassword: "", confirmPassword: "" }));
      setSubmitted(false);
      success("Tu perfil se actualizó correctamente.", "Mi perfil");
    } catch (err) {
      error(
        err instanceof Error ? err.message : "Ocurrió un error inesperado.",
        "Mi perfil",
      );
    } finally {
      setSaving(false);
    }
  };

  const handleConfirmDelete = async () => {
    if (!token) return;
    setDeleting(true);
    try {
      await deleteMyAccountRequest(token);
      setConfirmDelete(false);
      await logout();
      navigate("/auth");
    } catch (err) {
      error(
        err instanceof Error ? err.message : "Ocurrió un error inesperado.",
        "Eliminar cuenta",
      );
    } finally {
      setDeleting(false);
    }
  };

  if (loading) {
    return (
      <Box
        sx={{
          minHeight: "60vh",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box
      sx={{
        maxWidth: 500,
        mx: "auto",
        p: 4,
        display: "flex",
        flexDirection: "column",
        gap: 2,
      }}
    >
      <Typography variant="h1" fontWeight={500} sx={{ textAlign: "center" }}>
        Mi perfil
      </Typography>

      <TextField
        label="Nombre"
        value={form.firstName}
        onChange={(e) => setField("firstName", e.target.value)}
        error={Boolean(show("firstName"))}
        helperText={show("firstName")}
        required
      />

      <TextField
        label="Apellido"
        value={form.lastName}
        onChange={(e) => setField("lastName", e.target.value)}
        error={Boolean(show("lastName"))}
        helperText={show("lastName")}
        required
      />

      <TextField
        label="Correo"
        type="email"
        value={form.email}
        onChange={(e) => setField("email", e.target.value)}
        error={Boolean(show("email"))}
        helperText={show("email")}
        required
      />

      <Divider sx={{ my: 1 }} />

      <Typography variant="body2" color="text.secondary">
        Deja los campos de contraseña vacíos si no quieres cambiarla.
      </Typography>

      <TextField
        label="Nueva contraseña"
        type="password"
        value={form.newPassword}
        onChange={(e) => setField("newPassword", e.target.value)}
        error={Boolean(show("newPassword"))}
        helperText={
          show("newPassword") ||
          "12-20 caracteres, con mayúscula, minúscula y un carácter especial (& o *)."
        }
      />

      <TextField
        label="Confirmar nueva contraseña"
        type="password"
        value={form.confirmPassword}
        onChange={(e) => setField("confirmPassword", e.target.value)}
        error={Boolean(show("confirmPassword"))}
        helperText={show("confirmPassword")}
      />

      <Button
        variant="contained"
        color="primary"
        onClick={handleSubmit}
        disabled={saving}
      >
        {saving ? "Guardando..." : "Guardar cambios"}
      </Button>

      <Divider sx={{ my: 2 }} />

      <Typography variant="h6" fontWeight={700} color="error">
        Zona de peligro
      </Typography>
      <Typography variant="body2" color="text.secondary">
        Eliminar tu cuenta es permanente. Si tienes órdenes registradas, no
        podrá eliminarse.
      </Typography>
      <Button
        variant="outlined"
        color="error"
        onClick={() => setConfirmDelete(true)}
      >
        Eliminar mi cuenta
      </Button>

      <Dialog open={confirmDelete} onClose={() => setConfirmDelete(false)}>
        <DialogTitle>Eliminar cuenta</DialogTitle>
        <DialogContent>
          <DialogContentText>
            ¿Seguro que deseas eliminar tu cuenta? Esta acción no se puede
            deshacer y cerrará tu sesión.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setConfirmDelete(false)} disabled={deleting}>
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
    </Box>
  );
};
