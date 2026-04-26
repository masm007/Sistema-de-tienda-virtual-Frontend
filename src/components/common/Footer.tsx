import React from "react";
import IconButton from "@mui/material/IconButton";
import { LinkedIn, GitHub, Email, WhatsApp, Phone } from "@mui/icons-material";
import "../../assets/styles/MainStyle.css";

type Props = {};

export const Footer = (props: Props) => {
  return (
    <footer className="Footer">
      <div className="footerContent">
        <IconButton
          sx={{
            "&:hover": {
              color: "white",
              backgroundColor: "#0A66C2",
              transform: "scale(1.2)",
            },
          }}
          className="footerElement"
          component="a"
          href="https://www.linkedin.com/in/marco-antonio-salazar-mejia-0216312b6/"
          target="_blank"
          rel="noopener noreferrer"
        >
          <LinkedIn />
        </IconButton>
        <IconButton
          sx={{
            "&:hover": {
              color: "white",
              backgroundColor: "#8250DF",
              transform: "scale(1.2)",
            },
          }}
          className="footerElement"
          component="a"
          href="https://github.com/masm007"
          target="_blank"
          rel="noopener noreferrer"
        >
          <GitHub />
        </IconButton>
        <IconButton
          sx={{
            "&:hover": {
              color: "#DB4437",
              backgroundColor: "#FFF",
              transform: "scale(1.2)",
            },
          }}
          className="footerElement"
          component="a"
          href="mailto:marco.salazarmejia03@gmail.com"
          target="_blank"
          rel="noopener noreferrer"
        >
          <Email />
        </IconButton>
        <IconButton
          sx={{
            "&:hover": {
              color: "white",
              backgroundColor: "#25D366",
              transform: "scale(1.2)",
            },
          }}
          className="footerElement"
          component="a"
          href="https://wa.me/593984183500"
          target="_blank"
          rel="noopener noreferrer"
        >
          <WhatsApp />
        </IconButton>
      </div>

      <div className="footerContent">
        <p className="footerElement">Marco Antonio Salazar Mejia</p>
        <IconButton
          className="footerElement"
          sx={{
            display: "inline-block",
          }}
        >
          <Phone />
        </IconButton>
        <p className="footerElement" style={{ display: "inline-block" }}>
          0984183500
        </p>
      </div>
    </footer>
  );
};
