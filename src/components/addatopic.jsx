import React, { useState } from "react";
import { useRef } from "react";
import "../styles/addtopic.css";
import Upload from "../assets/upload.svg";
import Iconup from "../assets/arrow-up.svg";
import Icondown from "../assets/arrow-down.svg";
import searchicon from "../assets/Search.svg";
const Addatopic = () => {
  return (
    <div className="containert-at">
      <div className="pageheader-at">
        <p className="pagetitle">Adding a topic</p>

        <p className="spacing"></p>
        <button className="btnc">
          {" "}
          <p className="managebtns-text-at-c">Cancel</p>
        </button>
        <button className="btns">
          <p className="managebtns-text-at-s">Save</p>
        </button>
      </div>
      <div className="content">
        <TopicForm />
      </div>
    </div>
  );
};
const TopicForm = () => {
  const fileInputRef = useRef(null);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [grade, setGrade] = useState("2CS");
  const [speciality, setSpeciality] = useState("ISI");
  const [file, setFile] = useState(null);
  const [selectedSupervisors, setSelectedSupervisors] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");

  const supervisorsList = [
    "Guessoum mohamed nizar",
    "Kennouche abderahmene",
    "Yettou abdallah",
  ];

  const handleFileChange = (event) => {
    setFile(event.target.files[0]);
  };

  const handleSupervisorToggle = (name) => {
    setSelectedSupervisors((prev) =>
      prev.includes(name) ? prev.filter((sup) => sup !== name) : [...prev, name]
    );
  };
  return (
    <div className="topic-form">
      <div className="topic-form-1">
        <div className="info-section">
          <p className="ttl-at">Information about the topic</p>
          <p className="infos-at">
            Set a title with a maximum of 70 characters, including spaces,
            provide a description for it, and include a photo for the
            presentation.
          </p>
        </div>

        <div className="form-section">
          <label className="ttl-fs-at">Title</label>
          <textarea
            className="txt-a1-at"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            maxLength="70"
            placeholder="Include a message."
            rows="2" // Defines the number of lines
          />

          <label className="ttl-fs-at">Description</label>
          <textarea
            className="txt-a2-at"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Include a message..."
            rows="4"
          />

          <div className="upload-box">
            <img src={Upload} alt="" className="upload-image" />
            <input
              type="file"
              ref={fileInputRef}
              onChange={handleFileChange}
              style={{ display: "none" }} // Hide the input
            />
            <p className="msg-at">
              Browse and choose the image you want to upload from your computer
            </p>
            <button
              className="upload-btn"
              onClick={() => fileInputRef.current.click()} // Trigger file input on click
            >
              +
            </button>
          </div>
        </div>
      </div>
      {/* Grade & Speciality */}
      <div className="topic-form-1">
        {" "}
        <div className="info-section">
          <p className="ttl-at">Grade and Speciality</p>
          <p className="infos-at">
            Set the grade your topic is aiming for and the specialty if
            applicable.
          </p>
        </div>
        <div className="dropdowns">
          <div className="form-section">
            <label className="ttl-fs-at">Grade</label>
            <select
              value={grade}
              onChange={(e) => setGrade(e.target.value)}
              className="select-at"
            >
              <option value="2CS">2CS</option>
              <option value="1CS">1CS</option>
            </select>
          </div>
          <div className="form-section">
            <label className="ttl-fs-at">Speciality</label>
            <select
              value={speciality}
              onChange={(e) => setSpeciality(e.target.value)}
              className="select-at"
            >
              <option value="ISI">ISI</option>
              <option value="SIW">SIW</option>
            </select>
          </div>
        </div>
      </div>
      {/* Technical Sheet */}
      <div className="topic-form-1">
        <div className="info-section">
          <p className="ttl-at">Technical Sheet</p>
          <p className="infos-at">
            Upload the technical sheet containing detailed specifications and
            essential information.
          </p>
        </div>
        <div className="form-section">
          <div className="upload-box">
            <img src={Upload} alt="" className="upload-image" />
            <input
              type="file"
              ref={fileInputRef}
              onChange={handleFileChange}
              style={{ display: "none" }} // Hide the input
            />
            <p className="msg-at">
              Browse and choose the image you want to upload from your computer
            </p>
            <button
              className="upload-btn"
              onClick={() => fileInputRef.current.click()} // Trigger file input on click
            >
              +
            </button>
          </div>
        </div>
      </div>

      {/* Other Supervisors */}
      <div className="topic-form-1 more-space">
        {" "}
        <div className="info-section">
          <p className="ttl-at">Other supervisors</p>
          <p className="infos-at">
            Select an additional supervisor to assist in overseeing the groups
            choosing this topic.
          </p>
        </div>
        <Supervisorsformsection />
      </div>
    </div>
  );
};
const Supervisorsformsection = () => {
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
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedSupervisors, setSelectedSupervisors] = useState([
    "Guessoum mohamed nizar",
    "Kennouche abderahmene",
    "Yettou abdallah",
  ]);

  const supervisorsList = [
    "Guessoum mohamed nizar",
    "Kennouche abderahmene",
    "Yettou abdallah",
    "Yettou abdallah",
    "Yettou abdallah",
    "Yettou abdallah",
  ];

  const handleSupervisorToggle = (name) => {
    setSelectedSupervisors((prev) =>
      prev.includes(name)
        ? prev.filter((supervisor) => supervisor !== name)
        : [...prev, name]
    );
  };

  return (
    <div className="form-section ">
      <div className="select-sv-at">
        <button className="sv-button-at" onClick={toggleMenu}>
          <p className="sv-msg-at"> Select supervisors</p>
          <p className="supervisors-text"></p>
          <img
            src={isOpen ? Iconup : Icondown}
            alt="Toggle"
            className="arrow-icon"
          />
        </button>
      </div>

      {isOpen && (
        <div className=" border-form-at">
          {" "}
          <Searchbar query={searchTerm} setQuery={setSearchTerm} />
          <div className="sv-list">
            {supervisorsList
              .filter((name) =>
                name.toLowerCase().includes(searchTerm.toLowerCase())
              )
              .map((name) => (
                <label key={name} className="sv-item">
                  <input
                    type="checkbox"
                    checked={selectedSupervisors.includes(name)}
                    onChange={() => handleSupervisorToggle(name)}
                  />
                  {name}
                </label>
              ))}
          </div>
        </div>
      )}
    </div>
  );
};
const Searchbar = ({ query, setQuery }) => {
  // State to store input value

  const handleInputChange = (event) => {
    setQuery(event.target.value); // Update state when user types
  };

  return (
    <div className="search-bar-container-t">
      <input
        type="text"
        className="input-at"
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

export default Addatopic;
