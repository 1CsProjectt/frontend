import React, { useState ,useEffect } from "react";
import classes from "../../styles/StartNewSessionModal.module.css";
import axios from "axios";
import SuccessConfirmationModal from "./SuccessConfirmationModal";
const EditExistingSessionModal = ({ isOpen, onClose ,sessionsPageActiveTab,sessionToUpdate , setShowToast ,setToastMessage ,setToastError}) => {
  

  
  // State for form fields
  
  const [maxMembers, setMaxMembers] = useState(5);
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [sessionName, setSessionName] = useState("");
  const [isSuccessModalOpen,setIsSuccessModalOpen] =useState(false);



  useEffect(() => {
    if (isOpen && sessionToUpdate) {
      setStartDate(sessionToUpdate.startTime?.slice(0, 10)); // or format it
      setEndDate(sessionToUpdate.endTime?.slice(0, 10));
      setMaxMembers(sessionToUpdate.maxNumber ?? "");
    }
  }, [isOpen, sessionToUpdate]);


  if (!isOpen) return null;
  // If success modal is open, hide the edit modal and render only the success modal
  if (isSuccessModalOpen) {
    return (
      <SuccessConfirmationModal
        message={"The session has been updated successfully"}
        onClose={() => {
          setIsSuccessModalOpen(false);
          onClose(); // also close the parent when success modal is dismissed
        }}
      />
    );
  }
  const hanldeEditSession = (sessionToUpdate) =>{
    if (!startDate || !endDate || (sessionsPageActiveTab === "Team Formation Session" && !maxMembers)) {
        alert("Please fill out all fields before updating the session.");
        return;
      }
      const start = new Date(startDate);
      const end = new Date(endDate);
    
      if (start > end) {
        setToastMessage("Start date cannot be after end date.");
        setToastError(true);
        setShowToast(true);
        return;
      }
      

    const updateEvent = async () => {
      try {
        const response = await axios.patch(
          `/session/update/${sessionToUpdate.id}`, 
          {
            // send only what the controller expects:
            startTime: startDate,
            endTime: endDate,
            maxNumber: maxMembers
          },
          {
            // include credentials if your protect/restricted middleware
            // expects a cookie or session token
            withCredentials: true
          }
        );
    
        console.log('Success:', response.data);
        
        setIsSuccessModalOpen(true);
      } catch (error) {
        console.error(' Error:', error.response?.data || error.message);
      }
    };
    
    updateEvent();


  }



  return (
    <div className={classes["modal-overlay"]}>
      <div className={classes["modal-content"]}>
        <h2>Edit This session</h2>
        <p className={classes["modal-description"]}>
          Edit an already existing session . Tailor each
          session to meet your needs and ensure a seamless experience.
        </p>

        

        {/* Max Members Input */}
        {sessionsPageActiveTab === "Team Formation Session" ? (
          <div className={classes["form-group"]}>
            <label>Max members</label>
            <input
              type="number"
              placeholder="Enter max members"
              value={maxMembers}
              onChange={(e) => setMaxMembers(e.target.value)}
            />
          </div>
        ) : null}

        {/* Date Inputs */}
        <div className={classes["date-container"]}>
          <div className={classes["date-group"]}>
            <label>Start date</label>
            <input
              type="date"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
            />
          </div>

          <div className={classes["date-group"]}>
            <label>End date</label>
            <input
              type="date"
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
            />
          </div>
        </div>

        {/* Buttons */}
        <div className={classes["button-container"]}>
          <button className={classes["cancel-btn"]} onClick={onClose}>
            Cancel
          </button>
          <button
            className={classes["create-btn"]}
            //edit in this case not create
            onClick={() => 
                hanldeEditSession(sessionToUpdate)
            }
        
       
          >
            Update
          </button>
        </div>
      </div>

      {isSuccessModalOpen && (
  <SuccessConfirmationModal
    message={"The session has been updated successfully"}
    onClose={() => setIsSuccessModalOpen(false)}
  />
)}

    </div>
  );
};

export default EditExistingSessionModal;
