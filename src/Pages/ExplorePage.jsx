// ExplorePage.jsx
import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import Sidebar from "../components/Sidebar";
import Navbar from "../components/NavBar";
import FileIcon from "../assets/fileIcon.svg";
import ArrowIcon from "../assets/expand_less_black.svg";
import Module from "../styles/ExplorePage.module.css";

export default function ExplorePage({ topic, ondeclined = false }) {
  const user = JSON.parse(localStorage.getItem("user"));

  const navigate = useNavigate();
  const location = useLocation();
  const safeState = user.role !== "teacher" ? location.state : {};
  const { card, sessionTitle, targetDate, submit } = safeState;
  const [inList, setInList] = useState(false);

  useEffect(() => {
    if (!card || user.role === "teacher") return;
    const preferencesList =
      JSON.parse(localStorage.getItem("preferencesList")) || [];
    const exists = preferencesList.some(
      (p) => p.card_info?.id === card.id || p.id === card.id
    );
    setInList(exists);
  }, [card]);

  if (
    (user.role === "teacher" && !topic) ||
    (user.role !== "teacher" && !card)
  ) {
    return (
      <div>
        <p>No project data available. Please go back and select a project.</p>
        <button onClick={() => navigate(-1)}>Go Back</button>
      </div>
    );
  }

  const handleRemoveFromList = () => {
    navigate("/pfe-student", { state: { removedTopic: card } });
  };

  const handleAddToList = () => {
    navigate("/pfe-student", { state: { addedTopic: card } });
  };

  return user.role === "teacher" ? (
    <div>
      <div className={Module.padding}></div>
      <div className={Module.header}>
        <h1>Exploring</h1>
      </div>

      <div className={Module["banner-wrapper"]}>
        <img
          src={topic.photo}
          alt="Project Banner"
          className={Module["project-banner"]}
        />
      </div>

      <div className={Module["project-details"]}>
        <h1 className={Module["project-title"]}>{topic.title}</h1>
        <p className={Module["project-description"]}>{topic.description}</p>

        <h2 className={Module["section-heading"]}>Supervisors</h2>
        <p>
          Here is a list of supervisors who will assist in developing this
          project, along with the publisher of this topic.
        </p>
        <ul className={Module["supervisors-list"]}>
          {topic.supervisors?.length > 0 ? (
            topic.supervisors.map((sv, i) => (
              <li key={i}>
                {sv.firstname} {sv.lastname}
              </li>
            ))
          ) : (
            <li>No supervisors available</li>
          )}
        </ul>

        <h2 className={Module["section-heading"]}>Technical Sheet</h2>
        <a href={topic.pdfFile} download className={Module["technical-sheet"]}>
          <div className={Module["technical-sheet-info"]}>
            <img
              src={FileIcon}
              alt="PDF Icon"
              className={Module["file-icon"]}
            />
            <div>
              <span className={Module["file-name"]}>TechnicalSheet.pdf</span>
              <span className={Module["file-size"]}>Size not available</span>
            </div>
          </div>
          <img
            src={ArrowIcon}
            alt="Expand Arrow"
            className={Module["arrow-icon"]}
          />
        </a>
      </div>
    </div>
  ) : (
    <div className={Module["explore-page"]}>
      <Sidebar />
      <div className={Module["explore-content"]}>
        <div style={{ marginRight: "6vw" }}>
          <Navbar
            title={sessionTitle || "No session"}
            targetDate={targetDate}
          />
        </div>

        <div style={{ height: "90vh", overflowY: "auto" }}>
          <div className={Module.padding}></div>
          <div className={Module.header}>
            <h1>Exploring</h1>
            {sessionTitle === "Select topics session" && (
              <div className={Module.btnContainer}>
                <button
                  className={Module["BackBtn"]}
                  onClick={() => navigate(-1)}
                >
                  Back
                </button>
                {!submit &&
                  (inList ? (
                    <button
                      className={Module["Remove-button"]}
                      onClick={handleRemoveFromList}
                    >
                      Remove
                    </button>
                  ) : (
                    <button
                      className={Module["AddBtn"]}
                      onClick={handleAddToList}
                    >
                      Add to my List
                    </button>
                  ))}
              </div>
            )}
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
            <p>
              Here is a list of supervisors who will assist in developing this
              project, along with the publisher of this topic.
            </p>
            <ul className={Module["supervisors-list"]}>
              {card.supervisors?.length > 0 ? (
                card.supervisors.map((sv, i) => (
                  <li key={i}>
                    {sv.firstname} {sv.lastname}
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
                  <span className={Module["file-name"]}>
                    TechnicalSheet.pdf
                  </span>
                  <span className={Module["file-size"]}>
                    Size not available
                  </span>
                </div>
              </div>
              <img
                src={ArrowIcon}
                alt="Expand Arrow"
                className={Module["arrow-icon"]}
              />
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
