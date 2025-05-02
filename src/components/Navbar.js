import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import './Navbar.css';


const Navbar = () => {
  const navigate = useNavigate();
  
  const handleLogoClick = (e) => {
    e.preventDefault();
    navigate('/', { replace: true });
  };

  return (
    <nav className="navbar">
      <div className="navbar-container">
        <Link to="/" className="nav-logo" onClick={handleLogoClick}>
          <span className="pokemon-logo-text">Pokémon Gallery</span>
        </Link>
      </div>
    </nav>
  );
};

export default Navbar;