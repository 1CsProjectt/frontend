import React, { useState, useEffect } from "react"; 
import { Eye, EyeOff } from "lucide-react"; // Using Lucide to import the eye /eye off icons
import classes from "../../styles/UserFormModal.module.css"; // Import the separate CSS file
import axios from 'axios';


const UserFormModal = ({ isOpen, onClose ,userObject ,operation,userManagementActiveTab,setShowToast,setToastMessage,}) => {
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
 
  const handleClose = () => {
/*   // Clear all input fields
// the fields are already cleared in the useEffect hook (removed the operation prop)
  setFirstName("");
  setLastName("");
  setEmail("");
  setPassword("");
  setRole("");
  setYear("1CS");
  setSpecialite("");
  setCompanyName("");
  setPhone("");
  setAddress("");
  setWebsite("");
  setAdminLevel("");
  setPermissions("");
  setErrors({});
  setShowPassword(false);
  setAdminLevel("");
  setPermissions("all");

  setLoading(false);
  
 */
  onClose(); // Call parent’s close handler after cleanup
};


  // Tabs for different user types
/*   const tabs = ["Students", "Supervisors", "Enterprises", "Admins"]; */
//these tabs are used to set the role accroding to the currently selected tab
useEffect(() => {
  switch (userManagementActiveTab) {
    case "Students":
      setRole("student");
      break;
    case "Supervisors":
      setRole("teacher");
      break;
    case "Enterprises":
      setRole("company");
      break;
    case "Admins":
      setRole("admin");
      break;
    default:
      setRole(""); // or keep previous role
  }
}, [userManagementActiveTab]);



useEffect(() => {
  //if a user object is passed, populate the form with its data else clear the form again
  //equivalent to passing an operation prop but better for reducing type errors when calling the model
  if (operation ==="editUser" && isOpen) {
   /*  setFirstName(userObject.firstName || "");
    setLastName(userObject.lastName || ""); */
    //the user object does not have first name and last name only user name cause it is fetched from the users table which only has username
    const [firstName, lastName] = userObject.username.split(' ');
    console.log(userObject);
    setFirstName(firstName || "");
    setLastName(lastName || "");
    setEmail(userObject.email || "");
    setRole(userObject.role || "");
    setPassword(""); // Password should be left blank for security
    setYear(userObject.year || "1CS");
    setSpecialite(userObject.specialite || "");
    setCompanyName(userObject.companyName || "");
    setPhone(userObject.phone || "");
    setAddress(userObject.address || "");
    setWebsite(userObject.website || "");
    setAdminLevel(userObject.admin_level || "");
    setPermissions(userObject.permissions || "all");
  }else if (operation ==="createUser" && isOpen) {
    setFirstName("");
    setLastName("");
    setEmail("");
    /* setRole(""); */
    //now the role is set according to the selected tab 
    setPassword("");
    setYear("1CS");
    setSpecialite("");
    setCompanyName("");
    setPhone("");

    setAddress("");
    setWebsite("");
    setAdminLevel("");
    setPermissions("all");
    setErrors({});
    setShowPassword(false);
    
  }
}, [userObject, isOpen]);


  if (!isOpen) return null;

 /*  const validateEmail = (email) => {
    const emailPattern = /^[a-z]+(-[a-z]+)*\.[a-z]+(-[a-z]+)*@[a-z]+(-[a-z]+)?\.[a-z]{2,3}$/;
  return emailPattern.test(email);
  };
 */
  const handleSubmit = (e) => {
    e.preventDefault();

    let newErrors = {};

    if (!firstName.trim()) newErrors.firstName = "First name is required.";
    if (!lastName.trim() && role !== "company") newErrors.lastName = "Last name is required.";
    if (!email.trim()) newErrors.email = "Email is required.";
   /*  if (!validateEmail(email)) newErrors.email = "Invalid email format."; */
    if (!role) newErrors.role = "Please select a role.";
    if (!password.trim()) newErrors.password = "Password is required.";

    setErrors(newErrors);

    if (Object.keys(newErrors).length === 0) {
     /*  alert(
        "💡 Form state:\n" +
          JSON.stringify(
            {
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
            },
            null,
            2
          )
      ); */
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
      if (operation === "editUser") {
        console.log(email);
        handleUpdateUser({
          id: userObject.id,
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
        });
      }
      else if (operation === "createUser") {
      handleCreateUser(userData);
      
    }else{
      alert("Invalid operationcheck for typing errors only 'createUser' or 'updateUser' are accepted");
      
    }
      
    }
  }

  const handleCreateUser = async (userData) => {
    console.log("handlecreateuser email :" ,userData.email)
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
      payload.companyName = userData.firstName;
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

      console.log(" User created:", result);
      setToastMessage("User created successfully!");
      setShowToast(true);
      handleClose();
    } catch (err) {  setFirstName("");

      console.error(" Error:", err.message);
      setToastMessage(err.message || "Something went wrong");
      setShowToast(true);
      handleClose();
    }
  };

  
const handleUpdateUser = async (formData) => {
  console.log("Updating user with ID:", formData.id);
  
  const payload = {
    email: userObject.email, // old email
    newEmail: formData.email, // new email to set that is being set by the text field input (state variable)
    id: formData.id,
    firstname: formData.firstName,
    lastname: formData.lastName,
    username: formData.firstName + " " + formData.lastName,
    
    password: formData.password,
    role: formData.role,
  };

  if (formData.role === "student") {
    payload.year = formData.year;
    if (["2CS", "3CS"].includes(formData.year?.toUpperCase())) {
      payload.specialite = formData.specialite;
    }
  } else if (formData.role === "company") {
    /* payload.companyName = formData.companyName; */
    //i am using the same form for both the firstname and company name just changing the name of the form not the entire form therefore no i used the firstname
    payload.companyName = formData.firstName;
    payload.phone = formData.phone;
    payload.address = formData.address;
  
    payload.website = formData.website;
  } else if (formData.role === "admin") {
    payload.admin_level = formData.admin_level;
    payload.permissions = formData.permissions;
  }

  try {
    const res = await axios.patch('/users/update', payload, {
      headers: {
        'Content-Type': 'application/json',
      },
    });

    console.log(" User Updated:", res.data);
    setToastMessage("User Updated successfully!");
    setShowToast(true);
    handleClose();
  } catch (err) {
    const message = err.response?.data?.message || err.message || "Something went wrong";
    console.error(" Error updating user:", message);
    setToastMessage(message || "Something went wrong");
    setShowToast(true);
    handleClose();
  }
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
              <option value="teacher">Supervisor</option>
              {/* <option value="jury">Jury</option> */}
              <option value="company">Extern</option>
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
