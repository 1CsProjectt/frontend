import React, { useState, useEffect, useRef } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import Sidebar from "../components/Sidebar";
import Navbar from "../components/NavBar";
import Toast from "../components/modals/Toast";
import Module from "../styles/StudentMeetingPage.module.css";
import Uploadfile from "../components/modals/uploadbox";
import { GetUploadfile } from "../components/GetUploadfile"; // adjust the path if necessary

// Skip ngrok warning if you're using ngrok
axios.defaults.headers.common["ngrok-skip-browser-warning"] = "true";

function SoutenanceStudentPage() {
  const [user] = useState(() => {
    const json = localStorage.getItem("user");
    return json ? JSON.parse(json) : {};
  });

  const role = user.role;
  // onglet actif (active tab)
  const yearToIndexMap = {
    "2CP": 0,
    "1CS": 1,
    "2CS": 2,
    "3CS": 3,
  };
  const gradeLabels = ["2CP", "1CS", "2CS", "3CS"];
  const [nouncefiles, setNounceFiles] = useState([
    null, // 2CP
    null, // 1CS
    null, // 2CS
    null, // 3CS
  ]);
  const [activeTab, setActiveTab] = useState("soutenance informations");
  const navigate = useNavigate();

  const [toastMessage, setToastMessage] = useState("");
  const [showToast, setShowToast] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [currentSessions, setCurrentSessions] = useState([]);
  const containerRef = useRef(null);
  const [pdfFile, setPdfFile] = useState(null);
  // états pour les réunions (meetings)
  useEffect(() => {
    if (role === "student") {
      setLoading(true);
      setError("");

      axios
        .get("/soutenances/student")
        .then((res) => {
          const url = res.data.planning.soutplanning;
          if (url) {
            setPdfFile(url);
            console.log("PDF URL:", url);
          } else {
            setError("PDF URL not found in response.");
          }
        })
        .catch((err) => {
          console.error(err);
          setError("Failed to load schedule: " + err.message);
        })
        .finally(() => {
          setLoading(false);
        });
    }
  }, [role]); // Only fetch if role is student

  useEffect(() => {
    const fetchFiles = async () => {
      try {
        const response =
          role === "teacher"
            ? await axios.get("/soutenances/teacher")
            : await axios.get("/soutenances/student");

        const yearToIndexMap = {
          "2CP": 0,
          "1CS": 1,
          "2CS": 2,
          "3CS": 3,
        };

        const updatedFiles = [null, null, null, null];

        // Use .planning always as per response structure
        const planningArray = response.data.planning;

        if (Array.isArray(planningArray)) {
          planningArray.forEach((item) => {
            const index = yearToIndexMap[item.year];
            if (index !== undefined && item.soutplanning) {
              updatedFiles[index] = {
                year: item.year,
                url: item.soutplanning,
              };
            }
          });
        }

        setNounceFiles(updatedFiles);
      } catch (error) {
        console.error("Error fetching soutenance planning files:", error);
      }
    };

    fetchFiles();
  }, [role]);

  console.log("files hnaaaaaaaaaaaaaaaaaaaaaaaaaaaa", nouncefiles);
  // include `role` as a dependency if it may change

  // récupération de l’utilisateur

  // Fonction pour afficher le contenu selon l’onglet sélectionné
  const renderTabContent = () => {
    return (
      <div style={{ overflow: "auto", maxHeight: "69vh" }}>
        {role === "teacher" && (
          <>
            <div className={Module["Week-meeting-container"]}>
              <div className={Module["Left-side"]} style={{ margin: "3vh 0" }}>
                <div className={Module["Left-side-header"]}>
                  Soutenance schudule
                </div>
                <div className={Module["Left-side-body"]}>
                  Stay informed about your thesis defense schedule, location and
                  all essential soutenance details
                </div>
              </div>
            </div>

            <div>
              {nouncefiles.map((file, index) =>
                file ? (
                  <div key={index}>
                    <p>{file.year}</p>
                    <Uploadfile type="pdf" pdfFil={file.url} status={false} />
                  </div>
                ) : null
              )}
            </div>
          </>
        )}
        {role === "student" && (
          <div
            className={Module["Student-meeting-page"]}
            style={{ width: "100%" }}
          >
            <div>
              <div className={Module["Student-meeting-container"]}>
                <div className={Module["header-row"]}>
                  <h1>Soutenance</h1>
                </div>

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
                        Welcome to the official Soutenance schedule page.
                        <br></br>
                        Here, you will find all the information related to the
                        presentation sessions for student projects and final
                        year theses.
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
                    {loading && <p>Loading schedule…</p>}
                    {error && <p style={{ color: "red" }}>{error}</p>}
                    {!loading && !error && <GetUploadfile pdfFile={pdfFile} />}
                  </div>
                </div>

                {showToast && (
                  <Toast
                    message={toastMessage}
                    onClose={() => setShowToast(false)}
                  />
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    );
  };

  return (
    <div className={Module["Student-meeting-page"]}>
      <Sidebar />
      <div style={{ marginLeft: "16vw" }}>
        <Navbar
          title={currentSessions[0]?.sessionTitle}
          targetDate={currentSessions[0]?.targetDate}
        />

        <div className={Module["Student-meeting-container"]}>
          <div className={Module["header-row"]}>
            <h1>Soutenance</h1>
          </div>

          {/* Onglets (tabs) */}

          {/* Contenu de l’onglet actif */}
          {renderTabContent()}

          {showToast && (
            <Toast message={toastMessage} onClose={() => setShowToast(false)} />
          )}
        </div>
      </div>
    </div>
  );
}

export default SoutenanceStudentPage;
