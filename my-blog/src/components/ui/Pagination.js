import React from "react";
import './Pagination.css';

const Pagination = ({ pagination, onPageChange, onPageSizeChange }) => {
  const { currentPage, totalPages, totalItems, pageSize, hasPrev, hasNext } = pagination;

  const handlePageChange = (page) => {
    if (page >= 1 && page <= totalPages) {
      onPageChange(page);
    }
  };

  return (
    <div className="pagination">
      <p>
        Page {currentPage} of {totalPages}, Total Items: {totalItems}
      </p>
      <div>
        <button onClick={() => handlePageChange(1)} disabled={currentPage === 1}>
          First
        </button>
        <button onClick={() => handlePageChange(currentPage - 1)} disabled={!hasPrev}>
          Previous
        </button>

        {Array.from({ length: totalPages }, (_, index) => (
          <button
            key={index + 1}
            onClick={() => handlePageChange(index + 1)}
            className={index + 1 === currentPage ? "active" : ""}
          >
            {index + 1}
          </button>
        ))}

        <button onClick={() => handlePageChange(currentPage + 1)} disabled={!hasNext}>
          Next
        </button>
        <button onClick={() => handlePageChange(totalPages)} disabled={currentPage === totalPages}>
          Last
        </button>
      </div>
      <div>
        <label htmlFor="pageSize">Page Size: </label>
        <select
          id="pageSize"
          value={pageSize}
          onChange={(e) => onPageSizeChange(Number(e.target.value))}
        >
          <option value="5">5</option>
          <option value="10">10</option>
          <option value="20">20</option>
        </select>
      </div>
    </div>
  );
};

export default Pagination;