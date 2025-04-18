import React, { useState } from "react";
import Module from "../styles/authentication.module.css";
import logo from "../assets/logo.svg";
import schoolIcon from "../assets/school-icon.svg";
import { FaRegEye, FaRegEyeSlash } from "react-icons/fa";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { API_URL } from "../config";
/* mohamed, [3/30/25 2:47 PM]
mohamed.boudja@gmgail.com"

mohamed, [3/30/25 2:47 PM]
12345678 pass */

axios.defaults.withCredentials = true;
axios.defaults.headers.common["ngrok-skip-browser-warning"] = "true";

const Login = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  const validateEmail = (email) => {
    const emailPattern =
      /^[a-z]+(-[a-z]+)*\.[a-z]+(-[a-z]+)*@[a-z]+(-[a-z]+)?\.[a-z]{2,3}$/;
    return emailPattern.test(email);
  };

  const handleSignIn = async (e) => {
    e.preventDefault();

    if (!email || !password) {
      setError("Please fill in both your email and password.");
      return;
    }

    if (!validateEmail(email)) {
      setError("Please enter a valid email address.");
      return;
    }

    setError("");
    setLoading(true);

    try {
      // Make the POST request to the login endpoint
      const response = await axios.post(
        `/auth/login`,
        { email, password },
        { withCredentials: true }
      );

      // Destructure the response to get the user object
      const { user } = response.data;

      // Store the user object in localStorage (convert to JSON string)
      localStorage.setItem("user", JSON.stringify(user));

      console.log("Login successful:", response.data);
      alert("Login successful!");

      // Redirect the user to the main page or dashboard
      if (user.role === "admin") {
        navigate("/admin");
      } else if (user.role === "student") {
        navigate("/pfe-student");
      } else {
        navigate("/pfe-student");
      }
    } catch (err) {
      console.error("Login failed:", err.response?.data || err.message);
      setError(
        err.response?.data?.message || "Login failed. Please try again."
      );
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
        <img
          className={Module["school-logo"]}
          src={schoolIcon}
          alt="ESI School Logo"
        />
      </div>

      {/* Right Side */}
      <div className={Module["login-right"]}>
        <div className={Module["right-content"]}>
          <h1>Welcome back!</h1>
          <p>
            Simplify your PFE journey with an all-in-one platform to manage,
            track, and organize your final project.
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

            {error && (
              <p className={Module["error-message"]} style={{ color: "red" }}>
                {error}
              </p>
            )}

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
