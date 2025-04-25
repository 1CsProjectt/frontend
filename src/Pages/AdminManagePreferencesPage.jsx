import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { useMemo } from "react";
import axios from "axios";
import Module from "../styles/AdminManagePreferencesPage.module.css";
import Seemorepage from "./AdminManagePreferencesSeeMorePage";
import NavBar from "../components/NavBar";
import Toast from "../components/modals/Toast";
import { getPaginatedData, getPageNumbers } from "../utils/paginationFuntion";
import DeleteUserModal from "../components/modals/DeleteUserModal";

const ExistedTeamsTab = ({ user, students }) => {
  const [currentPage, setCurrentPage] = useState(1);
  const [teamsPerPage, setTeamsPerPage] = useState(10);
  const [selectedTeam, setSelectedTeam] = useState(null);
  const containerRef = useRef(null);
  const [toastMessage, setToastMessage] = useState("");
  const [showToast, setShowToast] = useState(false);
  const [showJoinAlert, setShowJoinAlert] = useState(false);
  const [isDeleteUserModalOpen, setDeleteUserModalOpen] = useState(false);
  const [teamIDtoDelete, setTeamIDtoDelete] = useState(null);
  const [teamsArray, setTeamsArray] = useState([]);
  const [activeTab, setActiveTab] = useState("Teams and Their selections");
  const navigate = useNavigate();
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchAllTeams = async () => {
      try {
        const response = await axios.get("/teams/all-teams", {
          withCredentials: true,
        });
        setTeamsArray(response.data.teams);
        console.log("Teams:", response.data);
      } catch (err) {
        console.error("Error fetching teams:", err);
        setError(err.response?.data?.message || err.message);
      }
    };
    fetchAllTeams();
  }, []);

  useEffect(() => {
    console.log("teamsArray in the manage preferences page", teamsArray);
  }, [teamsArray]);

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

  const { currentItems: currentTeams, totalPages } = getPaginatedData(
    Array.isArray(teamsArray) ? teamsArray : [],
    currentPage,
    teamsPerPage
  );

  const pageNumbers = getPageNumbers(totalPages, currentPage);

  const mappedMembers = useMemo(() => {
    if (!selectedTeam || !selectedTeam.members) return [];
    return selectedTeam.members.map((member) => ({
      id: member.id,
      fullName: `${member.firstname} ${member.lastname}`,
      email: member.user?.email || "N/A",
      role: member.role || "Member",
    }));
  }, [selectedTeam]);

  const handlePageChange = (newPage) => {
    if (newPage >= 1 && newPage <= totalPages) {
      setCurrentPage(newPage);
    }
  };

  return (
    <div className={Module["page-container"]}>
      <NavBar />
      <div className={Module["team-formation-container"]}>
        <div className={Module["header-row"]}>
          <h1>Manage Preferences Lists</h1>
          <div className="buttons-container">
            <button
              className={Module["go-back-button"]}
              onClick={() =>{ if(selectedTeam) {setSelectedTeam(null) }else { navigate("/admin/sessions")}}}
            >
              go Back
            </button>
            <button className={Module["admin-auto-organize-button"]}>
              auto-organize
            </button>
          </div>
        </div>

        <div className={Module["tabs"]}>
          {["Teams and Their selections"].map((tab) => (
            <div
              key={tab}
              className={`${Module["tab-item"]} ${
                activeTab === tab ? Module.active : ""
              }`}
              onClick={() => setActiveTab(tab)}
            >
              Teams and their selections
            </div>
          ))}
        </div>

        {selectedTeam ? (
          <Seemorepage
            myTeamNumber={selectedTeam.id}
            myTeamMembers={mappedMembers}
            students={students}
            onBack={() => setSelectedTeam(null)}
          />
        ) : (
          <div className={Module["table-wrapper"]} ref={containerRef}>
            <table>
              <thead>
                <tr>
                  <th>Team Number</th>
                  <th>Grade</th>
                  <th>SupervisorID</th>
                  <th>Topic title</th>
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
                      <td>{team?.id || "N/A"}</td>
                      <td>{team?.members[0]?.year || "N/A"}</td>
                      <td>{team?.supervisorId || "No supervisor assigned yet"}</td>
                      <td>{"N/A"}</td>
                      <td className={Module["button-container"]}>
                        <button
                          className={Module["invite-button"]}
                          style={{ width: "90px", marginRight: "15px" }}
                          onClick={() => setSelectedTeam(team)}
                        >
                          See More
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}

        {selectedTeam === null && (
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
        )}

        {showToast && (
          <Toast
            message={toastMessage || "Test Toast"}
            onClose={() => setShowToast(false)}
          />
        )}
        <DeleteUserModal
          isOpen={isDeleteUserModalOpen}
          onClose={() => setDeleteUserModalOpen(false)}
          entityType="Team"
          teamIDtoDelete={teamIDtoDelete}
        />
      </div>
    </div>
  );
};

export default ExistedTeamsTab;
