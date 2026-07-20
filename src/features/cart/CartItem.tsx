import { Box, Button, IconButton, Typography } from "@mui/material";
import type { Product } from "../../types/Product";
import { useCart } from "../../hooks/useCart";
import { Preview, RemoveShoppingCart, Add, Remove } from "@mui/icons-material";
import { useNavigate } from "react-router-dom";

type Props = {
  product: Product;
  quantity: number;
};

export const CartItem = (props: Props) => {
  const { deleteProduct, changeQuantity } = useCart();
  const navigate = useNavigate();
  return (
    <Box
      className="CartItemContainer"
      sx={{
        display: "flex",
        padding: "10px",
        flexDirection: "column",
        gap: "20px",
        justifyContent: "center",
        alignItems: "center",
        border: "1px solid black",
      }}
    >
      <Box
        className="CartItemInfo"
        sx={{
          display: "flex",
          flexDirection: {
            xs: "column",
            sm: "row",
          },
          gap: "20px",
          alignItems: "center",
        }}
      >
        <Box
          sx={{
            display: "grid",
            gridTemplateColumns: "auto auto",
            columnGap: "12px",
            rowGap: "8px",
          }}
        >
          <Box
            component="img"
            sx={{
              width: "auto",
              maxWidth: "100px",
              height: "auto",
              maxHeight: "100px",
              display: "block",
            }}
            src={props.product?.images[0].url}
            alt="imagen principal del producto"
          ></Box>
        </Box>
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            gap: "5px",
          }}
        >
          <Typography sx={{ fontWeight: 700 }}>{props.product.name}</Typography>
          <Box
            sx={{
              display: "grid",
              gridTemplateColumns: "auto auto",
              columnGap: "12px",
              rowGap: "8px",
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <Typography sx={{ fontWeight: 500 }}>Precio</Typography>
            <Typography>{props.product.price}</Typography>
            <Typography sx={{ fontWeight: 500 }}>Cantidad</Typography>
            <Box
              sx={{
                display: "flex",
                flexDirection: "row",
                justifyContent: "center",
                alignItems: "center",
                gap: "5px",
              }}
            >
              <IconButton
                onClick={() => {
                  changeQuantity(props.product.id, props.quantity - 1);
                }}
                disabled={props.quantity <= 1}
              >
                <Remove />
              </IconButton>
              <Typography>{props.quantity}</Typography>
              <IconButton
                onClick={() => {
                  changeQuantity(props.product.id, props.quantity + 1);
                }}
                disabled={props.quantity >= props.product.quantity}
              >
                <Add />
              </IconButton>
            </Box>
            <Typography sx={{ fontWeight: 500 }}>Subtotal</Typography>
            <Typography>
              ${(props.product.price * props.quantity).toFixed(2)}
            </Typography>
          </Box>
        </Box>
      </Box>
      <Box
        className="CartItemActions"
        sx={{
          display: "flex",
          flexDirection: "row",
          flexWrap: "wrap",
          gap: "10px",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <Button
          variant="contained"
          color="info"
          endIcon={<Preview />}
          onClick={() => {
            navigate(`/products/${props.product.id}`);
          }}
        >
          Ver producto
        </Button>
        <Button
          variant="contained"
          color="error"
          endIcon={<RemoveShoppingCart />}
          onClick={() => {
            deleteProduct(props.product.id);
          }}
        >
          Quitar
        </Button>
      </Box>
    </Box>
  );
};
