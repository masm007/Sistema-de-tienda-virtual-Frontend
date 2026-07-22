import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import Typography from "@mui/material/Typography";
import { useState } from "react";
import React from "react";
import InputAdornment from "@mui/material/InputAdornment";
import IconButton from "@mui/material/IconButton";
import { Visibility, VisibilityOff } from "@mui/icons-material";
import { Box, Link } from "@mui/material";
import { Link as RouterLink } from "react-router-dom";
import logo from "../../assets/images/tiendaVirtual.png";
import { useNavigate } from "react-router-dom";
import { loginRequest } from "../../services/AuthService.ts";
import "../../assets/styles/MainStyle.css";
import { useAuth } from "../../hooks/useAuth.ts";

type UsuarioType = {
  email: string;
  pass: string;
};

type Props = {};

export const Login = (props: Props) => {
  const navigate = useNavigate();
  const { login, loading} = useAuth();
  const [showPassword, setShowPassword] = React.useState(false);

  const handleClickShowPassword = () => setShowPassword((show) => !show);

  const handleMouseDownPassword = (
    event: React.MouseEvent<HTMLButtonElement>,
  ) => {
    event.preventDefault();
  };

  const [Email, setEmail] = useState("");
  const [Password, setPassword] = useState("");
  //const [Usuario, setUsuario] = useState<UsuarioType | null>(null);

  const handleLogin = async () => {
    try {
      await login(Email, Password);
      // redirigir
      navigate("/");
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <Box
      className="container"
      sx={{
        width: "100%",
        maxWidth: {
          xs: "300px",
          sm: "350px",
          md: "400px",
        },
        mx: "auto",
      }}
    >
      <Box className="authElement">
        <img width={"250px"} height={"125px"} src={logo} alt="" />
      </Box>
      <Typography
        className="authElement"
        sx={{
          padding: "10px",
        }}
        variant="h5"
      >
        Ingresa tu info para iniciar sesión
      </Typography>
      <TextField
        fullWidth
        className="authElement"
        value={Email}
        onChange={(event) => {
          setEmail(event.target.value);
        }}
        id="outlined-basic"
        placeholder="Email"
        variant="outlined"
      />
      <TextField
        sx={{ padding: "10pxs" }}
        fullWidth
        className="authElement"
        type={showPassword ? "text" : "password"}
        value={Password}
        onChange={(e) => setPassword(e.target.value)}
        placeholder="Contraseña"
        variant="outlined"
        InputProps={{
          endAdornment: (
            <InputAdornment position="end">
              <IconButton
                onClick={handleClickShowPassword}
                onMouseDown={handleMouseDownPassword}
                edge="end"
              >
                {showPassword ? <VisibilityOff /> : <Visibility />}
              </IconButton>
            </InputAdornment>
          ),
        }}
      />
      <Button
        fullWidth
        size="large"
        className="authElement"
        variant="contained"
        onClick={() => {
          handleLogin();
        }}
      >
        Iniciar sesión
      </Button>
      <Typography
        sx={{
          padding: "10px",
        }}
        variant="h6"
      >
        ¿No tienes una cuenta?{" "}
        <Link component={RouterLink} to="./signUp" variant="h6">
          Regístrate
        </Link>
      </Typography>
    </Box>
  );
};
