import { StrictMode } from "react";
import { BrowserRouter } from "react-router-dom";
import { createRoot } from "react-dom/client";
import { ThemeProvider } from "@mui/material/styles";
import { createTheme, responsiveFontSizes } from "@mui/material/styles";
import App from "./App.tsx";

let theme = createTheme();
theme = responsiveFontSizes(theme);

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <ThemeProvider theme={theme}>
      <BrowserRouter>
        <App />
      </BrowserRouter>
    </ThemeProvider>
  </StrictMode>
);