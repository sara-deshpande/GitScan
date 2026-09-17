import Navbar from './components/Navbar';
import Home from './components/Home';
import {BrowserRouter, Routes, Route} from 'react-router-dom';
import ProfilePage from './components/ProfilePage';
import ScorePage from './components/ScorePage';
import ActionPage from './components/ActionPage';
import NotFound from './components/NotFound';

function App() {
  return (
    <BrowserRouter>
      <div className="App">
        <Navbar />
        <div className="content">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/profile/:username" element={<ProfilePage />} />
            <Route path="/results/:username" element={<ScorePage />} />
            <Route path="/action-plan/:username" element={<ActionPage />} />
            <Route path="*" element={<NotFound />}></Route>
          </Routes>
        </div>
      </div>
    </BrowserRouter>
  );
}

export default App;
