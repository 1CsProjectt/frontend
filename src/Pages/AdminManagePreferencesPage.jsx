import React, { useState, useEffect, useRef, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import Module from "../styles/AdminManagePreferencesPage.module.css";
import Seemorepage from "./AdminManagePreferencesSeeMorePage";
import NavBar from "../components/NavBar";
import Toast from "../components/modals/Toast";
import { getPaginatedData, getPageNumbers } from "../utils/paginationFuntion";
import DeleteUserModal from "../components/modals/DeleteUserModal";
import AutoOrganizeTeamsModal from "../components/modals/AutoOrganizeTeamsModal";
import { PulseLoader } from "react-spinners"; // Import the spinner you want to use
const ExistedTeamsTab = ({ user, students }) => {
  const [currentPage, setCurrentPage] = useState(1);
  const [teamsPerPage, setTeamsPerPage] = useState(7);
  const [selectedTeam, setSelectedTeam] = useState(null);
  const containerRef = useRef(null);
  const [toastMessage, setToastMessage] = useState("");
  const [showToast, setShowToast] = useState(false);
  const [isDeleteUserModalOpen, setDeleteUserModalOpen] = useState(false);
  const [teamIDtoDelete, setTeamIDtoDelete] = useState(null);
  const [teamsArray, setTeamsArray] = useState([]);
  const [activeTab, setActiveTab] = useState("Teams and Their selections");
  const [error, setError] = useState(null);
  const [showAutoOrganizeModal, setShowAutoOrganizeModal] = useState(false);
  const [loading, setLoading] = useState(true);
  // Filter state (specialities)
  const [selectedFilters, setSelectedFilters] = useState({
    Grade: ["1CS", "2CS", "3CS", "2CP"],
    Speciality: ["ISI", "SIW", "IASD"],
    Other: [],
  });
  

  const navigate = useNavigate();

  useEffect(() => {
    setLoading(true);
    const fetchAllTeams = async () => {
      try {
        const response = await axios.get("/teams/all-teams", {
          withCredentials: true,
        });
        setTeamsArray(response.data.teams);
        console.log("Fetched teams !!!!!!!!!!!!:", response.data.teams);
        setLoading(false);
      } catch (err) {
        console.error("Error fetching teams:", err);
        setLoading(false);
        setError(err.response?.data?.message || err.message);
      }
    };
    fetchAllTeams();
  }, []);

  // Adjust rows per page on resize
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

  // Called when NavBar’s filter is applied
  const handleFilterApply = (filters) => {
    setSelectedFilters(filters || { Grade: [], Speciality: [], Other: [] });
    setCurrentPage(1);
  };
  

  // Filter teamsArray by speciality if the first member’s year is 2CS or 3CS
  const filteredTeamsArray = useMemo(() => {
    if (!Array.isArray(teamsArray)) return [];
    
    return teamsArray.filter((team) => {
      const firstMember = team.members?.[0];
      if (!firstMember) return false;
  
      // Grade filter
      const gradeFilterPassed = selectedFilters.Grade.length === 0 || 
        selectedFilters.Grade.includes(firstMember.year);
        
      // Speciality filter (only for 2CS/3CS)
      const specialityFilterPassed = 
        !["2CS", "3CS"].includes(firstMember.year) || 
        selectedFilters.Speciality.length === 0 ||
        selectedFilters.Speciality.includes(firstMember.specialite);
  
      // Other filters (add additional filter logic here if needed)
      const otherFilterPassed = true; // Modify if implementing "Other" filters
  
      return gradeFilterPassed && specialityFilterPassed && otherFilterPassed;
    });
  }, [teamsArray, selectedFilters]);
  

  const { currentItems: currentTeams, totalPages } = getPaginatedData(
    filteredTeamsArray,
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
      <NavBar
        title=""
        targetDate={null}
        onFilterApply={handleFilterApply}
        selectedFilters={selectedFilters}
        suggestions={Array.isArray(students) ? students.map((s) => s.fullName) : []}
      />

      <div className={Module["team-formation-container"]}>
        <div className={Module["header-row"]}>
          <h1>Manage Preferences Lists</h1>
          <div className="buttons-container">
            <button
              className={Module["go-back-button"]}
              onClick={() => {
                if (selectedTeam) {
                  setSelectedTeam(null);
                } else {
                  navigate("/admin/sessions");
                }
              }}
            >
              go Back
            </button>
            {selectedTeam === null && (
              <button
                className={Module["admin-auto-organize-button"]}
                onClick={() => {
                  setShowAutoOrganizeModal(true);
                }}
              >
                auto-assign
              </button>
            )}
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
    selectedTeam={selectedTeam}
  />
) : loading ? (
  <div className={Module["loaderContainer"]}>
    <div className={Module["loader"]}>
      <PulseLoader color="#077fd4" loading={loading} size={25} />
    </div>
  </div>
) : (
  <div className={Module["table-wrapper"]} ref={containerRef}>
    <table>
      <thead>
        <tr>
          <th>Team Number</th>
          <th>Grade</th>
          <th>Speciality</th>
          <th>Team Supervisor</th>
          <th>Topic title</th>
          <th></th>
        </tr>
      </thead>
      <tbody>
        {currentTeams.map((team, idx) => {
          const firstMember = team.members && team.members[0];
          return (
            <tr key={idx}>
              <td>{team?.id ?? <span style={{ color: "#ff6666" }}>N/A</span>}</td>
              <td>{firstMember?.year ?? <span style={{ color: "#ff6666" }}>N/A</span>}</td>
              <td>{firstMember?.specialite ?? <span style={{ color: "#ff6666" }}></span>}</td>
              <td>
                {team.supervisor &&
                team.supervisor[0]?.firstname &&
                team.supervisor[0]?.lastname ? (
                  `${team.supervisor[0].firstname} ${team.supervisor[0].lastname}`
                ) : (
                  <span style={{ color: "#ff6666" }}>No supervisor assigned yet</span>
                )}
              </td>
              <td>
                {team.assignedPFE && team.assignedPFE.title ? (
                  team.assignedPFE.title
                ) : (
                  <span style={{ color: "#ff6666" }}>No topic assigned yet</span>
                )}
              </td>
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
        <AutoOrganizeTeamsModal
          show={showAutoOrganizeModal}
          onClose={() => setShowAutoOrganizeModal(false)}
          operation={"assign"}
        />
      </div>
    </div>
  );
};

export default ExistedTeamsTab;
