import React, { useState } from "react";
import axios from "axios";
import Style from "../../styles/TeamFormationPage.module.css";

axios.defaults.headers.common["ngrok-skip-browser-warning"] = "true";

const SetRoleModal = ({ show, onClose }) => {
  // State for the role input
  const [role, setRole] = useState("");

  // If the modal should not be shown, return null
  if (!show) return null;

  // Confirm handler (ASYNC if you plan to do an API call)
  const handleConfirm = async () => {
    try {
      
     await axios.patch("/teams/setrole", { role }, { withCredentials: true });
      
      console.log("Role set to:", role);
      onClose(); 
    } catch (error) {
      onClose();
      console.error("Error setting role:", error);
    }
  };

  return (
    <div className={Style["modal-overlay"]}>
      <div className={`${Style["modal-content"]} ${Style["create-team-modal"]}`}>
        {/* Title */}
        <h2>Set a role</h2>

        {/* Subtitle / instructions */}
        <p className={Style["create-team-subtitle"]}>
          Assign your role within the team to clarify responsibilities 
          (e.g., Front-end Developer, Backend Developer, UI/UX Designer...)
        </p>

        {/* Role Input Field */}
        <div className={Style["form-group"]}>
          <label htmlFor="role" style={{ fontWeight: "bold" }}>Role</label>
          <input 
            id="role"
            type="text"
            placeholder="Give a name for your role..."
            className={Style["add-member-input"] }
            value={role}
            onChange={(e) => setRole(e.target.value)}
          />
        </div>

        {/* Action Buttons */}
        <div className={Style["modal-actions"]}>
          <button className={Style["cancel-button"]} onClick={onClose}>
            Cancel
          </button>
          <button className={Style["create-button"]} onClick={handleConfirm}>
            Confirm
          </button>
        </div>
      </div>
    </div>
  );
};

export default SetRoleModal;
