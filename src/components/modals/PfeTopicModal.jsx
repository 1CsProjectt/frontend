import React, { useState } from "react";
import axios from "axios";
import warningIcon from "../../assets/warning-icon.svg";
import blueWarningIcon from "../../assets/blue-warning-icon.svg";
import classes from "../../styles/PfeTopicModal.module.css";
import SuccessConfirmationModal from "./SuccessConfirmationModal";
import { useNavigate } from "react-router-dom";

const PfeTopicModal = ({
  isOpen,
  onClose,
  onDelete,
  entityType,
  operation,
  selectedcardsid,
  validatedcardid,
  setCardsArray,
  role,
  specializationArray,
  supervisorsToAssign,
  cardIdToAssign,
  myTeamNumber,
  card
}) => {
  // the entity type is a string for now just to change the display of the message upon deletion
  const [showSuccessConfirmationModal, setSuccessConfirmationModal] =
    useState(false);
  const [showModal, setShowModal] = useState(true);
  
  const navigate = useNavigate();
   const addSupervisorsToPFE = async (pfeId, supervisorIds) => {
      try {
        const response = await axios.post(`/pfe/${pfeId}/add-supervisor`, {
          supervisors: supervisorIds
        });
        
        console.log("Supervisors added:", response.data);
        return response.data;
      } catch (error) {
        console.error("Failed to add supervisors:", error.response?.data || error.message);
        throw error;
      }
    };
    // Frontend: send JSON body, not FormData

const addSpecializationToPFE = async (pfeId, specializationArray) => {

  try {
    console.log("Specializations being sent (JSON):", specializationArray);

    const response = await axios.post(
      `/pfe/${pfeId}/add-specialization`,
      { specialization: specializationArray },            // JSON array
      {
        withCredentials: true,
        headers: {
          "ngrok-skip-browser-warning": "true",
          // Axios will automatically set Content-Type: application/json
        },
      }
    );

    console.log("Specialization added:", response.data);
    return response.data;
  } catch (error) {
    console.error(
      "Failed to add specialization:",
      error.response?.data || error.message
    );
    throw error;
  }
};

    
    
  if (!isOpen) return null;

  const handleDelete = async () => {
    setShowModal(false);
    setSuccessConfirmationModal(true);

    // TODO: Insert backend delete logic here

    try {
      const validIds = selectedcardsid
        .map((card) => (typeof card === "object" ? card.id : card))
        .filter((id) => id !== undefined && id !== null);
      console.log("Deleting IDs:", validIds);
      if (validIds.length === 0) return;

      await Promise.all(
        validIds.map((id) =>
          axios.delete(`/pfe/admin/delete/${id}`, {
            withCredentials: true,
            headers: {
              "ngrok-skip-browser-warning": "true",
            },
          })
        )
      );
      try {
        const response = await axios.get("/pfe/pending");
        if (response.data && response.data.pfeList) {
          setCardsArray(response.data.pfeList);
          console.log(response);
        }
        /*  setSubmittedCardsArray(data); // Save data in state */
      } catch (error) {
        console.error("Error fetching the submitted cards data:", error);
        alert("An error occurred while fetching the submitted cards data.");
      }
      // Try to re-fetch the data
      // try {
      //   const response = await axios.get("/pfe/my-pfes", {
      //     withCredentials: true,
      //     headers: {
      //       "ngrok-skip-browser-warning": "true",
      //     },
      //   });

      //   if (response.data?.data) {
      //     setCards(response.data.data);
      //   }
      // } catch (err) {
      //   if (err.response?.status === 404) {
      //     // Backend is saying no PFEs exist — that's okay
      //     setCards([]); // Set an empty list
      //   } else {
      //     throw err; // Other errors still need to be caught
      //   }
      // }

      // reset();
      // setSuccess(true);
    } catch (error) {
      console.error("Failed to delete topic(s):", error);
      if (error.response) {
        console.error("Backend responded with:", error.response.data);
      } else if (error.request) {
        console.error("No response received:", error.request);
      } else {
        console.error("Error setting up request:", error.message);
      }
    }
  };

  const handleDecline = () => {};
  const handleValidate = async () => {
    if (role === "extern") {
      const supervisorIds = supervisorsToAssign.map((sup) => sup.id);
// e.g. [3, 7, 12]

    await addSupervisorsToPFE(validatedcardid, supervisorIds);
      //the supervisorsToAssign is the id of the supervisor to assign and it must be passed as an array
     if (card.year === "2CS" || card.year === "3CS" ) {addSpecializationToPFE(validatedcardid, specializationArray);}
    }
    try {
      const response = await axios.patch(
        `/pfe/${validatedcardid}/validate`,
        {}, // optional body, or provide data if needed
        {
          withCredentials: true,
          headers: {
            "ngrok-skip-browser-warning": "true",
          },
        }
      );

      setShowModal(false);
      setSuccessConfirmationModal(true);

      // Optional: handle success
      console.log("Validation successful:", response.data);
    } catch (error) {
      console.error("Validation error:", error);
      alert("Validation failed.");
    }
  };
  
  const handleAssign = async (teamId, newPfeId) => {
    try {
      const response = await axios.post('/pfe/changePfeForTeam', {
        teamId,
        newPfeId
      });
      
      console.log('Success:', response.data);
       // After successful assign, hide this dialog and show confirmation:
       setShowModal(false);
       setSuccessConfirmationModal(true);
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
  entityType = "Topic"; //entityType is a prop to pass to the success confirmation modal

  if (operation == "delete") {
    return (
      <>
        {showSuccessConfirmationModal && (
          <SuccessConfirmationModal
            message={`The ${entityType}(s) has been successfully deleted! You won’t be able to undo this action.`}
            onClose={() => {
              setSuccessConfirmationModal(false);
              onClose();
            }}
          />
        )}

        {showModal && (
          <div className={classes["modal-overlay"]}>
            <div className={classes["modal-container"]}>
              <div className={classes["modal-header"]}>
                <img src={warningIcon} alt="Warning Icon" width="50" />
                <h2 className={classes["modal-title"]}>Delete </h2>
              </div>
              <p className={classes["modal-text"]}>
                Are you sure you want to delete the Selected Topic(s)? This
                action cannot be undone.
              </p>
              <div className={classes["modal-actions"]}>
                <button className={classes["cancel-btn"]} onClick={onClose}>
                  Cancel
                </button>
                <button
                  className={classes["delete-btn"]}
                  onClick={handleDelete}
                >
                  Delete
                </button>
              </div>
            </div>
          </div>
        )}
      </>
    );
  } else if (operation == "decline") {
    return (
      <>
        {showSuccessConfirmationModal && (
          <SuccessConfirmationModal
            message={`The ${entityType}(s) has been successfully declined ! You won’t be able to undo this action.`}
            onClose={() => {
              setSuccessConfirmationModal(false);
              onClose();
              navigate(-1);
            }}
          />
        )}

        {showModal && (
          <div className={classes["modal-overlay"]}>
            <div className={classes["modal-container"]}>
              <div className={classes["modal-header"]}>
                <img src={warningIcon} alt="Warning Icon" width="50" />
                <h2 className={classes["modal-title"]}>Decline PFE Topic </h2>
              </div>
              <p className={classes["modal-text"]}>
                Are you sure you want to decline this {entityType}? This action
                cannot be undone.
              </p>
              <div className={classes["modal-actions"]}>
                <button className={classes["cancel-btn"]} onClick={onClose}>
                  Cancel
                </button>
                <button
                  className={classes["decline-btn"]}
                  onClick={handleDecline}
                >
                  Decline
                </button>
              </div>
            </div>
          </div>
        )}
      </>
    );
  } else if (operation == "validate") {
    return (
      <>
        {showSuccessConfirmationModal && (
          <SuccessConfirmationModal
            message={`The ${entityType}(s) has been successfully validated! You won’t be able to undo this action.`}
            onClose={() => {
              setSuccessConfirmationModal(false);
              onClose();
              navigate("/admin/sessions/topic-validation");
            }}
          />
        )}

        {showModal && (
          <div className={classes["modal-overlay"]}>
            <div className={classes["modal-container"]}>
              <div className={classes["modal-header"]}>
                <img src={blueWarningIcon} alt="blue Warning Icon" width="50" />
                <h2 className={classes["modal-title"]}> Validate PFE Topic</h2>
              </div>
              <p className={classes["modal-buttontext"]}>
                Are you sure you want to validate this {entityType}? This action
                cannot be undone.
              </p>
              <div className={classes["modal-actions"]}>
                <button className={classes["cancel-btn"]} onClick={onClose}>
                  Cancel
                </button>
                <button
                  className={classes["validate-btn"]}
                  onClick={handleValidate}
                >
                  Validate
                </button>
              </div>
            </div>
          </div>
        )}
      </>
    );
  }else if (operation == "assign") {
    return (
      <>
        {showSuccessConfirmationModal && (
          <SuccessConfirmationModal
            message={`The ${entityType}(s) has been successfully validated! You won’t be able to undo this action.`}
            onClose={() => {
              setSuccessConfirmationModal(false);
              onClose();
              navigate(-1);
            }}
          />
        )}

        {showModal && (
          <div className={classes["modal-overlay"]}>
            <div className={classes["modal-container"]}>
              <div className={classes["modal-header"]}>
                <img src={blueWarningIcon} alt="blue Warning Icon" width="50" />
                <h2 className={classes["modal-title"]}>Assign the Topic</h2>
              </div>
              <p className={classes["modal-buttontext"]}>
                Are you sure you want to assign the Topic to this team
              </p>
              <div className={classes["modal-actions"]}>
                <button className={classes["cancel-btn"]} onClick={onClose}>
                  Cancel
                </button>
                <button
                  className={classes["validate-btn"]}
                  onClick={() => handleAssign(myTeamNumber, cardIdToAssign)}
                >
                  Assign
                </button>
              </div>
            </div>
          </div>
        )}
      </>
    );
  }
};
export default PfeTopicModal;
