import React, { useState, useEffect } from "react";
import axios from "axios";
import Sidebar from "../components/Sidebar";
import Navbar from "../components/NavBar";
import StudentsListTab from "../components/StudentsListTab";
import ExistedTeamsTab from "../components/ExistedTeamsTab";
import MyTeamTab from "../components/MyTeamTab";
import CreateTeamModal from "../components/CreateTeamModal";
import Toast from "../components/Toast";
import JoinTeamModal from "../components/JoinTeamAlert";

import Style from "../styles/TeamFormationPage.module.css";

function TeamFormationPage() {
  const [activeTab, setActiveTab] = useState("Students List");
  const [showCreateTeamModal, setShowCreateTeamModal] = useState(false);
  const [toastMessage, setToastMessage] = useState("");
  const [showToast, setShowToast] = useState(false);
  // State to handle search query input
  const [searchQuery, setSearchQuery] = useState("");

  // Sample data for Students List
  const students = [
    { fullName: "Ahmed Ibn Khaled", email: "ahmed.khaled@site-dz.stat.dz", group: "G1", status: "Available" },
    { fullName: "Sara Mahmoud Al-Ali", email: "sara.al-ali@site-dz.stat.dz", group: "G2", status: "In a team" },
    { fullName: "Ali Mansour", email: "ali.mansour@site-dz.stat.dz", group: "G1", status: "Available" },
    { fullName: "Lina Bensalem", email: "lina.bensalem@site-dz.stat.dz", group: "G2", status: "In a team" },
    // ... add more students if needed
  ];

  // Dynamically generate suggestions from the students list (both fullName and email)
  const suggestions = Array.from(
    new Set(students.flatMap(student => [student.fullName, student.email]))
  );

  // Function to handle changes in the search input
  const handleSearchChange = (query) => {
    setSearchQuery(query);
    console.log("Search query:", query);
    // Add logic here to filter data or trigger API calls if needed
  };

  const targetDate = new Date("2025-04-29T23:59:59");

  /* for dynamic */
  /* // States for dynamic data fetched when the corresponding tab is clicked
  const [students, setStudents] = useState([]);
  const [existedTeams, setExistedTeams] = useState([]);
  const [myTeam, setMyTeam] = useState(null); // null if no team exists
  const [myTeamPendingInvites, setMyTeamPendingInvites] = useState([]);
  const [collaborationInvites, setCollaborationInvites] = useState([]);
  
  // Loading and error states for API calls
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // useEffect that fetches data whenever activeTab changes.
  useEffect(() => {
    // Define an asynchronous function to fetch data for the active tab.
    const fetchData = async () => {
      setLoading(true);
      setError("");
      try {
        if (activeTab === "Students List") {
          // Fetch students list data
          const { data } = await axios.get("/api/students");
          setStudents(data);
        } else if (activeTab === "Existed Teams") {
          // Fetch existed teams data
          const { data } = await axios.get("/api/teams");
          setExistedTeams(data);
        } else if (activeTab === "My Team") {
          // Fetch my team details, pending invites, and collaboration invites
          const { data: teamData } = await axios.get("/api/myTeam");
          setMyTeam(teamData);
          const { data: pendingInvites } = await axios.get("/api/myTeam/pendingInvites");
          setMyTeamPendingInvites(pendingInvites);
          const { data: collabInvites } = await axios.get("/api/myTeam/collaborationInvites");
          setCollaborationInvites(collabInvites);
        }
        setLoading(false);
      } catch (err) {
        setError(err.response ? err.response.data.message : err.message);
        setLoading(false);
      }
    };

    // Call the fetch function only when a tab is activated
    fetchData();
  }, [activeTab]); */
  
  // Sample data for Existed Teams
  const existedTeams = [
    {
      teamNumber: "01", teamCreator: "Ahmed Ibn Khaled", status: "Full", teamMembers: [
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
      ],
    },
    {
      teamNumber: "02", teamCreator: "Sara Mahmoud Al-Ali", status: "Open (3/5)", teamMembers: [
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
      ],
    },
    // ... add more teams if needed
  ];

  // Sample data for My Team
  const myTeamNumber = "3";  //if there is no team, set it to an empty string => MY team page will change
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
    },
    {
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
    },
    {
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
        /* for dynamic */
        /*    {<MyTeamTab
             myTeamNumber={myTeam ? myTeam.teamNumber : ""}
             myTeamMembers={myTeam ? myTeam.teamMembers : []}
             myTeamPendingInvites={myTeamPendingInvites}
             collaborationInvites={collaborationInvites}
           />} */
      );
    }
  };
  /* for dynamic */
  /*  if (loading) return <div>Loading...</div>;
      if (error) return <div>Error: {error}</div>; */
  return (
    <div>
      <Sidebar />
      <div style={{ marginLeft: "16vw" }}>
        {/* Pass the search-related props to the NavBar */}
        <Navbar
          title={"Group formation session:"}
          targetDate={targetDate}
          onSearchChange={handleSearchChange}
          suggestions={suggestions}
        />
        <div className={Style["team-formation-container"]}>
          {/* Header row with conditional Create a team button */}
          <div className={Style["header-row"]}>
            <h1>Team formation</h1>
            {activeTab === "Existed Teams" && (
              <button
                className={Style["create-team-button"]}
                onClick={() => setShowCreateTeamModal(true)}
              >
                Create a team
              </button>
            )}
            {/* for dynamic */}
            {/* {activeTab === "My Team" && myTeam && myTeam.teamNumber && (
              <button
                className={Style["Leave-button"]}
                onClick={() => setShowCreateTeamModal(true)}
              >
                Leave the team
              </button>
            )} */}
            {activeTab === "My Team" && myTeamNumber !== "" && (
              <button
                className={Style["Leave-button"]}
                onClick={() => setShowCreateTeamModal(true)}
              >
                Leave the team
              </button>
            )}
          </div>
          
          <div className={Style["tabs"]}>
            {["Students List", "Existed Teams", "My Team"].map((tab) => (
              <div
                key={tab}
                className={`${Style["tab-item"]} ${activeTab === tab ? Style.active : ""}`}
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
