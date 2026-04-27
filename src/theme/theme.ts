import { createTheme, responsiveFontSizes } from "@mui/material/styles";

let theme = createTheme({
  typography: {
    fontFamily: `"Segoe UI", Tahoma, Geneva, Verdana, sans-serif`,
  },
});

theme = responsiveFontSizes(theme);

export default theme;