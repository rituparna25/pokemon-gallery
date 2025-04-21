import React from "react";
import "../components/SearchBar.css";

const SearchBar = ({ searchTerm, onSearch }) => {
  return (
    <div className="search-container">
    <input
      className="search-box"
      type="text"
      placeholder="Search any Pokémon..."
      value={searchTerm}
      onChange={(e) => onSearch(e.target.value)}
    />
    </div>
  );
};

export default SearchBar;
