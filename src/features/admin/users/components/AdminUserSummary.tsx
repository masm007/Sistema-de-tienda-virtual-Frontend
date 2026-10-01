import { Chip, TableCell, TableRow, Tooltip, IconButton } from "@mui/material";
import { Delete } from "@mui/icons-material";
import { UserRole, type AdminUserDto } from "../../../../types/User";

type Props = {
  user: AdminUserDto;
  isSelf: boolean;
  onDelete: (user: AdminUserDto) => void;
};

export const AdminUserSummary = ({ user, isSelf, onDelete }: Props) => {
  return (
    <TableRow sx={{ "&:last-child td, &:last-child th": { border: 0 } }}>
      <TableCell align="center">{user.id}</TableCell>
      <TableCell align="center">
        {user.firstName} {user.lastName}
      </TableCell>
      <TableCell align="center">{user.email}</TableCell>
      <TableCell align="center">
        <Chip
          label={user.role === UserRole.Admin ? "Administrador" : "Usuario"}
          color={user.role === UserRole.Admin ? "primary" : "default"}
          size="small"
        />
      </TableCell>
      <TableCell align="center">
        <Tooltip
          title={isSelf ? "No puedes eliminar tu propia cuenta desde aquí" : "Eliminar"}
        >
          <span>
            <IconButton
              color="error"
              disabled={isSelf}
              onClick={() => onDelete(user)}
            >
              <Delete />
            </IconButton>
          </span>
        </Tooltip>
      </TableCell>
    </TableRow>
  );
};
