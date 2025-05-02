import React from 'react';
import { usePokemon } from '../context/PokemonContext';
import './Pagination.css';

const Pagination = () => {
  const { 
    currentPage, 
    setCurrentPage, 
    totalPages, 
    itemsPerPage, 
    setItemsPerPage 
  } = usePokemon();

  const handlePageChange = (newPage) => {
    if (newPage >= 1 && newPage <= totalPages) {
      setCurrentPage(newPage);
      // Scroll to top of the page
      window.scrollTo(0, 0);
    }
  };

  const handleItemsPerPageChange = (e) => {
    setItemsPerPage(Number(e.target.value));
    setCurrentPage(1); // Reset to first page when changing items per page
  };

  // Create page numbers array with ellipsis for large page counts
  const getPageNumbers = () => {
    const pageNumbers = [];
    
    if (totalPages <= 7) {
      // Show all pages if total pages are less than or equal to 7
      for (let i = 1; i <= totalPages; i++) {
        pageNumbers.push(i);
      }
    } else {
      // Always include first page
      pageNumbers.push(1);
      
      if (currentPage > 3) {
        pageNumbers.push('...');
      }
      
      // Calculate start and end points for visible page numbers
      let start = Math.max(2, currentPage - 1);
      let end = Math.min(totalPages - 1, currentPage + 1);
      
      // Add page numbers between start and end
      for (let i = start; i <= end; i++) {
        pageNumbers.push(i);
      }
      
      if (currentPage < totalPages - 2) {
        pageNumbers.push('...');
      }
      
      // Always include last page
      pageNumbers.push(totalPages);
    }
    
    return pageNumbers;
  };

  return (
    <div className="pagination-container">
      <div className="items-per-page">
        <label>Items per page:</label>
        <select 
          value={itemsPerPage} 
          onChange={handleItemsPerPageChange}
          className="items-select"
        >
          <option value={10}>10</option>
          <option value={20}>20</option>
          <option value={50}>50</option>
        </select>
      </div>
      
      {totalPages > 1 && (
        <div className="pagination-controls">
          <button 
            onClick={() => handlePageChange(currentPage - 1)}
            disabled={currentPage === 1}
            className="page-button"
          >
            &lt;
          </button>
          
          {getPageNumbers().map((page, index) => (
            <button
              key={index}
              onClick={page === '...' ? null : () => handlePageChange(page)}
              className={`page-button ${page === currentPage ? 'active' : ''} ${page === '...' ? 'ellipsis' : ''}`}
              disabled={page === '...'}
            >
              {page}
            </button>
          ))}
          
          <button 
            onClick={() => handlePageChange(currentPage + 1)}
            disabled={currentPage === totalPages}
            className="page-button"
          >
            &gt;
          </button>
        </div>
      )}
      
      <div className="page-info">
        Page {currentPage} of {totalPages}
      </div>
    </div>
  );
};

export default Pagination;