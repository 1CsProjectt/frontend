import React, { useState, useRef, useEffect } from "react";
import Module from "../styles/TeamFormationPage.module.css";
import CreateTeamAlert from "./modals/CreateTeamAlert";
import Toast from "./modals/Toast";
import axios from "axios";
import { getPaginatedData, getPageNumbers } from "../utils/paginationFuntion";
axios.defaults.headers.common["ngrok-skip-browser-warning"] = "true";

const StudentsListTab = ({ user, students, myTeamNumber }) => {
  const [currentPage, setCurrentPage] = useState(1);
  const [studentsPerPage, setStudentsPerPage] = useState("");
  const [showToast, setShowToast] = useState(false);
  const containerRef = useRef(null);
  const [showAlert, setShowAlert] = useState(false);

  useEffect(() => {
    const updateStudentsPerPage = () => {
      if (containerRef.current) {
        const containerHeight = containerRef.current.clientHeight;
        const estimatedRowHeight = 60; // Approximate height of a single table row
        const calculatedStudentsPerPage = Math.floor(containerHeight / estimatedRowHeight);
        setStudentsPerPage(calculatedStudentsPerPage > 0 ? calculatedStudentsPerPage : 5);
      }
    };

    updateStudentsPerPage();
    window.addEventListener("resize", updateStudentsPerPage);
    return () => window.removeEventListener("resize", updateStudentsPerPage);
  }, []);

  // Use the pagination utility functions to compute data for the current page
  const { currentItems: currentStudents, totalPages } = getPaginatedData(
    students,
    currentPage,
    studentsPerPage
  );
  const pageNumbers = getPageNumbers(totalPages, currentPage);

  const handlePageChange = (newPage) => {
    if (newPage >= 1 && newPage <= totalPages) {
      setCurrentPage(newPage);
    }
  };

  const handleInviteClick = async (receiver_email) => {
    if (user.team_id === null) {
      setShowAlert(true);
      return;
    }

    try {
      const response = await axios.post("/invitation/sendinvitation", {
        receiver_email: receiver_email
      });

      if (response.data.success) {
        setShowToast(true);
        setTimeout(() => setShowToast(false), 3000);
      }
    } catch (error) {
      console.error("Error sending invite:", error);
    }
  };

  const handleCancel = () => {
    setShowAlert(false);
  };

  const handleConfirm = () => {
    console.log("Team created and student invited!");
    setShowAlert(false);
  };

  return (

    <div className={Module["page-container"]}>
      <div className={Module["table-wrapper"]} ref={containerRef}>
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
                <td>G5</td>
                <td>
                  {student.status === "available" ? (
                    <span className={Module["status-available"]}>Available</span>
                  ) : (
                    <span className={Module["status-in-team"]}>In a team</span>
                  )}
                </td>
                <td>
                  {student.status === "available" ? (
                    <button className={Module["invite-button"]} onClick={() => console.log("Invite clicked")}>
                      Move
                    </button>
                  ) : (
                    <button className={Module["disable-button"]} disabled>
                      Invite
                    </button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Pagination Controls */}
      <div className={Module["pagination"]}>
        <button
          id="previous-button"
          onClick={() => handlePageChange(currentPage - 1)}
          disabled={currentPage === 1}
          className={currentPage === 1 ? Module["disabled"] : ""}
        >
          Previous
        </button>

        <div className={Module["page-numbers"]}>
          {pageNumbers.map((page, idx) => {
            if (page === "...") {
              return (
                <span key={idx} className={Module["ellipsis"]}>
                  ...
                </span>
              );
            }
            return (
              <button
                key={idx}
                onClick={() => handlePageChange(page)}
                className={page === currentPage ? Module["active"] : ""}
              >
                {page}
              </button>
            );
          })}
        </div>

        <button
          id="next-button"
          onClick={() => handlePageChange(currentPage + 1)}
          disabled={currentPage === totalPages}
          className={currentPage === totalPages ? Module["disabled"] : ""}
        >
          Next
        </button>
      </div>

      {/* Toast Notification */}
      {showToast && (
        <Toast message="Invite sent successfully." onClose={() => setShowToast(false)} />
      )}

      <CreateTeamAlert show={showAlert} onCancel={handleCancel} onConfirm={handleConfirm} />
    </div>
  );
};

export default StudentsListTab;
