import { Button, Typography, Box } from "@mui/material";
import foto from "../../assets/images/tiendaVirtual.png";
import { InformationChip } from "../../components/ui/InformationChip";
import { ShoppingCart, More } from "@mui/icons-material";
import type { Product } from "../../types/Product";
import type { Category } from "../../types/Category";
import { useNavigate } from "react-router-dom";
import { useCart } from "../../hooks/useCart";
import { useNotification } from "../../hooks/useNotification";

type Props = {
  product: Product;
  categories: Category[];
};

export const ProductCard = (props: Props) => {
  const navigate = useNavigate();
  const { addToCart } = useCart();
  const {info} = useNotification();

  const categoryName = props.categories?.find(
    (c) => c.id === props.product.categoryId,
  )?.name;

  const textStyle = {
    fontWeight: 400,
    textAlign: "center",
    margin: "3px",
  };

  const buttonStyle = {
    "&:hover": {
      backgroundColor: "#012619",
    },
    textAlign: "center",
    margin: "3px",
  };

  const handleNavigate = (id: number) => {
    navigate(`/products/${id}`);
  };

  return (
    <>
      <Box
        sx={{
          width: {
            xs: "90%",
            sm: "260px",
          },
          "& img": {
            width: {
              xs: "90%",
              sm: "85%",
            },
            height: "auto",
          },
          //maxHeight: "400px",
          //maxWidth: "300px",
          display: "flex",
          flexDirection: "column",
          padding: "15px",
          justifyContent: "flex-start",
          alignItems: "center",
          margin: "15px",
          borderRadius: 2,
          boxShadow: 2,
          transition: "0.3s",
          "&:hover": {
            transform: "scale(1.03)",
            boxShadow: 5,
          },
        }}
      >
        {/*tendra un hoover*/}
        <img src={props.product.images?.[0]?.url ?? foto} alt="sustituto" />
        <InformationChip
          text="Esta en promocion!!"
          sizeC="medium"
        ></InformationChip>
        <Typography sx={textStyle}>
          {categoryName ?? "Sin categoría"}
        </Typography>
        <Typography
          sx={{ fontWeight: 500, textAlign: "center", margin: "3px" }}
        >
          {props.product.name}
        </Typography>
        <Typography sx={textStyle}>{props.product.price}</Typography>
        <Button
          fullWidth
          sx={{ backgroundColor: "purple", ...buttonStyle }}
          variant="contained"
          endIcon={<ShoppingCart />}
          onClick={() => {
            addToCart(props.product, 1);
            info("Se agregó un producto al carrito.", "Carrito de compras");
          }}
        >
          Agregar al carrito
        </Button>
        <Button
          fullWidth
          onClick={() => handleNavigate(props.product.id)}
          sx={{
            backgroundColor: "#78BF9E",
            ...buttonStyle,
          }}
          variant="contained"
          endIcon={<More />}
        >
          Ver detalles
        </Button>
      </Box>
    </>
  );
};
