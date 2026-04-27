import React from "react";
import { useState } from "react";
import { Link as RouterLink, useNavigate } from "react-router-dom";
//material
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import Typography from "@mui/material/Typography";
import InputAdornment from "@mui/material/InputAdornment";
import IconButton from "@mui/material/IconButton";
import { Visibility, VisibilityOff } from "@mui/icons-material";
import { Box, Link } from "@mui/material";
//archivos
import logo from "../../assets/images/tiendaVirtual.png";
import { signUpRequest } from "../../services/AuthService.ts";
import "../../assets/styles/MainStyle.css";

type UserType = {
  firstname: string;
  lastname: string;
  email: string;
  pass: string;
};

type Props = {};

export const SignUp = (props: Props) => {
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = React.useState(false);

  const handleClickShowPassword = () => setShowPassword((show) => !show);

  const handleMouseDownPassword = (
    event: React.MouseEvent<HTMLButtonElement>,
  ) => {
    event.preventDefault();
  };
  const [Firstname, setFirstname] = useState("");
  const [Lastname, setLastname] = useState("");
  const [Email, setEmail] = useState("");
  const [Password, setPassword] = useState("");

  const handleSignUp = async () => {
    try {
      const data = await signUpRequest(Firstname, Lastname, Email, Password);
      console.log(data);
      // redirigir
      navigate("/auth");
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
      <Typography className="authElement" sx={{ padding: "10px" }} variant="h5">
        Ingresa tu info para registrarte
      </Typography>
      <TextField
        fullWidth
        className="authElement"
        value={Firstname}
        onChange={(event) => {
          setFirstname(event.target.value);
        }}
        placeholder="Nombre"
        variant="outlined"
      />
      <TextField
        fullWidth
        className="authElement"
        value={Lastname}
        onChange={(event) => {
          setLastname(event.target.value);
        }}
        placeholder="Apellido"
        variant="outlined"
      />
      <TextField
        fullWidth
        className="authElement"
        value={Email}
        onChange={(event) => {
          setEmail(event.target.value);
        }}
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
          handleSignUp();
        }}
      >
        Registrarte
      </Button>
      <Typography sx={{ padding: "10px" }} variant="h6">
        ¿Ya tienes una cuenta?{" "}
        <Link component={RouterLink} to="/auth" variant="h6">
          Iniciar sesión
        </Link>
      </Typography>
    </Box>
  );
};
