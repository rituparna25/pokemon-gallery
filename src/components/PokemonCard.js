import React from 'react';
import './PokemonCard.css';

const PokemonCard = ({ pokemon }) => {
  const { name, sprites, types, id } = pokemon;
  
  // Get all Pokemon types
  const pokemonTypes = types.map(type => 
    type.type.name.charAt(0).toUpperCase() + type.type.name.slice(1)
  ).join(", ");
  
  return (
    <div className="pokemon-card-classic">
      <div className="card-header">
        <span className="pokemon-name">{name.charAt(0).toUpperCase() + name.slice(1)}</span>
        <span className="pokemon-id">#{id}</span>
      </div>
      <img src={sprites.front_default} alt={name} className="pokemon-img" />
      <div className="card-body">
        <div className="pokemon-type">Type: {pokemonTypes}</div>
      </div>
    </div>
  );
};

export default PokemonCard;