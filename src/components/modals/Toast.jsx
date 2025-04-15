
import React from "react";

const containerStyle = {
  marginLeft: "17vw",
  marginBottom: "10vh",
  position: "fixed",
  bottom: "1rem",
  left: "1rem",
  zIndex: 9999,
  width: "400px",
  height: "60px",
  backgroundColor: "#0284c7",
  color: "#fff",
  padding: "1rem 1.25rem",
  borderRadius: "6px",
  boxShadow: "0 2px 6px rgba(0, 0, 0, 0.2)",
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
  opacity: 1, 
  transform: "translateY(0)",
  transition: "transform 0.3s ease, opacity 0.3s ease"
};

const closeButtonStyle = {
  background: "transparent",
  border: "none",
  color: "#fff",
  fontSize: "1.2rem",
  cursor: "pointer",
  lineHeight: 1,
  padding: 0
};

const Toast = ({ message, onClose }) => {
  return (
    <div style={containerStyle}>
      <span>{message}</span>
      <button style={closeButtonStyle} onClick={onClose}>
        &times;
      </button>
    </div>
  );
};

export default Toast;
