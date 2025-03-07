import React from "react";
import { Container } from "react-bootstrap";
import { useTheme } from "../../context/ThemeContext";

const Footer = () => {
  const { darkMode } = useTheme();

  return (
    <footer
      className={`py-3 mt-4 ${darkMode ? "bg-dark text-white" : "bg-light"}`}
    >
      <Container className="text-center">
        <p className="mb-1">
          Dart Counter App &copy; {new Date().getFullYear()}
        </p>
        <p className="mb-0">Erstellt als Schulprojekt</p>
      </Container>
    </footer>
  );
};

export default Footer;
