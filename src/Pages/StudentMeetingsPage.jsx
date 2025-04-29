import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import Sidebar from "../components/Sidebar";
import Navbar from "../components/NavBar";

import Toast from "../components/modals/Toast";
import Style from "../styles/TeamFormationPage.module.css";
import Module from "../styles/StudentMeetingPage.module.css";
import StudentMeetingHistory from "../components/StudentMettingHistory";

// Skip ngrok warning if you're using ngrok
axios.defaults.headers.common["ngrok-skip-browser-warning"] = "true";

function StudentMeetingPage() {

    const navigate = useNavigate();
    const [toastMessage, setToastMessage] = useState("");
    const [showToast, setShowToast] = useState(false);
    const [searchQuery, setSearchQuery] = useState("");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    // + state for fetched meetings
    const [meetings, setMeetings] = useState([]);
    const [nextMeeting, setNextMeeting] = useState(null);
    const [user, setUser] = useState(() => {
        const json = localStorage.getItem("user");
        return json ? JSON.parse(json) : {};
    });
    const SeeMoreHandle = (e, Item) => {
        e.stopPropagation();
        // pass both the clicked item and the full currentItems list
        navigate("/StudentMeetingsPage/SeeMore", {
            state: { item: Item }
        });
    };
    const session = {
        title: "TOPIC_SELECTION",
        targetDate: {
            start: new Date("2025-03-29T00:00:00"),
            end: new Date("2025-04-29T23:59:59")
        }
    };
    function formatDateToMMDD(dateString) {
        const date = new Date(dateString);
        const month = (date.getMonth() + 1).toString().padStart(2, '0');
        const day = date.getDate().toString().padStart(2, '0');
        return `${month}/${day}`;
    }



    const teamId = user.team_id;
    // + fetch meetings on mount
    useEffect(() => {
        setLoading(true);
        // fetch all meetings
        axios.get(`/mettings/getAllMeetings/${teamId}`)
            .then(res => {
                setMeetings(res.data.data.meetings);
            })
            .catch(err => setError("Failed to load meeting history"))
            .finally(() => setLoading(false));
            // fetch next meeting
            axios.get(`/mettings/getNextMeet/${teamId}`)
            .then(res => {
                setNextMeeting(res.data.data.nextMeeting);
            })
            .catch(err => { });
    }, []);
    /*   const weekmeeting = {
          date: "2025-03-29",
          time: "13:00",
          room: "TP06"
      }; */
    /* const MeetingHistoryList = [
        { id: "01", date: "2025-03-21T00:00:00", time: "13:30", salle: "TP06", work: "unfinished", status: "unfinished", pdf: "qwertyuioqeqweqwe", note: "10/10" },
        { id: "02", date: "2025-03-29T00:00:00", time: "19:00", salle: "TP6", work: "approved", status: "unfinished" },
        { id: "03", date: "2025-03-16T00:00:00", time: "13:30", salle: "TP06", work: "unfinished", status: "unfinished" },
        { id: "04", date: "2025-03-15T00:00:00", time: "13:30", salle: "TP06", work: "approved", status: "approved" },
        { id: "05", date: "2025-03-10T00:00:00", time: "13:30", salle: "TP06", work: "unfinished", status: "unfinished" },
        { id: "06", date: "2025-03-08T00:00:00", time: "13:30", salle: "TP06", work: "approved", status: "approved" },
        { id: "07", date: "2025-03-08T00:00:00", time: "13:30", salle: "TP06", work: "approved", status: "approved" },
        { id: "08", date: "2025-03-05T00:00:00", time: "14:00", salle: "TP07", work: "in progress", status: "unfinished" },
        { id: "09", date: "2025-03-04T00:00:00", time: "15:00", salle: "TP08", work: "in progress", status: "unfinished" },
        { id: "10", date: "2025-03-03T00:00:00", time: "16:00", salle: "TP09", work: "approved", status: "approved" },
        { id: "11", date: "2025-03-02T00:00:00", time: "17:00", salle: "TP10", work: "unfinished", status: "unfinished" },
        { id: "12", date: "2025-03-01T00:00:00", time: "18:00", salle: "TP11", work: "approved", status: "approved" },
        { id: "13", date: "2025-02-28T00:00:00", time: "19:00", salle: "TP12", work: "in progress", status: "unfinished" },
        { id: "14", date: "2025-02-27T00:00:00", time: "20:00", salle: "TP13", work: "approved", status: "approved" },
        { id: "15", date: "2025-02-26T00:00:00", time: "21:00", salle: "TP14", work: "unfinished", status: "unfinished" },
        { id: "16", date: "2025-02-25T00:00:00", time: "22:00", salle: "TP15", work: "approved", status: "approved" },
        { id: "17", date: "2025-02-24T00:00:00", time: "23:00", salle: "TP16", work: "in progress", status: "unfinished" },
        { id: "18", date: "2025-02-23T00:00:00", time: "12:00", salle: "TP17", work: "approved", status: "approved" },
        { id: "19", date: "2025-02-22T00:00:00", time: "11:00", salle: "TP18", work: "unfinished", status: "unfinished" },
        { id: "20", date: "2025-02-21T00:00:00", time: "10:00", salle: "TP19", work: "approved", status: "approved" },
        { id: "21", date: "2025-02-20T00:00:00", time: "09:00", salle: "TP20", work: "in progress", status: "unfinished" },
        { id: "22", date: "2025-02-19T00:00:00", time: "08:00", salle: "TP21", work: "approved", status: "approved" },
        { id: "23", date: "2025-02-18T00:00:00", time: "07:00", salle: "TP22", work: "unfinished", status: "unfinished" },
        { id: "24", date: "2025-02-17T00:00:00", time: "06:00", salle: "TP23", work: "approved", status: "approved" },
        { id: "25", date: "2025-02-16T00:00:00", time: "05:00", salle: "TP24", work: "in progress", status: "unfinished" },
        { id: "26", date: "2025-02-15T00:00:00", time: "04:00", salle: "TP25", work: "approved", status: "approved" },
        { id: "27", date: "2025-02-14T00:00:00", time: "03:00", salle: "TP26", work: "unfinished", status: "unfinished" },
        { id: "28", date: "2025-02-13T00:00:00", time: "02:00", salle: "TP27", work: "approved", status: "approved" },
    ]; */


    let sessionTitle;

    if (session.title === "TEAM_CREATION") {
        sessionTitle = "Group formation session";
    } else if (session.title === "TOPIC_SELECTION") {
        sessionTitle = "Select topics session";
    } else {
        sessionTitle = "Unknown session";
    }

    return (
        <div className={Module["Student-meeting-page"]}>
            <Sidebar />
            <div style={{ marginLeft: "16vw" }}>
                <Navbar
                    title={sessionTitle}
                    targetDate={session.targetDate}

                />

                <div className={Module["Student-meeting-container"]}>
                    <div className={Module["header-row"]}>
                        <h1>Meetings</h1>
                    </div>

                    <div className={Module["Week-meeting-container"]}>
                        <div className={Module["Left-side"]}>
                            <div className={Module["Left-side-header"]}>
                                This week meeting
                            </div>
                            <div className={Module["Left-side-body"]}>
                                Schedule a New Meeting: Set the date, time, objectives, and room to plan your next supervision session.
                            </div>
                        </div>
                        <div className={Module["Right-side"]}>
                            <div className={Style["table-wrapper"]} >
                                <table  >
                                    <thead>
                                        <tr>
                                            <th style={{ paddingRight: "50px" }}>Date</th>
                                            <th style={{ paddingRight: "50px" }}>Time</th>
                                            <th style={{ paddingRight: "50px" }}>Salle</th>
                                            <th ></th>
                                        </tr>
                                    </thead>
                                    <tbody>

                                        {nextMeeting ? (
                                            <tr>
                                                <td>{formatDateToMMDD(nextMeeting.date)}</td>
                                                <td>{nextMeeting.time}</td>
                                                <td>{nextMeeting.room}</td>
                                                <td>
                                                    <button onClick={(e) => SeeMoreHandle(e, nextMeeting)} className={Module["SeeBtn"]} style={{padding:"8px 20px"}}>
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

                        {/* + pass the fetched meetings array */}
                        <StudentMeetingHistory MeetingHistoryList={meetings} loading={loading} error={error} />

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
    );
}

export default StudentMeetingPage;
