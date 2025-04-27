import React, { useState, useEffect } from "react";
import Module from "../styles/TeamFormationPage.module.css";
import axios from "axios";
import JoinTeamAlert from "./modals/JoinTeamAlert";
import Toast from "./modals/Toast";
import Popup from "../components/modals/popup";
import { useNavigate } from "react-router-dom";
const Seemorepage = ({
  myTeamNumber,
  myTeamMembers = [],
  userRole,
  handleactions,
  success,
  setSuccess,
  requestid,
}) => {
  const [toastMessage, setToastMessage] = useState("");
  const [showToast, setShowToast] = useState(false);
  const [showJoinAlert, setShowJoinAlert] = useState(false);
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [status, setStatus] = useState("");

  const [confTitle, setConfTitle] = useState(""); // for confirmation popup title
  const [confMsg, setConfMsg] = useState(""); // for confirmation popup message
  const [confButtonText, setConfButtonText] = useState("");
  const [students, setStudents] = useState([]);
  const navigate = useNavigate();
  console.log(myTeamNumber);
  useEffect(() => {
    if (userRole === "teacher") {
      const getTeamMembers = async () => {
        try {
          // Making GET request to fetch the student data for a specific team
          const response = await axios.get(`/student/${myTeamNumber}/students`);

          // Extract and set the students data
          const fetchedStudents = response.data.students.map((student) => ({
            fullName: `${student.firstname} ${student.lastname}`,
            email: student.user.email,
            group: student.year,
            role: student.roleINproject,
          }));

          setStudents(fetchedStudents);
          console.log("students", students);
        } catch (error) {
          console.error("Error fetching team members:", error);
        }
      };

      // Call the function when the component mounts or when myTeamNumber or userRole changes
      getTeamMembers();
    }
  }, [myTeamNumber, userRole]);

  const handleJoinClick = () => {
    if (!myTeamNumber) {
      // If no team number, show the join alert
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

    console.log("Join confirmed!");
    setToastMessage("Team joining was successful.");
    setShowToast(true);
    setTimeout(() => {
      setShowToast(false);
    }, 3000);
  };

  // If team members are not provided via props, fall back to static data.
  const staticTeamMembers = [
    { fullName: "XX", email: "XX@example.com", group: "Group XX", role: "XX" },
  ];

  // Use passed team members if available; otherwise, static data.
  const membersToDisplay =
    userRole === "teacher"
      ? students // If role is "teacher", show students
      : myTeamMembers.length > 0 // If myTeamMembers has data, show that
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

          {userRole === "teacher" && (
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
                console.log("Clicked Confirm");
                console.log("status:", status);
                console.log("requestid:", requestid);

                if (status === "blue") {
                  handleactions(requestid, "ACCEPTED");
                } else {
                  handleactions(requestid, "REJECTED");
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

          {success && (
            <Popup
              poproud={2}
              onOkey={() => {
                console.log("hahaha");
                navigate("/teacher/requests");
                setSuccess(false);
              }}
            />
          )}
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
      </div>{" "}
      {userRole !== "teacher" && userRole !== "teacher.teams" && (
        <div className={Module["buttons-container-see-more"]}>
          <button
            className={Module["BackSeeMoreBtn"]}
            onClick={() => window.history.back()}
          >
            Back
          </button>

          <button
            className={Module["JoinSeeMoreBtn"]}
            onClick={handleJoinClick}
            disabled={myTeamNumber !== null} // Disable button if user is already in a team
          >
            Join
          </button>
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
    </div>
  );
};

export default Seemorepage;
