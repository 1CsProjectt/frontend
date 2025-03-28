import React, { useState } from "react";
import classes from "../../styles/StartNewSessionModal.module.css";

const StartNewSessionModal = ({ isOpen, onClose }) => {
  

  // State for form fields
  const [grade, setGrade] = useState("1CS");
  const [maxMembers, setMaxMembers] = useState(5);
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");


  if (!isOpen) return null;

  return (
    <div className={classes["modal-overlay"]}>
      <div className={classes["modal-content"]}>
        <h2>Start new session</h2>
        <p className={classes["modal-description"]}>
          Customize new sessions with full control over settings. Tailor each
          session to meet your needs and ensure a seamless experience.
        </p>

        {/* Grade Dropdown */}
        <div className={classes["form-group"]}>
          <label>Grade</label>
          <select value={grade} onChange={(e) => setGrade(e.target.value)}>
            <option>2CPI</option>
            <option>1CS</option>
            <option>2CS</option>
            <option>3CS</option>
          </select>
        </div>

        {/* Max Members Input */}
        <div className={classes["form-group"]}>
          <label>Max members</label>
          <input
            type="number"
            placeholder="Enter max members"
            value={maxMembers}
            onChange={(e) => setMaxMembers(e.target.value)}
          />
        </div>

        {/* Date Inputs */}
        <div className={classes["date-container"]}>
          <div className={classes["date-group"]}>
            <label>Start date</label>
            <input
              type="date"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
            />
          </div>

          <div className={classes["date-group"]}>
            <label>End date</label>
            <input
              type="date"
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
            />
          </div>
        </div>

        {/* Buttons */}
        <div className={classes["button-container"]}>
          <button className={classes["cancel-btn"]} onClick={onClose}>
            Cancel
          </button>
          <button
            className={classes["create-btn"]}
            onClick={() => console.log({ grade, maxMembers, startDate, endDate })}
          >
            Create
          </button>
        </div>
      </div>
    </div>
  );
};

export default StartNewSessionModal;
