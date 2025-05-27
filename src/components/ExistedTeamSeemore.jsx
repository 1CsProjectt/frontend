import React, { useState, useEffect } from "react";
import Module from "../styles/TeamFormationPage.module.css";
import UploadFile from "./modals/uploadbox";
import axios from "axios";
import JoinTeamAlert from "./modals/JoinTeamAlert";
import Toast from "./modals/Toast";
import Popup from "../components/modals/popup";
import { useNavigate } from "react-router-dom";
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
const Seemorepage = ({
  myTeamNumber,
  myTeamMembers = [],
  userRole: initialUserRole,
  handleactions,
  success,
  setSuccess,
  requestid,
}) => {
  const [mlFile, setMlFile] = useState(null);
  const [userRole, setUserRole] = useState(initialUserRole);
  const [toastMessage, setToastMessage] = useState("");
  const [showToast, setShowToast] = useState(false);
  const [showJoinAlert, setShowJoinAlert] = useState(false);
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [status, setStatus] = useState("");
  const [showbtns, setBtns] = useState(true);
  const [confTitle, setConfTitle] = useState("");
  const [confMsg, setConfMsg] = useState("");
  const [confButtonText, setConfButtonText] = useState("");
  const [students, setStudents] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    if (userRole === "teacher.teams" || userRole === "teacher") {
      const getTeamMembers = async () => {
        try {
          const response = await axios.get(`/student/${myTeamNumber}/students`);

          const fetchedStudents =
            response.data.team?.members.map((student) => ({
              fullName: `${student.firstname} ${student.lastname}`,
              email: student.user.email,
              group: student.year,
              role: student.roleINproject,
            })) || [];

          setStudents(fetchedStudents);
          console.log("students", fetchedStudents);

          const mlFromTeam = response.data.team?.preflists?.[0]?.ML || null;
          setMlFile(mlFromTeam);
          console.log("ML:", mlFromTeam);
        } catch (error) {
          console.error("Error fetching team members:", error);
        }
      };

      getTeamMembers();
    }
  }, [myTeamNumber, userRole]);

  const handleJoinClick = () => {
    if (!myTeamNumber) {
      setShowJoinAlert(true);
    }
  };

  const handleAccept = () => {
    setConfTitle("Accept the request");
    setConfMsg(
      "Are you sure you want to accept this request? This action cannot be undone."
    );
    setConfButtonText("accept");
    setStatus("blue");
    setShowConfirmation(true);
  };

  const handleReject = () => {
    setConfTitle("Refuse the request");
    setConfMsg(
      "Are you sure you want to refuse this request? This action cannot be undone."
    );
    setConfButtonText("refuse");
    setStatus("red");
    setShowConfirmation(true);
  };

  const handleCancel = () => {
    setShowJoinAlert(false);
  };

  const handleConfirm = () => {
    setShowJoinAlert(false);
    setToastMessage("Team joining was successful.");
    setShowToast(true);
    setTimeout(() => {
      setShowToast(false);
    }, 3000);
  };

  const handlePopupOkey = () => {
    console.log("hahaha");
    setSuccess(false);
    setUserRole("teacher.teams");
  };

  const staticTeamMembers = [
    { fullName: "XX", email: "XX@example.com", group: "Group XX", role: "XX" },
  ];

  const membersToDisplay =
    userRole === "teacher" || userRole === "teacher.teams"
      ? students
      : myTeamMembers.length > 0
      ? myTeamMembers
      : staticTeamMembers;

  return (
    <div>
      <div className={Module["my-team-header"]}>
        <div className={Module["header-container-teacher"]}>
          <div className={Module["header-left"]}>
            <h2>Team Number</h2>
            <p>
              team number <span>{myTeamNumber}</span>
            </p>
          </div>

          {userRole === "teacher" && showbtns && (
            <div className={Module["header-right-teacher"]}>
              <button
                className={Module["button-teacher"]}
                onClick={handleReject}
                style={{ backgroundColor: "#F76659", color: "white" }}
              >
                Refuse
              </button>
              <button
                className={Module["button-teacher"]}
                onClick={handleAccept}
                style={{
                  marginRight: "10px",
                  backgroundColor: "#077ED4",
                  color: "white",
                }}
              >
                accept
              </button>
            </div>
          )}

          {showConfirmation && (
            <Popup
              onConfirm={() => {
                if (status === "blue") {
                  handleactions(requestid, "ACCEPTED");
                  setBtns(false);
                } else {
                  handleactions(requestid, "REJECTED");
                  setBtns(false);
                }
              }}
              confirmText={confButtonText}
              poproud={1}
              status={status}
              confirmMessage={confMsg}
              confirmTitle={confTitle}
              onCancel={() => setShowConfirmation(false)}
            />
          )}

          {success && <Popup poproud={2} onOkey={handlePopupOkey} />}
        </div>
      </div>

      <h2>Team Members</h2>
      <div className={Module["table-wrapper"]}>
        <table>
          <thead>
            <tr>
              <th>Full Name</th>
              <th>Email Address</th>
              <th>groupe</th>
              <th>Role</th>
            </tr>
          </thead>
          <tbody>
            {membersToDisplay.map((member, index) => (
              <tr key={index}>
                <td>{member.fullName}</td>
                <td>{member.email}</td>
                <td>{member.group}</td>
                <td>{member.role}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {userRole !== "teacher" && userRole !== "teacher.teams" && (
        <div className={Module["buttons-container-see-more"]}>
          <button
            className={Module["BackSeeMoreBtn"]}
            onClick={() => window.history.back()}
          >
            Back
          </button>

          {sessionTitle === "Group formation session" && (
            <button
              className={Module["JoinSeeMoreBtn"]}
              onClick={handleJoinClick}
              disabled={myTeamNumber !== null}
            >
              Join
            </button>
          )}
        </div>
      )}

      <JoinTeamAlert
        show={showJoinAlert}
        onCancel={handleCancel}
        onConfirm={handleConfirm}
      />

      {showToast && (
        <Toast
          message={toastMessage || "Test Toast"}
          onClose={() => setShowToast(false)}
        />
      )}

      {(userRole === "teacher" || userRole === "teacher.teams") && (
        <div className="ml-container">
          <h2
            style={{
              marginTop: "20px",
            }}
          >
            Motivation Letter
          </h2>
          <UploadFile pdfFil={mlFile} status={false} />
        </div>
      )}
    </div>
  );
};

export default Seemorepage;
