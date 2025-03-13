import React, { useState, useEffect } from "react";
import axios from "axios"; // Import Axios for HTTP requests
import { useNavigate, useParams } from "react-router-dom";
import "../styles/App.css";
import logo from "../assets/logo.svg";
import schoolIcon from "../assets/school-icon.svg";
import successIcon from "../assets/success-icon.svg";
import errorIcon from "../assets/error-icon.svg";

const ResetPassword = () => {
  const { token } = useParams(); // Get the token from the URL
  const [newPassword, setPassword] = useState("");
  const [passwordStrength, setPasswordStrength] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [modalType, setModalType] = useState(""); // "success" or "error"
  const [errorMessage, setErrorMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState("");

  const navigate = useNavigate();

  useEffect(() => {
    console.log("Token from URL:", token); // For debugging
  }, [token]);

  const checkPasswordStrength = (value) => {
    setPassword(value);
    setErrorMessage("");

    if (value.length < 8) {
      setPasswordStrength("Weak");
      return;
    }

    const uppercaseCount = (value.match(/[A-Z]/g) || []).length;
    const lowercaseCount = (value.match(/[a-z]/g) || []).length;
    const numberOrSymbolCount = (value.match(/[0-9!@#$%^&*]/g) || []).length;

    if (value.length > 12 && uppercaseCount >= 2 && lowercaseCount >= 2 && numberOrSymbolCount >= 2) {
      setPasswordStrength("Strong");
    } else {
      setPasswordStrength("Moderate");
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!newPassword) {
      setErrorMessage("Please enter your new password.");
      return;
    }

    setIsLoading(true);
    try {
        const response = await axios.post(
            `https://60a9-154-121-66-149.ngrok-free.app/auth/reset-password/${token}`, // Include token in the URL
            { newPassword }, // Send only password in the body
            { withCredentials: true } // Send cookies if needed
          );
          

      setModalType("success");
      setMessage(response.data.message || "Password reset successful!");
    } catch (error) {
      setModalType("error");
      setErrorMessage(error.response?.data?.message || "Something went wrong.");
    } finally {
      setShowModal(true);
      setIsLoading(false);
    }
  };

  const closeModal = () => {
    setShowModal(false);
  };

  return (
    <div className="reset-password-container">
      {/* Left Side */}
      <div className="reset-left">
        <div className="logo">
          <img src={logo} alt="PFE Logo" />
        </div>
        <img className="school-logo" src={schoolIcon} alt="ESI School Logo" />
      </div>

      {/* Right Side */}
      <div className="reset-right">
        <div className="reset-content">
          <h1>Reset password.</h1>
          <p>
            Simplify your PFE journey with an all-in-one platform to manage,
            track, and organize your final project.
          </p>
          <form onSubmit={handleSubmit}>
            <label>New password</label>
            <div className="password-field">
              <input
                type="password"
                value={newPassword}
                onChange={(e) => checkPasswordStrength(e.target.value)}
                placeholder=""
                className="input-field"
                disabled={isLoading} // Disable input during loading
              />
            </div>
            {errorMessage && <p className="error-message">{errorMessage}</p>}
            <p className={`password-strength ${passwordStrength.toLowerCase()}`}>
              Password strength: {passwordStrength || "Enter a password"}
            </p>
            <ul className="password-requirements">
              <li>{newPassword.length >= 8 ? "✓" : "✗"} Minimum 8 characters</li>
              <li>{newPassword.length > 12 ? "✓" : "✗"} More than 12 characters for a strong password</li>
              <li>
                {(/[A-Z]/.test(newPassword) && newPassword.match(/[A-Z]/g)?.length >= 2) ? "✓" : "✗"} At least two uppercase letters
              </li>
              <li>
                {(/[a-z]/.test(newPassword) && newPassword.match(/[a-z]/g)?.length >= 2) ? "✓" : "✗"} At least two lowercase letters
              </li>
              <li>
                {(/[0-9!@#$%^&*]/.test(newPassword) && newPassword.match(/[0-9!@#$%^&*]/g)?.length >= 2) ? "✓" : "✗"} At least two numbers or symbols
              </li>
              <li>{!/\s/.test(newPassword) ? "✓" : "✗"} Cannot contain spaces</li>
            </ul>
            <button
              type="submit"
              className="btn"
              disabled={passwordStrength === "Weak" || isLoading}
            >
              {isLoading ? "Resetting..." : "Reset password"}
            </button>
          </form>
        </div>
      </div>

      {/* Modal */}
      {showModal && (
        <div className="modal-overlay">
          <div className={`modal ${modalType}`}>
            {modalType === "success" ? (
              <div className="modal-icon">
                <img src={successIcon} alt="Success" />
              </div>
            ) : (
              <div className="modal-icon">
                <img src={errorIcon} alt="Error" />
              </div>
            )}
            <div className="modal-header">
              {modalType === "success" ? "Success!" : "Something went wrong!!"}
            </div>
            <div className="modal-body">
              {modalType === "success" ? (
                <p>{message || "Your password has been updated!"}</p>
              ) : (
                <p>{errorMessage || "Something went wrong. Please try again."}</p>
              )}
            </div>
            <div className="modal-footer">
              <button
                onClick={() => navigate("/")} // Navigate to home
                className="btn-primary"
              >
                {modalType === "success" ? "Back to Login" : "Back to Login"}
              </button>
              <button onClick={closeModal} className="btn-secondary">
                {modalType === "success" ? "Not now" : "Try Again"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ResetPassword;
