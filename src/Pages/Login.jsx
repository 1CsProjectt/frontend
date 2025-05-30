import React, { use, useState } from "react";
import Module from "../styles/authentication.module.css";
import logo from "../assets/logo.svg";
import schoolIcon from "../assets/school-icon.svg";
import { FaRegEye, FaRegEyeSlash } from "react-icons/fa";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import Toast from "../components/modals/Toast";

axios.defaults.withCredentials = true;
axios.defaults.headers.common["ngrok-skip-browser-warning"] = "true";

const Login = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState("");
  const [isToasterror , setIsToasterror] = useState(null);

  const navigate = useNavigate();



  const handleSignIn = async (e) => {
    e.preventDefault();

    if (!email || !password) {
      setError("Please fill in both your email and password.");
      return;
    }

    setError("");
    setLoading(true);

    try {
      const response = await axios.post(
        `/auth/login`,
        { email, password },
        { withCredentials: true }
      );

      const { user } = response.data;

      localStorage.setItem("user", JSON.stringify(user));

      console.log("Login successful:", response.data);

      if (user.role === "admin") {
        navigate("/admin");
      } else if (user.role === "student") {
        navigate("/pfe-student");
        console.log(user.role);
        console.log(user);
      } else {
        navigate("/teacher");
      }
    }catch (err) {
      console.error("Login failed:", err.response?.data || err.message);
    
      if (
        err.message === "Network Error" ||
        err.code === "ERR_NETWORK"
      ) {
        setToastMessage("No internet connection. Please check your network.");
        setIsToasterror(true);
        setShowToast(true);
      } else {
        setError(
          err.response?.data?.message || "Login failed. Please try again."
        );
      }
    }
    finally {
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
      {showToast && (
          <Toast
            message={toastMessage}
            onClose={() => setShowToast(false)}
            isError ={ isToasterror }
          />
        )}
    </div>
  );
};

export default Login;
