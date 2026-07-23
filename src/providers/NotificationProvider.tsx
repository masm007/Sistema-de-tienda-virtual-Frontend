import { Alert, AlertTitle, Snackbar } from "@mui/material";
import { createContext, useState } from "react";

import React from "react";

type NotificationType = "success" | "error" | "warning" | "info";

type Notification = {
  type: NotificationType;
  message: string;
  title?: string;
  duration?: number;
};

type NotificationContextType = {
  //notify: (notification: Notification) => void;
  success: (message: string, title?: string, duration?: number) => void;
  error: (message: string, title?: string, duration?: number) => void;
  warning: (message: string, title?: string, duration?: number) => void;
  info: (message: string, title?: string, duration?: number) => void;
};

export const NotificationContext = createContext<NotificationContextType | null>(null);

type Props = {
  children: React.ReactNode;
};

export const NotificationProvider = ({ children }: Props) => {
  const [open, setOpen] = useState(false);
  const [notification, setNotification] = useState<Notification>({
    type: "info",
    message: "",
    duration: 4000,
  });

  const handleClose = () => {
    setOpen(false);
  };

  const notify = (data: Notification) => {
    setNotification(data);
    setOpen(true);
  };

  const showNotification = (
    type: NotificationType,
    message: string,
    title?: string,
    duration: number = 4000,
  ) => {
    setNotification({
      type,
      message,
      title,
      duration,
    });
    setOpen(true);
  };

  const success = (message: string, title?: string, duration?: number) =>
    showNotification("success", message, title, duration);

  const error = (message: string, title?: string, duration?: number) =>
    showNotification("error", message, title, duration);

  const warning = (message: string, title?: string, duration?: number) =>
    showNotification("warning", message, title, duration);

  const info = (message: string, title?: string, duration?: number) =>
    showNotification("info", message, title, duration);

  return (
    <>
      {/* */}
      <NotificationContext.Provider value={{ success, error, warning, info }}>
        {children}
        <Snackbar
          open={open}
          autoHideDuration={notification.duration ?? 4000}
          onClose={handleClose}
          anchorOrigin={{
            vertical: "bottom",
            horizontal: "right",
          }}
        >
          <Alert
            severity={notification.type}
            variant="filled"
            onClose={handleClose}
          >
            {notification.title && (
              <AlertTitle>{notification.title}</AlertTitle>
            )}
            {notification.message}
          </Alert>
        </Snackbar>
      </NotificationContext.Provider>
    </>
  );
};
