import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "../styles/teacher.css";
import PFECard from "../components/CardComponent";

const TeacherPfePage = () => {
  const [cards, setCards] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeTab, setActiveTab] = useState("Submitted");
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get("/pfe", {
          withCredentials: true,
        });

        if (response.data?.pfeList) {
          setCards(response.data.pfeList);
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
      case "Submitted":
        return submittedCards;
      case "Validated":
        return validatedCards;
      case "Declined":
        return declinedCards;
      default:
        return [];
    }
  };

  return (
    <div className="teacher-page-container">
      <h1>Explore PFE Topics</h1>
      <div className="tabs-container">
        <div className="tabs">
          <button
            className={`tab-item ${activeTab === "Submitted" ? "active" : ""}`}
            onClick={() => setActiveTab("Submitted")}
          >
            Submitted
          </button>
          <button
            className={`tab-item ${activeTab === "Validated" ? "active" : ""}`}
            onClick={() => setActiveTab("Validated")}
          >
            Validated
          </button>
          <button
            className={`tab-item ${activeTab === "Declined" ? "active" : ""}`}
            onClick={() => setActiveTab("Declined")}
          >
            Declined
          </button>
        </div>
      </div>

      <div className="content-area">
        {error && <div className="error-message">{error}</div>}

        {loading ? (
          <div className="loading-indicator">Loading...</div>
        ) : (
          <PFEList filteredCards={getCurrentCards()} activeTab={activeTab} />
        )}
      </div>
    </div>
  );
};

const PFEList = ({ filteredCards, activeTab }) => {
  const getEmptyMessage = () => {
    switch (activeTab) {
      case "Submitted":
        return "No submitted topics found.";
      case "Validated":
        return "No validated topics found.";
      case "Declined":
        return "No declined topics found.";
      default:
        return "No topics found.";
    }
  };

  return (
    <div className="cards-container">
      {filteredCards.length > 0 ? (
        filteredCards.map((card) => <PFECard key={card.id} card={card} />)
      ) : (
        <p className="no-results-message">{getEmptyMessage()}</p>
      )}
    </div>
  );
};

export default TeacherPfePage;
