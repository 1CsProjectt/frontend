import React, { useState, useRef, useEffect, useCallback } from "react";
import styles from "../styles/TeamFormationPage.module.css";
import CreateTeamAlert from "./modals/CreateTeamAlert";
import Toast from "./modals/Toast";
import axios from "axios";
import { getPaginatedData, getPageNumbers } from "../utils/paginationFuntion";

// Global axios config (only once)
axios.defaults.headers.common["ngrok-skip-browser-warning"] = "true";
axios.defaults.withCredentials = true;

const StudentsListTab = ({ user, setUser, students, myTeamNumber }) => {
  const [currentPage, setCurrentPage] = useState(1);
  const [studentsPerPage, setStudentsPerPage] = useState(6);
  const [showToast, setShowToast] = useState(false);
  const [showAlert, setShowAlert] = useState(false);
  const [pendingInviteEmail, setPendingInviteEmail] = useState(null);
  const containerRef = useRef(null);
/*   const [localUser, setLocalUser] = useState(user);
  useEffect(() => {
    setLocalUser(user);
  }, [user]); */

  useEffect(() => {
    const updateStudentsPerPage = () => {
      if (containerRef.current) {
        const containerHeight = containerRef.current.clientHeight;
        const estimatedRowHeight = 75;
        const calculated = Math.floor(containerHeight / estimatedRowHeight);
        setStudentsPerPage(calculated > 0 ? calculated : 6);
      }
    };
    updateStudentsPerPage();
    window.addEventListener("resize", updateStudentsPerPage);
    return () => window.removeEventListener("resize", updateStudentsPerPage);
  }, []);

  // Pagination helpers
  const { currentItems: currentStudents, totalPages } = getPaginatedData(
    students,
    currentPage,
    studentsPerPage
  );
  const pageNumbers = getPageNumbers(totalPages, currentPage);

  // Send a single invitation
  const sendInvite = useCallback(async (email) => {
    try {
      const { data } = await axios.post(
        "/invitation/sendinvitation",
        { receiver_emails: [email] }
      );
      
        setShowToast(true);
        const timer = setTimeout(() => setShowToast(false), 3000);
        return () => clearTimeout(timer);
     
    } catch (err) {
      console.error("Invite error:", err);
    }
  }, []);

  // Queue or send invite based on team state
  const handleInviteClick = useCallback(
    (email) => {
      if (!user.team_id) {
        setPendingInviteEmail(email);
        setShowAlert(true);
        return;
      }
      sendInvite(email);
    },
    [user.team_id, sendInvite]
  );

  // Create team then send the pending invite
  const handleCreateTeamAndInvite = useCallback(async () => {
    try {
      const res = await axios.post("/teams/creategroup", {
        groupName: `Team ${Math.floor(Math.random() * 1000)}`,
      });
      console.log(" Team creation response:", res.data);
  
      //  Use `status` field, not `success`
      if (res.data.status !== "success") {
        throw new Error(res.data.message || "Unknown error");
      }
  
      // 1️ Extract the new team ID
      const newTeamId = res.data.group.id;
      console.log("➡️ newTeamId:", newTeamId);
  
      // 2️ Update user state + localStorage
      const updatedUser = { ...user, team_id: newTeamId };
      setUser(updatedUser);
  
      // 3️ Send pending invite if any
      if (pendingInviteEmail) {
        console.log("📨 Sending invite to:", pendingInviteEmail);
        await sendInvite(pendingInviteEmail);
      }
  
      // 4️ Cleanup
      setPendingInviteEmail(null);
      setShowAlert(false);
    } catch (err) {
      console.error(" Error creating team + inviting:", err);
      alert("Could not create team. Please try again.");
    }
  }, [pendingInviteEmail, sendInvite, user, setUser]);
  

  // Pagination control
  const handlePageChange = (newPage) => {
    if (newPage >= 1 && newPage <= totalPages) {
      setCurrentPage(newPage);
    }
  };

  const handleCancel = () => {
    setShowAlert(false);
    setPendingInviteEmail(null);
  };

  return (
    <div className={styles["page-container"]}>
      <div className={styles["table-wrapper"]} ref={containerRef}>
        <table>

          <thead>
            <tr>
              <th>Full name</th>
              <th>Email address</th>
            
              <th>Status</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {currentStudents.map((student) => (
              <tr key={student.email}>
                <td>{student.fullName}</td>
                <td>{student.email}</td>
               
                <td>
                  {student.status === "available" ? (
                    <span className={styles["status-available"]}>
                      Available
                    </span>
                  ) : (
                    <span className={styles["status-in-team"]}>
                      In a team
                    </span>
                  )}
                </td>
                <td>
                  <button
                    aria-label={`Invite ${student.fullName}`}
                    className={
                      student.status === "available"
                        ? styles["invite-button"]
                        : styles["disable-button"]
                    }
                    disabled={student.status !== "available"}
                    onClick={() => handleInviteClick(student.email)}
                  >
                    Invite
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Pagination Controls */}
      <div className={styles.pagination}>
        <button
          onClick={() => handlePageChange(currentPage - 1)}
          disabled={currentPage === 1}
          className={currentPage === 1 ? styles.disabled : ""}
        >
          Previous
        </button>

        <div className={styles["page-numbers"]}>
          {pageNumbers.map((page, idx) =>
            page === "..." ? (
              <span key={idx} className={styles.ellipsis}>
                ...
              </span>
            ) : (
              <button
                key={idx}
                onClick={() => handlePageChange(page)}
                className={page === currentPage ? styles.active : ""}
              >
                {page}
              </button>
            )
          )}
        </div>

        <button
          onClick={() => handlePageChange(currentPage + 1)}
          disabled={currentPage === totalPages}
          className={currentPage === totalPages ? styles.disabled : ""}
        >
          Next
        </button>
      </div>

      {/* Toast for successful invite */}
      {showToast && (
        <Toast message="Invite sent successfully." onClose={() => setShowToast(false)} />
      )}

      {/* Alert modal to create team */}
      <CreateTeamAlert
        show={showAlert}
        onCancel={handleCancel}
        onConfirm={handleCreateTeamAndInvite}
      />
    </div>
  );
};

export default StudentsListTab;
