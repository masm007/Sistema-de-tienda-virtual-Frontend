import {
  AppBar,
  Box,
  Button,
  CssBaseline,
  Divider,
  Drawer,
  IconButton,
  List,
  ListItem,
  ListItemButton,
  ListItemText,
  Toolbar,
} from "@mui/material";
import Badge from "@mui/material/Badge";
import { ShoppingCart, Menu, ExitToApp } from "@mui/icons-material";
import { styled } from "@mui/material/styles";
import React, { useContext } from "react";
import { CartContext } from "../../providers/CartProvider";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../hooks/useAuth";
import logo from "../../assets/images/Store.png";

type Props = {
  openCart: () => void;
};

const drawerWidth = 240;
const navItems = ["Productos", "Categorías", "Ofertas", "Contacto"];

const StyledBadge = styled(Badge)(({ theme }) => ({
  "& .MuiBadge-badge": {
    right: -3,
    top: 13,
    border: `2px solid ${theme.palette.background.paper}`,
    padding: "0 4px",
  },
}));

export const NavegationBar = (props: Props) => {
  const navigate = useNavigate();
  const { logout } = useAuth();
  const [mobileOpen, setMobileOpen] = React.useState(false);
  const cart = useContext(CartContext);

  const handleDrawerToggle = () => {
    setMobileOpen((prevState) => !prevState);
  };

  const handleLogout = async () => {
    await logout();
    navigate("/auth");
  };

  const shoppingCart = (
    <IconButton
      onClick={props.openCart}
      sx={{
        "&:hover": {
          backgroundColor: "#FFEBEE",
          color: "#7B1FA2",
        },
      }}
    >
      <StyledBadge
        badgeContent={cart?.cart.length ? cart?.cart.length : 0}
        color="secondary"
      >
        <ShoppingCart></ShoppingCart>
      </StyledBadge>
    </IconButton>
  );

  const signOut = (
    <IconButton
      sx={{
        "&:hover": {
          backgroundColor: "#FFEBEE",
          color: "#B71C1C",
        },
      }}
      onClick={() => {
        handleLogout();
      }}
    >
      <ExitToApp></ExitToApp>
    </IconButton>
  );

  const drawer = (
    <Box
      onClick={handleDrawerToggle}
      sx={{ textAlign: "center", backgroundColor: "#78bf9e", boxShadow: 3 }}
    >
      <Box
        component="img"
        src={logo}
        alt="Logo"
        sx={{
          width: "75px",
          height: "auto",
          my: 2,
          cursor: "pointer",
          borderRadius: 3,
          boxShadow: 4,
        }}
        onClick={() => navigate("/")}
      />

      <Divider />

      <List>
        {navItems.map((item) => (
          <ListItem key={item} disablePadding>
            <ListItemButton sx={{ textAlign: "center" }}>
              <ListItemText primary={item} />
            </ListItemButton>
          </ListItem>
        ))}
        {shoppingCart}
        {signOut}
      </List>
    </Box>
  );

  return (
    <>
      <Box sx={{ display: "flex" }}>
        <CssBaseline />

        <AppBar
          component="nav"
          sx={{
            backgroundColor: "#78bf9e",
            boxShadow: 3,
          }}
        >
          <Toolbar>
            <IconButton
              aria-label="open drawer"
              edge="start"
              onClick={handleDrawerToggle}
              sx={{
                color: "black",
                mr: 2,
                display: { sm: "none" },
              }}
            >
              <Menu></Menu>
            </IconButton>

            <Box sx={{ display: "flex", justifyContent: "flex-start" }}>
              <Box
                component="img"
                src={logo}
                alt="Logo"
                sx={{
                  width: "75px",
                  height: "auto",
                  my: 2,
                  cursor: "pointer",
                  borderRadius: 3,
                  boxShadow: 4,
                }}
                onClick={() => navigate("/")}
              />
            </Box>

            <Box
              sx={{ flexGrow: 1, display: "flex", justifyContent: "flex-end" }}
            >
              <Box
                sx={{
                  display: {
                    xs: "none",
                    sm: "flex",
                  },
                  alignItems: "center",
                  gap: 1,
                }}
              >
                {navItems.map((item) => (
                  <Button key={item} sx={{ color: "black" }}>
                    {item}
                  </Button>
                ))}

                {shoppingCart}
                {signOut}
              </Box>
            </Box>
          </Toolbar>
        </AppBar>

        {/* movil */}
        <Drawer
          variant="temporary"
          open={mobileOpen}
          onClose={handleDrawerToggle}
          ModalProps={{
            keepMounted: true,
          }}
          sx={{
            display: {
              xs: "block",
              sm: "none",
            },
            "& .MuiDrawer-paper": {
              boxSizing: "border-box",
              width: drawerWidth,
            },
          }}
        >
          {drawer}
        </Drawer>
      </Box>
      <Toolbar />
    </>
  );
};
