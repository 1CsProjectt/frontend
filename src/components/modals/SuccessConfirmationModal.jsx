//handling item deletion /validation / delining popup
import React from "react";
import "../../styles/SuccessConfirmationModal.css";
import successIcon from "../../assets/success-icon.svg";

const SuccessConfirmationModal = ({ message, onClose }) => {
  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <img src={successIcon} alt="Success" className="success-icon" />
        <h2>Success!</h2>
        <p>{message}</p>
        <button className="modal-button" onClick={onClose}>
          Okay
        </button>
      </div>
    </div>
  );
};

export default SuccessConfirmationModal;
