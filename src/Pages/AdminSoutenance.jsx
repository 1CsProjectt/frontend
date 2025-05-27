import React, { useState, useEffect, useRef } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import Sidebar from "../components/Sidebar";
import Navbar from "../components/NavBar";
import Toast from "../components/modals/Toast";
import Module from "../styles/AdminSoutenance.module.css";
import { TeachergetUploadfile, StudentUploadfile } from "../components/Uploadfile";
import AdminSidebar from "../components/AdminSidebar";
import AdminUploadModal from "../components/modals/AdminUploadModal";
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
    const [showUploadModal, setShowUploadModal] = useState(false);
    // états pour les réunions (meetings)


    // récupération de l’utilisateur
    const [user] = useState(() => {
        const json = localStorage.getItem("user");
        return json ? JSON.parse(json) : {};
    });

    const role = user.role;







 

    return (
        <div className={Module["Student-meeting-page"]}>
           
            <div >
                <Navbar
                    title={currentSessions[0]?.sessionTitle}
                    targetDate={currentSessions[0]?.targetDate}
                />

                <div className={Module["Student-meeting-container"]}>
                    <div className={Module["header-row"]}>
                        <h1>Soutenance</h1>
                    </div>
                    <div>

                    </div>
                    
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
                    
                    <div className={Module["add-container"]}>
                        <p>Deposit a Soutenance Pdf sheet for each year</p>
                        <button
                                  onClick={() => {
                                    setShowUploadModal(true);
                                    {console.log("Modal show state:", showUploadModal)}
                                  }}
                                  className={Module["add-btn"]}
                                >
                                Add a Soutenance PDF sheet
                                </button>
                    </div>
                </div>
                    {showToast && (
                        <Toast message={toastMessage} onClose={() => setShowToast(false)} />
                    )}
                </div>
            </div>
            <AdminUploadModal
                isOpen={showUploadModal}
                onClose={() => setShowUploadModal(false)}
                onSuccess={() => {
                    
                }} 
                />
        </div>
    );
}

export default SoutenanceStudentPage;
