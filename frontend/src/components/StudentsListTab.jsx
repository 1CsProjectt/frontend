import React, { useState, useRef, useEffect } from "react";
import "../styles/TeamFormationPage.css";
import Toast from "../components/Toast";
const StudentsListTab = ({ students }) => {
  const [currentPage, setCurrentPage] = useState(1);
  const [studentsPerPage, setStudentsPerPage] = useState(5);
  const [showToast, setShowToast] = useState(false);
  const containerRef = useRef(null);

  useEffect(() => {
    const updateStudentsPerPage = () => {
      if (containerRef.current) {
        const containerHeight = containerRef.current.clientHeight;
        const estimatedRowHeight = 50; // Approximate height of a single table row
        const calculatedStudentsPerPage = Math.floor(
          containerHeight / estimatedRowHeight
        );
        setStudentsPerPage(calculatedStudentsPerPage > 0 ? calculatedStudentsPerPage : 5);
      }
    };

    updateStudentsPerPage();
    window.addEventListener("resize", updateStudentsPerPage);
    return () => window.removeEventListener("resize", updateStudentsPerPage);
  }, []);

  // Pagination calculations
  const totalPages = Math.ceil(students.length / studentsPerPage);
  const indexOfLastStudent = currentPage * studentsPerPage;
  const indexOfFirstStudent = indexOfLastStudent - studentsPerPage;
  const currentStudents = students.slice(indexOfFirstStudent, indexOfLastStudent);

  const handlePageChange = (newPage) => {
    if (newPage >= 1 && newPage <= totalPages) {
      setCurrentPage(newPage);
    }
  };

  // Generate page numbers with ellipses
  const getPageNumbers = () => {
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

  const pageNumbers = getPageNumbers();

  // Handle invite click
  const handleInviteClick = () => {
    // Perform your "invite" logic here (e.g., send API request)
    setShowToast(true);
    setTimeout(() => {
      setShowToast(false);
    }, 3000);
  };

  return (
    <div className="page-container">
      <div className="table-wrapper" ref={containerRef}>
        <table>
          <thead>
            <tr>
              <th>Full-name</th>
              <th>Email-address</th>
              <th>Group</th>
              <th>Status</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {currentStudents.map((student, index) => (
              <tr key={index}>
                <td>{student.fullName}</td>
                <td>{student.email}</td>
                <td>{student.group}</td>
                <td>
                  {student.status === "Available" ? (
                    <span className="status-available">Available</span>
                  ) : (
                    <span className="status-in-team">In a team</span>
                  )}
                </td>
                <td>
                  {student.status === "Available" ? (
                    <button className="invite-button" onClick={handleInviteClick}>
                      Invite
                    </button>
                  ) : (
                    <button className="disable-button" disabled>
                      Invite
                    </button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Fixed Pagination */}
      <div className="pagination">
        <button
          id="previous-button"
          onClick={() => handlePageChange(currentPage - 1)}
          disabled={currentPage === 1}
          className={currentPage === 1 ? "disabled" : ""}
        >
          Previous
        </button>

        <div className="page-numbers">
          {pageNumbers.map((page, idx) => {
            if (page === "...") {
              return (
                <span key={idx} className="ellipsis">
                  ...
                </span>
              );
            } else {
              return (
                <button
                  key={idx}
                  onClick={() => handlePageChange(page)}
                  className={page === currentPage ? "active" : ""}
                >
                  {page}
                </button>
              );
            }
          })}
        </div>

        <button
          id="next-button"
          onClick={() => handlePageChange(currentPage + 1)}
          disabled={currentPage === totalPages}
          className={currentPage === totalPages ? "disabled" : ""}
        >
          Next
        </button>
      </div>

      {/* Toast Notification */}
      {showToast && (
        <Toast 
          message="Invite sent successfully." 
          onClose={() => setShowToast(false)} 
        />
      )}
    </div>
  );
};

export default StudentsListTab;
