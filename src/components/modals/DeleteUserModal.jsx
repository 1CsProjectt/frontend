import React, { useState } from "react";
import warningIcon from "../../assets/warning-icon.svg";
import classes from "../../styles/DeleteUserModal.module.css";
import SuccessConfirmationModal from "./SuccessConfirmationModal";


const DeleteUserModal = ({ isOpen, onClose, onDelete, entityType ,userToDelete}) => {// the entity type is a string for now just to change the display of the message upon deletion
  const [showSuccessConfirmationModal, setSuccessConfirmationModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(true);

  if (!isOpen) return null;


  const handleDelete = async () => {
  
  
    try {
      const response = await fetch('/users/delete', {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          id: userToDelete.id, 
          email: userToDelete.email,
        }),
      });
  
      const result = await response.json();
  
      if (response.ok) {
        alert(result.message);
        setShowDeleteModal(false);
    
        setSuccessConfirmationModal(true);
        window.location.reload();
        
      } else {
        alert(result.message || 'Failed to delete user.');
      }
    } catch (error) {
      console.error("Delete error:", error);
      alert("An error occurred while deleting the user.");
    }
  };
  

  return (
    <>
      {showSuccessConfirmationModal && (
        <SuccessConfirmationModal
          message={`The ${entityType} : ${userToDelete.username} has been successfully deleted! You won’t be able to undo this action.`}
          onClose={() => {
            setSuccessConfirmationModal(false);
            onClose();
          }}
        />
      )}

      {showDeleteModal && (
        <div className={classes["modal-overlay"]}>
          <div className={classes["modal-container"]}>
            <div className={classes["modal-header"]}>
              <img src={warningIcon} alt="Warning Icon" width="50" />
              <h2 className={classes["modal-title"]}>Delete {entityType}</h2>
            </div>
            <p className={classes["modal-text"]}>
              Are you sure you want to delete this {entityType} : {userToDelete.username}? This action cannot be undone.
            </p>
            <div className={classes["modal-actions"]}>
              <button className={classes["cancel-btn"]} onClick={onClose}>
                Cancel
              </button>
              <button className={classes["delete-btn"]} onClick={handleDelete}>
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default DeleteUserModal;
