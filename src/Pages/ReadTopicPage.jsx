import { React, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";

import Navbar from "../components/NavBar";
import FileIcon from "../assets/fileIcon.svg";
import ArrowIcon from "../assets/expand_less_black.svg";
import Module from "../styles/SubmittedTopicsExplorePage.module.css";
import AdminSidebar from "../components/AdminSidebar";
import PfeTopicModal from "../components/modals/PfeTopicModal.jsx";

export default function ReadTopicPage() {
  const location = useLocation();
  const navigate = useNavigate();
  const { card } = location.state || {};

  const [isPfeTopicModalOpen, setPfeTopicModalOpen] = useState(false);
  const [modalOperation, setModalOperation] = useState(""); //by default no operation is chosen

  if (!card) {
    // If no card data is found, navigate back or show a message.
    return (
      <div>
        <p>No project data available. Please go back and select a project.</p>
        <button onClick={() => navigate("/pfe")}>Go Back</button>
      </div>
    );
  }

  return (
    <div className={Module["explore-container"]}>
      
      <div className={Module["explore-content"]} >
        <Navbar />
        <div className={Module["scroll-container"]}>
          <div className={Module["header"]}>
            <h1>Reading</h1>
            <div className={Module["buttons-container"]}>
              <button
                className={Module["go-back-button"]}
                onClick={() => navigate("/admin/sessions/manage-preferences")}
              >
                go Back
              </button>

              

              {/*  Only one modal, controlled by operation state */}
              <PfeTopicModal
                isOpen={isPfeTopicModalOpen}
                onClose={() => setPfeTopicModalOpen(false)}
                entityType="Topic(s)"
                operation={modalOperation}
                validatedcardid={card.id}
              />
            </div>
          </div>
          <div className={Module["banner-wrapper"]}>
            <img
              src={card.PFE.photo || "https://via.placeholder.com/300x200"}
              alt="Project Banner"
              className={Module["project-banner"]}
            />
          </div>
          <div className={Module["project-details"]}>
            <h1 className={Module["project-title"]}>{card.PFE.title}</h1>
            <p className={Module["project-description"]}>{card.PFE.description}</p>

            <h2 className={Module["section-heading"]}>Supervisors</h2>
            <ul className={Module["supervisors-list"]}>
              {card.PFE.supervisors && card.PFE.supervisors.length > 0 ? (
                card.PFE.supervisors.map((supervisor, index) => (
                  <li key={index}>
                   -  {(supervisor.firstname + " " + supervisor.lastname) || "No name provided"}
                  </li>
                ))
              ) : (
                <li>No supervisors available</li>
              )}
            </ul>

            <h2 className={Module["section-heading"]}>Technical Sheet</h2>
            <a
              href={card.PFE.pdfFile}
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
