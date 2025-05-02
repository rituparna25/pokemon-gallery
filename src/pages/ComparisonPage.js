import React, { useState} from 'react';
import { useParams, Link } from 'react-router-dom';
import { usePokemon } from '../context/PokemonContext';
import usePokemonDetail from '../hooks/usePokemonDetail';
import './ComparisonPage.css';

const ComparisonPage = () => {
  const { id } = useParams();
  const { pokemon: pokemon1, loading: loading1, error: error1 } = usePokemonDetail(id);
  const [pokemon2Id, setPokemon2Id] = useState('');
  const { pokemon: pokemon2, loading: loading2, error: error2 } = usePokemonDetail(pokemon2Id);
  const { pokemonList } = usePokemon();
  
  const handleSelectChange = (e) => {
    setPokemon2Id(e.target.value);
  };

  const handleResetComparison = () => {
    setPokemon2Id('');
  };

  if (loading1) {
    return (
      <div className="comparison-container">
        <div className="loading-container">
          <div className="loading-spinner"></div>
          <p>Loading Pokémon details...</p>
        </div>
      </div>
    );
  }

  if (error1 || !pokemon1) {
    return (
      <div className="comparison-container">
        <div className="error-container">
          <p>{error1 || "Failed to load Pokémon details."}</p>
          <Link to="/">
            <button>Back to Home</button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="comparison-container">
      <div className="comparison-header">
        <Link to={`/pokemon/${id}`} className="back-button">&larr; Back to {pokemon1.name}</Link>
      </div>

      <div className="comparison-selection">
        <div className="pokemon-card-mini selected">
          <img src={pokemon1.sprites.front_default} alt={pokemon1.name} />
          <h3>{pokemon1.name.charAt(0).toUpperCase() + pokemon1.name.slice(1)}</h3>
        </div>

        <div className="vs-divider">VS</div>

        {!pokemon2Id || loading2 || !pokemon2 ? (
          <div className="pokemon-selector">
            <select 
              value={pokemon2Id} 
              onChange={handleSelectChange}
              className="pokemon-select"
            >
              <option value="">Select a Pokémon to compare</option>
              {pokemonList.map(p => (
                <option key={p.id} value={p.id}>
                  #{p.id} {p.name.charAt(0).toUpperCase() + p.name.slice(1)}
                </option>
              ))}
            </select>
          </div>
        ) : (
          <div className="pokemon-card-mini">
            <img src={pokemon2.sprites.front_default} alt={pokemon2.name} />
            <h3>{pokemon2.name.charAt(0).toUpperCase() + pokemon2.name.slice(1)}</h3>
            <button 
              className="change-pokemon-btn" 
              onClick={handleResetComparison}
            >
              Change
            </button>
          </div>
        )}
      </div>

      {pokemon2Id && !loading2 && pokemon2 ? (
        <div className="comparison-stats">
          <h2>Stats Comparison</h2>
          
          <div className="stats-table">
            <div className="stat-row header">
              <div className="stat-cell">Stat</div>
              <div className="stat-cell">{pokemon1.name.charAt(0).toUpperCase() + pokemon1.name.slice(1)}</div>
              <div className="stat-cell">Difference</div>
              <div className="stat-cell">{pokemon2.name.charAt(0).toUpperCase() + pokemon2.name.slice(1)}</div>
            </div>
            
            {pokemon1.stats.map((stat, index) => {
              const stat1Value = stat.base_stat;
              const stat2Value = pokemon2.stats[index].base_stat;
              const difference = stat1Value - stat2Value;
              
              return (
                <div className="stat-row" key={stat.stat.name}>
                  <div className="stat-cell stat-name">
                    {stat.stat.name.replace('-', ' ')}
                  </div>
                  <div className="stat-cell">
                    <div className="stat-bar-container">
                      <div 
                        className="stat-bar" 
                        style={{ width: `${(stat1Value / 255) * 100}%` }}
                      ></div>
                    </div>
                    <span className="stat-value">{stat1Value}</span>
                  </div>
                  <div className="stat-cell difference">
                    <span className={`diff-value ${difference > 0 ? 'positive' : difference < 0 ? 'negative' : ''}`}>
                      {difference > 0 ? '+' + difference : difference}
                    </span>
                  </div>
                  <div className="stat-cell">
                    <div className="stat-bar-container">
                      <div 
                        className="stat-bar" 
                        style={{ width: `${(stat2Value / 255) * 100}%` }}
                      ></div>
                    </div>
                    <span className="stat-value">{stat2Value}</span>
                  </div>
                </div>
              );
            })}
            
            {/* Total row */}
            <div className="stat-row total">
              <div className="stat-cell stat-name">Total</div>
              <div className="stat-cell">
                {pokemon1.stats.reduce((sum, stat) => sum + stat.base_stat, 0)}
              </div>
              <div className="stat-cell difference">
                {(() => {
                  const total1 = pokemon1.stats.reduce((sum, stat) => sum + stat.base_stat, 0);
                  const total2 = pokemon2.stats.reduce((sum, stat) => sum + stat.base_stat, 0);
                  const diff = total1 - total2;
                  return (
                    <span className={`diff-value ${diff > 0 ? 'positive' : diff < 0 ? 'negative' : ''}`}>
                      {diff > 0 ? '+' + diff : diff}
                    </span>
                  );
                })()}
              </div>
              <div className="stat-cell">
                {pokemon2.stats.reduce((sum, stat) => sum + stat.base_stat, 0)}
              </div>
            </div>
          </div>
          
          <div className="comparison-info">
            <div className="comparison-section">
              <h3>Type Comparison</h3>
              <div className="type-comparison">
                <div className="pokemon-side">
                  <h4>{pokemon1.name.charAt(0).toUpperCase() + pokemon1.name.slice(1)}</h4>
                  <div className="type-badges">
                    {pokemon1.types.map(type => (
                      <span key={type.type.name} className={`type-badge ${type.type.name}`}>
                        {type.type.name.charAt(0).toUpperCase() + type.type.name.slice(1)}
                      </span>
                    ))}
                  </div>
                </div>
                <div className="pokemon-side">
                  <h4>{pokemon2.name.charAt(0).toUpperCase() + pokemon2.name.slice(1)}</h4>
                  <div className="type-badges">
                    {pokemon2.types.map(type => (
                      <span key={type.type.name} className={`type-badge ${type.type.name}`}>
                        {type.type.name.charAt(0).toUpperCase() + type.type.name.slice(1)}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </div>
            
            <div className="comparison-section">
              <h3>Physical Comparison</h3>
              <div className="physical-comparison">
                <div className="info-row">
                  <div className="info-label">Height</div>
                  <div className="info-value">{pokemon1.height / 10} m</div>
                  <div className="info-value">{pokemon2.height / 10} m</div>
                </div>
                <div className="info-row">
                  <div className="info-label">Weight</div>
                  <div className="info-value">{pokemon1.weight / 10} kg</div>
                  <div className="info-value">{pokemon2.weight / 10} kg</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      ) : pokemon2Id && (loading2 ? (
        <div className="loading-container">
          <div className="loading-spinner"></div>
          <p>Loading comparison data...</p>
        </div>
      ) : (
        <div className="error-container">
          <p>{error2 || "Failed to load comparison data."}</p>
        </div>
      ))}
    </div>
  );
};

export default ComparisonPage;