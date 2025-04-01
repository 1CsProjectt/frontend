import React, { useState } from "react";
import warningIcon from "../../assets/warning-icon.svg";
import classes from "../../styles/DeleteUserModal.module.css";
import SuccessConfirmationModal from "./SuccessConfirmationModal";


const DeleteUserModal = ({ isOpen, onClose, onDelete, entityType }) => {// the entity type is a string for now just to change the display of the message upon deletion
  const [showSuccessConfirmationModal, setSuccessConfirmationModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(true);

  if (!isOpen) return null;

  const handleDelete = () => {
    setShowDeleteModal(false);
    setSuccessConfirmationModal(true);

    // TODO: Insert backend delete logic here
    onDelete && onDelete();
  };

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

      {showDeleteModal && (
        <div className={classes["modal-overlay"]}>
          <div className={classes["modal-container"]}>
            <div className={classes["modal-header"]}>
              <img src={warningIcon} alt="Warning Icon" width="50" />
              <h2 className={classes["modal-title"]}>Delete {entityType}</h2>
            </div>
            <p className={classes["modal-text"]}>
              Are you sure you want to delete this {entityType}? This action cannot be undone.
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
