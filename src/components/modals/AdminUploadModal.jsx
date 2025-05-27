import React, { useState, useEffect, useRef } from "react";
import Style from "../../styles/TeamFormationPage.module.css";
import Uploadbox from "./uploadbox";
import axios from "axios";
import { Navigate } from "react-router-dom";

export default function AdminUploadModal({ isOpen, onClose, onSuccess,onFailure, pfeId }) {
  const [file, setFile] = useState(null);
  const [grade, setGrade] = useState("2CP");
  const presentationRef = useRef(null);
  

  useEffect(() => {
    if (isOpen) {
      setFile(null);
      setGrade("2CP");
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handlePresentationChange = (e) => {
    setFile(e.target.files?.[0] || null);
  };

  const uploadGlobalPlanning = async (year, file) => {
    const formData = new FormData();
    formData.append("year", year);
    formData.append("soutplanning", file);
    const response = await axios.post(
      "/soutenances/uploadGlobalPlanning",
      formData,
      {
        headers: { "Content-Type": "multipart/form-data" },
        withCredentials: true,
      }
    );
    return response.data;
  };

  const handleConfirmClick = async () => {
    if (!file) {
      alert("Please select a PDF file before confirming.");
      return;
    }
    try {
      const data = await uploadGlobalPlanning(grade, file);
      if (onSuccess) onSuccess(data.message);
    } catch (err) {
      console.error(err);
      
      if (onFailure) onFailure(err.response?.data?.message || "Upload failed");
    } finally {
      onClose();
    }
  };

  return (
    <div className={Style["modal-overlay"]}>
      <div className={`${Style["modal-content"]} ${Style["create-team-modal"]}`}>
        <h2>Submit a Soutenance sheet</h2>
        <p className={Style["create-team-subtitle"]}>
          Please select the grade and upload the corresponding PDF
        </p>

        {/* Grade Selection */}
        <div className={Style["form-group"]} style={{ marginTop: "2vh" }}>
          <label htmlFor="grade-select" className={Style["form-label"]} style={{ fontWeight: "bold" }}>
            Grade
          </label>
          <select
            id="grade-select"
            value={grade}
            onChange={(e) => setGrade(e.target.value)}
            className={Style["select-input"]}
            style={{
              marginTop: "0.5em",
              padding: "0.6em 1em",
              borderRadius: "5px",
              border: "1px solid #ccc",
              fontSize: "1rem",
              width: "100%",
              maxWidth: "200px",
            }}
          >
            <option value="2CP">2CP</option>
            <option value="1CS">1CS</option>
            <option value="2CS">2CS</option>
            <option value="3CS">3CS</option>
          </select>
        </div>

        {/* File Upload */}
        <div className={Style["form-group"]} style={{ marginTop: "2vh" }}>
          <Uploadbox
            handlePresentationChange={handlePresentationChange}
            presentationFile={file}
            presentationRef={presentationRef}
            type="pdf"
            status={true}
          />
        </div>

        <div className={Style["modal-actions"]}>
          <button className={Style["cancel-button"]} onClick={onClose}>
            Cancel
          </button>
          <button
            className={Style["create-button"]}
            onClick={handleConfirmClick}
            disabled={!file}
          >
            Confirm
          </button>
        </div>
      </div>
    </div>
  );
}
