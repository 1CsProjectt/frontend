import React, { useState } from "react";
import { useNavigate } from "react-router-dom"; // Import useNavigate
import "../styles/App.css";
import logo from "../assets/logo.svg";
import schoolIcon from "../assets/school-icon.svg";
import successIcon from "../assets/success-icon.svg";
import errorIcon from "../assets/error-icon.svg";

const ResetPassword = () => {
    const [password, setPassword] = useState("");
    const [passwordStrength, setPasswordStrength] = useState("");
    const [showModal, setShowModal] = useState(false);
    const [modalType, setModalType] = useState(""); // "success" or "error"
    const [errorMessage, setErrorMessage] = useState(""); // Error message for empty password

    const navigate = useNavigate(); // Initialize navigate function

    const checkPasswordStrength = (value) => {
        setPassword(value);
        setErrorMessage(""); // Remove error when user types

        if (value.length < 8) {
            setPasswordStrength("Weak"); // Not accepted
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

    const handleSubmit = (e) => {
        e.preventDefault();
        if (!password) {
            setErrorMessage("Please enter your new password.");
            return;
        }

        if (passwordStrength === "Weak") {
            setModalType("error");
        } else {
            setModalType("success");
        }
        setShowModal(true);
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
                                value={password}
                                onChange={(e) => checkPasswordStrength(e.target.value)}
                                placeholder=""
                                className="input-field"
                            />
                        </div>
                        {/* Show error message when no password is entered */}
                        {errorMessage && <p className="error-message">{errorMessage}</p>}

                        <p className={`password-strength ${passwordStrength.toLowerCase()}`}>
                            Password strength: {passwordStrength || "Enter a password"}
                        </p>
                        <ul className="password-requirements">
                            <li>
                                {password.length >= 8 ? "✓" : "✗"} Minimum 8 characters
                            </li>
                            <li>
                                {password.length > 12 ? "✓" : "✗"} More than 12 characters for strong password
                            </li>
                            <li>
                                {(/[A-Z]/.test(password) && password.match(/[A-Z]/g)?.length >= 2) ? "✓" : "✗"} At least two uppercase letters
                            </li>
                            <li>
                                {(/[a-z]/.test(password) && password.match(/[a-z]/g)?.length >= 2) ? "✓" : "✗"} At least two lowercase letters
                            </li>
                            <li>
                                {(/[0-9!@#$%^&*]/.test(password) && password.match(/[0-9!@#$%^&*]/g)?.length >= 2) ? "✓" : "✗"} At least two numbers or symbols
                            </li>
                            <li>{!/\s/.test(password) ? "✓" : "✗"} Cannot contain spaces</li>
                        </ul>
                        <button type="submit" className="btn" disabled={passwordStrength === "Weak"}>
                            Reset password
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
                                <img src={errorIcon} alt="Something went wrong!" />
                            </div>
                        )}
                        <div className="modal-header">
                            {modalType === "success" ? "Success!" : "Something went wrong!!"}
                        </div>
                        <div className="modal-body">
                            {modalType === "success" ? (
                                <p>
                                    Your password has been updated! If you didn’t make this
                                    change, please contact support immediately.
                                </p>
                            ) : (
                                <p>
                                    Something went wrong. Please check your connection and try
                                    again. If the issue persists, contact support.
                                </p>
                            )}
                        </div>
                        <div className="modal-footer">
                            <button
                                onClick={() => navigate("/")} // Navigate to the home route
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
