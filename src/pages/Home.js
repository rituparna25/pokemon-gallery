import React, { useEffect, useState } from "react";
import axios from "axios";
import PokemonCard from "../components/PokemonCard";
import SearchBar from "../components/SearchBar";
import TypeFilter from "../components/TypeFilter";
import "../pages/Home.css";

const Home = () => {
  const [pokemonList, setPokemonList] = useState([]);
  const [filteredPokemon, setFilteredPokemon] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedType, setSelectedType] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [types, setTypes] = useState([]);

  // Fetch Pokemon types for filter dropdown
  useEffect(() => {
    const fetchTypes = async () => {
      try {
        const response = await axios.get("https://pokeapi.co/api/v2/type");
        setTypes(response.data.results);
      } catch (err) {
        console.error("Error fetching Pokemon types:", err);
      }
    };
    fetchTypes();
  }, []);

  // Fetch first 150 Pokemon
  useEffect(() => {
    const fetchPokemon = async () => {
      setLoading(true);
      try {
        const response = await axios.get("https://pokeapi.co/api/v2/pokemon?limit=150");
        
        const details = await Promise.all(
          response.data.results.map((p) => axios.get(p.url).then((res) => res.data))
        );
        
        setPokemonList(details);
        setLoading(false);
      } catch (err) {
        console.error("Error fetching Pokemon:", err);
        setError("Failed to load Pokemon. Please try again later.");
        setLoading(false);
      }
    };
    
    fetchPokemon();
  }, []);

  // Filter Pokemon when search term or type changes
  useEffect(() => {
    if (!searchTerm && !selectedType) {
      setFilteredPokemon([]);
      return;
    }

    const filtered = pokemonList.filter((pokemon) => {
      const matchesName = pokemon.name.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesType = selectedType 
        ? pokemon.types.some(t => t.type.name === selectedType) 
        : true;
      
      return matchesName && matchesType;
    });

    setFilteredPokemon(filtered);
  }, [searchTerm, selectedType, pokemonList]);

  const handleSearch = (term) => {
    setSearchTerm(term);
  };

  const handleTypeFilter = (type) => {
    setSelectedType(type);
  };

  const displayList = (searchTerm || selectedType) ? filteredPokemon : pokemonList;

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
      <div className="filter-container">
        <SearchBar searchTerm={searchTerm} onSearch={handleSearch} />
        <TypeFilter types={types} selectedType={selectedType} onTypeSelect={handleTypeFilter} />
      </div>

      <div className="card-grid">
        {displayList.length > 0 ? (
          displayList.map((pokemon) => (
            <PokemonCard key={`${pokemon.id}-${pokemon.name}`} pokemon={pokemon} />
          ))
        ) : (
          <div className="not-found">No Pokémon found matching your filters</div>
        )}
      </div>
    </div>
  );
};

export default Home;