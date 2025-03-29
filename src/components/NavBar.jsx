import "../styles/navbar.css";
import searchicon from "../assets/search-icon.svg";
import React, { useState } from "react";
import filterIcon from "../assets/filter-icon.svg";
import filterIconup from "../assets/up.svg";
import filterIcondown from "../assets/down.svg";
import notfIcon from "../assets/notf-icon.svg";
import profilepic from "../assets/profile-pic.svg";
const NavBar = () => {
  return (
    <div className="container">
      <div className="session">
        <p className="sessionP">Normal session</p>
      </div>
      <div className="form">
        <FilterMenu />
        <Searchbar />
        <div className="rightside">
          {" "}
          <div className="notf-button">
            {" "}
            <img src={notfIcon} alt="" className="notf-icon" />
          </div>{" "}
          <div className="profile">
            <img src={profilepic} alt="pic" className="pic" />
            <p className="profiletext">Profile</p>
            <img
              src={filterIcondown}
              alt="Toggle2"
              className="arrow-icon-prfoile"
            />
          </div>
        </div>
      </div>
    </div>
  );
};

const Searchbar = () => {
  const [query, setQuery] = useState(""); // State to store input value

  const handleInputChange = (event) => {
    setQuery(event.target.value); // Update state when user types
  };

  return (
    <div className="search-bar-container">
      <input
        type="text"
        className="input"
        placeholder="Search..."
        value={query} // Controlled input
        onChange={handleInputChange}
      />
      <div className="search-icon">
        <img src={searchicon} alt="search-icon" />
      </div>
    </div>
  );
};

const FilterMenu = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedFilter, setSelectedFilter] = useState("");

  const toggleMenu = () => {
    setIsOpen(!isOpen);
    setSelectedFilters([]); // Uncheck all checkboxes
  };
  const [selectedFilters, setSelectedFilters] = useState([]);

  const handleCheckboxChange = (event) => {
    const { value, checked } = event.target;
    setSelectedFilters((prev) =>
      checked ? [...prev, value] : prev.filter((item) => item !== value)
    );
  };

  return (
    <div className="filter">
      <button className="filter-button" onClick={toggleMenu}>
        <img src={filterIcon} alt="Filter" className="custom-icon" />

        <p>Filter</p>
        <p className="filtertext"></p>
        <img
          src={isOpen ? filterIconup : filterIcondown}
          alt="Toggle"
          className="arrow-icon"
        />
      </button>

      {isOpen && (
        <div className="filter-popup">
          <div className="filter-content">
            {/* Left Side - Filter Categories */}
            <div className="filter-categories">
              <p className="filter-header"> Filter types</p>
              <p
                className={
                  selectedFilter === "Speciality" ? "active" : "notactive"
                }
                onClick={() => setSelectedFilter("Speciality")}
              >
                Speciality
              </p>
              <p
                className={selectedFilter === "Grade" ? "active" : "notactive"}
                onClick={() => setSelectedFilter("Grade")}
              >
                Grade
              </p>
              <p
                className={selectedFilter === "Other" ? "active" : "notactive"}
                onClick={() => setSelectedFilter("Other")}
              >
                Other
              </p>
            </div>

            {/* Right Side - Filter Options */}
            <div className="filter-options">
              <p className="filter-header">Show Only</p>
              {["ISI", "IASD", "SIW"].map((category) => (
                <label key={category} className="custom-checkbox">
                  <input
                    type="checkbox"
                    name="filter"
                    value={category}
                    onChange={handleCheckboxChange}
                    checked={selectedFilters.includes(category)}
                  />
                  <span className="checkmark"></span>
                  <p className="optionstext">{category}</p>
                </label>
              ))}
            </div>
          </div>

          {/* Buttons */}
          <div className="filter-buttons">
            <button className="cancel-btn" onClick={toggleMenu}>
              Cancel
            </button>
            <button className="apply-btn">Apply</button>
          </div>
        </div>
      )}
    </div>
  );
};

export default NavBar;
