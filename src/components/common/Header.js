import React from "react";
import { Navbar, Container, Nav, Button } from "react-bootstrap";
import { Link, useNavigate } from "react-router-dom";
import { useTheme } from "../../context/ThemeContext";
import { FaMoon, FaSun } from "react-icons/fa";

const Header = () => {
  const { darkMode, toggleTheme } = useTheme();
  const navigate = useNavigate();

  return (
    <Navbar
      bg={darkMode ? "dark" : "light"}
      variant={darkMode ? "dark" : "light"}
      expand="lg"
      className="mb-4"
    >
      <Container>
        <Navbar.Brand as={Link} to="/">
          Dart Counter
        </Navbar.Brand>
        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        <Navbar.Collapse id="basic-navbar-nav">
          <Nav className="me-auto">
            <Nav.Link as={Link} to="/">
              Home
            </Nav.Link>
            <Nav.Link as={Link} to="/game-selection">
              Spielauswahl
            </Nav.Link>
            <Nav.Link as={Link} to="/player-stats">
              Statistik
            </Nav.Link>
            <Nav.Link as={Link} to="/player-creation">
              Spieler erstellen
            </Nav.Link>
            <Nav.Link as={Link} to="/settings">
              Einstellungen
            </Nav.Link>
          </Nav>
          <Button
            variant={darkMode ? "outline-light" : "outline-dark"}
            onClick={toggleTheme}
            className="ms-2"
          >
            {darkMode ? <FaSun /> : <FaMoon />}
          </Button>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
};

export default Header;
