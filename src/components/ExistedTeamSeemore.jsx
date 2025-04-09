import React, { useState } from "react";
import Module from "../styles/TeamFormationPage.module.css";
import axios from "axios";
import JoinTeamAlert from "./JoinTeamAlert";
import Toast from "./Toast";

const Seemorepage = ({ myTeamNumber, myTeamMembers = [] }) => {
  const [toastMessage, setToastMessage] = useState("");
  const [showToast, setShowToast] = useState(false);
  const [showJoinAlert, setShowJoinAlert] = useState(false);

  const handleJoinClick = () => {
    setShowJoinAlert(true);
  };

  const handleCancel = () => {
    setShowJoinAlert(false);
  };

  const handleConfirm = () => {
    setShowJoinAlert(false);
    // Handle join logic here (for example, an API call)
    console.log("Join confirmed!");
    setToastMessage("Team joining was successful.");
    setShowToast(true);
    setTimeout(() => {
      setShowToast(false);
    }, 3000);
  };

 

  // If team members are not provided via props, fall back to static data.
  const staticTeamMembers = [
    { fullName: "Alice Johnson", email: "alice@example.com", group: "Group A", role: "Leader" },
    { fullName: "Bob Smith", email: "bob@example.com", group: "Group A", role: "Member" },
    { fullName: "Carol Lee", email: "carol@example.com", group: "Group A", role: "Member" }
  ];

  // Use passed team members if available; otherwise, static data.
  const membersToDisplay = myTeamMembers.length > 0 ? myTeamMembers : staticTeamMembers;

  return (
    <div>
      <div className={Module["my-team-header"]}>
        <div className={Module["header-left"]}>
          <h2>Team Number</h2>
          <p>
            team number <span>{myTeamNumber}</span>
          </p>
        </div>
      </div>

      <h2>Team Members</h2>
      <div className={Module["table-wrapper"]}>
        <table>
          <thead>
            <tr>
              <th>Full Name</th>
              <th>Email Address</th>
             
              <th>Role</th>
            </tr>
          </thead>
          <tbody>
            {membersToDisplay.map((member, index) => (
              <tr key={index}>
                <td>{member.fullName}</td>
                <td>{member.email}</td>
              
                <td>{member.role}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div className={Module["buttons-container-see-more"]}>
        <button className={Module["BackSeeMoreBtn"]} onClick={() => window.history.back()}>
          Back
        </button>
        <button className={Module["JoinSeeMoreBtn"]} onClick={handleJoinClick}>
          Join
        </button>
      </div>
      <JoinTeamAlert show={showJoinAlert} onCancel={handleCancel} onConfirm={handleConfirm} />
      {showToast && <Toast message={toastMessage || "Test Toast"} onClose={() => setShowToast(false)} />}
    </div>
  );
};

export default Seemorepage;