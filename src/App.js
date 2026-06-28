import './App.css';
import Navbar from './components/Navbar';
import Home from './components/Home';

function App() {
  const title= "GitScan";
  return (
    <div className="App">
      <Navbar></Navbar>
      <Home></Home>
      <div className="content">
        <h1>
          {title}
        </h1>
      </div>
    </div>
  );
}

export default App;
