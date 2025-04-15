import React, { useState } from 'react';
import axios from 'axios';
import Style from '../../styles/TeamFormationPage.module.css';

axios.defaults.headers.common["ngrok-skip-browser-warning"] = "true";

const CreateTeamModal = ({ show, onClose, onTeamCreated, onInviteSent, user }) => {
 
  const [memberInput, setMemberInput] = useState('');
  const [members, setMembers] = useState([]);
  const [showAlert, setShowAlert] = useState(false);
  const [showToast, setShowToast] = useState(false);

  
  const handleInviteClick = async (receiver_email) => {
    if (user.team_id === null) {
      setShowAlert(true);
      return;
    }

    try {
      const response = await axios.post(
        "/invitation/sendinvitation",
        { receiver_email },
        { withCredentials: true }
      );

      if (response.data.success) {
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

  
  const handleCreate = async () => {
    try {
      
      const response = await axios.post('/teams/creategroup', {
        groupName: " Team 1", 
      }, { withCredentials: true });
      
      if (response.data.success) {
        
        for (let member of members) {
          await handleInviteClick(member.email);
        }
        if (onTeamCreated) {
          onTeamCreated();
        }
        onClose();
      } else {
        alert("Error creating the team. Please try again.");
      }
    } catch (error) {
      console.error("Error creating team:", error);
      alert("Error creating the team. Please try again.");
    }
  };

  if (!show) return null;

  return (
    <div className={Style["modal-overlay"]}>
      <div className={`${Style["modal-content"]} ${Style["create-team-modal"]}`}>
        <h2>Create Team </h2>
        <p className={Style["create-team-subtitle"]}>
         Create your own team and kickstart your journey! You can start solo and invite members later, or send invitations right away to build your dream team.
        </p>

       
        {/* Input for adding members */}
        <div className={Style["add-member-row"]}>
          <input
            type="text"
            placeholder="Add member by name or email"
            className={Style["add-member-input"]}
            value={memberInput}
            onChange={(e) => setMemberInput(e.target.value)}
          />
          <button className={Style["invite-button"]} onClick={addMember}>
            Add
          </button>
        </div>

        {/* Members list */}
        <div className={Style["members-list"]}>
          <h3>Members</h3>
          {members.map((member, index) => (
            <div key={index} className={Style["member-row"]}>
              <span className={Style["member-email"]}>{member.email}</span>
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

        {/* Conditional Alerts */}
        {showAlert && (
          <div className={Style["alert"]}>
            You must join a team before inviting others.
          </div>
        )}
        {showToast && (
          <div className={Style["toast"]}>
            Invitation sent successfully!
          </div>
        )}

        {/* Action buttons */}
        <div className={Style["modal-actions"]}>
          <button className={Style["cancel-button"]} onClick={onClose}>
            Cancel
          </button>
          <button className={Style["create-button"]} onClick={handleCreate}>
            Create
          </button>
        </div>
      </div>
    </div>
  );
};

export default CreateTeamModal;
