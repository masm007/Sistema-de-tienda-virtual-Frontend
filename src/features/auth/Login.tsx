import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import Typography from "@mui/material/Typography";
import "../../assets/styles/MainStyle.css";
import { useState } from "react";
import React from "react";

type UsuarioType = {
  user: string;
  pass: string;
};

type Props = {};

export const Login = (props: Props) => {
  const [User, setUser] = useState("");
  const [Password, setPassword] = useState("");
  const [Usuario, setUsuario] = useState<UsuarioType | null>(null);

  const handleLogin = () => {
    const data = {
      user: User,
      pass: Password,
    };
    setUsuario(data);
    console.log(data);
  };

  return (
    <div className="container">
      <Typography variant="body1">Usuario</Typography>
      <TextField
        value={User}
        onChange={(event) => {
          setUser(event.target.value);
        }}
        id="outlined-basic"
        label="Outlined"
        variant="outlined"
      />
      <Typography variant="body1">Contraseña</Typography>
      <TextField
        value={Password}
        onChange={(event) => {
          setPassword(event.target.value);
        }}
        id="outlined-basic"
        label="Outlined"
        variant="outlined"
      />
      <Button
        variant="contained"
        onClick={() => {
          handleLogin();
        }}
      >
        Iniciar sesión
      </Button>
    </div>
  );
};
