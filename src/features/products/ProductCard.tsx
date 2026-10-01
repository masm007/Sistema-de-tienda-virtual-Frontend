import { Button, Typography, Box } from "@mui/material";
import foto from "../../assets/images/tiendaVirtual.png";
// import { InformationChip } from "../../assets/components/ui/InformationChip";
import { ShoppingCart, More } from "@mui/icons-material";
import type { ProductRequest } from "../../types/Product";
import { useNavigate } from "react-router-dom";
import { useCart } from "../../hooks/useCart";
import { useNotification } from "../../hooks/useNotification";

type Props = {
  product: ProductRequest;
};

export const ProductCard = (props: Props) => {
  const navigate = useNavigate();
  const { addToCart } = useCart();
  const {info} = useNotification();

  // const categoryName = props.categories?.find(
  //   (c) => c.id === props.product.categoryId,
  // )?.name;

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

  const handleNavigate = (sku: string) => {
    navigate(`/products/${sku}`);
  };

  return (
    <>
      <Box
        sx={{
          width: {
            xs: "90%",
            sm: "260px",
          },
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
        <Box
          sx={{
            width: { xs: "90%", sm: "85%" },
            height: 140,
            flexShrink: 0,
            overflow: "hidden",
            borderRadius: 1,
            bgcolor: "#F5F5F5",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            gap: 3,
          }}
        >
          <Box
            component="img"
            src={props.product.images?.[0]?.url ?? foto}
            alt="sustituto"
            sx={{ width: "100%", height: "100%", objectFit: "contain" }}
          />
        </Box>
        {/* Se saca hasta decidir si vale la pena mostrar el código del
        cupón real en vez de un texto de "promoción" genérico y engañoso */}
        {/* <InformationChip text="Esta en promocion!!" sizeC="medium" /> */}
        <Typography sx={textStyle}>
          {props.product.categoryName ?? "Sin categoría"}
        </Typography>
        <Typography
          sx={{
            fontWeight: 500,
            textAlign: "center",
            margin: "3px",
            display: "-webkit-box",
            WebkitLineClamp: 2,
            WebkitBoxOrient: "vertical",
            overflow: "hidden",
            minHeight: "2.6em",
          }}
        >
          {props.product.name}
        </Typography>
        <Typography sx={textStyle}>${props.product.price.toFixed(2)}</Typography>
        <Box sx={{ width: "100%", display: "flex", flexDirection: "column", mt: 1.5 }}>
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
            onClick={() => handleNavigate(props.product.sku)}
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
      </Box>
    </>
  );
};
