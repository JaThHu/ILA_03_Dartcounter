import React from "react";
import { useNavigate } from "react-router-dom";

const BackToHomeButton = () => {
    const navigate = useNavigate();

    const goToHome = () => {
        navigate("/");
    };

    return (
        <button
            onClick={goToHome}
            style={{
                padding: "0.5rem 1rem",
                fontSize: "1rem",
                backgroundColor: "#007bff",
                color: "white",
                border: "none",
                borderRadius: "5px",
                cursor: "pointer",
                marginTop: "1rem"
            }}
        >
            Zurück zur Startseite
        </button>
    );
};

export default BackToHomeButton;