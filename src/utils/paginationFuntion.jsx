// paginationUtils.js

/**
 *  getPaginatedData
 * Returns the current items for the page, total number of pages, and start/end indices.
 *
 * @param {Array} items - The complete dataset (e.g., list of teams).
 * @param {number} currentPage - The current active page.
 * @param {number} itemsPerPage - Number of items per page.
 * @returns {{ currentItems: Array, totalPages: number, indexOfFirstItem: number, indexOfLastItem: number }}
 */
export const getPaginatedData = (items, currentPage, itemsPerPage) => {
  const totalPages = Math.ceil(items.length / itemsPerPage);
  const indexOfFirstItem = (currentPage - 1) * itemsPerPage;
  const indexOfLastItem = Math.min(indexOfFirstItem + itemsPerPage, items.length);
  const currentItems = items.slice(indexOfFirstItem, indexOfLastItem);

  return { currentItems, totalPages, indexOfFirstItem, indexOfLastItem };
};

/**
 *  getPageNumbers
 * Generates a smart array of page numbers with ellipses ("...") if needed.
 *
 * @param {number} totalPages - Total number of pages.
 * @param {number} currentPage - The current active page.
 * @returns {Array<number|string>} - Page numbers and ellipses for pagination UI.
 */
export const getPageNumbers = (totalPages, currentPage) => {
  const pageNumbers = [];

  if (totalPages <= 6) {
    // Show all pages
    for (let i = 1; i <= totalPages; i++) {
      pageNumbers.push(i);
    }
  } else {
    // Show first page
    pageNumbers.push(1);

    if (currentPage < 5) {
      // Show pages near the beginning
      for (let i = 2; i <= 5; i++) {
        pageNumbers.push(i);
      }
      pageNumbers.push("...");
    } else if (currentPage > totalPages - 4) {
      // Show pages near the end
      pageNumbers.push("...");
      for (let i = totalPages - 4; i < totalPages; i++) {
        pageNumbers.push(i);
      }
    } else {
      // Show pages around the current page
      pageNumbers.push("...");
      for (let i = currentPage - 1; i <= currentPage + 1; i++) {
        pageNumbers.push(i);
      }
      pageNumbers.push("...");
    }

    // Show last page
    pageNumbers.push(totalPages);
  }

  return pageNumbers;
};
