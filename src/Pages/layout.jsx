import React, { useState, useEffect, useCallback } from "react";
import Navbar from "../components/NavBar";
import "../styles/layout.css";
import Addatopic from "../components/addatopic";
import Sidebar from "../components/Sidebar";
import TeacherTopics from "../components/TeacherTopics";

const Layout = () => {
  const [cards, setCards] = useState([]);
  const [selectedFilters, setSelectedFilters] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");

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

  const handleFilterApply = useCallback((newFilters) => {
    setSelectedFilters(newFilters);
  }, []);

  const handleSearchChange = useCallback((query) => {
    setSearchQuery(query);
  }, []);

  const filteredCards = cards.filter((card) => {
    const lowerQuery = searchQuery.toLowerCase();
    return (
      (selectedFilters.length === 0 ||
        selectedFilters.includes(card.specialization)) &&
      (card.title.toLowerCase().includes(lowerQuery) ||
        (card.specialization &&
          card.specialization.toLowerCase().includes(lowerQuery)) ||
        (card.creator?.username &&
          card.creator.username.toLowerCase().includes(lowerQuery)) ||
        (card.year && card.year.toLowerCase().includes(lowerQuery)))
    );
  });

  return (
    <div className="layout">
      <Sidebar />
      <div className="maincontent">
        {" "}
        <Navbar
          title={"Normal Session"}
          selectedFilters={selectedFilters}
          onFilterApply={handleFilterApply}
          onSearchChange={handleSearchChange}
          suggestions={suggestionList}
        />
        <TeacherTopics />
      </div>
    </div>
  );
};

export default Layout;
