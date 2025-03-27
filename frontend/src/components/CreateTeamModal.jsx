import React, { useState } from 'react';
import '../styles/TeamFormationPage.css';
const CreateTeamModal = ({ show, onClose, onTeamCreated, onInviteSent }) => {
  const [memberInput, setMemberInput] = useState('');
  const [members, setMembers] = useState([]);

  // When the Invite button is clicked, add a member and trigger the invite toast
  const addMember = () => {
    if (memberInput.trim() !== '') {
      const newMember = { email: memberInput, name: memberInput };
      setMembers([...members, newMember]);
      setMemberInput('');
      if (onInviteSent) {
        onInviteSent();
      }
    }
  };

  // When "Create" is clicked, perform creation logic and trigger the team created callback
  const handleCreate = () => {
    // Your team creation logic goes here.
    if (onTeamCreated) {
      onTeamCreated();
    }
    onClose();
  };

  if (!show) return null;

  return (
    <div className="modal-overlay">
      <div className="modal-content create-team-modal">
        <h2>Create a team</h2>
        <p className="create-team-subtitle">
          Create your own team and kickstart your journey! You can start solo and invite 
          members later, or send invitations right away to build your dream team.
        </p>

        {/* Input row for adding members */}
        <div className="add-member-row">
          <input
            type="text"
            placeholder="add members by name or email"
            className="add-member-input"
            value={memberInput}
            onChange={(e) => setMemberInput(e.target.value)}
          />
          <button className="invite-button" onClick={addMember}>
            Invite
          </button>
        </div>

        {/* Members list */}
        <div className="members-list">
          <h3>Members</h3>
          {members.map((member, index) => (
            <div key={index} className="member-row">
              <span className="member-email">{member.email}</span>
              <span className="member-name">{member.name}</span>
              <button
                className="remove-member-btn"
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
        <div className="modal-actions">
          <button className="cancel-button" onClick={onClose}>
            Cancel
          </button>
          <button className="create-button" onClick={handleCreate}>
            Create
          </button>
        </div>
      </div>
    </div>
  );
};

export default CreateTeamModal;
