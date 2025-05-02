import React from 'react';
import { Link } from 'react-router-dom';
import { usePokemon } from '../context/PokemonContext';
import './PokemonCard.css';



const PokemonCard = ({ pokemon }) => {
  const { name, sprites, types, id } = pokemon;
  const { toggleFavorite, isFavorite } = usePokemon();
  
  // Get all Pokemon types
  const pokemonTypes = types.map(type => 
    type.type.name.charAt(0).toUpperCase() + type.type.name.slice(1)
  ).join(", ");
  
  // Check if this pokemon is in favorites
  const favorite = isFavorite(id);
  
  const handleFavoriteClick = (e) => {
    e.preventDefault(); // Prevent triggering the Link
    toggleFavorite(id);
  };
  
  return (
    <Link to={`/pokemon/${id}`} className="pokemon-card-link">
      <div className="pokemon-card-classic">
        <div className="card-header">
          <span className="pokemon-name">{name.charAt(0).toUpperCase() + name.slice(1)}</span>
          <span className="pokemon-id">#{id}</span>
        </div>
        <div className="image-container">
          <img src={sprites.front_default} alt={name} className="pokemon-img" />
          <button 
            className={`favorite-button ${favorite ? 'favorited' : ''}`}
            onClick={handleFavoriteClick}
            title={favorite ? "Remove from favorites" : "Add to favorites"}
          >
            {favorite ? '★' : '☆'}
          </button>
        </div>
        <div className="card-body">
          <div className="pokemon-type">Type: {pokemonTypes}</div>
        </div>
      </div>
    </Link>
  );
};

export default React.memo(PokemonCard);