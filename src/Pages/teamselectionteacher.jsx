import React, { useState, useEffect, useRef } from "react";
import Module from "../styles/TeamSelectionTeacher.module.css";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { getPaginatedData, getPageNumbers } from "../utils/paginationFuntion";
import Seemorepage from "../components/ExistedTeamSeemore";
import Popup from "../components/modals/popup";
import { useCallback } from "react";
axios.defaults.withCredentials = true;
axios.defaults.headers.common["ngrok-skip-browser-warning"] = "true";

const PENDING = "PENDING";
const ACCEPTED = "ACCEPTED";
const REJECTED = "REJECTED";

const TeamSelectionTeacher = () => {
  const [requests, setRequests] = useState({
    [PENDING]: [],
    [ACCEPTED]: [],
    [REJECTED]: [],
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const handleStatusUpdate = useCallback(
    async (requestId, newStatus) => {
      try {
        await axios.patch(
          `/preflist/supervision-request/${requestId}`,
          { status: newStatus },
          { headers: { "Content-Type": "application/json" } }
        );

        setRequests((prev) => ({
          ...prev,
          [PENDING]: prev[PENDING].filter((r) => r.id !== requestId),
          [newStatus]: [
            ...prev[newStatus],
            prev[PENDING].find((r) => r.id === requestId),
          ],
        }));

        setShowConfirmation(false);
        setSuccess(true);
      } catch (err) {
        console.error(`Error ${newStatus.toLowerCase()} request:`, err);
        setError(`Failed to ${newStatus.toLowerCase()} request`);
      }
    },
    [setRequests, setError]
  );
  const [showConfirmation, setShowConfirmation] = useState(false);
  const navigate = useNavigate();
  const randomSelection = () => {};
  const [activeTab, setActiveTab] = useState(PENDING);
  const [selectedRequest, setSelectedRequest] = useState(false);
  const [selectedRequestid, setSelectedRequestid] = useState(null);
  const [success, setSuccess] = useState(false);
  const [confTitle, setConfTitle] = useState(""); // for confirmation popup title
  const [confMsg, setConfMsg] = useState(""); // for confirmation popup message
  const [confButtonText, setConfButtonText] = useState("");
  const [status, setStatus] = useState("");
  return (
    <div className={Module["team-formation-container"]}>
      <div
        className={Module["header-part"]}
        style={selectedRequest ? { paddingBottom: "59px" } : {}}
      >
        <div className={Module["header-container"]}>
          <p className="pagetitle">Received Requests</p>{" "}
          <button
            className={` ${
              selectedRequest ? Module["back-btn"] : Module["refresh-button"]
            }`}
            onClick={
              selectedRequest
                ? () => setSelectedRequest(false)
                : () => randomSelection()
            }
          >
            {selectedRequest ? "Back" : "Random Selection"}
          </button>
        </div>
        {!selectedRequest && (
          <div className="tabs-container">
            <div className="tabs">
              <button
                className={`tab-item ${activeTab === PENDING ? "active" : ""}`}
                onClick={() => setActiveTab(PENDING)}
              >
                Pending
              </button>
              <button
                className={`tab-item ${activeTab === ACCEPTED ? "active" : ""}`}
                onClick={() => setActiveTab(ACCEPTED)}
              >
                Accepted
              </button>
              <button
                className={`tab-item ${activeTab === REJECTED ? "active" : ""}`}
                onClick={() => setActiveTab(REJECTED)}
              >
                Rejected
              </button>
            </div>
          </div>
        )}
      </div>
      <ReceivedRequestsTab
        showConfirmation={showConfirmation}
        setShowConfirmation={setShowConfirmation}
        success={success}
        setSuccess={setSuccess}
        activeTab={activeTab}
        selectedRequest={selectedRequest}
        setSelectedRequest={setSelectedRequest}
        setSelectedRequestid={setSelectedRequestid}
        selectedRequestid={selectedRequestid}
        handleactions={handleStatusUpdate}
        setError={setError}
        setLoading={setLoading}
        error={error}
        loading={loading}
        status={status}
        setStatus={setStatus}
        requests={requests}
        setRequests={setRequests}
        confTitle={confTitle}
        confMsg={confMsg}
        confButtonText={confButtonText}
        setConfTitle={setConfTitle}
        setConfMsg={setConfMsg}
        setConfButtonText={setConfButtonText}
      />
      {showConfirmation && (
        <Popup
          onConfirm={() => {
            status === "blue"
              ? handleStatusUpdate(selectedRequestid, ACCEPTED)
              : handleStatusUpdate(selectedRequestid, REJECTED);
          }}
          confirmText={confButtonText}
          poproud={1}
          status={status}
          confirmMessage={confMsg}
          confirmTitle={confTitle}
          onCancel={() => setShowConfirmation(false)}
        />
      )}

      {success && (
        <Popup
          poproud={2}
          onOkey={() => {
            setSuccess(false);
          }}
        />
      )}
    </div>
  );
};

const ReceivedRequestsTab = ({
  activeTab,
  selectedRequest,
  setSelectedRequest,
  setSelectedRequestid,
  selectedRequestid,
  handleactions,
  setError,
  setLoading,
  error,
  loading,
  setRequests,
  setShowConfirmation,
  requests,
  setStatus,
  setConfTitle,
  setConfMsg,
  success,
  setSuccess,
  setConfButtonText,
}) => {
  const [currentPage, setCurrentPage] = useState(1);
  const [requestsPerPage, setRequestsPerPage] = useState(10);
  const containerRef = useRef(null);
  const [teamid, setTeamid] = useState(null);

  const handleRowClick = (teamid, requestid) => {
    console.log("requesssssssssssssssssssssssssst", requestid);
    setSelectedRequest(true);
    setTeamid(teamid);
    setSelectedRequestid(requestid);
  };

  useEffect(() => {
    const fetchReceivedRequests = async () => {
      try {
        const response = await axios.get("/preflist/getAllrequests");
        if (!response.data?.data) throw new Error("Invalid response structure");

        const sortedRequests = response.data.data.reduce(
          (acc, request, index) => {
            const status = request.status?.toUpperCase() || PENDING;
            const processedRequest = {
              ...request,
              order: index + 1,
              status,
              topicTitle: request.pfe?.title || "N/A",
              grade: request.pfe?.year || "N/A",
              teamId: request.teamId || "N/A",
            };

            acc[status] = [...acc[status], processedRequest];
            return acc;
          },
          { [PENDING]: [], [ACCEPTED]: [], [REJECTED]: [] }
        );

        setRequests(sortedRequests);
      } catch (err) {
        setError(err.message || "Failed to fetch requests");
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
    window.addEventListener("resize", updateRequestsPerPage);
    return () => window.removeEventListener("resize", updateRequestsPerPage);
  }, []);

  const currentRequests = requests[activeTab];
  const { currentItems: paginatedRequests, totalPages } = getPaginatedData(
    currentRequests,
    currentPage,
    requestsPerPage
  );

  const pageNumbers = getPageNumbers(totalPages, currentPage);

  if (loading)
    return <div className={Module["loading-indicator"]}>Loading</div>;

  return (
    <div className={Module["page-container"]}>
      {error && <div className={Module["error-message"]}>{error}</div>}
      {selectedRequest ? (
        <div style={{ padding: "10px" }}>
          {" "}
          <Seemorepage
            userRole={activeTab === PENDING ? "teacher" : "teacher.teams"}
            myTeamNumber={teamid}
            handleactions={handleactions}
            requestid={selectedRequestid}
            setSelectedRequest={setSelectedRequest}
            success={success}
            setSuccess={setSuccess}
          />
        </div>
      ) : (
        <>
          <div className={Module["table-wrapper"]} ref={containerRef}>
            <table>
              <thead>
                <tr>
                  <th>Order</th>
                  <th>Team Number</th>
                  <th>Grade</th>
                  <th>Topic Title</th>
                  <th>Status</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {paginatedRequests.length > 0 ? (
                  paginatedRequests.map((request) => (
                    <tr
                      key={request.id}
                      onClick={() => handleRowClick(request.teamId, request.id)}
                      className={Module["clickable-row"]}
                    >
                      <td>{request.order}</td>
                      <td>{request.teamId}</td>
                      <td>{request.grade}</td>
                      <td>{request.topicTitle}</td>
                      <td>
                        <span
                          className={
                            Module[`status-${request.status.toLowerCase()}`]
                          }
                        >
                          {request.status}
                        </span>
                      </td>
                      <td
                        className={Module["button-container"]}
                        onClick={(e) => e.stopPropagation()}
                      >
                        {activeTab === PENDING && (
                          <>
                            <button
                              className={Module["invite-button"]}
                              onClick={(e) => {
                                setConfTitle("Accept the request");
                                setConfMsg(
                                  "Are you sure you want to accept this request? This action cannot be undone."
                                );
                                setConfButtonText("accept");
                                setStatus("blue");

                                setShowConfirmation(true);
                                setSelectedRequestid(request.id);
                                e.stopPropagation();
                              }}
                              style={buttonStyles.accept}
                            >
                              Approve
                            </button>
                            <button
                              className={Module["invite-button"]}
                              onClick={(e) => {
                                setConfTitle("Refuse the request");
                                setConfMsg(
                                  "Are you sure you want to refuse this request? This action cannot be undone."
                                );
                                setConfButtonText("refuse");
                                setStatus("red");
                                setShowConfirmation(true);
                                setSelectedRequestid(request.id);
                                e.stopPropagation();
                              }}
                              style={buttonStyles.reject}
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
                    <td colSpan="6" className={Module["no-data"]}>
                      No {activeTab.toLowerCase()} requests found
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          {totalPages > 1 && (
            <div className={Module["pagination"]}>
              <button
                onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
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
                      onClick={() => setCurrentPage(page)}
                      className={page === currentPage ? Module["active"] : ""}
                    >
                      {page}
                    </button>
                  )
                )}
              </div>

              <button
                onClick={() =>
                  setCurrentPage((p) => Math.min(totalPages, p + 1))
                }
                disabled={currentPage === totalPages}
                className={currentPage === totalPages ? Module["disabled"] : ""}
              >
                Next
              </button>
            </div>
          )}
        </>
      )}
    </div>
  );
};

const buttonStyles = {
  accept: {
    backgroundColor: "#F1F1F1",
    color: "#344054",
    marginRight: "8px",
  },
  reject: {
    backgroundColor: "white",
    color: "#344054",
  },
};

export default TeamSelectionTeacher;
