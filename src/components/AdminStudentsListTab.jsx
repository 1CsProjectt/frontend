import React, { useState, useRef, useEffect,useNa } from "react";
import Module from "../styles/TeamFormationPage.module.css";
import CreateTeamAlert from "./modals/CreateTeamAlert";
import Toast from "./modals/Toast";
import alertIcon from "../assets/alert-icon.svg";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import MoveTeamMemberModal from './modals/MoveTeamMemberModal';
import { getPaginatedData, getPageNumbers } from "../utils/paginationFuntion";


axios.defaults.headers.common["ngrok-skip-browser-warning"] = "true";

const StudentsListTab = ({ user, students,selectedFilters, myTeamNumber }) => {
  const navigate = useNavigate();
  const [currentPage, setCurrentPage] = useState(1);
  const [studentsPerPage, setStudentsPerPage] = useState(5);
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState("");
  
  const containerRef = useRef(null);
  const [showAlert, setShowAlert] = useState(false);
  const [isMoveTeamMemberModalOpen, setIsMoveTeamMemberModalOpen] = useState(false);
  
  const [memberToMove,setMemberToMove] = useState(null);//entire student object is set 
  // 1) Filter by grade / speciality first
  const filteredByGradeAndSpec = React.useMemo(() => {
    return students.filter((s) => {
      // Grade must match or no grade‐filter active
      const gradeOk =
        selectedFilters.Grade.length === 0 ||
        selectedFilters.Grade.includes(s.year);

      // Only enforce speciality filter if 2CS/3CS
      const specOk =
        !["2CS", "3CS"].includes(s.year) ||
        selectedFilters.Speciality.length === 0 ||
        selectedFilters.Speciality.includes(s.specialite);

      return gradeOk && specOk;
    });
  }, [students, selectedFilters]);
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
  
  const handleMoveTeamMember = () => {
    
  };

  // Use the pagination utility functions to compute data for the current page
  const { currentItems: currentStudents, totalPages } = getPaginatedData(
    /* students, */
    filteredByGradeAndSpec,
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
    <div>
    {(currentStudents.length === 0) ? (
            <div className={Module["alertDiv"]}>
                        <img src={alertIcon} alt="Alert Icon" />
                        <h3>
                          No Students were found either a filter is applied or 
                          <span
                          style={{ color: "blue", textDecoration: "underline", cursor: "pointer" }}
                          onClick={() => navigate("/admin/users")}
                                >
                              Click here to add new students
                            </span>
                                                
                        </h3>
                      </div>
          )
            : (
    <div className={Module["page-container"]}>
      <div className={Module["table-wrapper"]} ref={containerRef}>
        <table>
          <thead>
            <tr>
              <th>Full-name</th>
              <th>Email-address</th>
              <th>Grade</th>
              <th>Speciality</th>
              
              <th>Status</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {currentStudents.map((student, index) => (
              <tr key={index}>
                <td>{student.fullName}</td>
                <td>{student.email}</td>
                <td>{student.year}</td>
                <td>{student.specialite}</td>
                <td>
                  {student.status === "available" ? (
                    <span className={Module["status-available"]}>Available</span>
                  ) : (
                    <span className={Module["status-in-team"]}>In a team</span>
                  )}
                </td>
                <td>
                  {/* {student.status === "available" ? (
                    <button className={Module["invite-button"]} onClick={() => console.log("Invite clicked")}>
                      Move
                    </button>
                  ) : (
                    <button className={Module["disable-button"]} disabled>
                      Move
                    </button>
                  )} */}
                  {/* //the admin can move a member whatever he is already in a team or not */}
                              <button className={Module["invite-button"]} onClick={() => {
                                console.log("selected student is : " + student.id);
                                console.log("selected student full object is : " , student);
                
                setMemberToMove(student);
                setIsMoveTeamMemberModalOpen(true);
              }}>
                      Move
                    </button>
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


      <MoveTeamMemberModal 
        isOpen={isMoveTeamMemberModalOpen}
        
        onClose={() => setIsMoveTeamMemberModalOpen(false)}
    
        memberToMove={memberToMove}   
        setShowToast={setShowToast}
        setToastMessage={setToastMessage}
           />
    </div>)}
    </div>
  );
};

export default StudentsListTab;
