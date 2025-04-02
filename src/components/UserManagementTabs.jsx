import React, { useState } from "react";
import classes from "../styles/UserManagementTabs.module.css";
import UserFormModal from "./modals/UserFormModal.jsx";
import DeleteUserModal from "./modals/DeleteUserModal.jsx";
import NavBar from "./NavBar.jsx";

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
  const usersPerPage = 8;

  // Tabs for different user types
  const tabs = ["Students", "Supervisors", "Enterprises", "Jury"];
  
  // Dummy data for users in different categories
  const allUsers = {
    Students: Array(100).fill({ name: "Extra Student", email: "extra@esi-sba.dz", date: "Feb 15, 2021", status: "active" }), 
    Supervisors: [],
    Enterprises: [],
    Jury: [],
  };

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
    <div className={classes["users-management"]}>
      <NavBar />
      <div className={classes["header"]}>
        <h2>Users Management</h2>
        <button onClick={() => setUserFormModalOpen(true)} className={classes["add-btn"]}>Add a user account</button>
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

      <table>
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
              <td>{user.name}</td>
              <td>{user.email}</td>
              <td>{user.date}</td>
              <td className={user.status === "active" ? classes["status-active"] : classes["status-inactive"]}>{user.status}</td>
              <td>
                <button onClick={() => setUserFormModalOpen(true)} className={classes["edit-btn"]}>Edit</button>
                <UserFormModal isOpen={isUserFormModalOpen} onClose={() => setUserFormModalOpen(false)} />
                <button onClick={() => setDeleteUserModalOpen(true)} className={classes["delete-btn"]}>Delete</button>
                <DeleteUserModal isOpen={isDeleteUserModalOpen} onClose={() => setDeleteUserModalOpen(false)} />
              </td>
            </tr>
          ))}
        </tbody>
      </table>
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
    </div>
  );
};

export default UserManagementTabs;