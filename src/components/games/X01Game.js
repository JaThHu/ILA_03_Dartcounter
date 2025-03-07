import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getFirestore, collection, getDocs } from 'firebase/firestore';
import 'bootstrap/dist/css/bootstrap.min.css';
import BackToHomeButton from "../common/BackToHome";


const X01Game = () => {
    const navigate = useNavigate();

    // Firebase-Firestore initialisieren
    const db = getFirestore();

    // States
    const [numPlayers, setNumPlayers] = useState(2); // Standardmäßig 2 Spieler
    const [players, setPlayers] = useState([]); // Spieler-Liste (entweder temporär oder aus Firebase)
    const [savedProfiles, setSavedProfiles] = useState([]); // Gespeicherte Profile aus der Datenbank
    const [gameMode, setGameMode] = useState(301); // Standardspielmodus 301

    // Gespeicherte Profile aus Firebase laden
    useEffect(() => {
        const fetchProfiles = async () => {
            const profilesSnapshot = await getDocs(collection(db, 'players'));
            const profiles = profilesSnapshot.docs.map((doc) => ({
                id: doc.id,
                ...doc.data(),
            }));
            setSavedProfiles(profiles);
        };

        fetchProfiles();
    }, [db]);

    // Spieleranzahl ändern
    const handleNumPlayersChange = (e) => {
        const count = Number(e.target.value);
        setNumPlayers(count);

        // Spielerliste anpassen
        const updatedPlayers = players.slice(0, count); // Kürze die Spieler-Liste, falls nötig
        while (updatedPlayers.length < count) {
            updatedPlayers.push({ alias: '', id: null }); // Hinzufügen neuer Spieler
        }
        setPlayers(updatedPlayers);
    };

    // Alias eines Spielers ändern oder gespeichertes Profil auswählen
    const handlePlayerUpdate = (index, field, value) => {
        const updatedPlayers = [...players];
        updatedPlayers[index] = {
            ...updatedPlayers[index],
            [field]: value,
        };

        // Wenn ein Profil ausgewählt wurde, übernehme den gespeicherten Namen
        if (field === 'id') {
            const selectedProfile = savedProfiles.find((profile) => profile.id === value);
            updatedPlayers[index].alias = selectedProfile ? selectedProfile.name : '';
        }

        setPlayers(updatedPlayers);
    };

    // Prüfen, ob alle Spieler einen Namen haben
    const allPlayersHaveNames = () => {
        if (players.length < numPlayers) return false;
        return players.every(player => player.alias && player.alias.trim() !== '');
    };

    // Spiel starten
    const handleStartGame = () => {
        if (allPlayersHaveNames()) {
            navigate('/X01Game', { state: { gameMode, players } });
        } else {
            alert('Bitte gib für jeden Spieler einen Namen ein!');
        }
    };

    return (
        <div className="container my-5">
            <h1 className="text-center display-4 mb-4 fw-bold text-success">X01 Spiel</h1>
            <form>
                {/* Spieleranzahl auswählen */}
                <div className="mb-4">
                    <label htmlFor="numPlayers" className="form-label text-success">
                        Anzahl der Spieler:
                    </label>
                    <select
                        id="numPlayers"
                        className="form-select"
                        value={numPlayers}
                        onChange={handleNumPlayersChange}
                    >
                        {Array.from({ length: 9 }, (_, i) => i + 2).map((num) => (
                            <option key={num} value={num}>
                                {num} Spieler
                            </option>
                        ))}
                    </select>
                </div>

                {/* Spieler auswählen */}
                <div className="mb-4 text-success">
                    <h5>Spieler-Auswahl:</h5>
                    {Array.from({ length: numPlayers }).map((_, index) => (
                        <div key={index} className="mb-3">
                            <label htmlFor={`player${index}`} className="form-label">
                                Spieler {index + 1}:
                            </label>
                            <select
                                id={`player${index}`}
                                className="form-select"
                                value={players[index]?.id || ''}
                                onChange={(e) => handlePlayerUpdate(index, 'id', e.target.value)}
                            >
                                <option value="">Profil auswählen...</option>
                                {savedProfiles.map((profile) => (
                                    <option key={profile.id} value={profile.id}>
                                        {profile.name}
                                    </option>
                                ))}
                            </select>
                            <input
                                type="text"
                                className="form-control mt-2"
                                placeholder="Oder Spielername eingeben"
                                value={players[index]?.alias || ''}
                                onChange={(e) => handlePlayerUpdate(index, 'alias', e.target.value)}
                                required
                            />
                        </div>
                    ))}
                </div>

                {/* Spielmodus auswählen */}
                <div className="mb-4">
                    <label htmlFor="gameMode" className="form-label text-success">
                        Spielmodus:
                    </label>
                    <select
                        id="gameMode"
                        className="form-select"
                        value={gameMode}
                        onChange={(e) => setGameMode(Number(e.target.value))}
                    >
                        <option value="301">301</option>
                        <option value="501">501</option>
                        <option value="701">701</option>
                    </select>
                </div>

                {/* Spiel starten */}
                <button
                    type="button"
                    className="btn btn-success btn-lg"
                    onClick={handleStartGame}
                    disabled={!allPlayersHaveNames()}
                >
                    Spiel starten
                </button>
            </form>

            <div className="mt-4">
                <BackToHomeButton />
            </div>
        </div>
    );
};

export default X01Game;