
import React, { useState } from "react";
import "../styles/UserManagementTabs.css";
import UserFormModal from "./modals/UserFormModal.jsx";
import DeleteUserModal from "./modals/DeleteUserModal.jsx";
import NavBar from "./NavBar.jsx";

// a model blocks interactions with the web page unlike popups (unless you specify otherwise)
// a model is a window that pops up in the middle of the screen usally to show a message or ask for input
const UserManagementTabs = () => {
  //by default all modals are closed (false state)
  const [isUserFormModalOpen, setUserFormModalOpen] = useState(false);
  const [isDeleteUserModalOpen, setDeleteUserModalOpen] = useState(false);
  const [activeTab, setActiveTab] = useState("Students");
  const [currentPage, setCurrentPage] = useState(1);
  const [customPageInput, setCustomPageInput] = useState("");
  const [showPageInput, setShowPageInput] = useState(false);
  const usersPerPage = 8;

  const tabs = ["Students", "Supervisors", "Enterprises", "Jury"];
  
  const allUsers = {
     /*Students: [
      { name: "Ahmed bin Khaled", email: "a.benkhaled@esi-sba.dz", date: "March 17, 2025", status: "active" },
      { name: "Sara Mahmoud Al-Ali", email: "s.alali@esi-sba.dz", date: "July 4, 2023", status: "active" },
      { name: "Youssef Abdelrahman Nasser", email: "y.nasser@esi-sba.dz", date: "Dec 25, 2020", status: "inactive" },
      { name: "Laila Hassan Al-Kilani", email: "l.alkilani@esi-sba.dz", date: "May 1, 2022", status: "active" },
      { name: "Khaled Omar Al-Saeed", email: "k.alsaee@esi-sba.dz", date: "Sept 15, 2019", status: "inactive" },
      { name: "Nour Eddine Zakaria Mansour", email: "n.zmansour@esi-sba.dz", date: "Jan 10, 2024", status: "active" },
      { name: "Fatima Zahra Badr Eddine", email: "f.beddine@esi-sba.dz", date: "Aug 30, 2018", status: "inactive" },
      { name: "Ali Karim Al-Hassan", email: "a.alhassan@esi-sba.dz", date: "June 21, 2016", status: "inactive" },], */  
       Students: Array(100).fill({ name: "Extra Student", email: "extra@esi-sba.dz", date: "Feb 15, 2021", status: "active" }), 
    Supervisors: [],
    Enterprises: [],
    Jury: [],
  };

  const users = allUsers[activeTab] || [];
  const totalPages = Math.ceil(users.length / usersPerPage);
  const startIndex = (currentPage - 1) * usersPerPage;
  const displayedUsers = users.slice(startIndex, startIndex + usersPerPage);

  const handlePageChange = (page) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
    }
  };

  const handleCustomPageSubmit = () => {
    const page = parseInt(customPageInput, 10);
    if (!isNaN(page) && page >= 1 && page <= totalPages) {
      setCurrentPage(page);
      setShowPageInput(false);
      setCustomPageInput("");
    }
  };

  return (
    
    <div className="users-management">
      <NavBar />
      <div className="header">
      <h2>Users Management</h2>
      <button onClick={() => setUserFormModalOpen(true)} className="add-btn">Add a user account</button>
      </div>
      <div className="tabs">
        {tabs.map((tab) => (
          <button
            key={tab}
            className={activeTab === tab ? "active" : ""}
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
            <th className="last-column"></th>
          </tr>
        </thead>
        <tbody>
          {displayedUsers.map((user, index) => (
            <tr key={index}>
              <td>{user.name}</td>
              <td>{user.email}</td>
              <td>{user.date}</td>
              <td className={user.status === "active" ? "status-active" : "status-inactive"}>{user.status}</td>
              <td>
                <button onClick={() => setUserFormModalOpen(true)} className="edit-btn">Edit</button>
                <UserFormModal isOpen={isUserFormModalOpen} onClose={() => setUserFormModalOpen(false)} />
                <button onClick={() => setDeleteUserModalOpen(true)} className="delete-btn">Delete</button>
                <DeleteUserModal isOpen={isDeleteUserModalOpen} onClose={() => setDeleteUserModalOpen(false)} />
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      <div className="pagination">
      <p>Page {currentPage} out of {totalPages}</p>
        <button disabled={currentPage === 1} onClick={() => handlePageChange(currentPage - 1)}>Previous</button>
        {totalPages <= 10 ? (
          [...Array(totalPages)].map((_, i) => (
            <button 
              key={i + 1} 
              className={currentPage === i + 1 ? "active" : ""} 
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
                className={currentPage === i + 1 ? "active" : ""} 
                onClick={() => handlePageChange(i + 1)}
              >
                {i + 1}
              </button>
            ))}
            <button onClick={() => setShowPageInput(true)}>...</button>
            <button 
              key={totalPages} 
              className={currentPage === totalPages ? "active" : ""} 
              onClick={() => handlePageChange(totalPages)}
            >
              {totalPages}
            </button>
          </>
        )}
        {showPageInput && (
          <div className="page-input">
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
  );
};

export default UserManagementTabs;
