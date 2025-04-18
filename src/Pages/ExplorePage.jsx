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
        <button onClick={() => navigate(-1)}>Go Back</button>
      </div>
    );
  }

  return (
    <div className={Module["explore-page"]}>
      <Sidebar />
      <div className={Module["explore-content"]}>
        <div style={{ marginRight: "6vw" }}>
          <Navbar />
        </div>

    <div style={{ 
     
    height:"90vh",
    
      overflowY: "auto" 
    }}>
          <div className={Module.padding}></div>
          <div className={Module.header}>

            <h1 >Exploring</h1>

            <div className={Module.btnContainer}>

              <button className={Module["BackBtn"]} onClick={() => window.history.back()}>
                Back
              </button>
              <button className={Module["AddBtn"]} >
                Add to my List
              </button>

            </div>
          </div>

          <div className={Module["banner-wrapper"]}>
            <img
              src={card.photo}
              alt="Project Banner"
              className={Module["project-banner"]}
            />
          </div>
          <div className={Module["project-details"]}>
            <h1 className={Module["project-title"]}>{card.title}</h1>
            <p className={Module["project-description"]}>{card.description}</p>

            <h2 className={Module["section-heading"]}>Supervisors</h2>
            <p>Here is a list of supervisors who will assist in developing this project, along with the publisher of this topic.</p>
            <ul className={Module["supervisors-list"]}>
              {card.supervisors && card.supervisors.length > 0 ? (
                card.supervisors.map((supervisor, index) => (
                  <li key={index}>
                    {(supervisor.firstname + " " + supervisor.lastname) || "No name provided"}
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

    </div>
  );
}
