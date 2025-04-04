import React, { useState } from 'react';
import Style from '../styles/TeamFormationPage.module.css';
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
    <div className={Style["modal-overlay"]}>
      <div className={`${Style["modal-content"]} ${Style["create-team-modal"]}`}
      >
        <h2>Create a team</h2>
        <p className={Style["create-team-subtitle"]}>
          Create your own team and kickstart your journey! You can start solo and invite
          members later, or send invitations right away to build your dream team.
        </p>

        {/* Input row for adding members */}
        <div className={Style["add-member-row"]}>
          <input
            type="text"
            placeholder="add members by name or email"
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
