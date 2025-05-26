import React, { useState, useRef, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

import Uploadfile from "../components/modals/uploadbox";
import Teacherseemore from "../components/teacherseemore";
import Toast from "../components/modals/Toast";
import Style from "../styles/TeamFormationPage.module.css";
import Module from "../styles/myteacher.module.css";
import Popup from "../components/modals/popup";
import StudentMeetingHistory from "../components/StudentMettingHistory";

// Skip ngrok warning if you're using ngrok
axios.defaults.headers.common["ngrok-skip-browser-warning"] = "true";

function TeacherMeetingPage({
  teamid,
  stages,
  setStages,
  seemore,
  setSeeMore,
  historyseemore,
  setHistorySeeMore,
}) {
  console.log("team id", teamid);
  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);

  const defaultFormData = {
    startDate: tomorrow.toISOString().split("T")[0],
    startTime: "14:00",
    salleName: "tp06",
    presentationFile: null,
  };

  const [formData, setFormData] = useState(defaultFormData);

  const [weekmeeting, setWeekMeeting] = useState(null);
  const [weekmeetinghiss, setWeekMeetinghiss] = useState(null);

  const [MeetingHistoryList, setMeetingHistoryList] = useState([]);
  const [oncancel, setoncancel] = useState(null);

  const [hasNextMeeting, setHasNextMeeting] = useState(null);
  const presentationRef = useRef(null);
  const [selectedSalle, setSelectedSalle] = useState("tp06");
  const [refreshKey, setRefreshKey] = useState(0);
  const [onEdit, setOnEdit] = useState(null);
  const [objfile, setObjectFile] = useState(null);
  const [supportfile, setSupportFile] = useState(null);
  const [reviewFile, setReviewFile] = useState(null);
  useEffect(() => {
    if (!teamid || historyseemore) return;

    const getData = async () => {
      try {
        const response = await axios.get(`/mettings/getNextMeet/${teamid}`);
        const nextMeeting = response?.data?.data?.nextMeeting;
        console.log("heda howa", nextMeeting);

        if (
          response.data.status === "success" &&
          nextMeeting &&
          !nextMeeting.work_Status
        ) {
          setHasNextMeeting(true);
          setWeekMeeting(nextMeeting);
          setFormData({
            startDate: response.data.date ?? null,
            startTime: response.data.time ?? null,
            salleName: response.data.room ?? null,
            presentationFile: response.data.Meeting_objectives_files ?? null,
          });
        } else {
          setHasNextMeeting(false);
        }
      } catch (err) {
        console.error(err);
        setHasNextMeeting(false);
      }
    };

    getData();
  }, [refreshKey, teamid, historyseemore]);

  useEffect(() => {
    if (weekmeeting && weekmeeting.work_Status === null) {
      setFormData((prev) => ({
        ...prev,
        startDate: weekmeeting.date?.slice(0, 10) ?? prev.startDate,
        startTime: weekmeeting.time ?? prev.startTime,
        salleName: weekmeeting.room ?? prev.salleName,
      }));
    }
  }, [weekmeeting, refreshKey]);
  useEffect(() => {
    const fetchMeetings = async () => {
      try {
        const response = await axios.get(`/mettings/getAllMeetings/${teamid}`);
        const meetings = response.data?.data?.meetings ?? [];
        setMeetingHistoryList(meetings);
      } catch (error) {
        console.error("Error fetching meetings:", error);
        setMeetingHistoryList([]); // fallback to empty array
      }
    };

    fetchMeetings();
  }, [teamid, refreshKey]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };
  const handleEditMeeting = async () => {
    try {
      setLoading(true);

      // 🚫 Check if date is today or in the past
      const selectedDate = new Date(formData.startDate.split("T")[0]);
      const today = new Date();
      today.setHours(0, 0, 0, 0); // Remove time from today

      if (selectedDate <= today) {
        setToastMessage(
          "You cannot schedule or edit a meeting to today or a past date."
        );
        setShowToast(true);
        setLoading(false);
        return;
      }

      console.log("after change file ", objfile);

      const formDataToSend = new FormData();
      formDataToSend.append("date", formData.startDate.split("T")[0]);
      formDataToSend.append(
        "time",
        formData.startTime.includes(":00:00")
          ? formData.startTime
          : `${formData.startTime}:00`
      );
      formDataToSend.append("room", formData.salleName);

      // Append file if exists
      if (objfile instanceof File) {
        formDataToSend.append("Meeting_objectives_files", objfile);
        formDataToSend.append("Support_files", supportfile);
        formDataToSend.append("My_review_for_deliverables_files ", reviewFile);
      } else if (typeof objfile === "string") {
        formDataToSend.append("Meeting_objectives_files", objfile);
        formDataToSend.append("Support_files", supportfile);
        formDataToSend.append("My_review_for_deliverables_files ", reviewFile);
      }

      const response = await axios.patch(
        `/mettings/updateMeeting/${weekmeeting.id}`,
        formDataToSend,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );

      if (response.data?.status === "success") {
        const updatedMeeting = response.data.data.meeting;

        setFormData({
          startDate: updatedMeeting.date,
          startTime: updatedMeeting.time.split(":").slice(0, 2).join(":"),
          salleName: updatedMeeting.room,
          presentationFile: null,
        });

        setObjectFile(updatedMeeting.Meeting_objectives_files || null);
        setSupportFile(updatedMeeting.Support_files || null);

        setRefreshKey((prev) => prev + 1);
        setmeetingpopup(false);
        setOnEdit(false);
        setToastMessage("Meeting updated successfully!");
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

  const handleCancelMeeting = async () => {
    console.log("0");
    if (!weekmeeting || !weekmeeting.id) return;
    console.log("1");
    try {
      setLoading(true);
      const response = await axios.delete(
        `/mettings/cancelMeeting/${weekmeeting.id}`
      );
      console.log("2");
      if (response.data.status === "success") {
        setToastMessage("Meeting cancelled successfully.");
        setWeekMeeting(null);
        setHasNextMeeting(false);
        setSuccess(true);
        setRefreshKey((prev) => prev + 1);
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

  const handleTechSheetChange = (event) => {
    const file = event.target.files[0];
    if (file?.type === "application/pdf") {
      setFormData((prev) => ({
        ...prev,
        presentationFile: file,
      }));
    } else {
      alert("Please upload a valid PDF file.");
    }
  };
  const oncancelverf = () => {
    setoncancel(true);
  };
  const handleStartMeeting = async () => {
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

    if (!formData.salleName) {
      setToastMessage("Please select a room");
      setShowToast(true);
      return;
    }

    if (!teamid) {
      setToastMessage("Team ID is missing");
      setShowToast(true);
      return;
    }

    // 🚫 Check if date is today or in the past
    const selectedDate = new Date(formData.startDate);
    const today = new Date();
    today.setHours(0, 0, 0, 0); // Normalize to midnight for comparison

    if (selectedDate.getTime() === today.getTime() || selectedDate < today) {
      setToastMessage("You cannot start a meeting today or in the past.");
      setShowToast(true);
      return;
    }

    const meetingData = new FormData();
    meetingData.append("date", formData.startDate);
    meetingData.append("time", formData.startTime);
    meetingData.append("room", formData.salleName);
    meetingData.append("Meeting_objectives_files", formData.presentationFile);

    try {
      setLoading(true);
      console.log("reni dakhl", teamid);
      const response = await axios.post(
        `/mettings/startNewMeeting/${teamid}`,
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
      setRefreshKey((prev) => prev + 1);
    } catch (err) {
      const errMsg = err.response?.data?.message || "Error starting meeting";
      setError(errMsg);
      setToastMessage(errMsg);
      setShowToast(true);
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    setmeetingpopup(false);
    setOnEdit(false);
  };
  const [isUpcoming, setIsUpcoming] = useState(false);
  useEffect(() => {
    if (weekmeeting?.date) {
      const today = new Date();
      const meetingDate = new Date(weekmeeting.date);

      meetingDate.setHours(0, 0, 0, 0);
      today.setHours(0, 0, 0, 0);

      setIsUpcoming(meetingDate > today);
    }
  }, [weekmeeting]);
  const navigate = useNavigate();
  const [toastMessage, setToastMessage] = useState("");
  const [meetingpopup, setmeetingpopup] = useState(false);
  const [showToast, setShowToast] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

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
  console.log("meeting list", MeetingHistoryList);
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
          confirmMessage={"are you sure want to cancel the meeting"}
          confirmTitle={"cancel meeting"}
          poproud={1}
          onConfirm={() => {
            handleCancelMeeting();
            setoncancel(false);
            setSeeMore(false);
            setStages("1");
            setFormData(defaultFormData);
            // Hide popup after action
          }}
          onCancel={() => setoncancel(false)}
        />
      )}

      {(meetingpopup || onEdit) && (
        <div className={Module["modal-overlay"]}>
          <div className={Module["start-meeting-container"]}>
            <h2 className={Module["meeting-header"]}>
              {onEdit ? "Edit meeting information" : "Start new meeting"}
            </h2>

            <div className={Module["meeting-description"]}>
              <p>
                {onEdit
                  ? "Update the date, time, objectives, and room for this supervision session."
                  : "Schedule a New Meeting: Set the date, time, objectives, and room to plan your next supervision session."}
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
                  <div
                    className={Module["form-group"]}
                    style={{ width: "45%" }}
                  >
                    <label>Start date</label>
                    <input
                      type="date"
                      name="startDate"
                      className={Module["date-input"]}
                      value={formData.startDate}
                      onChange={handleInputChange}
                    />
                  </div>
                  <div
                    className={Module["form-group"]}
                    style={{ width: "45%" }}
                  >
                    <label>Time</label>
                    <input
                      type="time"
                      name="startTime"
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
              {!onEdit && (
                <div className={Module["form-group"]}>
                  <label>Objectives</label>
                  <Uploadfile
                    handlePresentationChange={handleTechSheetChange}
                    presentationFile={formData.presentationFile}
                    presentationRef={presentationRef}
                    type="pdf"
                  />
                </div>
              )}

              <div className={Module["form-buttons"]}>
                <button
                  className={Module["cancel-btn"]}
                  onClick={() => {
                    handleCancel();
                  }}
                >
                  Cancel
                </button>
                <button
                  className={Module["start-btn"]}
                  onClick={() => {
                    onEdit ? handleEditMeeting() : handleStartMeeting();
                  }}
                >
                  {loading
                    ? onEdit
                      ? "Updating..."
                      : "Starting..."
                    : onEdit
                    ? "Update"
                    : "Start"}
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
                {weekmeeting && (historyseemore || hasNextMeeting) ? (
                  (() => {
                    const isDisabled =
                      (seemore && !isUpcoming) || historyseemore;
                    const seeBtnLabel = isUpcoming
                      ? seemore
                        ? "edit"
                        : "see"
                      : seemore
                      ? "edit"
                      : "review";

                    const seeBtnStyle = {
                      width: "85px",
                      height: "39px",
                      background: isDisabled
                        ? "#ccc" // grey background when disabled
                        : !isUpcoming
                        ? seemore
                          ? "#F1F1F1" // original: grey when not upcoming and see more
                          : "#077ED4" // original: blue when not upcoming and not see more
                        : undefined,
                      color: isDisabled
                        ? "#888" // grey text when disabled
                        : !isUpcoming
                        ? seemore
                          ? "#344054" // original: grey text
                          : "white" // original: white text
                        : undefined,
                      cursor: isDisabled ? "not-allowed" : "pointer",
                    };

                    return (
                      <tr>
                        <td style={{ paddingRight: "50px" }}>
                          {formatDateToMMDD(weekmeeting.date)}
                        </td>
                        <td style={{ paddingRight: "5px" }}>
                          {weekmeeting.time}
                        </td>
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
                            style={seeBtnStyle}
                            disabled={seemore && !isUpcoming && historyseemore}
                            onClick={
                              isUpcoming
                                ? seemore
                                  ? () => setOnEdit(true)
                                  : () => {
                                      setSeeMore(true);
                                      setStages("2");
                                    }
                                : () => {
                                    setSeeMore(true);
                                    setStages("2");
                                  } // always open review
                            }
                          >
                            {seeBtnLabel}
                          </button>

                          <button
                            disabled={
                              !isUpcoming ||
                              historyseemore ||
                              seeBtnLabel === "review"
                            }
                            className={Module["SeeBtn"]}
                            style={{
                              width: "85px",
                              height: "39px",
                              background:
                                !isUpcoming ||
                                historyseemore ||
                                seeBtnLabel === "review"
                                  ? "#ccc"
                                  : "#F76659", // Grey when disabled
                              color: "white",
                              cursor:
                                !isUpcoming ||
                                historyseemore ||
                                seeBtnLabel === "review"
                                  ? "not-allowed"
                                  : "pointer", // Optional UX enhancement
                            }}
                            onClick={() => {
                              oncancelverf();
                              // Reset to initial values
                            }}
                          >
                            Cancel
                          </button>
                        </td>
                      </tr>
                    );
                  })()
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
          {!hasNextMeeting && !historyseemore && (
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

      {seemore && (
        <Teacherseemore
          review={!isUpcoming}
          setSeeMore={setSeeMore}
          myMeet={weekmeeting}
          objfile={objfile}
          setObjectFile={setObjectFile}
          supportfile={supportfile}
          setSupportFile={setSupportFile}
          refreshKey={refreshKey}
          setRefreshKey={setRefreshKey}
          reviewfile={reviewFile}
          setReviewFile={setReviewFile}
        />
      )}
      {!seemore && (
        <div className={Module["MeetingsHistory"]} style={{ padding: "20px" }}>
          <div className={Module["MeetingsHistory-header"]}>
            Meetings History
          </div>
          <StudentMeetingHistory
            MeetingHistoryList={MeetingHistoryList}
            setMeet={setWeekMeeting}
            review={!isUpcoming}
            setSeeMore={setSeeMore}
            myMeet={weekmeeting}
            refreshKey={refreshKey}
            setRefreshKey={setRefreshKey}
            historyseemore={historyseemore}
            setHistorySeeMore={setHistorySeeMore}
            stages={stages}
            setStages={setStages}
          />
        </div>
      )}
      {showToast && (
        <Toast message={toastMessage} onClose={() => setShowToast(false)} />
      )}
    </div>
  );
}

export default TeacherMeetingPage;
