import React, { useState } from 'react';
import upload from '../assets/upload.svg';
import add from '../assets/addUpload.svg';
import Style from '../styles/StudentPrefrencesTab.module.css';

export default function MotivationCard() {
  const [fileName, setFileName] = useState('');

  const handleFileChange = (event) => {
    const files = event.target.files;
    if (files.length > 0) {
      setFileName(files[0].name); 
      console.log('Selected file:', files[0].name);
    }
  };

  return (
    <div className={Style['motivation-card']}>
      <div className={Style['left-side']}>
        <div className={Style['motivation-header']}>
          <h3>Motivation Letter</h3>
        </div>
        <p className={Style['motivation-text']}>
          Upload the Motivation letter to increase your chances to be accepted by the supervisors
        </p>
      </div>
      <div className={Style['right-side']}>
        <label htmlFor="motivation-upload" className={Style['upload-area']}>
          <span className={Style['upload-icon']}>
            <img src={upload} alt="upload" style={{ height: '2rem' }} />
          </span>
          <span className={Style['upload-label']}>
            Browse and choose the file you want to upload from your computer
          </span>
          <input
            type="file"
            id="motivation-upload"
            className={Style['upload-input']}
            onChange={handleFileChange}
          />
          {fileName ? (
            <span className={Style['file-name']}>{fileName}</span>
          ) : (
            <img src={add} alt="add" style={{ height: '2.4rem', marginTop: '1rem' }} />
          )}
        </label>
      </div>
    
    </div>
);
}
