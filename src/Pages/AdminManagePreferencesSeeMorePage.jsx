//add that if you are alredt in a team you can not click the join button(i can write in the button that you are alredy in a team)

import React, { useState , useEffect} from "react";
import { useNavigate } from "react-router-dom";
import Module from "../styles/AdminManagePreferencesPage.module.css";
import axios from "axios";
import PFECard from "../components/CardComponent";
import Toast from "../components/modals/Toast";


const Seemorepage = ({ myTeamNumber, myTeamMembers = [] ,students, onBack ,selectedTeam }) => {
  //selected team is the entire team object
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
  const [prefList,setPrefList] = useState([]);
  const [filteredCards,setFilteredCards] = useState([]);
  const navigate = useNavigate();

  const fetchPrefList = async (teamId) => {
    try {
      const response = await axios.get(`/preflist/${myTeamNumber}`, {
        withCredentials: true, // important if you're using cookies/sessions
      });
      console.log("the preference list of this team : " ,response.data.data); // your preflist array
      setPrefList(response.data.data || []); // if null, set to empty array
      return response.data.data;
    } catch (error) {
      console.error(error.response?.data?.message || error.message);
      setPrefList([]); // if error, set empty array to prevent crashing
      
    }
  };


const changePfeForTeam = async (teamId, newPfeId) => {
  try {
    const response = await axios.post('/pfe/changePfeForTeam', {
      teamId,
      newPfeId
    });
    
    console.log('Success:', response.data);
  } catch (error) {
    if (error.response) {
      // The server responded with a status code outside of the 2xx range
      console.error('Error:', error.response.data.message);
    } else {
      // The request was made but no response was received
      console.error('Error:', error.message);
    }
}
  }




  const autoAssignPfe = async (teamId) => {
    try {
      const response = await axios.post('/pfe/autoAssignPfesToTeamWithoutPfe', {
        teamId
      },{ withCredentials: true });
  
      console.log('Success:', response.data);
    } catch (error) {
      if (error.response) {
        console.error('Error:', error.response.data.message);
      } else {
        console.error('Error:', error.message);
      }
    }
  };
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
  console.log("selectedTeam is : " ,selectedTeam);
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
  fetchPrefList();//the fetch happens upon page loading


  
}, []);

useEffect(() => {
  if (cardsArray.length > 0 && selectedTeam) {
    const newFilteredCards = cardsArray.filter(card =>
      card.year === selectedTeam.members[0].year && 
      card.specialization === selectedTeam.members[0].specialite
    );
    setFilteredCards(newFilteredCards);
    console.log("filtered cards array for a specific year and specialite :", filteredCards)
  }
}, [cardsArray, selectedTeam]);
 

  // If team members are not provided via props, fall back to static data.
  const staticTeamMembers = [
    { fullName: "XX", email: "XX@example.com", group: "Group XX", role: "XX" },
  
  ];

  // Use passed team members if available; otherwise, static data.
  const membersToDisplay = myTeamMembers.length > 0 ? myTeamMembers : staticTeamMembers;
  if (showAssignTopicPage){
    return(
      
      
    <div className={Module["cards-container"]}>
       {/* <div><p>{"showing pfes for year " + selectedTeam?.members[0]?.year}
        <br/>
      {"showing pfes for speciality " + selectedTeam?.members[0]?.specialite}
      
      </p>
      </div> */}
      {filteredCards.map((card) => (
        <PFECard
          key={card.id}
          card={card}
          toggleSelect={() => {}}
          onExplore={(e) => {
            e.stopPropagation();
            changePfeForTeam(myTeamNumber,card.id);
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
              <th>Topic Supervisor</th>
              <th>Result</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {prefList.map((card, index) => (
              <tr key={index}>
                <td>{card?.order}</td>
                <td>{card?.PFE?.title}</td>
                <td>
                  {card?.supervisors?.length > 0
                    ? `${card.supervisors[0]?.firstname} ${card.supervisors[0]?.lastname}`
                    : "No supervisor assigned yet for this project"}
                </td>
                <td>
                  <button
                                          onClick={(e) => {
                                            e.stopPropagation();
                                            // Trigger navigation when the button is clicked
                                            navigate(
                                              
                                                 "/admin/sessions/manage-preferences/read-topic",
                                                
                                              {
                                                state: { card }, // Pass the card object to the new route
                                              } 
                                            );
                                          }}
                                          className={Module["invite-button"]}
                                        >
                                          Read
                                        </button>
                </td>

                {/*  assuming the first supervisor in the list is the main supervisor of the card */}
                <td>{card?.approved || "Waiting"}</td>
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
                 onClick={() =>   autoAssignPfe(myTeamNumber)}
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
              <th>Team Supervisor</th>
              <th>Topic title</th>
            </tr>
          </thead>
          <tbody>
            
              <tr >
              <td>
                        {selectedTeam?.supervisor?.firstname && selectedTeam?.supervisor?.lastname
                          ? `${selectedTeam.supervisor.firstname} ${selectedTeam.supervisor.lastname}`
                          : "No supervisor assigned yet"}
                      </td>
                <td>{selectedTeam.assignedPFE ? (selectedTeam.assignedPFE.title || "No topic assigned yet") : "No topic assigned yet"}</td>
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