import React, { useState, useEffect, useRef } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import Sidebar from "../components/Sidebar";
import Navbar from "../components/NavBar";
import Toast from "../components/modals/Toast";
import Module from "../styles/StudentMeetingPage.module.css";
import { TeachergetUploadfile, StudentUploadfile } from "../components/Uploadfile";


// Skip ngrok warning if you're using ngrok
axios.defaults.headers.common["ngrok-skip-browser-warning"] = "true";

function SoutenanceStudentPage() {

    // onglet actif (active tab)
    const [activeTab, setActiveTab] = useState("soutenance informations");
    const navigate = useNavigate();

    const [toastMessage, setToastMessage] = useState("");
    const [showToast, setShowToast] = useState(false);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const [currentSessions, setCurrentSessions] = useState([]);
    const containerRef = useRef(null);

    // états pour les réunions (meetings)


    // récupération de l’utilisateur
    const [user] = useState(() => {
        const json = localStorage.getItem("user");
        return json ? JSON.parse(json) : {};
    });

    const role = user.role;







    // Fonction pour afficher le contenu selon l’onglet sélectionné
    const renderTabContent = () => {
       
            return (
                <div style={{ overflow: "auto", maxHeight: "69vh" }}>
                    <div className={Module["Week-meeting-container"]}>
                        <div className={Module["Left-side"]} style={{ margin: "3vh 0" }}>

                            <div className={Module["Left-side-header"]} >
                                Soutenance schudule
                            </div>
                            <div className={Module["Left-side-body"]}>
                                Stay informed about your thesis defense schedule, location and all essential soutenance details
                            </div>
                        </div>

                    </div>


                    <div>
                        <div >
                            <StudentUploadfile />
                            {role === "admin" && <TeachergetUploadfile />}
                        </div>
                    </div>
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
