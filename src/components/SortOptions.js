import React from "react";
import "./SortOptions.css";

const SortOptions = ({ sortOption, onSortChange }) => {
  return (
    <div className="sort-options-container">
      <select
        className="sort-select"
        value={sortOption}
        onChange={(e) => onSortChange(e.target.value)}
      >
        <option value="id-asc">ID (Low to High)</option>
        <option value="id-desc">ID (High to Low)</option>
        <option value="name-asc">Name (A to Z)</option>
        <option value="name-desc">Name (Z to A)</option>
      </select>
    </div>
  );
};

export default SortOptions;