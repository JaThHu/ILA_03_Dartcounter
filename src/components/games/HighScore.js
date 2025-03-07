import React, { useState } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import BackToHomeButton from "../common/BackToHome";

const HighScoreGame = () => {
    // Anzahl maximaler Runden
    const MAX_ROUNDS = 10;

    // State-Variablen
    const [roundCount, setRoundCount] = useState(1);        // Aktuelle Runde (1 - 10)
    const [currentThrows, setCurrentThrows] = useState([]); // Würfe der aktuellen Runde
    const [totalScore, setTotalScore] = useState(0);        // Gesamtscore
    const [throwsHistory, setThrowsHistory] = useState([]); // Komplette Historie [ [Runde1-Würfe], [Runde2-Würfe], ... ]
    const [isGameFinished, setIsGameFinished] = useState(false); // Spiel beendet?

    // Multiplier: Single(1), Double(2), Triple(3)
    const [multiplier, setMultiplier] = useState(1);

    /**
     * Auswählen, ob Single, Double oder Triple geworfen wird.
     */
    const handleMultiplierChange = (value) => {
        setMultiplier(value);
    };

    /**
     * Wird aufgerufen, wenn der Spieler ein Feld anklickt.
     * number: Geklicktes Feld (1-20, 25)
     */
    const handleScoreInput = (number) => {
        if (isGameFinished) return; // Keine Eingaben mehr möglich, wenn das Spiel beendet ist

        // Nur bis zu 3 Darts pro Runde
        if (currentThrows.length >= 3) {
            alert("Du hast bereits 3 Würfe in dieser Runde gemacht. Bitte Runde abschließen.");
            return;
        }

        // 25 (Bull) kann nicht mit Triple multipliziert werden
        if (number === 25 && multiplier > 2) {
            alert("25 (Bull) kann nur als Single oder Double geworfen werden.");
            return;
        }

        // Neuen Wurf hinzufügen (Feld * Multiplier)
        const throwValue = number * multiplier;
        setCurrentThrows((prev) => [...prev, throwValue]);
    };

    /**
     * Beendet die aktuelle Runde und speichert die Würfe in die Historie.
     */
    const completeRound = () => {
        if (isGameFinished) return; // Spiel ist bereits beendet

        // Falls noch keine Würfe gemacht wurden
        if (currentThrows.length === 0) {
            alert("Du hast noch keine Darts in dieser Runde geworfen!");
            return;
        }

        // Punkte der aktuellen Runde berechnen
        const roundPoints = currentThrows.reduce((sum, val) => sum + val, 0);

        // Gesamtpunkte aktualisieren
        setTotalScore((prev) => prev + roundPoints);

        // Historie aktualisieren
        setThrowsHistory((prev) => [...prev, currentThrows]);

        // Prüfen, ob die letzte Runde gespielt wurde
        if (roundCount === MAX_ROUNDS) {
            // Spiel beenden und Ergebnis anzeigen
            setIsGameFinished(true);
            setCurrentThrows([]);
            return;
        }

        // Nächste Runde vorbereiten
        setRoundCount((prev) => prev + 1);
        setCurrentThrows([]);
    };

    return (
        <div className="container text-center mt-4 text-success">
            <h1>Highscore-Spiel (mit Single/Double/Triple)</h1>

            {/* Noch nicht beendet */}
            {!isGameFinished ? (
                <div className="mt-4 ">
                    <h2>
                        Runde: <span className="text-primary">{roundCount}</span> / {MAX_ROUNDS}
                    </h2>
                    <h3>Aktuelle Würfe: {currentThrows.join(", ") || "-"}</h3>
                    <h4>Gesamtpunkte bisher: {totalScore}</h4>

                    <div className="mt-3">
                        {/* Auswahl Single / Double / Triple */}
                        <div className="mb-2">
                            <button
                                className={`btn btn-${multiplier === 1 ? "primary" : "outline-primary"} mx-1`}
                                onClick={() => handleMultiplierChange(1)}
                            >
                                Single
                            </button>
                            <button
                                className={`btn btn-${multiplier === 2 ? "warning" : "outline-warning"} mx-1`}
                                onClick={() => handleMultiplierChange(2)}
                            >
                                Double
                            </button>
                            <button
                                className={`btn btn-${multiplier === 3 ? "danger" : "outline-danger"} mx-1`}
                                onClick={() => handleMultiplierChange(3)}
                            >
                                Triple
                            </button>
                        </div>

                        <p>Wähle das getroffene Feld (max. 3 Würfe pro Runde):</p>
                        {/* Felder 1 bis 20 */}
                        {[...Array(20).keys()].map((num) => (
                            <button
                                key={num + 1}
                                className="btn btn-outline-primary mx-1 mb-2"
                                onClick={() => handleScoreInput(num + 1)}
                            >
                                {num + 1}
                            </button>
                        ))}
                        {/* Bull 25 */}
                        <button
                            className="btn btn-outline-danger mx-1 mb-2"
                            onClick={() => handleScoreInput(25)}
                        >
                            Bull (25)
                        </button>
                    </div>

                    <div className="mt-3">
                        <button className="btn btn-success" onClick={completeRound}>
                            Runde abschließen
                        </button>
                    </div>
                </div>
            ) : (
                // Spielende: Gesamtergebnis anzeigen
                <div>
                    <h2>Spiel beendet!</h2>
                    <h3>Deine Gesamtsumme: {totalScore}</h3>
                </div>
            )}

            {/* Historie aller Würfe anzeigen */}
            <div className="mt-5">
                <h4>Wurfhistorie:</h4>
                {throwsHistory.length > 0 ? (
                    throwsHistory.map((roundThrows, index) => (
                        <p key={index}>
                            <b>Runde {index + 1}:</b> {roundThrows.join(", ")}
                        </p>
                    ))
                ) : (
                    <p>Noch keine Würfe</p>
                )}
            </div>
            <BackToHomeButton />

        </div>
    );
};

export default HighScoreGame;