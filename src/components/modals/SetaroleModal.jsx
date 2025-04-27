import React, { useState, useEffect } from "react";
import axios from "axios";
import Style from "../../styles/TeamFormationPage.module.css";

axios.defaults.headers.common["ngrok-skip-browser-warning"] = "true";

/**
 * Props:
 *  - show: boolean
 *  - onClose: function(message: string | null)
 *  - currentRole: string
 */
const SetRoleModal = ({ show, onClose, currentRole }) => {
  const [role, setRole] = useState(currentRole || "");

  // Reset role when modal visibility or currentRole changes
  useEffect(() => {
    if (show) {
      setRole(currentRole || "");
    }
  }, [show, currentRole]);

  const handleConfirm = async () => {
    try {
    

      await axios.patch("/student/edit-role", { role }, { withCredentials: true });
      onClose(`Role successfully set to "${role}".`);
      console.log(`Role successfully set to "${role}".`);
    } catch (error) {
      console.error("Error setting role:", error);
      onClose("Failed to update role. Please try again.");
    }
  };

  const handleCancel = () => {
    onClose(null);
  };

  if (!show) {
    return null;
  }

  return (
    <div className={Style["modal-overlay"]}>
      <div className={`${Style["modal-content"]} ${Style["create-team-modal"]}`}>
        <h2>Set a role</h2>
        <p className={Style["create-team-subtitle"]}>
          Assign your role within the team to clarify responsibilities
          (e.g., Front-end Developer, Back-end Developer, UI/UX Designer...)
        </p>

        <div className={Style["form-group"]}>
          <label htmlFor="role" style={{ fontWeight: "bold" }}>Role</label>
          <select
            id="role"
            value={role}
            onChange={(e) => setRole(e.target.value)}
            className={Style["add-member-input"]}
          >
            <option value="" disabled>
              Select a role...
            </option>
            <option value="front_end">Front-end Developer</option>
            <option value="back_end">Back-end Developer</option>
            <option value="design">UI/UX Designer</option>
            <option value="member">Member</option>
          </select>
        </div>

        <div className={Style["modal-actions"]}>
          <button className={Style["cancel-button"]} onClick={handleCancel}>
            Cancel
          </button>
          <button
            className={Style["create-button"]}
            onClick={handleConfirm}
            disabled={!role || role === currentRole}
          >
            Confirm
          </button>
        </div>
      </div>
    </div>
  );
};

export default SetRoleModal;