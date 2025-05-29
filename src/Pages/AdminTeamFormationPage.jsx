import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import Sidebar from "../components/Sidebar";
import Navbar from "../components/NavBar";
import AdminStudentsListTab from "../components/AdminStudentsListTab";
import AdminExistedTeamsTab from "../components/AdminExistedTeamsTab";
import MyTeamTab from "../components/MyTeamTab";
import AdminCreateTeamModal from "../components/modals/AdminCreateTeamModal";
import Toast from "../components/modals/Toast";

import Style from "../styles/TeamFormationPage.module.css";
import LeaveTeamPopup from "../components/modals/LeaveTeamPopup";
import { useSharedState } from '../contexts/SharedStateContext'; // Import the custom hook
import AutoOrganizeTeamsModal from "../components/modals/AutoOrganizeTeamsModal";
import { PulseLoader } from "react-spinners"; // Import the spinner you want to use

// Skip ngrok warning if you're using ngrok
axios.defaults.headers.common["ngrok-skip-browser-warning"] = "true";

function TeamFormationPage() {
  const navigate = useNavigate();
  const [adminTeamFormationActiveTab, setAdminTeamFormationActiveTab] = useState(() => {
    return localStorage.getItem("adminTeamFormationActiveTab") || "Students List";
  });
    const [showCreateTeamModal, setShowCreateTeamModal] = useState(false);
  const [toastMessage, setToastMessage] = useState("");
  const [showToast, setShowToast] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [showLeaveTeamPopup, setShowLeaveTeamPopup] = useState(false);
  const [students, setStudents] = useState([]);
  const [existedTeams, setExistedTeams] = useState([]);
  const [myTeam, setMyTeam] = useState(null);
  const [myTeamPendingInvites, setMyTeamPendingInvites] = useState([]);
  const [collaborationInvites, setCollaborationInvites] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const user = JSON.parse(localStorage.getItem("user"));
  const targetDate = new Date("2025-04-29T23:59:59");
  const { sessionsPageActiveTab, setSessionsPageActiveTab } = useSharedState();
  const [teamFormationSessionEnded,setTeamFormationSessionEnded] = useState(true);//temporarelly set to true (to implement later)
  const [showAutoOrganizeModal,setShowAutoOrganizeModal] = useState(false);
  const [selectedFilters, setSelectedFilters] = useState({
      Grade: ["1CS", "2CS", "3CS", "2CP"],
      Speciality: ["ISI", "SIW", "IASD"],
      Other: [],
    });
    
  
  // Called when NavBar’s filter is applied
  const handleFilterApply = (filters) => {
    setSelectedFilters(filters || { Grade: [], Speciality: [], Other: [] });
    
    };
  
useEffect(() => {
  localStorage.setItem("adminTeamFormationActiveTab", adminTeamFormationActiveTab);
}, [adminTeamFormationActiveTab]);

  
  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      setError("");

      try {
        if (adminTeamFormationActiveTab === "Students List") {
          const { data } = await axios.get("/users/students", {
            withCredentials: true,
          });
          console.log("API Response (Students List):", data);
          if (data && Array.isArray(data)) {
            setStudents(data);
          } else {
            console.error("Unexpected API Response Format for students:", data);
          }
        } else if (adminTeamFormationActiveTab === "Existed Teams") {
          const { data } = await axios.get("/teams/all", {
            withCredentials: true,
          });
          console.log("API Response (isted Teams):", data);
          // Map teams to include a computed status.
          // Use groupName as the team name.
          const teamsWithStatus = data.teams.map((team) => ({
            ...team,
            status:
              team.members &&
              team.maxNumber &&
              team.members.length >= team.maxNumber
                ? "full"
                : "open",
          }));
          setExistedTeams(teamsWithStatus);
        }
      } catch (err) {
        console.error("Fetch Error:", err);
        setError(err.response?.data?.message || err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [adminTeamFormationActiveTab]);

  // Format the students for display
  const formattedStudents = students.map((student) => ({
    id : student.id,
    fullName: `${student.firstname || ""} ${student.lastname || ""}`.trim(),
    email: student.user?.email || "No Email",
    year: student.year || "N/A",
    specialite: student.specialite || "",
    status: student.status || "No Status",
  }));

  console.log("Formatted Students Data:", formattedStudents);

  const handleSearchChange = (query) => {
    setSearchQuery(query);
  };

  // Filter students based on the search query
  const filteredStudents = formattedStudents.filter(
    (student) =>
      student.fullName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      student.email.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Render the appropriate tab content based on the active tab
  const renderTabContent = () => {
    if (adminTeamFormationActiveTab === "Students List") {
      return (
        <AdminStudentsListTab
          user={user}
          students={filteredStudents}
          selectedFilters={selectedFilters}   
          myTeamNumber={myTeam?.groupName || ""}
        />
      );
    } else if (adminTeamFormationActiveTab === "Existed Teams") {
      return (
        <AdminExistedTeamsTab
          user={user}
          existedTeams={existedTeams}
          navigate={navigate}
          selectedFilters={selectedFilters}
          students={formattedStudents}
          
        />
      );
    }
  };

  return (
    <div>
      <div>
        <Navbar 
          title={"Group formation session:"}
          targetDate={targetDate}
          onSearchChange={handleSearchChange}
          onFilterApply={handleFilterApply}
          selectedFilters={selectedFilters}
          suggestions={formattedStudents.map((s) => s.fullName)}
        />
        <div className={Style["team-formation-container"]}>
          <div className={Style["header-row"]}>
            <h1>Team formation</h1>

            <div className="buttons-container">
              <button
                className={Style["go-back-button"]}
                onClick={() => {
                 
                  navigate(-1);
                }}
              >
                go Back
              </button>
              {adminTeamFormationActiveTab === "Existed Teams" && teamFormationSessionEnded && (
                <button
                  className={Style["admin-auto-organize-button"]}
                  onClick={() => setShowAutoOrganizeModal(true)}
                >
                  auto-organize
                </button>
              )}
              {adminTeamFormationActiveTab === "Existed Teams" && (
         
               

                <button
                  className={Style["create-team-button"]}
                  onClick={() => setShowCreateTeamModal(true)}
                >
                  Create a team
                </button>
             
              )}
            
            </div>
          </div>

          <div className={Style["tabs"]}>
            {["Students List", "Existed Teams"].map((tab) => (
              <div
                key={tab}
                className={`${Style["tab-item"]} ${
                  adminTeamFormationActiveTab === tab ? Style.active : ""
                }`}
                onClick={() => setAdminTeamFormationActiveTab(tab)}
              >
                {tab}
              </div>
            ))}
          </div>

          {loading ? (
            <div className={Style["loaderContainer"]}>
            <div className={Style["loader"]}>
              <PulseLoader color="#077fd4" loading={loading} size={25} />
            </div>
          </div>
          ) : error ? (
            <div>Error: {error}</div>
          ) : (
            renderTabContent()
          )}
        </div>

        <AdminCreateTeamModal
          show={showCreateTeamModal}
          onClose={() => setShowCreateTeamModal(false)}
          setToastMessage={setToastMessage}
          setShowToast={setShowToast}
          students={formattedStudents}
        />
        <AutoOrganizeTeamsModal 
          show={showAutoOrganizeModal}
          onClose={() => setShowAutoOrganizeModal(false)}
          operation={"organize"}
        />
        
        
        {showToast && (
          <Toast message={toastMessage} onClose={() => setShowToast(false)} />
        )}
      </div>
    </div>
  );
}

export default TeamFormationPage;
