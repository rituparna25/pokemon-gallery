import React from "react";
import PokemonCard from "../components/PokemonCard";
import { usePokemon } from "../context/PokemonContext";
import { Link } from "react-router-dom";
import "./Favorites.css";


const Favorites = () => {
  const { pokemonList, favorites, loading, error } = usePokemon();
  
  // Get favorite pokemon from the full list
  const favoritePokemon = pokemonList.filter(pokemon => 
    favorites.includes(pokemon.id)
  );

  if (loading) {
    return (
      <div className="favorites-container">
        <div className="loading-container">
          <div className="loading-spinner"></div>
          <p>Loading Pokémon...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="favorites-container">
        <div className="error-container">
          <p>{error}</p>
          <button onClick={() => window.location.reload()}>Try Again</button>
        </div>
      </div>
    );
  }

  return (
    <div className="favorites-container">
      <div className="favorites-header">
      </div>

      <div className="view-tabs">
        <Link to="/" className="view-tab">All Pokémon</Link>
        <button className="view-tab active">Favorites</button>
      </div>

      {favoritePokemon.length > 0 ? (
        <div className="card-grid">
          {favoritePokemon.map((pokemon) => (
            <PokemonCard key={`${pokemon.id}-${pokemon.name}`} pokemon={pokemon} />
          ))}
        </div>
      ) : (
        <div className="no-favorites">
          <p>You haven't added any Pokémon to your favorites yet!</p>
          <p>Click the ☆ on any Pokémon card to add it to your favorites.</p>
          <Link to="/" className="find-pokemon-btn">Find Pokémon</Link>
        </div>
      )}
    </div>
  );
};

export default Favorites;