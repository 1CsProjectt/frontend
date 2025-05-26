import React, { useEffect, useState } from "react";

const containerStyle = {
  marginLeft: "17vw",
  marginBottom: "5vh",
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
  alignItems: "center"
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

/**
 * Props:
 * - message: string
 * - onClose: () => void
 * - duration?: number (ms visible before hiding)
 * - animationDuration?: number (ms for show/hide transition)
 */
const Toast = ({ message, onClose, duration = 1500, animationDuration =500,isError }) => {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    // Trigger show animation
    setVisible(true);

    // Schedule hide animation
    const hideTimer = setTimeout(() => setVisible(false), duration);

    // After animation completes, call onClose
    const closeTimer = setTimeout(() => onClose(), duration + animationDuration);

    return () => {
      clearTimeout(hideTimer);
      clearTimeout(closeTimer);
    };
  }, [duration, animationDuration, onClose]);

  const animatedStyle = {
    ...containerStyle,
    backgroundColor: isError ? "#dc2626" : containerStyle.backgroundColor, 
    transition: `transform ${animationDuration}ms ease, opacity ${animationDuration}ms ease`,
    opacity: visible ? 1 : 0,
    transform: visible ? "translateY(0)" : "translateY(100%)"
  };

  return (
    <div style={animatedStyle}>
      <span>{message}</span>
      <button style={closeButtonStyle} onClick={onClose}>
        &times;
      </button>
    </div>
  );
};

export default Toast;