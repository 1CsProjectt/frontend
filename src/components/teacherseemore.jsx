import {
  forwardRef,
  useImperativeHandle,
  useState,
  useRef,
  useEffect,
  useContext,
} from "react";
import "../styles/addtopic.css";
import Uploadfile from "./modals/uploadbox";
import { useNavigate } from "react-router-dom";
import styled from "styled-components";
import Toast from "../components/modals/Toast";

import axios from "axios";

// Styled components must be defined BEFORE the component that uses them
const ModalOverlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.5);
  display: ${(props) => (props.$show ? "flex" : "none")};
  justify-content: center;
  align-items: center;
`;
const ModalContent = styled.div`
  background-color: white;
  padding: 24px;
  border-radius: 8px;
  width: 400px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
`;

const WarningText = styled.p`
  color: #666;
  margin-bottom: 24px;
  position: relative;
  padding-left: 28px;
  line-height: 1.5;
  font-size: 14px;

  &::before {
    content: "!";
    position: absolute;
    left: 0;
    width: 20px;
    height: 20px;
    background-color: #ffeb3b;
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    font-weight: bold;
  }
`;
const ReviewSection = styled.div`
  display: flex;
  flex-direction: column;
  gap: 16px;
  margin-bottom: 24px;
  padding-bottom: 16px;
  border-bottom: 1px solid #eeeeee;
`;

const ReviewTitle = styled.div`
  font-weight: 600;
  font-size: 16px;
  color: #333333;
`;

const ButtonGroup = styled.div`
  display: flex;
  gap: 16px;
  justify-content: center;
`;

const Button = styled.button`
  padding: 12px 65px;
  border: none;
  border-radius: 6px;
  cursor: pointer;
  font-weight: 500;
  font-size: 14px;
  transition: all 0.2s;

  ${(props) =>
    props.$primary
      ? `
    background-color: #077ED4;
    color: white;
    &:hover {
      background-color: #0669ad;
    }
  `
      : `
    background-color: #eeeeee;
    color: #666666;
    &:hover {
      background-color: #dddddd;
    }
  `}
`;

// Add review status enumeration
const ReviewStatus = {
  APPROVED: "Approved",
  UNFINISHED: "Unfinished",
  REJECTED: "Rejected",
};

const StatusBadge = styled.span`
  font-weight: 500;
  padding: 4px 8px;
  border-radius: 4px;
  margin-left: 8px;
  background-color: ${(props) => {
    if (props.$status === ReviewStatus.APPROVED) return "#e8f5e9";
    if (props.$status === ReviewStatus.REJECTED) return "#ffebee";
    return "#fff3e0";
  }};
  color: ${(props) => {
    if (props.$status === ReviewStatus.APPROVED) return "#4CAF50";
    if (props.$status === ReviewStatus.REJECTED) return "#f44336";
    return "#ff9800";
  }};
`;
const TeacherSeeMore = ({
  review,
  setSeeMore,
  myMeet,
  objfile,
  setObjectFile,
  supportfile,
  setSupportFile,
  reviewfile,
  setReviewFile,
  refreshKey,
  setRefreshKey,
}) => {
  const handleEditMeetingg = async () => {
    try {
      // 🚫 Check if date is today or in the past

      const formDataToSend = new FormData();

      // Append file if exists
      if (objfile instanceof File) {
        formDataToSend.append("My_review_for_deliverables_files", reviewfile);
      } else if (typeof objfile === "string") {
        formDataToSend.append("My_review_for_deliverables_files", reviewfile);
      }

      const response = await axios.patch(
        `/mettings/updateMeeting/${myMeet.id}`,
        formDataToSend,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );

      if (response.data?.status === "success") {
        setToastMessage("Review file for deliverables sent successfully!");
        setRefreshKey((prev) => prev + 1);
      }
    } catch (err) {
      console.error("Update failed:", err.response?.data || err.message);
      setToastMessage("Failed to update meeting");
    } finally {
      setShowToast(true);
    }
  };
  const [showToast, setShowToast] = useState(false);
  const handleReview = async () => {
    try {
      console.log("id meet", myMeet.id);
      if (!myMeet?.id) {
        alert("No meeting selected");
        return;
      }
      console.log("Sending payload:", {
        work_Status: selectedReview,
      });
      const response = await axios.patch(`/mettings/work-status/${myMeet.id}`, {
        work_Status: selectedReview,
      });
      if (response.status === 200) {
        setToastMessage("Meeting Reviewed successfully!");
        setShowToast(true); // <-- Add this!
        setSeeMore(false);
        setRefreshKey((prev) => prev + 1);
        setReviewVerf(false);
      }
    } catch (error) {
      console.error("Error updating review status:", error);
      alert("Failed to update review status");
    }
  };
  const [selectedReview, setSelectedReview] = useState(ReviewStatus.APPROVED);
  // Refs for file inputs
  const techSheetRef = useRef(null);
  const supportRef = useRef(null);
  const reviewRef = useRef(null);

  // State variables

  const [reviewverf, setReviewVerf] = useState(null);
  const navigate = useNavigate();

  // File states

  const [toastMessage, setToastMessage] = useState("");

  // Initialize files from API data
  useEffect(() => {
    if (myMeet) {
      setObjectFile(myMeet.Meeting_objectives_files || null);
      setSupportFile(myMeet.Support_files || null);
      setPvFile(myMeet.Meeting_pv_files || null);
      setDeliverablesFile(myMeet.Team_deliverables_files || null);
      setReviewFile(myMeet.My_review_for_deliverables_files || null);
    }
  }, [myMeet, refreshKey]);

  // Generic file upload handler
  const handleFileUpload = (event, setFileState) => {
    const file = event.target.files[0];
    if (file?.type === "application/pdf") {
      setFileState(file);
      console.log("the selected file ", file);
    } else {
      alert("Please upload a valid PDF file.");
    }
  };

  // Handlers for each file type
  const handleTechSheetChange = (e) => handleFileUpload(e, setObjectFile);
  const handleSupportChange = (e) => handleFileUpload(e, setSupportFile);
  const handleReviewChange = (e) => handleFileUpload(e, setReviewFile);

  const [pvFile, setPvFile] = useState(false);
  const [deliverablesFile, setDeliverablesFile] = useState(false);

  return (
    <div style={{ height: "75%", overflowY: "auto", paddingRight: "8px" }}>
      {/* Modal overlay code remains the same */}

      <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
        {/* Starting Files Section */}
        <div
          style={{
            fontWeight: 600,
            fontSize: "1.4rem",
            marginLeft: "1.4rem",
            color: "#313638",
          }}
        >
          Starting files
        </div>

        {/* Meeting Objectives */}
        <div
          style={{
            display: "flex",
            flexDirection: "row",
            paddingLeft: "1.4rem",
            paddingRight: "1.4rem",
            borderBottom: "2px solid #dde2e4",
          }}
        >
          <div className="info-section">
            <p className="ttl-at">Meeting objectives</p>
            <p className="infos-at">
              Upload the technical sheet (PDF format) to outline meeting goals
              and agenda.
            </p>
          </div>
          <div className="form-section">
            {!review && (
              <Uploadfile
                type="pdf"
                handlePresentationChange={handleTechSheetChange}
                presentationFile={objfile}
                presentationRef={techSheetRef}
              />
            )}
            {review && (
              <Uploadfile type="pdf" pdfFil={objfile} status={false} />
            )}
          </div>
        </div>
        {/* Support Files */}
        <div
          style={{
            display: "flex",
            flexDirection: "row",
            paddingLeft: "1.4rem",
            paddingRight: "1.4rem",
            borderBottom: "2px solid #dde2e4",
          }}
        >
          <div className="info-section">
            <p className="ttl-at">Support files</p>
            <p className="infos-at">
              Schedule a New Meeting: Set the date, time, objectives, and room
              to plan your next supervision session.
            </p>
          </div>
          <div className="form-section">
            {review && supportfile && (
              <Uploadfile type="pdf" pdfFil={supportfile} />
            )}
            {!review && (
              <Uploadfile
                type="pdf"
                handlePresentationChange={handleSupportChange}
                presentationFile={supportfile}
                presentationRef={supportRef}
              />
            )}
          </div>
        </div>

        {/* Conditional Review Sections */}
        {review && (
          <>
            {/* Team Deliverables */}
            <div
              style={{
                display: "flex",
                flexDirection: "row",
                paddingLeft: "1.4rem",
                marginTop: "1.4rem",
                borderBottom: "2px solid #dde2e4",
              }}
            >
              <div className="form-section">
                <Uploadfile
                  type="pdf"
                  pdfFil={deliverablesFile}
                  status={false}
                />
              </div>
              <div
                style={{
                  paddingRight: "1.4rem",
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "flex-end",
                  marginLeft: "auto",
                  maxWidth: "350px",
                }}
              >
                <p
                  className="ttl-at"
                  style={{ fontWeight: "bold", textAlign: "right" }}
                >
                  Team deliverables
                </p>
                <p className="infos-at" style={{ textAlign: "right" }}>
                  Upload the team's completed deliverables and project
                  artifacts.
                </p>
              </div>
            </div>

            {/* My Review for Deliverables */}
            <div
              style={{
                marginTop: "1.4rem",
                display: "flex",
                flexDirection: "row",
                paddingLeft: "1.4rem",
                paddingRight: "1.4rem",
                borderBottom: "2px solid #dde2e4",
              }}
            >
              <div className="info-section">
                <p className="ttl-at">My review for deliverables</p>
                <p className="infos-at">
                  Upload your evaluation and feedback for the team's
                  deliverables.
                </p>
              </div>
              <div className="form-section">
                {deliverablesFile && (
                  <Uploadfile
                    type="pdf"
                    presentationFile={reviewfile}
                    presentationRef={reviewRef}
                    handlePresentationChange={
                      handleReviewChange // <-- pass the event here
                    }
                  />
                )}{" "}
                {!deliverablesFile && (
                  <div className="nonextmeet">
                    <p
                      className="review-title"
                      style={{
                        fontWeight: "bold",
                        color: "#313638", // red tone
                        fontSize: "18px",
                        marginBottom: "8px",
                        textTransform: "uppercase",
                      }}
                    >
                      important!!
                    </p>
                    <div
                      className="review-status"
                      style={{
                        padding: "10px",
                        borderRadius: "6px",
                        color: "#313638",
                        fontSize: "15px",
                      }}
                    >
                      You can't upload a review until your team uploads the
                      deliverables
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Meeting PV */}
            <div
              style={{
                marginTop: "1.4rem",
                display: "flex",
                flexDirection: "row",
                paddingLeft: "1.4rem",
                borderBottom: "2px solid #dde2e4",
              }}
            >
              <div className="form-section">
                {reviewfile && (
                  <Uploadfile type="pdf" pdfFil={pvFile} status={false} />
                )}{" "}
                {!reviewfile && (
                  <div className="nonextmeet">
                    <p
                      className="review-title"
                      style={{
                        fontWeight: "bold",
                        color: "#313638", // red tone
                        fontSize: "18px",
                        marginBottom: "8px",
                        textTransform: "uppercase",
                      }}
                    >
                      important!!
                    </p>
                    <div
                      className="review-status"
                      style={{
                        padding: "10px",
                        borderRadius: "6px",
                        color: "#313638",
                        fontSize: "15px",
                      }}
                    >
                      no meeting pv until the required files have been uploaded
                      .
                    </div>
                  </div>
                )}
              </div>
              <div
                style={{
                  paddingRight: "1.4rem",
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "flex-end",
                  marginLeft: "auto",
                  maxWidth: "350px",
                }}
              >
                <p
                  className="ttl-at"
                  style={{ fontWeight: "bold", textAlign: "right" }}
                >
                  Meeting PV
                </p>
                <p className="infos-at" style={{ textAlign: "right" }}>
                  Upload the official meeting minutes (procès-verbal) document.
                </p>
              </div>
            </div>
          </>
        )}
      </div>
      {reviewverf && (
        <ModalOverlay $show={reviewverf}>
          <ModalContent>
            <h2
              style={{ marginBottom: "24px", fontSize: "20px", color: "#333" }}
            >
              Review the meeting
            </h2>

            <WarningText>
              By reviewing this meeting, it will go to history list, no edits or
              uploads are allowed after that. This review can affect the
              soundness in future time.
            </WarningText>

            <ReviewSection>
              <ReviewTitle>Review</ReviewTitle>
              <div
                style={{ display: "flex", alignItems: "center", gap: "8px" }}
              >
                <select
                  value={selectedReview}
                  onChange={(e) => setSelectedReview(e.target.value)}
                  style={{
                    padding: "8px 12px",
                    borderRadius: "4px",
                    border: "1px solid #ddd",
                    width: "100%",
                  }}
                >
                  {Object.values(ReviewStatus).map((status) => (
                    <option key={status} value={status}>
                      {status}
                    </option>
                  ))}
                </select>
                <StatusBadge $status={selectedReview}>
                  {selectedReview}
                </StatusBadge>
              </div>
            </ReviewSection>

            <ButtonGroup>
              <Button onClick={() => setReviewVerf(false)}>Cancel</Button>
              <Button $primary onClick={() => handleReview()}>
                Start
              </Button>
            </ButtonGroup>
          </ModalContent>
        </ModalOverlay>
      )}

      {/* Buttons */}
      {review && myMeet ? (
        !myMeet.work_Status ? (
          <div className="onleft">
            <button
              className="btns-giant"
              onClick={() => {
                if (!pvFile || !reviewfile || !deliverablesFile) {
                  setToastMessage(
                    "you cant reviw the meet until all required files are uploaded"
                  );
                  setShowToast(true); // <-- Add this!
                } else {
                  setReviewVerf(true);
                }
              }}
              style={{
                width: "349px",
                background:
                  !pvFile || !reviewfile || !deliverablesFile
                    ? "#ccc"
                    : "#077ED4",
                color: "white",
                cursor:
                  !pvFile || !reviewfile || !deliverablesFile
                    ? "not-allowed"
                    : "pointer",
              }}
            >
              <p className="managebtns-text-at-s">Review Meeting</p>
            </button>
            {deliverablesFile && !pvFile && (
              <button
                onClick={() => {
                  handleEditMeetingg();
                }}
                className="btns-giant"
                style={{
                  width: "349px",
                  background: "##077ED4",
                  color: "white",
                  cursor: "pointer",
                }}
              >
                <p className="managebtns-text-at-s">Send Files</p>
              </button>
            )}
          </div>
        ) : (
          <div className="nonextmeet">
            <p className="review-title">Meeting review</p>
            <div className="review-status">{myMeet.work_Status}</div>
          </div>
        )
      ) : null}
      {showToast && (
        <Toast message={toastMessage} onClose={() => setShowToast(false)} />
      )}
    </div>
  );
};

export default TeacherSeeMore;
