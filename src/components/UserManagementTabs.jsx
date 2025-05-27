import React, { useState, useEffect, useMemo } from "react";
import classes from "../styles/UserManagementTabs.module.css";
import UserFormModal from "./modals/UserFormModal.jsx";
import DeleteUserModal from "./modals/DeleteUserModal.jsx";
import NavBar from "./NavBar.jsx";
import axios from "axios";
import alertIcon from "../assets/alert-icon.svg";
import errorIcon from "../assets/error-icon.svg";
import { useNavigate } from "react-router-dom";
import { PulseLoader } from "react-spinners";
import Toast from "../components/modals/Toast";

const UserManagementTabs = () => {
  // Modal state
  const [isUserFormModalOpen, setUserFormModalOpen] = useState(false);
  const [isDeleteUserModalOpen, setDeleteUserModalOpen] = useState(false);
  const [selectedFilters, setSelectedFilters] = useState({
      Grade: ["1CS", "2CS", "3CS", "2CP"],
      Speciality: ["ISI", "SIW", "IASD"],
      Other: [],
    });
  // Which tab is active?
  const [activeTab, setActiveTab] = useState(() => {
    return localStorage.getItem("activeTab") || "Students";
  });

  // Pagination
  const usersPerPage = 7;
  const [currentPage, setCurrentPage] = useState(1);
  const [customPageInput, setCustomPageInput] = useState("");
  const [showPageInput, setShowPageInput] = useState(false);

  // Which user to edit / delete
  const [userToEdit, setUserToEdit] = useState(null);
  const [userToDelete, setUserToDelete] = useState(null);
  const [operation, setOperation] = useState("");

  // Search query from NavBar
  const [searchQuery, setSearchQuery] = useState("");

  // Data-fetching state
  const [fetchedUsers, setFetchedUsers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [connectionError, setConnectionError] = useState(false);

  const navigate = useNavigate();
  const [toastMessage, setToastMessage] = useState("");
  const [showToast, setShowToast] = useState(false);
   // Called when NavBar’s filter is applied
   const handleFilterApply = (filters) => {
    setSelectedFilters(filters || { Grade: [], Speciality: [], Other: [] });
    setCurrentPage(1);
  };
  
  useEffect(() => {
    localStorage.setItem("activeTab", activeTab);
  }, [activeTab]);
  //  Fetch all users once
  const fetchUsers = async () => {
    try {
      setLoading(true);
      const response = await axios.get("/users/get-all", { withCredentials: true });
      console.log("Fetched users: !!!!!!!!", response.data);
      const usersArray = response.data.map((user) => ({
        id: user.id,
        email: user.email,
        username: user.username,
        role: user.role,
        createdAt: user.createdAt,
         // Safely pull student data only if it exists:
        student: user.student
        ? {
            firstname: user.student.firstname,
            lastname:  user.student.lastname,
            year:      user.student.year,
            specialite:user.student.specialite,
          }
        : null,
      }));
      setFetchedUsers(usersArray);
    } catch (error) {
      console.error("Error fetching users:", error);
      setConnectionError(true);
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => {
    fetchUsers();
  }, []);
  
  
  // Split fetchedUsers into role-based buckets
  const allUsers = useMemo(() => {
    return {
      Students: fetchedUsers.filter((u) => u.role === "student"),
      Supervisors: fetchedUsers.filter((u) => u.role === "teacher"),
      Externs: fetchedUsers.filter((u) => u.role === "extern"),
      Admins: fetchedUsers.filter((u) => u.role === "admin"),
    };
  }, [fetchedUsers]);

  //  Pick out the array for the active tab
  const usersInThisTab = allUsers[activeTab] || [];

  //  Filter by searchQuery (username OR email)
  const filteredUsers = useMemo(() => {
    if (!searchQuery.trim()) return usersInThisTab;

    const q = searchQuery.toLowerCase();
    return usersInThisTab.filter(
      (u) =>
        u.username?.toLowerCase().includes(q) ||
        u.email.toLowerCase().includes(q)
    );
  }, [searchQuery, usersInThisTab]);

  //  Calculate pagination over filteredUsers
  const totalPages = Math.ceil(filteredUsers.length / usersPerPage);
  const startIndex = (currentPage - 1) * usersPerPage;
  const displayedUsers = filteredUsers.slice(startIndex, startIndex + usersPerPage);

  // When searchQuery changes, reset to page 1
  useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery, activeTab]);

  // Handler when NavBar’s search input changes
  const handleSearchChange = (query) => {
    setSearchQuery(query);
  };

  // Page controls
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
    <div className={classes["main-container"]}>
      <NavBar
        title=""
        targetDate={null}
        onSearchChange={handleSearchChange}
        suggestions={usersInThisTab.map((u) => u.username)}
      />

      <div className={classes["header"]}>
        <h1>Users Management</h1>
        <button
          onClick={() => {
            setOperation("createUser");
            setUserFormModalOpen(true);
          }}
          className={classes["add-btn"]}
        >
          Add a User
        </button>
      </div>

      <div className={classes["tabs"]}>
        {["Students", "Supervisors", "Externs", "Admins"].map((tabName) => (
          <button
            key={tabName}
            className={activeTab === tabName ? classes["active"] : ""}
            onClick={() => {
              setActiveTab(tabName);
              setCurrentPage(1);
              setSearchQuery(""); // Clear search when switching tabs
            }}
          >
            {tabName}
          </button>
        ))}
      </div>


      {loading ? ( 
        
        <div className={classes["loaderContainer"]}>
          <div className={classes["loader"]}>
            <PulseLoader color="#077fd4" loading={loading} size={25} />
          </div>
        </div>)

      :  connectionError ? (
        <div className={classes["alertDiv"]}>
                    <img src={errorIcon} alt="Error Icon" />
                    <h3>Error connecting to the server</h3>
                  </div>
      ) : displayedUsers.length === 0 ? (
        <div className={classes["alertDiv"]}>
                    <img src={alertIcon} alt="Alert Icon" />
                    <h3>
                      No Users were found . click Add a User to create new users
                    </h3>
                  </div>
      ) : (

    
      <div className={classes["table-container"]}>
        <table className={classes["main-table"]}>
          <thead>
            <tr>
              <th>Full Name</th>
              <th>Email Address</th>
              {/* Add these two headers only for Students */}
              {activeTab === "Students" && (
                <>
                  <th>Year</th>
                  <th>Speciality</th>
                </>
              )}
              <th>Date Added</th>
              <th className={classes["last-column"]}></th>
            </tr>
          </thead>
          <tbody>
              
              {displayedUsers.map((user, idx) => (
                <tr key={idx} style={{ height: "60px", maxHeight: "60px" }}>
                  <td>{user.username || "No Username"}</td>
                  <td>{user.email || "No Email"}</td>
                      {/* Add these two cells only for Students */}
                    {activeTab === "Students" && (
                      <>
                        <td>{user.student.year || "-"}</td>
                        <td>{user.student.specialite || "-"}</td>
                      </>
                    )}

                  <td>{user.createdAt || "Unknown Date"}</td>
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
      </div> )}

      <div className={classes["pagination-container"]}>
        <button
          disabled={currentPage === 1}
          onClick={() => handlePageChange(currentPage - 1)}
        >
          Previous
        </button>

        <div className={classes["pagination"]}>
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
                min="1"
                max={totalPages}
              />
              <button onClick={handleCustomPageSubmit}>Go</button>
            </div>
          )}
        </div>

        <button
          disabled={currentPage === totalPages}
          onClick={() => handlePageChange(currentPage + 1)}
        >
          Next
        </button>
      </div>

        <UserFormModal
        isOpen={isUserFormModalOpen}
        onClose={() => setUserFormModalOpen(false)}
        userObject={userToEdit}
        operation={operation}
        userManagementActiveTab={activeTab}
        setShowToast={setShowToast}
        setToastMessage={setToastMessage}
        onSuccess={fetchUsers}
      />
     
     <DeleteUserModal
        isOpen={isDeleteUserModalOpen}
        onClose={() => setDeleteUserModalOpen(false)}
        entityType="User"
        userToDelete={userToDelete}
      />

    {showToast && (
          <Toast
            message={toastMessage || "Test Toast"}
            onClose={() => setShowToast(false)}
          />
        )}
    </div>
  );
};

export default UserManagementTabs;
