import React, { useState, useEffect, useCallback } from "react";
import axios from "axios";
import { useNavigate, useLocation } from "react-router-dom";
import Navbar from "../components/NavBar";
import Sidebar from "../components/Sidebar";
import PFECard from "../components/CardComponent";
import Style from "../styles/PFEPage.module.css";
import StudentPreferencesTab from "../components/StudentPreferencesTab";
import formatSessions from "../utils/formatSessions";
import Toast from "../components/modals/Toast";

//dummy PreferenecesList

const PFEPage = () => {
  const [currentSessions, setCurrentSessions] = useState([]);

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
    localStorage.setItem("preferencesList", JSON.stringify(preferencesList));
  }, [preferencesList]);
  const [isToasterror, setIsToasterror] = useState(null);

  const [selectedFilters, setSelectedFilters] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [refreshkey, setrefreshkey] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [submit, setSubmit] = useState(false);
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState("");
  // Set the default active tab to "PFE Topics"
  const [activeTab, setActiveTab] = useState("PFE Topics");

  const navigate = useNavigate();
  const location = useLocation();
  const user = JSON.parse(localStorage.getItem("user"));
  const endpoint = user?.role === "student" ? "/pfe/for-students" : "/pfe";

  useEffect(() => {
    // Only fetch when list is empty AND session title matches
    if (currentSessions[0]?.sessionTitle === "Select topics session") {
      axios
        .get("/preflist/my", { withCredentials: true })
        .then((res) => {
          const fetched = res.data.data.map((item) => ({
            id: item.PFE.id,
            order: String(item.order).padStart(2, "0"),
            topic_title: item.PFE.title,
            submit: item.approved,
            main_supervisor: item.PFE.supervisors?.[0]
              ? `${item.PFE.supervisors[0].firstname} ${item.PFE.supervisors[0].lastname}`
              : "Unknown",
            card_info: {
              ...item.PFE,
              description: item.PFE.description,
              year: item.PFE.year,
              specialization: item.PFE.specialization,
              pdfFile: item.PFE.pdfFile,
              photo: item.PFE.photo,
            },
          }));
          setPreferencesList(fetched);
          console.log("Fetched preferences list:", fetched);
        })
        .catch((err) => {
          setIsToasterror(true);
          const msg =
            err.response?.data?.message || "Fetch failed. Please try again.";
          setError(msg);
          setToastMessage(msg);
          setShowToast(true);
        });
    }
  }, [currentSessions]);

  // Add new topic when coming from ExplorePage, preventing duplicates
  useEffect(() => {
    const added = location.state?.addedTopic;
    if (added) {
      setPreferencesList((prev) => {
        // Check for existing entry by title
        const alreadyAdded = prev.some(
          (item) => item.topic_title === added.title
        );
        if (alreadyAdded) return prev;
        return [
          ...prev,
          {
            order: String(prev.length + 1).padStart(2, "0"),
            topic_title: added.title,
            main_supervisor: added.supervisors?.[0]
              ? `${added.supervisors[0].firstname} ${added.supervisors[0].lastname}`
              : "Unknown",

            card_info: added,
          },
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
        // Build params object dynamically
        const params = {};
        if (selectedFilters.length > 0) {
          params.specialization = selectedFilters;
        }

        const response = await axios.get(endpoint, {
          params,
          withCredentials: true,
        });

        if (response.data) {
          const { pfeList, currentSessions } = response.data;

          // Set PFE cards
          if (pfeList) {
            setCards(pfeList);
            console.log("Fetched PFE cards:", pfeList);
          }

          if (currentSessions) {
            console.log("Processed current sessions:", currentSessions);

            const processedSessions = formatSessions(currentSessions);
            setCurrentSessions(processedSessions);
            console.log("Processed current sessions:", processedSessions);
          }
        }
      } catch (err) {
        setIsToasterror(true);
        setError(err.response?.data?.message || " failed. Please try again.");
        setToastMessage(
          err.response?.data?.message || " failed. Please try again."
        );
        setShowToast(true);
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
    setSearchQuery(query);
  }, []);

  // Filter cards based on search query and selected filters
  const filteredCards = cards.filter((card) => {
    const lowerQuery = searchQuery.toLowerCase();
    const matchesSearch =
      card.title.toLowerCase().includes(lowerQuery) ||
      (card.specialization &&
        card.specialization.toLowerCase().includes(lowerQuery)) ||
      (card.createdBy?.username &&
        card.createdBy.username.toLowerCase().includes(lowerQuery)) ||
      (card.year && String(card.year).toLowerCase().includes(lowerQuery));

    const matchesFilter =
      selectedFilters.length === 0 ||
      selectedFilters.includes(card.specialization);

    return matchesFilter && matchesSearch;
  });

  useEffect(() => {
    console.log("****Filtered cards:***********", filteredCards);
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
                sessionTitle={currentSessions[0]?.sessionTitle}
                targetDate={currentSessions[0]?.targetDate || null}
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
        <div
          className={Style["preferences-container"]}
          style={{ marginTop: "1rem", padding: "1rem" }}
        >
          <StudentPreferencesTab
            refreshkey={refreshkey}
            setrefreshkey={setrefreshkey}
            PreferenecesList={preferencesList}
            session={currentSessions[0]?.sessionTitle}
            setPreferencesList={setPreferencesList}
            submit={preferencesList[0]?.submit || false}
            sessionTitle={currentSessions[0]?.sessionTitle}
            targetDate={currentSessions[0]?.targetDate || null}
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
          title={currentSessions[0]?.sessionTitle || "Normal session"}
          selectedFilters={selectedFilters}
          onFilterApply={handleFilterApply}
          onSearchChange={handleSearchChange}
          suggestions={suggestionList}
          targetDate={currentSessions[0]?.targetDate || null}
        />

        {currentSessions[0]?.sessionTitle === "Select topics session" && (
          <div>
            <div className={Style["header-row"]}>
              <h1>Explore PFE Topics</h1>

              {activeTab === "My Preferences List" && submit === false && (
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

            <div className={Style["tabs"]}>
              {["PFE Topics", "My Preferences List"].map((tab) => (
                <div
                  key={tab}
                  className={`${Style["tab-item"]} ${
                    activeTab === tab ? Style.active : ""
                  }`}
                  onClick={() => {
                    setActiveTab(tab);
                    setSearchQuery("");
                  }}
                >
                  {tab}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Render the content for the currently active tab */}
        {renderTabContent()}
      </div>
      {showToast && (
        <Toast
          message={toastMessage}
          onClose={() => setShowToast(false)}
          isError={isToasterror}
        />
      )}
    </div>
  );
};

export default PFEPage;
