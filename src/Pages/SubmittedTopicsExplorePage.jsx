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
  const [selectedSupervisor, setSelectedSupervisor] = useState();
  const [specialite,setSpecialite] = useState("ISI");
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
    console.log("Selected supervisor:", selectedSupervisor);
    
  }
  , [selectedSupervisor]);


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
                specialite={specialite}
                supervisorToAssign={selectedSupervisor}
              />

              {/* Modal de raison de refus */}
              <DeclineModal
                isOpen={isDeclineModalOpen}
                onClose={() => setDeclineModalOpen(false)}
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
            {card.creator.role === "company" && (
            <div className={Module.formRow}>
              {/* Supervisors */}
              <div className={Module.formField}>
                <h2 className={Module["section-heading"]}>Assign a Supervisor</h2>
                <label className={Module.label}>Supervisors</label>
                <select
                    className={Module.select}
                    value={selectedSupervisor}
                    onChange={(e) => setSelectedSupervisor(e.target.value)}
                  >
                    <option value="">Select supervisors</option>
                    {supervisors.map((sup) => (
                      <option key={sup.id} value={sup.id}>
                         {sup.firstname || ""} {sup.lastname || ""} ({sup.user?.email || `Supervisor #${sup.id}`})
                      </option>
                    ))}
                  </select>
              </div>

              {/* Speciality */}
              <div className={Module.formField}>
                <h2 className={Module["section-heading"]}>Speciality</h2>
                <label className={Module.label}>Speciality</label>
                <select className={Module.select}
                value={specialite}
                onChange={(e) => setSpecialite(e.target.value)}>
                  <option value="ISI">ISI</option>
                  <option value="SIW">SIW</option>
                  <option value="IASD">IASD</option>
                </select>
              </div>
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
