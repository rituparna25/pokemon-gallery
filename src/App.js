import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { PokemonProvider } from './context/PokemonContext';
import ErrorBoundary from './components/ErrorBoundary';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import Favorites from './pages/Favorites';
import PokemonDetail from './pages/PokemonDetail';
import ComparisonPage from './pages/ComparisonPage';
import './App.css';

function App() {
  return (
    <Router>
      <ErrorBoundary>
        <PokemonProvider>
          <Navbar />
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/favorites" element={<Favorites />} />
            <Route path="/pokemon/:id" element={<PokemonDetail />} />
            <Route path="/compare/:id" element={<ComparisonPage />} />
          </Routes>
        </PokemonProvider>
      </ErrorBoundary>
    </Router>
  );
}

export default App;