import React, { useState } from 'react';
import { useLocation } from 'react-router-dom';
import { getFirestore, doc, arrayUnion, updateDoc } from 'firebase/firestore';
import 'bootstrap/dist/css/bootstrap.min.css';
import BackToHomeButton from "../common/BackToHome";

const X01GameView = () => {
    const location = useLocation();
    const db = getFirestore();
    const { gameMode, players } = location.state || { gameMode: 301, players: [] };

    const [currentPlayerIndex, setCurrentPlayerIndex] = useState(0);
    const [scores, setScores] = useState(players.map(() => gameMode)); // Punktestände für jeden Spieler
    const [throwsHistory, setThrowsHistory] = useState(players.map(() => [])); // Liste der Würfe für jeden Spieler
    const [currentThrows, setCurrentThrows] = useState([]);
    const [multiplier, setMultiplier] = useState(1); // Single, Double, Triple
    const [winnerIndex, setWinnerIndex] = useState(null); // Gewinnerindex (wenn Spiel endet)

    // Handhabung von Eingaben (1-20 oder 25)
    const handleScoreInput = (number) => {
        if (currentThrows.length >= 3 || winnerIndex !== null) return; // Blockiere Eingabe, wenn bereits 3 Würfe oder Gewinner feststehen

        // 25 kann nicht mit Triple multipliziert werden
        if (number === 25 && multiplier > 2) {
            alert('25 kann nur als Single oder Double geworfen werden.');
            return;
        }

        // Neuen Wurf hinzufügen
        const throwValue = number * multiplier;
        setCurrentThrows([...currentThrows, throwValue]);
    };

    // Rückgängig machen der letzten Eingabe
    const undoLastThrow = () => {
        const updatedThrows = [...currentThrows];
        updatedThrows.pop();
        setCurrentThrows(updatedThrows);
    };

    // Überprüfen, ob ein Spieler genau 0 Punkte hat und das Spiel gewinnen kann (nur mit Double)
    const checkForBustOrWinner = (newScore) => {
        if (newScore < 0 || newScore === 1) {
            return 'bust'; // Überschossen: unter 0 Punkte oder Punktestand 1
        }

        if (newScore === 0 && multiplier !== 2) {
            return 'bust'; // Genau 0 Punkte, aber ohne Double
        }

        if (newScore === 0 && multiplier === 2) {
            return 'winner'; // Gewinner mit genau 0 Punkten und Double
        }

        return null; // Kein Bust oder Gewinner
    };

    // Spieler wechseln
    const switchToNextPlayer = () => {
        setCurrentThrows([]); // Würfe zurücksetzen
        setCurrentPlayerIndex((currentPlayerIndex + 1) % players.length); // Nächster Spieler
    };

    // Zug abschließen
    const completeTurn = () => {
        if (winnerIndex !== null) return; // Falls ein Gewinner existiert, beende das Spiel

        const totalScore = currentThrows.reduce((sum, value) => sum + value, 0);
        const currentScore = scores[currentPlayerIndex];
        const newScore = currentScore - totalScore;

        // Prüfen auf Bust oder Gewinner
        const result = checkForBustOrWinner(newScore);

        if (result === 'bust') {
            alert('Überschossen! Deine Runde ist vorbei.');
            switchToNextPlayer(); // Wechsel zum nächsten Spieler
            return;
        }

        if (result === 'winner') {
            setWinnerIndex(currentPlayerIndex); // Gewinner festlegen
            return;
        }

        // Punkte aktualisieren
        const updatedScores = [...scores];
        updatedScores[currentPlayerIndex] = newScore;
        setScores(updatedScores);

        // Würfe speichern
        const updatedThrowsHistory = [...throwsHistory];
        updatedThrowsHistory[currentPlayerIndex] = [
            ...updatedThrowsHistory[currentPlayerIndex],
            ...currentThrows,
        ];
        setThrowsHistory(updatedThrowsHistory);

        // Spieler wechseln
        switchToNextPlayer(); // Wechsel zum nächsten Spieler
    };

    // Berechnung des 3-Dart-Average für einen Spieler
    const calculate3DartAverage = (playerIndex) => {
        const playerThrows = throwsHistory[playerIndex];
        if (playerThrows.length === 0) return 0; // Keine Würfe = Durchschnitt 0

        const totalPoints = playerThrows.reduce((sum, value) => sum + value, 0);

        // Berechne die Anzahl der vollständigen Züge (jeder Zug sollte 3 Würfe haben)
        const numberOfTurns = Math.ceil(playerThrows.length / 3);

        // Berechne den 3-Dart-Average basierend auf der Anzahl vollständiger Züge
        return ((totalPoints / (numberOfTurns * 3)) * 3).toFixed(2);
    };


    // Ergebnisse eines gespeicherten Spielers in der Datenbank speichern
    const savePlayerGameData = async (player, index) => {
        if (player.id) {
            try {
                await updateDoc(doc(db, 'players', player.id), {
                    games: arrayUnion({
                        gameMode,
                        finalScore: scores[index],
                        average: calculate3DartAverage(index),
                        date: new Date().toISOString(),
                    }),
                });
                console.log(`Ergebnisse von ${player.alias} wurden gespeichert.`);
            } catch (error) {
                console.error(`Fehler beim Speichern der Ergebnisse von ${player.alias}:`, error);
            }
        }
    };

    // Speichert Ergebnisse aller gespeicherten Spieler
    const saveGameResults = async () => {
        for (let i = 0; i < players.length; i++) {
            if (players[i].id) {
                await savePlayerGameData(players[i], i);
            }
        }
        alert('Spielergebnisse wurden gespeichert!');
    };

    return (
        <div className="container my-4 text-success">
            <div className="row">
                {/* Linker Bereich: Aktueller Spieler */}
                <div className="col-md-8">
                    {winnerIndex === null ? (
                        <>
                            <h2 className="text-center">Spieler: {players[currentPlayerIndex].alias}</h2>
                            <h3 className="text-center">Punkte: {scores[currentPlayerIndex]}</h3>
                        </>
                    ) : (
                        <div className="text-center">
                            <h1 className="display-4 text-success">🎉 {players[winnerIndex].alias} hat gewonnen! 🎉</h1>
                            <button className="btn btn-primary mt-3" onClick={saveGameResults}>
                                Ergebnisse speichern
                            </button>
                        </div>
                    )}

                    {/* Punkte-Eingabebuttons */}
                    <div className="d-flex flex-wrap justify-content-center my-4">
                        {Array.from({ length: 20 }, (_, i) => i + 1)
                            .concat(25)
                            .map((number) => (
                                <button
                                    key={number}
                                    className="btn btn-secondary m-1"
                                    style={{ width: '60px', height: '60px' }}
                                    onClick={() => handleScoreInput(number)}
                                    disabled={winnerIndex !== null}
                                >
                                    {number}
                                </button>
                            ))}
                    </div>

                    {/* Multiplikator */}
                    <div className="d-flex justify-content-center mb-4">
                        {['Single', 'Double', 'Triple'].map((type, index) => (
                            <button
                                key={type}
                                className={`btn mx-2 ${multiplier === index + 1 ? 'btn-primary' : 'btn-outline-primary'}`}
                                onClick={() => setMultiplier(index + 1)}
                                disabled={winnerIndex !== null}
                            >
                                {type}
                            </button>
                        ))}
                    </div>

                    {/* Aktuelle Würfe */}
                    <div className="text-center my-3">
                        <h4>Aktuelle Eingaben:</h4>
                        <p>{currentThrows.join(' + ') || 'Noch keine Eingabe'}</p>
                    </div>

                    {/* Aktionen */}
                    <div className="d-flex justify-content-center">
                        <button
                            className="btn btn-warning mx-2"
                            onClick={undoLastThrow}
                            disabled={currentThrows.length === 0 || winnerIndex !== null}
                        >
                            Letzten Wurf zurücknehmen
                        </button>
                        <button
                            className="btn btn-success mx-2"
                            onClick={completeTurn}
                            disabled={currentThrows.length === 0 || winnerIndex !== null}
                        >
                            Zug abschließen
                        </button>
                    </div>
                </div>

                {/* Rechter Bereich: Punktestände */}
                <div className="col-md-4">
                    <h3 className="text-center">Aktuelle Punktestände</h3>
                    <ul className="list-group">
                        {players.map((player, index) => (
                            <li
                                key={index}
                                className={`list-group-item d-flex justify-content-between ${
                                    currentPlayerIndex === index ? 'list-group-item-primary' : ''
                                } ${winnerIndex === index ? 'list-group-item-success' : ''}`}
                            >
                                <span>
                                    {player.alias} (Ø {calculate3DartAverage(index)})
                                </span>
                                <span>{scores[index]}</span>
                            </li>
                        ))}
                    </ul>
                </div>
            </div>
            <BackToHomeButton />
        </div>
    );
};

export default X01GameView;