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
import Infoicon from "../assets/info_24px.svg";
import { API_URL } from "../config";

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
  // ▶️ change to state + effect
  const [user, setUser] = useState(() => {
    const json = localStorage.getItem("user");
    return json ? JSON.parse(json) : {};
  });

  // ▶️ whenever `user` changes, save it
  useEffect(() => {
    localStorage.setItem("user", JSON.stringify(user));
  }, [user]);
  // Use session date from real version
  const session = {
    title: "TEAM_CREATION",
    targetDate: {
      start: new Date("2025-03-29T00:00:00"),
      end: new Date("2025-04-29T23:59:59")
    }
  };

  let sessionTitle;

  if (session.title === "TEAM_CREATION") {
    sessionTitle = "Group formation session";
  } else if (session.title === "TOPIC_SELECTION") {
    sessionTitle = "Select topics session";
  } else {
    sessionTitle = "Unknown session";
  }
  const fetchexistedTeamData = async () => {
    const { data } = await axios.get(`${API_URL}/teams/allgroups`, { withCredentials: true });
    console.log("API Response (Listed Teams):", data);
    const teamsWithStatus = data.teams.map(team => ({
      ...team,
      status:
        sessionTitle === "select topics session"
          ? "Full"
          : team.members && team.maxNumber && team.members.length === team.maxNumber
            ? "Full"
            : "Open",
    }));

    setExistedTeams(teamsWithStatus);
  };
  const fetchStudentData = async () => {
    const { data } = await axios.get(`${API_URL}/student/liststudents`, { withCredentials: true });
    console.log("API Response (Students List):", data);
    if (data && Array.isArray(data.students)) {
      setStudents(data.students);
    } else {
      console.error("Unexpected API Response Format for students:", data);
    }
  };

  const fetchMyTeamData = async () => {
    try {
      const { data: teamData } = await axios.get(`${API_URL}/teams/myteam`, { withCredentials: true });
      setMyTeam(teamData.team);
      if (sessionTitle === "Group formation session") {
        if (teamData?.team?.id) {
          const { data: pendingInvites } = await axios.get(`${API_URL}/invitation/getallmyinvitations`, { withCredentials: true });
          setMyTeamPendingInvites(pendingInvites);
console.log(pendingInvites);
          const { data: teamReq } = await axios.get(`${API_URL}/jointeam//getalljoinmyteamrequests`, { withCredentials: true });
          setMyTeamteamReq(teamReq);
        } else {
          const { data: collabInvites } = await axios.get(`${API_URL}/invitation/getallmyrecievedinvitations`, { withCredentials: true });
          setCollaborationInvites(collabInvites);
        }
      }

    } catch (err) {
      console.error("Fetch My Team Error:", err);
      setError(err.response?.data?.message || err.message);
    }
  };

  // Leave team handlers
  const handleLeaveClick = () => {

    setShowLeaveTeamPopup(true);
    console.log("leave clicked");
       // ▶️ Update user.team_id to null in state + localStorage
         const updatedUser = { ...user, team_id: null };
      setUser(updatedUser);
  };
  const handleCancel = () => {
    setShowLeaveTeamPopup(false);
  };
  const handleConfirm = async () => {
    setShowLeaveTeamPopup(false);
    try {
      const response = await axios.patch(`${API_URL}/teams/leaveTeam`);
      console.log(response.data);
      console.log("leave confirmed!");
      fetchMyTeamData();
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
        if (activeTab === "Students List" && sessionTitle === "Group formation session") {
          fetchStudentData();
        } else if (activeTab === "Existed Teams") {
          fetchexistedTeamData();
        } else if (activeTab === "My Team") {
          fetchMyTeamData();
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
        <>
          {sessionTitle === "Group formation session" ? (
            <StudentsListTab
              user={user}
              students={filteredStudents}
              myTeamNumber={myTeam?.id || ""}
              setUser={setUser}
            />
          ) : (
            <div className={Style["topicssession-students-list"]}>

              <img src={Infoicon} alt="PFE Topics" className={Style["icon"]} />
              <p>The team formation session has ended, and the teams have been created.</p>

            </div>
          )}
        </>
      );
    }

    else if (activeTab === "Existed Teams") {
      return (
        <ExistedTeamsTab
          user={user}
          existedTeams={filteredTeams}
          navigate={navigate}
          session={sessionTitle}
        />
      );
    } else if (activeTab === "My Team") {
      return (
        <MyTeamTab
          myTeamNumber={myTeam?.id}
          myTeamMembers={myTeam?.members || []}
          myTeamPendingInvites={myTeamPendingInvites}
          collaborationInvites={collaborationInvites}
          reqInvites={MyTeamteamReq}
          session={sessionTitle}
          reloadMyTeam={fetchMyTeamData}
        />
      );
    }
  };

  return (
    <div className={Style["team-formation-page"]}>
      <Sidebar />
      <div style={{ marginLeft: "16vw" }}>
        <Navbar
          title={sessionTitle}
          targetDate={session.targetDate}
          onSearchChange={handleSearchChange}
          suggestions={suggestionsList}
        />

        <div className={Style["team-formation-container"]}>
          <div className={Style["header-row"]}>
            <h1>Team formation</h1>

            {sessionTitle === "Group formation session" && (
              <>
                {(activeTab === "Existed Teams") && (
                  <button
                    className={Style["create-team-button"]}
                    onClick={() => setShowCreateTeamModal(true)}
                  >
                    Create a team
                  </button>
                )}
                {activeTab === "My Team" && myTeam?.id && (
                  <button
                    className={Style["Leave-button"]}
                    onClick={handleLeaveClick}
                  >
                    Leave the team
                  </button>
                )}
              </>
            )}

          </div>

          <div className={Style["tabs"]}>
            {["Students List", "Existed Teams", "My Team"].map(tab => (
              <div
                key={tab}
                className={`${Style["tab-item"]} ${activeTab === tab ? Style.active : ""}`}
                onClick={() => {
                  setActiveTab(tab);
                  setSearchQuery("");
                }}
              >
                {tab}
              </div>
            ))}
          </div>

          {loading
            ? <div>Loading...</div>
            : error
              ? <div>Error: {error}</div>
              : renderTabContent()
          }
        </div>

        {/* Moved the CreateTeamModal link (le lien) directly in TeamFormationPage */}
        <CreateTeamModal
          show={showCreateTeamModal}
          onClose={() => setShowCreateTeamModal(false)}
          onTeamCreated={() => {
            fetchexistedTeamData();
            setToastMessage("Team created successfully.");
            setShowToast(true);
            setTimeout(() => {
              setShowToast(false);
            }, 3000);
          }}
          onInviteSent={() => {
            setToastMessage("Invite sent successfully.");
            setShowToast(true);
            setTimeout(() => {
              setShowToast(false);
            }, 3000);
          }}
          user={user}
        />

        <LeaveTeamPopup
          show={showLeaveTeamPopup}
          onCancel={handleCancel}
          onConfirm={handleConfirm}
        />
        {showToast && (
          <Toast
            message={toastMessage}
            onClose={() => setShowToast(false)}
          />
        )}
      </div>
    </div>
  );
}

export default TeamFormationPage;
