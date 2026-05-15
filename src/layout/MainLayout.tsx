import React from "react";
import { Outlet } from "react-router-dom";
import { Footer } from "../components/common/Footer";
import { NavegationBar } from "../components/common/NavegationBar";
import { CartModal } from "../features/cart/CartModal";
import "../assets/styles/MainStyle.css";

type Props = {};

export const MainLayout = (props: Props) => {
  const [openCart, setOpenCart] = React.useState(false);
  return (
    <div className="mainContainer">
      <NavegationBar openCart={() => setOpenCart(true)}></NavegationBar>
      <CartModal open={openCart} onClose={() => setOpenCart(false)}></CartModal>
      <Outlet />
      <Footer></Footer>
    </div>
  );
};
