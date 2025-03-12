import React, { useState } from "react";
import "../styles/App.css";
import logo from "../assets/logo.svg";
import schoolIcon from "../assets/school-icon.svg";
import { FaRegEye, FaRegEyeSlash } from "react-icons/fa";
import { Link } from "react-router-dom";
import axios from "axios"; // Added axios for making API calls

const Login = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState(""); // Stores the email input
  const [password, setPassword] = useState(""); // Stores the password input
  const [error, setError] = useState(""); // Stores any validation or API error messages
  const [loading, setLoading] = useState(false); // Added a loading state for API call status
  const validateEmail = (email) => {
    const emailPattern = /^[a-z]+(-[a-z]+)*\.[a-z]+(-[a-z]+)*@[a-z]+(-[a-z]+)?\.[a-z]{2,3}$/;
    return emailPattern.test(email);
  };
  const handleSignIn = async (e) => {
    e.preventDefault(); // Prevents the default form submission behavior

    if (!email || !password) {
      // Validates if both email and password fields are filled
      setError("Please fill in both your email and password.");
      return;
    }
    if (!validateEmail(email)) {
      setError("Please enter a valid email address.");
      return;
    }
    setError(""); // Clears previous error messages
    setLoading(true); // Sets loading to true while making the API call

    try {
      // Makes a POST request to the backend login endpoint
      const response = await axios.post("http://localhost:5000/api/login", {
        email, // Sends the email as part of the request body
        password, // Sends the password as part of the request body
      });

      // Logs the successful response (for debugging )
      console.log("Login successful:", response.data);
      alert("Login successful!"); // Displays a success alert (you can replace this with navigation logic)
    } catch (err) {
      // Catches errors from the API call
      console.error("Login failed:", err.response?.data || err.message); // Logs the error (for debugging)
      setError(err.response?.data?.message || "Login failed. Please try again."); // Sets the error message from the API or a fallback message
    } finally {
      setLoading(false); // Resets the loading state regardless of success or failure
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
                value={email} // Controlled input for email
                onChange={(e) => setEmail(e.target.value)} // Updates email state
              />
            </div>

            <label>Password</label>
            <div className="password-field">
              <input
                type={showPassword ? "text" : "password"} // Toggles between text and password type
                className="input-field"
                value={password} // Controlled input for password
                onChange={(e) => setPassword(e.target.value)} // Updates password state
              />
              <span onClick={() => setShowPassword(!showPassword)}> {/* Toggles password visibility */}
                {showPassword ? <FaRegEyeSlash /> : <FaRegEye />} {/* Switches the icon */}
              </span>
            </div>

            {/* Displays error messages */}
            {error && <p className="error-message"  style={{color : "red"}} >{error}</p>}

            <div className="remember-forgot">
              <label>
                <input type="checkbox" /> Remember me
              </label>
              <Link to="/ForgotPassword">Forgot password?</Link>
            </div>

            <button type="submit" className="btn" disabled={loading}> {/* Disables button when loading */}
              {loading ? "Signing in..." : "Sign in"} {/* Shows loading state or "Sign in" */}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Login;
