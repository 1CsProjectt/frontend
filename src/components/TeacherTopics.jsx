import React, {
  useState,
  useEffect,
  useCallback,
  useRef,
  useMemo,
} from "react";
import { useOutletContext, useNavigate } from "react-router-dom";
import "../styles/teacher.css";
import PFECard from "../components/CardComponent";
import Popup from "../components/modals/popup";
import axios from "axios";

const SUBMITTED = "Submitted";
const VALIDATED = "Validated";
const DECLINED = "Declined";

const TeacherTopics = () => {
  const { selectedFilters } = useOutletContext();
  console.log("hahahaha", selectedFilters);
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
  const [status, setStatus] = useState("");

  const [confTitle, setConfTitle] = useState(""); // for confirmation popup title
  const [confMsg, setConfMsg] = useState(""); // for confirmation popup message
  const [confButtonText, setConfButtonText] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get("/pfe/my-pfes", {
          withCredentials: true,
        });
        const currentSessions = response.data.currentSessions;
        // Use currentSessions as needed
        console.log("hahiyaaaaaaaaaaaaa", currentSessions);
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

  // Memoized filtered cards with combined filters
  const currentCards = useMemo(() => {
    let filtered = [];
    switch (activeTab) {
      case SUBMITTED:
        filtered = cards.filter(
          (card) => card.status === "NOT_VALIDE" || !card.status
        );
        break;
      case VALIDATED:
        filtered = cards.filter((card) => card.status === "VALIDE");
        break;
      case DECLINED: // Added Declined case
        filtered = cards.filter((card) => card.status === "REJECTED");
        break;
      default:
        filtered = [];
    }

    if (selectedFilters && selectedFilters.length > 0) {
      filtered = filtered.filter((card) =>
        selectedFilters.includes(card.specialization)
      );
    }

    return filtered;
  }, [activeTab, cards, selectedFilters]);
  const totalCount = currentCards.length;

  useEffect(() => {
    // Reset selections when filters change
    setSelectedIds([]);
    setSelectedCount(0);
    setIsChecked(false);
  }, [currentCards]);

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

      // Refresh data
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
      console.error("Delete failed:", error);
      alert("Failed to delete topics");
      reset();
    }
  };

  const handleToggle = () => {
    if (isChecked) {
      setSelectedCount(0);
      setSelectedIds([]);
    } else {
      const ids = currentCards.map((card) => card.id).filter(Boolean);
      setSelectedCount(ids.length);
      setSelectedIds(ids);
    }
    setIsChecked(!isChecked);
  };

  return (
    <div className="containert">
      {/* Tabs */}
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
        {activeTab === SUBMITTED && (
          <div className="pageheaderbuttons">
            <button className="btnd" onClick={handleButtons}>
              <p className="managebtns-text">Delete Topics</p>
            </button>
            <button
              className={` ${onDelete ? "btna-on-cancel" : "btna"}`}
              onClick={
                onDelete ? cancelDelete : () => navigate("/teacher/Addatopic")
              }
            >
              <p
                className={` ${onDelete ? "txt-on-cancel" : "managebtns-text"}`}
              >
                {onDelete ? "Cancel" : "Add a Topic"}
              </p>
            </button>
          </div>
        )}
      </div>
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

      {showConfirmation && (
        <Popup
          onCancel={cancelDelete}
          onConfirm={confirmDelete}
          onOkey={onOkey}
          poproud={1}
          confirmTitle={"Delete PFE Topics"}
          confirmMessage={
            "Are you sure you want to delete this? This action cannot be undone."
          }
        />
      )}

      {success && <Popup poproud={2} onOkey={onOkey} />}

      <div className="content-area-mytopics">
        {error && <div className="error-message">{error}</div>}

        {loading ? (
          <div className="loading-indicator">Loading</div>
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

const PFEList = ({
  filteredCards,
  onDelete,
  selectedIds,
  setSelectedIds,
  setSelectedCount,
}) => {
  useEffect(() => {
    setSelectedIds([]);
    setSelectedCount(0);
  }, [filteredCards, setSelectedIds, setSelectedCount]);

  const handleCardClick = (id) => {
    if (onDelete) {
      setSelectedIds((prev) => {
        const newSelected = prev.includes(id)
          ? prev.filter((i) => i !== id)
          : [...prev, id];
        setSelectedCount(newSelected.length);
        return newSelected;
      });
    }
  };

  return (
    <div className="cards-container">
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
