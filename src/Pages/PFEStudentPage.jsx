//the nagrok image problem

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
  // Set the default active tab to "PFE Topics"
  const [activeTab, setActiveTab] = useState("PFE Topics");

  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem("user"));
  const endpoint = user?.role === "student" ? "/pfe/for-students" : "/pfe";
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(endpoint, {
          withCredentials: true,
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

  // Build a suggestion list from card attributes
  const suggestionList = Array.from(
    new Set(
      cards.flatMap((card) => [
        card.title,
        card.specialization,
        card.creator?.username,
        card.year ? String(card.year) : "",
      ])
    )
  );

  const handleFilterApply = useCallback((newFilters) => {
    setSelectedFilters(newFilters);
  }, []);

  const handleSearchChange = useCallback((query) => {
    console.log("Search query:", query);
    setSearchQuery(query);
  }, []);

  // Filter cards based on search query and selected filters
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

  useEffect(() => {
    console.log("Filtered cards:", filteredCards);
  }, [filteredCards]);

  // Render the content for the active tab
  const renderTabContent = () => {
    if (activeTab === "PFE Topics") {
      return (
        <div
          className={Style["cards-container"]}
          style={{ overflowY: "auto", marginTop: "1rem" }}
        >
          {loading ? (
            <p className={Style["loading-text"]}>Loading projects...</p>
          ) : error ? (
            <p className={Style["error-text"]}>{error}</p>
          ) : filteredCards.length > 0 ? (
            filteredCards.map((card, index) => (
              <PFECard
                key={card.id || index}
                card={card}
                isSelected={null}
                toggleSelect={() => {}}
              />
            ))
          ) : (
            <p className={Style["no-results-text"]}>No projects found.</p>
          )}
        </div>
      );
    } else if (activeTab === "My Preferences List") {
      return (
        <div
          className={Style["preferences-container"]}
          style={{ marginTop: "1rem", padding: "1rem" }}
        >
          {/*  
              Replace the content below with the actual component or content for your Preferences List.
              You might want to fetch the user's preferred PFEs or any other relevant data here.
          */}
          <h2>My Preferences List</h2>
          <p>
            This is where your preferred PFE projects or other user-specific
            content will be displayed.
          </p>
        </div>
      );
    }
  };

  return (
    <div>
      <Sidebar />
      <div
        style={{
          marginLeft: "16vw",
          height: "100vh",
          display: "flex",
          flexDirection: "column",
        }}
      >
        <Navbar
          title={"Normal Session"}
          selectedFilters={selectedFilters}
          onFilterApply={handleFilterApply}
          onSearchChange={handleSearchChange}
          suggestions={suggestionList}
        />

        <div style={{ flexGrow: 1, overflowY: "auto" }}>
          {loading ? (
            <p className={Style["loading-text"]}>Loading projects...</p>
          ) : error ? (
            <p className={Style["error-text"]}>{error}</p>
          ) : (
            <div className={Style["cards-container"]}>
              {filteredCards.length > 0 ? (
                filteredCards.map((card, index) => (
                  <PFECard
                    key={card.id || index}
                    card={card}
                    isSelected={null}
                    toggleSelect={() => {}}
                  />
                ))
              ) : (
                <p className={Style["no-results-text"]}>No projects found.</p>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default PFEPage;
