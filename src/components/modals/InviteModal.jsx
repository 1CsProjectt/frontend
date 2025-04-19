import React, { useState } from 'react';
import axios from 'axios';
import Style from '../../styles/TeamFormationPage.module.css';
import Toast from './Toast';

axios.defaults.headers.common["ngrok-skip-browser-warning"] = "true";

const InviteModal = ({ show, onClose, onTeamCreated, onInviteSent, user }) => {
  const [memberInput, setMemberInput] = useState('');
  const [members, setMembers] = useState([]);
  const [showAlert, setShowAlert] = useState(false);
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState("");

  const handleInviteClick = async (receiver_email) => {
    if (user.team_id === null) {
      setShowAlert(true);
      return;
    }

    try {
      const response = await axios.post(
        "/invitation/sendinvitation",
        {  receiver_emails: [receiver_email]  },
        { withCredentials: true }
      );

      if (response.data.success) {
        setToastMessage("Invitation sent successfully!");
        setShowToast(true);
        setTimeout(() => setShowToast(false), 3000);
      }
    } catch (error) {
      console.error("Error sending invite:", error);
    }
  };

  const addMember = () => {
    if (memberInput.trim() !== '') {
      const newMember = { email: memberInput };
      setMembers([...members, newMember]);
      setMemberInput('');
    }
  };

  if (!show) return null;

  return (
    <div className={Style["modal-overlay"]}>
      <div className={`${Style["modal-content"]} ${Style["create-team-modal"]}`}>
        <h2>Adding members</h2>
        <p className={Style["create-team-subtitle"]}>
          Add new members to any team, assign roles, and build a strong, collaborative workspace.
        </p>

        {/* Input for adding members */}
        <div className={Style["add-member-row"]}>
          <input
            type="text"
            placeholder="add members by name or email"
            className={Style["add-member-input"]}
            value={memberInput}
            onChange={(e) => setMemberInput(e.target.value)}
          />
          <button className={Style["invite-button"]} onClick={addMember}>
            +
          </button>
        </div>

        {/* Members list */}
        <div className={Style["members-list"]}>
          {members.map((member, index) => (
            <div key={index} className={Style["member-row"]}>
              <div>
                <div className={Style["member-email"]}>{member.email}</div>
                <div className={Style["member-name"]}>{member.name || "Name not set"}</div>
              </div>
              <button
                className={Style["remove-member-btn"]}
                onClick={() => {
                  const updatedMembers = members.filter((_, i) => i !== index);
                  setMembers(updatedMembers);
                }}
              >
                –
              </button>
            </div>
          ))}
        </div>

        {/* Buttons */}
        <div className={Style["modal-actions"]}>
          <button className={Style["cancel-button"]} onClick={onClose}>
            Cancel
          </button>
          <button className={Style["create-button"]}   onClick={() => {
    const emailList = members.map(member => member.email);
    handleInviteClick(emailList); 
  }}>
            Add
          </button>
        </div>

        {/* Toast */}
        {showToast && (
          <Toast message={toastMessage || "Test Toast"} onClose={() => setShowToast(false)} />
        )}
      </div>
    </div>
  );
};

export default InviteModal;
