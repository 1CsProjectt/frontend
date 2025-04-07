import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import Sidebar from "../components/Sidebar";
import Navbar from "../components/NavBar";
import StudentsListTab from "../components/StudentsListTab";
import ExistedTeamsTab from "../components/ExistedTeamsTab";
import MyTeamTab from "../components/MyTeamTab";
import CreateTeamModal from "../components/modals/CreateTeamModal";
import Toast from "../components/modals/Toast";
import JoinTeamModal from "../components/modals/JoinTeamAlert";
import Style from "../styles/TeamFormationPage.module.css";
const existedTeamsss =[]; 
// Skip ngrok warning if you're using ngrok
axios.defaults.headers.common["ngrok-skip-browser-warning"] = "true";

function TeamFormationPage() {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("Students List");
  const [showCreateTeamModal, setShowCreateTeamModal] = useState(false);
  const [toastMessage, setToastMessage] = useState("");
  const [showToast, setShowToast] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  const [students, setStudents] = useState([]);
  const [existedTeams, setExistedTeams] = useState([]);
  const [myTeam, setMyTeam] = useState(null);
  const [myTeamPendingInvites, setMyTeamPendingInvites] = useState([]);
  const [collaborationInvites, setCollaborationInvites] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const targetDate = new Date("2025-04-29T23:59:59");

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      setError("");

      try {
        if (activeTab === "Students List") {
          const { data } = await axios.get("/student/liststudents", { withCredentials: true });
          console.log("API Response (Students List):", data);
          if (data && Array.isArray(data.students)) {
            setStudents(data.students);
          } else {
            console.error("Unexpected API Response Format for students:", data);
          }
        } else if (activeTab === "Existed Teams") {
          const { data } = await axios.get("/teams/all", { withCredentials: true });
          console.log("API Response (Existed Teams):", data);
          // Map teams to include a computed status.
          // Use groupName as the team name.
          const teamsWithStatus = data.teams.map(team => ({
            ...team,
            status:
              team.members && team.maxNumber && team.members.length === team.maxNumber
                ? "full"
                : "open"
          }));
          setExistedTeams(teamsWithStatus);
        } else if (activeTab === "My Team") {
          const { data: teamData } = await axios.get("/teams/myteam", { withCredentials: true });
          console.log("API Response (My Team):", teamData);
          setMyTeam(teamData.team);
          console.log("team member ",teamData.team.members)
          if (teamData?.team?.id) {
            const { data: pendingInvites } = await axios.get("/invitation/getallmyinvitations", { withCredentials: true });
            setMyTeamPendingInvites(pendingInvites);
            console.log("The pendingInvites",pendingInvites)
          } else {
            const { data: collabInvites } = await axios.get("invitation/getallmyrecievedinvitations", { withCredentials: true });
            setCollaborationInvites(collabInvites);
            console.log("The collaborationInvites",collabInvites)
          }
        }
      } catch (err) {
        console.error("Fetch Error:", err);
        setError(err.response?.data?.message || err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [activeTab]);

  // Format the students for display
  const formattedStudents = students.map(student => ({
    fullName: `${student.firstname || ""} ${student.lastname || ""}`.trim(),
    email: student.user?.email || "No Email",
  
    status: student.status || "No Status",
  }));

  console.log("Formatted Students Data:", formattedStudents);

  const handleSearchChange = (query) => {
    setSearchQuery(query);
  };

  // Filter students based on the search query
  const filteredStudents = formattedStudents.filter(student =>
    student.fullName.toLowerCase().includes(searchQuery.toLowerCase()) ||
    student.email.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Render the appropriate tab content based on the active tab
  const renderTabContent = () => {
    if (activeTab === "Students List") {
      return <StudentsListTab students={filteredStudents} myTeamNumber={myTeam?.groupName || ""} />;
    } else if (activeTab === "Existed Teams") {
      return <ExistedTeamsTab existedTeams={existedTeamsss} navigate={navigate} />;
    } else if (activeTab === "My Team") {
      return (
        <MyTeamTab
          myTeamNumber={myTeam?.id}
          myTeamMembers={myTeam?.members || []}
          myTeamPendingInvites={myTeamPendingInvites}
          collaborationInvites={collaborationInvites}
        />
      );
    }
  };

  return (
    <div>
      <Sidebar />
      <div style={{ marginLeft: "16vw" }}>
        <Navbar
          title={"Group formation session:"}
          targetDate={targetDate}
          onSearchChange={handleSearchChange}
          suggestions={formattedStudents.map(s => s.fullName)}
        />
        <div className={Style["team-formation-container"]}>
          <div className={Style["header-row"]}>
            <h1>Team formation</h1>
            {activeTab === "Existed Teams" && (
              <button className={Style["create-team-button"]} onClick={() => setShowCreateTeamModal(true)}>
                Create a team
              </button>
            )}
            {activeTab === "My Team" && myTeam?.groupName && (
              <button className={Style["Leave-button"]} onClick={() => setShowCreateTeamModal(true)}>
                Leave the team
              </button>
            )}
          </div>

          <div className={Style["tabs"]}>
            {["Students List", "Existed Teams", "My Team"].map(tab => (
              <div
                key={tab}
                className={`${Style["tab-item"]} ${activeTab === tab ? Style.active : ""}`}
                onClick={() => setActiveTab(tab)}
              >
                {tab}
              </div>
            ))}
          </div>

          {loading ? <div>Loading...</div> : error ? <div>Error: {error}</div> : renderTabContent()}
        </div>

        <CreateTeamModal
          show={showCreateTeamModal}
          onClose={() => setShowCreateTeamModal(false)}
          onTeamCreated={() => setToastMessage("Team created successfully.")}
          onInviteSent={() => setToastMessage("Invite sent successfully.")}
        />
        {showToast && <Toast message={toastMessage} onClose={() => setShowToast(false)} />}
      </div>
    </div>
  );
}

export default TeamFormationPage;
