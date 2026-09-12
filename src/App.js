import Navbar from './components/Navbar';
import Home from './components/Home';
import {BrowserRouter, Routes, Route} from 'react-router-dom';
import ProfilePage from './components/ProfilePage';
import ScorePage from './components/ScorePage';
import ActionPage from './components/ActionPage';

function App() {
  return (
    <BrowserRouter>
      <div className="App">
        <Navbar />
        <div className="content">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/profile" element={<ProfilePage />} />
            <Route path="/results" element={<ScorePage />} />
            <Route path="/action-plan" element={<ActionPage />} />
          </Routes>
        </div>
      </div>
    </BrowserRouter>
  );
}

export default App;
