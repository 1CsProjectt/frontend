
import React, { useState, useEffect, useCallback } from "react";
import axios from "axios";
import { useNavigate, useLocation } from "react-router-dom";
import Navbar from "../components/NavBar";
import Sidebar from "../components/Sidebar";
import PFECard from "../components/CardComponent";
import Style from "../styles/PFEPage.module.css";
import StudentPreferencesTab from "../components/StudentPreferencesTab";
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

const PFEPage = () => {
  const [cards, setCards] = useState([]);
  const [preferencesList, setPreferencesList] = useState(() => {
    try {
      const saved = localStorage.getItem("preferencesList");
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });
  useEffect(() => {
    // whenever preferencesList changes, persist it
    localStorage.setItem("preferencesList", JSON.stringify(preferencesList));
  }, [preferencesList]);


  const [selectedFilters, setSelectedFilters] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  // Set the default active tab to "PFE Topics"
  const [activeTab, setActiveTab] = useState("PFE Topics");

  const navigate = useNavigate();
  const location = useLocation();
  const user = JSON.parse(localStorage.getItem("user"));
  const endpoint = user?.role === "student" ? "/pfe/for-students" : "/pfe";

  // inside PFEPage component
  useEffect(() => {
    // Only fetch if no saved preferences
    if (preferencesList.length === 0) {
      axios.get("/api/v1/preflist/my", { withCredentials: true })
        .then((res) => {
          // Map backend data to your local shape
          const fetched = res.data.data.map((item, idx) => ({
            order: String(item.order + 1).padStart(2, "0"),
            topic_title: item.pfe.title,
            main_supervisor: "Unknown", // or derive if available
            status: "rejected",         // default status
            card_info: item.pfe
          }));
          setPreferencesList(fetched);
        })
        .catch((err) => {
          if (err.response?.status !== 404) {
            console.error("Error fetching preflist:", err);
          }
          // if 404, do nothing—leave list empty
        });
    }
  }, []); // empty deps → runs once on mount

  // Add new topic when coming from ExplorePage, preventing duplicates
  useEffect(() => {
    const added = location.state?.addedTopic;
    if (added) {
      setPreferencesList(prev => {
        // Check for existing entry by title
        const alreadyAdded = prev.some(item => item.topic_title === added.title);
        if (alreadyAdded) return prev;
        return [
          ...prev,
          {
            order: String(prev.length + 1).padStart(2, '0'),
            topic_title: added.title,
            main_supervisor: added.supervisors?.[0]
              ? `${added.supervisors[0].firstname} ${added.supervisors[0].lastname}`
              : 'Unknown',
            status: 'rejected',
            card_info: added
          }
        ];
      });
      // Clear the passed state to prevent re-adding
      navigate(location.pathname, { replace: true, state: {} });
      setActiveTab("My Preferences List");
    }
  }, [location.state, navigate, location.pathname]);
  useEffect(() => {
    const fetchData = async () => {
      try {

        // build params object dynamically
        const params = {};
        if (selectedFilters.length > 0) {

          params.specialization = selectedFilters;
        }

        const response = await axios.get(endpoint, {
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
  }, [endpoint, selectedFilters, navigate]);


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
                toggleSelect={() => { }}
              />
            ))
          ) : (
            <p className={Style["no-results-text"]}>No projects found.</p>
          )}
        </div>
      );
    } else if (activeTab === "My Preferences List") {
      console.log("Preferences List:", preferencesList);
      return (
        <div className={Style["preferences-container"]} style={{ marginTop: "1rem", padding: "1rem" }}>
          <StudentPreferencesTab PreferenecesList={preferencesList}
            session={session.title}
            setPreferencesList={setPreferencesList}
            submit={submit}

          />

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

              {(activeTab === "My Preferences List" && submit === false) && (
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
