// ===== DeclineModal.jsx =====
import React, { useState, useEffect, useRef } from "react";
import Style from "../../styles/TeamFormationPage.module.css";
import Uploadbox from "./uploadbox";

export default function DeclineModal({ isOpen, onClose, onConfirm }) {
  // état pour le texte et le fichier (state for reason and file)
  const [reason, setReason] = useState("");
  const [file, setFile] = useState(null);
  // référence pour l’input caché (ref for the hidden input)
  const presentationRef = useRef(null);

  useEffect(() => {
    if (isOpen) {
      setReason("");
      setFile(null);
    }
  }, [isOpen]);

  if (!isOpen) return null;

  // quand le fichier change (when file changes)
  const handlePresentationChange = (e) => {
    const selected = e.target.files?.[0] || null;
    setFile(selected);
  };

  const handleConfirmClick = () => {
    onConfirm({ reason, file });
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
          {/* Intégration de Uploadbox (integration of Uploadbox) */}
          <Uploadbox
            handlePresentationChange={handlePresentationChange}
            presentationFile={file}
            presentationRef={presentationRef}
            type="pdf"            // ou "image" selon besoin (or "image" as needed)

            status={true}         // true pour uploader, false pour lecture seule (read-only)
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
