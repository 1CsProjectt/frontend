import React, { useState } from "react";
import warningIcon from "../../assets/warning-icon.svg";
import classes from "../../styles/DeleteUserModal.module.css";
import SuccessConfirmationModal from "./SuccessConfirmationModal";

const DeleteUserModal = ({ isOpen, onClose, onDelete }) => {
  const [showSuccessConfirmationModal, setSuccessConfirmationModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(true); // New state

  if (!isOpen) return null;

  const handleDelete = () => {
    setShowDeleteModal(false); // Hide delete modal
    setSuccessConfirmationModal(true); // Show success modal

    // TODO: Insert backend delete logic here
    onDelete && onDelete();
  };

  return (
    <>
      {showSuccessConfirmationModal && (
        <SuccessConfirmationModal
          message="The item has been successfully deleted! You won’t be able to undo this action."
          onClose={() => {
            setSuccessConfirmationModal(false); // Hide success modal
            onClose(); // Close entire modal component
          }}
        />
      )}

      {showDeleteModal && (
        <div className={classes["modal-overlay"]}>
          <div className={classes["modal-container"]}>
            <div className={classes["modal-header"]}>
              <img src={warningIcon} alt="Warning Icon" width="50" />
              <h2 className={classes["modal-title"]}>Delete User</h2>
            </div>
            <p className={classes["modal-text"]}>
              Are you sure you want to delete this? This action cannot be undone.
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
