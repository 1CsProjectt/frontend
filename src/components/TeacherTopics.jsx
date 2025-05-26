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
import { setMyGlobalString } from "../global.js";
import Teacherpfetopicseemore from "./teacherpfetopicseemore.jsx";
import Toast from "../components/modals/Toast";

const SUBMITTED = "Submitted";
const VALIDATED = "Validated";
const DECLINED = "Declined";

const TeacherTopics = () => {
  const user = JSON.parse(localStorage.getItem("user"));

  const { selectedFilters } = useOutletContext();
  console.log("hahahaha", user.id);
  const [selectedTopic, setSelectedTopic] = useState(null);
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
  const [seemore, setSeeMore] = useState(false);
  const [reason, setReason] = useState(null);
  const [reasonFile, setReasonFile] = useState(null);
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState("");
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
        setMyGlobalString(currentSessions);
        console.log("hahiyaaaaaaaaaaaaa", currentSessions);

        if (response.data?.data) {
          setCards(response.data.data);

          // Check for declined topic
        }
      } catch (err) {
        console.error("Error fetching card data", err);
        if (err.response?.status === 401) {
          setToastMessage("Session expired. Please log in again.");
          setShowToast(true);

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
        <p className="pagetitle"> {seemore ? "Reading" : "MyTopics"}</p>
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
        {activeTab === SUBMITTED && !seemore && (
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
        {seemore && (
          <button
            className="btna-on-cancel"
            onClick={() => {
              setSeeMore(false);
              console.log("Back clicked — should show PFEList", seemore);
            }}
          >
            <p className="txt-on-cancel">Back</p>
          </button>
        )}
      </div>

      {!seemore && (
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
      )}

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
        {loading ? (
          <div className="loading-indicator">Loading</div>
        ) : seemore ? (
          <Teacherpfetopicseemore
            reason={selectedTopic?.reason}
            reasonFile={selectedTopic?.reasonFile}
            topic={selectedTopic}
            ondeclined={selectedTopic?.status === "REJECTED"}
          />
        ) : (
          <PFEList
            setSeeMore={setSeeMore}
            filteredCards={currentCards}
            onDelete={onDelete}
            selectedIds={selectedIds}
            setSelectedIds={setSelectedIds}
            setSelectedCount={setSelectedCount}
            setSelectedTopic={setSelectedTopic}
            userid={user.id}
            setToastMessage={setToastMessage}
            setShowToast={setShowToast}
            activeTab={activeTab}
          />
        )}
        {showToast && (
          <Toast
            message={toastMessage}
            onClose={() => {
              setShowToast(false);
            }}
          />
        )}
      </div>
    </div>
  );
};

const PFEList = ({
  setSeeMore,
  filteredCards,
  onDelete,
  selectedIds,
  setSelectedIds,
  setSelectedCount,
  setSelectedTopic,
  userid,
  setToastMessage,
  setShowToast,
  activeTab,
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
            toggleSelect={() => {
              if (userid === card.creator.id) {
                handleCardClick(card.id);
              } else {
                setToastMessage(
                  "You can't delete a topic that you didn't create"
                );
                setShowToast(true);
              }
            }}
            onExplore={() => {
              setSelectedTopic(card);
              setSeeMore(true);
            }}
          />
        ))
      ) : (
        <p
          style={{
            position: "fixed",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            fontSize: "1.5rem",
            color: "#777",
            textAlign: "center",
            zIndex: 1000,
          }}
        >
          {activeTab === SUBMITTED && "No submitted topics"}
          {activeTab === VALIDATED && "No validated topics"}
          {activeTab === DECLINED && "No declined topics"}
        </p>
      )}
    </div>
  );
};

export default TeacherTopics;
