import { React, useEffect } from "react";
import Navbar from "../components/NavBar";
import PFECard from "../components/CardComponent";
import { useState } from "react";
import classes from "../styles/TopicsValidationPage.module.css";
import PfeTopicModal from "../components/modals/PfeTopicModal.jsx";
import axios from "axios";
import alertIcon from "../assets/alert-icon.svg";
import errorIcon from "../assets/error-icon.svg";
import { useNavigate } from "react-router-dom";
import { useSharedState } from '../contexts/SharedStateContext'; // Import the custom hook
import { PulseLoader } from "react-spinners"; // Import the spinner you want to use

const TopicsValidationPage = () => {
  /* const {topicsPageActiveTab, setTopicsPageActiveTab} = useSharedState(); // Default active tab */
  const [topicsPageActiveTab, setTopicsPageActiveTab] = useState(() => {
    return localStorage.getItem("topicsPageActiveTab") || "tab1";
  });
  const [isChecked, setIsChecked] = useState(false); // for the select all checkbox
  const [selectedCards, setSelectedCards] = useState([]); // Moved state here
  const [isPfeTopicModalOpen, setPfeTopicModalOpen] = useState(false);
  const [submittedCardsArray, setSubmittedCardsArray] = useState([]); // State to hold the submitted cards
  const [publishedCardsArray, setPublishedCardsArray] = useState([]); // State to hold the published cards
  const [cardsArray, setCardsArray] = useState([]); // State to hold the cards array
  const [loading, setLoading] = useState(false);
  const [noTopicsFound, setNoTopicsFound] = useState(false); // State to handle no topics found
  const [connectionError, setConnectionError] = useState(false); // State to handle connection error
  //isDeleteUserModalOpen is a state variable that controls the visibility of the delete user modal
  //the selectedCards array holds the ids of the currently selected cards
  const [deleteBtnActive, setDeleteBtnActive] = useState(false);
  const [selectionMode, setSelectionMode] = useState(false);
  const pathMap = {
    tab1: "/admin/sessions/topic-validation/published-topic-explore",
    tab2: "/admin/sessions/topic-validation/submitted-topic-explore",
    tab3: "/admin/sessions/topic-validation/declined-topic-explore",
  };
  const navigate = useNavigate();
  useEffect(() => {
    localStorage.setItem("topicsPageActiveTab", topicsPageActiveTab);
  }, [topicsPageActiveTab]);
  const HandleBackButton = () => {
    /*  if the user has some cards selected it will undo the selection 
        else if nothing is selected it will go back to the previous page */
    navigate(-1);
  };

  const toggleSelect = (id) => {
    setSelectedCards((prev) => {
      const newSelected = prev.includes(id)
        ? prev.filter((cardId) => cardId !== id)
        : [...prev, id];

      // If all cards are selected, check the "Select All" box; otherwise, uncheck it
      setIsChecked(newSelected.length === cardsArray.length);
      return newSelected;
    });
  };

  const handleCheckboxChange = (event) => {
    const checked = event.target.checked;
    setIsChecked(checked);
    setSelectedCards(checked ? cardsArray.map((card) => card.id) : []);
  };

  useEffect(() => {
    if (topicsPageActiveTab === "tab1") {
      setSelectedCards([]); // Reset selected cards when switching tabs
      setIsChecked(false); // Reset the "Select All" checkbox when switching tabs
      const fetchPublishedCards = async () => {
        if (loading) return; // Prevent multiple fetches when already loading
        setLoading(true); // Start loading
        try {
          const response = await axios.get("/pfe/validpfe");
          if (response.data && response.data.pfeList) {
            setCardsArray(response.data.pfeList);
            console.log(response.data.pfeList);
          }
          /* setPublishedCardsArray(data); // Save data in state */
        } catch (error) {
          console.error("Error fetching the published cards data:", error);

          setConnectionError(true); // Set connection error state
        } finally {
          setLoading(false); // Stop loading
        }
      };

      fetchPublishedCards();
      console.log("cardsArray:", cardsArray, Array.isArray(cardsArray));

      /*  setCardsArray(publishedCardsArray); */
    } else if (topicsPageActiveTab === "tab2") {
      setSelectedCards([]); // Reset selected cards when switching tabs
      setIsChecked(false); // Reset the "Select All" checkbox when switching tabs
      const fetchSubmittedCards = async () => {
        if (loading) return; // Prevent multiple fetches when already loading
        setLoading(true); // Start loading
        try {
          const response = await axios.get("/pfe/pending");
          if (response.data && response.data.pfeList) {
            setCardsArray(response.data.pfeList);
            console.log(response);
          }
          console.log(response.data.pfeList);
          /*  setSubmittedCardsArray(data); // Save data in state */
        } catch (error) {
          console.error("Error fetching the submitted cards data:", error);
          setConnectionError(true);
        } finally {
          setLoading(false); // Stop loading
        }
      };

      fetchSubmittedCards();
      console.log("cardsArray:", cardsArray, Array.isArray(cardsArray));

      /*  setCardsArray(submittedCardsArray); */
    }
    else if (topicsPageActiveTab === "tab3") {
      setSelectedCards([]); // Reset selected cards when switching tabs
      setIsChecked(false); // Reset the "Select All" checkbox when switching tabs
      const fetchDeclinedCards = async () => {
        if (loading) return; // Prevent multiple fetches when already loading
        setLoading(true); // Start loading
        try {
          const response = await axios.get("/pfe/rejectedpfe");
          if (response.data && response.data.pfeList) {
            setCardsArray(response.data.pfeList);
            console.log("DECLINED CARDS :" ,response.data.pfeList);
          }
          /*  setSubmittedCardsArray(data); // Save data in state */
        } catch (error) {
          console.error("Error fetching the declined cards data:", error);
          setConnectionError(true);
        } finally {
          setLoading(false); // Stop loading
        }
      };

      fetchDeclinedCards();
      console.log("cardsArray:", cardsArray, Array.isArray(cardsArray));

      /*  setCardsArray(submittedCardsArray); */
    }
  }, [topicsPageActiveTab]);

  return (
    <div>
      <Navbar />

      <div className={classes.header}>
        <div className={classes["left-side-container"]}>
          <h1>Validate and Control Topics</h1>
          {selectionMode && (
            <label>
              <input
                type="checkbox"
                checked={isChecked}
                onChange={handleCheckboxChange}
              />
              All
            </label>
          )}
          {selectedCards.length !== 0 && <p>{selectedCards.length} Selected</p>}
        </div>
        <div className={classes["buttons-container"]}>
          <button
            className={classes["back-btn"]}
            onClick={() => navigate("/admin/sessions")}
          >
            Back
          </button>
          <button
            className={classes["delete-btn"]}
            onClick={() => {
              if (!selectionMode) {
                setSelectionMode(true);
              } else if (selectedCards.length > 0) {
                setPfeTopicModalOpen(true);
              }
            }}
          >
            Delete Topics
          </button>
          <PfeTopicModal
            isOpen={isPfeTopicModalOpen}
            onClose={() => setPfeTopicModalOpen(false)}
            entityType="User"
            operation="delete"
            selectedcardsid={selectedCards}
            setCardsArray={setCardsArray}
          />
        </div>
      </div>

              <div className={classes.tabs}>
          <button
            className={`${classes.tabButton} ${
              topicsPageActiveTab === "tab1" ? classes.active : ""
            }`}
            onClick={() => setTopicsPageActiveTab("tab1")}
            disabled={loading}
          >
            Published Topics
          </button>
          <button
            className={`${classes.tabButton} ${
              topicsPageActiveTab === "tab2" ? classes.active : ""
            }`}
            onClick={() => setTopicsPageActiveTab("tab2")}
            disabled={loading}
          >
            Submitted Topics
          </button>
          <button
            className={`${classes.tabButton} ${
              topicsPageActiveTab === "tab3" ? classes.active : ""
            }`}
            onClick={() => setTopicsPageActiveTab("tab3")}
            disabled={loading}
          >
            Declined Topics
          </button>
        </div>


      <div key={topicsPageActiveTab} className={classes["tab-content"]}>
        {loading ? (
          <div className={classes.loaderContainer}>
            <div className={classes.loader}>
              <PulseLoader color="#077fd4" loading={loading} size={25} />
            </div>
          </div>
        ) : connectionError ? (
          <div className={classes.alertDiv}>
            <img src={errorIcon} alt="Error Icon" />
            <h3>Error connecting to the server</h3>
          </div>
        ) : cardsArray.length === 0 ? (
          <div className={classes.alertDiv}>
            <img src={alertIcon} alt="Alert Icon" />
            <h3>
              No topics were found . check again later to see if new Topics are
              added
            </h3>
          </div>
        ) : (
          <div className={classes["cards-container"]}>
            {cardsArray.map((card) => (
              <PFECard
                key={card.id}
                card={card}
                isSelected={selectionMode && selectedCards.includes(card.id)}
                toggleSelect={selectionMode ? toggleSelect : () => {}}
                onExplore={(e) => {
                  e.stopPropagation();
                  navigate(pathMap[topicsPageActiveTab], { state: { card } });

                }}
                
                
                year={card.year}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default TopicsValidationPage;
