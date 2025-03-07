
import React, { useState } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import BackToHomeButton from "../common/BackToHome";

const AroundTheClock = () => {
    const [currentTarget, setCurrentTarget] = useState(1); // Zielnummer startet bei 1
    const [throwsHistory, setThrowsHistory] = useState([]); // Wurfhistorie für Einzelspieler
    const [isGameWon, setIsGameWon] = useState(false); // Status: Hat der Spieler das Spiel gewonnen?

    // Eingabe des getroffenen Feldes
    const handleScoreInput = (number) => {
        if (isGameWon) return; // Spiel beendet -> keine Eingabe möglich

        const updatedThrowsHistory = [...throwsHistory];
        updatedThrowsHistory.push(number); // Den Wurf zur Historie hinzufügen
        setThrowsHistory(updatedThrowsHistory);

        // Prüfen, ob das getroffene Feld das Ziel ist
        if (number === currentTarget) {
            if (currentTarget === 25) {
                // Bull getroffen -> Spielende
                setIsGameWon(true);
            } else if (currentTarget === 20) {
                // Nach 20 direkt zu 25 springen
                setCurrentTarget(25);
            } else {
                // Nächstes Ziel vorbereiten
                setCurrentTarget(currentTarget + 1);
            }
        }
    };

    return (
        <div className="container mt-4 text-center text-success">
            <h1>Around the Clock</h1>

            {!isGameWon ? (
                <div>
                    <h2>
                        Zielnummer: <span className="text-primary">{currentTarget}</span>
                    </h2>

                    <div className="mt-4">
                        <p>Wähle das getroffene Feld:</p>

                        {/* Buttons von 1 bis 20 und Bull */}
                        {[...Array(20).keys()].map((num) => (
                            <button
                                key={num + 1}
                                className="btn btn-outline-primary mx-1 mb-2"
                                onClick={() => handleScoreInput(num + 1)}
                            >
                                {num + 1}
                            </button>
                        ))}
                        <button
                            className="btn btn-outline-danger mx-1 mb-2"
                            onClick={() => handleScoreInput(25)}
                        >
                            Bull (25)
                        </button>
                    </div>
                </div>
            ) : (
                <h2>🎉 Du hast gewonnen! 🎉</h2>
            )}

            <div className="mt-5">
                <h4>Wurfhistorie:</h4>
                {throwsHistory.length > 0 ? (
                    <p>{throwsHistory.join(", ")}</p>
                ) : (
                    <p>Noch keine Würfe</p>
                )}
            </div>
            <BackToHomeButton /> {/* Zurück zur Startseite */}

        </div>
    );
};

export default AroundTheClock;