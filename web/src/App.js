import { Routes, Route } from 'react-router-dom';

// Routes
import Home from './pages/Home/index';
import Leaderboard from './pages/Leaderboard/index';

function App() {

  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path='/leaderboard' element={<Leaderboard />} />
    </Routes>
  );
}

export default App;
