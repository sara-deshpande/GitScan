import Navbar from './components/Navbar';
import Home from './components/Home';
import {BrowserRouter, Routes, Route } from 'react-router-dom';

function App() {
  return (
    <div className="App">
      <Navbar></Navbar>
      <div className="content">
      <Home></Home>
      </div>
    </div>
  );
}

export default App;
