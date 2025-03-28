import React, { useState } from "react";
import classes from "../styles/SessionsManagementTabs.module.css";
import NavBar from "./NavBar.jsx";
import StartNewSessionModal from "./modals/StartNewSessionModal.jsx";


const SessionsManagementTabs = () => {
  const [activeTab, setActiveTab] = useState("Topic Submission Session");


  const [isModalOpen, setIsModalOpen] = useState(false);


  const tabs = [
    "Topic Submission Session",
    "Team Formation Session",
    "Select Topics Session",
    "Project Realization Session",
  ];

  return (
    <div className={classes["main-wrapper"]}>
      <NavBar />
      <div className={classes["tabs-container"]}>
        {/* Tabs Navigation */}
        <div className={classes["tabs"]}>
          {tabs.map((tab) => (
            <button
              key={tab}
              className={activeTab === tab ? classes["active"] : ""}
              onClick={() => setActiveTab(tab)}
            >
              {tab}
            </button>
          ))}
        </div>

        {/* Tabs Content */}
        <div className={classes["tab-content"]}>
          {activeTab === "Topic Submission Session" && (
            <div className={classes["main-container"]}>
              {/* Start New Session Section */}
              <div className={classes["section-container"]}>
                <div className={classes["text-container"]}>
                  <h2>Start new session</h2>
                  <p>
                    Easily create and customize new sessions with full<br/>
                    controlover settings. Tailor each session to meet<br/>
                    your needs and ensure a seamless experience.
                  </p>
                </div>
                <div className={classes["inner-flexbox"]}>
                <div className={classes["table-container"]}>
                  <table>
                    <thead>
                      <tr>
                        <th>Grade</th>
                        <th>Max members</th>
                        <th>From-To</th>
                        <th></th>
                      </tr>
                    </thead>
                    <tbody>
                      {["2CPI", "1CS", "2CS"].map((grade, index) => (
                        <tr key={index}>
                          <td>{grade}</td>
                          <td>05</td>
                          <td>21/3 - 28/3</td>
                          <td>
                            <button className={classes["edit-btn"]}>Edit</button>
                            <button className={classes["cancel-btn"]}>Cancel</button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
                <button className={classes["primary-btn"]}  onClick={() => setIsModalOpen(true)}>Start new session</button>
                <StartNewSessionModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
                </div>
              </div>

              {/* Validate and Control Topics Section */}
              <div className={classes["section-container"]}>
                <div className={classes["text-container"]}>
                  <h2>Validate and Control topics</h2>
                  <p>
                    Make an informed choice: Validate, decline, or delete any
                    submitted PFE topic.
                  </p>
                </div>
                <button className={classes["validate-btn"]}>See topics</button>
              </div>
            </div>
          )}

          {activeTab === "Team Formation Session" && (
            <div>
              <h2>Team Formation</h2>
              <p>Form teams and assign roles...</p>
            </div>
          )}

          {activeTab === "Select Topics Session" && (
            <div>
              <h2>Select Topics</h2>
              <p>Choose your preferred topics...</p>
            </div>
          )}

          {activeTab === "Project Realization Session" && (
            <div>
              <h2>Project Realization</h2>
              <p>Manage project execution...</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default SessionsManagementTabs;