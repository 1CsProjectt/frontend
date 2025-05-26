import React, { useState, useRef } from "react";
import upload from "../assets/upload.svg";
import add from "../assets/addUpload.svg";
import Style from "../styles/StudentPrefrencesTab.module.css";

export default function MotivationCard({ onFileSelect }) {
  const [fileName, setFileName] = useState("");
  const fileInputRef = useRef(null); // Create a ref for the hidden input :contentReference[oaicite:0]{index=0}

  const handleFileChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      setFileName(file.name);
      console.log("Selected file:", file.name);
      onFileSelect(file); // correct: send the File object to parent
    }
  };

  const handleUploadClick = () => {
    // Trigger the hidden input’s click() method
    fileInputRef.current.click(); // (DOM method) :contentReference[oaicite:1]{index=1}
  };

  return (
    <div className={Style["motivation-card"]}>
      <div className={Style["left-side"]}>
        <div className={Style["motivation-header"]}>
          <h3>Motivation Letter</h3>
        </div>
        <p className={Style["motivation-text"]}>
          Upload the Motivation letter to increase your chances to be accepted
          by the supervisors
        </p>
      </div>
      <div className={Style["right-side"]}>
        <div
          className={Style["upload-area"]}
          onClick={handleUploadClick}
          style={{ cursor: "pointer" }}
        >
          <img src={upload} alt="upload" className={Style["upload-icon"]} />
          <span className={Style["upload-label"]}>
            {fileName
              ? fileName
              : "Browse and choose the file you want to upload from your computer"}
          </span>
          {!fileName && (
            <img
              src={add}
              alt="add"
              style={{ height: "2.4rem", marginTop: "1rem" }}
            />
          )}
        </div>
        <input
          type="file"
          accept=".pdf,.doc,.docx"
          ref={fileInputRef}
          onChange={handleFileChange}
          style={{ display: "none" }} // hide the real input
        />
      </div>
    </div>
  );
}
