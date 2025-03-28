import React from "react";
import Icon from "../assets/alert-circleIcon.svg";

const JoinTeamAlert = ({ show, onCancel, onConfirm }) => {
  // Inline style objects
  const styles = {
    overlay: {
      position: "fixed",
      top: 0,
      left: 0,
      width: "100%",
      height: "100%",
      backgroundColor: "rgba(0, 0, 0, 0.5)",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      zIndex: 999,
      scale:1.4,
    },
    container: {
      backgroundColor: "#fff",
      borderRadius: "8px",
      width: "400px",
      maxWidth: "90%",
      boxShadow: "0 2px 10px rgba(0,0,0,0.2)",
      display: "flex",
      flexDirection: "column",
      alignItems: "center", // centers child elements horizontally
      textAlign: "center",  // centers text inside child elements
      overflow: "hidden",
    },
    icon: {
      marginTop: "16px",
    },
    header: {
      padding: "16px",
      borderBottom: "1px solid #eee",
      width: "100%",
    },
    title: {
      margin: 0,
      fontSize: "18px",
      fontWeight: 600,
    },
    body: {
      padding: "16px",
      fontSize: "14px",
      lineHeight: 1.5,
      width: "100%",
    },
    footer: {
      display: "flex",
      justifyContent: "center", // centers buttons horizontally
      padding: "16px",
      borderTop: "1px solid #eee",
      width: "100%",
    },
    btnCancel: {
      margin: "0 8px",
      padding: "8px 46px",
      border: " 1px solid #ccc",
      borderRadius: "4px",
      fontSize: "14px",
      cursor: "pointer",
      backgroundColor: "#f2f2f2",
      color: "#333",
    },
    btnConfirm: {
      margin: "0 8px",
      padding: "8px 46px",
      border: "none",
      borderRadius: "4px",
      fontSize: "14px",
      cursor: "pointer",
      backgroundColor: "#0284c7",
      color: "#fff",
    },
  };

  if (!show) {
    return null;
  }
 
  return (
    <div style={styles.overlay}>
      <div style={styles.container}>
        <div style={styles.icon}>
          <img src={Icon} alt="Alert Icon" style={{ width: "24px", height: "24px" }} />
        </div>
        <div style={styles.header}>
          <h2 style={styles.title}>Join the team</h2>
        </div>
        <div style={styles.body}>
          <p>
          Are you sure you want to join this team? Confirm your decision to proceed.          </p>
        </div>
        <div style={styles.footer}>
          <button style={styles.btnCancel} onClick={onCancel}>
            Cancel
          </button>
          <button style={styles.btnConfirm} onClick={onConfirm}>
            Confirm
          </button>
        </div>
      </div>
    </div>
  );
};

export default JoinTeamAlert;
