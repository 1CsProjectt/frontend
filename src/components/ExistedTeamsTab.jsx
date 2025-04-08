// you have to chang this when you linking 
/*

        <Seemorepage 
          myTeamNumber={selectedTeam.teamNumber}
        />
*/
import React, { useState, useEffect, useRef } from "react";
import Module from "../styles/TeamFormationPage.module.css";

import Seemorepage from "./ExistedTeamSeemore";
import JoinTeamAlert from "./JoinTeamAlert"
import Toast from "../components/Toast";
const ExistedTeamsTab = ({ existedTeams }) => {
  const [currentPage, setCurrentPage] = useState(1);
  const [teamsPerPage, setTeamsPerPage] = useState(10);
  const [selectedTeam, setSelectedTeam] = useState(null); // New state for "see more"
  const containerRef = useRef(null);
  const [toastMessage, setToastMessage] = useState("");
  const [showToast, setShowToast] = useState(false);
  const [showJoinAlert, setShowJoinAlert] = useState(false);
  const handleJoinClick = () => {
    setShowJoinAlert(true);
  };
  const handleCancel = () => {
    setShowJoinAlert(false);
  };

  const handleConfirm = () => {
    setShowJoinAlert(false);
    // Handle join logic here (for example, an API call)
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
        const estimatedRowHeight = 95; // Approximate height of a single table row
        const rowsPerPage = Math.floor(containerHeight / estimatedRowHeight);
        setTeamsPerPage(rowsPerPage > 1 ? rowsPerPage : 10);
      }
    };

    updateTeamsPerPage();
    window.addEventListener("resize", updateTeamsPerPage);
    return () => window.removeEventListener("resize", updateTeamsPerPage);
  }, []);

  const totalPages = Math.ceil(existedTeams.length / teamsPerPage);
  const indexOfLastTeam = currentPage * teamsPerPage;
  const indexOfFirstTeam = indexOfLastTeam - teamsPerPage;
  const currentTeams = existedTeams.slice(indexOfFirstTeam, indexOfLastTeam);

  const handlePageChange = (newPage) => {
    if (newPage >= 1 && newPage <= totalPages) {
      setCurrentPage(newPage);
    }
  };

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

  // If a team is selected, render the details view
  if (selectedTeam) {
    return (
      <div>

        <Seemorepage
          myTeamNumber={selectedTeam.teamNumber}
          myTeamMembers={selectedTeam.teamMembers || []}
        />
      </div>
    );
  }

  const pageNumbers = getPageNumbers();

  return (
    <div className={Module["page-container"]}>
      <div className={Module["table-wrapper"]} ref={containerRef}>
        <table>
          <thead>
            <tr>
              <th>Team number</th>
              <th>Team creator</th>
              <th>Status</th>
              <th></th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {currentTeams.map((team, idx) => (
              <tr key={idx}>
                <td>{team.teamNumber}</td>
                <td>{team.teamCreator}</td>
                <td>
                  {team.status.includes("Open") ? (
                    <span className={Module["status-available"]}>{team.status}</span>
                  ) : (
                    <span className={Module["status-in-team"]}>{team.status}</span>
                  )}
                </td>
                <td>
                  {team.status.includes("Open") ? (
                    <button className={Module["invite-button"]} onClick={handleJoinClick}>Join</button>
                  ) : (
                    <span className={Module["disable-button"]}>Full</span>
                  )}
                </td>
                <td>
                  {/* Instead of navigating, update state to show the details */}
                  <button
                    className={Module["invite-button"]}
                    onClick={() => setSelectedTeam(team)}
                  >
                    See more
                  </button>
                </td>
              </tr>
            ))}
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
      <JoinTeamAlert
        show={showJoinAlert}
        onCancel={handleCancel}
        onConfirm={handleConfirm}
      />
      {showToast && (
        <Toast
          message={toastMessage || "Test Toast"}
          onClose={() => setShowToast(false)}
        />
      )}
    </div>
  );
};

export default ExistedTeamsTab;
