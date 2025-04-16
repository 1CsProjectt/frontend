import React, { useState } from "react";
import classes from "../../styles/StartNewSessionModal.module.css";
import axios from "axios";
const StartNewSessionModal = ({ isOpen, onClose ,sessionsPageActiveTab}) => {
  

  // State for form fields
  const [grade, setGrade] = useState("1CS");
  const [maxMembers, setMaxMembers] = useState(5);
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");


  if (!isOpen) return null;

//later add the check for the session name (type) based on the current tab
  const handleCreateTopicSubmissionSession = async () => {
    const payload = {
      name: "PFE_SUBMISSION", // fixed to topic submission session
      startTime: startDate,
      endTime: endDate,
      year: grade,
    };

    try {
      const res = await axios.post("/session/setsessoin", payload, {
        headers: {
          "Content-Type": "application/json",
        },
        withCredentials: true, // include credentials if required
      });

      alert(" Submission session created: " + res.data.message);
      onClose();
    } catch (err) {
      const msg = err.response?.data?.message || err.message;
      console.error(" Error creating session:", msg);
      alert(" Error: " + msg);
    }
  };

  const handleCreateTeamFormationSession = async () => {
    const payload = {
      name: "TEAM_CREATION", // or change this dynamically later
      startTime: startDate,
      endTime: endDate,
      maxNumber: parseInt(maxMembers, 10),
      year: grade,
    };
  
    try {
      const res = await axios.post("/session/setsessoin", payload, {
        headers: {
          "Content-Type": "application/json",
        },
        withCredentials: true, // in case cookies/token needed
      });
  
      alert("✅ Session created: " + res.data.message);
      onClose(); // close modal after success
    } catch (err) {
      const msg = err.response?.data?.message || err.message;
      console.error("❌ Error creating session:", msg);
      alert("❌ Error: " + msg);
    }
  };


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
            onClick={() => { console.log({ grade, maxMembers, startDate, endDate }); if (sessionsPageActiveTab === "Topic Submission Session"){handleCreateTopicSubmissionSession(); 

            }else if(sessionsPageActiveTab === "Team Formation Session"){
              handleCreateTeamFormationSession();
          }else{
            alert("Please select a valid session type.");
          }
        }
          
          }
          >
            Create
          </button>
        </div>
      </div>
    </div>
  );
};

export default StartNewSessionModal;
