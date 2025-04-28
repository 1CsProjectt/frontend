import React, { useState } from "react";
import Upload from "../../assets/upload.svg";
import "../../styles/addtopic.css";
import Module from "../../styles/StudentMeetingPage.module.css";
import FileIcon from "../../assets/fileIcon.svg";
import ArrowIcon from "../../assets/expand_less_black.svg";

const Uploadbox = ({
  handlePresentationChange,
  presentationFile,
  presentationRef,
  type,
  pdfFil,
  status = true,
}) => {
  const [showImagePreview, setShowImagePreview] = useState(false);

  const fileToDisplay = status && presentationFile ? presentationFile : pdfFil;

  const handleClick = (e) => {
    if (fileToDisplay === presentationFile && presentationRef?.current) {
      if (
        fileToDisplay instanceof File &&
        fileToDisplay.type.startsWith("image/")
      ) {
        e.preventDefault();
        setShowImagePreview(true);
      } else {
        e.preventDefault();
        presentationRef.current.click();
      }
    }
  };

  const handleEditClick = (e) => {
    e.stopPropagation();
    e.preventDefault();
    if (presentationRef?.current) {
      presentationRef.current.click();
    }
  };

  const getDisplayName = () => {
    if (!fileToDisplay) return "";

    if (fileToDisplay === presentationFile) {
      if (fileToDisplay instanceof File) {
        return fileToDisplay.name;
      }
      if (typeof fileToDisplay === "string") {
        return fileToDisplay.split("/").pop() || "Presentation";
      }
      return "Presentation";
    }
    return "TechnicalSheet.pdf";
  };

  const shouldRenderInput =
    status || (!!presentationFile && status !== undefined);

  return (
    <>
      {/* Conditionally render input only if shouldRenderInput is true */}
      {shouldRenderInput && (
        <input
          ref={presentationRef}
          type="file"
          accept={type === "pdf" ? "application/pdf" : "image/png, image/jpeg"}
          onChange={handlePresentationChange}
          style={{ display: "none" }}
        />
      )}

      {/* If status is false, always render A even if fileToDisplay is null */}
      {status === false ? (
        <div className="file-container" style={{ position: "relative" }}>
          <a
            href={fileToDisplay || "#"}
            target="_blank"
            rel="noopener noreferrer"
            className="technical-sheet-a"
            style={{ cursor: fileToDisplay ? "pointer" : "not-allowed" }}
            onClick={(e) => {
              if (!fileToDisplay) e.preventDefault(); // Prevent broken links
            }}
          >
            <div className={Module["technical-sheet-info"]}>
              <img
                src={FileIcon}
                alt="File Icon"
                className={Module["file-icon"]}
              />
              <div>
                <span className={Module["file-name"]}>
                  {getDisplayName() || "No file available"}
                </span>
                <span className={Module["file-size"]}>
                  {fileToDisplay instanceof File
                    ? `${Math.round(fileToDisplay.size / 1024)} KB`
                    : "Size not available"}
                </span>
              </div>
            </div>
            <img
              src={ArrowIcon}
              alt="Expand Arrow"
              className={Module["arrow-icon"]}
            />
          </a>
        </div>
      ) : fileToDisplay ? (
        <div className="file-container" style={{ position: "relative" }}>
          {/* Edit Button */}
          {presentationFile &&
            fileToDisplay === presentationFile &&
            !showImagePreview && (
              <button
                onClick={handleEditClick}
                style={{
                  position: "absolute",
                  right: 0,
                  top: 0,
                  width: "79px",
                  background: "#F1F1F1",
                  border: "1px solid #D0D5DD",
                  borderRadius: "4px",
                  cursor: "pointer",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  height: "39px",
                  zIndex: 2,
                  padding: "5px",
                  color: "#344054",
                }}
              >
                <span>Edit</span>
              </button>
            )}

          {/* File Link */}
          <a
            href={
              fileToDisplay instanceof File
                ? URL.createObjectURL(fileToDisplay)
                : fileToDisplay
            }
            target="_blank"
            rel="noopener noreferrer"
            className="technical-sheet"
            style={{ cursor: "pointer" }}
          >
            <div className={Module["technical-sheet-info"]}>
              <img
                src={FileIcon}
                alt="File Icon"
                className={Module["file-icon"]}
              />
              <div>
                <span className={Module["file-name"]}>{getDisplayName()}</span>
                <span className={Module["file-size"]}>
                  {fileToDisplay instanceof File
                    ? `${Math.round(fileToDisplay.size / 1024)} KB`
                    : "Size not available"}
                </span>
              </div>
            </div>
            <img
              src={ArrowIcon}
              alt="Expand Arrow"
              className={Module["arrow-icon"]}
            />
          </a>
        </div>
      ) : (
        <div className="upload-box">
          <img src={Upload} alt="Upload" className="upload-image" />
          <p className="msg-at">
            {type === "pdf"
              ? "Browse and choose a file (PDF)"
              : "Browse and choose an image"}
          </p>
          <button
            className="upload-btn"
            onClick={() => presentationRef?.current?.click()}
          >
            +
          </button>
        </div>
      )}
    </>
  );
};

export default Uploadbox;
