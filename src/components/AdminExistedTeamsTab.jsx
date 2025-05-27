import React, { useState, useEffect, useRef } from "react";
import axios from "axios";
import Module from "../styles/TeamFormationPage.module.css";
import Seemorepage from "./AdminExistedTeamSeeMore";
import JoinTeamAlert from "./modals/JoinTeamAlert";
import Toast from "./modals/Toast";
import { getPaginatedData, getPageNumbers } from "../utils/paginationFuntion";
import DeleteUserModal from "./modals/DeleteUserModal";
import alertIcon from "../assets/alert-icon.svg";

const ExistedTeamsTab = ({ user, existedTeams ,students,selectedFilters }) => {
  const [currentPage, setCurrentPage] = useState(1);

  const [teamsPerPage, setTeamsPerPage] = useState(10);
  const [selectedTeam, setSelectedTeam] = useState(null);
  const containerRef = useRef(null);
  const [toastMessage, setToastMessage] = useState("");
  const [showToast, setShowToast] = useState(false);
  const [showJoinAlert, setShowJoinAlert] = useState(false);
   const [isDeleteUserModalOpen, setDeleteUserModalOpen] = useState(false);
   const [teamIDtoDelete, setTeamIDtoDelete] = useState(null);
   // 1) Filter by Grade & Speciality
   const filteredByGradeAndSpec = React.useMemo(() => {
    return existedTeams.filter((team) => {
      const first = team.members?.[0];
      if (!first) return false;

      // grade rule:
      const gradeOk =
        selectedFilters.Grade.length === 0 ||
        selectedFilters.Grade.includes(first.year);

      // only enforce speciality if 2CS/3CS:
      const specOk =
        !["2CS", "3CS"].includes(first.year) ||
        selectedFilters.Speciality.length === 0 ||
        selectedFilters.Speciality.includes(first.specialite);

      return gradeOk && specOk;
    });
  }, [existedTeams, selectedFilters]);
  useEffect(() => {
    console.log("Existed Teams in ExistedTeamsTab:", existedTeams);
  }, [existedTeams]);

  const handleJoinClick = () => {
    setShowJoinAlert(true);
  };

  const handleCancel = () => {
    setShowJoinAlert(false);
  };

  const handleConfirm = () => {
    setShowJoinAlert(false);
    console.log("Join confirmed!");
    setToastMessage("Team joining was successful.");
    setShowToast(true);
    setTimeout(() => {
      setShowToast(false);
    }, 3000);
  };

  useEffect(() => {
 
    const updateTeamsPerPage = () => {
      if (containerRef.current) {
        const containerHeight = containerRef.current.clientHeight;
        const estimatedRowHeight = 70;
        const rowsPerPage = Math.floor(containerHeight / estimatedRowHeight);
        setTeamsPerPage(rowsPerPage > 1 ? rowsPerPage : 8);
      }
    };

    updateTeamsPerPage();
    window.addEventListener("resize", updateTeamsPerPage);
    return () => window.removeEventListener("resize", updateTeamsPerPage);
  }, []);

  // Use the utility function to get paginated data
  const { currentItems: currentTeams, totalPages } = getPaginatedData(
    /* existedTeams, */
    filteredByGradeAndSpec,
    currentPage,
    teamsPerPage
  );

  // Generate page numbers using the pagination utility
  const pageNumbers = getPageNumbers(totalPages, currentPage);

  // If a team is selected, show its detailed view
  if (selectedTeam) {
    const mappedMembers = selectedTeam.members.map((member) => ({
      id: member.id,
      fullName: `${member.firstname} ${member.lastname}`,
      email: member.user?.email || "N/A",
      role: member.role || "Member", // Default to "Member" if role isn't provided
      year: member.year || "N/A",
      specialite: member.specialite || "N/A",
    }));

    return (
      <div>
        <Seemorepage
          myTeamNumber={selectedTeam.id}
          myTeamMembers={mappedMembers}
          students={students}
          onBack={() => setSelectedTeam(null)}
        />
      </div>
    );
  }

  const handlePageChange = (newPage) => {
    if (newPage >= 1 && newPage <= totalPages) {
      setCurrentPage(newPage);
    }
  };

  return (
      <div>
      {(currentTeams.length === 0) ? (
        <div className={Module["alertDiv"]}>
                    <img src={alertIcon} alt="Alert Icon" />
                    <h3>
                      No Teams were found . check again later to see if new Teams are
                      added
                    </h3>
                  </div>
      )
        : (
      <div className={Module["page-container"]}>
      <div className={Module["table-wrapper"]} ref={containerRef}>
        <table>
          <thead>
            <tr>
              <th>Team Number</th>
              <th>Team Creator</th>
              <th>Grade</th>
              <th>Speciality</th>
              <th>Status</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {currentTeams.map((team, idx) => {
              const teamCreator =
                team.members && team.members.length > 0
                  ? `${team.members[0].firstname} ${team.members[0].lastname}`
                  : "N/A";
              return (
                <tr key={idx}>
                  <td>{team.id || "N/A"}</td>
                  <td>{teamCreator}</td>
                  <td>{team.members[0]?.year || "N/A"}</td>
                  <td>{team.members[0]?.specialite || ""}</td>
                  <td>
                    {team.status === "open" ? (
                      <span className={Module["status-available"]}>
                        {team.status} ({team.members.length}/{team.maxNumber})
                      </span>
                    ) : (
                      <span className={Module["status-in-team"]}>
                        {team.status} ({team.members.length}/{team.maxNumber})
                      </span>
                    )}
                  </td>
                  <td className={Module["button-container"]}>
                  
                    <button
                        className={Module["invite-button"]}
                        style={{ width: "90px", marginRight: "15px" }}
                        onClick={() => setSelectedTeam(team)}
                      >
                        Edit
                      </button>

                    <button
                      className={Module["invite-button"]}
                      style={{ width: "90px", backgroundColor: "white" }}
                      onClick={() => { setTeamIDtoDelete(team.id); setDeleteUserModalOpen(true); }}
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
        </div>
      </div>
        )}

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
          {pageNumbers.map((page, idx) =>
            page === "..." ? (
              <span key={idx} className={Module["ellipsis"]}>
                ...
              </span>
            ) : (
              <button
                key={idx}
                onClick={() => handlePageChange(page)}
                className={page === currentPage ? Module["active"] : ""}
              >
                {page}
              </button>
            )
          )}
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
      
       <DeleteUserModal isOpen={isDeleteUserModalOpen} onClose={() => setDeleteUserModalOpen(false)} entityType="Team" teamIDtoDelete={teamIDtoDelete} /> 
    </div>
  );
};

export default ExistedTeamsTab;
