import React from "react";
import "./TypeFilter.css";

const TypeFilter = ({ types, selectedType, onTypeSelect }) => {
  return (
    <div className="type-filter-container">
      <select
        className="type-select"
        value={selectedType}
        onChange={(e) => onTypeSelect(e.target.value)}
      >
        <option value="">All Types</option>
        {types.map((type) => (
          <option key={type.name} value={type.name}>
            {type.name.charAt(0).toUpperCase() + type.name.slice(1)}
          </option>
        ))}
      </select>
    </div>
  );
};

export default TypeFilter;