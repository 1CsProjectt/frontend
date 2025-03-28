import React, { useState } from "react";
import Sidebar from "../components/Sidebar";
import Navbar from "../components/NavBar";
import StudentsListTab from "../components/StudentsListTab";
import ExistedTeamsTab from "../components/ExistedTeamsTab";
import MyTeamTab from "../components/MyTeamTab";
import CreateTeamModal from "../components/CreateTeamModal";
import Toast from "../components/Toast";
import JoinTeamModal from "../components/CreateTeamModal";
import "../styles/TeamFormationPage.css";

function TeamFormationPage() {
  const [activeTab, setActiveTab] = useState("Students List");
  const [showCreateTeamModal, setShowCreateTeamModal] = useState(false);
  const [toastMessage, setToastMessage] = useState("");
  const [showToast, setShowToast] = useState(false);

  // Sample data for Students List
  const students = [
    { fullName: "Ahmed Ibn Khaled", email: "ahmed.khaled@site-dz.stat.dz", group: "G1", status: "Available" },
    { fullName: "Sara Mahmoud Al-Ali", email: "sara.al-ali@site-dz.stat.dz", group: "G2", status: "In a team" }, { fullName: "Ahmed Ibn Khaled", email: "ahmed.khaled@site-dz.stat.dz", group: "G1", status: "Available" },
    { fullName: "Sara Mahmoud Al-Ali", email: "sara.al-ali@site-dz.stat.dz", group: "G2", status: "In a team" }, { fullName: "Ahmed Ibn Khaled", email: "ahmed.khaled@site-dz.stat.dz", group: "G1", status: "Available" },
    { fullName: "Sara Mahmoud Al-Ali", email: "sara.al-ali@site-dz.stat.dz", group: "G2", status: "In a team" }, { fullName: "Ahmed Ibn Khaled", email: "ahmed.khaled@site-dz.stat.dz", group: "G1", status: "Available" },
    { fullName: "Sara Mahmoud Al-Ali", email: "sara.al-ali@site-dz.stat.dz", group: "G2", status: "In a team" }, { fullName: "Ahmed Ibn Khaled", email: "ahmed.khaled@site-dz.stat.dz", group: "G1", status: "Available" },
    { fullName: "Sara Mahmoud Al-Ali", email: "sara.al-ali@site-dz.stat.dz", group: "G2", status: "In a team" }, { fullName: "Ahmed Ibn Khaled", email: "ahmed.khaled@site-dz.stat.dz", group: "G1", status: "Available" },
    { fullName: "Sara Mahmoud Al-Ali", email: "sara.al-ali@site-dz.stat.dz", group: "G2", status: "In a team" }, { fullName: "Ahmed Ibn Khaled", email: "ahmed.khaled@site-dz.stat.dz", group: "G1", status: "Available" },
    { fullName: "Sara Mahmoud Al-Ali", email: "sara.al-ali@site-dz.stat.dz", group: "G2", status: "In a team" }, { fullName: "Ahmed Ibn Khaled", email: "ahmed.khaled@site-dz.stat.dz", group: "G1", status: "Available" },
    { fullName: "Sara Mahmoud Al-Ali", email: "sara.al-ali@site-dz.stat.dz", group: "G2", status: "In a team" },

  ];

  // Sample data for Existed Teams
  const existedTeams = [
    { teamNumber: "01", teamCreator: "Ahmed Ibn Khaled", status: "Full",teamMembers : [
      {
        fullName: "Ahmed Ibn Khaled",
        email: "a.benkhaled@esi-sba.dz",
       
        role: "Front-end developer", group: "06",
      },
      {
        fullName: "Sara Mahmoud Al-Ali",
        email: "s.alali@esi-sba.dz",
      
        role: "Back-end developer", group: "06",
      },
    ], },
    { teamNumber: "02", teamCreator: "Sara Mahmoud Al-Ali", status: "Open (3/5)" ,teamMembers : [
      {
        fullName: "Ahmed Ibn Khaled",
        email: "a.benkhaled@esi-sba.dz",
       
        role: "Front-end developer", group: "06",
      },
      {
        fullName: "Sara Mahmoud Al-Ali",
        email: "s.alali@esi-sba.dz",
      
        role: "Back-end developer", group: "06",
      },
    ],},
     { teamNumber: "03", teamCreator: "Ahmed Ibn Khaled", status: "Full",teamMembers : [
      {
        fullName: "Ahmed Ibn Khaled",
        email: "a.benkhaled@esi-sba.dz",
       
        role: "Front-end developer",
      },
      {
        fullName: "Sara Mahmoud Al-Ali",
        email: "s.alali@esi-sba.dz",
      
        role: "Back-end developer", group: "06",
      },{
        fullName: "Ahmed Ibn Khaled",
        email: "a.benkhaled@esi-sba.dz",
       
        role: "Front-end developer",
      },{
        fullName: "Ahmed Ibn Khaled",
        email: "a.benkhaled@esi-sba.dz",
       
        role: "Front-end developer",
      },{
        fullName: "Ahmed Ibn Khaled",
        email: "a.benkhaled@esi-sba.dz",
       
        role: "Front-end developer",
      },{
        fullName: "Ahmed Ibn Khaled",
        email: "a.benkhaled@esi-sba.dz",
       
        role: "Front-end developer",
      },
    ], },
    { teamNumber: "04", teamCreator: "Sara Mahmoud Al-Ali", status: "Open (3/5)",teamMembers : [
      {
        fullName: "Ahmed Ibn Khaled",
        email: "a.benkhaled@esi-sba.dz",
       
        role: "Front-end developer", group: "06",
      },
      {
        fullName: "Sara Mahmoud Al-Ali",
        email: "s.alali@esi-sba.dz",
      
        role: "Back-end developer", group: "06",
      },
    ], },

  ];

  // Sample data for My Team
  const myTeamNumber = "";  //if there is no team, set it to an empty string => MY team page will change
  const myTeamMembers = [
    {
      fullName: "Ahmed Ibn Khaled",
      email: "a.benkhaled@esi-sba.dz",
      group: "06",
      role: "Front-end developer",
    },
    {
      fullName: "Sara Mahmoud Al-Ali",
      email: "s.alali@esi-sba.dz",
      group: "05",
      role: "Back-end developer",
    },
  ];

  // Pending invites for My Team
  const myTeamPendingInvites = [
    {
      fullName: "Khaled Omar Al-Saeed",
      email: "khaled.sa@esi-sba.dz",
      group: "05",
    },
    {
      fullName: "Youssef Abdelrahman Nasser",
      email: "youssef.nasser@esi-sba.dz",
      group: "03",
    }, {
      fullName: "no invites exists",
      email: "no invites exists",
      group: "xx",
    },
  ];
  // Pending invites for My Team
  const collaborationInvites = [
    {
      fullName: "Khaled Omar Al-Saeed",
      email: "khaled.sa@esi-sba.dz",
      group: "05",
    }, {
      fullName: "no invites exists",
      email: "no invites exists",
      group: "xx",
    },
  ];

  // Handle team creation toast
  const handleTeamCreated = () => {
    console.log("Invite sent callback triggered");
    setToastMessage("Team creation was successful.");
    setShowToast(true);
    setTimeout(() => {
      setShowToast(false);
    }, 3000);
  };

  // Handle invite toast when a new member is invited
  const handleInviteSent = () => {
    console.log("Team created callback triggered");
    setToastMessage("Invite sent successfully");
    setShowToast(true);
    setTimeout(() => {
      setShowToast(false);
    }, 3000);
  };

  const renderTabContent = () => {
    if (activeTab === "Students List") {
      return <StudentsListTab students={students} />;
    } else if (activeTab === "Existed Teams") {
      return <ExistedTeamsTab existedTeams={existedTeams} />;
    } else if (activeTab === "My Team") {
      return (
        <MyTeamTab
          myTeamNumber={myTeamNumber}
          myTeamMembers={myTeamMembers}
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
        <Navbar style={{ width: "100%"  }} />
        <div className="team-formation-container">
          {/* Header row with conditional Create a team button */}
          <div className="header-row">
            <h1>Team formation</h1>
            {activeTab === "Existed Teams" && (
              <button
                className="create-team-button"
                onClick={() => setShowCreateTeamModal(true)}
              >
                Create a team
              </button>
            )}
            {activeTab === "My Team" && myTeamNumber !== "" && (
              <button
                className="Leave-button"
                onClick={() => setShowCreateTeamModal(true)}
              >
                Leave the team
              </button>
            )}
          </div>

          <div className="tabs">
            {["Students List", "Existed Teams", "My Team"].map((tab) => (
              <div
                key={tab}
                className={`tab-item ${activeTab === tab ? "active" : ""}`}
                onClick={() => setActiveTab(tab)}
              >
                {tab}
              </div>
            ))}
          </div>

          {renderTabContent()}
        </div>

        {/* Render CreateTeamModal and Toast */}
        <CreateTeamModal
          show={showCreateTeamModal}
          onClose={() => setShowCreateTeamModal(false)}
          onTeamCreated={handleTeamCreated}
          onInviteSent={handleInviteSent}
        />
        {showToast && (
          <Toast
            message={toastMessage || "Test Toast"}
            onClose={() => setShowToast(false)}
          />
        )}
      </div>
    </div>
  );
}

export default TeamFormationPage;
