import Module from "../styles/navbar.module.css";
import searchicon from "../assets/Search.svg";
import React, { useState, useEffect } from "react";
import filterIcon from "../assets/Filter.svg";
import filterIconup from "../assets/arrow-up.svg";
import filterIcondown from "../assets/arrow-down.svg";
import notfIcon from "../assets/Notifications.svg";
import profilepic from "../assets/profile.svg";

/* the nav bar called like that 
NavBar = ({ title, targetDate }) if you want to use the countdown timer
NavBar = ({ title }) if you don't want to use the countdown timer

the same for other just let them empty if you don't want to use them
*/
const NavBar = ({ title, targetDate, selectedFilters, onFilterApply, onSearchChange, suggestions }) => {
  
  const calculateTimeLeft = () => {
    const now = new Date();
    const difference = new Date(targetDate) - now;
    let timeLeft = {};
    if (difference > 0) {
      timeLeft = {
        days: Math.floor(difference / (1000 * 60 * 60 * 24)),
        hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
        minutes: Math.floor((difference / (1000 * 60)) % 60)
      };
    } else {
      timeLeft = { days: 0, hours: 0, minutes: 0 };
    }
    return timeLeft;
  };

  const [timeLeft, setTimeLeft] = useState(
    targetDate && targetDate !== "" ? calculateTimeLeft() : null
  );

  useEffect(() => {
    if (targetDate && targetDate !== "") {
      const timer = setTimeout(() => {
        setTimeLeft(calculateTimeLeft());
      }, 1000);
      return () => clearTimeout(timer);
    }
  });

  return (
    <div className={Module["container"]}>
      <div className={Module["session"]}>
        <p className={Module["sessionP"]}>
          {(!targetDate || targetDate === "")
            ? title
            : (
              <>
                {title}{" "}
                <span className={Module["countdownStyle"]}>
                  {timeLeft.days}d {timeLeft.hours}h {timeLeft.minutes}min to end
                </span>
              </>
            )
          }
        </p>
      </div>
      <div className={Module["form"]}>
        <FilterMenu onFilterApply={onFilterApply} currentFilters={selectedFilters} />
        <Searchbar onSearchChange={onSearchChange} suggestions={suggestions} />
        <div className={Module["rightside"]}>
          <div className={Module["notf-button"]}>
            <img src={notfIcon} alt="notf-icon" className={Module["notf-icon"]} />
          </div>
          <div className={Module["profile"]}>
            <img src={profilepic} alt="pic" className={Module["pic"]} />
            <p className={Module["profiletext"]}>Profile</p>
            <img
              src={filterIcondown}
              alt="Toggle2"
              className={Module["arrow-icon-prfoile"]}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

const Searchbar = ({ onSearchChange, suggestions }) => {
  const [query, setQuery] = useState(""); // State to store input value
  const [filteredSuggestions, setFilteredSuggestions] = useState([]);

  const handleInputChange = (event) => {
    const newQuery = event.target.value;
    setQuery(newQuery);
    onSearchChange(newQuery); // Propagate search query to parent

    // Filter suggestions based on the new query (case-insensitive)
    if (newQuery.trim() !== "") {
      const filtered = suggestions.filter((suggestion) =>
        suggestion.toLowerCase().includes(newQuery.toLowerCase())
      );
      setFilteredSuggestions(filtered);
    } else {
      setFilteredSuggestions([]);
    }
  };

  const handleSuggestionClick = (suggestion) => {
    setQuery(suggestion);
    onSearchChange(suggestion);
    setFilteredSuggestions([]);
  };

  return (
    <div className={Module["search-bar-container"]}>
      <input
        type="text"
        className={Module["input"]}
        placeholder="Search..."
        value={query} // Controlled input
        onChange={handleInputChange}
      />
      <div className={Module["search-icon"]}>
        <img src={searchicon} alt="search-icon" />
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

/*
  Updated FilterMenu:
  - When you click on Filter, a popup appears.
  - The left side of the popup shows a tab menu with two options: "Specialitys" and "Other".
  - By default, "Specialitys" is active.
  - When "Specialitys" is active, the content shows checkboxes for options ("ISI", "SIW", "IASD") and multiple selections are allowed.
  - When you click Apply, the selections from the active tab are sent to the parent.
*/
const FilterMenu = ({ onFilterApply, currentFilters }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [activeTab, setActiveTab] = useState("Specialitys"); // "Specialitys" or "Other"
  const [localFilters, setLocalFilters] = useState({
    Specialitys: currentFilters || [],
    Other: [] // You can add options for "Other" if needed
  });

  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  // Options for the "Specialitys" tab (categories)
  const specialityOptions = ["ISI", "SIW", "IASD"];
  // Dummy options for the "Other" tab (if needed)
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

  // When Apply is clicked, send the selections of the active tab to the parent
  const handleApply = () => {
    onFilterApply(localFilters[activeTab]);
    setIsOpen(false);
  };

  // When Cancel is clicked, reset and close
  const handleCancel = () => {
    setLocalFilters((prev) => ({
      ...prev,
      [activeTab]: currentFilters || []
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
            {/* Left Side Tab Menu */}
            <div className={Module["filter-tabs"]}>
              <p
                className={
                  activeTab === "Specialitys"
                    ? Module["tab-active"]
                    : Module["tab-inactive"]
                }
                onClick={() => handleTabChange("Specialitys")}
              >
                Specialitys
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
            {/* Content for Active Tab */}
            <div className={Module["filter-categories"]}>
              <p className={Module["filter-header"]}>
                {activeTab === "Specialitys"
                  ? "Select Categories"
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

export default NavBar;
