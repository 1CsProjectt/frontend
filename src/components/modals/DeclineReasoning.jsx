import React, { useState, useEffect, useRef } from "react";
import Style from "../../styles/TeamFormationPage.module.css";
import Uploadbox from "./uploadbox";
import axios from "axios";

export default function DeclineModal({ isOpen, onClose, onConfirm, pfeId }) {
  // State for reason and file
  const [reason, setReason] = useState("");
  const [file, setFile] = useState(null);

  // Reference for the hidden input (file input)
  const presentationRef = useRef(null);

  // Handle reject action
  const handleReject = async () => {
    if (!pfeId) return; // Ensure we have the ID

    try {
      const formData = new FormData();
      formData.append("reason", reason);
      if (file) {
        formData.append("resonfile", file);
      }

      const response = await axios.patch(`/pfe/${pfeId}/reject`, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      console.log("Reject success:", response.data);
      // Optionally, handle any UI updates after the reject action
      onConfirm();  // Trigger parent callback to close modal or update UI
    } catch (error) {
      console.error("Error rejecting PFE:", error);
      // Optionally show an error message to the user
    }
  };

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
    handleReject();
    onClose(); // Close the modal after confirming
  };

  return (
    <div className={Style["modal-overlay"]} style={{ margin: "0 50px" }}>
      <div className={`${Style["modal-content"]} ${Style["create-team-modal"]}`}>
        <h2>Decline Reason</h2>
        <p className={Style["create-team-subtitle"]}>
          Please enter the reason for the declination. This helps ensure transparency and proper
          documentation. You may also upload a supporting file if necessary.
        </p>

        <div className={Style["form-group"]}>
          <label htmlFor="decline-reason" style={{ fontWeight: "bold" }}>
            Decline reason
          </label>
          <textarea
            id="decline-reason"
            value={reason}
            onChange={(e) => setReason(e.target.value)}
            placeholder="Enter decline reason"
            className={Style["add-member-input"]}
            rows={4}
          />
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
