import React, { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import Module from "../styles/authentication.module.css";
import logo from "../assets/logo.svg";
import schoolIcon from "../assets/school-icon.svg";
import axios from "axios";
import { API_URL } from "../config";

const CheckEmail = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const email = location.state?.email || "your email";
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleResendLink = async () => {
    try {
      setLoading(true);
      setError("");

      // Simulate resending the email via API
      await axios.post(`${API_URL}/auth/forgot-password`, { email });
      alert("A new recovery link has been sent to your email.");
    } catch (err) {
      setError(err.response?.data?.message || "Failed to resend recovery link. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={Module["login-container"]}>
      {/* Left Side */}
      <div className={Module["login-left"]}>
        <div className={Module["logo"]}>
          <img src={logo} alt="PFE Logo" />
        </div>
        <img className={Module["school-logo"]} src={schoolIcon} alt="ESI School Logo" />
      </div>

      {/* Right Side (Check Email Content) */}
      <div className={Module["login-right"]}>
        <div className={Module["right-content"]}>
          <h1>Check your email.</h1>
          <p>
            We just sent a recovery link to <strong>{email}</strong>. If you can’t find it in your inbox, please check your spam filter.
          </p>

          {error && <p className={Module["error-message"]} style={{ color: "red" }}>{error}</p>}

          <div className={Module["check-email-actions"]}>
            {/* "Resend recovery link" Button */}
            <button
              className={Module["link-btn"]}
              onClick={handleResendLink}
              disabled={loading}
            >
              {loading ? "Resending..." : "Resend recovery link"}
            </button>

            {/* "Back to log in" Button */}
            <button className={Module["btn"]} id={Module["checkEmail-btn"]} onClick={() => navigate("/")}>
              Back to log in
            </button>

          </div>
        </div>
      </div>
    </div>
  );
};

export default CheckEmail;