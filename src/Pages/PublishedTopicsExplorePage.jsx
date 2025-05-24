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
export default function PublishedTopicsExplorePage() {
  const location = useLocation();
  const navigate = useNavigate();
  const { card } = location.state || {};
  
  // États pour les modals
  const [isPfeTopicModalOpen, setPfeTopicModalOpen] = useState(false);
  const [modalOperation, setModalOperation] = useState("");
  const [isDeclineModalOpen, setDeclineModalOpen] = useState(false);
  const [supervisors, setSupervisors] = useState([]);
  const [selectedSupervisor, setSelectedSupervisor] = useState("");
  const [specialite,setSpecialite] = useState("");
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
                className={Module["go-back-button"]}
                onClick={() => navigate(-1)}
              >
                go Back
              </button>

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
                  <li key={idx}>{sup.name || "No name provided"}</li>
                ))
              ) : (
                <li>No supervisors are assigned</li>
              )}
            </ul>
            


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
