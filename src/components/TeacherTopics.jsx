import { useState, useRef, useEffect } from "react";
import "../styles/teacher.css";
import PFECard from "../components/CardComponent";
import PFE1 from "../assets/pfe1.svg";
import PFE2 from "../assets/pfe2.svg";
import PFE3 from "../assets/pfe3.svg";
import Alert from "../assets/alert-circle.svg";
import SuccessIcon from "../assets/success-icon.svg";
const TeacherTopics = () => {
  const [pfeTopics, setPfeTopics] = useState([
    {
      id: 1,
      title: "Final Year Project Management System",
      categories: ["ISI", "SIW"],
      description:
        "A smart platform for managing final year projects efficizn uebvzuei.",
      author: "Guessoum Mohamed Nizar",
      image: PFE1,
    },
    {
      id: 2,
      title: "Smart Task Management System",
      categories: ["ISI", "IASD"],
      description: "Enhances team collaboration with efficient task tracking.",
      author: "Guessoum Mohamed Nizar",
      image: PFE2,
    },
    {
      id: 3,
      title: "AI-Powered Chatbot",
      categories: ["SIW"],
      description: "An AI chatbot for improved customer support automation.",
      author: "Guessoum Mohamed Nizar",
      image: PFE3,
    },
    {
      id: 3,
      title: "AI-Powered Chatbot",
      categories: ["SIW"],
      description: "An AI chatbot for improved customer support automation.",
      author: "Guessoum Mohamed Nizar",
      image: PFE3,
    },
    {
      id: 3,
      title: "AI-Powered Chatbot",
      categories: ["SIW"],
      description: "An AI chatbot for improved customer support automation.",
      author: "Guessoum Mohamed Nizar",
      image: PFE3,
    },
    {
      id: 3,
      title: "AI-Powered Chatbot",
      categories: ["SIW"],
      description: "An AI chatbot for improved customer support automation.",
      author: "Guessoum Mohamed Nizar",
      image: PFE3,
    },
    {
      id: 3,
      title: "AI-Powered Chatbot",
      categories: ["SIW"],
      description: "An AI chatbot for improved customer support automation.",
      author: "Guessoum Mohamed Nizar",
      image: PFE3,
    },
    {
      id: 3,
      title: "AI-Powered Chatbot",
      categories: ["SIW"],
      description: "An AI chatbot for improved customer support automation.",
      author: "Guessoum Mohamed Nizar",
      image: PFE3,
    },
    {
      id: 3,
      title: "AI-Powered Chatbot",
      categories: ["SIW"],
      description: "An AI chatbot for improved customer support automation.",
      author: "Guessoum Mohamed Nizar",
      image: PFE3,
    },
  ]);
  const [Success, setSuccess] = useState(false);
  const [onDelete, setOnDelete] = useState(false);
  const [isChecked, setIsChecked] = useState(false);
  const [selectedCount, setSelectedCount] = useState(0);
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [selectedIds, setSelectedIds] = useState([]);

  const totalCount = pfeTopics.length; // Get total number of PFE topics

  const handleButtons = () => {
    if (pfeTopics.length === 0) return; // Do nothing if there are no topics

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

  const confirmDelete = () => {
    setPfeTopics((prevTopics) =>
      prevTopics.filter((topic) => !selectedIds.includes(topic.id))
    );
    reset();
    setSuccess(true);
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
      setSelectedIds(pfeTopics.map((topic) => topic.id));
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
        <button className="btnd">
          {" "}
          <p className="managebtns-text" onClick={handleButtons}>
            Delete Topics
          </p>
        </button>
        <button className={` ${onDelete ? "btna-on-cancel" : "btna"}`}>
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
        pfeTopics={pfeTopics}
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
  pfeTopics,
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
          ? prevSelected.filter((selectedId) => selectedId !== id) // Remove if already selected
          : [...prevSelected, id]; // Add if not selected

        // Update the count based on selection change
        setSelectedCount(newSelected.length);

        return newSelected;
      });
    }
  };

  return (
    <div className="pfe-list">
      {pfeTopics.map((topic) => (
        <div
          key={topic.id}
          className={`card-wrapper ${
            selectedIds.includes(topic.id) ? "selected" : ""
          }`}
          onClick={() => handleCardClick(topic.id)}
        >
          <PFECard {...topic} />
        </div>
      ))}
    </div>
  );
};
export default TeacherTopics;
