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




    function formatDateToMMDD(dateString) {
        const date = new Date(dateString);
        const month = String(date.getMonth() + 1).padStart(2, "0");
        const day = String(date.getDate()).padStart(2, "0");
        return `${month}/${day}`;
    }



    // Fonction pour afficher le contenu selon l’onglet sélectionné
    const renderTabContent = () => {
        if (activeTab === "soutenance informations") {
            return (
                <div style={{ overflow: "auto", maxHeight: "69vh" }}>
                    <div className={Module["Week-meeting-container"]}>
                        <div className={Module["Left-side"]} style={{ margin: "3vh 0" }}>

                            <div className={Module["Left-side-header"]} >
                                Soutenance schudule
                            </div>
                            <div className={Module["Left-side-body"]}>
                                tay informed about your thesis defense schedule, location and all essential soutenance details
                            </div>
                        </div>
                        <div className={Module["Right-side"]} style={{ margin: "3vh 0 3vh auto" }} >
                            <div className={Style["table-wrapper"]} style={{ width: "40vw", marginRight: '5vw' }}>
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
                                        {Soutenanceschudule ? (
                                            <tr>
                                                <td>{formatDateToMMDD(Soutenanceschudule.date)}</td>
                                                <td>{Soutenanceschudule.time}</td>
                                                <td>{Soutenanceschudule.room}</td>

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

                    <div className={Style["table-wrapper"]} style={{ margin: "3vh 15px 3vh 15px" }}>

                        <div
                            className={Style.tableWrapper}
                            ref={containerRef}

                        >
                            <table>
                                <thead>
                                    <tr>
                                        <th>Jury id</th>
                                        <th>Full-name</th>
                                        <th>Email</th>
                                        <th>work status</th>

                                        <th></th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {currentItems.map((m) => (
                                        <tr key={m.id}>
                                            <td>{m.id}</td>
                                            <td>{m.Fullname}</td>
                                            <td>{m.email}</td>


                                            <td>{m.work_Status}</td>
                                            <td>

                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>


                    </div>
                    <div>
                        <div >
                            <StudentUploadfile title="Final deliverables" dic="You need to upload your final deliverables for your soutnance (zip file), this need to be uploaded before your soutnance started." />              </div>
                    </div>
                </div>
            );
        } else if (activeTab === "reports and mark") {
            return (
                <>
                    <div className={Module["Left-side"]} style={{ width: "100vw", marginTop: "-1vh" }} >

                        <div className={Module["Left-side-header"]}>
                            jury evaluation and remarks
                        </div>
                        <div className={Module["Left-side-body"]} style={{ textAlign: "start" }}>
                            see your final evaluation and remarks on your presentations.
                        </div>
                    </div>
                    <div className={Style["table-wrapper"]} style={{ margin: "0 15px 0 15px" }}>

                        <div
                            className={Style.tableWrapper}
                            ref={containerRef}

                        >
                            <table>
                                <thead>
                                    <tr>
                                        <th>team member</th>
                                        <th>jury 1 mark</th>
                                        <th>jury 2 mark</th>
                                        <th>jury 3 mark</th>
                                        <th>jury 4 mark</th>
                                        <th>average</th>
                                        <th></th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {marksData.map((m) => (
                                        <tr key={m.id}>
                                            <td>{m.team_member}</td>
                                            <td>{m.jury1}</td>
                                            <td>{m.jury2}</td>

                                            <td>{m.jury3}</td>

                                            <td>{m.jury4}</td>
                                            <td>
                                            <strong>{((m.jury1 + m.jury2 + m.jury3 + m.jury4) / 4).toFixed(0)}</strong>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>


                    </div>
                    <div>
                        <div >
                            <StudentUploadfile title="Final deliverables" dic="You need to upload your final deliverables for your soutnance (zip file), this need to be uploaded before your soutnance started." />              </div>
                    </div>
                </>
            );
        }
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

                    <div className={Style["tabs"]}>
                        {["soutenance informations", "reports and mark"].map((tab) => (
                            <div
                                key={tab}
                                className={`${Style["tab-item"]} ${activeTab === tab ? Style.active : ""}`}
                                onClick={() => setActiveTab(tab)}
                            >
                                {tab}
                            </div>
                        ))}
                    </div>



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
