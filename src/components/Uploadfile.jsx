import React, { useState, useRef } from "react";
import Module from "../styles/StudentMeetingPage.module.css";
import FileIcon from "../assets/fileIcon.svg";
import ArrowIcon from "../assets/expand_less_black.svg";
import upload from '../assets/upload.svg';
import add from '../assets/addUpload.svg';
export function TeachergetUploadfile({ title, dic, pdfFile, }) {



  return (
    <div style={{ display: "flex", flexDirection: "row", marginTop: "3vh", alignItems: "flex-end", borderBottom: "2px solid #dde2e4", paddingBottom: "2vh" }}>
      {console.log(pdfFile)}
      {pdfFile === undefined ? (
        <div >
          <a href={pdfFile} download className={Module["technical-sheet"]} style={{ marginLeft: "3vw" }}>
            <div className={Module["technical-sheet-info"]}>

              <div >
                <span className={Module["file-name"]} >No support files uploaded</span>
              </div>
            </div>
          </a>
        </div>
      ) : (
        <div style={{ marginLeft: "3vw" }}>
          <a href={pdfFile} download className={Module["technical-sheet"]}>
            <div className={Module["technical-sheet-info"]}>
              <img src={FileIcon} alt="PDF Icon" className={Module["file-icon"]} />
              <div>
                <span className={Module["file-name"]}>TechnicalSheet.pdf</span>
                <span className={Module["file-size"]}>Size not available</span>
              </div>
            </div>
            <img src={ArrowIcon} alt="Expand Arrow" className={Module["arrow-icon"]} />
          </a>
        </div>
      )}

      <div className={Module["UploadRight-side"]} style={{ marginLeft: "auto", maxWidth: "23vw", marginRight: "4vw" }}>
        <div className={Module["Left-side-header"]}>
          {title}
        </div>
        <div className={Module["Left-side-body"]}>
          {dic}
        </div>
      </div>

    </div>
  );
}


export function StudentUploadfile({ title, dic, pdfFile }) {

  const [fileName, setFileName] = useState('');
  const fileInputRef = useRef(null); // Create a ref for the hidden input :contentReference[oaicite:0]{index=0}

  const handleFileChange = (event) => {
    const files = event.target.files;
    if (files.length > 0) {
      setFileName(files[0].name);
      console.log('Selected file:', files[0].name);

    }
  };

  const handleUploadClick = () => {
    // Trigger the hidden input’s click() method
    fileInputRef.current.click(); // (DOM method) :contentReference[oaicite:1]{index=1}
  };


  return (
    <div style={{ display: "flex", flexDirection: "row", marginTop: "3vh", alignItems: "flex-end", borderBottom: "2px solid #dde2e4", paddingBottom: "2vh" }}>


      <div className={Module["UploadRight-side"]} style={{ marginRught: "auto", maxWidth: "23vw", marginLeft: "4vw" }}>
        <div className={Module["Left-side-header"]}>
          {title}
        </div>
        <div className={Module["Left-side-body"]}>
          {dic}
        </div>
      </div>
      <div className={Module['left-upload-side']}>
        {fileName && (<div>

          <div>
            <button className={Module["SeeBtn"]} style={{padding:"8px 25px" ,marginBottom:"5px"}}onClick={handleUploadClick}> 
                Edit
            </button>
          </div>
        </div>)}
        <div
          className={Module['upload-area']}
          onClick={handleUploadClick}
          style={{ cursor: 'pointer' }}
        >
          <img src={upload} alt="upload" className={Module['upload-icon']} />
          <span className={Module['upload-label']}>
            {fileName
              ? fileName
              : 'Browse and choose the file you want to upload from your computer'}
          </span>
          {!fileName && (
            <img src={add} alt="add" style={{ height: '2.4rem', marginTop: '1rem' }} />
          )}
        </div>
        <input
          type="file"
          accept=".pdf,.doc,.docx"
          ref={fileInputRef}
          onChange={handleFileChange}
          style={{ display: 'none' }} // hide the real input
        />
      </div>

    </div>
  );

}



