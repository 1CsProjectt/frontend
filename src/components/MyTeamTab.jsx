import React, { useState } from "react";
import Module from "../styles/TeamFormationPage.module.css";
import axios from "axios";
import SetRoleModal from './modals/SetaroleModal';
import Toast from "../components/modals/Toast";
import { useNavigate } from "react-router-dom";

axios.defaults.withCredentials = true;
axios.defaults.headers.common['ngrok-skip-browser-warning'] = 'true';
const MyTeamTab = ({ myTeamNumber, myTeamMembers, myTeamPendingInvites, collaborationInvites, reqInvites }) => {
  const navigate = useNavigate();
  const [showSetRoleModal, setShowSetRoleModal] = useState(false);
  const [toastMessage, setToastMessage] = useState("");
  const [showToast, setShowToast] = useState(false);
  
  const invites = (collaborationInvites && collaborationInvites.length > 0)
    ? collaborationInvites
    : [{
      sender: { firstname: "No", lastname: "Invite" },
      email: "no invites exists",
      team_id: "xx",
    }];

  const handleAcceptInvite = async (inviteId) => {

    try {
      const response = await axios.patch('/invitation/acceptInvitation', { invitationId: inviteId }
      );
      console.log(response.data);

    } catch (error) {
      console.error("Error:", error);
    }
  };
  const handleAcceptReq = async (reqId) => {

    try {
      const response = await axios.post('/jointeam/accepteJoinRequests', { requestId: reqId }
      );
      console.log(response.data);

    } catch (error) {
      console.error("Error:", error);
    }
  };

  const handleDeclineReq = async (reqId) => {
    try { const response = await axios.post('/jointeam/rejectJoinRequests', { requestId: reqId });
    console.log(`Declined req with ID: ${reqId}`);
    console.log(response.data);
  } catch (error) {
    console.error("Error:", error);
  }

  }
  const handleDeclineInvite = (inviteId) => {
    console.log(`Declined invite with ID: ${inviteId}`);
    axios.patch('/invitation/declineInvitation', { inviteId });
  };

  const handleCancelInvite = (inviteId) => {
    axios.patch('/invitation/CancelInvitation', { inviteId });
    console.log(`Cancelled invite with ID: ${inviteId}`);
  };

  if (!myTeamNumber) {
    return (
      <div className={Module["my-team-container"]}>
        <div className={Module["my-team-header"]}>
          <div className={Module["header-left"]}>
            <h2>Team number</h2>
            <p>You have not joined a team yet.</p>
          </div>
        </div>
        <div className={Module["pending-invites"]}>
          <div className={Module["my-team-header"]}>
            <div id="pending">
              <h2>Collaboration Invites</h2>
            </div>
          </div>
          <div className={Module["table-wrapper"]}>
            <table>
              <thead>
                <tr>
                  <th>Full Name</th>
                  <th>Email-address</th>
                  <th>Team number</th>
                  <th></th>
                </tr>
              </thead>
              <tbody>
                {invites.map((invite, index) => (
                  <tr key={index}>
                    <td>{invite.sender.firstname} {invite.sender.lastname}</td>
                    <td>{invite.sender.user?.email || invite.email || "N/A"}</td>
                    <td>{invite.sender.team_id}</td>
                    <td>
                      <button
                        className={Module["invite-button"]}
                        style={{ margin: "0 10px" }}
                        onClick={() => handleAcceptInvite(invite.id)}
                      >
                        Accept
                      </button>
                      <button
                        className={Module["invite-button"]}
                        style={{ margin: "0 10px" }}
                        onClick={() => handleDeclineInvite(invite.id)}
                      >
                        Decline
                      </button>
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

  return (
    <div className={Module["my-team-container"]}>
      <div className={Module["my-team-header"]}>
        <div className={Module["header-left"]}>
          <h2>Team number</h2>
          <p>You are currently in team number <span>{myTeamNumber}</span></p>
        </div>
        <div className={Module["my-team-actions"]}>
          <button
            className={Module["create-team-button"]}
            style={{ marginRight: "10px" }}
            onClick={() => setShowSetRoleModal(true)}
          >
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
              <th>Role</th>
            </tr>
          </thead>
          <tbody>
            {myTeamMembers.map((member, index) => (
              <tr key={index}>
                <td>{member.firstname && member.lastname ? `${member.firstname} ${member.lastname}` : "N/A"}</td>
                <td>{member.user?.email || "N/A"}</td>
                <td>{member.role || "Member"}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className={Module["pending-invites"]}>
        <div className={Module["my-team-header"]} id="pending">
          <h2>Pending Invites</h2>
          <div className={Module["my-team-actions"]}>
          <button
      className={Module["create-team-button"]}
      style={{ marginRight: "10px" }}
      onClick={() => navigate("/TeamFormationPage")}

    >
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
                <th></th>
              </tr>
            </thead>
            <tbody>
              {myTeamPendingInvites.map((invite, index) => (
                <tr key={index}>
                  <td>{`${invite.sender.firstname} ${invite.sender.lastname}`}</td>
                  <td>{invite.receiver_email}</td>
                  <td>
                    <button
                      className={Module["invite-button"]}
                      onClick={() => handleCancelInvite(invite.sender.team_id)}//to change later when the backend is ready
                    >
                      Cancel invite
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

      </div>

      <div className={Module["pending-invites"]}>
        <div className={Module["my-team-header"]} id="pending">
          <h2>Join Request</h2>

        </div>
        <div className={Module["table-wrapper"]}>
          <table>
            <thead>
              <tr>
                <th>Full Name</th>
                <th>Email</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {reqInvites?.map((req, index) => (
                <tr key={index}>
                  <td>{`${req.student.firstname} ${req.student.lastname}`}</td>
                  <td>{req.student.user.email}</td>
                  <td>
                      <button
                        className={Module["invite-button"]}
                        style={{ margin: "0 10px" }}
                        onClick={() => handleAcceptReq(req.id)}
                      >
                        Accept
                      </button>
                      <button
                        className={Module["invite-button"]}
                        style={{ margin: "0 10px" }}
                        onClick={() => handleDeclineReq(req.id)}
                      >
                        Decline
                      </button>
                    </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>


      </div>
      {/* Render the SetRoleModal, passing the state and onClose function */}
      <SetRoleModal
        show={showSetRoleModal}
        onClose={() => setShowSetRoleModal(false)}
        Roleseted={() => setToastMessage("Team created successfully.")}
      />
      {showToast && <Toast message={toastMessage} onClose={() => setShowToast(false)} />}
    </div>

  );
};

export default MyTeamTab;
