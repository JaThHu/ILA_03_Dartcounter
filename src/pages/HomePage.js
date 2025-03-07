import React from 'react';
import { useNavigate } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css'; // Bootstrap Styling

const HomePage = () => {
    const navigate = useNavigate();

    return (
        <div className="container text-center my-5">
            <h1 className="mb-4 display-4 text-success fw-bold">Frickdart</h1>
            <div className="settings-container d-flex flex-column justify-content-center align-items-center  text-center
">
                <div className="col-6 col-md-4 mb-3">
                    <button
                        className="btn btn-primary btn-lg w-100"
                        onClick={() => navigate('/game-selection')}
                    >
                        🎮 Spielauswahl
                    </button>
                </div>
                <div className="col-6 col-md-4 mb-3">
                    <button
                        className="btn btn-success btn-lg w-100"
                        onClick={() => navigate('/player-creation')}
                    >
                        👤 Spieler erstellen
                    </button>
                </div>
                <div className="col-6 col-md-4 mb-3">
                    <button
                        className="btn btn-warning btn-lg w-100"
                        onClick={() => navigate('/player-stats')}
                    >
                        📊 Spielerstatistiken
                    </button>
                </div>
                <div className="col-6 col-md-4 mb-3">
                    <button
                        className="btn btn-secondary btn-lg w-100"
                        onClick={() => navigate('/settings')}
                    >
                        ⚙️ Einstellungen
                    </button>
                </div>
            </div>
        </div>
    );
};

export default HomePage;