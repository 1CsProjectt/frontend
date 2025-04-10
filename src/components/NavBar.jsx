import React, { useState, useEffect } from "react";
import Module from "../styles/navbar.module.css";
import searchicon from "../assets/Search.svg";
import filterIcon from "../assets/Filter.svg";
import filterIconup from "../assets/arrow-up.svg";
import filterIcondown from "../assets/arrow-down.svg";
import notfIcon from "../assets/Notifications.svg";
import profilepic from "../assets/profile.svg";

// Dummy notification data
const notificationsData = [
  {
    id: 1,
    title: "New Message",
    message: "You have received a new message.",
    time: "2 mins ago",
  },
  {
    id: 2,
    title: "Server Alert",
    message: "Your server is running low on space.",
    time: "10 mins ago",
  },
];

const NavBar = ({
  title,
  targetDate,
  selectedFilters,
  onFilterApply,
  onSearchChange,
  suggestions,
}) => {
  // Countdown timer function only active if targetDate is provided
  const calculateTimeLeft = () => {
    const now = new Date();
    const difference = new Date(targetDate) - now;
    let timeLeft = {};
    if (difference > 0) {
      timeLeft = {
        days: Math.floor(difference / (1000 * 60 * 60 * 24)),
        hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
        minutes: Math.floor((difference / (1000 * 60)) % 60),
      };
    } else {
      timeLeft = { days: 0, hours: 0, minutes: 0 };
    }
    return timeLeft;
  };

  const [timeLeft, setTimeLeft] = useState(
    targetDate && targetDate !== "" ? calculateTimeLeft() : null
  );
  const [showNotifications, setShowNotifications] = useState(false);

  useEffect(() => {
    if (targetDate && targetDate !== "") {
      const timer = setTimeout(() => {
        setTimeLeft(calculateTimeLeft());
      }, 1000);
      return () => clearTimeout(timer);
    }
  }, [targetDate, timeLeft]);

  const toggleNotifications = () => {
    setShowNotifications((prev) => !prev);
  };

  return (
    <div className={Module["container"]}>
      <div className={Module["session"]}>
        <p className={Module["sessionP"]}>
          {(!targetDate || targetDate === "") ? (
            title
          ) : (
            <>
              {title}{" "}
              <span className={Module["countdownStyle"]}>
                {timeLeft.days}d {timeLeft.hours}h {timeLeft.minutes}min to end
              </span>
            </>
          )}
        </p>
      </div>
      <div className={Module["form"]}>
        <FilterMenu
          onFilterApply={onFilterApply}
          currentFilters={selectedFilters}
        />
        <Searchbar onSearchChange={onSearchChange} suggestions={suggestions || []} />
        <div className={Module["rightside"]}>
          {/* Notification Icon */}
          <div className={Module["notf-button"]} onClick={toggleNotifications}>
            <img
              src={notfIcon}
              alt="Notification Icon"
              className={Module["notf-icon"]}
            />
          </div>
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
          <NotificationPanel notifications={notificationsData} />
        </div>
      )}
    </div>
  );
};

const Searchbar = ({ onSearchChange, suggestions }) => {
  const [query, setQuery] = useState("");
  const [filteredSuggestions, setFilteredSuggestions] = useState([]);

  const handleInputChange = (event) => {
    const newQuery = event.target.value;
    setQuery(newQuery);
    if (onSearchChange) {
      onSearchChange(newQuery);
    }

    if (newQuery.trim() !== "") {
      // Filter suggestions and safely check for null or undefined values
      const filtered = suggestions.filter((suggestion) =>
        suggestion && suggestion.toLowerCase().includes(newQuery.toLowerCase())
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
        <ul className={Module["suggestions-list"]}>
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

const FilterMenu = ({ onFilterApply, currentFilters }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [activeTab, setActiveTab] = useState("Speciality");
  const [localFilters, setLocalFilters] = useState({
    Speciality: currentFilters || [],
    Other: [],
  });

  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

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

  const handleApply = () => {
    if (onFilterApply) {
      onFilterApply(localFilters[activeTab]);
    }
    setIsOpen(false);
  };

  const handleCancel = () => {
    setLocalFilters((prev) => ({
      ...prev,
      [activeTab]: currentFilters || [],
    }));
    setIsOpen(false);
  };

  return (
    <div className={Module["filter"]}>
      <button className={Module["filter-button"]} onClick={toggleMenu}>
        <img src={filterIcon} alt="Filter" className={Module["custom-icon"]} />
        <p>Filter</p>
        <img
          src={isOpen ? filterIconup : filterIcondown}
          alt="Toggle"
          className={Module["arrow-icon"]}
        />
      </button>
      {isOpen && (
        <div className={Module["filter-popup"]}>
       
          <div className={Module["filter-content"]}>
          
            <div className={Module["filter-tabs"]}>
              <div className={Module["filter-header"]}>Filters Type</div>
             
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
              {(activeTab === "Speciality" ? specialityOptions : otherOptions).map(
                (option) => (
                  <label key={option} className={Module["option-label"]}>
                    <input
                      type="checkbox"
                      value={option}
                      checked={localFilters[activeTab].includes(option)}
                      onChange={(e) => handleCheckboxChange(e, activeTab)}
                    />
                    <span className={Module["optionstext"]}>{option}</span>
                  </label>
                )
              )}
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
  return (
    <div className={Module["notification-panel"]}>
      <div className={Module["notification-header"]}>
        <h3>Notifications</h3>
        <button className={Module["mark-read-btn"]}>Mark all as read</button>
      </div>
      {notifications.map((notification) => (
        <div key={notification.id} className={Module["notification-item"]}>
          <div className={Module["notification-content"]}>
            <p className={Module["notification-title"]}>
              {notification.title}
            </p>
            <p className={Module["notification-message"]}>
              {notification.message}
            </p>
          </div>
          <p className={Module["notification-time"]}>{notification.time}</p>
        </div>
      ))}
    </div>
  );
};

export default NavBar;
