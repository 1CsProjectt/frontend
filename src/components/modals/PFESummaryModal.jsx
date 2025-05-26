import React from "react";
import styles from "../../styles/PFESummaryModal.module.css";

const PFESummaryModal = ({ isOpen, onClose, PFEdata, teamData, operation }) => {
  if (!isOpen) return null;

  const renderAssignContent = () => (
    <>
      <h2 className={styles.title}>PFEs Assigned to Teams</h2>
      <p className={styles.message}>
        {PFEdata.count === 0 ? "PFEs are already assigned" : PFEdata.message}
      </p>
      <h3>{PFEdata.count} Teams affected</h3>

      <div className={styles.summaryList}>
        {Array.isArray(PFEdata.assigned) && PFEdata.assigned.map((item, index) => (
          <div key={index} className={styles.summaryCard}>
            <h3><strong>Team Number : </strong>{item.team.id}</h3>
            <p><strong>Grade:</strong> {item.year}</p>
            <p><strong>PFE Title:</strong> {item.pfe.title}</p>
            {item.specialization && (
              <p><strong>Specialization:</strong> {item.specialization}</p>
            )}
          </div>
        ))}
      </div>
    </>
  );

  const renderOrganizeContent = () => (
    <>
      <h2 className={styles.title}>Students Organized into Teams</h2>
      <p className={styles.message}>{teamData.message}</p>
      
  
      {/* Created Teams */}
      {Array.isArray(teamData.createdTeams) && teamData.createdTeams.length > 0 && (
        <>
          <h3 className={styles.subTitle}>Created Teams</h3>
          <div className={styles.summaryList}>
            {teamData.createdTeams.map((team, index) => (
              <div key={index} className={styles.summaryCard}>
                <p><strong>Team Number:</strong> {team.id}</p>
                {/* <p><strong>Name:</strong> {team.name}</p> */}
              </div>
            ))}
            <br/>
          </div>
        </>
      )}
  
      {/* Student Assignments */}
      {Array.isArray(teamData.studentAssignments) && teamData.studentAssignments.length > 0 && (
        <>
          <h3 className={styles.subTitle}>Student Assignments</h3>
          <div className={styles.summaryList}>
            {teamData.studentAssignments.map((item, index) => (
              <div key={index} className={styles.summaryCard}>
                <p><strong>Student ID:</strong> {item.studentId}</p>
                <p><strong>Student Name:</strong> {item.studentName}</p>
                <p><strong>Moved To Team number:</strong> {item.teamId}</p>
                {/* <p><strong>Team Name:</strong> {item.teamName}</p> */}
                <p><strong>Year:</strong> {item.year}</p>
                <p><strong>Speciality:</strong> {item.specialite}</p>
              </div>
            ))}
            <br/>
          </div>
        </>
      )}
  
      {/* Deleted Teams */}
      {Array.isArray(teamData.deletedTeams) && teamData.deletedTeams.length > 0 && (
        <>
          <h3 className={styles.subTitle}>Deleted Teams</h3>
          <div className={styles.summaryList}>
            {teamData.deletedTeams.map((team, index) => (
              <div key={index} className={styles.summaryCard}>
                <p><strong>Team Number :</strong> {team.id}</p>
                {/* <p><strong>Name:</strong> {team.name}</p> */}
              </div>
            ))}
          </div>
        </>
      )}
    </>
  );
  

  return (
    <div className={styles.modalBackdrop}>
      <div className={styles.modalContent}>
        <button className={styles.closeButton} onClick={onClose}>×</button>
        {operation === "assign" && PFEdata && renderAssignContent()}
        {operation === "organize" && teamData && renderOrganizeContent()}
      </div>
    </div>
  );
};

export default PFESummaryModal;
