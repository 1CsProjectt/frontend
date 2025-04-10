import React, { useState, useEffect } from "react";
// import axios from "axios"; // No longer needed for dummy data
import { useNavigate } from "react-router-dom";
import Sidebar from "../components/Sidebar";
import Navbar from "../components/NavBar";
import StudentsListTab from "../components/StudentsListTab";
import ExistedTeamsTab from "../components/ExistedTeamsTab";
import MyTeamTab from "../components/MyTeamTab";
import CreateTeamModal from "../components/CreateTeamModal";
import Toast from "../components/Toast";
import JoinTeamModal from "../components/JoinTeamAlert";
import Style from "../styles/TeamFormationPage.module.css";
import LeaveTeamPopup from "../components/LeaveTeamPopup";

// Dummy data for demonstration
const dummyStudents = [
  {
    firstname: "1Alice",
    lastname: "Smith",
    user: { email: "alice@example.com" },
    status: "available"
  },
  {
    firstname: "2Bob",
    lastname: "Jones",
    user: { email: "bob@example.com" },
    status: "available"
  },
  {
    firstname: "3Bob",
    lastname: "Jones",
    user: { email: "bob@example.com" },
    status: "available"
  },
  {
    firstname: "4Bob",
    lastname: "Jones",
    user: { email: "bob@example.com" },
    status: "Full"
  },
  {
    firstname: "5Bob",
    lastname: "Jones",
    user: { email: "bob@example.com" },
    status: "Full"
  },
  {
    firstname: "6Bob",
    lastname: "Jones",
    user: { email: "bob@example.com" },
    status: "Full"
  },
  {
    firstname: "7Bob",
    lastname: "Jones",
    user: { email: "bob@example.com" },
    status: "Full"
  },
  {
    firstname: "8Bob",
    lastname: "Jones",
    user: { email: "bob@example.com" },
    status: "available"
  },
  {
    firstname: "9Bob",
    lastname: "Jones",
    user: { email: "bob@example.com" },
    status: "available"
  },
  {
    firstname: "10Bob",
    lastname: "Jones",
    user: { email: "bob@example.com" },
    status: "available"
  },
  {
    firstname: "11Bob",
    lastname: "Jones",
    user: { email: "bob@example.com" },
    status: "available"
  },
  {
    firstname: "12Bob",
    lastname: "Jones",
    user: { email: "bob@example.com" },
    status: "available"
  },
  {
    firstname: "13Bob",
    lastname: "Jones",
    user: { email: "bob@example.com" },
    status: "available"
  },
  {
    firstname: "14Bob",
    lastname: "Jones",
    user: { email: "bob@example.com" },
    status: "available"
  },
  {
    firstname: "15Bob",
    lastname: "Jones",
    user: { email: "bob@example.com" },
    status: "Full"
  }
];

const dummyExistedTeams = [
  {
    id: 1,
    groupName: "Team Alpha",
    members: [{ firstname: "Charlie", lastname: "Brown" }],
    maxNumber: 3
  },
  {
    id: 2,
    groupName: "Team Beta",
    members: [
      { firstname: "Dave", lastname: "Williams" },
      { firstname: "Eva", lastname: "Jones" }
    ],
    maxNumber: 2
  },
  {
    id: 3,
    groupName: "Team Beta",
    members: [
      { firstname: "Dave", lastname: "Williams" },
      { firstname: "Eva", lastname: "Jones" }
    ],
    maxNumber: 2
  },
  {
    id: 4,
    groupName: "Team Beta",
    members: [
      { firstname: "Dave", lastname: "Williams" },
      { firstname: "Eva", lastname: "Jones" }
    ],
    maxNumber: 2
  },
  {
    id: 5,
    groupName: "Team Beta",
    members: [
      { firstname: "Dave", lastname: "Williams" },
      { firstname: "Eva", lastname: "Jones" }
    ],
    maxNumber: 2
  },
  {
    id: 6,
    groupName: "Team Beta",
    members: [
      { firstname: "Dave", lastname: "Williams" },
      { firstname: "Eva", lastname: "Jones" }
    ],
    maxNumber: 5
  }, {
    id: 7,
    groupName: "Team Alpha",
    members: [{ firstname: "Charlie", lastname: "Brown" }],
    maxNumber: 3
  }, {
    id: 8,
    groupName: "Team Alpha",
    members: [{ firstname: "Charlie", lastname: "Brown" }],
    maxNumber: 3
  }, {
    id: 9,
    groupName: "Team Alpha",
    members: [{ firstname: "Charlie", lastname: "Brown" }],
    maxNumber: 3
  }, {
    id: 10,
    groupName: "Team Alpha",
    members: [{ firstname: "Charlie", lastname: "Brown" }],
    maxNumber: 3
  }, {
    id: 11,
    groupName: "Team Alpha",
    members: [{ firstname: "Charlie", lastname: "Brown" }],
    maxNumber: 3
  }, {
    id: 12,
    groupName: "Team Alpha",
    members: [{ firstname: "Charlie", lastname: "Brown" }],
    maxNumber: 3
  }
];

const dummyMyTeam = {
  id: 1,
  groupName: "Team Alpha",
  members: [{ firstname: "Charlie", lastname: "Brown" }],
};

const dummyPendingInvites = [
  {
    id: 101,
    teamName: "Team Gamma",
    from: "John Doe"
  },{
    id: 101,
    teamName: "Team Gamma",
    from: "John Doe"
  },{
    id: 101,
    teamName: "Team Gamma",
    from: "John Doe"
  },{
    id: 101,
    teamName: "Team Gamma",
    from: "John Doe"
  }
];

const dummyCollaborationInvites = [
  {
    id: 202,
    teamName: "Team Delta",
    from: "Jane Doe"
  }, {
    id: 202,
    teamName: "Team Delta",
    from: "Jane Doe"
  }, {
    id: 202,
    teamName: "Team Delta",
    from: "Jane Doe"
  }
];

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
  const [collaborationInvites, setCollaborationInvites] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const user = JSON.parse(localStorage.getItem("user"));
  const targetDate = new Date("2025-04-29T23:59:59");

  const handleJoinClick = () => {
    setShowLeaveTeamPopup(true);
    console.log("leave clicked");
  };

  const handleCancel = () => {
    setShowLeaveTeamPopup(false);
  };

  const handleConfirm = () => {
    setShowLeaveTeamPopup(false);
    // Perform leave action simulation
    console.log("leave confirmed!");
    setToastMessage("Team leaving was successful.");
    setShowToast(true);
    setTimeout(() => {
      setShowToast(false);
    }, 3000);
  };

  useEffect(() => {
    setLoading(true);
    setError("");

    // Simulate an API call delay
    setTimeout(() => {
      if (activeTab === "Students List") {
        setStudents(dummyStudents);
      } else if (activeTab === "Existed Teams") {
        const teamsWithStatus = dummyExistedTeams.map(team => ({
          ...team,
          status:
            team.members.length === team.maxNumber ? "full" : "open"
        }));
        setExistedTeams(teamsWithStatus);
      } else if (activeTab === "My Team") {
        setMyTeam(dummyMyTeam);
        if (dummyMyTeam.id) {
          setMyTeamPendingInvites(dummyPendingInvites);
        } else {
          setCollaborationInvites(dummyCollaborationInvites);
        }
      }
      setLoading(false);
    }, 500);
  }, [activeTab]);

  const formattedStudents = students.map(student => ({
    fullName: `${student.firstname || ""} ${student.lastname || ""}`.trim(),
    email: student.user?.email || "No Email",
    status: student.status || "No Status",
  }));

  const handleSearchChange = (query) => {
    setSearchQuery(query);
  };

  const filteredStudents = formattedStudents.filter(student =>
    student.fullName.toLowerCase().includes(searchQuery.toLowerCase()) ||
    student.email.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const renderTabContent = () => {
    if (activeTab === "Students List") {
      return <StudentsListTab user={user} students={filteredStudents} myTeamNumber={myTeam?.groupName || ""} />;
    } else if (activeTab === "Existed Teams") {
      return <ExistedTeamsTab user={user} existedTeams={existedTeams} navigate={navigate} />;
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
              <button className={Style["Leave-button"]} onClick={handleJoinClick}>
                Leave the team
              </button>
            )}
          </div>

          <div className={Style["tabs"]}>
            {["Students List", "Existed Teams", "My Team"].map(tab => (
              <div
                key={tab}
                className={`${Style["tab-item"]} ${activeTab === tab ? Style.Full : ""}`}
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
