import React, { useState, useEffect, useCallback } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import Navbar from "../components/NavBar";
import Sidebar from "../components/Sidebar";
import PFECard from "../components/CardComponent";
import Style from "../styles/PFEPage.module.css";

const PFEPage = () => {
  const [cards, setCards] = useState([]);
  const [selectedFilters, setSelectedFilters] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get("/pfe/for-students", {
          withCredentials: true,
          headers: {
            "ngrok-skip-browser-warning": "true",
          },
        });

        if (response.data && response.data.pfeList) {
          setCards(response.data.pfeList);
        }
        console.log("Fetched card data:", response.data);
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

  // Gather unique suggestions from various card fields
  const suggestionList = Array.from(
    new Set(
      cards.flatMap((card) => [
        card.title,
        card.specialization,
        card.creator?.username,
        card.year ? String(card.year) : "", // ensure numeric year is converted to string
      ])
    )
  );

  // Callback for filtering by speciality
  const handleFilterApply = useCallback((newFilters) => {
    setSelectedFilters(newFilters);
  }, []);

  // Callback for updating search query with logging for debugging
  const handleSearchChange = useCallback((query) => {
    console.log("Search query:", query);
    setSearchQuery(query);
  }, []);

  // Filtering cards based on selected filters and search query
  const filteredCards = cards.filter((card) => {
    const lowerQuery = searchQuery.toLowerCase();
    const matchesSearch =
      card.title.toLowerCase().includes(lowerQuery) ||
      (card.specialization &&
        card.specialization.toLowerCase().includes(lowerQuery)) ||
      (card.creator?.username &&
        card.creator.username.toLowerCase().includes(lowerQuery)) ||
      (card.year && String(card.year).toLowerCase().includes(lowerQuery));

    const matchesFilter =
      selectedFilters.length === 0 ||
      selectedFilters.includes(card.specialization);

    return matchesFilter && matchesSearch;
  });

  // Debugging: log filtered results whenever they change
  useEffect(() => {
    console.log("Filtered cards:", filteredCards);
  }, [filteredCards]);

  return (
    <div>
      <Sidebar />
      <div style={{ marginLeft: "16vw" }}>
        <Navbar
          title={"Normal Session"}
          selectedFilters={selectedFilters}
          onFilterApply={handleFilterApply}
          onSearchChange={handleSearchChange}
          suggestions={suggestionList}
        />
        {loading ? (
          <p className={Style["loading-text"]}>Loading projects...</p>
        ) : error ? (
          <p className={Style["error-text"]}>{error}</p>
        ) : (
          <div
            className={Style["cards-container"]}
            style={{ overflowY: "auto" }} // Adds scrolling styles
          >
            {filteredCards.length > 0 ? (
              filteredCards.map((card, index) => (
                <PFECard key={card.id || index} card={card} />
              ))
            ) : (
              <p className={Style["no-results-text"]}>No projects found.</p>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default PFEPage;
