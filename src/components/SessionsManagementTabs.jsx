import React, { useState ,useEffect } from "react";
import classes from "../styles/SessionsManagementTabs.module.css";
import NavBar from "./NavBar.jsx";
import StartNewSessionModal from "./modals/StartNewSessionModal.jsx";
import { useNavigate } from "react-router-dom";
import { useSharedState } from '../contexts/SharedStateContext'; // Import the custom hook
import axios from "axios";
import TopicsValidationPage from "../Pages/TopicsValidationPage.jsx";
import EditExistingSessionModal from "./modals/EditExistingSessionModal.jsx";
import { PulseLoader } from "react-spinners"; 
import alertIcon from "../assets/alert-icon.svg";
import errorIcon from "../assets/error-icon.svg";
import DeleteUserModal from "./modals/DeleteUserModal.jsx";
import { Outlet } from "react-router-dom";
import Toast from "../components/modals/Toast";

const SessionsManagementTabs = () => {
  const {sessionsPageActiveTab, setSessionsPageActiveTab} = useSharedState();
  const navigate = useNavigate();
  const [sessionsArray,setSessionsArray] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [sessionToUpdate,setSessionToUpdate] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isDeleteUserModalOpen,setDeleteUserModalOpen] = useState(false);
  const [sessionIDtoDelete,setSessionIDtoDelete] = useState(null);
  const [toastMessage, setToastMessage] = useState("");
  const [showToast, setShowToast] = useState(false);
  const tabs = [
    "Topic Submission Session",
    "Team Formation Session",
    "Select Topics Session",
    "Project Realization Session",
  ];
/* 
  {
    "status": "success",
    "data": {
        "events": [
            {
                "id": 1,
                "name": "PFE_SUBMISSION",
                "startTime": "2025-04-15T00:00:00.000Z",
                "endTime": "2025-04-19T00:00:00.000Z",
                "year": "1CS",
                "maxNumber": null,
                "createdAt": "2025-04-15T10:39:37.073Z",
                "updatedAt": "2025-04-15T10:39:37.073Z"
            },
            {
                "id": 2,
                "name": "PFE_SUBMISSION",
                "startTime": "2025-04-15T00:00:00.000Z",
                "endTime": "2025-04-30T00:00:00.000Z",
                "year": "2CS",
                "maxNumber": null,
                "createdAt": "2025-04-15T10:56:03.516Z",
                "updatedAt": "2025-04-15T10:56:03.516Z"
            }
        ]
    }
} */
    const tabToSessionType = {
      "Topic Submission Session": "PFE_SUBMISSION",
      "Team Formation Session": "TEAM_CREATION",  
      "Select Topics Session": "PFE_ASSIGNMENT",
      "Project Realization Session": "WORK_STARTING",
    };

  useEffect(() => {
    const fetchSessions = async () => {
      setLoading(true); 
      try {
        const res = await axios.get(
          "/session/allevents", {
            withCredentials: true
          }
        );
        setSessionsArray(res.data.data.events);
        console.log(res.data.data.events);
      } catch (err) {
        const msg = err.response?.data?.message || err.message;
      
        setError(msg);
      } finally {
        setLoading(false);
      }
    };

    fetchSessions();
  }, []);

  
  return (
    <div className={classes["main-wrapper"]}>

      <NavBar />
      <StartNewSessionModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} sessionsPageActiveTab={sessionsPageActiveTab} setShowToast={setShowToast} setToastMessage={setToastMessage}/>
      <div className={classes["tabs-container"]}>
        
        <h1>Sessions Management</h1>
        {/* Tabs Navigation */}
        <div className={classes["tabs"]}>
          {tabs.map((tab) => (
            <button
              key={tab}
              className={sessionsPageActiveTab === tab ? classes["active"] : ""}
              onClick={() => setSessionsPageActiveTab(tab)}
            >
              {tab}
            </button>
          ))}
        </div>

        {/* Tabs Content */}
        <div className={classes["tab-content"]}>
          {sessionsPageActiveTab === "Topic Submission Session" && (
            <div className={classes["main-container"]}>
              {/* Start New Session Section */}
              <div className={classes["upper-section-container"]}>
                <div className={classes["text-container"]}>
                  <h2>Start new session</h2>
                  <p>
                    Easily create and customizenew sessions with full
                    controlover settings. Tailor each session to meet
                    your needs and ensure a seamless experience.
                  </p>
                </div>
                <div className={classes["inner-flexbox"]}>
                <div className={classes["table-container"]}>
                <table>
                  <thead>
                    <tr>
                      <th>Session ID</th>
                      {/* <th>Max members</th> */}
                      <th>From-To</th>
                      <th></th>
                    </tr>
                  </thead>
                  <tbody>
  {loading ? (
    <tr>
      <td colSpan={3}>
        <div className={classes.loaderContainer}>
          <div className={classes.loader}>
            <PulseLoader color="#077fd4" loading={loading} size={20} />
          </div>
        </div>
      </td>
    </tr>
  ) : error ? (
    <tr>
      <td colSpan={3}>
        <div className={classes.alertDiv}>
          <img src={errorIcon} alt="Error Icon" />
          <h3>Error connecting to the server</h3>
        </div>
      </td>
    </tr>
  ) : sessionsArray.filter(session => session.name === tabToSessionType[sessionsPageActiveTab]).length === 0 ? (
    <tr>
      <td colSpan={3}>
        <div className={classes.alertDiv}>
          <img src={alertIcon} alt="Alert Icon" />
          <h3>No Sessions were founds</h3>
        </div>
      </td>
    </tr>
  ) : (
    sessionsArray
      .filter(session => session.name === tabToSessionType[sessionsPageActiveTab])
      .map((session, index) => (
        <tr key={index}>
          <td>{session.id}</td>
          <td>
            {new Date(session.startTime).toLocaleDateString()} -{" "}
            {new Date(session.endTime).toLocaleDateString()}
          </td>
          <td>
            <button
              className={classes["edit-btn"]}
              onClick={() => {
                console.log(session);
                session.year = "1CS";
                setSessionToUpdate(session);
                setIsEditModalOpen(true);
              }}
            >
              Edit
            </button>
            <button className={classes["cancel-btn"]}onClick={() => {console.log(session);
                          setSessionIDtoDelete(session.id);
                        
                            setDeleteUserModalOpen(true);}}>Delete</button>
          </td>
        </tr>
      ))
  )}
</tbody>

                </table>
              </div>
              <button className={classes["primary-btn"]}  onClick={() => {console.log("current operation " + sessionsPageActiveTab);setIsModalOpen(true)}}>Start new session</button>
               
                </div>
              </div>

              {/* Validate and Control Topics Section */}
              <div className={classes["lower-section-container"]}>
                <div className={classes["text-container"]}>
                  <h2>Validate and Control topics</h2>
                  <p>
                    Make an informed choice: Validate, decline, or delete
                    any submitted PFE topic.
                  </p>
                </div>
                <button className={classes["edit-teams-btn"]}   onClick={() =>  navigate("/admin/sessions/topic-validation")} >See topics</button>
              </div>
            </div>
          )}

          {sessionsPageActiveTab === "Team Formation Session" && (
            
            <div className={classes["main-container"]}>
            {/* Start New Session Section */}
            <div className={classes["upper-section-container"]}>
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
                  {loading ? (
                        <tr>
                          <td colSpan={4}>
                            <div className={classes.loaderContainer}>
                              <div className={classes.loader}>
                                <PulseLoader color="#077fd4" loading={loading} size={20} />
                              </div>
                            </div>
                          </td>
                        </tr>
                      ) : error ? (
                        <tr>
                          <td colSpan={4}>
                            <div className={classes.alertDiv}>
                              <img src={errorIcon} alt="Error Icon" />
                              <h3>Error connecting to the server</h3>
                            </div>
                          </td>
                        </tr>
                      ) : sessionsArray.filter(session => session.name === tabToSessionType[sessionsPageActiveTab]).length === 0 ? (
                        <tr>
                          <td colSpan={4}>
                            <div className={classes.alertDiv}>
                              <img src={alertIcon} alt="Alert Icon" />
                              <h3>No Sessions were founds</h3>
                            </div>
                          </td>
                        </tr>
                      ) : (
                  
                    sessionsArray
                    .filter(session => session.name === tabToSessionType[sessionsPageActiveTab])
                    .map((session, index) => (
                      <tr key={index}>
                        <td>{session.year}</td>
                        <td>{session.maxNumber ?? "N/A"}</td>
                        <td>
                          {new Date(session.startTime).toLocaleDateString()} -{" "}
                          {new Date(session.endTime).toLocaleDateString()}
                        </td>
                        <td>
                          <button className={classes["edit-btn"]} onClick={() => {console.log(session);
                          setSessionToUpdate(session);
                        
                            setIsEditModalOpen(true);}}
                            >Edit</button>
                          <button className={classes["cancel-btn"]}onClick={() => {console.log(session);
                          setSessionIDtoDelete(session.id);
                        
                            setDeleteUserModalOpen(true);}}>Delete</button>
                        </td>
                      </tr>
                  )))}
                  </tbody>
                </table>
              </div>
              <button className={classes["primary-btn"]}  onClick={() => {console.log("current operation " + sessionsPageActiveTab);setIsModalOpen(true)}}>Start new session</button>
              
              </div>
            </div>

            {/* Validate and Control Topics Section */}
            <div className={classes["lower-section-container"]}>
              <div className={classes["text-container"]}>
                <h2>Edit teams</h2>
                <p>
                Manage teams with ease. Add members, or remove them to keep <br/>
                 teams organized and running smoothly.
                </p>
              </div>
              <button className={classes["edit-teams-btn"]}   onClick={() => navigate("/admin/sessions/admin-team-formation")} >Edit teams</button>
            </div>
          </div>
          )}

          {sessionsPageActiveTab === "Select Topics Session" && (
            <div className={classes["main-container"]}>
            {/* Start New Session Section */}
            <div className={classes["upper-section-container"]}>
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
                    {/* <th>Max members</th> */}
                    <th>From-To</th>
                    <th></th>
                  </tr>
                </thead>
                <tbody>
                {loading ? (
                  <tr>
                    <td colSpan={3}>
                      <div className={classes.loaderContainer}>
                        <div className={classes.loader}>
                          <PulseLoader color="#077fd4" loading={loading} size={20} />
                        </div>
                      </div>
                    </td>
                  </tr>
                ) : error ? (
                  <tr>
                    <td colSpan={3}>
                      <div className={classes.alertDiv}>
                        <img src={errorIcon} alt="Error Icon" />
                        <h3>Error connecting to the server</h3>
                      </div>
                    </td>
                  </tr>
                ) : sessionsArray.filter(session => session.name === tabToSessionType[sessionsPageActiveTab]).length === 0 ? (
                  <tr>
                    <td colSpan={3}>
                      <div className={classes.alertDiv}>
                        <img src={alertIcon} alt="Alert Icon" />
                        <h3>No Sessions were founds</h3>
                      </div>
                    </td>
                  </tr>
                ) : (
                  sessionsArray
                  .filter(session => session.name === tabToSessionType[sessionsPageActiveTab])
                  .map((session, index) => (
                    <tr key={index}>
                      <td>{session.year}</td>
                   {/*    <td>{session.maxNumber ?? "N/A"}</td> */}
                      <td>
                        {new Date(session.startTime).toLocaleDateString()} -{" "}
                        {new Date(session.endTime).toLocaleDateString()}
                      </td>
                      <td>
                        <button className={classes["edit-btn"]} onClick={() => {
                console.log(session);
                setSessionToUpdate(session);
                
                setIsEditModalOpen(true);
              }}>Edit</button>
                        <button className={classes["cancel-btn"]}onClick={() => {console.log(session);
                          setSessionIDtoDelete(session.id);
                        
                            setDeleteUserModalOpen(true);}}>Delete</button>
                      </td>
                    </tr>
                )))}
                </tbody>
              </table>
            </div>
            <button className={classes["primary-btn"]}  onClick={() => {console.log("current operation " + sessionsPageActiveTab);setIsModalOpen(true)}}>Start new session</button>
             
              </div>
            </div>

            {/* Validate and Control Topics Section */}
            <div className={classes["lower-section-container"]}>
              <div className={classes["text-container"]}>
                <h2>Manage preferences lists and supervision</h2>
                <p>
                Administer user preference lists by adding,
                editing, or reordering items.
                </p>
              </div>
              <button className={classes["edit-teams-btn"]}   onClick={() =>  navigate("/admin/sessions/manage-preferences")} >Manage Preferences</button>
            </div>
          </div>
          )}

         
            {sessionsPageActiveTab === "Project Realization Session" && (
              <div className={classes["main-container"]}>
              {/* Start New Session Section */}
              <div className={classes["upper-section-container"]}>
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
                      {/* <th>Max members</th> */}
                      <th>From-To</th>
                      <th></th>
                    </tr>
                  </thead>
                  <tbody>
                  {loading ? (
                    <tr>
                      <td colSpan={3}>
                        <div className={classes.loaderContainer}>
                          <div className={classes.loader}>
                            <PulseLoader color="#077fd4" loading={loading} size={20} />
                          </div>
                        </div>
                      </td>
                    </tr>
                  ) : error ? (
                    <tr>
                      <td colSpan={3}>
                        <div className={classes.alertDiv}>
                          <img src={errorIcon} alt="Error Icon" />
                          <h3>Error connecting to the server</h3>
                        </div>
                      </td>
                    </tr>
                  ) : sessionsArray.filter(session => session.name === tabToSessionType[sessionsPageActiveTab]).length === 0 ? (
                    <tr>
                      <td colSpan={3}>
                        <div className={classes.alertDiv}>
                          <img src={alertIcon} alt="Alert Icon" />
                          <h3>No Sessions were founds</h3>
                        </div>
                      </td>
                    </tr>
                  ) : (
                    sessionsArray
                    .filter(session => session.name === tabToSessionType[sessionsPageActiveTab])
                    .map((session, index) => (
                      <tr key={index}>
                        <td>{session.year}</td>
                     {/*    <td>{session.maxNumber ?? "N/A"}</td> */}
                        <td>
                          {new Date(session.startTime).toLocaleDateString()} -{" "}
                          {new Date(session.endTime).toLocaleDateString()}
                        </td>
                        <td>
                          <button className={classes["edit-btn"]} onClick={() => {
                  console.log(session);
                  setSessionToUpdate(session);
                  
                  setIsEditModalOpen(true);
                }}>Edit</button>
                          <button className={classes["cancel-btn"]}onClick={() => {console.log(session);
                            setSessionIDtoDelete(session.id);
                          
                              setDeleteUserModalOpen(true);}}>Delete</button>
                        </td>
                      </tr>
                  )))}
                  </tbody>
                </table>
              </div>
              <button className={classes["primary-btn"]}  onClick={() => {console.log("current operation " + sessionsPageActiveTab);setIsModalOpen(true)}}>Start new session</button>
               
                </div>
              </div>
  
              {/* Validate and Control Topics Section */}
             
            </div>
            )}
        </div>
      </div>
      <Outlet />
      <DeleteUserModal isOpen={isDeleteUserModalOpen} onClose ={() => {setDeleteUserModalOpen(false)}} entityType={"session"} sessionIDtoDelete={sessionIDtoDelete} />
      <EditExistingSessionModal isOpen={isEditModalOpen} onClose={() => setIsEditModalOpen(false)} sessionsPageActiveTab={sessionsPageActiveTab} sessionToUpdate={sessionToUpdate} setShowToast={setShowToast}setToastMessage={setToastMessage}/>
      {showToast && (
          <Toast
            duration={5000}
            message={toastMessage || "Test Toast"}
            onClose={() => setShowToast(false)}
          />
        )}
    </div>
  );
};

export default SessionsManagementTabs;