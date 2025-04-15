import React, { useState, useEffect, useCallback, useRef } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import Navbar from "../components/NavBar";
import "../styles/layout.css";
import Addatopic from "../components/addatopic";
import Sidebar from "../components/Sidebar";
import TeacherTopics from "../components/TeacherTopics";

const Layout = () => {
  const [cards, setCards] = useState([]);
  const [selectedFilters, setSelectedFilters] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const navigate = useNavigate();
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get("/pfe/my-pfes", {
          withCredentials: true,
          headers: {
            "ngrok-skip-browser-warning": "true",
          },
        });

        if (response.data && response.data.data) {
          setCards(response.data.data);
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
      ((selectedFilters.length === 0 ||
        selectedFilters.includes(card.specialization)) &&
        card.title &&
        card.title.toLowerCase().includes(lowerQuery)) ||
      (card.specialization &&
        card.specialization.toLowerCase().includes(lowerQuery)) ||
      (card.creator?.username &&
        card.creator.username.toLowerCase().includes(lowerQuery)) ||
      (card.year && card.year.toLowerCase().includes(lowerQuery))
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
        <TeacherTopics cards={cards} setCards={setCards} />
      </div>
    </div>
  );
};

export default Layout;
