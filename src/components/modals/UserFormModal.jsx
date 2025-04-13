import React, { useState, useEffect } from "react"; 
import { Eye, EyeOff } from "lucide-react"; // Using Lucide to import the eye /eye off icons
import classes from "../../styles/UserFormModal.module.css"; // Import the separate CSS file

const UserFormModal = ({ isOpen, onClose, operation ,userObject }) => {
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [role, setRole] = useState("");
  const [password, setPassword] = useState("");
  const [year, setYear] = useState("1CS");
  const [specialite, setSpecialite] = useState("");
  const [companyName, setCompanyName] = useState("");
  const [phone, setPhone] = useState("");
  const [address, setAddress] = useState("");
  const [website, setWebsite] = useState("");
  const [admin_level, setAdminLevel] = useState("");
  const [permissions, setPermissions] = useState("");
  const [errors, setErrors] = useState({});

  useEffect(() => {
    setCompanyName("ESI");
    setPhone("0555555555");
    setAddress("SBA");
    setWebsite("www.esi-sba.dz");
    setAdminLevel("admin");
    setPermissions("all");
  }, []);

  if (!isOpen) return null;

  const validateEmail = (email) => {
    const emailPattern = /^[a-z]+(-[a-z]+)*\.[a-z]+(-[a-z]+)*@[a-z]+(-[a-z]+)?\.[a-z]{2,3}$/;
    return emailPattern.test(email);
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    let newErrors = {};

    if (!firstName.trim()) newErrors.firstName = "First name is required.";
    if (!lastName.trim() && role !== "company") newErrors.lastName = "Last name is required.";
    if (!email.trim()) newErrors.email = "Email is required.";
    else if (!validateEmail(email)) newErrors.email = "Invalid email format.";
    if (!role) newErrors.role = "Please select a role.";
    if (!password.trim()) newErrors.password = "Password is required.";

    setErrors(newErrors);

    if (Object.keys(newErrors).length === 0) {
      const userData = {
        username: firstName + " " + lastName,
        firstName,
        lastName,
        email,
        password,
        role,
        year,
        specialite,
        companyName,
        phone,
        address,
        website,
        admin_level,
        permissions,
      };

      handleCreateUser(userData);
    }
  };

  const handleCreateUser = async (userData) => {
    const payload = {
      username: userData.firstName + " " + userData.lastName,
      email: userData.email,
      password: userData.password,
      role: userData.role,
      firstname: userData.firstName,
      lastname: userData.lastName,
    };

    if (userData.role === "student") {
      payload.year = userData.year;
      if (["2CS", "3CS"].includes(userData.year?.toUpperCase())) {
        payload.specialite = userData.specialite;
      }
    } else if (userData.role === "company") {
      payload.companyName = userData.companyName;
      payload.phone = userData.phone;
      payload.address = userData.address;
      payload.website = userData.website;
    } else if (userData.role === "admin") {
      payload.admin_level = userData.admin_level;
      payload.permissions = userData.permissions;
    }

    try {
      const res = await fetch("/users/create", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      const result = await res.json();
      if (!res.ok) throw new Error(result.message || "Something went wrong");

      console.log("✅ User created:", result);
      alert("User created successfully!");
      onClose();
    } catch (err) {
      console.error("❌ Error:", err.message);
      alert("Error creating the user: " + err.message);
      onClose();
    }
  };

  const handleClose = () => {
    setErrors({});
    onClose();
  };

  return (
    <div className={classes["modal-overlay"]}>
      <div className={classes["modal-container"]}>
        <form className={classes["modal-form"]}>
          <div className={classes["modal-row"]}>
            {/* First Name or Company Name */}
            <div className={classes["input-group"]}>
              <label htmlFor="firstName">{role === "company" ? "Company Name" : "First Name"}</label>
              <input
                id="firstName"
                type="text"
                className={classes["modal-input"]}
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
              />
              {errors.firstName && <p className={classes["error-message"]}>{errors.firstName}</p>}
            </div>

            {/* Last Name or Address */}
            <div className={classes["input-group"]}>
              <label htmlFor="lastName">{role === "company" ? "Address" : "Last Name"}</label>
              <input
                id="lastName"
                type="text"
                className={classes["modal-input"]}
                value={role === "company" ? address : lastName}
                onChange={(e) =>
                  role === "company" ? setAddress(e.target.value) : setLastName(e.target.value)
                }
              />
              {errors.lastName && role !== "company" && (
                <p className={classes["error-message"]}>{errors.lastName}</p>
              )}
              {errors.address && role === "company" && (
                <p className={classes["error-message"]}>{errors.address}</p>
              )}
            </div>
          </div>

          {/* Email */}
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
              <option value="admin">Admin</option>
              <option value="student">Student</option>
              <option value="supervisor">Supervisor</option>
              <option value="jury">Jury</option>
              <option value="company">Company</option>
            </select>
            {errors.role && <p className={classes["error-message"]}>{errors.role}</p>}
          </div>

          {/* Company fields */}
          {role === "company" && (
            <div className={classes["modal-row"]}>
              <div className={classes["input-group"]}>
                <label htmlFor="phone">Phone Number</label>
                <input
                  id="phone"
                  type="text"
                  className={classes["modal-input"]}
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                />
                {errors.phone && <p className={classes["error-message"]}>{errors.phone}</p>}
              </div>

              <div className={classes["input-group"]}>
                <label htmlFor="website">Website</label>
                <input
                  id="website"
                  type="text"
                  className={classes["modal-input"]}
                  value={website}
                  onChange={(e) => setWebsite(e.target.value)}
                />
                {errors.website && <p className={classes["error-message"]}>{errors.website}</p>}
              </div>
            </div>
          )}

          {/* Student fields */}
          {role === "student" && (
            <>
              <div className={classes["input-group"]}>
                <label htmlFor="year">Student Year</label>
                <select
                  id="year"
                  className={classes["modal-input"]}
                  value={year}
                  onChange={(e) => setYear(e.target.value)}
                >
                  <option value="">Select a grade</option>
                  <option value="2CP">2CP</option>
                  <option value="1CS">1CS</option>
                  <option value="2CS">2CS</option>
                  <option value="3CS">3CS</option>
                </select>
                {errors.year && <p className={classes["error-message"]}>{errors.year}</p>}
              </div>

              {(year === "2CS" || year === "3CS") && (
                <div className={classes["input-group"]}>
                  <label htmlFor="specialite">Student Speciality</label>
                  <select
                    id="specialite"
                    className={classes["modal-input"]}
                    value={specialite}
                    onChange={(e) => setSpecialite(e.target.value)}
                  >
                    <option value="">Select a specialite</option>
                    <option value="ISI">ISI</option>
                    <option value="SIW">SIW</option>
                    <option value="IASD">IASD</option>
                  </select>
                  {errors.specialite && <p className={classes["error-message"]}>{errors.specialite}</p>}
                </div>
              )}
            </>
          )}

          {/* Password Field */}
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

          {/* Buttons */}
          <div className={classes["modal-buttons"]}>
            <button type="button" className={classes["cancel-btn"]} onClick={handleClose}>
              Cancel
            </button>
            <button type="button" className={classes["submit-btn"]} onClick={handleSubmit}>
              Okey
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default UserFormModal;
