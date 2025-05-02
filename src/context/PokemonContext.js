import React, { createContext, useState, useEffect, useCallback, useMemo } from 'react';
import axios from 'axios';

export const PokemonContext = createContext();

export const PokemonProvider = ({ children }) => {
  const [pokemonList, setPokemonList] = useState([]);
  const [filteredPokemon, setFilteredPokemon] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [types, setTypes] = useState([]);
  
  // Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(20);
  
  // Filtering and Sorting
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedTypes, setSelectedTypes] = useState([]);
  const [sortOption, setSortOption] = useState('id-asc');
  
  // Favorites
  const [favorites, setFavorites] = useState(() => {
    const savedFavorites = localStorage.getItem('pokemonFavorites');
    return savedFavorites ? JSON.parse(savedFavorites) : [];
  });

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

  // Save favorites to localStorage
  useEffect(() => {
    localStorage.setItem('pokemonFavorites', JSON.stringify(favorites));
  }, [favorites]);

  // Filter Pokemon when search term or types change
  useEffect(() => {
    if (!searchTerm && selectedTypes.length === 0) {
      setFilteredPokemon([]);
      return;
    }

    const filtered = pokemonList.filter((pokemon) => {
      const matchesName = pokemon.name.toLowerCase().includes(searchTerm.toLowerCase());
      
      // Check if pokemon matches any of the selected types (when types are selected)
      const matchesTypes = selectedTypes.length === 0 || 
        selectedTypes.every(type => 
          pokemon.types.some(t => t.type.name === type)
        );
      
      return matchesName && matchesTypes;
    });

    setFilteredPokemon(filtered);
    setCurrentPage(1); // Reset to first page when filter changes
  }, [searchTerm, selectedTypes, pokemonList]);

  // Sort function
  const sortPokemon = useCallback((pokemonArray) => {
    const [criteria, direction] = sortOption.split('-');
    
    return [...pokemonArray].sort((a, b) => {
      let valueA, valueB;
      
      if (criteria === 'id') {
        valueA = a.id;
        valueB = b.id;
      } else if (criteria === 'name') {
        valueA = a.name;
        valueB = b.name;
      }
      
      if (direction === 'asc') {
        return valueA > valueB ? 1 : -1;
      } else {
        return valueA < valueB ? 1 : -1;
      }
    });
  }, [sortOption]);

  // Get current pokemon for pagination
  const currentPokemon = useMemo(() => {
    const displayList = (searchTerm || selectedTypes.length > 0) ? filteredPokemon : pokemonList;
    const sortedPokemon = sortPokemon(displayList);
    
    const indexOfLastPokemon = currentPage * itemsPerPage;
    const indexOfFirstPokemon = indexOfLastPokemon - itemsPerPage;
    
    return sortedPokemon.slice(indexOfFirstPokemon, indexOfLastPokemon);
  }, [currentPage, itemsPerPage, filteredPokemon, pokemonList, searchTerm, selectedTypes, sortPokemon]);

  // Pagination functionality
  const totalPages = useMemo(() => {
    const displayList = (searchTerm || selectedTypes.length > 0) ? filteredPokemon : pokemonList;
    return Math.ceil(displayList.length / itemsPerPage);
  }, [filteredPokemon, pokemonList, searchTerm, selectedTypes, itemsPerPage]);

  // Favorites management
  const toggleFavorite = useCallback((pokemonId) => {
    setFavorites(prevFavorites => {
      if (prevFavorites.includes(pokemonId)) {
        return prevFavorites.filter(id => id !== pokemonId);
      } else {
        return [...prevFavorites, pokemonId];
      }
    });
  }, []);

  const isFavorite = useCallback((pokemonId) => {
    return favorites.includes(pokemonId);
  }, [favorites]);

  // Get random pokemon
  const getRandomPokemon = useCallback(() => {
    const randomIndex = Math.floor(Math.random() * pokemonList.length);
    return pokemonList[randomIndex]?.id;
  }, [pokemonList]);

  return (
    <PokemonContext.Provider 
      value={{
        pokemonList,
        loading,
        error,
        types,
        searchTerm,
        setSearchTerm,
        selectedTypes,
        setSelectedTypes,
        currentPokemon,
        currentPage,
        setCurrentPage,
        totalPages,
        itemsPerPage,
        setItemsPerPage,
        sortOption,
        setSortOption,
        favorites,
        toggleFavorite,
        isFavorite,
        getRandomPokemon
      }}
    >
      {children}
    </PokemonContext.Provider>
  );
};

export const usePokemon = () => {
  const context = React.useContext(PokemonContext);
  if (context === undefined) {
    throw new Error('usePokemon must be used within a PokemonProvider');
  }
  return context;
};