import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate, useParams } from "react-router-dom";
import Module from "../styles/authentication.module.css";

import logo from "../assets/logo.svg";
import schoolIcon from "../assets/school-icon.svg";
import successIcon from "../assets/success-icon.svg";
import errorIcon from "../assets/error-icon.svg";
import { API_URL } from "../config";
const ResetPassword = () => {
  const { token } = useParams();
  const [newPassword, setPassword] = useState("");
  const [passwordStrength, setPasswordStrength] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [modalType, setModalType] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [modalTitle, setModalTitle] = useState("Error!");
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState("");

  const navigate = useNavigate();

  useEffect(() => {
    console.log("Token from URL:", token);
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
        `${API_URL}/auth/reset-password/${token}`,
        { newPassword },
        { withCredentials: true }
      );

      setModalType("success");
      setModalTitle("Success!");
      setMessage(response.data.message || "Password reset successful!");
    } catch (error) {
      if (error.code === "ECONNABORTED" || error.message.includes("timeout")) {
        setModalType("error");
        setModalTitle("Server timeout/error!");
        setErrorMessage("The request takes too long or the server crashes. Please try again. If the problem persists, please contact technical support.");
      } else if (error.response?.status === 500) {
        setModalType("error");
        setModalTitle("Database connection issue!");
        setErrorMessage("An error occurred while updating your password. Please try again later. If the problem persists, please contact technical support.");
      } else if (error.response?.status === 410) {
        setModalType("error");
        setModalTitle("Reset Link Expired!");
        setErrorMessage("The reset link has expired. Please try a new one. If there is any problem, please contact technical support.");
      } else {
        setModalType("error");
        setModalTitle("Error!");
        setErrorMessage("Something went wrong.");
      }
    } finally {
      setShowModal(true);
      setIsLoading(false);
    }
  };

  const closeModal = () => {
    setShowModal(false);
  };

  return (
    <div className={Module["reset-password-container"]}>
      <div className={Module["reset-left"]}>
        <div className={Module["logo"]}>
          <img src={logo} alt="PFE Logo" />
        </div>
        <img className={Module["school-logo"]} src={schoolIcon} alt="ESI School Logo" />
      </div>

      <div className={Module["reset-right"]}>
        <div className={Module["reset-content"]}>
          <h1>Reset password</h1>
          <p>Manage your final project efficiently with our platform.</p>
          <form onSubmit={handleSubmit}>
            <label>New password</label>
            <input
              type="password"
              value={newPassword}
              onChange={(e) => checkPasswordStrength(e.target.value)}
              className={Module["input-field"]}
              disabled={isLoading}
            />
            {errorMessage && <p className={Module["error-message"]}>{errorMessage}</p>}
            <p className={`${Module["password-strength"]} ${Module[passwordStrength.toLowerCase()]}`}>

              Password strength: {passwordStrength || "Enter a password"}
            </p>
            <button type="submit" className={Module["btn"]} disabled={passwordStrength === "Weak" || isLoading}>
              {isLoading ? "Resetting..." : "Reset password"}
            </button>
          </form>
        </div>
      </div>

      {showModal && (
        <div className={Module["modal-overlay"]}>
          <div className={`${Module["modal"]} ${Module[modalType]}`}>

            <div className={Module["modal-icon"]}>
              <img src={modalType === "success" ? successIcon : errorIcon} alt={modalType} />
            </div>
            <div className={Module["modal-header"]}>{modalTitle}</div>
            <div className={Module["modal-body"]}>
              <p>{modalType === "success" ? message : errorMessage}</p>
            </div>
            <div className={Module["modal-footer"]}>
              <button onClick={() => navigate("/")} className={Module["btn-primary"]}>
                Back to Login
              </button>
              <button onClick={closeModal} className={Module["btn-secondary"]}>
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