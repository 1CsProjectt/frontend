import React, { useState } from "react";
import "../styles/App.css";
import logo from "../assets/logo.svg";
import schoolIcon from "../assets/school-icon.svg";
import { FaRegEye, FaRegEyeSlash } from "react-icons/fa";
import { Link } from "react-router-dom";

const Login = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState(""); // Store email input
  const [password, setPassword] = useState(""); // Store password input
  const [error, setError] = useState(""); // Store validation error

  const handleSignIn = (e) => {
    e.preventDefault(); // Prevent form submission

    if (!email || !password) {
      setError("Please fill in both your email and password.");
      return;
    }

    setError(""); // Clear error if fields are filled
    // Proceed with sign-in logic (API call, authentication, etc.)
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
          <h1>Welcome back!</h1>
          <p>
            Simplify your PFE journey with an all-in-one platform to manage, track, and
            organize your final project.
          </p>
          <form onSubmit={handleSignIn}>
            <label>Email address</label>
            <div className="email-field">
              <input
                type="email"
               
                className="input-field"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>

            <label>Password</label>
            <div className="password-field">
              <input
                type={showPassword ? "text" : "password"}
               
                className="input-field"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
              <span onClick={() => setShowPassword(!showPassword)}>
                {showPassword ? <FaRegEyeSlash /> : <FaRegEye />}
              </span>
            </div>

            {/* Show error message if fields are empty */}
            {error && <p className="error-message">{error}</p>}

            <div className="remember-forgot">
              <label>
                <input type="checkbox" /> Remember me
              </label>
              <Link to="/ForgotPassword">Forgot password?</Link>
            </div>

            <button type="submit" className="btn">Sign in</button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Login;
