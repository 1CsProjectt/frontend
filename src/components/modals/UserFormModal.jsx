import React, { useState } from "react";
import { Eye, EyeOff } from "lucide-react"; // Using Lucide to import the eye /eye off icons
import classes from "../../styles/UserFormModal.module.css"; // Import the separate CSS file

const UserFormModal = ({ isOpen, onClose }) => {
 
  // Basic hooks to store the data
  // (Updated as the user types) when we use: onChange={(e) => setEmail(e.target.value)}
  const [email, setEmail] = useState(""); // Variable to store input
  const [error, setError] = useState(""); // Store validation error
  const [loading, setLoading] = useState(false); // Track loading state
  const [showPassword, setShowPassword] = useState(false); // By default, the password is hidden while typing
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [role, setRole] = useState("");
  const [password, setPassword] = useState("");
  const [errors, setErrors] = useState({}); // Store validation errors as an array of objects



  if (!isOpen) return null;

  // Validate email format
  const validateEmail = (email) => {
    const emailPattern = /^[a-z]+(-[a-z]+)*\.[a-z]+(-[a-z]+)*@[a-z]+(-[a-z]+)?\.[a-z]{2,3}$/;
    return emailPattern.test(email);
  };

  // Handle form submission
  const handleSubmit = (e) => {
    e.preventDefault();
    let newErrors = {};

    // The trim() removes white spaces from the beginning and end of the string
    if (!firstName.trim()) newErrors.firstName = "First name is required.";
    if (!lastName.trim()) newErrors.lastName = "Last name is required.";
    if (!email.trim()) newErrors.email = "Email is required.";
    else if (!validateEmail(email)) newErrors.email = "Invalid email format.";
    if (!role) newErrors.role = "Please select a role.";
    if (!password.trim()) newErrors.password = "Password is required.";

    setErrors(newErrors);

    if (Object.keys(newErrors).length === 0) {
      console.log("Form submitted successfully!");
      // Submit logic here
    }
  };

  return (
    <div className={classes["modal-overlay"]}>
      <div className={classes["modal-container"]}>
        <form className={classes["modal-form"]} onSubmit={handleSubmit}>
          <div className={classes["modal-row"]}>
            {/* First Name */}
            <div className={classes["input-group"]}>
              <label htmlFor="firstName">First Name</label>
              <input
                id="firstName"
                type="text"
                className={classes["modal-input"]}
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
              />
              {errors.firstName && <p className={classes["error-message"]}>{errors.firstName}</p>}
            </div>

            {/* Last Name */}
            <div className={classes["input-group"]}>
              <label htmlFor="lastName">Last Name</label>
              <input
                id="lastName"
                type="text"
                className={classes["modal-input"]}
                value={lastName}
                onChange={(e) => setLastName(e.target.value)}
              />
              {errors.lastName && <p className={classes["error-message"]}>{errors.lastName}</p>}
            </div>
          </div>

          {/* Email Address */}
          <div className={classes["input-group"]}>
            <label htmlFor="email">Email Address</label>
            <input
              id="email"
              type="email"
              placeholder="f.lastname@esi-sba.dz"
              className={classes["modal-input"]}
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            {errors.email && <p className={classes["error-message"]}>{errors.email}</p>}
          </div>

          {/* Role Selection */}
          <div className={classes["input-group"]}>
            <label htmlFor="role">Role</label>
            <select
              id="role"
              className={classes["modal-input"]}
              value={role}
              onChange={(e) => setRole(e.target.value)}
            >
              <option value="">Select a role</option>
              <option value="Admin">Admin</option>
              <option value="Student">Student</option>
              <option value="Supervisor">Supervisor</option>
              <option value="Jury">Jury</option>
            </select>
            {errors.role && <p className={classes["error-message"]}>{errors.role}</p>}
          </div>

          {/* Password */}
          <div className={`${classes["input-group"]} ${classes["password-container"]}`}>
            <label htmlFor="password">Password</label>
            <input
              id="password"
              type={showPassword ? "text" : "password"}
              placeholder="YourSecurePassword!"
              className={`${classes["modal-input"]} ${classes["password-input"]}`}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            <button
              type="button"
              className={classes["eye-icon"]}
              onClick={() => setShowPassword(!showPassword)}
            >
              {showPassword ? <EyeOff /> : <Eye />}
            </button>
          </div>
          {errors.password && <p className={classes["error-message"]}>{errors.password}</p>}

          {/* Modal Buttons */}
          <div className={classes["modal-buttons"]}>
            <button type="button" className={classes["cancel-btn"]} onClick={onClose}>
              Cancel
            </button>
            <button type="submit" className={classes["submit-btn"]}>
              Okey
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default UserFormModal;