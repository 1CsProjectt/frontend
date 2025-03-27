/* LINKING 
remove myTeamMembers att /  this for static
uncomment 

*/
import React, { useEffect, useState } from "react";
import "../styles/TeamFormationPage.css";
import axios from "axios";
import JoinTeamAlert from "./JoinTeamAlert"
import Toast from "../components/Toast";
const Seemorepage = ({ myTeamNumber, myTeamMembers }) => {
  const [toastMessage, setToastMessage] = useState("");
  const [showToast, setShowToast] = useState(false);
  const [showJoinAlert, setShowJoinAlert] = useState(false);
  const handleJoinClick = () => {
    setShowJoinAlert(true);
  };
  const handleCancel = () => {
    setShowJoinAlert(false);
  };

  const handleConfirm = () => {
    setShowJoinAlert(false);
    // Handle join logic here (for example, an API call)
    console.log("Join confirmed!");
    setToastMessage("Team joining was successful.");
    setShowToast(true);
    setTimeout(() => {
      setShowToast(false);
    }, 3000);
  };
  /*  const [teamData, setTeamData] = useState(null);
   const [loading, setLoading] = useState(true);
   const [error, setError] = useState(null);
 
   useEffect(() => {
     const fetchTeamData = async () => {
       try {
         setLoading(true);
         const { data } = await axios.get(`/teams/${myTeamNumber}`);//Do not forget use the right url
         setTeamData(data);
       } catch (err) {
         setError(err.response ? err.response.data.message : err.message);
       } finally {
         setLoading(false);
       }
     };
 
     if (myTeamNumber) {
       fetchTeamData();
     }
   }, [myTeamNumber]);
 
   if (loading) return <div>Loading team data...</div>;
   if (error) return <div>Error: {error}</div>;
   if (!teamData) return <div>No team data available.</div>; */
  return (
    <div>
      <div className="my-team-header">
        <div className="header-left">
          <h2>Team number</h2>
          <p>You are currently in team number <span>{myTeamNumber}</span></p>
        </div>

      </div>

      <h2>Team members</h2>
      <div className="table-wrapper">
        <table>
          <thead>
            <tr>
              <th>Full Name</th>
              <th>Email-address</th>
              <th>Group</th>
              <th>Role</th>
            </tr>
          </thead>
          <tbody>
            {/* this for static */}
            {myTeamMembers.map((member, index) => (
              <tr key={index}>
                <td>{member.fullName}</td>
                <td>{member.email}</td>
                <td>{member.group}</td>
                <td>{member.role}</td>
              </tr>
            ))}
            {/* this for dynamique  */}
            {/* {teamData.members.map((member, index) => (
              <tr key={index}>
                <td>{member.fullName}</td>
                <td>{member.email}</td>
                <td>{member.group}</td>
                <td>{member.role}</td>
              </tr>
            ))} */}
          </tbody>
        </table>
      </div>
      <div className="buttons-container-see-more">
        <button className="BackSeeMoreBtn" onClick={() => window.history.back()}>
          Back
        </button>
        <button className="JoinSeeMoreBtn" onClick={handleJoinClick}>
          Join
        </button>
      </div>
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
