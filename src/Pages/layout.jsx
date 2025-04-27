import React, { useState, useEffect, useCallback, useRef } from "react";
import { Outlet } from "react-router-dom";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import Navbar from "../components/NavBar";
import "../styles/layout.css";

import Sidebar from "../components/Sidebar";

const Layout = () => {
  const user = JSON.parse(localStorage.getItem("user"));
  const [cards, setCards] = useState([]);
  const [selectedFilters, setSelectedFilters] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const navigate = useNavigate();

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
    console.log("Selected Filters:", selectedFilters);
  }, []);

  const handleSearchChange = useCallback((query) => {
    setSearchQuery(query);
  }, []);

  return (
    <div className="layout">
      <Sidebar />
      <div className="maincontent">
        <Navbar
          title={"Normal Session"}
          selectedFilters={selectedFilters}
          onFilterApply={handleFilterApply}
          onSearchChange={handleSearchChange}
          suggestions={suggestionList}
        />

        <Outlet context={{ cards, setCards, user, selectedFilters }} />
      </div>
    </div>
  );
};

export default Layout;
