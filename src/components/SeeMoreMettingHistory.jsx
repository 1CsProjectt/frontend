
// ExplorePage.jsx
import React, { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import Sidebar from "../components/Sidebar";
import Navbar from "../components/NavBar";
import { TeachergetUploadfile, StudentUploadfile } from "./Uploadfile";
import Module from "../styles/StudentMeetingPage.module.css";



import Toast from "../components/modals/Toast";
import Style from "../styles/TeamFormationPage.module.css";

function formatDateToMMDD(dateString) {
  const date = new Date(dateString);
  const month = (date.getMonth() + 1).toString().padStart(2, '0');
  const day = date.getDate().toString().padStart(2, '0');
  return `${month}/${day}`;
}
const session = {
  title: "TOPIC_SELECTION",
  targetDate: {
    start: new Date("2025-03-29T00:00:00"),
    end: new Date("2025-04-29T23:59:59")
  }
};




let sessionTitle;

if (session.title === "TEAM_CREATION") {
  sessionTitle = "Group formation session";
} else if (session.title === "TOPIC_SELECTION") {
  sessionTitle = "Select topics session";
} else {
  sessionTitle = "Unknown session";
}

export default function SeeMoreMettingHistory() {
  const location = useLocation();
  const navigate = useNavigate();
  const { item, currentItems } = location.state;

  const [toastMessage, setToastMessage] = useState("");
  const [showToast, setShowToast] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  if (!item) {
    return (
      <div>
        <p>No project data available.</p>
        <button onClick={() => navigate(-1)}>Go Back</button>
      </div>
    );
  }



  return (
    <div className={Module["explore-page"]}>
      <Sidebar />
      <div className={Module["explore-content"]}>
        <div style={{ marginLeft: "16vw" }}>
          <Navbar title={sessionTitle}
            targetDate={session.targetDate} />

          <div className={Module["Student-meeting-container"]}>
            <div className={Module["header-row"]}>
              <h1>Meetings</h1>
              <div>
                <button className={Module["SeeBtn"]} style={{padding:"12px 65px" ,marginRight:"2vw"}} onClick={() => navigate(-1)}>Back</button>
              </div>
            </div>
            <div className={Module["Scroll"]}>
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
                        <tr>
                          <td style={{ paddingRight: "50px" }}>{formatDateToMMDD(item.date)}  </td>
                          <td style={{ paddingRight: "50px" }}>{item.time}  </td>
                          <td style={{ paddingRight: "50px" }}>{item.room}</td>
                          <td className={Module.W500} style={{ textAlign: "center", verticalAlign: "middle" }}> <div style={{ padding: "20px 85px", marginLeft: "90px" }}> </div></td>
                        </tr>
                        <tr>
                          <td ></td>
                          <td ></td>
                          <td ></td>
                          <td ></td>

                        </tr>
                      </tbody>
                    </table>
                  </div>

                </div>
              </div>
              <div className={Module["file-container"]}>
                <div className={Module["file-container-header"]}>
                  <h2>Starting files</h2>
                </div>

                <div className={Module["MettingObj"]} Style={{ margin: "20px 0 10px 0" }}>
                  <TeachergetUploadfile title={"Meeting objectives"} dic={"Schedule a New Meeting: Set the date, time, objectives, and room to plan your next supervision session."} pdfFile={item.status} />
                </div>
                <div className={Module["Supportfiles"]} Style={{ margin: "20px 0 10px 0" }}>
                  <TeachergetUploadfile title={"Support files"} dic={"Schedule a New Meeting: Set the date, time, objectives, and room to plan your next supervision session."} />
                </div>
                <div className={Module["Teamdeliverables"]} Style={{ margin: "20px 0 10px 0" }}>
                  <StudentUploadfile title="Team deliverables" dic="Schedule a New Meeting: Set the date, time, objectives, and room to plan your next supervision session." />              </div>
                <div className={Module["Myreviewfordeliverables"]} Style={{ margin: "20px 0 10px 0" }}>
                  <TeachergetUploadfile title={"My review for deliverables"} dic={"Schedule a New Meeting: Set the date, time, objectives, and room to plan your next supervision session."} />
                </div>
                <div className={Module["Meetingpv"]} Style={{ margin: "20px 0 10px 0" }}>
                  <StudentUploadfile title="Meeting pv" dic="Schedule a New Meeting: Set the date, time, objectives, and room to plan your next supervision session." />
                </div>
                <div className={Module["Meetingreview"]}  style={{marginBottom: "2vw"}}>
                
                    <div className={Module["Review-info"]} >
                      <div className={Module["Title"]}  >
                        Meeting review
                      </div>
                      <div className={Module["Note"]}>

                        {item.note ? (
                          item.note
                        ) : (
                          "- - - - - - - - -"
                        )}
                      </div>
                    </div>
                 
                </div>

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
    </div>
  );
}


