import React, { useState, useEffect, useRef } from "react";
import Style from "../../styles/TeamFormationPage.module.css";
import Uploadbox from "./uploadbox";
import axios from "axios";
import { Navigate } from "react-router-dom";
export default function AdminUploadModal({ isOpen, onClose, onConfirm, pfeId}) {
  // State for reason and file
  const [reason, setReason] = useState("");
  const [file, setFile] = useState(null);
  const [grade, setGrade] = useState("2CP");
  // Reference for the hidden input (file input)
  const presentationRef = useRef(null);

  

  useEffect(() => {
    if (isOpen) {
      setReason("");
      setFile(null);
    }
  }, [isOpen]);

  if (!isOpen) return null;

  // Handle file changes
  const handlePresentationChange = (e) => {
    const selected = e.target.files?.[0] || null;
    setFile(selected);
  };

  const handleConfirmClick = () => {
    
    onClose(); // Close the modal after confirming
  };

  return (
    <div className={Style["modal-overlay"]} style={{ margin: "0 50px" }}>
      <div className={`${Style["modal-content"]} ${Style["create-team-modal"]}`}>
        <h2>Submit a Soutenance sheet</h2>
        <p className={Style["create-team-subtitle"]}>
          Please enter the year of the desired soutenance
        </p> 

        {/* Grade Selection */}
        <div className={Style["form-group"]} style={{ marginTop: "2vh" }}>
          <label htmlFor="grade-select" style={{ fontWeight: "bold" }}>
            Select Grade
          </label>
          <select
            id="grade-select"
            value={grade}
            onChange={(e) => setGrade(e.target.value)}
            className={Style["select-input"]}
            style={{ marginTop: "0.5em" }}
          >
            <option value="">-- Choose Grade --</option>
            <option value="2CP">2CP</option>
            <option value="1CS">1CS</option>
            <option value="2CS">2CS</option>
            <option value="3CS">3CS</option>
          </select>
        </div>


        <div className={Style["form-group"]} style={{ marginTop: "2vh" }}>
          {/* Uploadbox for file attachment */}
          <Uploadbox
            handlePresentationChange={handlePresentationChange}
            presentationFile={file}
            presentationRef={presentationRef}
            type="pdf"            // or "image" as needed
            status={true}         // true to allow upload, false for read-only
          />
        </div>

        <div className={Style["modal-actions"]}>
          <button className={Style["cancel-button"]} onClick={onClose} style={{ padding: " 10px 80px" }}>
            Cancel
          </button>
          <button
            className={Style["create-button"]}
            onClick={handleConfirmClick}
            disabled={!reason}
            style={{ padding: " 10px 80px" }}
          >
            Confirm
          </button>
        </div>
      </div>
    </div>
  );
}
