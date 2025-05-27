import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";

import Navbar from "../components/NavBar";
import PfeTopicModal from "../components/modals/PfeTopicModal.jsx";
import DeclineModal from "../components/modals/DeclineReasoning.jsx";
import FileIcon from "../assets/fileIcon.svg";
import ArrowIcon from "../assets/expand_less_black.svg";
import Module from "../styles/SubmittedTopicsExplorePage.module.css";
import axios from 'axios';
axios.defaults.withCredentials = true;
axios.defaults.headers.common["ngrok-skip-browser-warning"] = "true";
export default function SubmittedTopicsExplorePage() {
  const location = useLocation();
  const navigate = useNavigate();
  const { card } = location.state || {};
  
  // États pour les modals
  const [isPfeTopicModalOpen, setPfeTopicModalOpen] = useState(false);
  const [modalOperation, setModalOperation] = useState("");
  const [isDeclineModalOpen, setDeclineModalOpen] = useState(false);
  const [supervisors, setSupervisors] = useState([]);
  const [selectedSupervisors, setSelectedSupervisors] = useState([]);
  
  const [specializationArray,setSpecializationArray] = useState(["ISI"]);
  const fetchTeachers = async () => {
    try {
      const response = await axios.get('/users/teachers');
      console.log("Teachers fetched:", response.data);
       setSupervisors(response.data);
    } catch (error) {
      console.error("Failed to fetch teachers:", error.response?.data || error.message);
      throw error;
    }
  };


  useEffect(() => {
    if (card?.creator?.role) {
      console.log("this PFE was submitted by a ", card.creator.role);
      //fetching all supervisors if the creator is a company(extern)
      fetchTeachers();
    } else {
      console.log("Missing creator/role");
    }
    
  }
  , [card]);
  useEffect(() => {
    console.log("Selected supervisor:", selectedSupervisors);
    
  }
  , [selectedSupervisors]);


  if (!card) {
    return (
      <div>
        <p>
          No project data available. Please go back and select a project.
        </p>
        <button onClick={() => navigate(-1)}>Go Back</button>
      </div>
    );
  }
  
 


  return (
    <div className={Module["explore-container"]}>
      <div className={Module["explore-content"]}>
        <Navbar />
        <div className={Module["scroll-container"]}>
          <div className={Module["header"]}>
            <h1>Reading</h1>
            <div className={Module["buttons-container"]}>
              {/* Bouton de refus (Decline) */}
              <button
                              className={Module["decline-button"]}
                              onClick={() => navigate(-1)}
                            >
                              go Back
                            </button>
              <button
                className={Module["decline-button"]}
                onClick={() => setDeclineModalOpen(true)}
                style={{ backgroundColor: "#f76659",border: "none" ,color: "white"}}

              >
                Decline
              </button>

              {/* Bouton de validation (Validate) */}
              <button
                className={Module["validate-button"]}
                onClick={() => {
                  setModalOperation("validate");
                  setPfeTopicModalOpen(true);
                }}
              >
                Validate
              </button>

              {/* Modal de validation existant */}
              <PfeTopicModal
                isOpen={isPfeTopicModalOpen}
                onClose={() => setPfeTopicModalOpen(false)}
                entityType="Topic(s)"
                operation={modalOperation}
                validatedcardid={card.id}
                role={card?.creator?.role}
                
                supervisorsToAssign={selectedSupervisors}
                specializationArray={specializationArray}
                card={card}
              />

              {/* Modal de raison de refus */}
              <DeclineModal
                isOpen={isDeclineModalOpen}
                onClose={() => {setDeclineModalOpen(false);navigate(-1)}}
                pfeId={card.id}
              />
            </div>
          </div>

          <div className={Module["banner-wrapper"]}>
            <img
              src={card.photo || "https://via.placeholder.com/300x200"}
              alt="Project Banner"
              className={Module["project-banner"]}
            />
          </div>

          <div className={Module["project-details"]}>
            <h1 className={Module["project-title"]}>{card.title}</h1>
            <p className={Module["project-description"]}>{card.description}</p>

            <h2 className={Module["section-heading"]}>Supervisors</h2>
            <ul className={Module["supervisors-list"]}>
              {card.supervisors && card.supervisors.length > 0 ? (
                card.supervisors.map((sup, idx) => (
                  <li key={idx}>-{`${sup.firstname} ${sup.lastname}` || "No name provided"}</li>
                ))
              ) : (
                <li>No supervisors are assigned</li>
              )}
            </ul>
            {card.creator.role === "extern" && (
  <div className={Module.formRow}>
    {/* Supervisors */}
    {/* Supervisor Multi-Select */}
<div className={Module.formField}>
  <h2 className={Module["section-heading"]}>Assign Supervisors</h2>
  <label className={Module.label}>Select Supervisors</label>
  <select
    className={Module.select}
    onChange={(e) => {
      const selectedId = e.target.value;
      const selected = supervisors.find((s) => s.id.toString() === selectedId);
      if (
        selected &&
        !selectedSupervisors.some((sup) => sup.id === selected.id) &&
        selectedSupervisors.length < 3
      ) {
        setSelectedSupervisors([...selectedSupervisors, selected]);
      }
    }}
    value=""
  >
    <option value="">Select a supervisor</option>
    {supervisors.map((sup) => (
      <option
        key={sup.id}
        value={sup.id}
        disabled={selectedSupervisors.some((s) => s.id === sup.id)}
      >
        {sup.firstname || ""} {sup.lastname || ""} ({sup.user?.email || `#${sup.id}`})
      </option>
    ))}
  </select>

  {/* Display selected supervisors */}
  <ul className={Module.selectedList}>
    {selectedSupervisors.length === 0 ? (
      <li>No supervisors selected.</li>
    ) : (
      selectedSupervisors.map((sup) => (
        <li key={sup.id} className={Module.selectedItem}>
          {sup.firstname} {sup.lastname} ({sup.user?.email || `#${sup.id}`})
          <button
            className={Module.removeButton}
            onClick={() =>
              setSelectedSupervisors(
                selectedSupervisors.filter((s) => s.id !== sup.id)
              )
            }
            style={{ marginLeft: "10px" }}
          >
            ✕
          </button>
        </li>
      ))
    )}
  </ul>
</div>


    {/* Speciality */}
   
    {((card.year === "2SC") || (card.year === "3SC") )&& (
  <div className={Module.formField}>
    <h2 className={Module["section-heading"]}>Specializations</h2>
    <label className={Module.label}>Add a Specialization</label>
    <select
      className={Module.select}
      onChange={(e) => {
        const selected = e.target.value;
        if (
          selected &&
          !specializationArray.includes(selected) &&
          specializationArray.length < 3
        ) {
          setSpecializationArray([...specializationArray, selected]);
        }
      }}
      value=""
    >
      <option value="">Select a specialization</option>
      {["ISI", "SIW", "IASD"].map((spec) => (
        <option
          key={spec}
          value={spec}
          disabled={specializationArray.includes(spec)}
        >
          {spec}
        </option>
      ))}
    </select>

    {/* Display selected specializations */}
    <ul className={Module.selectedList}>
      {specializationArray.length === 0 ? (
        <li>No specializations selected.</li>
      ) : (
        specializationArray.map((spec) => (
          <li key={spec} className={Module.selectedItem}>
            {spec}
            <button
              className={Module.removeButton}
              onClick={() =>
                setSpecializationArray(
                  specializationArray.filter((s) => s !== spec)
                )
              }
              style={{ marginLeft: "10px" }}
            >
              ✕
            </button>
          </li>
        ))
      )}
    </ul>
  </div>
)}
    
  </div>
)}



            <h2 className={Module["section-heading"]}>Technical Sheet</h2>
            <a
              href={card.pdfFile}
              download
              className={Module["technical-sheet"]}
            >
              <div className={Module["technical-sheet-info"]}>
                <img
                  src={FileIcon}
                  alt="PDF Icon"
                  className={Module["file-icon"]}
                />
                <div>
                  <span className={Module["file-name"]}>
                    TechnicalSheet.Pdf
                  </span>
                  <span className={Module["file-size"]}>
                    Size not available
                  </span>
                </div>
              </div>
              <img
                src={ArrowIcon}
                alt="Right Arrow"
                className={Module["arrow-icon"]}
              />
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
