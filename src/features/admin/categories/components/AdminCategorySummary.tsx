import { Box, Button, TableCell, TableRow, Typography } from "@mui/material";
import { Delete, Edit } from "@mui/icons-material";
import type { Category } from "../../../../types/Category";

type Props = {
  category: Category;
  onEdit: (category: Category) => void;
  onDelete: (category: Category) => void;
};

export const AdminCategorySummary = ({ category, onEdit, onDelete }: Props) => {
  return (
    <TableRow
      sx={{
        "&:last-child td, &:last-child th": {
          border: 0,
        },
      }}
    >
      <TableCell align="center">
        <Typography fontWeight={600}>{category.id}</Typography>
      </TableCell>

      <TableCell align="center">
        <Typography>{category.name}</Typography>
      </TableCell>

      <TableCell align="center">
        <Typography>{category.description}</Typography>
      </TableCell>

      <TableCell align="center">
        <Box
          sx={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            gap: 1,
            flexWrap: "wrap",
          }}
        >
          <Button
            size="small"
            variant="contained"
            color="warning"
            endIcon={<Edit />}
            onClick={() => onEdit(category)}
          >
            Editar
          </Button>
          <Button
            size="small"
            variant="contained"
            color="error"
            endIcon={<Delete />}
            onClick={() => onDelete(category)}
          >
            Eliminar
          </Button>
        </Box>
      </TableCell>
    </TableRow>
  );
};
