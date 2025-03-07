import React from "react";
import { Container, Row, Col, Button } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import { useTheme } from "../../context/ThemeContext";
import { FaArrowLeft, FaUndo } from "react-icons/fa";

const GameLayout = ({
  title,
  children,
  onUndo,
  canUndo = false,
  onExit,
  showBackButton = true,
}) => {
  const { darkMode } = useTheme();
  const navigate = useNavigate();

  const handleBack = () => {
    if (onExit) {
      onExit();
    }
    navigate("/game-selection");
  };

  return (
    <Container
      className={`game-container p-3 rounded ${
        darkMode ? "bg-dark text-white" : "bg-light"
      }`}
    >
      <Row className="mb-3 align-items-center">
        <Col xs="auto">
          {showBackButton && (
            <Button
              variant={darkMode ? "outline-light" : "outline-dark"}
              onClick={handleBack}
              className="me-2"
            >
              <FaArrowLeft /> Zurück
            </Button>
          )}
        </Col>
        <Col className="text-center">
          <h2>{title}</h2>
        </Col>
        <Col xs="auto">
          {onUndo && (
            <Button
              variant={darkMode ? "outline-light" : "outline-dark"}
              onClick={onUndo}
              disabled={!canUndo}
            >
              <FaUndo /> Rückgängig
            </Button>
          )}
        </Col>
      </Row>
      {children}
    </Container>
  );
};

export default GameLayout;
