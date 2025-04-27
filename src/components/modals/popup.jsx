import React, { useState, useRef, useEffect } from "react";
import Alert from "../../assets/alert-circle.svg";
import SuccessIcon from "../../assets/success-icon.svg";
import "../../styles/teacher.css";

const Popup = ({
  onCancel,
  onConfirm,
  onOkey,
  poproud,
  confirmTitle,
  confirmMessage,
  successTitle = "Success!",
  status,
  successMessage = "The item has been successfully deleted! You won't be able to undo this action.",
  cancelText = "Cancel",
  confirmText = "Delete",
  okeyText = "Okey",
}) => {
  const popupRef = useRef(null);

  useEffect(() => {
    if (poproud !== 1) return;

    const handleClickOutside = (event) => {
      if (popupRef.current && !popupRef.current.contains(event.target)) {
        onCancel();
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [onCancel, poproud]);

  return (
    <div className="overlay">
      {poproud === 1 && (
        <div className="popup-cont" ref={popupRef}>
          <div
            className="conf-warn-cont"
            style={{
              backgroundColor: status === "blue" ? "#077ED4" : "#f76659",
            }}
          >
            <img src={Alert} alt="" className="conf-warn" />
          </div>
          <p className="conf-ttl">{confirmTitle}</p>
          <p className="conf-mssg">{confirmMessage}</p>
          <div className="conf-btns">
            <button className="cancel-button" onClick={onCancel}>
              {cancelText}
            </button>
            <button
              className="popup-button-popup"
              onClick={onConfirm}
              style={{
                backgroundColor: status === "blue" ? "#077ED4" : "#f76659",
              }}
            >
              {confirmText}
            </button>
          </div>
        </div>
      )}
      {poproud === 2 && (
        <div className="popup-cont" ref={popupRef}>
          <div className="conf-warn-cont">
            <img src={SuccessIcon} alt="" className="conf-warn" />
          </div>
          <p className="conf-ttl">{successTitle}</p>
          <p className="conf-mssg">{successMessage}</p>
          <div className="conf-btn">
            <button className="okey-button" onClick={onOkey}>
              {okeyText}
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Popup;
