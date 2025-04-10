// paginationUtils.js

/**
 * Gets the paginated data for the current page.
 * @param {Array} items - The complete items array.
 * @param {number} currentPage - The current active page.
 * @param {number} itemsPerPage - The number of items to be displayed per page.
 * @returns {Object} - Contains: the current page items, total number of pages, and the indices.
 */
export const getPaginatedData = (items, currentPage, itemsPerPage) => {
    const totalPages = Math.ceil(items.length / itemsPerPage);
    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    const currentItems = items.slice(indexOfFirstItem, indexOfLastItem);
  
    return { currentItems, totalPages, indexOfFirstItem, indexOfLastItem };
  };
  
  /**
   * Generates an array of page numbers with ellipsis where needed.
   * @param {number} totalPages - The total number of pages.
   * @param {number} currentPage - The current active page.
   * @returns {Array} - An array containing page numbers and ellipsis ("...").
   */
  export const getPageNumbers = (totalPages, currentPage) => {
    const pageNumbers = [];
    if (totalPages <= 7) {
      for (let i = 1; i <= totalPages; i++) {
        pageNumbers.push(i);
      }
    } else {
      pageNumbers.push(1);
      if (currentPage < 5) {
        for (let i = 2; i <= 5; i++) {
          pageNumbers.push(i);
        }
        pageNumbers.push("...");
      } else if (currentPage > totalPages - 4) {
        pageNumbers.push("...");
        for (let i = totalPages - 4; i < totalPages; i++) {
          pageNumbers.push(i);
        }
      } else {
        pageNumbers.push("...");
        for (let i = currentPage - 1; i <= currentPage + 1; i++) {
          pageNumbers.push(i);
        }
        pageNumbers.push("...");
      }
      pageNumbers.push(totalPages);
    }
    return pageNumbers;
  };
  