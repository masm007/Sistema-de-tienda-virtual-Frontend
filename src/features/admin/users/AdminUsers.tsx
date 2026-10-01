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
import { Cached } from "@mui/icons-material";
import { useEffect, useMemo, useState } from "react";
import { useAuth } from "../../../hooks/useAuth";
import { useNotification } from "../../../hooks/useNotification";
import { deleteUserRequest, getAllUsersRequest } from "../../../services/UserService";
import type { AdminUserDto } from "../../../types/User";
import { AdminUserSummary } from "./components/AdminUserSummary";

type Props = {};

export const AdminUsers = (props: Props) => {
  const [users, setUsers] = useState<AdminUserDto[] | null>(null);
  const { token, user: currentUser } = useAuth();
  const { error, success } = useNotification();
  const [searchParam, setSearchParam] = useState<string>("");
  const [userToDelete, setUserToDelete] = useState<AdminUserDto | null>(null);
  const [deleting, setDeleting] = useState(false);

  const loadData = async () => {
    if (!token) return;
    try {
      const usersData = await getAllUsersRequest(token);
      setUsers(usersData);
    } catch (err) {
      error(
        err instanceof Error ? err.message : "Ocurrió un error inesperado.",
        "Obtener usuarios",
      );
    }
  };

  useEffect(() => {
    loadData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [token]);

  const filteredUsers = useMemo(() => {
    if (!users) return [];
    const term = searchParam.trim().toLowerCase();
    if (term.length === 0) return users;
    return users.filter(
      (u) =>
        `${u.firstName} ${u.lastName}`.toLowerCase().includes(term) ||
        u.email.toLowerCase().includes(term),
    );
  }, [users, searchParam]);

  const handleConfirmDelete = async () => {
    if (!token || !userToDelete) return;
    setDeleting(true);
    try {
      await deleteUserRequest(userToDelete.id, token);
      success(
        `Usuario "${userToDelete.firstName} ${userToDelete.lastName}" eliminado correctamente.`,
        "Eliminar usuario",
      );
      setUserToDelete(null);
      await loadData();
    } catch (err) {
      error(
        err instanceof Error ? err.message : "Ocurrió un error inesperado.",
        "Eliminar usuario",
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
          Gestión de usuarios
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
            label="Buscar por nombre o correo"
            value={searchParam}
            onChange={(e) => setSearchParam(e.target.value)}
          />
          <IconButton onClick={loadData}>
            <Cached />
          </IconButton>
        </Box>
        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell align="center">ID</TableCell>
                <TableCell align="center">Nombre</TableCell>
                <TableCell align="center">Correo</TableCell>
                <TableCell align="center">Rol</TableCell>
                <TableCell align="center">Acciones</TableCell>
              </TableRow>
            </TableHead>

            <TableBody>
              {filteredUsers.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={5}>
                    <Typography color="text.secondary" sx={{ py: 3 }}>
                      No se encontraron usuarios.
                    </Typography>
                  </TableCell>
                </TableRow>
              ) : (
                filteredUsers.map((u) => (
                  <AdminUserSummary
                    key={u.id}
                    user={u}
                    isSelf={
                      currentUser?.email.toLowerCase() === u.email.toLowerCase()
                    }
                    onDelete={setUserToDelete}
                  />
                ))
              )}
            </TableBody>
          </Table>
        </TableContainer>
      </Box>

      <Dialog open={Boolean(userToDelete)} onClose={() => setUserToDelete(null)}>
        <DialogTitle>Eliminar usuario</DialogTitle>
        <DialogContent>
          <DialogContentText>
            ¿Seguro que deseas eliminar a "{userToDelete?.firstName}{" "}
            {userToDelete?.lastName}" ({userToDelete?.email})? Es una
            eliminación permanente. Si tiene órdenes registradas, no podrá
            eliminarse.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setUserToDelete(null)} disabled={deleting}>
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
