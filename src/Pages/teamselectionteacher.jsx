import React, { useState, useEffect, useRef } from "react";
import Module from "../styles/TeamSelectionTeacher.module.css";
import axios from "axios";
import { getPaginatedData, getPageNumbers } from "../utils/paginationFuntion";
import Seemorepage from "../components/ExistedTeamSeemore";

axios.defaults.withCredentials = true;
axios.defaults.headers.common["ngrok-skip-browser-warning"] = "true";

const TeamSelectionTeacher = () => {
  const [activeTab, setActiveTab] = useState("FormedTeams");

  return (
    <div className={Module["team-formation-container"]}>
      <div className={Module["header-container"]}>
        <h1>Team Management</h1>
        {activeTab === "ReceivedRequests" && (
          <button
            className={Module["refresh-button"]}
            onClick={() => alert("Refresh requests logic here")}
          >
            Random-Acceptence
          </button>
        )}
      </div>
      {/* Tabs */}
      <div className={Module["tabs"]}>
        <button
          className={`${Module["tab-item"]} ${
            activeTab === "FormedTeams" ? Module["active"] : ""
          }`}
          onClick={() => setActiveTab("FormedTeams")}
        >
          Formed Teams
        </button>
        <button
          className={`${Module["tab-item"]} ${
            activeTab === "ReceivedRequests" ? Module["active"] : ""
          }`}
          onClick={() => setActiveTab("ReceivedRequests")}
        >
          Received Requests
        </button>
      </div>

      {/* Tab Content */}
      <div className={Module["tab-content"]}>
        {activeTab === "FormedTeams" ? (
          <FormedTeamsTab />
        ) : (
          <ReceivedRequestsTab />
        )}
      </div>
    </div>
  );
};

// Formed Teams Component
const FormedTeamsTab = () => {
  const [teams, setTeams] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [teamsPerPage, setTeamsPerPage] = useState(10);
  const containerRef = useRef(null);
  const [selectedTeam, setSelectedTeam] = useState(null);

  useEffect(() => {
    const fetchFormedTeams = async () => {
      try {
        const response = await axios.get("/teams/all-teams", {
          withCredentials: true,
        });
        if (!response.data || !response.data.teams) {
          throw new Error("Invalid response structure");
        }

        const formattedTeams = response.data.teams.map((team) => ({
          id: team.id,
          groupName: team.groupName,
          members: team.members || [],
          status: team.status || "Active",
          leaderName:
            team.members && team.members.length > 0
              ? `${team.members[0].firstname} ${team.members[0].lastname}`
              : "N/A",
        }));
        setTeams(formattedTeams);
      } catch (err) {
        setError(err.message || "Failed to fetch formed teams");
        console.error("Error fetching formed teams:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchFormedTeams();
  }, []);

  useEffect(() => {
    const updateTeamsPerPage = () => {
      if (containerRef.current) {
        const containerHeight = containerRef.current.clientHeight;
        const estimatedRowHeight = 75;
        const rowsPerPage = Math.floor(containerHeight / estimatedRowHeight);
        setTeamsPerPage(Math.max(rowsPerPage, 1)); // Ensure at least 1 item per page
      }
    };

    updateTeamsPerPage();
    const resizeListener = window.addEventListener(
      "resize",
      updateTeamsPerPage
    );
    return () => window.removeEventListener("resize", resizeListener);
  }, []);

  const { currentItems: currentTeams, totalPages } = getPaginatedData(
    teams,
    currentPage,
    teamsPerPage
  );

  const pageNumbers = getPageNumbers(totalPages, currentPage);

  const handlePageChange = (newPage) => {
    if (newPage >= 1 && newPage <= totalPages) {
      setCurrentPage(newPage);
    }
  };

  const handleBackFromTeamDetails = () => {
    setSelectedTeam(null);
  };

  if (loading)
    return <div className={Module["loading-indicator"]}>Loading...</div>;
  if (error) return <div className={Module["error-message"]}>{error}</div>;

  if (selectedTeam) {
    const mappedMembers = selectedTeam.members.map((member) => ({
      fullName: `${member.firstname} ${member.lastname}`,
      email: member.user?.email || "N/A",
      role: member.role || "Member",
    }));

    return (
      <div>
        <Seemorepage
          userRole="teacher"
          myTeamNumber={selectedTeam.id}
          myTeamMembers={mappedMembers}
          onBack={handleBackFromTeamDetails}
        />
      </div>
    );
  }

  return (
    <div className={Module["page-container"]}>
      <div className={Module["table-wrapper"]} ref={containerRef}>
        <table>
          <thead>
            <tr>
              <th>Team Number</th>
              <th>Team Name</th>
              <th>Team Leader</th>
              <th>Members Count</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {currentTeams.length > 0 ? (
              currentTeams.map((team) => (
                <tr key={team.id}>
                  <td>{team.id}</td>
                  <td>{team.groupName}</td>
                  <td>{team.leaderName}</td>
                  <td>{team.members.length}</td>
                  <td>
                    <span
                      className={
                        team.status === "Active"
                          ? Module["status-available"]
                          : Module["status-in-team"]
                      }
                    >
                      {team.status}
                    </span>
                  </td>
                  <td className={Module["button-container"]}>
                    <button
                      className={Module["invite-button"]}
                      onClick={() => setSelectedTeam(team)}
                    >
                      See More
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="6" className={Module["no-data"]}>
                  No teams found
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {totalPages > 1 && (
        <div className={Module["pagination"]}>
          <button
            onClick={() => handlePageChange(currentPage - 1)}
            disabled={currentPage === 1}
            className={currentPage === 1 ? Module["disabled"] : ""}
          >
            Previous
          </button>

          <div className={Module["page-numbers"]}>
            {pageNumbers.map((page, idx) =>
              page === "..." ? (
                <span key={idx} className={Module["ellipsis"]}>
                  ...
                </span>
              ) : (
                <button
                  key={idx}
                  onClick={() => handlePageChange(page)}
                  className={page === currentPage ? Module["active"] : ""}
                >
                  {page}
                </button>
              )
            )}
          </div>

          <button
            onClick={() => handlePageChange(currentPage + 1)}
            disabled={currentPage === totalPages}
            className={currentPage === totalPages ? Module["disabled"] : ""}
          >
            Next
          </button>
        </div>
      )}
    </div>
  );
};

// Received Requests Component
const ReceivedRequestsTab = () => {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [requestsPerPage, setRequestsPerPage] = useState(10);
  const containerRef = useRef(null);

  useEffect(() => {
    const fetchReceivedRequests = async () => {
      try {
        const response = await axios.get("/preflist/getAllrequests", {
          withCredentials: true,
        });
        if (!response.data || !Array.isArray(response.data.data)) {
          throw new Error("Invalid response structure");
        }

        // Sort requests by sentAt (newest first) and add order number
        const sortedRequests = [...response.data.data]
          .sort((a, b) => new Date(b.sentAt) - new Date(a.sentAt))
          .map((request, index) => ({
            ...request,
            order: index + 1,
            status: request.status || "PENDING",
            topicTitle: request.topicTitle || "N/A",
            teamId: request.teamId || "N/A",
          }));

        setRequests(sortedRequests);
      } catch (err) {
        setError(err.message || "Failed to fetch received requests");
        console.error("Error fetching requests:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchReceivedRequests();
  }, []);

  useEffect(() => {
    const updateRequestsPerPage = () => {
      if (containerRef.current) {
        const containerHeight = containerRef.current.clientHeight;
        const estimatedRowHeight = 75;
        const rowsPerPage = Math.floor(containerHeight / estimatedRowHeight);
        setRequestsPerPage(Math.max(rowsPerPage, 1));
      }
    };

    updateRequestsPerPage();
    const resizeListener = () => updateRequestsPerPage();
    window.addEventListener("resize", resizeListener);
    return () => window.removeEventListener("resize", resizeListener);
  }, []);

  // Added pagination calculations
  const { currentItems: currentRequests, totalPages } = getPaginatedData(
    requests,
    currentPage,
    requestsPerPage
  );

  // Added page numbers generation
  const pageNumbers = getPageNumbers(totalPages, currentPage);

  // Added page change handler
  const handlePageChange = (newPage) => {
    if (newPage >= 1 && newPage <= totalPages) {
      setCurrentPage(newPage);
    }
  };

  // ... (keep the existing pageNumbers and handlePageChange functions)

  const handleApprove = async (requestId) => {
    try {
      await axios.patch(
        `/preflist/supervision-request/${requestId}`,
        { status: "ACCEPTED" }, // Add status to request body
        {
          withCredentials: true,
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      setRequests((prevRequests) =>
        prevRequests.filter((request) => request.id !== requestId)
      );
    } catch (err) {
      console.error("Error approving request:", err);
      setError("Failed to approve request");
    }
  };

  const handleReject = async (requestId) => {
    try {
      await axios.patch(
        `/preflist/supervision-request/${requestId}`,
        { status: "REJECTED" }, // Add status to request body
        {
          withCredentials: true,
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      setRequests((prevRequests) =>
        prevRequests.filter((request) => request.id !== requestId)
      );
    } catch (err) {
      console.error("Error rejecting request:", err);
      setError("Failed to reject request");
    }
  };

  if (loading)
    return <div className={Module["loading-indicator"]}>Loading...</div>;
  if (error) return <div className={Module["error-message"]}>{error}</div>;

  return (
    <div className={Module["page-container"]}>
      <div className={Module["table-wrapper"]} ref={containerRef}>
        <table>
          <thead>
            <tr>
              <th>Order</th>
              <th>Team Number</th>
              <th>Topic Title</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {currentRequests.length > 0 ? (
              currentRequests.map((request) => (
                <tr key={request.id}>
                  <td>{request.order}</td>
                  <td>{request.teamId}</td>
                  <td>{request.topicTitle}</td>
                  <td>
                    <span
                      className={
                        request.status === "APPROVED"
                          ? Module["status-available"]
                          : request.status === "REJECTED"
                          ? Module["status-in-team"]
                          : Module["status-pending"]
                      }
                    >
                      {request.status}
                    </span>
                  </td>
                  <td className={Module["button-container"]}>
                    {request.status === "PENDING" && (
                      <>
                        <button
                          className={Module["invite-button"]}
                          onClick={() => handleApprove(request.id)}
                          style={{
                            backgroundColor: "#F1F1F1",
                            color: "#344054",
                            marginRight: "8px",
                          }}
                        >
                          Approve
                        </button>
                        <button
                          className={Module["invite-button"]}
                          onClick={() => handleReject(request.id)}
                          style={{
                            backgroundColor: "white",
                            color: "#344054",
                          }}
                        >
                          Reject
                        </button>
                      </>
                    )}
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="5" className={Module["no-data"]}>
                  No requests found
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {totalPages > 1 && (
        <div className={Module["pagination"]}>
          <button
            onClick={() => handlePageChange(currentPage - 1)}
            disabled={currentPage === 1}
            className={currentPage === 1 ? Module["disabled"] : ""}
          >
            Previous
          </button>

          <div className={Module["page-numbers"]}>
            {pageNumbers.map((page, idx) =>
              page === "..." ? (
                <span key={idx} className={Module["ellipsis"]}>
                  ...
                </span>
              ) : (
                <button
                  key={idx}
                  onClick={() => handlePageChange(page)}
                  className={page === currentPage ? Module["active"] : ""}
                >
                  {page}
                </button>
              )
            )}
          </div>

          <button
            onClick={() => handlePageChange(currentPage + 1)}
            disabled={currentPage === totalPages}
            className={currentPage === totalPages ? Module["disabled"] : ""}
          >
            Next
          </button>
        </div>
      )}
    </div>
  );
};
export default TeamSelectionTeacher;
