import React, { useState } from "react";
import warningIcon from "../../assets/warning-icon.svg";
import blueWarningIcon from "../../assets/blue-warning-icon.svg";
import classes from "../../styles/PfeTopicModal.module.css";
import SuccessConfirmationModal from "./SuccessConfirmationModal";


const PfeTopicModal = ({ isOpen, onClose, onDelete, entityType ,operation }) => {// the entity type is a string for now just to change the display of the message upon deletion
  const [showSuccessConfirmationModal, setSuccessConfirmationModal] = useState(false);
  const [showModal, setShowModal] = useState(true);

  if (!isOpen) return null;

  const handleDelete = () => {
    setShowModal(false);
    setSuccessConfirmationModal(true);

    // TODO: Insert backend delete logic here
    onDelete && onDelete();
  };

  const handleDecline = () => {

  };
  const handleValidate = () => {
  };

  
entityType = "Topic";//entityType is a prop to pass to the success confirmation modal


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
              Are you sure you want to delete the Selected Topic(s)? This action cannot be undone.
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
}

else if(operation == "decline") {
  return (
    <>
      {showSuccessConfirmationModal && (
        <SuccessConfirmationModal
          message={`The ${entityType}(s) has been successfully declined ! You won’t be able to undo this action.`}
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
              <h2 className={classes["modal-title"]}>Decline PFE Topic </h2>
            </div>
            <p className={classes["modal-text"]}>
              Are you sure you want to decline this {entityType}? This action cannot be undone.
            </p>
            <div className={classes["modal-actions"]}>
              <button className={classes["cancel-btn"]} onClick={onClose}>
                Cancel
              </button>
              <button className={classes["decline-btn"]} onClick={handleDecline}>
                Decline
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );

}else if(operation == "validate") {
  return (
    <>
      {showSuccessConfirmationModal && (
        <SuccessConfirmationModal
          message={`The ${entityType}(s) has been successfully validated! You won’t be able to undo this action.`}
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
              <img src={blueWarningIcon} alt="blue Warning Icon" width="50" />
              <h2 className={classes["modal-title"]}> Validate PFE Topic</h2>
            </div>
            <p className={classes["modal-buttontext"]}>
              Are you sure you want to validate this {entityType}? This action cannot be undone.
            </p>
            <div className={classes["modal-actions"]}>
              <button className={classes["cancel-btn"]} onClick={onClose}>
                Cancel
              </button>
              <button className={classes["validate-btn"]} onClick={handleValidate}>
                Validate
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );

};
}
export default PfeTopicModal;
