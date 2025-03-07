import React from 'react';
import { useNavigate } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css'; // Bootstrap Styling
import BackToHomeButton from "../components/common/BackToHome";


const GameSelectionPage = () => {
    const navigate = useNavigate();

    return (
        <div className="container text-center my-5">
            <h1 className="mb-4 display-4 text-success fw-bold">Wähle dein Darts-Spiel</h1>
            <div className="row justify-content-center">
                <div className="col-6 col-md-4 mb-3">
                    <button
                        className="btn btn-primary btn-lg w-100"
                        onClick={() => navigate('/X01')}
                    >
                        🎯 X01 (301/501)
                    </button>
                </div>
                <div className="col-6 col-md-4 mb-3">
                    <button
                        className="btn btn-success btn-lg w-100"
                        onClick={() => navigate('/AroundTheClock')}
                    >
                        ⏰ Around The Clock
                    </button>
                </div>
                <div className="col-6 col-md-4 mb-3">
                    <button
                        className="btn btn-warning btn-lg w-100"
                        onClick={() => navigate('/HighScore')}
                    >
                        📈 Highscore
                    </button>
                </div>
            </div>
            <BackToHomeButton />
        </div>
    );
};

export default GameSelectionPage;