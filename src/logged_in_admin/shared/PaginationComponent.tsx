// Pagination.tsx

import React from "react";
import "./PaginationComponent.scss";

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (pageNumber: number) => void;
}

const Pagination: React.FC<PaginationProps> = ({
  currentPage,
  totalPages,
  onPageChange,
}) => {
  return (
    <ul className="uk-pagination uk-flex-center pagination">
      {/* Back Button */}
      <li className={currentPage === 1 ? "uk-disabled" : ""}>
        <button
          className="uk-button primary"
          onClick={() => onPageChange(currentPage - 1)}
          disabled={currentPage === 1}
        >
          Back
        </button>
      </li>

      {/* Page Buttons */}
      {Array.from({ length: totalPages }, (_, index) => (
        <li
          key={index}
          className={currentPage === index + 1 ? "uk-active" : ""}
        >
          <button
            className="uk-button uk-button-default"
            onClick={() => onPageChange(index + 1)}
          >
            {index + 1}
          </button>
        </li>
      ))}

      {/* Next Button */}
      <li className={currentPage === totalPages ? "uk-disabled" : ""}>
        <button
          className="uk-button primary"
          onClick={() => onPageChange(currentPage + 1)}
          disabled={currentPage === totalPages}
        >
          Next
        </button>
      </li>
    </ul>
  );
};

export default Pagination;
