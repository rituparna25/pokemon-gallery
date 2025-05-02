import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { usePokemon } from '../context/PokemonContext';
import usePokemonDetail from '../hooks/usePokemonDetail';
import './PokemonDetail.css';

const PokemonDetail = () => {
  const { id } = useParams();
  const { pokemon, species, evolution, loading, error } = usePokemonDetail(id);
  const { toggleFavorite, isFavorite } = usePokemon();
  const [activeTab, setActiveTab] = useState('stats');
  const [evolutionChain, setEvolutionChain] = useState([]);

  useEffect(() => {
    if (!evolution) return;

    const processEvolutionChain = () => {
      const chain = [];
      let currentEvolution = evolution.chain;

      // Process the first form
      chain.push({
        name: currentEvolution.species.name,
        url: currentEvolution.species.url,
        min_level: null
      });

      // Process subsequent evolutions
      while (currentEvolution.evolves_to?.length > 0) {
        currentEvolution = currentEvolution.evolves_to[0];
        
        const minLevel = currentEvolution.evolution_details?.[0]?.min_level || null;
        
        chain.push({
          name: currentEvolution.species.name,
          url: currentEvolution.species.url,
          min_level: minLevel
        });
      }

      return chain;
    };

    setEvolutionChain(processEvolutionChain());
  }, [evolution]);

  // If still loading, show loading spinner
  if (loading) {
    return (
      <div className="pokemon-detail-container">
        <div className="loading-container">
          <div className="loading-spinner"></div>
          <p>Loading Pokémon details...</p>
        </div>
      </div>
    );
  }

  // If there was an error, show error message
  if (error || !pokemon) {
    return (
      <div className="pokemon-detail-container">
        <div className="error-container">
          <p>{error || "Failed to load Pokémon details."}</p>
          <Link to="/">
            <button>Back to Home</button>
          </Link>
        </div>
      </div>
    );
  }

  // Get the pokemon description from flavor text entries
  const description = species?.flavor_text_entries?.find(
    entry => entry.language.name === 'en'
  )?.flavor_text || "No description available.";

  // Extract genus (category) from the species data
  const category = species?.genera?.find(
    genus => genus.language.name === 'en'
  )?.genus || "Unknown";

  // Format stats for easier display
  const stats = pokemon.stats.map(stat => ({
    name: stat.stat.name.replace('-', ' '),
    value: stat.base_stat
  }));

  // Check if this pokemon is in favorites
  const favorite = isFavorite(pokemon.id);

  return (
    <div className="pokemon-detail-container">
      <div className="pokemon-detail-card">
        <div className="detail-header">
          <Link to="/" className="back-button">&larr; Back</Link>
          <h1>{pokemon.name.charAt(0).toUpperCase() + pokemon.name.slice(1)}</h1>
          <button 
            className={`favorite-button-detail ${favorite ? 'favorited' : ''}`}
            onClick={() => toggleFavorite(pokemon.id)}
          >
            {favorite ? '★' : '☆'}
          </button>
        </div>
        
        <div className="detail-main">
          <div className="detail-image-section">
            <div className="detail-images">
              <img 
                src={pokemon.sprites.front_default} 
                alt={`${pokemon.name} front view`} 
                className="detail-image main-image"
              />
              {pokemon.sprites.back_default && (
                <img 
                  src={pokemon.sprites.back_default} 
                  alt={`${pokemon.name} back view`} 
                  className="detail-image secondary-image"
                />
              )}
            </div>
            
            <div className="pokemon-type-badges">
              {pokemon.types.map(type => (
                <span 
                  key={type.type.name} 
                  className={`type-badge ${type.type.name}`}
                >
                  {type.type.name.charAt(0).toUpperCase() + type.type.name.slice(1)}
                </span>
              ))}
            </div>

            <div className="pokemon-basic-info">
              <div className="info-item">
                <span className="info-label">Height:</span>
                <span className="info-value">{pokemon.height / 10} m</span>
              </div>
              <div className="info-item">
                <span className="info-label">Weight:</span>
                <span className="info-value">{pokemon.weight / 10} kg</span>
              </div>
              <div className="info-item">
                <span className="info-label">Category:</span>
                <span className="info-value">{category}</span>
              </div>
            </div>

            <div className="pokemon-description">
            <p>{description.replace(/[\n\f\r\t\v\\]/g, ' ')
             .replace(/\u00A0|\u00AD|\u2019|\u25A0|\u2642|\u2640|\uFFFD/g, '')
             .replace(/\s+/g, ' ')}</p>
            </div>
          </div>
          
          <div className="detail-info-section">
            <div className="detail-tabs">
              <button 
                className={`tab-button ${activeTab === 'stats' ? 'active' : ''}`}
                onClick={() => setActiveTab('stats')}
              >
                Stats
              </button>
              <button 
                className={`tab-button ${activeTab === 'abilities' ? 'active' : ''}`}
                onClick={() => setActiveTab('abilities')}
              >
                Abilities
              </button>
              <button 
                className={`tab-button ${activeTab === 'moves' ? 'active' : ''}`}
                onClick={() => setActiveTab('moves')}
              >
                Moves
              </button>
              <button 
                className={`tab-button ${activeTab === 'evolution' ? 'active' : ''}`}
                onClick={() => setActiveTab('evolution')}
              >
                Evolution
              </button>
            </div>
            
            <div className="tab-content">
              {activeTab === 'stats' && (
                <div className="stats-container">
                  {stats.map(stat => (
                    <div key={stat.name} className="stat-item">
                      <span className="stat-name">{stat.name}</span>
                      <div className="stat-bar-container">
                        <div 
                          className="stat-bar" 
                          style={{ width: `${(stat.value / 255) * 100}%` }}
                        ></div>
                      </div>
                      <span className="stat-value">{stat.value}</span>
                    </div>
                  ))}
                </div>
              )}
              
              {activeTab === 'abilities' && (
                <div className="abilities-container">
                  <h3>Abilities</h3>
                  <ul className="abilities-list">
                    {pokemon.abilities.map(ability => (
                      <li key={ability.ability.name} className="ability-item">
                        <span className="ability-name">
                          {ability.ability.name.replace(/-/g, ' ')}
                        </span>
                        {ability.is_hidden && (
                          <span className="hidden-badge">Hidden</span>
                        )}
                      </li>
                    ))}
                  </ul>
                </div>
              )}
              
              {activeTab === 'moves' && (
                <div className="moves-container">
                  <h3>Moves</h3>
                  <div className="moves-list-container">
                    <ul className="moves-list">
                      {pokemon.moves.slice(0, 20).map(move => (
                        <li key={move.move.name} className="move-item">
                          {move.move.name.replace(/-/g, ' ')}
                        </li>
                      ))}
                    </ul>
                    {pokemon.moves.length > 20 && (
                      <p className="more-moves">+ {pokemon.moves.length - 20} more moves</p>
                    )}
                  </div>
                </div>
              )}
              
              {activeTab === 'evolution' && (
                <div className="evolution-container">
                  <h3>Evolution Chain</h3>
                  {evolutionChain.length > 0 ? (
                    <div className="evolution-chain">
                      {evolutionChain.map((evo, index) => (
                        <React.Fragment key={evo.name}>
                          <div className="evolution-item">
                            <Link 
                              to={`/pokemon/${evo.name}`} 
                              className={pokemon.name === evo.name ? 'current-evolution' : ''}
                            >
                              <div className="evolution-name">
                                {evo.name.charAt(0).toUpperCase() + evo.name.slice(1)}
                              </div>
                            </Link>
                          </div>
                          {index < evolutionChain.length - 1 && (
                            <div className="evolution-arrow">
                              <span>→</span>
                              {evolutionChain[index + 1].min_level && (
                                <div className="level-text">
                                  Level {evolutionChain[index + 1].min_level}
                                </div>
                              )}
                            </div>
                          )}
                        </React.Fragment>
                      ))}
                    </div>
                  ) : (
                    <p>No evolution data available</p>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
        
        <div className="detail-actions">
          <Link 
            to={`/pokemon/${Number(id) - 1}`} 
            className="nav-button prev-button"
            style={{ visibility: Number(id) <= 1 ? 'hidden' : 'visible' }}
          >
            &larr; #{Number(id) - 1}
          </Link>
          <Link 
            to={`/compare/${id}`} 
            className="compare-button"
          >
            Compare
          </Link>
          <Link 
            to={`/pokemon/${Number(id) + 1}`} 
            className="nav-button next-button"
            style={{ visibility: Number(id) >= 150 ? 'hidden' : 'visible' }}
          >
            #{Number(id) + 1} &rarr;
          </Link>
        </div>
      </div>
    </div>
  );
};

export default PokemonDetail;