import React, { useState, useRef, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

import Uploadfile from "../components/modals/uploadbox";
import Toast from "../components/modals/Toast";
import Style from "../styles/TeamFormationPage.module.css";
import Module from "../styles/myteacher.module.css";
import Popup from "../components/modals/popup";
// Skip ngrok warning if you're using ngrok
axios.defaults.headers.common["ngrok-skip-browser-warning"] = "true";

function TeacherMeetingPage(teamid) {
  console.log("hna haha", teamid.teamid);
  const [formData, setFormData] = useState({
    startDate: "2025-03-23",
    startTime: "13:30",
    salleName: "tp06",
    presentationFile: null,
  });
  const [weekmeeting, setWeekMeeting] = useState(null);
  const [oncancel, setoncancel] = useState(null);
  const [hasNextMeeting, setHasNextMeeting] = useState(false);
  const presentationRef = useRef(null);
  const [selectedSalle, setSelectedSalle] = useState("tp06");

  useEffect(() => {
    if (!teamid) return;

    const getData = async () => {
      try {
        const response = await axios.get(
          `/mettings/getNextMeet/${teamid.teamid}`
        );

        if (response.data.status === "success" && response.data.data) {
          const nextMeeting = response.data.data.nextMeeting;

          if (nextMeeting) {
            setWeekMeeting(nextMeeting);
            setFormData((prev) => ({
              ...prev,
              date: response.data.data.date,
              time: response.data.data.time,
              room: response.data.data.room,
            }));
            setHasNextMeeting(false); // There is a next meeting
          } else {
            setHasNextMeeting(true); // No next meeting
          }
        } else {
          setHasNextMeeting(true); // No valid data
        }
      } catch (error) {
        console.error("Error fetching meeting:", error);
        setHasNextMeeting(true); // Error means we assume no next meeting
      }
    };

    getData();
  }, [teamid]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };
  const handleCancelMeeting = async () => {
    if (!weekmeeting || !weekmeeting._id) return;

    try {
      setLoading(true);
      const response = await axios.delete(
        `/mettings/cancelMeeting/${weekmeeting._id}`
      );
      if (response.data.status === "success") {
        setToastMessage("Meeting cancelled successfully.");
        setWeekMeeting(null);
        setHasNextMeeting(false);
        setSuccess(true);
      } else {
        setToastMessage("Failed to cancel meeting.");
      }
    } catch (error) {
      setToastMessage(
        error.response?.data?.message || "Error cancelling meeting."
      );
    } finally {
      setShowToast(true);
      setLoading(false);
    }
  };
  const handleFileUpload = (file) => {
    setFormData((prev) => ({
      ...prev,
      presentationFile: file,
    }));
  };
  const oncancelverf = () => {
    setoncancel(true);
  };
  const handleStartMeeting = async (e) => {
    e.preventDefault();
    if (!formData.startDate || !formData.startTime) {
      setToastMessage("Please select date and time");
      setShowToast(true);
      return;
    }
    if (!formData.presentationFile) {
      setToastMessage("Please upload a presentation file");
      setShowToast(true);
      return;
    }

    const meetingData = new FormData();
    meetingData.append("date", formData.startDate);
    meetingData.append("time", formData.startTime);
    meetingData.append("salle", formData.salleName);
    meetingData.append("file", formData.presentationFile);

    try {
      setLoading(true);
      const response = await axios.post(
        `/mettings/startNewMeeting/${teamid.teamid}`,
        meetingData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );

      setToastMessage("Meeting started successfully!");
      setShowToast(true);
      setmeetingpopup(false);
      // Refresh meetings list or redirect
    } catch (err) {
      setError(err.response?.data?.message || "Error starting meeting");
      setToastMessage(error);
      setShowToast(true);
    } finally {
      setLoading(false);
    }
  };
  const handleCancel = () => {
    setmeetingpopup(false);
  };

  const navigate = useNavigate();
  const [toastMessage, setToastMessage] = useState("");
  const [meetingpopup, setmeetingpopup] = useState(false);
  const [showToast, setShowToast] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const SeeMoreHandle = (e, Item) => {
    e.stopPropagation();
    // pass both the clicked item and the full currentItems list
    navigate("/StudentMeetingsPage/SeeMore", {
      state: { item: Item },
    });
  };
  const session = {
    title: "TOPIC_SELECTION",
    targetDate: {
      start: new Date("2025-03-29T00:00:00"),
      end: new Date("2025-04-29T23:59:59"),
    },
  };
  function formatDateToMMDD(dateString) {
    const date = new Date(dateString);
    const month = (date.getMonth() + 1).toString().padStart(2, "0");
    const day = date.getDate().toString().padStart(2, "0");
    return `${month}/${day}`;
  }

  const MeetingHistoryList = [
    {
      id: "01",
      date: "2025-03-21T00:00:00",
      time: "13:30",
      salle: "TP06",
      work: "unfinished",
      status: "unfinished",
      pdf: "qwertyuioqeqweqwe",
      note: "10/10",
    },
    {
      id: "02",
      date: "2025-03-29T00:00:00",
      time: "19:00",
      salle: "TP6",
      work: "approved",
      status: "unfinished",
    },
    {
      id: "03",
      date: "2025-03-16T00:00:00",
      time: "13:30",
      salle: "TP06",
      work: "unfinished",
      status: "unfinished",
    },
    {
      id: "04",
      date: "2025-03-15T00:00:00",
      time: "13:30",
      salle: "TP06",
      work: "approved",
      status: "approved",
    },
    {
      id: "05",
      date: "2025-03-10T00:00:00",
      time: "13:30",
      salle: "TP06",
      work: "unfinished",
      status: "unfinished",
    },
    {
      id: "06",
      date: "2025-03-08T00:00:00",
      time: "13:30",
      salle: "TP06",
      work: "approved",
      status: "approved",
    },
    {
      id: "07",
      date: "2025-03-08T00:00:00",
      time: "13:30",
      salle: "TP06",
      work: "approved",
      status: "approved",
    },
    {
      id: "08",
      date: "2025-03-05T00:00:00",
      time: "14:00",
      salle: "TP07",
      work: "in progress",
      status: "unfinished",
    },
    {
      id: "09",
      date: "2025-03-04T00:00:00",
      time: "15:00",
      salle: "TP08",
      work: "in progress",
      status: "unfinished",
    },
    {
      id: "10",
      date: "2025-03-03T00:00:00",
      time: "16:00",
      salle: "TP09",
      work: "approved",
      status: "approved",
    },
    {
      id: "11",
      date: "2025-03-02T00:00:00",
      time: "17:00",
      salle: "TP10",
      work: "unfinished",
      status: "unfinished",
    },
    {
      id: "12",
      date: "2025-03-01T00:00:00",
      time: "18:00",
      salle: "TP11",
      work: "approved",
      status: "approved",
    },
    {
      id: "13",
      date: "2025-02-28T00:00:00",
      time: "19:00",
      salle: "TP12",
      work: "in progress",
      status: "unfinished",
    },
    {
      id: "14",
      date: "2025-02-27T00:00:00",
      time: "20:00",
      salle: "TP13",
      work: "approved",
      status: "approved",
    },
    {
      id: "15",
      date: "2025-02-26T00:00:00",
      time: "21:00",
      salle: "TP14",
      work: "unfinished",
      status: "unfinished",
    },
    {
      id: "16",
      date: "2025-02-25T00:00:00",
      time: "22:00",
      salle: "TP15",
      work: "approved",
      status: "approved",
    },
    {
      id: "17",
      date: "2025-02-24T00:00:00",
      time: "23:00",
      salle: "TP16",
      work: "in progress",
      status: "unfinished",
    },
    {
      id: "18",
      date: "2025-02-23T00:00:00",
      time: "12:00",
      salle: "TP17",
      work: "approved",
      status: "approved",
    },
    {
      id: "19",
      date: "2025-02-22T00:00:00",
      time: "11:00",
      salle: "TP18",
      work: "unfinished",
      status: "unfinished",
    },
    {
      id: "20",
      date: "2025-02-21T00:00:00",
      time: "10:00",
      salle: "TP19",
      work: "approved",
      status: "approved",
    },
    {
      id: "21",
      date: "2025-02-20T00:00:00",
      time: "09:00",
      salle: "TP20",
      work: "in progress",
      status: "unfinished",
    },
    {
      id: "22",
      date: "2025-02-19T00:00:00",
      time: "08:00",
      salle: "TP21",
      work: "approved",
      status: "approved",
    },
    {
      id: "23",
      date: "2025-02-18T00:00:00",
      time: "07:00",
      salle: "TP22",
      work: "unfinished",
      status: "unfinished",
    },
    {
      id: "24",
      date: "2025-02-17T00:00:00",
      time: "06:00",
      salle: "TP23",
      work: "approved",
      status: "approved",
    },
    {
      id: "25",
      date: "2025-02-16T00:00:00",
      time: "05:00",
      salle: "TP24",
      work: "in progress",
      status: "unfinished",
    },
    {
      id: "26",
      date: "2025-02-15T00:00:00",
      time: "04:00",
      salle: "TP25",
      work: "approved",
      status: "approved",
    },
    {
      id: "27",
      date: "2025-02-14T00:00:00",
      time: "03:00",
      salle: "TP26",
      work: "unfinished",
      status: "unfinished",
    },
    {
      id: "28",
      date: "2025-02-13T00:00:00",
      time: "02:00",
      salle: "TP27",
      work: "approved",
      status: "approved",
    },
  ];

  let sessionTitle;

  if (session.title === "TEAM_CREATION") {
    sessionTitle = "Group formation session";
  } else if (session.title === "TOPIC_SELECTION") {
    sessionTitle = "Select topics session";
  } else {
    sessionTitle = "Unknown session";
  }

  return (
    <div className={Module["Student-meeting-container"]}>
      {oncancel && (
        <Popup
          confirmMessage={"are your u want to cancel meeting"}
          confirmTitle={"cancel meeting"}
          poproud={1}
          onConfirm={() => {
            handleCancelMeeting();
            setoncancel(false); // Hide popup after action
          }}
        />
      )}
      {success && <Popup poproud={2} onOkey={setSuccess(false)} />}
      <div className={Module["header-row"]}>
        <h1>Meetings</h1>
      </div>
      {meetingpopup && (
        <div className={Module["modal-overlay"]}>
          <div className={Module["start-meeting-container"]}>
            <h2 className={Module["meeting-header"]}>Start new meeting</h2>

            <div className={Module["meeting-description"]}>
              <p>
                Schedule a New Meeting: Set the date, time, objectives, and room
                to plan your next supervision session.
              </p>
            </div>

            <div className={Module["meeting-form"]}>
              <div className={Module["time-selection"]}>
                <div
                  style={{
                    justifyContent: "space-between",
                    display: "flex",
                    width: "100%",
                  }}
                >
                  {" "}
                  <div
                    className={Module["form-group"]}
                    style={{
                      width: "45%",
                    }}
                  >
                    <label>Start date</label>
                    <input
                      type="date"
                      name="startDate" // Add name attribute
                      className={Module["date-input"]}
                      value={formData.startDate}
                      onChange={handleInputChange}
                    />
                  </div>
                  <div
                    className={Module["form-group"]}
                    style={{
                      width: "45%",
                    }}
                  >
                    <label>Time</label>
                    <input
                      type="time"
                      name="startTime" // Add name attribute
                      className={Module["time-input"]}
                      value={formData.startTime}
                      onChange={handleInputChange}
                    />
                  </div>
                </div>
              </div>

              <div className={Module["form-group"]}>
                <select
                  className={Module["salle-input"]}
                  name="salleName"
                  value={formData.salleName}
                  onChange={handleInputChange}
                >
                  {["tp06", "tp07", "tp08", "tp09", "tp10"].map((salle) => (
                    <option key={salle} value={salle}>
                      {salle.toUpperCase()}
                    </option>
                  ))}
                </select>
              </div>

              <div className={Module["form-group"]}>
                <label>Objectives</label>
                <Uploadfile
                  handlePresentationChange={handleFileUpload}
                  presentationFile={formData.presentationFile}
                  presentationRef={presentationRef}
                  type="pdf"
                />
              </div>

              <div className={Module["form-buttons"]}>
                <button className={Module["cancel-btn"]} onClick={handleCancel}>
                  Cancel
                </button>
                <button
                  className={Module["start-btn"]}
                  onClick={handleStartMeeting}
                  disabled={loading || hasNextMeeting}
                >
                  {loading ? "Starting..." : "Start"}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
      <div className={Module["Week-meeting-container"]}>
        <div className={Module["Left-side"]}>
          <div className={Module["Left-side-header"]}>This week meeting</div>
          <div className={Module["Left-side-body"]}>
            Schedule a New Meeting: Set the date, time, objectives, and room to
            plan your next supervision session.
          </div>
        </div>
        <div className={Module["Right-side"]}>
          <div
            className={Style["table-wrapper"]}
            style={{ width: "602px", height: "136px" }}
          >
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
                {weekmeeting ? (
                  <tr>
                    <td style={{ paddingRight: "50px" }}>
                      {formatDateToMMDD(weekmeeting.date)}
                    </td>
                    <td style={{ paddingRight: "50px" }}>{weekmeeting.time}</td>
                    <td>{weekmeeting.room}</td>
                    <td
                      className={Module.W500}
                      style={{
                        textAlign: "center",
                        verticalAlign: "middle",
                      }}
                    >
                      <button
                        className={Module["SeeBtn"]}
                        style={{
                          width: "85px",
                          height: "39px",
                          marginRight: "50px",
                        }}
                        onClick={SeeMoreHandle}
                      >
                        see
                      </button>
                      <button
                        className={Module["SeeBtn"]}
                        style={{
                          width: "85px",
                          height: "39px",
                          background: "#F76659",
                          color: "white",
                        }}
                        onClick={oncancelverf}
                      >
                        cancel
                      </button>
                    </td>
                  </tr>
                ) : (
                  <tr>
                    <td colSpan="4" style={{ textAlign: "center" }}>
                      No upcoming meeting found.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
          {hasNextMeeting && (
            <button
              className={Module["SeeBtn"]}
              style={{
                width: " 100%",
                height: "55px",
                background: "#077ED4",
                color: "white",
                marginBottom: "10px",
              }}
              onClick={() => setmeetingpopup(true)}
            >
              {" "}
              start new meeting
            </button>
          )}
        </div>
      </div>
      <div className={Module["MeetingsHistory"]} style={{ padding: "20px" }}>
        <div className={Module["MeetingsHistory-header"]}>Meetings History</div>
      </div>
      {showToast && (
        <Toast message={toastMessage} onClose={() => setShowToast(false)} />
      )}
    </div>
  );
}

export default TeacherMeetingPage;
