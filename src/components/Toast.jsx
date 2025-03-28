// Toast.jsx
import React from "react";
import "../styles/TeamFormationPage.css";

const Toast = ({ message, onClose }) => {
  return (
    <div className="toast-container show">
      <span>{message}</span>
      <button className="toast-close-button" onClick={onClose}>
        &times;
      </button>
    </div>
  );
};

export default Toast;
