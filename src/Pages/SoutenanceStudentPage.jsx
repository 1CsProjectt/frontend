import React, { useState, useEffect, useRef } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import Sidebar from "../components/Sidebar";
import Navbar from "../components/NavBar";
import Toast from "../components/modals/Toast";
import Module from "../styles/StudentMeetingPage.module.css";
import Uploadfile from "../components/modals/uploadbox";
import { GetUploadfile } from "../components/GetUploadfile";

// Skip ngrok warning if you're using ngrok
axios.defaults.headers.common["ngrok-skip-browser-warning"] = "true";

function SoutenancePage() {
  // Récupération de l’utilisateur (user)
  const [user] = useState(() => {
    const json = localStorage.getItem("user");
    return json ? JSON.parse(json) : {};
  });
  const role = user.role; // "teacher" ou "student"

  // Map des promotions (grade) vers un index d’onglet
  const yearToIndexMap = { "2CP": 0, "1CS": 1, "2CS": 2, "3CS": 3 };
  const gradeLabels = ["2CP", "1CS", "2CS", "3CS"];
  const [announceFiles, setAnnounceFiles] = useState([null, null, null, null]);
  const [activeTab, setActiveTab] = useState(gradeLabels[0]); // onglet actif (active tab)

  const [toastMessage, setToastMessage] = useState("");
  const [showToast, setShowToast] = useState(false);
  const containerRef = useRef(null);

  // Chargement des fichiers de planning (schedule files)
  useEffect(() => {
    const fetchFiles = async () => {
      try {
        const endpoint =
          role === "teacher"
            ? "/soutenances/teacher"
            : "/soutenances/student";
        const response = await axios.get(endpoint);

        const planningArray = response.data.planning || [];
        const updated = [null, null, null, null];

        planningArray.forEach((item) => {
          const idx = yearToIndexMap[item.year];
          if (idx !== undefined && item.soutplanning) {
            updated[idx] = { year: item.year, url: item.soutplanning };
          }
        });

        setAnnounceFiles(updated);
      } catch (err) {
        console.error("Erreur de chargement du planning (schedule):", err);
      }
    };

    fetchFiles();
  }, [role]);

  // Contenu pour l’enseignant (teacher)
  const renderTeacher = () => (
    <div style={{ overflow: "auto", maxHeight: "69vh" }}>
      <div className={Module["Week-meeting-container"]}>
        <div className={Module["Left-side"]} style={{ margin: "3vh 0" }}>
          <div className={Module["Left-side-header"]}>
            Soutenance schedule
          </div>
          <div className={Module["Left-side-body"]}>
            Stay informed about your thesis defense schedule, location and all essential soutenance details.
          </div>
        </div>
      </div>

      <div>
        {announceFiles.map((file, i) =>
          file ? (
            <div key={i}>
              <p>{file.year}</p>
              <Uploadfile type="pdf" pdfFile={file.url} status={false} />
            </div>
          ) : null
        )}
      </div>
    </div>
  );

  // Contenu pour l’étudiant (student)
  const renderStudent = () => (
    <div style={{ overflow: "auto", maxHeight: "69vh" }}>
      <div className={Module["Week-meeting-container"]}>
        <div
          className={Module["Left-side"]}
          style={{ margin: "3vh 0", width: "50%" }}
        >
          <div className={Module["Left-side-header"]}>
            Soutenance schedule
          </div>
          <div className={Module["Left-side-body"]}>
            Welcome to the official Soutenance schedule page.<br />
            Here, you will find all the information related to the presentation sessions for student projects and final year theses.
          </div>
        </div>
      </div>

      <div
        style={{
          display: "flex",
          justifyContent: "center",
          marginTop: "12vh",
        }}
      >
        {announceFiles[yearToIndexMap[activeTab]] ? (
          <GetUploadfile pdfFile={announceFiles[yearToIndexMap[activeTab]].url} />
        ) : (
          <p>No schedule available for {activeTab}</p>
        )}
      </div>
    </div>
  );

  return (
    <div className={Module["Student-meeting-page"]}>
      <Sidebar />
      <div style={{ marginLeft: "16vw" }}>
        <Navbar title="Soutenance" />

        <div className={Module["Student-meeting-container"]}>
          <div className={Module["header-row"]}>
            <h1>Soutenance</h1>
          </div>

          {/* Onglets (tabs) pour étudiant uniquement */}
          {role === "student" && (
            <div className={Module["Tabs"]}>
              {gradeLabels.map((label) => (
                <button
                  key={label}
                  className={
                    label === activeTab
                      ? Module["Tab-active"]
                      : Module["Tab"]
                  }
                  onClick={() => setActiveTab(label)}
                >
                  {label}
                </button>
              ))}
            </div>
          )}

          {/* Affichage conditionnel selon le rôle */}
          {role === "teacher" ? renderTeacher() : renderStudent()}

          {showToast && (
            <Toast
              message={toastMessage}
              onClose={() => setShowToast(false)}
            />
          )}
        </div>
      </div>
    </div>
  );
}

export default SoutenancePage;

