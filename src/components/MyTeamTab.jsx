import React from "react";
import Module from "../styles/TeamFormationPage.module.css";


const MyTeamTab = ({ myTeamNumber, myTeamMembers, myTeamPendingInvites, collaborationInvites }) => {
  // Use default invite when collaborationInvites is empty
  const invites = (collaborationInvites && collaborationInvites.length > 0)
    ? collaborationInvites
    : [{
        fullName: "no invites exists",
        email: "no invites exists",
        group: "xx",
      }];

  // If the user hasn't joined a team, show the message and the pending invites table
  if (!myTeamNumber) {
    return (
      <div>
        <div className={Module["my-team-header"]}>
          <div className={Module["header-left"]}>
            <h2>Team number</h2>
            <p>you did not join a team yet.</p>
          </div>
        </div>
        <div className={Module["pending-invites"]}>
          <div className={Module["my-team-header"]}>
            <div id="pending"><h2>Collaboration Invites</h2></div>
          </div>
          <div className={Module["table-wrapper"]}>
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
                {invites.map((invite, index) => (
                  <tr key={index}>
                    <td>{invite.fullName}</td>
                    <td>{invite.email}</td>
                    <td>{invite.group}</td>
                    <td>
                      <button className={Module["invite-button"]} style={{ margin: "0 10px" }}>Accept</button>
                      <button className={Module["invite-button"]} style={{ margin: "0 10px" }}>Decline</button>
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
      <div className={Module["my-team-header"]}>
        <div className={Module["header-left"]}>
          <h2>Team number</h2>
          <p>  You are currently in team number <span>{myTeamNumber}</span></p>
        </div>
        <div className={Module["my-team-actions"]}>
          <button className={Module["create-team-button"]} style={{ marginRight: "10px" }}>
            Set a role
          </button>
        </div>
      </div>

      <h2>Team members</h2>
      <div className={Module["table-wrapper"]}>
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

      <div className={Module["pending-invites"]}>
        <div className={Module["my-team-header"]} id="pending">
          <h2>Pending Invites</h2>
          <div className={Module["my-team-actions"]}>
            <button className={Module["create-team-button"]} style={{ marginRight: "10px" }}>
              Invite members
            </button>
          </div>
        </div>
        <div className={Module["table-wrapper"]}>
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
                    <button className={Module["invite-button"]}>Cancel invite</button>
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
