
import React, { useState, useEffect, useCallback } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import Navbar from "../components/NavBar";
import Sidebar from "../components/Sidebar";
import PFECard from "../components/CardComponent";
import Style from "../styles/PFEPage.module.css";
import StudentPreferencesTab from "../components/StudentPreferencesTab";
import { Sun } from "lucide-react";
import { API_URL } from "../config";

const session = {
  title: "TOPIC_SELECTION",
  targetDate: {
    start: new Date("2025-03-29T00:00:00"),
    end: new Date("2025-04-29T23:59:59")
  }
};
const submit = false;
let sessionTitle;

if (session.title === "TEAM_CREATION") {
  sessionTitle = "Group formation session";
} else if (session.title === "TOPIC_SELECTION") {
  sessionTitle = "Select topics session";
} else {
  sessionTitle = "Unknown session";
}
//dummy PreferenecesList
let PreferenecesList = [
  {
    "order": "01",
    "topic_title": "Academic document checker using Academic document checker using",
    "main_supervisor": "Prof. Leila Kherbache",
    "status": "rejected"
  },
  {
    "order": "02",
    "topic_title": "Academic document checker using Academic document checker using",
    "main_supervisor": "Prof. Leila Kherbache",
    "status": "rejected"
  },
  {
    "order": "03",
    "topic_title": "Career advisor app for students Academic document checker using",
    "main_supervisor": "Dr. Yacine Merabet",
    "status": "accepted"
  },
  {
    "order": "04",
    "topic_title": "Real-time task manager for rese Academic document checker using",
    "main_supervisor": "Prof. Nadia Touati",
    "status": "pending"
  }
]
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
/*   const endpoint = user?.role === "student" ? "" : "/pfe"; */
  useEffect(() => {
    const fetchData = async () => {
      try {

      // build params object dynamically
       const params = {};
       if (selectedFilters.length > 0) {
        // you can pass an array; Axios will serialize as
         // ?specialization=foo&specialization=bar
         params.specialization = selectedFilters;
     }
 
       const response = await axios.get(`${API_URL}/pfe/for-students`, {
        params,
         withCredentials: true,
       });
  
        if (response.data && response.data.pfeList) {
          setCards(response.data.pfeList);
        }
      } catch (err) {
        // …error handling…
      } finally {
        setLoading(false);
      }
    };
 

   fetchData();
 }, [ selectedFilters, navigate]);
 

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
        <div className={Style["preferences-container"]} style={{ marginTop: "1rem", padding: "1rem" }}>
       <StudentPreferencesTab PreferenecesList={PreferenecesList} session = {sessionTitle} submit={submit} />
         
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
         
          display: "flex",
          flexDirection: "column",
        }}
      >
        <Navbar
          title={sessionTitle}
          selectedFilters={selectedFilters}
          onFilterApply={handleFilterApply}
          onSearchChange={handleSearchChange}
          suggestions={suggestionList}
          targetDate={session.targetDate}
        />
    
{sessionTitle === "Select topics session" && (
    <div >
    <div className={Style["header-row"]}>
      <h1>Explore PFE Topics</h1>

      {(activeTab === "My Preferences List" && submit === false ) && (
        <>
       
            <button
              className={Style["addtopic-button"]}
              onClick={() => setActiveTab("PFE Topics")}
            >
             Add a topic
            </button>
        
         
        </>
      )}

    </div>
    </div>
)}
  
      {/* Tabs header similar to TeamFormationPage's approach */}
        <div className={Style["tabs"]}>
          {["PFE Topics", "My Preferences List"].map((tab) => (
            <div
              key={tab}
              className={`${Style["tab-item"]} ${activeTab === tab ? Style.active : ""}`}
              onClick={() => {
                setActiveTab(tab);
                setSearchQuery(""); 
              }}
            >
              {tab}
            </div>
          ))}
        </div>


        {/* Render the content for the currently active tab */}
        {renderTabContent()}
      </div>
    </div>
  );
};

export default PFEPage;
