import React, { useState, useEffect } from "react";
import axios from "axios";
import Navbar from "../components/NavBar";
import Sidebar from "../components/Sidebar";
import PFECard from "../components/CardComponent";
import Style from "../styles/PFEPage.module.css";

const PFEPage = () => {
  // State for cards fetched from the backend.
  const [cards, setCards] = useState([]);
  // State for multiple selected filters.
  const [selectedFilters, setSelectedFilters] = useState([]);
  // State for search query.
  const [searchQuery, setSearchQuery] = useState("");

  axios.get("https://916a-41-201-106-90.ngrok-free.app/api/v1/pfe/for-students", {
    withCredentials: true,
  })
  .then((response) => {
    if (response.data && response.data.pfeList) {
      setCards(response.data.pfeList);
    }
    console.log("Fetched card data:", response.data);
  })
  .catch((error) => {
    console.error("Error fetching card data", error);
  });
  

  
  // Build the suggestion list based on dynamic data:
  // We use title, specialization, creator's username, and year.
  const suggestionList = Array.from(
    new Set(
      cards.flatMap((card) => [
        card.title,
        card.specialization,
        card.creator?.username,
        card.year,
      ])
    )
  );

  // Callback to apply filters from the FilterMenu.
  const handleFilterApply = (newFilters) => {
    setSelectedFilters(newFilters);
  };

  // Callback to update the search query from Navbar/Searchbar.
  const handleSearchChange = (query) => {
    setSearchQuery(query);
  };

  // Filter cards: display a card if it matches selected filters and search query.
  const filteredCards = cards.filter((card) => {
    // For filtering, we check if the card's specialization matches one of the selected filters.
    const filterMatch =
      selectedFilters.length > 0
        ? selectedFilters.includes(card.specialization)
        : true;
    // Check search query (case-insensitive) across title, specialization, creator username, and year.
    const lowerQuery = searchQuery.toLowerCase();
    const titleMatch = card.title.toLowerCase().includes(lowerQuery);
    const specializationMatch =
      card.specialization &&
      card.specialization.toLowerCase().includes(lowerQuery);
    const authorMatch =
      card.creator?.username &&
      card.creator.username.toLowerCase().includes(lowerQuery);
    const yearMatch = card.year && card.year.toLowerCase().includes(lowerQuery);
    const searchMatch =
      titleMatch || specializationMatch || authorMatch || yearMatch;

    return filterMatch && searchMatch;
  });

  return (
    <div>
      <Sidebar />
      <div style={{ marginLeft: "16vw" }}>
        <Navbar
          title={"Dynamic Session"}
          selectedFilters={selectedFilters}
          onFilterApply={handleFilterApply}
          onSearchChange={handleSearchChange}
          suggestions={suggestionList}
        />
        <div className={Style["cards-container"]}>
          {filteredCards.map((card, index) => (
            <PFECard
              key={card.id || index}
              title={card.title}
              // Use specialization as category; if needed, wrap it in an array.
              categories={[card.specialization]}
              description={card.description}
              author={card.creator?.username}
              // If photo is null, you can provide a fallback image URL.
              image={card.photo || "https://via.placeholder.com/300x200"}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default PFEPage;
