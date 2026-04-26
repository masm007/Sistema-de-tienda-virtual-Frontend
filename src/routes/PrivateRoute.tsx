import React from "react";
import { Navigate, Outlet } from "react-router-dom";

type Props = {};

export const PrivateRoute = (props: Props) => {
  const token = localStorage.getItem("token");

  return token ? <Outlet /> : <Navigate to="/auth" />;
};
