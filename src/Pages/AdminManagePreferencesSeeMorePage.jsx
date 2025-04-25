//add that if you are alredt in a team you can not click the join button(i can write in the button that you are alredy in a team)

import React, { useState ,navigate, useEffect} from "react";
import Module from "../styles/AdminManagePreferencesPage.module.css";
import axios from "axios";
import PFECard from "../components/CardComponent";
import Toast from "../components/modals/Toast";

const Seemorepage = ({ myTeamNumber, myTeamMembers = [] ,students, onBack }) => {
  const [toastMessage, setToastMessage] = useState("");
  const [showToast, setShowToast] = useState(false);
  const [showJoinAlert, setShowJoinAlert] = useState(false);
  const [showAddMembersModal, setShowAddMembersModal] = useState(false);
  const [isMoveTeamMemberModalOpen, setIsMoveTeamMemberModalOpen] = useState(false);

  const [memberIdToMove,setMemberIdToMove] = useState(null);
  const [showAssignTopicPage,setShowAssignTopicPage] = useState(false);
  const [cardsArray,setCardsArray] = useState([]);
  const [loading,setLoading] = useState(false);
  const [connectionError,setConnectionError] = useState(false);
  const handleJoinClick = () => {
    setShowJoinAlert(true);
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


useEffect(() => {
  console.log("My team members : " , myTeamMembers);
  const fetchPublishedCards = async () => {
    if (loading) return; // Prevent multiple fetches when already loading
    setLoading(true); // Start loading
    try {
      const response = await axios.get("/pfe/validpfe");
      if (response.data && response.data.pfeList) {
        setCardsArray(response.data.pfeList);
        console.log(response);
      }
      /* setPublishedCardsArray(data); // Save data in state */
    } catch (error) {
      console.error("Error fetching the submitted cards data:", error);

      setConnectionError(true); // Set connection error state
    } finally {
      setLoading(false); // Stop loading
    }
  };

  fetchPublishedCards();
  console.log("cardsArray:", cardsArray, Array.isArray(cardsArray));


}, []);

 

  // If team members are not provided via props, fall back to static data.
  const staticTeamMembers = [
    { fullName: "XX", email: "XX@example.com", group: "Group XX", role: "XX" },
  
  ];

  // Use passed team members if available; otherwise, static data.
  const membersToDisplay = myTeamMembers.length > 0 ? myTeamMembers : staticTeamMembers;
  if (showAssignTopicPage){
    return(
    <div className={Module["cards-container"]}>
      {cardsArray.map((card) => (
        <PFECard
          key={card.id}
          card={card}
          onExplore={(e) => {
            e.stopPropagation();
          }}
          buttonText={"Assign"}
        />
      ))}
    </div>);
  }
  return (
    <div className={Module["admin-see-more-container"]}>
      <div className={Module["my-team-header"]}>
        <div className={Module["header-left"]}>
          <h2>Team Number</h2>
          <p>
            team number <span>{myTeamNumber}</span>
          </p>
        </div>
      </div>

      <h2>Team Members</h2>
      <div className={Module["table-wrapper-see-more"]}>
        <table>
          <thead>
            <tr>
              <th>Full Name</th>
              <th>Email Address</th>
              <th>group</th>
              <th>Role</th>
            </tr>
          </thead>
          <tbody>
            {membersToDisplay.map((member, index) => (
              <tr key={index}>
                <td>{member.fullName}</td>
                <td>{member.email}</td>
                <td>{"05"}</td>
                <td>{member.role}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <h2>Preferences list</h2>
      <div className={Module["table-wrapper-see-more"]}>
        <table>
          <thead>
            <tr>
              <th>Order</th>
              <th>Topic Title</th>
             
              <th>Main Supervisor</th>
              <th>Result</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {membersToDisplay.map((member, index) => (
              <tr key={index}>
                <td>{member.fullName}</td>
                <td>{member.email}</td>
              
                <td>{member.role}</td>
                <td></td>
                  <td className={Module["button-container"]}>
                                        <button
                                          className={Module["invite-button"]}
                                          style={{ width: "90px", marginRight: "15px" }}
                                         
                                        >
                                          Read
                                        </button>
                                      </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className={Module["lower-header"]}> 
          <h2>Assigned topic</h2>
            <div className={Module["buttons-container-see-more"]}>
            
              <button
                className={Module["admin-auto-assign-button"]}
                onClick={() => setShowAddMembersModal(true)}
              >
                auto-assign
              </button>
              <button className={Module["admin-assign-topic-button"]} onClick={() => {setShowAssignTopicPage(true)}}>
                Assign a topic
              </button>
      </div>
      </div>
      <div className={Module["table-wrapper-see-more"]}>
        <table>
          <thead>
            <tr>
              <th>Supervisor</th>
              <th>Topic title</th>
            </tr>
          </thead>
          <tbody>
            
              <tr >
                <td>{"No supervisor yet"}</td>
                <td>{"No topic yet"}</td>
              </tr>
            
          </tbody>
        </table>
      </div>
      
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