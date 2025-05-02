import React from "react";
import PokemonCard from "../components/PokemonCard";
import SearchBar from "../components/SearchBar";
import TypeFilter from "../components/TypeFilter";
import SortOptions from "../components/SortOptions";
import Pagination from "../components/Pagination";
import { usePokemon } from "../context/PokemonContext";
import { useNavigate } from 'react-router-dom';
import "../pages/Home.css";


const Home = () => {
  const { 
    currentPokemon, 
    searchTerm, 
    setSearchTerm, 
    types, 
    selectedTypes, 
    setSelectedTypes,
    sortOption,
    setSortOption,
    loading, 
    error,
    getRandomPokemon
  } = usePokemon();

  const navigate = useNavigate();
  const handleSearch = (term) => {
    setSearchTerm(term);
  };

  const handleTypeFilter = (types) => {
    setSelectedTypes(types);
  };

  const handleSortChange = (option) => {
    setSortOption(option);
  };

  const handleRandomPokemon = () => {
    const randomId = getRandomPokemon();
    if (randomId) {
      window.location.href = `/pokemon/${randomId}`;
    }
  };

  if (loading) {
    return (
      <div className="home-container">
        <div className="loading-container">
          <div className="loading-spinner"></div>
          <p>Loading Pokémon...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="home-container">
        <div className="error-container">
          <p>{error}</p>
          <button onClick={() => window.location.reload()}>Try Again</button>
        </div>
      </div>
    );
  }

  return (
    <div className="home-container">
      {/* Reorganized search controls - all in one row */}
      <div className="search-controls-container">
        <SearchBar searchTerm={searchTerm} onSearch={handleSearch} />
        <SortOptions 
          sortOption={sortOption}
          onSortChange={handleSortChange}
        />
        <button 
          className="random-pokemon-btn"
          onClick={handleRandomPokemon}
          title="View a random Pokémon"
        >
          Random Pokémon
        </button>
      </div>
      
      {/* Type filter moved up, closer to the search controls */}
      <TypeFilter 
        types={types} 
        selectedTypes={selectedTypes} 
        onTypeSelect={handleTypeFilter} 
      />

      <div className="view-tabs">
        <button className="view-tab active">All Pokémon</button>
        <button className="view-tab" onClick={() => navigate('/favorites')}>
      Favorites
    </button>
      </div>

      <div className="card-grid">
        {currentPokemon.length > 0 ? (
          currentPokemon.map((pokemon) => (
            <PokemonCard key={`${pokemon.id}-${pokemon.name}`} pokemon={pokemon} />
          ))
        ) : (
          <div className="not-found">No Pokémon found matching your filters</div>
        )}
      </div>
      
      <Pagination />
    </div>
  );
};

export default Home;