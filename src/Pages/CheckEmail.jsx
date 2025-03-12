import React from "react";
import { useNavigate ,useLocation } from "react-router-dom";
import "../styles/App.css";
import logo from "../assets/logo.svg";
import schoolIcon from "../assets/school-icon.svg";

const CheckEmail = () => {
  const navigate = useNavigate(); // Hook for navigation
  const location = useLocation();
  const email = location.state?.email || "your email"; // Get email or fallback text
  const handleResendLink = () => {
    // Simulate resending the email (you can replace this with an actual API call)
    alert("A new recovery link has been sent to your email.");
  };

  return (
    <div className="login-container">
      {/* Left Side */}
      <div className="login-left">
        <div className="logo">
          <img src={logo} alt="PFE Logo" />
        </div>
        <img className="school-logo" src={schoolIcon} alt="ESI School Logo" />
      </div>

      {/* Right Side (Check Email Content) */}
      <div className="login-right">
        <div className="right-content">
          <h1>Check your email.</h1>
          <p>
            We just sent a recovery link to <strong>{email}</strong>.If you can’t find it in your inbox please check your spam filter
          </p>
<div className="check-email-actions">
        {/* "Resent recovery link" Button */}
        <button className="link-btn" onClick={handleResendLink}>
          Resent recovery link
        </button>

        {/* "Back to log in" Button */}
        <button className="btn" id="checkEmail-btn" onClick={() => navigate("/")}>
          Back to log in
        </button>
        </div>
        </div>
      </div>
    </div>
  );
};

export default CheckEmail;
