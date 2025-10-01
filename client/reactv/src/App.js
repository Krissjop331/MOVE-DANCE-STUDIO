import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { useDispatch, useSelector } from "react-redux";
import './App.css';

import Header from './components/Header/Header.jsx';
import Home from './pages/Home.js';
// import {Footer} from './components/Footer/Footer.jsx';

function App() {
  return (
    <Router>
      <div className="App">
        <Header />

        <Home/>
        {/* Other components/routes */}
      </div>
    </Router>
  );
}

export default App;
