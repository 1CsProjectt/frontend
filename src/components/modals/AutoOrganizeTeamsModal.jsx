import React, { useState ,useEffect } from 'react';
import axios from 'axios';
import Style from '../../styles/TeamFormationPage.module.css';
import Toast from './Toast';

axios.defaults.headers.common["ngrok-skip-browser-warning"] = "true";

const AutoOrganizeTeamsModal = ({ show, onClose }) => {
  const [year, setYear] = useState("");
  const [specialite, setSpecialite] = useState("");
  const [loading, setLoading] = useState(false); // For loading state
  const [error, setError] = useState(""); // For error handling

  useEffect(() => {
    if (show) {
      setError("");     // Clear previous error
      setYear("");      // Optional: reset form
      setSpecialite(""); // Optional: reset form
    }
  }, [show]);
  

  const handleConfirm = async () => {
    setLoading(true); // Start loading state
    setError(""); // Reset error state
    try {
      const response = await axios.post('/teams/autoOrganizeTeams', {
        year,
        specialite
      }, {
        withCredentials: true
      });

      console.log(response.data);
      onClose(); // Close the modal on success
    } catch (error) {
      console.error(error.response?.data?.message || "An error occurred");
      setError("An error occurred while organizing teams. Please try again."); // Set error message
    } finally {
      setLoading(false); // End loading state
    }
  };

  if (!show) return null;

  

  return (
    <div className={Style["modal-overlay"]}>
      <div className={`${Style["modal-content"]} ${Style["create-team-modal"]}`}>
        <h2>Auto Organize Teams</h2>
        <p className={Style["create-team-subtitle"]}>
          Automatically organize and assign teams to students without ones
        </p>

        <div className={Style["admin-container"]}>
          <label htmlFor="year">Student Year</label>
          <select
            id="year"
            className={Style["admin-select"]}
            value={year}
            onChange={(e) => setYear(e.target.value)}
          >
            <option value="">Select a grade</option>
            <option value="2CP">2CP</option>
            <option value="1CS">1CS</option>
            <option value="2CS">2CS</option>
            <option value="3CS">3CS</option>
          </select>
        </div>

        {(year === "2CS" || year === "3CS") && (
          <div className={Style["admin-container"]}>
            <label htmlFor="specialite">Student Speciality</label>
            <select
              id="specialite"
              className={Style["admin-select"]}
              value={specialite}
              onChange={(e) => setSpecialite(e.target.value)}
            >
              <option value="">Select a speciality</option>
              <option value="ISI">ISI</option>
              <option value="SIW">SIW</option>
              <option value="IASD">IASD</option>
            </select>
          </div>
        )}

        {/* Error Message */}
        {error && <div className={Style["error-message"]}>{error}</div>}

        {/* Action buttons */}
        <div className={Style["modal-actions"]}>
          <button className={Style["cancel-button"]} onClick={onClose}>
            Cancel
          </button>
          <button
            className={`${Style["create-button"]} ${loading ? Style["loading"] : ""}`}
            onClick={handleConfirm}
            disabled={loading} // Disable button while loading
          >
            {loading ? "Processing..." : "Confirm"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default AutoOrganizeTeamsModal;
