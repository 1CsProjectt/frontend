import React, { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../components/NavBar";
import Sidebar from "../components/Sidebar";
import PFECard from "../components/CardComponent";
import Style from "../styles/PFEPage.module.css";

// Dummy data (données simulées) for testing
const dummyData = [
  {
    id: 1,
    title: "Project Alpha",
    specialization: "Web Development", // Développement web
    creator: { username: "UserOne" },
    year: 2021,
  },
  {
    id: 2,
    title: "Project Beta",
    specialization: "Data Science", // Science des données
    creator: { username: "UserTwo" },
    year: 2022,
  },
  {
    id: 3,
    title: "Project Gamma",
    specialization: "Mobile App Development", // Développement d'applications mobiles
    creator: { username: "UserThree" },
    year: 2023,
  },
];

const PFEPage = () => {
  const [cards, setCards] = useState([]);
  const [selectedFilters, setSelectedFilters] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    // Using dummy data instead of a real API call
    // (Utilisation de données simulées au lieu d'un appel d'API réel)
    const fetchData = async () => {
      try {
        // In production, you would use an API call like:
        // const response = await axios.get("/pfe/for-students", { withCredentials: true, headers: { "ngrok-skip-browser-warning": "true" } });
        // if (response.data && response.data.pfeList) { setCards(response.data.pfeList); }
        console.log("Using dummy data for testing.");
        setCards(dummyData);
      } catch (err) {
        console.error("Error fetching card data:", err);
        if (err.response?.status === 401) {
          alert("Session expired. Please log in again."); // Session expirée. Veuillez vous reconnecter.
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

  // Creating a suggestion list (liste de suggestions)
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

  // Callback for filtering by specialization (spécialisation)
  const handleFilterApply = useCallback((newFilters) => {
    setSelectedFilters(newFilters);
  }, []);

  // Callback for handling search input changes
  const handleSearchChange = useCallback((query) => {
    console.log("Search query:", query);
    setSearchQuery(query);
  }, []);

  // Filter the cards based on the search query and selected filters
  const filteredCards = cards.filter((card) => {
    const lowerQuery = searchQuery.toLowerCase();
    const matchesSearch =
      card.title.toLowerCase().includes(lowerQuery) ||
      (card.specialization && card.specialization.toLowerCase().includes(lowerQuery)) ||
      (card.creator?.username && card.creator.username.toLowerCase().includes(lowerQuery)) ||
      (card.year && String(card.year).toLowerCase().includes(lowerQuery));

    const matchesFilter =
      selectedFilters.length === 0 ||
      selectedFilters.includes(card.specialization);

    return matchesFilter && matchesSearch;
  });

  // Log filtered results for debugging (débogage)
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
          <div className={Style["cards-container"]} style={{ overflowY: "auto" }}>
            {filteredCards.length > 0 ? (
              filteredCards.map((card, index) => (
                <PFECard key={card.id || index} card={card} isSelected={null} toggleSelect={() => {}} />
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
