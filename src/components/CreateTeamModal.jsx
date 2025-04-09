import React, { useState } from 'react';
import axios from 'axios';
import Style from '../styles/TeamFormationPage.module.css';
import { Group } from 'lucide-react';
axios.defaults.headers.common["ngrok-skip-browser-warning"] = "true";

const CreateTeamModal = ({ show, onClose, onTeamCreated, onInviteSent }) => {
  const [teamName, setTeamName] = useState('');  // State for the team name
  const [memberInput, setMemberInput] = useState('');
  const [members, setMembers] = useState([]);

  // Function to add a member and send an invite
  const addMember = async () => {
    if (memberInput.trim() !== '') {
      const newMember = { email: memberInput };
      setMembers([...members, newMember]);
      setMemberInput('');
      
      try {
        // Send invite to the back-end to add member
        await axios.post('/invitation/sendinvitation', { receiver_email: memberInput }, { withCredentials: true });
        if (onInviteSent) {
          onInviteSent(); // Trigger invite sent callback
        }
      } catch (error) {
        console.error("Error sending invite:", error);
      }
    }
  };

  // Function to handle the team creation and send the request to back-end
  const handleCreate = async () => {
    if (teamName.trim() === '') {
      alert("Please enter a team name.");
      return;
    }

    try {
      // Create the team on the back-end
      const response = await axios.post('/teams/creategroup', { groupName: teamName });
      
      if (response.data.success) {
        // Trigger team created callback
        if (onTeamCreated) {
          onTeamCreated({ teamName });
        }
        onClose(); // Close the modal after creation
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
        <h2>Create a team</h2>
        <p className={Style["create-team-subtitle"]}>
          Create your own team and kickstart your journey! You can start solo and invite
          members later, or send invitations right away to build your dream team.
        </p>

        {/* Input for team name */}
        <div className={Style["add-member-row"]}>
          <input
            type="text"
            placeholder="Enter team name"
            className={Style["add-member-input"]}
            value={teamName}
            onChange={(e) => setTeamName(e.target.value)}
          />
        </div>

        {/* Input for adding members */}
        <div className={Style["add-member-row"]}>
          <input
            type="text"
            placeholder="Add members by name or email"
            className={Style["add-member-input"]}
            value={memberInput}
            onChange={(e) => setMemberInput(e.target.value)}
          />
          <button className={Style["invite-button"]} onClick={addMember}>
            Invite
          </button>
        </div>

        {/* Members list */}
        <div className={Style["members-list"]}>
          <h3>Members</h3>
          {members.map((member, index) => (
            <div key={index} className={Style["member-row"]}>
              <span className={Style["member-email"]}>{member.email}</span>
              <span className={Style["member-name"]}>{member.name}</span>
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
