import React, { useState } from "react";
import Module from "../styles/authentication.module.css";

import logo from "../assets/logo.svg";
import schoolIcon from "../assets/school-icon.svg";
import { FaRegEye, FaRegEyeSlash } from "react-icons/fa";
import { Link } from "react-router-dom";
import axios from "axios";

import { API_URL } from "../config";

const Login = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState(""); // Stores the email input
  const [password, setPassword] = useState(""); // Stores the password input
  const [error, setError] = useState(""); // Stores any validation or API error messages
  const [loading, setLoading] = useState(false); // Added a loading state for API call status

  // Validate email format
  const validateEmail = (email) => {
    const emailPattern = /^[a-z]+(-[a-z]+)*\.[a-z]+(-[a-z]+)*@[a-z]+(-[a-z]+)?\.[a-z]{2,3}$/;
    return emailPattern.test(email);
  };

  // Handle form submission
  const handleSignIn = async (e) => {
    e.preventDefault(); // Prevents the default form submission behavior

    if (!email || !password) {
      setError("Please fill in both your email and password.");
      return;
    }

    if (!validateEmail(email)) {
      setError("Please enter a valid email address.");
      return;
    }

    setError(""); // Clear previous error messages
    setLoading(true); // Set loading state during the API call

    try {
      // Make a POST request to the backend login endpoint
      const response = await axios.post(`${API_URL}/auth/login`, { email, password });

      // Extract the token from the response
      const { token } = response.data;

      // Save the token to localStorage (or sessionStorage)
      localStorage.setItem("authToken", token);

      console.log("Login successful:", response.data);
      
      alert("Login successful!"); // Display success alert or navigate to another page
    } catch (err) {
      console.error("Login failed:", err.response?.data || err.message);
      setError(err.response?.data?.message || "Login failed. Please try again.");
    } finally {
      setLoading(false); // Reset the loading state
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

      {/* Right Side */}
      <div className={Module["login-right"]}>
        <div className={Module["right-content"]}>
          <h1>Welcome back!</h1>
          <p>
            Simplify your PFE journey with an all-in-one platform to manage, track, and
            organize your final project.
          </p>
          <form onSubmit={handleSignIn}>
            <label>Email address</label>
            <div className={Module["email-field"]}>
              <input
                type="email"
                className={Module["input-field"]}
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>

            <label>Password</label>
            <div className={Module["password-field"]}>
              <input
                type={showPassword ? "text" : "password"}
                className={Module["input-field"]}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
              <span onClick={() => setShowPassword(!showPassword)}>
                {showPassword ? <FaRegEyeSlash /> : <FaRegEye />}
              </span>
            </div>

            {error && <p className={Module["error-message"]} style={{ color: "red" }}>{error}</p>}

            <div className={Module["remember-forgot"]}>
              <label>
                <input type="checkbox" /> Remember me
              </label>
              <Link to="/ForgotPassword">Forgot password?</Link>
            </div>

            <button type="submit" className={Module["btn"]} disabled={loading}>
              {loading ? "Signing in..." : "Sign in"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Login;
