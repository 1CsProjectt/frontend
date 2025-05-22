import React, { useState, useEffect, useRef } from "react";
import Module from "../styles/TeamSelectionTeacher.module.css";
import Seemorepage from "../components/ExistedTeamSeemore";
import { getPaginatedData, getPageNumbers } from "../utils/paginationFuntion"; // Import the Seemorepage component
import axios from "axios";
import TeacherMeetingPage from "../Pages/teachermeetingspage";

const TEAM_INFORMATION = "Team Information";
const SUPERVISION_LOGS = "Supervision Logs";

const TeacherTeam = () => {
  const [seeMore, setSeeMore] = useState(false);
  const [activeTab, setActiveTab] = useState(TEAM_INFORMATION); // Default to "Team Information"
  const [inteam, setInTeam] = useState(false);
  const [selectedTeamId, setSelectedTeamId] = useState(null);

  return (
    <div className={Module["team-formation-container"]}>
      <div className={Module["header-part"]}>
        <div className={Module["header-container"]}>
          <p className="pagetitle">My teams</p>
          {seeMore && (
            <button
              className={Module["back-btn"]}
              onClick={() => {
                setSeeMore(false);
                setInTeam(false);
              }}
            >
              Back
            </button>
          )}
        </div>
        {inteam && (
          <div className="tabs-container">
            <div className="tabs">
              <button
                className={`tab-item ${
                  activeTab === TEAM_INFORMATION ? "active" : ""
                }`}
                onClick={() => {
                  setActiveTab(TEAM_INFORMATION);
                  setInTeam(true);
                }}
              >
                Team Information
              </button>
              <button
                className={`tab-item ${
                  activeTab === SUPERVISION_LOGS ? "active" : ""
                }`}
                onClick={() => setActiveTab(SUPERVISION_LOGS)}
              >
                Supervision Logs
              </button>
            </div>
          </div>
        )}
      </div>
      {/* Render Seemorepage component only when the Team Information tab is active */}
      {activeTab === TEAM_INFORMATION && (
        <ReceivedMyTeamsTab
          setInTeam={setInTeam}
          seeMore={seeMore}
          setSeeMore={setSeeMore}
          selectedTeamId={selectedTeamId}
          setSelectedTeamId={setSelectedTeamId}
        />
      )}{" "}
      {activeTab === SUPERVISION_LOGS && (
        <div>
          <TeacherMeetingPage teamid={selectedTeamId} />
        </div>
      )}
      {/* You can add further content for the Supervision Logs tab here if needed */}
    </div>
  );
};

const ReceivedMyTeamsTab = ({
  activeTab,
  selectedRequest,
  setSelectedRequest,
  setSelectedRequestid,
  selectedRequestid,
  setInTeam,
  seeMore,
  setSeeMore,
  selectedTeamId,
  setSelectedTeamId,
}) => {
  const [myTeamsList, setMyTeamsList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [myTeamsPerPage, setMyTeamsPerPage] = useState(10);
  // <<<<< ADD THIS
  // <<<< Optional if you want to pass team id
  const containerRef = useRef(null);

  const handleRowClick = (teamId) => {
    setInTeam(true);
    setSeeMore(true); // <<<<< Show SeeMorepage when clicked
    setSelectedTeamId(teamId); // <<<<< Save which team was clicked
  };

  useEffect(() => {
    const fetchReceivedMyTeams = async () => {
      try {
        const response = await axios.get("/teams/supervised-by-me");
        const teamsData = response.data?.teams;

        if (!teamsData || teamsData.length === 0) {
          // Static fallback data
          const fallbackTeams = [
            {
              order: 1,
              teamId: "StaticTeam001",
              teamCreator: "John Doe",
              membersCount: 3,
              // Add any other fields your UI expects
            },
          ];
          setMyTeamsList(fallbackTeams);
          return;
        }

        const teams = teamsData.map((team, index) => ({
          ...team,
          order: index + 1,
          teamId: team.id || "N/A",
          teamCreator: team.createdBy?.fullName || team.createdBy || "Unknown",
          membersCount: team.members?.length || 0,
        }));

        setMyTeamsList(teams);
      } catch (err) {
        console.error("Error fetching teams:", err);
        // Static fallback on error
        const fallbackTeams = [
          {
            order: 1,
            teamId: "StaticTeam001",
            teamCreator: "John Doe",
            membersCount: 3,
          },
        ];
        setMyTeamsList(fallbackTeams);
      } finally {
        setLoading(false);
      }
    };

    fetchReceivedMyTeams();
  }, []);

  useEffect(() => {
    const updateMyTeamsPerPage = () => {
      if (containerRef.current) {
        const containerHeight = containerRef.current.clientHeight;
        const estimatedRowHeight = 75;
        const rowsPerPage = Math.floor(containerHeight / estimatedRowHeight);
        setMyTeamsPerPage(Math.max(rowsPerPage, 1));
      }
    };

    updateMyTeamsPerPage();
    window.addEventListener("resize", updateMyTeamsPerPage);
    return () => window.removeEventListener("resize", updateMyTeamsPerPage);
  }, []);

  const currentTeams = myTeamsList;
  const { currentItems: paginatedTeams, totalPages } = getPaginatedData(
    currentTeams,
    currentPage,
    myTeamsPerPage
  );

  const pageNumbers = getPageNumbers(totalPages, currentPage);

  if (loading)
    return <div className={Module["loading-indicator"]}>Loading</div>;

  return (
    <div className={Module["page-container"]}>
      {error && <div className={Module["error-message"]}>{error}</div>}

      {seeMore ? (
        // <<<<< IF SEE MORE, SHOW SEEMOREPAGE
        <div style={{ padding: "10px" }}>
          <Seemorepage userRole="teacher.teams" myTeamNumber={selectedTeamId} />
        </div>
      ) : (
        <>
          <div className={Module["table-wrapper"]} ref={containerRef}>
            <table>
              <thead>
                <tr>
                  <th>Order</th> {/* Added Order column */}
                  <th>Team number</th>
                  <th>Team Creator</th>
                  <th>Members number</th>
                  <th></th>
                </tr>
              </thead>
              <tbody>
                {paginatedTeams.length > 0 ? (
                  paginatedTeams.map((team) => (
                    <tr key={team.id} className={Module["clickable-row"]}>
                      <td>{team.order}</td> {/* Display the order */}
                      <td>{team.teamId}</td>
                      <td>{team.teamCreator}</td>
                      <td>{team.membersCount}</td>
                      <td className={Module["button-container"]}>
                        <button
                          className={Module["invite-button"]}
                          onClick={() => handleRowClick(team.teamId)} // <<< handleRowClick
                        >
                          See More
                        </button>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="8" className={Module["no-data"]}>
                      No teams found
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          {totalPages > 1 && (
            <div className={Module["pagination"]}>
              <button
                onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
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
                      onClick={() => setCurrentPage(page)}
                      className={page === currentPage ? Module["active"] : ""}
                    >
                      {page}
                    </button>
                  )
                )}
              </div>

              <button
                onClick={() =>
                  setCurrentPage((p) => Math.min(totalPages, p + 1))
                }
                disabled={currentPage === totalPages}
                className={currentPage === totalPages ? Module["disabled"] : ""}
              >
                Next
              </button>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default TeacherTeam;
