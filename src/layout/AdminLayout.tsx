import { Outlet } from "react-router-dom";
import "../assets/styles/MainStyle.css";
import { NavegationBar } from "../assets/components/common/NavegationBar";
import { Footer } from "../assets/components/common/Footer";

type Props = {};

export const AdminLayout = (props: Props) => {
  return (
    <div className="">
      <NavegationBar openCart={() => {}} variant="admin"></NavegationBar>
      <Outlet />
      <Footer></Footer>
    </div>
  );
};
