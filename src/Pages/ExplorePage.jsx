import React from "react";
import { useLocation, useNavigate } from "react-router-dom";
import Sidebar from "../components/Sidebar";
import Navbar from "../components/NavBar";
import FileIcon from "../assets/fileIcon.svg";
import ArrowIcon from "../assets/expand_less_black.svg";
import Module from "../styles/ExplorePage.module.css";

export default function ExplorePage() {
  const location = useLocation();
  const navigate = useNavigate();
  const { card } = location.state || {};

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
      <Sidebar />
      <div className={Module["explore-content"]}>
        <Navbar />
        <div className={Module.padding}></div>
        <h1 className={Module.title}>Exploring</h1>
        <div className={Module["banner-wrapper"]}>
          <img
            src={card.photo }
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
              card.supervisors.map((supervisor, index) => (
                <li key={index}>
                 {( supervisor.firstname +" "+ supervisor.lastname ) || "No name provided"}
                </li>
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
                <span className={Module["file-name"]}>TechnicalSheet.Pdf</span>
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
  );
}
