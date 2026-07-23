import { Outlet } from "react-router-dom";
import "../assets/styles/MainStyle.css";

type Props = {};

export const AuthLayout = (props: Props) => {
  return (
    <div className="authContainer">
      <Outlet />
    </div>
  );
};
