import React, { useState, useEffect, useCallback, useRef } from "react";
import { useOutletContext } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import "../styles/teacher.css";
import PFECard from "../components/CardComponent";
import axios from "axios";
import Alert from "../assets/alert-circle.svg";
import SuccessIcon from "../assets/success-icon.svg";

const TeacherTopics = () => {
  const { cards, setCards } = useOutletContext();
  const [Success, setSuccess] = useState(false);
  const [onDelete, setOnDelete] = useState(false);
  const [isChecked, setIsChecked] = useState(false);
  const [selectedCount, setSelectedCount] = useState(0);
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [selectedIds, setSelectedIds] = useState([]);
  const navigate = useNavigate();
  console.log("TEACHE CARDS", cards);
  const totalCount = cards.length; // Get total number of PFE topics

  const handleButtons = () => {
    // Do nothing if there are no topics

    if (onDelete) {
      setShowConfirmation(true); // Show confirmation popup
    } else {
      setOnDelete(true);
    }
  };
  const reset = () => {
    setSelectedIds([]);
    setShowConfirmation(false);
    setOnDelete(false);
    setSelectedCount(0);
    setIsChecked(false);
  };

  const confirmDelete = async () => {
    try {
      const validIds = selectedIds.filter(
        (id) => id !== undefined && id !== null
      );
      if (validIds.length === 0) return;

      await Promise.all(
        validIds.map((id) =>
          axios.delete(`/pfe/delete/${id}`, {
            withCredentials: true,
            headers: {
              "ngrok-skip-browser-warning": "true",
            },
          })
        )
      );

      // Try to re-fetch the data
      try {
        const response = await axios.get("/pfe/my-pfes", {
          withCredentials: true,
          headers: {
            "ngrok-skip-browser-warning": "true",
          },
        });

        if (response.data?.data) {
          setCards(response.data.data);
        }
      } catch (err) {
        if (err.response?.status === 404) {
          // Backend is saying no PFEs exist — that's okay
          setCards([]); // Set an empty list
        } else {
          throw err; // Other errors still need to be caught
        }
      }

      reset();
      setSuccess(true);
    } catch (error) {
      console.error("Failed to delete topic(s):", error);
      alert("Failed to delete one or more topics.");
      reset();
    }
  };
  const cancelDelete = () => {
    reset();
  };
  const onOkey = () => {
    setSuccess(false);
    reset();
  };
  const handleToggle = () => {
    if (isChecked) {
      setSelectedCount(0);
      setSelectedIds([]); // If unchecked, reset count
    } else {
      setSelectedCount(totalCount);
      setSelectedIds(cards.map((card) => card.id));
    }
    setIsChecked(!isChecked); // Toggle state
  };

  return (
    <div className="containert">
      <div className="pageheader">
        <p className="pagetitle">MyTopics</p>
        {onDelete && (
          <div className="delete-popup">
            {" "}
            <div className="selection-container" onClick={handleToggle}>
              <input
                type="radio"
                id="all"
                name="selection"
                className="radio-input"
                checked={isChecked}
                readOnly
              />
              <label htmlFor="all" className="label-text">
                All
              </label>
            </div>
            <span className="selected-count">{selectedCount} Selected</span>
          </div>
        )}

        <p className="spacing"></p>
        <button className="btnd" onClick={handleButtons}>
          {" "}
          <p className="managebtns-text">Delete Topics</p>
        </button>
        <button
          className={` ${onDelete ? "btna-on-cancel" : "btna"}`}
          onClick={onDelete ? cancelDelete : () => navigate("Addatopic")}
        >
          <p className={` ${onDelete ? "txt-on-cancel" : "managebtns-text"}`}>
            {onDelete ? "Cancel" : "Add a Topic"}
          </p>
        </button>
      </div>
      {showConfirmation && (
        <Popup onCancel={cancelDelete} onConfirm={confirmDelete} poproud={1} />
      )}

      {Success && <Popup poproud={2} onOkey={onOkey} />}
      <PFEList
        filteredCards={cards}
        onDelete={onDelete}
        selectedIds={selectedIds}
        setSelectedIds={setSelectedIds}
        setSelectedCount={setSelectedCount}
      />
    </div>
  );
};

const Popup = ({ onCancel, onConfirm, poproud, onOkey }) => {
  const popupRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (popupRef.current && !popupRef.current.contains(event.target)) {
        onCancel(); // Close popup when clicking outside
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [onCancel]);

  return (
    <div className="overlay">
      {poproud === 1 && (
        <div className="popup-cont" ref={popupRef}>
          <div className="conf-warn-cont">
            {" "}
            <img src={Alert} alt="" className="conf-warn" />
          </div>
          <p className="conf-ttl">Delete PFE Topics</p>
          <p className="conf-mssg">
            Are you sure you want to delete this? This action cannot be undone.
          </p>
          <div className="conf-btns">
            <button className="cancel-button" onClick={onCancel}>
              Cancel
            </button>

            <button className="delete-button" onClick={onConfirm}>
              Delete
            </button>
          </div>
        </div>
      )}
      {poproud === 2 && (
        <div className="popup-cont" ref={popupRef}>
          <div className="conf-warn-cont">
            {" "}
            <img src={SuccessIcon} alt="" className="conf-warn" />
          </div>
          <p className="conf-ttl">Success!</p>
          <p className="conf-mssg">
            The item has been successfully deleted! You won't be able to undo
            this action.
          </p>
          <div className="conf-btn">
            <button className="okey-button" onClick={onOkey}>
              Okey
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

const PFEList = ({
  filteredCards,
  onDelete,
  selectedIds,
  setSelectedIds,
  setSelectedCount,
}) => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const handleCardClick = (id) => {
    if (onDelete) {
      setSelectedIds((prevSelected) => {
        const isSelected = prevSelected.includes(id);
        const newSelected = isSelected
          ? prevSelected.filter((selectedId) => selectedId !== id) // Remove if already selected
          : [...prevSelected, id]; // Add if not selected

        // Update the count based on selection change
        setSelectedCount(newSelected.length);

        return newSelected;
      });
    }
  };

  return (
    <div className="cards-container">
      {console.log("Filtered Cards: ", filteredCards)}{" "}
      {/* Debugging filteredCards */}
      {filteredCards.length > 0 ? (
        filteredCards.map((card, index) => (
          <PFECard
            key={card.id || index}
            card={card}
            isSelected={selectedIds.includes(card.id)}
            toggleSelect={() => handleCardClick(card.id)}
          />
        ))
      ) : (
        <p className="no-results-text">No projects found.</p>
      )}
    </div>
  );
};
export default TeacherTopics;
