//handling item deletion /validation / delining popup
import React from "react";
import classes from "../../styles/SuccessConfirmationModal.module.css";
import successIcon from "../../assets/success-icon.svg";

const SuccessConfirmationModal = ({ message, onClose }) => {
  return (
    <div className={classes["modal-overlay"]} style={{ transform: "scale(1.2)" }}>
      <div className={classes["modal-content"]}>
        <img src={successIcon} alt="Success" className={classes["success-icon"]} />
        <h2>Success</h2>
        <p>{message}</p>
        <button className={classes["modal-button"]} onClick={() => { onClose(); window.location.reload(); }}>
          Okay
        </button>
      </div>
    </div>
  );
};

export default SuccessConfirmationModal;