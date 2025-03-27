import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "../styles/authentication.css";
import logo from "../assets/logo.svg";
import schoolIcon from "../assets/school-icon.svg";
import axios from "axios";
import { API_URL } from "../config";

const ForgotPassword = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState(""); // Store email input
  const [error, setError] = useState(""); // Store validation error
  const [loading, setLoading] = useState(false); // Track loading state

  // Validate email format
  const validateEmail = (email) => {
    const emailPattern = /^[a-z]+(-[a-z]+)*\.[a-z]+(-[a-z]+)*@[a-z]+(-[a-z]+)?\.[a-z]{2,3}$/;
    return emailPattern.test(email);
  };

  const handleConfirmClick = async (e) => {
    e.preventDefault();

    if (!email) {
      setError("Please enter your email address.");
      return;
    }

    if (!validateEmail(email)) {
      setError("Please enter a valid email address (e.g., name.surname@example.com).");
      return;
    }

    setError(""); // Clear previous error messages
    setLoading(true); // Start loading

    try {
      // Make a POST request to the forgot-password endpoint
      const response = await axios.post(`${API_URL}/auth/forgot-password`, { email });

      console.log("Recovery link sent:", response.data);

      // Navigate to the CheckEmail page, passing the email as state
      navigate("/CheckEmail", { state: { email } });
    } catch (err) {
      // Handle API errors
      console.error("Failed to send recovery link:", err.response?.data || err.message);
      setError(err.response?.data?.message || "Failed to send recovery link. Please try again.");
    } finally {
      setLoading(false); // Stop loading
    }
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

      {/* Right Side */}
      <div className="login-right">
        <div className="right-content">
          <h1>Forget password?</h1>
          <p>
            We will send a recovery link to this email. Please make sure to follow the instructions to regain access.
          </p>
          <form>
            <label>Email address</label>
            <div className="email-field">
              <input
                type="email"
                placeholder="Enter your email (e.g., name.surname@example.com)"
                className="input-field"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>

            {/* Show error message if email is invalid */}
            {error && <p className="error-message" style={{ color: "red" }}>{error}</p>}

            <div className="check-email-actions check-forgetpassword-actions">
              {/* "Back to log in" Button */}
              <button className="link-btn" onClick={() => navigate("/")}>
                Back to log in
              </button>

              {/* "Send recovery link" Button */}
              <button
                className="btn"
                id="ForgetpageBacktoLogin"
                onClick={handleConfirmClick}
                disabled={loading} // Disable button while loading
              >
                {loading ? "Sending..." : "Send recovery link"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default ForgotPassword;
