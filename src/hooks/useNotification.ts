import { useContext } from "react";
import { NotificationContext } from "../providers/NotificationProvider";

export const useNotification = () => {
  const context = useContext(NotificationContext);
  if (!context) {
    throw new Error("useNotification debe usarse dentro de un NotificationProvider");
  }
  return context;
};