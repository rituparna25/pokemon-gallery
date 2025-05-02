import { useState, useEffect } from 'react';
import axios from 'axios';

const usePokemonDetail = (pokemonId) => {
  const [pokemon, setPokemon] = useState(null);
  const [species, setSpecies] = useState(null);
  const [evolution, setEvolution] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchPokemonDetails = async () => {
      if (!pokemonId) return;
      
      setLoading(true);
      setError(null);
      
      try {
        // Fetch basic pokemon data
        const pokemonResponse = await axios.get(`https://pokeapi.co/api/v2/pokemon/${pokemonId}`);
        setPokemon(pokemonResponse.data);
        
        // Fetch species data
        const speciesResponse = await axios.get(pokemonResponse.data.species.url);
        setSpecies(speciesResponse.data);
        
        // Fetch evolution chain
        const evolutionResponse = await axios.get(speciesResponse.data.evolution_chain.url);
        setEvolution(evolutionResponse.data);
        
        setLoading(false);
      } catch (err) {
        console.error('Error fetching Pokemon details:', err);
        setError('Failed to load Pokemon details. Please try again.');
        setLoading(false);
      }
    };
    
    fetchPokemonDetails();
  }, [pokemonId]);
  
  return { pokemon, species, evolution, loading, error };
};

export default usePokemonDetail;