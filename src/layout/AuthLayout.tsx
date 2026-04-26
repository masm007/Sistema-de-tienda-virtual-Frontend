import React from "react";
import { Outlet } from "react-router-dom";
import { Footer } from "../components/common/Footer.tsx";
import "../assets/styles/MainStyle.css";

type Props = {};

export const AuthLayout = (props: Props) => {
  return (
    <div className="authContainer">
      <Outlet />
      <Footer></Footer>
    </div>
  );
};
