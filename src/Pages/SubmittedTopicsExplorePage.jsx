import React, { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";

import Navbar from "../components/NavBar";
import PfeTopicModal from "../components/modals/PfeTopicModal.jsx";
import DeclineModal from "../components/modals/DeclineReasoning.jsx";
import FileIcon from "../assets/fileIcon.svg";
import ArrowIcon from "../assets/expand_less_black.svg";
import Module from "../styles/SubmittedTopicsExplorePage.module.css";

export default function PublishedTopicsExplorePage() {
  const location = useLocation();
  const navigate = useNavigate();
  const { card } = location.state || {};

  // États pour les modals
  const [isPfeTopicModalOpen, setPfeTopicModalOpen] = useState(false);
  const [modalOperation, setModalOperation] = useState("");
  const [isDeclineModalOpen, setDeclineModalOpen] = useState(false);

  if (!card) {
    return (
      <div>
        <p>
          No project data available. Please go back and select a project.
        </p>
        <button onClick={() => navigate("/pfe")}>Go Back</button>
      </div>
    );
  }

  // Quand l’utilisateur confirme le refus (decline), on récupère raison et fichier
  const handleDeclineConfirm = ({ reason, file }) => {
    // Ici, appeler l’API pour envoyer la raison et le fichier
    console.log("Declined card id:", card.id);
    console.log("Reason (Raison):", reason);
    console.log("File (Fichier):", file);
    setDeclineModalOpen(false);
    // Rediriger vers la validation des topics
    navigate("/admin/sessions/topic-validation");
  };

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
                onClick={() => setDeclineModalOpen(true)}
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
              />

              {/* Modal de raison de refus */}
              <DeclineModal
                isOpen={isDeclineModalOpen}
                onClose={() => setDeclineModalOpen(false)}
                onConfirm={handleDeclineConfirm}
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
                  <li key={idx}>{sup.name || "No name provided"}</li>
                ))
              ) : (
                <li>No supervisors available</li>
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
