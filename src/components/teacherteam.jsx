import React, { useState, useEffect, useRef } from "react";
import Module from "../styles/TeamSelectionTeacher.module.css";
import Seemorepage from "../components/ExistedTeamSeemore";
import { getPaginatedData, getPageNumbers } from "../utils/paginationFuntion"; // Import the Seemorepage component
import axios from "axios";
import TeacherMeetingPage from "../Pages/teachermeetingspage";

const TEAM_INFORMATION = "Team Information";
const SUPERVISION_LOGS = "Supervision Logs";
const SOUTENANCE_CONTROL = "Soutenance control";

const TeacherTeam = () => {
  const [seeMore, setSeeMore] = useState(false);
  const [activeTab, setActiveTab] = useState(TEAM_INFORMATION); // Default to "Team Information"
  const [inteam, setInTeam] = useState(false);
  const [selectedTeamId, setSelectedTeamId] = useState(null);
  const [stages, setStages] = useState("1");
  const [seeMore2, setSeeMore2] = useState(false);
  const [historyseemore, setHistorySeeMore] = useState(false);
  const isgoingback =
    activeTab === "TEAM_INFORMATION" && stages === "1" ? true : false;
  return (
    <div className={Module["team-formation-container"]}>
      <div className={Module["header-part"]}>
        <div className={Module["header-container"]}>
          <p className="pagetitle">My teams</p>
          {seeMore && (
            <button
              className={Module["back-btn"]}
              onClick={() => {
                if (stages === "1") {
                  setSeeMore(false);
                  setInTeam(false);

                  setActiveTab(TEAM_INFORMATION);
                } else if (stages === "2") {
                  setSeeMore2(false);
                  setStages("1");
                } else if (stages === "3") {
                  setSeeMore2(false);
                  setHistorySeeMore(false);
                  setStages("1");
                }
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
              <button
                className={`tab-item ${
                  activeTab === SOUTENANCE_CONTROL ? "active" : ""
                }`}
                onClick={() => setActiveTab(SOUTENANCE_CONTROL)}
              >
                Soutenance control
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
      {activeTab === SUPERVISION_LOGS && !isgoingback && (
        <div>
          {" "}
          <TeacherMeetingPage
            teamid={selectedTeamId}
            stages={stages}
            setStages={setStages}
            seemore={seeMore2}
            setSeeMore={setSeeMore2}
            historyseemore={historyseemore}
            setHistorySeeMore={setHistorySeeMore}
            goingback={seeMore}
          />
        </div>
      )}
      {activeTab === SOUTENANCE_CONTROL && (
        <div
          style={{
            paddingTop: "1.4rem",
            paddingLeft: "1.4rem",
            paddingRight: "1.4rem",
            display: "flex",
            flexDirection: "column",
            alignItems: "flex-start",

            maxWidth: "50rem",
          }}
        >
          <p className="ttl-at" style={{ fontWeight: "bold" }}>
            Must be read
          </p>
          <p className="infos-at" style={{}}>
            Welcome to soutnace control section where you can confirm that this
            project team is ready for the soutenance. Teams confirmed earlier
            will be given scheduling priority. the place, time, and jury
            assignments will be set after this sessions ends, you and your team
            will be notified. your team need to upload their final deliverables
            before the soutnace starts. This action can only be performed once
            and cannot be undone
          </p>
          <button
            style={{
              marginTop: "1.4rem",
              background: "#077ED4",
              width: "25rem",
              height: "55px",
              border: "none", // ✅ removes border
              borderRadius: "8px", // optional: makes it look cleaner
              color: "white", // optional: makes text visible on blue background
              cursor: "pointer", // optional: adds pointer cursor on hover
            }}
          >
            <p className="managebtns-text-at-s">Confirm</p>
          </button>
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
