import React, { useState, useRef, useEffect } from "react";
import Module from "../styles/TeamFormationPage.module.css";
import CreateTeamAlert from "./modals/CreateTeamAlert";
import Toast from "./modals/Toast";
const StudentsListTab = ({ students, myTeamNumber }) => {
  const [currentPage, setCurrentPage] = useState(1);
  const [studentsPerPage, setStudentsPerPage] = useState(5);
  const [showToast, setShowToast] = useState(false);
  const containerRef = useRef(null);
  const [showAlert, setShowAlert] = useState(false);
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
    // If myTeamNumber is not empty, show a toast message
    if (myTeamNumber) {
      setShowToast(true);
      setTimeout(() => {
        setShowToast(false);
      }, 3000);
    } else {
      // If no team number, open the CreateTeamAlert modal to handle team creation/invitation
      setShowAlert(true);
    }
  };
  /* 
  
  const handleInviteClick = async (studentId) => {
    if (myTeamNumber === "") {
      setShowAlert(true);
      return;
    }
  
    try {
      const response = await axios.post("/api/invite", {
        inviterId: "currentUserId", // Replace with actual user ID
        inviteeId: studentId,
        teamNumber: myTeamNumber,
      });
  
      if (response.data.success) {
        setShowToast(true);
        setTimeout(() => setShowToast(false), 3000);
      }
    } catch (error) {
      console.error("Error sending invite:", error);
    }
  };
   */
  // Handle cancel action from the alert modal
  const handleCancel = () => {
    setShowAlert(false);
  };
  const handleConfirm = () => {
    // You can include additional logic here for creating a team and sending an invite.
    console.log("Team created and student invited!");
    setShowAlert(false);
  };
  /* const handleConfirm = async () => {
    try {
      // Step 1: Create a team
      const createTeamResponse = await axios.post("/api/create-team", {
        creatorId: "currentUserId", // Replace with actual user ID
      });
  
      if (!createTeamResponse.data.success) {
        console.error("Error creating team:", createTeamResponse.data.message);
        return;
      }
  
      const newTeamNumber = createTeamResponse.data.teamNumber;
  
      // Step 2: Send invite after team creation
      const inviteResponse = await axios.post("/api/invite", {
        inviterId: "currentUserId", // Replace with actual user ID
        inviteeId: "selectedStudentId", // Replace with actual student ID
        teamNumber: newTeamNumber,
      });
  
      if (inviteResponse.data.success) {
        console.log("Team created and student invited!");
        setShowToast(true);
        setTimeout(() => setShowToast(false), 3000);
      } else {
        console.error("Error sending invite:", inviteResponse.data.message);
      }
    } catch (error) {
      console.error("Error in team creation/invitation process:", error);
    } finally {
      setShowAlert(false);
    }
  }; */
  return (
    <div className={Module["page-container"]}>
      <div className={Module["table-wrapper"]} ref={containerRef}>
        <table>
          <thead>
            <tr>
              <th>Full-name</th>
              <th>Email-address</th>
              
              <th>Status</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {currentStudents.map((student, index) => (
              <tr key={index}>
                <td>{student.fullName}</td>
                <td>{student.email}</td>
                
                <td>
                  {student.status === "available" ? (
                    <span className={Module["status-available"]}>Available</span>
                  ) : (
                    <span className={Module["status-in-team"]}>In a team</span>
                  )}
                </td>
                <td>
                  {student.status === "available" ? (
                    <button className={Module["invite-button"]} onClick={handleInviteClick}>
                      Invite
                    </button>
                    /* <button className={Module["invite-button"]} onClick={() => handleInviteClick(student.id)}>
                     Invite
                        </button>
                                */
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

      {/* Fixed Pagination */}
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
            } else {
              return (
                <button
                  key={idx}
                  onClick={() => handlePageChange(page)}
                  className={page === currentPage ? Module["active"] : ""}

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
          className={currentPage === totalPages ? Module["disabled"] : ""}

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
      <CreateTeamAlert
        show={showAlert}
        onCancel={handleCancel}
        onConfirm={handleConfirm}
      />
    </div>
  );
};

export default StudentsListTab;
