import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";
import { Box, CircularProgress } from "@mui/material";

type Props = {};

export const AdminRoute = (props: Props) => {
  const { isAuthenticated, isAdmin, loading, user } = useAuth();

  if (loading) {
    return (
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          minHeight: "100vh",
        }}
      >
        <CircularProgress />
      </Box>
    );
  }

  return isAuthenticated ? (
    isAdmin ? (
      <Outlet />
    ) : (
      <Navigate to="/403" />
    )
  ) : (
    <Navigate to="/auth" />
  );
};
