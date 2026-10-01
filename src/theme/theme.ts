import { createTheme, responsiveFontSizes } from "@mui/material/styles";

let theme = createTheme({
  typography: {
    fontFamily: `"Segoe UI", Tahoma, Geneva, Verdana, sans-serif`,
    // El h1 por defecto de MUI (96px) resultaba demasiado grande; se iguala
    // al tamaño de h4, que es el que ya se usaba como título de sección.
    // El resto de la escala baja desde ahí, cada nivel más chico que el anterior.
    h1: {
      fontWeight: 400,
      fontSize: "2.125rem",
      lineHeight: 1.235,
      letterSpacing: "0.00735em",
    },
    h2: {
      fontWeight: 400,
      fontSize: "1.875rem",
      lineHeight: 1.25,
      letterSpacing: "0em",
    },
    h3: {
      fontWeight: 400,
      fontSize: "1.625rem",
      lineHeight: 1.3,
      letterSpacing: "0em",
    },
    h4: {
      fontWeight: 400,
      fontSize: "1.375rem",
      lineHeight: 1.35,
      letterSpacing: "0em",
    },
    h5: {
      fontWeight: 500,
      fontSize: "1.125rem",
      lineHeight: 1.4,
      letterSpacing: "0em",
    },
    h6: {
      fontWeight: 600,
      fontSize: "1rem",
      lineHeight: 1.5,
      letterSpacing: "0em",
    },
  },
    palette: {
    primary: {
      main: "#9C27B0",
      light: "#BA68C8",
      dark: "#7B1FA2",
      contrastText: "#FFFFFF",
    },
    success: {
      main: "#78BF9E",
      light: "#A3D4BE",
      dark: "#4F9B78",
      contrastText: "#FFFFFF",
    },
    text: {
      primary: "#1A1A1A",
      secondary: "#6B6B6B",
    },
    background: {
      default: "#FFFFFF",
      paper: "#F7F7F7",
    },
  },
});

theme = responsiveFontSizes(theme);

export default theme;