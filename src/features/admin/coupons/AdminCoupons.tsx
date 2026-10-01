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
  createCouponRequest,
  deactivateCouponRequest,
  getAllCouponsRequest,
} from "../../../services/CouponService";
import type { CouponDto, CreateCouponDto } from "../../../types/Coupon";
import { AdminCouponSummary } from "./components/AdminCouponSummary";
import { AdminModalCreateCoupon } from "./components/AdminModalCreateCoupon";

type Props = {};

export const AdminCoupons = (props: Props) => {
  const [coupons, setCoupons] = useState<CouponDto[] | null>(null);
  const { token } = useAuth();
  const { error, success } = useNotification();
  const [searchParam, setSearchParam] = useState<string>("");
  const [modalOpen, setModalOpen] = useState<boolean>(false);
  const [couponToDeactivate, setCouponToDeactivate] = useState<CouponDto | null>(null);
  const [saving, setSaving] = useState(false);
  const [deactivating, setDeactivating] = useState(false);

  const loadData = async () => {
    if (!token) return;
    try {
      const couponsData = await getAllCouponsRequest(token);
      setCoupons(couponsData);
    } catch (err) {
      error(
        err instanceof Error ? err.message : "Ocurrió un error inesperado.",
        "Obtener cupones",
      );
    }
  };

  useEffect(() => {
    loadData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [token]);

  const filteredCoupons = useMemo(() => {
    if (!coupons) return [];
    return coupons.filter(
      (c) =>
        searchParam.trim().length === 0 ||
        c.code.toLowerCase().includes(searchParam.trim().toLowerCase()),
    );
  }, [coupons, searchParam]);

  const handleConfirmCreate = async (dto: CreateCouponDto) => {
    if (!token) return;
    setSaving(true);
    try {
      const created = await createCouponRequest(dto, token);
      success(`Cupón "${created.code}" creado correctamente.`, "Crear cupón");
      setModalOpen(false);
      await loadData();
    } catch (err) {
      error(
        err instanceof Error ? err.message : "Ocurrió un error inesperado.",
        "Crear cupón",
      );
    } finally {
      setSaving(false);
    }
  };

  const handleConfirmDeactivate = async () => {
    if (!token || !couponToDeactivate) return;
    setDeactivating(true);
    try {
      await deactivateCouponRequest(couponToDeactivate.id, token);
      success(
        `Cupón "${couponToDeactivate.code}" desactivado correctamente.`,
        "Desactivar cupón",
      );
      setCouponToDeactivate(null);
      await loadData();
    } catch (err) {
      error(
        err instanceof Error ? err.message : "Ocurrió un error inesperado.",
        "Desactivar cupón",
      );
    } finally {
      setDeactivating(false);
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
          Gestión de cupones
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
            label="Buscar cupón por código"
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
              onClick={() => setModalOpen(true)}
            >
              Nuevo Cupón
            </Button>
          </Box>
        </Box>
        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell align="center">Código</TableCell>
                <TableCell align="center">Tipo</TableCell>
                <TableCell align="center">Valor</TableCell>
                <TableCell align="center">Vence</TableCell>
                <TableCell align="center">Usos</TableCell>
                <TableCell align="center">Productos</TableCell>
                <TableCell align="center">Estado</TableCell>
                <TableCell align="center">Acciones</TableCell>
              </TableRow>
            </TableHead>

            <TableBody>
              {filteredCoupons.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={8}>
                    <Typography color="text.secondary" sx={{ py: 3 }}>
                      No se encontraron cupones.
                    </Typography>
                  </TableCell>
                </TableRow>
              ) : (
                filteredCoupons.map((coupon) => (
                  <AdminCouponSummary
                    key={coupon.id}
                    coupon={coupon}
                    onDeactivate={setCouponToDeactivate}
                  />
                ))
              )}
            </TableBody>
          </Table>
        </TableContainer>
      </Box>

      <AdminModalCreateCoupon
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        onConfirm={handleConfirmCreate}
        loading={saving}
      />

      <Dialog
        open={Boolean(couponToDeactivate)}
        onClose={() => setCouponToDeactivate(null)}
      >
        <DialogTitle>Desactivar cupón</DialogTitle>
        <DialogContent>
          <DialogContentText>
            ¿Seguro que deseas desactivar el cupón "{couponToDeactivate?.code}
            "? No hay forma de reactivarlo desde el panel.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button
            onClick={() => setCouponToDeactivate(null)}
            disabled={deactivating}
          >
            Cancelar
          </Button>
          <Button
            variant="contained"
            color="error"
            onClick={handleConfirmDeactivate}
            disabled={deactivating}
          >
            {deactivating ? "Desactivando..." : "Desactivar"}
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};
