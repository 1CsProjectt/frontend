import React, { useState, useEffect, useRef } from "react";
import Module from "../styles/navbar.module.css";
import searchicon from "../assets/Search.svg";
import filterIcon from "../assets/Filter.svg";
import filterIconup from "../assets/arrow-up.svg";
import filterIcondown from "../assets/arrow-down.svg";
import notfIcon from "../assets/Notifications.svg";
import profilepic from "../assets/profile.svg";
import{io } from "socket.io-client"; // Import Socket.IO client
import axios from "axios";
// Dummy notification data


let notificationCount = 0;

const NavBar = ({
  title,
  targetDate,
  selectedFilters,
  onFilterApply,
  onSearchChange,
  suggestions,
}) => {
  const calculateTimeLeft = () => {
    if (!targetDate || !targetDate.start || !targetDate.end) return null;

    const now = new Date();
    let difference = 0;
    let countdownType = "";

    if (now < targetDate.start) {
      difference = targetDate.start - now;
      countdownType = "to start";
    } else if (now < targetDate.end) {
      difference = targetDate.end - now;
      countdownType = "to end";
    } else {
      difference = 0;
      countdownType = "";
    }

    const days = Math.floor(difference / (1000 * 60 * 60 * 24));
    const hours = Math.floor((difference / (1000 * 60 * 60)) % 24);
    const minutes = Math.floor((difference / (1000 * 60)) % 60);

    return { days, hours, minutes, countdownType };
  };

  const [timeLeft, setTimeLeft] = useState(
    targetDate && targetDate.start && targetDate.end
      ? calculateTimeLeft()
      : null
  );
  const [showNotifications, setShowNotifications] = useState(false);
  const [filterOpen, setFilterOpen] = useState(false);

  // Ref to the main NavBar container
  const containerRef = useRef(null);

  useEffect(() => {
    if (targetDate && targetDate.start && targetDate.end) {
      const timer = setTimeout(() => {
        setTimeLeft(calculateTimeLeft());
      }, 1000);
      return () => clearTimeout(timer);
    }
  }, [targetDate, timeLeft]);

  // Global click handler to close notifications and filter popups if clicked outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        containerRef.current &&
        !containerRef.current.contains(event.target)
      ) {
        setShowNotifications(false);
        setFilterOpen(false);
      }
    };

    document.addEventListener("click", handleClickOutside, true);
    return () => {
      document.removeEventListener("click", handleClickOutside, true);
    };
  }, []);

  const toggleNotifications = (e) => {
    e.stopPropagation();
    setShowNotifications((prev) => !prev);
  };

  const toggleFilterMenu = (e) => {
    e.stopPropagation();
    setFilterOpen((prev) => !prev);
  };

  return (
    <div className={Module["container"]} ref={containerRef}>
      <div className={Module["session"]}>
        <p className={Module["sessionP"]}>
          {!targetDate || targetDate === "" || !timeLeft ? (
            title
          ) : (
            <>
              {title}{" "}
              <span className={Module["countdownStyle"]}>
                {timeLeft.days}d {timeLeft.hours}h {timeLeft.minutes}min{" "}
                {timeLeft.countdownType}
              </span>
            </>
          )}
        </p>
      </div>
      <div className={Module["form"]}>
        <FilterMenu
          onFilterApply={onFilterApply}
          currentFilters={selectedFilters}
          isOpen={filterOpen}
          toggleMenu={toggleFilterMenu}
          selectedFilters={selectedFilters}
        />

        <Searchbar
          onSearchChange={onSearchChange}
          suggestions={suggestions || []}
        />
        <div className={Module["rightside"]}>
<<<<<<< HEAD
          <div className={Module["notf-button"]}>
            <img
              src={notfIcon}
              alt="notf-icon"
              className={Module["notf-icon"]}
            />
          </div>
=======
          {/* Notification Icon with Notification Count */}
<div className={Module["notf-button"]} onClick={toggleNotifications}>
  <img
    src={notfIcon}
    alt="Notification Icon"
    className={Module["notf-icon"]}
  />
  {notificationCount > 0 && (
    <span className={Module["notification-badge"]}>
      {notificationCount}
    </span>
  )}
</div>

>>>>>>> 3f3058e0 (link the creating btn)
          {/* Profile section */}
          <div className={Module["profile"]}>
            <img src={profilepic} alt="Profile" className={Module["pic"]} />
            <p className={Module["profiletext"]}>Profile</p>
            <img
              src={filterIcondown}
              alt="Toggle Profile"
              className={Module["arrow-icon-prfoile"]}
            />
          </div>
        </div>
      </div>
      {/* Notification Panel */}
      {showNotifications && (
        <div className={Module["notification-container"]}>
          <NotificationsContainer />
        </div>
      )}
    </div>
  );
};

const Searchbar = ({ onSearchChange, suggestions }) => {
  const [query, setQuery] = useState("");
  const [filteredSuggestions, setFilteredSuggestions] = useState([]);
  const suggestionsRef = useRef(null);

  const handleInputChange = (event) => {
    const newQuery = event.target.value;
    setQuery(newQuery);
    if (onSearchChange) {
      onSearchChange(newQuery);
    }

    if (newQuery.trim() !== "") {
      const filtered = suggestions.filter(
        (suggestion) =>
          suggestion &&
          suggestion.toLowerCase().includes(newQuery.toLowerCase())
      );
      setFilteredSuggestions(filtered);
    } else {
      setFilteredSuggestions([]);
    }
  };

  const handleSuggestionClick = (suggestion) => {
    setQuery(suggestion);
    if (onSearchChange) {
      onSearchChange(suggestion);
    }
    setFilteredSuggestions([]);
  };

  // Close suggestions when clicking outside the suggestions list
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        suggestionsRef.current &&
        !suggestionsRef.current.contains(event.target)
      ) {
        setFilteredSuggestions([]);
      }
    };

    document.addEventListener("click", handleClickOutside, true);
    return () =>
      document.removeEventListener("click", handleClickOutside, true);
  }, []);

  return (
    <div className={Module["search-bar-container"]}>
      <input
        type="text"
        className={Module["input"]}
        placeholder="Search..."
        value={query}
        onChange={handleInputChange}
      />
      <div className={Module["search-icon"]}>
        <img src={searchicon} alt="Search Icon" />
      </div>
      {filteredSuggestions.length > 0 && (
        <ul
          className={Module["suggestions-list"]}
          ref={suggestionsRef}
          onClick={(e) => e.stopPropagation()} // prevent closing on internal click
        >
          {filteredSuggestions.map((suggestion, index) => (
            <li
              key={index}
              onClick={() => handleSuggestionClick(suggestion)}
              className={Module["suggestion-item"]}
            >
              {suggestion}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

const FilterMenu = ({
  onFilterApply,
  currentFilters,
  isOpen,
  toggleMenu,
  selectedFilters,
}) => {
  const [activeTab, setActiveTab] = useState("Speciality");
  const [localFilters, setLocalFilters] = useState({
    Speciality: currentFilters || [],
    Other: [],
  });

  const specialityOptions = ["ISI", "SIW", "IASD"];
  const otherOptions = ["Other Option 1", "Other Option 2"];

  const handleCheckboxChange = (event, tab) => {
    const { value, checked } = event.target;
    setLocalFilters((prev) => {
      const newSelections = checked
        ? [...prev[tab], value]
        : prev[tab].filter((item) => item !== value);
      return { ...prev, [tab]: newSelections };
    });
  };

  const handleTabChange = (tab) => {
    setActiveTab(tab);
  };

  const handleApply = (e) => {
    e.stopPropagation();
    if (onFilterApply) {
      onFilterApply(localFilters[activeTab]);
    }
    toggleMenu(e);
  };

  const handleCancel = (e) => {
    e.stopPropagation();
    setLocalFilters((prev) => ({
      ...prev,
      [activeTab]: currentFilters || [],
    }));
    toggleMenu(e);
  };

  return (
    <div className={Module["filter"]}>
      <button className={Module["filter-button"]} onClick={toggleMenu}>
        <img src={filterIcon} alt="Filter" className={Module["custom-icon"]} />
        <p className={Module["filtertext"]}>Filter</p>
        <img
          src={isOpen ? filterIconup : filterIcondown}
          alt="Toggle"
          className={Module["arrow-icon"]}
        />
      </button>
      {isOpen && selectedFilters && (
        <div
          className={Module["filter-popup"]}
          onClick={(e) => e.stopPropagation()} // prevent click propagation
        >
          <div className={Module["filter-content"]}>
            <div className={Module["filter-options"]}>
              <p
                className={
                  activeTab === "Speciality"
                    ? Module["tab-active"]
                    : Module["tab-inactive"]
                }
                onClick={() => handleTabChange("Speciality")}
              >
                Speciality
              </p>
              <p
                className={
                  activeTab === "Other"
                    ? Module["tab-active"]
                    : Module["tab-inactive"]
                }
                onClick={() => handleTabChange("Other")}
              >
                Other
              </p>
            </div>
            <div className={Module["filter-categories"]}>
              <p className={Module["filter-header"]}>
                {activeTab === "Speciality"
                  ? "show only"
                  : "Select Other Options"}
              </p>
              {(activeTab === "Specialitys"
                ? specialityOptions
                : otherOptions
              ).map((option) => (
                <label key={option} className={Module["option-label"]}>
                  <input
                    type="checkbox"
                    value={option}
                    checked={localFilters[activeTab].includes(option)}
                    onChange={(e) => handleCheckboxChange(e, activeTab)}
                  />
                  <span className={Module["optionstext"]}>{option}</span>
                </label>
              ))}
            </div>
          </div>
          <div className={Module["filter-buttons"]}>
            <button className={Module["cancel-btn"]} onClick={handleCancel}>
              Cancel
            </button>
            <button className={Module["apply-btn"]} onClick={handleApply}>
              Apply
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

const NotificationPanel = ({ notifications }) => {
  const handleAccept = (notificationId) => {
    console.log("Accepted invitation with ID:", notificationId);
    // Additional logic (API calls, etc.) can be placed here.
  };

  const handleDecline = (notificationId) => {
    console.log("Declined invitation with ID:", notificationId);
    // Additional logic (API calls, etc.) can be placed here.
  };

  return (
    <div className={Module["notification-panel"]}>
      <div className={Module["notification-header"]}>
        <h3>Notifications</h3>
        <button className={Module["mark-read-btn"]}>Mark all as read</button>
      </div>
      {notifications.map((notification) => (
        <div key={notification.id} className={Module["notification-item"]}>
          <div className={Module["notification-content"]}>
            <p className={Module["notification-title"]}>{notification.title}</p>
            <p className={Module["notification-message"]}>
              {notification.message}
            </p>
            {notification.type === "invitation" && (
              <div className={Module["invitation-actions"]}>
                <button
                  className={Module["accept-btn"]}
                  onClick={() => handleAccept(notification.id)}
                >
                  Accept
                </button>
                <button
                  className={Module["decline-btn"]}
                  onClick={() => handleDecline(notification.id)}
                >
                  Decline
                </button>
              </div>
            )}
          </div>

          {/* Invitation buttons (if "invitation" type) */}
          {notification.type === "invitation" && (
            <div className={Module["notification-lower"]}>
              <button
                className={Module["decline-btn-notification"]}
                onClick={() => handleDecline(notification.id)}
              >
                Decline
              </button>
              <button
                className={Module["accept-btn-notification"]}
                onClick={() => handleAccept(notification.id)}
              >
                Accept
              </button>
            </div>
          )}
        </div>
      ))}
    </div>
  );
};
const NotificationsContainer = () => {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const socket = io("http://localhost:3000"); 

    socket.on("receive-notification", (data) => {
      setNotifications((prevNotifications) => [data, ...prevNotifications]);
    });

    return () => {
      socket.disconnect();
    };
  }, []);

  useEffect(() => {
    const fetchNotifications = async () => {
      try {
        const response = await axios.get("http://localhost:5000/api/notifications");
        setNotifications(response.data);
      } catch (err) {
        setError(err.message);
        console.error("Error fetching notifications:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchNotifications();
  }, []);

  // Update the global notification count if applicable
  // (It looks like notificationCount is a global variable you are using.)
  notificationCount = notifications.length;

  if (loading) return <div>Loading notifications...</div>;
  if (error) return <div>Error: {error}</div>;

  return <NotificationPanel notifications={notifications} />;
};

export default NavBar;
