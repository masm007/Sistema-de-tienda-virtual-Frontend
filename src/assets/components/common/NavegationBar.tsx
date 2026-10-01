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
  Menu,
  MenuItem,
} from "@mui/material";
import Badge from "@mui/material/Badge";
import {
  ShoppingCart,
  Menu as MenuIcon,
  ExitToApp,
  AdminPanelSettings,
  AccountCircle,
  Person,
} from "@mui/icons-material";
import { styled } from "@mui/material/styles";
import React, { useContext, useState } from "react";
import { CartContext } from "../../../providers/CartProvider";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../../hooks/useAuth";
import logo from "../../images/Store.png";

type Props = {
  openCart: () => void;
  // "admin" oculta el carrito y la navegación de cliente, ya que el panel
  // admin no tiene CartProvider y esas acciones no aplican ahí.
  variant?: "public" | "admin";
};

const drawerWidth = 240;
const navItems = [
  //{ label: "Inicio", path: "/" },
  { label: "Categorías", path: "/categories" },
  { label: "Mis Órdenes", path: "/orders" },
  { label: "Contacto", path: "/contact" },
];

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
  const { logout, user } = useAuth();
  const [mobileOpen, setMobileOpen] = React.useState(false);
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const cart = useContext(CartContext);

  const isAdmin = user?.role === 1;
  const isAdminView = props.variant === "admin";
  const menuOpen = Boolean(anchorEl);

  const handleDrawerToggle = () => {
    setMobileOpen((prevState) => !prevState);
  };

  const handleAccountClick = (e: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(e.currentTarget);
  };
  const handleAccountClose = () => setAnchorEl(null);

  const handleLogout = async () => {
    await logout();
    navigate("/auth");
  };

  const accountMenu = (
    <>
      <IconButton
        onClick={handleAccountClick}
        sx={{ "&:hover": { backgroundColor: "#FFEBEE", color: "#7B1FA2" } }}
      >
        <AccountCircle />
      </IconButton>
      <Menu anchorEl={anchorEl} open={menuOpen} onClose={handleAccountClose}>
        <MenuItem
          onClick={() => {
            handleAccountClose();
            navigate("/profile");
          }}
        >
          <Person sx={{ mr: 1 }} fontSize="small" />
          Mi perfil
        </MenuItem>
        {isAdmin && !isAdminView && (
          <MenuItem
            onClick={() => {
              handleAccountClose();
              navigate("/admin");
            }}
          >
            <AdminPanelSettings sx={{ mr: 1 }} fontSize="small" />
            Panel de administración
          </MenuItem>
        )}
        <MenuItem onClick={handleLogout}>
          <ExitToApp sx={{ mr: 1 }} fontSize="small" />
          Cerrar sesión
        </MenuItem>
      </Menu>
    </>
  );

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
      {/* ...logo igual... */}
      <Divider />
      <List>
        {!isAdminView &&
          navItems.map((item) => (
            <ListItem key={item.path} disablePadding>
              <ListItemButton
                onClick={() => navigate(item.path)}
                sx={{ textAlign: "center" }}
              >
                <ListItemText primary={item.label} />
              </ListItemButton>
            </ListItem>
          ))}
        <ListItem disablePadding>
          <ListItemButton
            onClick={() => navigate("/profile")}
            sx={{ textAlign: "center" }}
          >
            <ListItemText primary="Mi perfil" />
          </ListItemButton>
        </ListItem>
        {isAdmin && !isAdminView && (
          <ListItem disablePadding>
            <ListItemButton
              onClick={() => navigate("/admin")}
              sx={{ textAlign: "center" }}
            >
              <ListItemText primary="Panel de administración" />
            </ListItemButton>
          </ListItem>
        )}
        {!isAdminView && shoppingCart}
        <ListItem disablePadding>
          <ListItemButton onClick={handleLogout} sx={{ textAlign: "center" }}>
            <ListItemText primary="Cerrar sesión" />
          </ListItemButton>
        </ListItem>
      </List>
    </Box>
  );

  return (
    <>
      <Box sx={{ display: "flex" }}>
        <CssBaseline />
        <AppBar
          component="nav"
          sx={{ backgroundColor: "#78bf9e", boxShadow: 3 }}
        >
          <Toolbar>
            <IconButton
              aria-label="open drawer"
              edge="start"
              onClick={handleDrawerToggle}
              sx={{ color: "black", mr: 2, display: { sm: "none" } }}
            >
              <MenuIcon />
            </IconButton>

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

            <Box
              sx={{ flexGrow: 1, display: "flex", justifyContent: "flex-end" }}
            >
              <Box
                sx={{
                  display: { xs: "none", sm: "flex" },
                  alignItems: "center",
                  gap: 1,
                }}
              >
                {!isAdminView &&
                  navItems.map((item) => (
                    <Button
                      key={item.path}
                      onClick={() => navigate(item.path)}
                      sx={{ color: "black" }}
                    >
                      {item.label}
                    </Button>
                  ))}
                {!isAdminView && shoppingCart}
                {accountMenu}
              </Box>
            </Box>
          </Toolbar>
        </AppBar>

        <Drawer
          variant="temporary"
          open={mobileOpen}
          onClose={handleDrawerToggle}
          ModalProps={{ keepMounted: true }}
          sx={{
            display: { xs: "block", sm: "none" },
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
