import React, { useState ,useEffect,useMemo} from "react";

import classes from "../styles/UserManagementTabs.module.css";
import UserFormModal from "./modals/UserFormModal.jsx";
import DeleteUserModal from "./modals/DeleteUserModal.jsx";
import NavBar from "./NavBar.jsx";
import axios from "axios";
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
  const usersPerPage = 7;


  // Tabs for different user types
  const tabs = ["Students", "Supervisors", "Enterprises", "Admins"];
  


  const [fetchedUsers, setFetchedUsers] = useState([]);

  

useEffect(() => {
 
    const fetchUsers = async () => {
        try {
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
        } catch (error) {
            console.error('Error fetching users:', error);
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
    {displayedUsers.map((user, index) => (
      <tr key={index}>
        <td>{user.username || "No Username"}</td> {/* Changed from name to username */}
        <td>{user.email || "No Email"}</td>
        <td>{user.createdAt || "Unknown Date"}</td> {/* Ensure date exists in your fetched data */}
        <td className={user.status === "active" ? classes["status-active"] : classes["status-inactive"]}>
          {user.status || "Inactive"} {/* Ensure status exists or default to "Inactive" */}
        </td>
        <td>
          <button onClick={() => {setUserToEdit(user);
          setOperation("editUser");
          setUserFormModalOpen(true);}} 
            className={classes["edit-btn"]}>Edit
            </button>
          
          <button className={classes["delete-btn"]}  onClick={() => {
    setUserToDelete(user); // this sets the current user (we want the full info therefore we pass the whole object to get the name)
    setDeleteUserModalOpen(true); // then open the modal c
 
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
      <div className={classes["pagination"]}>
        <p>Page {currentPage} out of {totalPages}</p>
        <button disabled={currentPage === 1} onClick={() => handlePageChange(currentPage - 1)}>Previous</button>
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
        <button disabled={currentPage === totalPages} onClick={() => handlePageChange(currentPage + 1)}>Next</button>
      </div>
      </div>
      <UserFormModal isOpen={isUserFormModalOpen} onClose={() => setUserFormModalOpen(false)} userObject={userToEdit} operation={operation} userManagementActiveTab={activeTab}/>
      <DeleteUserModal isOpen={isDeleteUserModalOpen} onClose={() => setDeleteUserModalOpen(false)} entityType="User" userToDelete={userToDelete} />
    </div>
    
    
  );
};

export default UserManagementTabs;