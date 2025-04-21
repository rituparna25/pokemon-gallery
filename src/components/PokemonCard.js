import React from 'react';
import './PokemonCard.css';

const PokemonCard = ({ pokemon }) => {
  const { name, sprites, stats, types, moves } = pokemon;
  return (
    <div className="pokemon-card-classic">
      <div className="card-header">
        <span className="pokemon-name">{name.charAt(0).toUpperCase() + name.slice(1)}</span>
        <span className="pokemon-hp">HP {stats[0]?.base_stat}</span>
      </div>
      <img src={sprites.front_default} alt={name} className="pokemon-img" />
      <div className="card-body">
        <div className="pokemon-type">Type: {types[0]?.type.name}</div>
        <div className="pokemon-move">Move: {moves[0]?.move.name}</div>
      </div>
    </div>
  );
};

export default PokemonCard;
