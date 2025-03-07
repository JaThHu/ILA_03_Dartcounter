import React, {useState} from 'react';
import {getFirestore, doc, setDoc} from 'firebase/firestore';
import 'bootstrap/dist/css/bootstrap.min.css';
import BackToHomeButton from "../components/common/BackToHome";
import {db} from "../firebase";


const PlayerCreationPage = () => {
    const [playerName, setPlayerName] = useState('');
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');

    // Firebase-Firestore initialisieren
    const db = getFirestore();

    // Spielerprofil speichern
    const handleSavePlayerProfile = async () => {
        if (!playerName) {
            // Validierung: Spielername darf nicht leer sein
            setError('Bitte geben Sie einen Spielernamen ein.');
            setSuccess('');
            return;
        }

        try {
            // Spielerprofil in der Firestore-Datenbank speichern
            const playerId = Date.now().toString(); // Beispiel: Eindeutige ID basierend auf der Zeit
            await setDoc(doc(db, 'players', playerId), {
                name: playerName,
                createdAt: new Date().toISOString(),
            });

            // Erfolgsnachricht anzeigen
            setError('');
            setSuccess('Spielerprofil erfolgreich gespeichert!');
            setPlayerName(''); // Eingabe zurücksetzen
        } catch (err) {
            console.error(err);
            setError('Fehler beim Speichern des Spielerprofils.');
            setSuccess('');
        }
    };

    return (
        <div className="container my-5">
            <h1 className="text-center fw-bold text-success">Spielerprofilerstellung</h1>

            <div className="my-4">
                <div className="mb-3">
                    <label htmlFor="playerName" className="form-label text-success">Spielername</label>
                    <input
                        type="text"
                        id="playerName"
                        className="form-control"
                        value={playerName}
                        onChange={(e) => setPlayerName(e.target.value)}
                        placeholder="Spielername eingeben"
                        required
                    />
                </div>
                <button className="btn btn-success d-block mx-auto" onClick={handleSavePlayerProfile}>
                    Profil speichern
                </button>
            </div>

            {/* Feedback anzeigen */}
            {error && <div className="alert alert-danger mt-4">{error}</div>}
            {success && <div className="alert alert-success mt-4">{success}</div>}
            <BackToHomeButton/>
        </div>
    );
};

export default PlayerCreationPage;