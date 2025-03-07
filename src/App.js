import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import HomePage from './pages/HomePage';
import GameSelectionPage from './pages/GameSelectionPage';
import PlayerCreationPage from './pages/PlayerCreationPage';
import PlayerStatsPage from './pages/PlayerStatsPage';
import SettingsPage from './pages/SettingsPage';
import X01Game from './components/games/X01Game';
import X01GameView from './components/games/X01GameView';
import AroundTheClock from './components/games/AroundTheClock';
import HighScore from './components/games/HighScore';



const App = () => {
  return (
      <Router>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/game-selection" element={<GameSelectionPage />} />
          <Route path="/player-creation" element={<PlayerCreationPage />} />
          <Route path="/player-stats" element={<PlayerStatsPage />} />
          <Route path="/settings" element={<SettingsPage />} />
          <Route path="/X01" element={<X01Game />} />
          <Route path="/X01Game" element={<X01GameView />} />
            <Route path="/AroundTheClock" element={<AroundTheClock />} />
            <Route path="/HighScore" element={<HighScore />} />
        </Routes>
      </Router>
  );
};

export default App;