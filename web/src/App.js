import { Routes, Route } from 'react-router-dom';

// Routes
import Home from './pages/Home/index';
import Leaderboard from './pages/Leaderboard/index';
import Game from './pages/Game/index';
import EndGame from './pages/Game/End/index';

function App() {

  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path='/leaderboard' element={<Leaderboard />} />
      <Route path='/game' element={<Game />} />
      <Route path='/end' element={<EndGame />} />
    </Routes>
  );
}

export default App;
