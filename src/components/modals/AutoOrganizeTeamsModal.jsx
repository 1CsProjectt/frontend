import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Style from '../../styles/AdminManagePreferencesPage.module.css';
import PFESummaryModal from "./PFESummaryModal";

axios.defaults.headers.common["ngrok-skip-browser-warning"] = "true";

const AutoOrganizeTeamsModal = ({ show, onClose, operation }) => {
  const [year, setYear] = useState("");
  const [specialite, setSpecialite] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [summaryModalOpen, setSummaryModalOpen] = useState(false);
  const [summaryData, setSummaryData] = useState(null);

  useEffect(() => {
    if (show) {
      setError("");
      setYear("");
      setSpecialite("");
      setSummaryData(null);
    }
  }, [show]);

  const handleConfirm = async () => {
    setLoading(true);
    setError("");

    try {
      let response;

      if (operation.toLowerCase() === "organize") {
        response = await axios.post('/teams/autoOrganizeTeams', { year, specialite }, { withCredentials: true });
      } else if (operation.toLowerCase() === "assign") {
        response = await axios.post('/pfe/autoAssignPfesToTeamsWithoutPfe', { year, specialite }, { withCredentials: true });
      }

      setSummaryData(response.data);
      setSummaryModalOpen(true);
    } catch (err) {
      console.error(err.response?.data?.message || "An error occurred");
      setError("An error occurred. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  if (!show) return null;

  return (
    <div className={Style["modal-overlay"]}>
      <div className={`${Style["modal-content"]} ${Style["create-team-modal"]}`}>
        <div>
          <h2>{operation === "organize" ? "Auto Organize Teams" : "Auto Assign Projects"}</h2>
          <p className={Style["create-team-subtitle"]}>
            {operation === "organize"
              ? "Automatically organize and assign teams to students without ones"
              : "Automatically assign projects to Teams without ones"}
          </p>
        </div>

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

        {error && <div className={Style["error-message"]}>{error}</div>}

        <div className={Style["modal-actions"]}>
          <button className={Style["cancel-button"]} onClick={onClose}>
            Cancel
          </button>
          <button
            className={`${Style["create-button"]} ${loading ? Style["loading"] : ""}`}
            onClick={handleConfirm}
            disabled={loading}
          >
            {loading ? "Processing..." : "Confirm"}
          </button>
        </div>
      </div>

      {/* Unified modal for both "assign" and "organize" */}
      <PFESummaryModal
        isOpen={summaryModalOpen}
        onClose={() => {
          setSummaryModalOpen(false);
          onClose(); // Close parent modal after summary
        }}
        PFEdata={operation === "assign" ? summaryData : null}
        teamData={operation === "organize" ? summaryData : null}
        operation={operation}
      />
    </div>
  );
};

export default AutoOrganizeTeamsModal;
