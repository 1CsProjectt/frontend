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
import Style from "../styles/TeamFormationPage.module.css";
import LeaveTeamPopup from "../components/modals/LeaveTeamPopup";

// Skip ngrok warning if you're using ngrok
axios.defaults.headers.common["ngrok-skip-browser-warning"] = "true";

function TeamFormationPage() {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("Students List");
  const [showCreateTeamModal, setShowCreateTeamModal] = useState(false);
  const [toastMessage, setToastMessage] = useState("");
  const [showToast, setShowToast] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [showLeaveTeamPopup, setShowLeaveTeamPopup] = useState(false);
  const [students, setStudents] = useState([]);
  const [existedTeams, setExistedTeams] = useState([]);
  const [myTeam, setMyTeam] = useState(null);
  const [myTeamPendingInvites, setMyTeamPendingInvites] = useState([]);
  const [MyTeamteamReq, setMyTeamteamReq] = useState([]);

  const [collaborationInvites, setCollaborationInvites] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const user = JSON.parse(localStorage.getItem("user"));

  // Use session date from real version
  const session = {
    title: "Group formation session",
    targetDate: {
      start: new Date("2025-03-29T00:00:00"),
      end: new Date("2025-04-29T23:59:59")
    }
  };

  // Leave team handlers
  const handleLeaveClick = () => {
    setShowLeaveTeamPopup(true);
    console.log("leave clicked");
  };
  const handleCancel = () => {
    setShowLeaveTeamPopup(false);
  };
  const handleConfirm = async () => {
    setShowLeaveTeamPopup(false);
    
    try {
      
      const response = await axios.patch('/leaveteam');
      console.log(response.data);
      console.log("leave confirmed!");
      setToastMessage("Team leaving was successful.");
      setShowToast(true);
      
      setTimeout(() => {
        setShowToast(false);
      }, 3000);
    } catch (error) {
      console.error("Error:", error);
    }
  };
  
  // Data fetching using axios based on activeTab
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
          const { data } = await axios.get("/teams/allgroups", { withCredentials: true });
          console.log("API Response (Listed Teams):", data);
          const teamsWithStatus = data.teams.map(team => ({
            ...team,
            status: team.members && team.maxNumber && team.members.length === team.maxNumber ? "full" : "open"
          }));
          setExistedTeams(teamsWithStatus);
        } else if (activeTab === "My Team") {
          const { data: teamData } = await axios.get("/teams/myteam", { withCredentials: true });
          console.log("API Response (My Team):", teamData);
          setMyTeam(teamData.team);
          if (teamData?.team?.id) {
            const { data: pendingInvites } = await axios.get("/invitation/getallmyinvitations", { withCredentials: true });
            setMyTeamPendingInvites(pendingInvites);
            const { data: teamReq } = await axios.get("/jointeam//getalljoinmyteamrequests", { withCredentials: true });
            setMyTeamteamReq(teamReq);
            console.log("API Response (My Team req Invites):", teamReq);
          } else {
            const { data: collabInvites } = await axios.get("/invitation/getallmyrecievedinvitations", { withCredentials: true });
            setCollaborationInvites(collabInvites);
            console.log("API Response (Collaboration Invites):", collabInvites);

            
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

  // Format students list for display
  const formattedStudents = students.map(student => ({
    fullName: `${student.firstname || ""} ${student.lastname || ""}`.trim(),
    email: student.user?.email || "No Email",
    status: student.status || "No Status",
  }));

  // Filter students based on search query; disable update if in My Team tab
  const handleSearchChange = (query) => {
    if (activeTab === "My Team") {
      // Do not update search query for My Team
      return;
    }
    setSearchQuery(query);
  };

  const filteredStudents = formattedStudents.filter(student =>
    student.fullName.toLowerCase().includes(searchQuery.toLowerCase()) ||
    student.email.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const filteredTeams = existedTeams.filter(team =>
    team.groupName.toLowerCase().includes(searchQuery.toLowerCase())
  );

  let suggestionsList = [];
  if (activeTab === "Students List") {
    suggestionsList = formattedStudents.map(s => s.fullName);
  } else if (activeTab === "Existed Teams") {
    suggestionsList = existedTeams.map(team => team.groupName);
  }

  const renderTabContent = () => {
    if (activeTab === "Students List") {
      return (
        <StudentsListTab 
          user={user} 
          students={filteredStudents} 
          myTeamNumber={myTeam?.id || ""} 
        />
      );
    } else if (activeTab === "Existed Teams") {
      return (
        <ExistedTeamsTab 
          user={user} 
          existedTeams={filteredTeams} 
          navigate={navigate} 
        />
      );
    } else if (activeTab === "My Team") {
      return (
        <MyTeamTab
          myTeamNumber={myTeam?.id}
          myTeamMembers={myTeam?.members || []}
          myTeamPendingInvites={myTeamPendingInvites}
          collaborationInvites={collaborationInvites}
          reqInvites ={MyTeamteamReq}
        />
      );
    }
  };

  return (
    <div className={Style["team-formation-page"]}>
      <Sidebar />
      <div style={{ marginLeft: "16vw" }}>
        <Navbar
          title={session.title}
          targetDate={session.targetDate}
          onSearchChange={handleSearchChange}
          suggestions={suggestionsList}
        />

        <div className={Style["team-formation-container"]}>
          <div className={Style["header-row"]}>
            <h1>Team formation</h1>
            {activeTab === "Existed Teams" && (
              <button className={Style["create-team-button"]} onClick={() => setShowCreateTeamModal(true)}>
                Create a team
              </button>
            )}
            {activeTab === "My Team" && myTeam?.id && (
              <button className={Style["Leave-button"]} onClick={handleLeaveClick}>
                Leave the team
              </button>
            )}
          </div>

          <div className={Style["tabs"]}>
            {["Students List", "Existed Teams", "My Team"].map(tab => (
              <div
                key={tab}
                className={`${Style["tab-item"]} ${activeTab === tab ? Style.active : ""}`}
                onClick={() => {
                  setActiveTab(tab);
                  setSearchQuery(""); // Reset search query on tab change
                }}
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
        <LeaveTeamPopup
          show={showLeaveTeamPopup}
          onCancel={handleCancel}
          onConfirm={handleConfirm}
        />
        {showToast && <Toast message={toastMessage} onClose={() => setShowToast(false)} />}
      </div>
    </div>
  );
}

export default TeamFormationPage;
