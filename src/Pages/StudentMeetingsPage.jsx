import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import Sidebar from "../components/Sidebar";
import Navbar from "../components/NavBar";
import Toast from "../components/modals/Toast";
import Style from "../styles/TeamFormationPage.module.css";
import Module from "../styles/StudentMeetingPage.module.css";
import StudentMeetingHistory from "../components/StudentMettingHistory"; // corrected import name
import formatSessions from "../utils/formatSessions";

// Skip ngrok warning if you're using ngrok
axios.defaults.headers.common["ngrok-skip-browser-warning"] = "true";

function StudentMeetingPage() {
    const status = "ready"
    // onglet actif (active tab)
    const [activeTab, setActiveTab] = useState("My meetings");
    const navigate = useNavigate();

    const [toastMessage, setToastMessage] = useState("");
    const [showToast, setShowToast] = useState(false);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const [currentSessions, setCurrentSessions] = useState([]);

    // états pour les réunions (meetings)
    const [meetings, setMeetings] = useState([]);
    const [nextMeeting, setNextMeeting] = useState(null);

    // récupération de l’utilisateur
    const [user] = useState(() => {
        const json = localStorage.getItem("user");
        return json ? JSON.parse(json) : {};
    });

    const teamId = user.team_id;

    // navigation vers la page "see more"
    const SeeMoreHandle = (e, item) => {
        e.stopPropagation();
        navigate("/StudentMeetingsPage/SeeMore", { state: { item } });
    };

    function formatDateToMMDD(dateString) {
        const date = new Date(dateString);
        const month = String(date.getMonth() + 1).padStart(2, "0");
        const day = String(date.getDate()).padStart(2, "0");
        return `${month}/${day}`;
    }

    // Chargement des données au montage
    useEffect(() => {
        setLoading(true);
        // fetch all meetings
        axios
            .get(`/mettings/getAllMeetings/${teamId}`)
            .then((res) => {
                setMeetings(res.data.data.meetings);
                if (res.data.currentSessions) {
                    const processed = formatSessions(res.data.currentSessions);
                    setCurrentSessions(processed);
                }
            })
            .catch(() => setError("Failed to load meeting history"))
            .finally(() => setLoading(false));

        // fetch next meeting
        axios
            .get(`/mettings/getNextMeet/${teamId}`)
            .then((res) => setNextMeeting(res.data.data.nextMeeting))
            .catch(() => { });
    }, [teamId]);

    // Fonction pour afficher le contenu selon l’onglet sélectionné
    const renderTabContent = () => {
        if (activeTab === "My meetings") {
            return (
                <>
                    <div className={Module["Week-meeting-container"]}>
                        <div className={Module["Left-side"]}>
                            <div className={Module["Left-side-header"]}>
                                This week meeting
                            </div>
                            <div className={Module["Left-side-body"]}>
                                Schedule a New Meeting: Set the date, time, objectives, and room to
                                plan your next supervision session.
                            </div>
                        </div>
                        <div className={Module["Right-side"]}>
                            <div className={Style["table-wrapper"]}>
                                <table>
                                    <thead>
                                        <tr>
                                            <th style={{ paddingRight: "50px" }}>Date</th>
                                            <th style={{ paddingRight: "50px" }}>Time</th>
                                            <th style={{ paddingRight: "50px" }}>Salle</th>
                                            <th></th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {nextMeeting ? (
                                            <tr>
                                                <td>{formatDateToMMDD(nextMeeting.date)}</td>
                                                <td>{nextMeeting.time}</td>
                                                <td>{nextMeeting.room}</td>
                                                <td>
                                                    <button
                                                        onClick={(e) => SeeMoreHandle(e, nextMeeting)}
                                                        className={Module["SeeBtn"]}
                                                        style={{ padding: "8px 20px" }}
                                                    >
                                                        see
                                                    </button>
                                                </td>
                                            </tr>
                                        ) : (
                                            <tr>
                                                <td colSpan={4}>No upcoming meetings.</td>
                                            </tr>
                                        )}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>

                    <div className={Module["MeetingsHistory"]} style={{ padding: "20px" }}>
                        <div className={Module["MeetingsHistory-header"]}>
                            Meetings History
                        </div>
                        <StudentMeetingHistory
                            MeetingHistoryList={meetings}
                            loading={loading}
                            error={error}
                        />
                    </div>
                </>
            );
        } else if (activeTab === "Soutenance decision") {
            return (
                <>
                    <div className={Module["headerSoutnance"]} >
                        This week meeting
                    </div>
                    <div className={Module["headerSoutnanceList"]} >
                        <ul >
                            <li>
                                Welcome to the soutenance decision section where you can see if your teacher has confirmed you’re ready for the soutenance.
                            </li>
                            <li>
                                Teams confirmed earlier will be given scheduling priority.
                            </li>
                            <li>
                                The place, time, and jury assignments will be set after this session ends in a new panel, and you and your team will be notified.
                            </li>
                            <li>
                                You need to upload your final deliverables before the soutenance starts and after confirmation from your supervisor.
                            </li>
                        </ul>
                    </div>
                    <div className={Module["Supervisor-decision"]}>
                        <div className={Module["Lside"]}> 
                            Supervisor decision
                        </div>
                        <div  
                        className={Module["Rside"]}
                            style={{
                                color: status === "ready" ? "#34B102" : "inherit"
                            }}
                        >
                            {status === "ready" ? "You are ready for the soutenance" : "You are not ready yet"}
                        </div>
                    </div>
                </>
            );
        }
    };

    return (
      <div>
        <div className={Module["Student-meeting-page"]}>
            <Sidebar />
            <div style={{ marginLeft: "16vw" }}>
                <Navbar
                    title={currentSessions[0]?.sessionTitle}
                    targetDate={currentSessions[0]?.targetDate}
                />

                <div className={Module["Student-meeting-container"]}>
                    <div className={Module["header-row"]}>
                        <h1>Meetings</h1>
                    </div>

                    {/* Onglets (tabs) */}
                    {currentSessions[0]?.sessionTitle === "WORK STARTING session" ? (
                        <div className={Style["tabs"]}>
                            {["My meetings", "Soutenance decision"].map((tab) => (
                                <div
                                    key={tab}
                                    className={`${Style["tab-item"]} ${activeTab === tab ? Style.active : ""}`}
                                    onClick={() => setActiveTab(tab)}
                                >
                                    {tab}
                                </div>
                            ))}
                        </div>
                    ) : null}


                    {/* Contenu de l’onglet actif */}
                    {renderTabContent()}

                    {showToast && (
                        <Toast message={toastMessage} onClose={() => setShowToast(false)} />
                    )}
                </div>
            </div>
            
          </div>
          
        
        </div>
    
  );
}

export default StudentMeetingPage;
