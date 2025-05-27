// ExplorePage.jsx
import React, { useState, useEffect, useRef } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import Sidebar from "../components/Sidebar";
import Navbar from "../components/NavBar";
import { TeachergetUploadfile, StudentUploadfile } from "./Uploadfile";
import Module from "../styles/StudentMeetingPage.module.css";
import Uploadfile from "./modals/uploadbox";
import Toast from "../components/modals/Toast";
import Style from "../styles/TeamFormationPage.module.css";
import axios from "axios";

function formatDateToMMDD(dateString) {
  const date = new Date(dateString);
  const month = (date.getMonth() + 1).toString().padStart(2, "0");
  const day = date.getDate().toString().padStart(2, "0");
  return `${month}/${day}`;
}
const session = {
  title: "TOPIC_SELECTION",
  targetDate: {
    start: new Date("2025-03-29T00:00:00"),
    end: new Date("2025-04-29T23:59:59"),
  },
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
  const { item, currentItems } = location.state || {};

  const [supportfile, setSupportFile] = useState(null);
  const [reviewfile, setReviewFile] = useState(null);
  const [pvfile, setPvFile] = useState(null);
  const [onbtn, setOnbtn] = useState(false);
  const [objfile, setObjectFile] = useState(null);
  const [deliverablesFile, setDeliverablesFile] = useState(null);
  const deliverref = useRef(null);
  const pvref = useRef(null);

  useEffect(() => {
    if (item) {
      setObjectFile(item.Meeting_objectives_files || null);
      setSupportFile(item.Support_files || null);
      setPvFile(item.Meeting_pv_files || null);
      setDeliverablesFile(item.Team_deliverables_files || null);
      setReviewFile(item.My_review_for_deliverables_files || null);
      if (item.Meeting_pv_files) {
        setOnbtn(true);
      }
    }
  }, [item]);
  console.log("hahiya onbtn", onbtn);
  const [toastMessage, setToastMessage] = useState("");
  const [showToast, setShowToast] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleFileUpload = (event, setFileState) => {
    const file = event.target.files[0];
    if (file?.type === "application/pdf") {
      setFileState(file);
      console.log("the selected file ", file);
    } else {
      alert("Please upload a valid PDF file.");
    }
  };
  const handleEditMeeting = async () => {
    setLoading(true);

    try {
      const formDataToSend = new FormData();

      // Append files only if they are File instances
      if (deliverablesFile instanceof File) {
        formDataToSend.append("Team_deliverables_files", deliverablesFile);
      }
      if (pvfile instanceof File) {
        formDataToSend.append("Meeting_pv_files", pvfile);
      }

      const response = await axios.patch(
        `/mettings/updateMeeting/${item.id}`,
        formDataToSend,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );

      if (response.data?.status === "success") {
        setToastMessage("File sent successfully!");
      } else {
        setToastMessage("Unexpected response from server.");
      }
    } catch (err) {
      console.error("Update failed:", err.response?.data || err.message);
      setToastMessage(
        err.response?.data?.message || "Failed to update meeting"
      );
    } finally {
      setLoading(false);
      setShowToast(true);
    }
  };

  const handleDelechange = (e) => handleFileUpload(e, setDeliverablesFile);
  const handlepvchange = (e) => handleFileUpload(e, setPvFile);

  if (!item) {
    return (
      <div>
        <p>No project data available.</p>
        <button onClick={() => navigate(-1)}>Go Back</button>
      </div>
    );
  }
  console.log("pvfile ", pvfile);
  console.log("pvfile ", supportfile);
  return (
    <div className={Module["explore-page"]}>
      <Sidebar />
      <div className={Module["explore-content"]}>
        <div style={{ marginLeft: "16vw" }}>
          <Navbar title={sessionTitle} targetDate={session.targetDate} />

          <div className={Module["Student-meeting-container"]}>
            <div className={Module["header-row"]}>
              <h1>Meetings</h1>
              <div>
                <button
                  className={Module["SeeBtn"]}
                  style={{ padding: "12px 65px", marginRight: "2vw" }}
                  onClick={() => navigate(-1)}
                >
                  Back
                </button>
              </div>
            </div>
            <div className={Module["Scroll"]}>
              <div className={Module["Week-meeting-container"]}>
                <div className={Module["Left-side"]}>
                  <div className={Module["Left-side-header"]}>
                    This week meeting
                  </div>
                  <div className={Module["Left-side-body"]}>
                    Schedule a New Meeting: Set the date, time, objectives, and
                    room to plan your next supervision session.
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
                        <tr>
                          <td style={{ paddingRight: "50px" }}>
                            {formatDateToMMDD(item.date)}{" "}
                          </td>
                          <td style={{ paddingRight: "50px" }}>{item.time} </td>
                          <td style={{ paddingRight: "50px" }}>{item.room}</td>
                          <td
                            className={Module.W500}
                            style={{
                              textAlign: "center",
                              verticalAlign: "middle",
                            }}
                          >
                            {" "}
                            <div
                              style={{
                                padding: "20px 85px",
                                marginLeft: "90px",
                              }}
                            >
                              {" "}
                            </div>
                          </td>
                        </tr>
                        <tr>
                          <td></td>
                          <td></td>
                          <td></td>
                          <td></td>
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

                <div
                  style={{
                    paddingTop: "1.4rem",
                    display: "flex",
                    flexDirection: "row",
                    paddingLeft: "1.4rem",
                    paddingRight: "1.4rem",
                    borderBottom: "2px solid #dde2e4",
                    justifyContent: "space-between",
                  }}
                >
                  <div className="form-section">
                    <Uploadfile type="pdf" pdfFil={objfile} status={false} />
                  </div>
                  <div
                    style={{
                      paddingRight: "1.4rem",
                      display: "flex",
                      flexDirection: "column",
                      alignItems: "flex-end ",
                      marginLeft: "auto",
                      maxWidth: "350px",
                    }}
                  >
                    <p
                      className="ttl-at"
                      style={{ fontWeight: "bold", textAlign: "right" }}
                    >
                      Meeting objectives
                    </p>
                    <p className="infos-at" style={{ textAlign: "right" }}>
                      Schedule a New Meeting: Set the date, time, objectives,
                      and room to plan your next supervision session.
                    </p>
                  </div>
                </div>

                {supportfile && (
                  <div
                    style={{
                      marginTop: "1.4rem",
                      display: "flex",
                      flexDirection: "row",
                      paddingLeft: "1.4rem",
                      paddingRight: "1.4rem",
                      borderBottom: "2px solid #dde2e4",
                    }}
                  >
                    <div className="form-section">
                      <Uploadfile
                        type="pdf"
                        pdfFil={supportfile}
                        status={false}
                      />
                    </div>
                  </div>
                )}
                <div
                  style={{
                    display: "flex",
                    flexDirection: "row",
                    paddingLeft: "1.4rem",
                    marginTop: "1.4rem",
                    borderBottom: "2px solid #dde2e4",
                    justifyContent: "space-between",
                  }}
                >
                  <div
                    style={{
                      paddingRight: "1.4rem",
                      display: "flex",
                      flexDirection: "column",
                      alignItems: "flex-start",

                      maxWidth: "350px",
                    }}
                  >
                    <p
                      className="ttl-at"
                      style={{ fontWeight: "bold", textAlign: "right" }}
                    >
                      Team deliverables
                    </p>
                    <p className="infos-at" style={{ textAlign: "right" }}>
                      Upload the team's completed deliverables and project
                      artifacts.
                    </p>
                  </div>
                  <div className="form-section">
                    {}
                    <Uploadfile
                      handlePresentationChange={handleDelechange}
                      type="pdf"
                      presentationFile={deliverablesFile}
                      presentationRef={deliverref}
                    />
                  </div>
                </div>
                <div
                  style={{
                    paddingTop: "1.4rem",
                    display: "flex",
                    flexDirection: "row",
                    paddingLeft: "1.4rem",
                    paddingRight: "1.4rem",
                    borderBottom: "2px solid #dde2e4",
                    justifyContent: "space-between",
                  }}
                >
                  <div className="form-section">
                    <Uploadfile type="pdf" pdfFil={reviewfile} status={false} />
                  </div>
                  <div
                    style={{
                      paddingRight: "1.4rem",
                      display: "flex",
                      flexDirection: "column",
                      alignItems: "flex-end ",
                      marginLeft: "auto",
                      maxWidth: "350px",
                    }}
                  >
                    <p
                      className="ttl-at"
                      style={{ fontWeight: "bold", textAlign: "right" }}
                    >
                      My review for deliverables
                    </p>
                    <p className="infos-at" style={{ textAlign: "right" }}>
                      Schedule a New Meeting: Set the date, time, objectives,
                      and room to plan your next supervision session.
                    </p>
                  </div>
                </div>
                <div
                  style={{
                    display: "flex",
                    flexDirection: "row",
                    paddingLeft: "1.4rem",
                    marginTop: "1.4rem",
                    borderBottom: "2px solid #dde2e4",
                    justifyContent: "space-between",
                  }}
                >
                  <div
                    style={{
                      paddingRight: "1.4rem",
                      display: "flex",
                      flexDirection: "column",
                      alignItems: "flex-start",

                      maxWidth: "350px",
                    }}
                  >
                    <p
                      className="ttl-at"
                      style={{ fontWeight: "bold", textAlign: "right" }}
                    >
                      Meeting pv
                    </p>
                    <p className="infos-at" style={{ textAlign: "right" }}>
                      Schedule a New Meeting: Set the date, time, objectives,
                      and room to plan your next supervision session.
                    </p>
                  </div>
                  <div className="form-section">
                    {reviewfile && onbtn === false && (
                      <Uploadfile
                        type="pdf"
                        presentationFile={pvfile}
                        presentationRef={pvref}
                        handlePresentationChange={handlepvchange}
                      />
                    )}
                    {onbtn && reviewfile && pvfile && (
                      <Uploadfile type="pdf" pdf={pvfile} status={false} />
                    )}

                    {!reviewfile && (
                      <div className="nonextmeet">
                        <p
                          className="review-title"
                          style={{
                            fontWeight: "bold",
                            color: "#313638", // red tone
                            fontSize: "18px",
                            marginBottom: "8px",
                            textTransform: "uppercase",
                          }}
                        >
                          important!!
                        </p>
                        <div
                          className="review-status"
                          style={{
                            padding: "10px",
                            borderRadius: "6px",
                            color: "#313638",
                            fontSize: "15px",
                          }}
                        >
                          You can't upload a pv until your supervisor uploads
                          the review for the deliverables
                        </div>
                      </div>
                    )}
                  </div>
                </div>

                {(item &&
                  !item.work_Status &&
                  (!pvfile || !deliverablesFile)) ||
                (pvfile && !onbtn) ? (
                  <div className="onleft">
                    <button
                      onClick={() => {
                        if (!deliverablesFile) {
                          setToastMessage(
                            "Upload your deliverables to send them!"
                          );
                          setShowToast(true);
                          return;
                        }

                        // If a review file is present, a PV file is required too
                        if (reviewfile && !pvfile) {
                          setToastMessage(
                            "Upload your PV file along with the review!"
                          );
                          setShowToast(true);
                          return;
                        }

                        // Safe to proceed
                        handleEditMeeting();
                        setOnbtn(true);
                      }}
                      className="btns-giant"
                      style={{
                        width: "349px",
                        background: "##077ED4",
                        color: "white",
                        cursor: "pointer",
                      }}
                    >
                      <p className="managebtns-text-at-s">Send Files</p>
                    </button>
                  </div>
                ) : (
                  <div className={Module["Meetingreview"]}>
                    <div className={Module["Review-info"]}>
                      <div className={Module["Title"]}>Meeting review</div>
                      <div className={Module["Note"]}>
                        {item.note
                          ? item.note
                          : item.work_Status ?? "Waiting for supervisor review"}
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
            {showToast && (
              <Toast
                message={toastMessage}
                onClose={() => {
                  setShowToast(false);
                  if (
                    toastMessage !==
                      "Upload your PV file along with the review!" &&
                    toastMessage !== "Upload your deliverables to send them!"
                  ) {
                    navigate(-1);
                  }
                }}
              />
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
