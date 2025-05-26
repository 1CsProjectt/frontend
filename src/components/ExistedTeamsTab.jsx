import React, { useState, useEffect, useRef } from "react";
import Module from "../styles/TeamFormationPage.module.css";
import Seemorepage from "./ExistedTeamSeemore";
import JoinTeamAlert from "./modals/JoinTeamAlert";
import Toast from "./modals/Toast";
import axios from "axios";
import { getPaginatedData, getPageNumbers } from "../utils/paginationFuntion";
axios.defaults.withCredentials = true;
axios.defaults.headers.common['ngrok-skip-browser-warning'] = 'true';
const ExistedTeamsTab = ({ user, existedTeams, session }) => {

  console.log("[ExistedTeamsTab] session prop:", JSON.stringify(session));

  const [currentPage, setCurrentPage] = useState(1);
  const [teamsPerPage, setTeamsPerPage] = useState(10);
  const [selectedTeam, setSelectedTeam] = useState(null);
  const containerRef = useRef(null);
  const [toastMessage, setToastMessage] = useState("");
  const [showToast, setShowToast] = useState(false);
  const [showJoinAlert, setShowJoinAlert] = useState(false);
  const [selectedTeamId, setSelectedTeamId] = useState(null);


  useEffect(() => {
    console.log("Existed Teams in ExistedTeamsTab:", existedTeams);
  }, [existedTeams]);

  const handleJoinClick = (teamId) => {
    setSelectedTeamId(teamId);
    setShowJoinAlert(true);
  };


  const handleCancel = () => {
    setShowJoinAlert(false);
  };
  const handleConfirm = async () => {
    try {
      const response = await axios.post("/jointeam/sendjoinrequest", {
        id: selectedTeamId,
      }, { withCredentials: true });

      if (response.data.success) {
        setShowJoinAlert(false);
        console.log("Join confirmed!");
        setToastMessage("Team joining was successful.");
        setShowToast(true);
        setTimeout(() => {
          setShowToast(false);
        }, 3000);
      }
    } catch (error) {
      console.error("Error sending join request:", error);
    }
  };




  useEffect(() => {
    const updateTeamsPerPage = () => {
      if (containerRef.current) {
        const containerHeight = containerRef.current.clientHeight;
        const estimatedRowHeight = 75;
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
    existedTeams,
    currentPage,
    teamsPerPage
  );

  // Generate page numbers using the pagination utility
  const pageNumbers = getPageNumbers(totalPages, currentPage);

  // If a team is selected, show its detailed view
  if (selectedTeam) {
    const mappedMembers = selectedTeam.members.map(member => ({
      fullName: `${member.firstname} ${member.lastname}`,
      email: member.user?.email || "N/A",
      role: member.role || "Member" // Default to "Member" if role isn't provided
    }));

    return (
      <div>
        <Seemorepage
          myTeamNumber={selectedTeam.id}
          myTeamMembers={mappedMembers}
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
    <div className={Module["page-container"]}>
      <div className={Module["table-wrapper"]} ref={containerRef}>
        <table>
          <thead>
            <tr>
              <th>Team Number</th>
              <th>Team Creator</th>
              <th>Status</th>
              <th></th>
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

                  <td style={{ marginLeft: "200px" }}>
                    {session === "TOPIC_SELECTION" ? (
                      <span className={Module["status-in-team"]}>
                           {team.status}
                      </span>
                    ) : team.status === "Open" ? (
                      <span className={Module["status-available"]}>
                        {team.status} ({team.members.length}/{team.maxNumber})
                      </span>
                    ) : (
                      <span className={Module["status-in-team"]}>
                        {team.status} ({team.members.length}/{team.maxNumber})
                      </span>
                    )}
                  </td>

                  <td></td>
                  <td></td>
                  <td className={Module["button-container"]}>
                    {session === "TOPIC_SELECTION" ? (
                      <div>

                      </div>
                    ) : team.status === "Open" ? (
                      <button
                        className={Module["invite-button"]}
                        style={{ width: "7vw", marginRight: "15px" }}
                        onClick={() => handleJoinClick(team.id)}
                      >
                        Join
                      </button>
                    ) : (
                      
                      <span
                        className={Module["disable-button"]}
                        style={{ width: "7vw", marginRight: "15px" }}
                      >
                        Join
                      </span>
                    )}



                    <button
                      className={Module["invite-button"]}
                      style={{ width: "90px", backgroundColor: "white" }}
                      onClick={() => setSelectedTeam(team)}
                    >
                      See more
                    </button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

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

      <JoinTeamAlert
        show={showJoinAlert}
        onCancel={handleCancel}
        onConfirm={handleConfirm}
      />
      {showToast && (
        <Toast message={toastMessage || "Test Toast"} onClose={() => setShowToast(false)} />
      )}
    </div>
  );
};

export default ExistedTeamsTab;
