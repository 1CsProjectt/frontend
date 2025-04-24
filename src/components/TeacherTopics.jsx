import React, { useState, useEffect, useCallback, useRef } from "react";
import { useOutletContext, useNavigate } from "react-router-dom";
import "../styles/teacher.css";
import PFECard from "../components/CardComponent";
import axios from "axios";
import Alert from "../assets/alert-circle.svg";
import SuccessIcon from "../assets/success-icon.svg";

const SUBMITTED = "Submitted";
const VALIDATED = "Validated";
const DECLINED = "Declined";

const TeacherTopics = () => {
  const { Role } = useOutletContext();
  const [cards, setCards] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);
  const [onDelete, setOnDelete] = useState(false);
  const [isChecked, setIsChecked] = useState(false);
  const [selectedCount, setSelectedCount] = useState(0);
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [selectedIds, setSelectedIds] = useState([]);
  const [activeTab, setActiveTab] = useState(SUBMITTED);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get("/pfe/my-pfes", {
          withCredentials: true,
        });

        if (response.data?.data) {
          setCards(response.data.data);
        }
      } catch (err) {
        console.error("Error fetching card data", err);
        if (err.response?.status === 401) {
          alert("Session expired. Please log in again.");
          navigate("/login");
        } else {
          setError("Failed to fetch PFE projects. Please try again later.");
        }
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [navigate]);

  // Filter cards based on status
  const submittedCards = cards.filter(
    (card) => card.status === "NOT_VALIDE" || !card.status
  );
  const validatedCards = cards.filter((card) => card.status === "VALIDE");
  const declinedCards = cards.filter((card) => card.status === "REJECTED");

  const getCurrentCards = () => {
    switch (activeTab) {
      case SUBMITTED:
        return submittedCards;
      case VALIDATED:
        return validatedCards;
      case DECLINED:
        return declinedCards;
      default:
        return [];
    }
  };

  const currentCards = getCurrentCards();
  const totalCount = currentCards.length;

  const reset = () => {
    setSelectedIds([]);
    setShowConfirmation(false);
    setOnDelete(false);
    setSelectedCount(0);
    setIsChecked(false);
  };

  const cancelDelete = () => reset();
  const onOkey = () => {
    setSuccess(false);
    reset();
  };

  const handleButtons = () => {
    if (totalCount === 0) return;
    if (onDelete) {
      setShowConfirmation(true);
    } else {
      setOnDelete(true);
    }
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

      // Refresh data after deletion
      const response = await axios.get("/pfe/my-pfes", {
        withCredentials: true,
        headers: {
          "ngrok-skip-browser-warning": "true",
        },
      });
      setCards(response.data?.data || []);

      reset();
      setSuccess(true);
    } catch (error) {
      console.error("Failed to delete topic(s):", error);
      alert("Failed to delete one or more topics.");
      reset();
    }
  };

  const handleToggle = () => {
    if (isChecked) {
      setSelectedCount(0);
      setSelectedIds([]);
    } else {
      setSelectedCount(totalCount);
      setSelectedIds(currentCards.map((card) => card.id));
    }
    setIsChecked(!isChecked);
  };

  return (
    <div className="containert">
      {/* Tabs */}
      <div className="tabs-container">
        <div className="tabs">
          <button
            className={`tab-item ${activeTab === SUBMITTED ? "active" : ""}`}
            onClick={() => setActiveTab(SUBMITTED)}
          >
            {SUBMITTED}
          </button>
          <button
            className={`tab-item ${activeTab === VALIDATED ? "active" : ""}`}
            onClick={() => setActiveTab(VALIDATED)}
          >
            {VALIDATED}
          </button>
          <button
            className={`tab-item ${activeTab === DECLINED ? "active" : ""}`}
            onClick={() => setActiveTab(DECLINED)}
          >
            {DECLINED}
          </button>
        </div>
      </div>

      <div className="pageheader">
        <p className="pagetitle">MyTopics</p>
        {onDelete && (
          <div className="delete-popup">
            <div className="selection-container" onClick={handleToggle}>
              <input
                type="checkbox"
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
          <p className="managebtns-text">Delete Topics</p>
        </button>
        <button
          className={` ${onDelete ? "btna-on-cancel" : "btna"}`}
          onClick={
            onDelete ? cancelDelete : () => navigate("/teacher/Addatopic")
          }
        >
          <p className={` ${onDelete ? "txt-on-cancel" : "managebtns-text"}`}>
            {onDelete ? "Cancel" : "Add a Topic"}
          </p>
        </button>
      </div>

      {showConfirmation && (
        <Popup onCancel={cancelDelete} onConfirm={confirmDelete} poproud={1} />
      )}

      {success && <Popup poproud={2} onOkey={onOkey} />}

      <div className="content-area-mytopics">
        {error && <div className="error-message">{error}</div>}

        {loading ? (
          <div className="loading-indicator">Loading...</div>
        ) : (
          <PFEList
            filteredCards={currentCards}
            onDelete={onDelete}
            selectedIds={selectedIds}
            setSelectedIds={setSelectedIds}
            setSelectedCount={setSelectedCount}
          />
        )}
      </div>
    </div>
  );
};

// Popup Component
const Popup = ({ onCancel, onConfirm, poproud, onOkey }) => {
  const popupRef = useRef(null);

  useEffect(() => {
    if (poproud !== 1) return;

    const handleClickOutside = (event) => {
      if (popupRef.current && !popupRef.current.contains(event.target)) {
        onCancel();
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [onCancel, poproud]);

  return (
    <div className="overlay">
      {poproud === 1 && (
        <div className="popup-cont" ref={popupRef}>
          <div className="conf-warn-cont">
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

// PFEList Component
const PFEList = ({
  filteredCards,
  onDelete,
  selectedIds,
  setSelectedIds,
  setSelectedCount,
}) => {
  const handleCardClick = (id) => {
    if (onDelete) {
      setSelectedIds((prevSelected) => {
        const isSelected = prevSelected.includes(id);
        const newSelected = isSelected
          ? prevSelected.filter((selectedId) => selectedId !== id)
          : [...prevSelected, id];

        setSelectedCount(newSelected.length);
        return newSelected;
      });
    }
  };

  return (
    <div className="cards-container" style={{ marginTop: "40px" }}>
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
