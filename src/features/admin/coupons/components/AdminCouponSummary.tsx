import { Block } from "@mui/icons-material";
import { Button, Chip, TableCell, TableRow, Tooltip, Typography } from "@mui/material";
import { DiscountType, DiscountTypeName, type CouponDto } from "../../../../types/Coupon";

type Props = {
  coupon: CouponDto;
  onDeactivate: (coupon: CouponDto) => void;
};

export const AdminCouponSummary = ({ coupon, onDeactivate }: Props) => {
  const isExpired = new Date(coupon.expirationDate) <= new Date();
  const isExhausted =
    coupon.usageLimit !== null && coupon.usedCount >= coupon.usageLimit;

  const statusLabel = !coupon.isActive
    ? "Desactivado"
    : isExpired
      ? "Expirado"
      : isExhausted
        ? "Agotado"
        : "Activo";
  const statusColor = statusLabel === "Activo" ? "success" : "default";

  return (
    <TableRow sx={{ "&:last-child td, &:last-child th": { border: 0 } }}>
      <TableCell align="center">
        <Typography fontWeight={600}>{coupon.code}</Typography>
      </TableCell>

      <TableCell align="center">{DiscountTypeName[coupon.type]}</TableCell>

      <TableCell align="center">
        {coupon.type === DiscountType.Percentage
          ? `${coupon.discountValue}%`
          : `$${coupon.discountValue.toFixed(2)}`}
      </TableCell>

      <TableCell align="center">
        {new Date(coupon.expirationDate).toLocaleDateString()}
      </TableCell>

      <TableCell align="center">
        {coupon.usedCount}
        {coupon.usageLimit !== null ? ` / ${coupon.usageLimit}` : " / ∞"}
      </TableCell>

      <TableCell align="center">
        <Tooltip title={coupon.requiredProducts.map((p) => p.name).join(", ")}>
          <Typography noWrap sx={{ maxWidth: 160, mx: "auto" }}>
            {coupon.requiredProducts.length} producto
            {coupon.requiredProducts.length === 1 ? "" : "s"}
          </Typography>
        </Tooltip>
      </TableCell>

      <TableCell align="center">
        <Chip label={statusLabel} color={statusColor} size="small" />
      </TableCell>

      <TableCell align="center">
        <Button
          size="small"
          variant="contained"
          color="error"
          endIcon={<Block />}
          disabled={!coupon.isActive}
          onClick={() => onDeactivate(coupon)}
        >
          Desactivar
        </Button>
      </TableCell>
    </TableRow>
  );
};
