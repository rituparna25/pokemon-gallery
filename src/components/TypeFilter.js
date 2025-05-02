import React, { useState } from "react";
import "./TypeFilter.css";

const TypeFilter = ({ types, selectedTypes, onTypeSelect }) => {
  const [isExpanded, setIsExpanded] = useState(false);

  const handleTypeChange = (typeName) => {
    if (selectedTypes.includes(typeName)) {
      onTypeSelect(selectedTypes.filter(type => type !== typeName));
    } else {
      onTypeSelect([...selectedTypes, typeName]);
    }
  };

  const clearAllTypes = () => {
    onTypeSelect([]);
  };

  const toggleExpand = () => {
    setIsExpanded(!isExpanded);
  };

  return (
    <div className="collapsible-filter-container">
      <button 
        className={`filter-toggle-btn ${selectedTypes.length > 0 ? 'has-active-filters' : ''}`} 
        onClick={toggleExpand}
      >
        <span className="toggle-btn-text">
          {isExpanded ? 'Hide Type Filter' : 'Filter by Type'}
          {!isExpanded && selectedTypes.length > 0 && (
            <span className="active-filter-count">{selectedTypes.length}</span>
          )}
        </span>
        <svg 
          className={`toggle-icon ${isExpanded ? 'expanded' : ''}`} 
          width="20" 
          height="20" 
          viewBox="0 0 24 24" 
          fill="none" 
          xmlns="http://www.w3.org/2000/svg"
        >
          <path 
            d="M7 10L12 15L17 10" 
            stroke="currentColor" 
            strokeWidth="2" 
            strokeLinecap="round" 
            strokeLinejoin="round"
          />
        </svg>
      </button>
      
      {isExpanded && (
        <div className="filter-content">
          <div className="type-filter-header">
            <h3>Type Filter</h3>
            {selectedTypes.length > 0 && (
              <button className="clear-types-btn" onClick={clearAllTypes}>
                Clear All
              </button>
            )}
          </div>
          
          <div className="type-checkboxes">
            {types.map((type) => (
              <label 
                key={type.name} 
                className={`type-checkbox-label ${selectedTypes.includes(type.name) ? 'selected' : ''} ${selectedTypes.includes(type.name) ? `${type.name}-bg` : ''}`}
              >
                <input
                  type="checkbox"
                  checked={selectedTypes.includes(type.name)}
                  onChange={() => handleTypeChange(type.name)}
                  className="type-checkbox"
                />
                <div className="checkbox-custom"></div>
                <span className="type-name">
                  {type.name.charAt(0).toUpperCase() + type.name.slice(1)}
                </span>
              </label>
            ))}
          </div>
        </div>
      )}
      
      {selectedTypes.length > 0 && (
        <div className="active-filters">
          <div className="active-filters-label">Active filters:</div>
          <div className="active-filter-tags">
            {selectedTypes.map(type => (
              <div 
                className={`filter-tag ${type}-bg`} 
                key={type}
                onClick={() => handleTypeChange(type)}
              >
                {type.charAt(0).toUpperCase() + type.slice(1)}
                <span className="remove-tag">×</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default TypeFilter;