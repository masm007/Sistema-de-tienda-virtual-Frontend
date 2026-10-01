import { Modal, Box, Typography, Button, Select, MenuItem, type SelectChangeEvent } from "@mui/material";
import { useState } from "react";
import  { OrderStatus, OrderStatusName } from "../../../../types/Order";

type Props = {
  open: boolean;
  currentStatus: OrderStatus;
  onClose: () => void;
  onConfirm: (newStatus: OrderStatus) => void;
  loading?: boolean;
};

const style = {
  position: "absolute" as const,
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: 360,
  bgcolor: "background.paper",
  borderRadius: "16px",
  boxShadow: 24,
  p: 4,
};

export const ModalStateChange = ({ open, currentStatus, onClose, onConfirm, loading }: Props) => {
  const [selected, setSelected] = useState<OrderStatus>(currentStatus);

  const handleChange = (e: SelectChangeEvent<number>) => {
    setSelected(Number(e.target.value) as OrderStatus);
  };

  return (
    <Modal open={open} onClose={onClose}>
      <Box sx={style}>
        <Typography variant="h6" fontWeight={700} sx={{ mb: 2 }}>
          Cambiar estado de la orden
        </Typography>

        <Select fullWidth value={selected} onChange={handleChange} sx={{ mb: 3 }}>
          {Object.values(OrderStatus)
            .filter((v) => typeof v === "number")
            .map((status) => (
              <MenuItem key={status} value={status}>
                {OrderStatusName[status as OrderStatus]}
              </MenuItem>
            ))}
        </Select>

        <Box sx={{ display: "flex", justifyContent: "flex-end", gap: 1 }}>
          <Button onClick={onClose} disabled={loading}>
            Cancelar
          </Button>
          <Button
            variant="contained"
            color="primary"
            onClick={() => onConfirm(selected)}
            disabled={loading || selected === currentStatus}
          >
            {loading ? "Guardando..." : "Guardar cambios"}
          </Button>
        </Box>
      </Box>
    </Modal>
  );
};