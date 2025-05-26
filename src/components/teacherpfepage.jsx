import React, { useState, useEffect, useMemo } from "react";
import { useNavigate, useOutletContext } from "react-router-dom";
import axios from "axios";
import "../styles/teacher.css";
import PFECard from "../components/CardComponent";
import { setMyGlobalString } from "../global.js";
import Teacherpfetopicseemore from "./teacherpfetopicseemore.jsx";
const TeacherPfePage = () => {
  const [seemore, setSeeMore] = useState(false);
  const [cards, setCards] = useState([]);
  const [selectedTopic, setSelectedTopic] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();
  const { selectedFilters } = useOutletContext();
  const filteredCards = useMemo(() => {
    if (!selectedFilters || selectedFilters.length === 0) return cards;

    return cards.filter((card) =>
      selectedFilters.includes(card.specialization)
    );
  }, [cards, selectedFilters]);
  useEffect(() => {
    console.log("Selected Filters:", selectedFilters);
    const fetchData = async () => {
      try {
        const response = await axios.get("/pfe/validallpfe", {
          withCredentials: true,
          params: {
            specializations: selectedFilters?.join(",") || "",
          },
        });

        if (response.data?.pfeList) {
          setCards(response.data.pfeList);
          const currentSessions = response.data.currentSessions;
          console.log("hahiya session", currentSessions);
          setMyGlobalString(currentSessions);
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
  }, [navigate, selectedFilters]); // Added selectedFilters to dependency array

  return (
    <div className="teacher-page-container">
      <div className="pageheader">
        {" "}
        <p
          className="pagetitle"
          style={{
            paddingLeft: "10px",
            paddingTop: "10px",
          }}
        >
          Explore PFE Topics
        </p>
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

      <div className="content-area">
        {error && <div className="error-message">{error}</div>}

        {loading ? (
          <div className="loading-indicator">Loading</div>
        ) : seemore ? (
          <Teacherpfetopicseemore topic={selectedTopic} />
        ) : (
          <PFEList
            setSeeMore={setSeeMore}
            filteredCards={cards}
            setSelectedTopic={setSelectedTopic}
          />
        )}
      </div>
    </div>
  );
};

const PFEList = ({ filteredCards, setSeeMore, setSelectedTopic }) => {
  return (
    <div className="cards-container">
      {filteredCards.length > 0 ? (
        filteredCards.map((card) => (
          <PFECard
            key={card.id}
            card={card}
            isSelected={null}
            toggleSelect={() => {}}
            onExplore={() => {
              setSelectedTopic(card);
              setSeeMore(true);
            }}
          />
        ))
      ) : (
        <p className="no-results-message">
          No topics found matching the selected filters.
        </p>
      )}
    </div>
  );
};

export default TeacherPfePage;
