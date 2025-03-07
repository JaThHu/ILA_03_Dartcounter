import React, {useEffect, useState} from 'react';
import {getFirestore, collection, getDocs} from 'firebase/firestore';
import {
    Chart as ChartJS,
    ArcElement,
    Tooltip,
    Legend,
    CategoryScale,
    LinearScale,
    Title,
    PointElement,
    LineElement
} from 'chart.js';
import {Line} from 'react-chartjs-2';
import 'bootstrap/dist/css/bootstrap.min.css';
import BackToHomeButton from "../components/common/BackToHome";


// Register Chart.js components
ChartJS.register(ArcElement, Tooltip, Legend, CategoryScale, LinearScale, Title, PointElement, LineElement);

const PlayerStatsPage = () => {
    const db = getFirestore();
    const [players, setPlayers] = useState([]);
    const [loading, setLoading] = useState(true);

    // Hole gespeicherte Spieler aus der Datenbank
    useEffect(() => {
        const fetchPlayers = async () => {
            try {
                const querySnapshot = await getDocs(collection(db, 'players'));
                const playerData = [];
                querySnapshot.forEach((doc) => {
                    playerData.push({id: doc.id, ...doc.data()});
                });
                setPlayers(playerData);
                setLoading(false);
            } catch (error) {
                console.error('Fehler beim Laden der Spieler:', error);
                setLoading(false);
            }
        };

        fetchPlayers();
    }, [db]);

    // Durchschnittsberechnung für Spiele
    const calculateAverage = (games) => {
        if (!games || games.length === 0) return 0;

        // Sicherstellen, dass jedes Spiel einen average-Wert hat
        const validGames = games.filter(game => game && typeof game.average === 'number');

        if (validGames.length === 0) return 0;

        const totalAverage = validGames.reduce((sum, game) => sum + game.average, 0);
        return (totalAverage / validGames.length).toFixed(2);
    };


    // Daten für das Diagramm eines Spielers vorbereiten
    const prepareChartData = (games) => {
        if (!games || games.length === 0) return null;

        const labels = games.map((game, index) => `Game ${index + 1}`);
        const data = games.map((game) => game.average || 0);

        return {
            labels,
            datasets: [
                {
                    label: '3-Dart-Average',
                    data,
                    fill: true,
                    backgroundColor: 'rgba(75,192,192,0.2)',
                    borderColor: 'rgba(75,192,192,1)',
                    borderWidth: 1,
                },
            ],
        };
    };

    if (loading) {
        return (
            <div className="container mt-5">
                <h2>Spielerdaten werden geladen...</h2>
            </div>
        );
    }

    return (
        <div className="container my-5">
            <h1 className="mb-4 text-center text-success fw-bold">Spielerstatistiken</h1>
            {players.length === 0 ? (
                <p className="text-center">Keine gespeicherten Spieler gefunden.</p>
            ) : (
                players.map((player) => (
                    <div key={player.id} className="card mb-4">
                        <div className="card-header text-center">
                            <h3>{player.name}</h3> {/* Spielername über den Statistiken */}
                        </div>
                        <div className="card-body">
                            <div className="mb-3">
                                <p><strong>Spiele gespielt:</strong> {player.games ? player.games.length : 0}</p>
                                <p><strong>Durchschnittlicher Average:</strong> {calculateAverage(player.games)}</p>
                            </div>
                            {player.games && player.games.length > 0 && (
                                <div className="mt-4 text-center">
                                    <h5>3-Dart-Average (Verlauf)</h5>
                                    <div style={{
                                        width: '80%',
                                        margin: '0 auto'
                                    }}> {/* Diagramm eingebettet und kleiner */}
                                        <Line
                                            data={prepareChartData(player.games)}
                                            options={{
                                                responsive: true,
                                                maintainAspectRatio: false, // Kontrolliert, dass das Diagramm flach bleibt
                                                plugins: {
                                                    legend: {
                                                        position: 'top',
                                                    },
                                                    title: {
                                                        display: true,
                                                        text: '3-Dart-Average Verlauf',
                                                    },
                                                },
                                            }}
                                            height={200} // Höhe des Diagramms reduziert
                                        />
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                ))
            )}
            <BackToHomeButton/>
        </div>
    );
};

export default PlayerStatsPage;