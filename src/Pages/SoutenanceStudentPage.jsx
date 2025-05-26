import React, { useState, useEffect, useRef } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import Sidebar from "../components/Sidebar";
import Navbar from "../components/NavBar";
import Toast from "../components/modals/Toast";
import Style from "../styles/TeamFormationPage.module.css";
import Module from "../styles/StudentMeetingPage.module.css";
import formatSessions from "../utils/formatSessions";
import { StudentUploadfile } from "../components/Uploadfile";
const Soutenanceschudule =
{
    date: "2025-06-01",
    time: "10:00",
    room: "Room A1"
}
const currentItems = [
    {
        id: "01",
        Fullname: "Dr. Nadia Bensalem",
        email: "karim.bouzid@usthb.dz",
        work_Status: "Supervisor"
    },
    {
        id: "02",
        Fullname: "Prof. Karim Bouzid",
        email: "nadia.bensalem@univ-msila.dz",
        work_Status: "Co-supervisor"
    },
    {
        id: "04",
        Fullname: "Dr. Samir Haddad",
        email: "samir.haddad@univ-oran.dz",
        work_Status: "Extern"
    },
    {
        id: "05",
        Fullname: "Prof. Leïla Merabet",
        email: "leila.merabet@univ-setif.dz",
        work_Status: "Extern"
    }
];

const marksData = [
    {
        team_member: "Dr. Imène Sahraoui",
        jury1: 12,
        jury2: 12,
        jury3: 12,
        jury4: 12
    },
    {
        team_member: "Prof. Adel Mansouri",
        jury1: 14,
        jury2: 14,
        jury3: 14,
        jury4: 14
    },
    {
        team_member: "Dr. Nacira Boumediene",
        jury1: 13,
        jury2: 13,
        jury3: 13,
        jury4: 13
    },
    {
        team_member: "Prof. Sofiane Meziane",
        jury1: 15,
        jury2: 15,
        jury3: 15,
        jury4: 15
    }
];


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

    const teamId = user.team_id;







 

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

                  

                    {showToast && (
                        <Toast message={toastMessage} onClose={() => setShowToast(false)} />
                    )}
                </div>
            </div>
        </div>
    );
}

export default SoutenanceStudentPage;
