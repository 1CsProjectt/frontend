import React from "react";
import "../styles/TeamFormationPage.css";

const MyTeamTab = ({ myTeamNumber, myTeamMembers, myTeamPendingInvites,collaborationInvites }) => {
  // If the user hasn't joined a team, show the message and the pending invites table
  if (!myTeamNumber) {
    return (
      <div>
        <div className="my-team-header">
          <div className="header-left">
            <h2>Team number</h2>
            <p>you did not join a team yet.</p>
          </div>
        </div>
        <div className="pending-invites">
          <div className="my-team-header">
            <div id="pending"><h2>Collaboration Invites</h2></div>
           
          </div>
          <div className="table-wrapper">
            <table>
              <thead>
                <tr>
                  <th>Full Name</th>
                  <th>Email-address</th>
                  <th>Group</th>
                  <th></th>
                </tr>
              </thead>
              <tbody>
                {collaborationInvites.map((invite, index) => (
                  <tr key={index}>
                    <td>{invite.fullName}</td>
                    <td>{invite.email}</td>
                    <td>{invite.group}</td>
                    <td>
                      <button className="invite-button" id="Collaboration-Invites-button">Accept</button>
                      
                      <button className="invite-button" id="Collaboration-Invites-button">Decline</button>

                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    );
  }

  // If the user has joined a team, render full team details
  return (
    <div>
      <div className="my-team-header">
        <div className="header-left">
          <h2>Team number</h2>
          <p>  You are currently in team number <span>{myTeamNumber}</span></p>
        </div>
        <div className="my-team-actions">
          <button className="create-team-button" style={{ marginRight: "10px" }}>
            Set a role
          </button>
        </div>
      </div>

      <h2>Team members</h2>
      <div className="table-wrapper">
        <table>
          <thead>
            <tr>
              <th>Full Name</th>
              <th>Email-address</th>
              <th>Group</th>
              <th>Role</th>
            </tr>
          </thead>
          <tbody>
            {myTeamMembers.map((member, index) => (
              <tr key={index}>
                <td>{member.fullName}</td>
                <td>{member.email}</td>
                <td>{member.group}</td>
                <td>{member.role}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="pending-invites">
        <div className="my-team-header" id="pending">
          <h2>Pending Invites</h2>
          <div className="my-team-actions">
            <button className="create-team-button" style={{ marginRight: "10px" }}>
              Invite members
            </button>
          </div>
        </div>
        <div className="table-wrapper">
          <table>
            <thead>
              <tr>
                <th>Full Name</th>
                <th>Email-address</th>
                <th>Group</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {myTeamPendingInvites.map((invite, index) => (
                <tr key={index}>
                  <td>{invite.fullName}</td>
                  <td>{invite.email}</td>
                  <td>{invite.group}</td>
                  <td>
                    <button className="invite-button">Cancel invite</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default MyTeamTab;
