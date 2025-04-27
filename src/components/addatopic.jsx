import React, { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "../styles/addtopic.css";
import Upload from "../assets/upload.svg";
import Iconup from "../assets/arrow-up.svg";
import Icondown from "../assets/arrow-down.svg";
import searchicon from "../assets/Search.svg";
import axios from "axios";

const Addatopic = () => {
  const user = JSON.parse(localStorage.getItem("user"));
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [grade, setGrade] = useState("2CS");
  const [speciality, setSpeciality] = useState([]);
  const [presentationFile, setPresentationFile] = useState(null);
  const [techSheetFile, setTechSheetFile] = useState(null);
  const [selectedSupervisors, setSelectedSupervisors] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const navigate = useNavigate();
  const [supervisorsList, setsupervisorsList] = useState([]);

  const presentationRef = useRef(null);
  const techSheetRef = useRef(null);

  const specialityList = ["ISI", "SIW", "IASD"];
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get("/users/teachers", {
          withCredentials: true,
        });

        if (response.data) {
          setsupervisorsList(response.data);
        }
      } catch (err) {
        console.error(
          "Error fetching supervisors:",
          err.response?.data || err.message
        );
        if (err.response?.status === 404) {
          setsupervisorsList([]);
        } else {
          throw err;
        }
      }
    };

    fetchData();
  }, [navigate]);

  const handlePresentationChange = (event) => {
    const file = event.target.files[0];
    if (file && (file.type === "image/png" || file.type === "image/jpeg")) {
      setPresentationFile(file);
    } else {
      alert("Please upload a valid JPG or PNG image.");
    }
  };

  const handleTechSheetChange = (event) => {
    const file = event.target.files[0];
    if (file?.type === "application/pdf") {
      setTechSheetFile(file);
    } else {
      alert("Please upload a valid PDF file.");
    }
  };
  const handleSpecialityToggle = (name) => {
    setSpeciality((prev) =>
      prev.includes(name) ? prev.filter((sup) => sup !== name) : [...prev, name]
    );
  };
  const handleSupervisorToggle = (name) => {
    setSelectedSupervisors((prev) =>
      prev.includes(name) ? prev.filter((sup) => sup !== name) : [...prev, name]
    );
  };
  const handleSubmit = async () => {
    if (!title || !description || !presentationFile || !techSheetFile) {
      alert("Please fill in all required fields and upload the files.");
      return;
    }

    const formData = new FormData();
    formData.append("title", title);
    if (user?.role === "teacher") {
      formData.append("specialization", speciality.join(","));
      selectedSupervisors.forEach((sup, index) => {
        formData.append(`supervisors[${index}]`, sup); // makes an arrayP
      });
    }

    formData.append("description", description);
    formData.append("year", grade);
    formData.append("photo", presentationFile); // image file
    formData.append("pdfFile", techSheetFile); // PDF file

    try {
      const response = await axios.post("/pfe/depositPFE", formData, {
        withCredentials: true,
        headers: {
          "ngrok-skip-browser-warning": "true",
          "Content-Type": "multipart/form-data",
        },
      });

      console.log("Topic submitted:", response.data);
      alert("Topic submitted successfully!");
      navigate(-1);
    } catch (error) {
      console.error(error);
      alert(error);
    }
  };

  const [isOpen, setIsOpen] = useState(false);
  const [isspec, setisspec] = useState(false);
  function toggleMenu(type) {
    if (type === "dynamic") {
      setIsOpen(!isOpen);
    } else {
      setisspec(!isspec);
    }
  }

  return (
    <div className="containert-at">
      <div className="pageheader-at">
        <p className="pagetitle">Adding a topic</p>
        <p className="spacing"></p>
        <button className="btnc" onClick={() => navigate(-1)}>
          <p className="managebtns-text-at-c">Cancel</p>
        </button>
        <button className="btns" onClick={handleSubmit}>
          <p className="managebtns-text-at-s">Save</p>
        </button>
      </div>

      <div className="content">
        <div className="topic-form">
          {/* Topic Info */}
          <div className="topic-form-1">
            <div className="info-section">
              <p className="ttl-at">Information about the topic</p>
              <p className="infos-at">
                Set a title with a maximum of 70 characters, including spaces,
                provide a description, and include a photo.
              </p>
            </div>
            <div className="form-section">
              <label className="ttl-fs-at">Title</label>
              <textarea
                className="txt-a1-at"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                maxLength="70"
                placeholder="Include a title."
                rows="2"
              />
              <label className="ttl-fs-at">Description</label>
              <textarea
                className="txt-a2-at"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Include a description..."
                rows="4"
              />
              <div className="upload-box">
                <img src={Upload} alt="" className="upload-image" />
                <input
                  type="file"
                  accept="image/png, image/jpeg"
                  ref={presentationRef}
                  onChange={handlePresentationChange}
                  style={{ display: "none" }}
                />
                <p className="msg-at">
                  {presentationFile
                    ? presentationFile.name
                    : "Browse and choose an image (JPG or PNG)"}
                </p>
                <button
                  className="upload-btn"
                  onClick={() => presentationRef.current.click()}
                >
                  +
                </button>
              </div>
            </div>
          </div>

          {/* Grade and Speciality */}
          <div className="topic-form-1">
            <div className="info-section">
              <p className="ttl-at">Grade and Speciality</p>
              <p className="infos-at">
                Set the grade your topic is aiming for and the specialty.
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
                {isspec && <div className="space-year"></div>}{" "}
              </div>
              {user.role === "teacher" && (
                <div className="form-section">
                  <label className="ttl-fs-at">Speciality</label>

                  <div className="select-sv-at">
                    <button
                      className="sv-button-at"
                      onClick={() => toggleMenu("static")}
                    >
                      <p className="ttl-fs-at">
                        {speciality.length === 0
                          ? "Select speciality"
                          : `${speciality.length} specialities selected`}
                      </p>
                      <img
                        src={isOpen ? Iconup : Icondown}
                        alt="Toggle"
                        className="arrow-icon"
                      />
                    </button>
                  </div>
                  {isspec && (
                    <div className="border-form-at">
                      <div className="sv-list">
                        {specialityList
                          .filter((name) =>
                            name
                              .toLowerCase()
                              .includes(searchTerm.toLowerCase())
                          )
                          .map((name) => (
                            <label key={name} className="sv-item">
                              <input
                                type="checkbox"
                                checked={speciality.includes(name)}
                                onChange={() => handleSpecialityToggle(name)}
                              />
                              {name}
                            </label>
                          ))}
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>

          {/* Technical Sheet */}
          <div className="topic-form-1">
            <div className="info-section">
              <p className="ttl-at">Technical Sheet</p>
              <p className="infos-at">
                Upload the technical sheet (PDF format).
              </p>
            </div>
            <div className="form-section">
              <div className="upload-box">
                <img src={Upload} alt="" className="upload-image" />
                <input
                  type="file"
                  accept="application/pdf"
                  ref={techSheetRef}
                  onChange={handleTechSheetChange}
                  style={{ display: "none" }}
                />
                <p className="msg-at">
                  {techSheetFile
                    ? techSheetFile.name
                    : "Browse and choose a PDF technical sheet"}
                </p>
                <button
                  className="upload-btn"
                  onClick={() => techSheetRef.current.click()}
                >
                  +
                </button>
              </div>
            </div>
          </div>

          {/* Supervisors */}
          {user.role === "teacher" && (
            <div
              className="topic-form-1 
          "
            >
              <div className="info-section">
                <p className="ttl-at">Other supervisors</p>
                <p className="infos-at">
                  Select an additional supervisor to assist.
                </p>
              </div>
              <div className="form-section">
                <div className="select-sv-at">
                  <button
                    className="sv-button-at"
                    onClick={() => toggleMenu("dynamic")}
                  >
                    <p className="sv-msg-at"> Select supervisors</p>
                    <img
                      src={isOpen ? Iconup : Icondown}
                      alt="Toggle"
                      className="arrow-icon"
                    />
                  </button>
                </div>

                {isOpen && (
                  <div className="border-form-at">
                    <div className="search-bar-container-t">
                      <input
                        type="text"
                        className="input-at"
                        placeholder="Search..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                      />
                      <div className="search-icon">
                        <img src={searchicon} alt="search-icon" />
                      </div>
                    </div>
                    <div className="sv-list">
                      {supervisorsList
                        .filter((teacher) =>
                          `${teacher.firstname} ${teacher.lastname}`
                            .toLowerCase()
                            .includes(searchTerm.toLowerCase())
                        )
                        .map((teacher) => {
                          const fullName = `${teacher.firstname} ${teacher.lastname}`;
                          return (
                            <label key={teacher._id} className="sv-item">
                              <input
                                type="checkbox"
                                checked={selectedSupervisors.includes(fullName)}
                                onChange={() =>
                                  handleSupervisorToggle(fullName)
                                }
                              />
                              {fullName}
                            </label>
                          );
                        })}
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}

          <div className="onleft">
            {" "}
            <button className="btnc-giant" onClick={() => navigate(-1)}>
              <p className="managebtns-text-at-c">Cancel</p>
            </button>
            <button className="btns-giant" onClick={handleSubmit}>
              <p className="managebtns-text-at-s">Save</p>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Addatopic;
