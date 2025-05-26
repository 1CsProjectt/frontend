import React, { useState ,useEffect,useMemo} from "react";

import classes from "../styles/UserManagementTabs.module.css";
import UserFormModal from "./modals/UserFormModal.jsx";
import DeleteUserModal from "./modals/DeleteUserModal.jsx";
import NavBar from "./NavBar.jsx";
import axios from "axios";
import alertIcon from "../assets/alert-icon.svg";
import errorIcon from "../assets/error-icon.svg";
import { useNavigate } from "react-router-dom";

import { PulseLoader } from "react-spinners"; // Import the spinner you want to use
// A modal blocks interactions with the webpage unless specified otherwise.
// It usually appears in the middle of the screen to show a message or request input.
const UserManagementTabs = () => {
  // By default, all modals are closed (false state)
  const [isUserFormModalOpen, setUserFormModalOpen] = useState(false);
  const [isDeleteUserModalOpen, setDeleteUserModalOpen] = useState(false);
  const [activeTab, setActiveTab] = useState("Students");
  const [currentPage, setCurrentPage] = useState(1);
  const [customPageInput, setCustomPageInput] = useState("");
  const [showPageInput, setShowPageInput] = useState(false);
  const [userToDelete, setUserToDelete] = useState(null);
  const [userToEdit, setUserToEdit] = useState(null);
  const [operation, setOperation] = useState("");
    const [loading, setLoading] = useState(false);
    const [connectionError, setConnectionError] = useState(false); // State to handle connection error
  const usersPerPage = 7;


  // Tabs for different user types
  const tabs = ["Students", "Supervisors", "Enterprises", "Admins"];
  


  const [fetchedUsers, setFetchedUsers] = useState([]);

  

useEffect(() => {
 
    const fetchUsers = async () => {
        try {
          setLoading(true);
            const response = await axios.get('/users/get-all'); // Adjust baseURL in Axios config if needed

            const usersArray = response.data.map(user => ({
                id: user.id,
                email: user.email,
                username: user.username,
                role: user.role,
                password: user.password,
                resetToken: user.resetToken,
                resetTokenExpiry: user.resetTokenExpiry,
                passwordChangedAt: user.passwordChangedAt,
                createdAt: user.createdAt, 
                updatedAt: user.updatedAt,
            }));

            setFetchedUsers(usersArray);
            console.log(usersArray);
            setLoading(false);
        } catch (error) {
            console.error('Error fetching users:', error);
            setConnectionError(true);
            setLoading(false);
        }
    };

    fetchUsers();
}, []);


    /*
  
  const allUsers = {
   // Students: Array(100).fill({ name: "Extra Student", email: "extra@esi-sba.dz", date: "Feb 15, 2021", status: "active" }), 
    Students:[],
   Supervisors: [],
    Enterprises: [],
    Jury: [],
  };

  */

  //ideally this should be implemented in the backend but this is just a temporary solution
  var allUsers = useMemo(() => {
    return {
      Students: fetchedUsers.filter(user => user.role === "student"),
      Supervisors: fetchedUsers.filter(user => user.role === "teacher"),
      Enterprises: fetchedUsers.filter(user => user.role === "company"),
      Admins: fetchedUsers.filter(user => user.role === "admin"),
    };
  }, [fetchedUsers]);

  

  console.log(allUsers);

  

  const users = allUsers[activeTab] || [];
  const totalPages = Math.ceil(users.length / usersPerPage);
  const startIndex = (currentPage - 1) * usersPerPage;
  const displayedUsers = users.slice(startIndex, startIndex + usersPerPage);

  // Handles page change with validation
  const handlePageChange = (page) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
    }
  };

  // Handles manual page input navigation
  const handleCustomPageSubmit = () => {
    const page = parseInt(customPageInput, 10);
    if (!isNaN(page) && page >= 1 && page <= totalPages) {
      setCurrentPage(page);
      setShowPageInput(false);
      setCustomPageInput("");
    }
  };

  

  return (
    <div className={classes["main-container"]}>
  
      <NavBar />
    
   
      <div className={classes["header"]}>
        <h1>Users Management</h1>
        <button onClick={() => { setOperation("createUser"); setUserFormModalOpen(true); }} className={classes["add-btn"]}>Add a User</button>
        
      </div>
      <div className={classes["tabs"]}>
        {tabs.map((tab) => (
          <button
            key={tab}
            className={activeTab === tab ? classes["active"] : ""}
            onClick={() => {
              setActiveTab(tab);
              setCurrentPage(1);
            }}
          >
            {tab}
          </button>
        ))}
      </div>
        <div className={classes["table-container"]}>     
           <table className={classes["main-table"]}>
                <thead>
                  <tr>
                    <th>Full Name</th>
                    <th>Email Address</th>
                    <th>Date Added</th>
                    <th>Status</th>
                    <th className={classes["last-column"]}></th>
                  </tr>
                </thead>
                <tbody>
                {loading ? (
                  <tr>
                    <td colSpan="5">
                      <div className={classes.loaderContainer}>
                        <div className={classes.loader}>
                          <PulseLoader color="#077fd4" loading={loading} size={20} />
                        </div>
                      </div>
                    </td>
                  </tr>
                ) : connectionError ? (
                  <tr>
                    <td colSpan="5">
                      <div className={classes.alertDiv}>
                        <img src={errorIcon} alt="Error Icon" />
                        <h3>Error connecting to the server</h3>
                      </div>
                    </td>
                  </tr>
                ) : displayedUsers.length === 0 ? (
                  <tr>
                    <td colSpan="5">
                      <div className={classes.alertDiv}>
                        <img src={alertIcon} alt="Alert Icon" />
                        <h3>
                          No users were found, please create new ones or check again to see
                          if new users are added
                        </h3>
                      </div>
                    </td>
                  </tr>
                ) : displayedUsers.map((user, index) => ( 
                  <tr  style={{ height: "60px", maxHeight: "60px", minHeight: "60px" }} key={index}>
                    <td > {user.username || "No Username"}</td>
                    <td >{user.email || "No Email"}</td>
                    <td >{user.createdAt || "Unknown Date"}</td>
                    <td 
                      /* className={
                        user.status === "active"
                          ? classes["status-active"]
                          : classes["status-inactive"]
                      } */
                    >
                      {user.status || "Inactive"}
                    </td>
                    <td className={classes["max-cell-height"]}>
                      <button
                        onClick={() => {
                          setUserToEdit(user);
                          setOperation("editUser");
                          setUserFormModalOpen(true);
                        }}
                        className={classes["edit-btn"]}
                      >
                        Edit
                      </button>
                      <button
                        className={classes["delete-btn"]}
                        onClick={() => {
                          setUserToDelete(user);
                          setDeleteUserModalOpen(true);
                        }}
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>

              </table>
              </div>

      <div className={classes["pagination-container"]}>

      <button disabled={currentPage === 1} onClick={() => handlePageChange(currentPage - 1)}>Previous</button>
        
      <div className={classes["pagination"]}>
       {/*  <p>{currentPage}/{totalPages}</p> */}
  
        {totalPages <= 10 ? (
          [...Array(totalPages)].map((_, i) => (
            <button 
              key={i + 1} 
              className={currentPage === i + 1 ? classes["active"] : ""} 
              onClick={() => handlePageChange(i + 1)}
            >
              {i + 1}
            </button>
          ))
        ) : (
          <>
            {[...Array(3)].map((_, i) => (
              <button 
                key={i + 1} 
                className={currentPage === i + 1 ? classes["active"] : ""} 
                onClick={() => handlePageChange(i + 1)}
              >
                {i + 1}
              </button>
            ))}
            <button onClick={() => setShowPageInput(true)}>...</button>
            <button 
              key={totalPages} 
              className={currentPage === totalPages ? classes["active"] : ""} 
              onClick={() => handlePageChange(totalPages)}
            >
              {totalPages}
            </button>
          </>
        )}
        {showPageInput && (
          <div className={classes["page-input"]}>
            <input 
              type="number" 
              value={customPageInput} 
              onChange={(e) => setCustomPageInput(e.target.value)} 
              min="1" max={totalPages} 
            />
            <button onClick={handleCustomPageSubmit}>Go</button>
          </div>
        )}

      </div>
      <button disabled={currentPage === totalPages} onClick={() => handlePageChange(currentPage + 1)}>Next</button>
      </div>
      <UserFormModal isOpen={isUserFormModalOpen} onClose={() => setUserFormModalOpen(false)} userObject={userToEdit} operation={operation} userManagementActiveTab={activeTab}/>
      <DeleteUserModal isOpen={isDeleteUserModalOpen} onClose={() => setDeleteUserModalOpen(false)} entityType="User" userToDelete={userToDelete} />
    </div>
    
    
  );
};

export default UserManagementTabs;