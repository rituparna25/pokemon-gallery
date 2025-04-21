import React, { useEffect, useState, useRef, useCallback } from "react";
import axios from "axios";
import PokemonCard from "../components/PokemonCard";
import SearchBar from "../components/SearchBar";
import "../pages/Home.css";
import { useLocation } from "react-router-dom";

const Home = () => {
  const [pokemonList, setPokemonList] = useState([]);
  const [filteredPokemon, setFilteredPokemon] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [nextUrl, setNextUrl] = useState("https://pokeapi.co/api/v2/pokemon?limit=20");
  const [allNames, setAllNames] = useState([]);
  
  const location = useLocation();

  useEffect(() => {
    if (location.pathname === "/") {
    setSearchTerm("");
    setFilteredPokemon([]);
    }
  }, [location]);
  

  const fetchPokemon = useCallback (async () => {   
    if (!nextUrl) return; 
  
    const response = await axios.get(nextUrl);
    setNextUrl(response.data.next);
  
    const details = await Promise.all(
      response.data.results.map((p) => axios.get(p.url).then((res) => res.data)) 
    );
  
    setPokemonList((prev) => {
      const existingIds = new Set(prev.map(p => p.id));
      const uniqueNew = details.filter(p => !existingIds.has(p.id));
      return [...prev, ...uniqueNew];
    });
  },[nextUrl]);

  useEffect(() => {
    fetchPokemon();
    fetchAllNames();
  }, [fetchPokemon]); // eslint-disbable-line react-hooks/exhaustive-deps
  

  const fetchAllNames = async () => {
    try {
      const res = await axios.get("https://pokeapi.co/api/v2/pokemon?limit=100000");
      setAllNames(res.data.results); 
    } catch (error) {
      console.error("Error loading Pokémon names list", error);
    }
  };

  const handleSearch = async (term) => {
    setSearchTerm(term);

    if (!term) {
      setFilteredPokemon([]);
      return;
    }

    const matched = allNames
      .filter(p => p.name.toLowerCase().includes(term.toLowerCase()))
      .slice(0, 20);

    if (matched.length === 0) {
      setFilteredPokemon([]);
      return;
    }

    try {
      const details = await Promise.all(
        matched.map(p => axios.get(p.url).then(res => res.data))
      );
      setFilteredPokemon(details);
    } catch (err) {
      console.error("Error fetching matched Pokémon", err);
      setFilteredPokemon([]); 
    }
  };

  const observer = useRef();
  const lastCardRef = useCallback(
    (node) => {
      if (observer.current) observer.current.disconnect();
      observer.current = new IntersectionObserver(entries => {  
        if (entries[0].isIntersecting && !searchTerm) {
          fetchPokemon();
        }
      });
      if (node) observer.current.observe(node);
    },
    [searchTerm,fetchPokemon]
  );

  const displayList = searchTerm ? filteredPokemon : pokemonList;

  return (
    <div className="home-container">
      <SearchBar searchTerm={searchTerm} onSearch={handleSearch} />

      <div className="card-grid">
        {displayList.length > 0 ? (
          displayList.map((pokemon, index) =>
            index === displayList.length - 1 && !searchTerm ? (
              <div ref={lastCardRef} key={`${pokemon.id}-${pokemon.name}`}>
                <PokemonCard pokemon={pokemon} />
              </div>
            ) : (
              <PokemonCard key={`${pokemon.id}-${pokemon.name}`} pokemon={pokemon} />
            )
          )
        ) : (
          <div className="not-found">Pokémon not found</div>
        )}
      </div>
    </div>
  );
};

export default Home;
