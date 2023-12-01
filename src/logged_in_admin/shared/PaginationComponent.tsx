import React from "react";
import "./PaginationComponent.scss";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faArrowAltCircleLeft,
  faArrowAltCircleRight,
} from "@fortawesome/free-solid-svg-icons";

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
  const handlePageChange = (pageNumber: number) => {
    // Check if the target page is different from the current page
    if (pageNumber !== currentPage) {
      // Determine if going forward or backward
      const isGoingForward = pageNumber > currentPage;

      // Scroll to the top of the page only if not on the first or last page
      if (
        !(currentPage === 1 && !isGoingForward) &&
        !(currentPage === totalPages && isGoingForward)
      ) {
        window.scrollTo({ top: 0, behavior: "smooth" });
      }

      // Call the provided onPageChange function
      onPageChange(pageNumber);
    }
  };

  const renderPageButtons = () => {
    const buttons = [];
    const maxPagesToShow = 9; // Adjust as needed

    // Show options to move to the first three pages
    if (currentPage > 4) {
      for (let i = 1; i <= 3; i++) {
        buttons.push(
          <button
            key={i}
            className={`pagination-button ${currentPage === i ? "active" : ""}`}
            onClick={() => handlePageChange(i)}
          >
            {i}
          </button>
        );
      }
      buttons.push(<span key="ellipsis1">...</span>);
    }

    // Show current page and surrounding pages
    const start = Math.max(1, currentPage - 1);
    const end = Math.min(totalPages, currentPage + 1);

    for (let i = start; i <= end; i++) {
      buttons.push(
        <button
          key={i}
          className={`pagination-button ${currentPage === i ? "active" : ""}`}
          onClick={() => handlePageChange(i)}
        >
          {i}
        </button>
      );
    }

    // Show options to move to the last page
    if (currentPage < totalPages - 3) {
      buttons.push(<span key="ellipsis2">...</span>);
      for (let i = totalPages - 2; i <= totalPages; i++) {
        buttons.push(
          <button
            key={i}
            className={`pagination-button ${currentPage === i ? "active" : ""}`}
            onClick={() => handlePageChange(i)}
          >
            {i}
          </button>
        );
      }
    }

    return buttons;
  };

  return (
    <div className="pagination">
      <div className="pagination-container">
        <button
          className="pagination-button"
          onClick={() => handlePageChange(currentPage - 1)}
          disabled={currentPage === 1}
        >
          <FontAwesomeIcon
            icon={faArrowAltCircleLeft}
            className="pagination-icons"
          />
          Back
        </button>

        {/* {renderPageButtons()} */}

        <button
          className="pagination-button"
          onClick={() => handlePageChange(currentPage + 1)}
          disabled={currentPage === totalPages}
        >
          Next
          <FontAwesomeIcon
            style={{ marginLeft: "6px" }}
            icon={faArrowAltCircleRight}
            className="pagination-icons"
          />
        </button>
      </div>
    </div>
  );
};

export default Pagination;
