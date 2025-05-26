// StudentPreferences.jsx
import React, { useState, useEffect } from "react";
import axios from "axios";
import Toast from "./modals/Toast";
import { useNavigate, useLocation } from "react-router-dom";
import {
  DndContext,
  closestCenter,
  PointerSensor,
  useSensor,
  useSensors,
} from "@dnd-kit/core";
import {
  SortableContext,
  verticalListSortingStrategy,
  useSortable,
  arrayMove,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import Style from "../styles/StudentPrefrencesTab.module.css";
import Module from "../styles/TeamFormationPage.module.css";
import MotivationCard from "./MotivationCard";
import SubmitModal from "./modals/submitModal";
import SuccessConfirmationModal from "./modals/SuccessConfirmationModal";

axios.defaults.withCredentials = true;

// A single sortable row component
const SortableRow = ({ item, submit, onRemove, preferencesList, sessionTitle, targetDate }) => {
  const navigate = useNavigate();

  const handleRemoveClick = () => {
    onRemove(item.topic_title);
  };

  const handleReadClick = (e, card) => {
    e.stopPropagation();
    navigate("/pfe-student/explore", { state: { card, sessionTitle, targetDate } });
  };

  const { attributes, listeners, setNodeRef, transform, transition } = useSortable({
    id: item.id,
    disabled: submit,
  });

  const style = { transform: CSS.Transform.toString(transform), transition };

  return (
    <tr ref={setNodeRef} style={style} className={Module["sortable-row"]}>
      <td
        {...attributes}
        {...listeners}
        style={{ cursor: submit ? "default" : "grab", pointerEvents: submit ? "none" : "auto" }}
      >
        {!submit && <span className={Module["drag-handle"]}>⋮⋮</span>}
      </td>
      <td>{item.order}</td>
      <td>{item.topic_title}</td>
      <td>{item.main_supervisor}</td>
      <td>
        {submit ? (
          <span
            style={{
              color:
                item.status === "REJECTED"
                  ? "#F9857A"
                  : item.status === "ACCEPTED"
                    ? "#68CD54"
                    : "inherit",
            }}
          >
            {item.card_info.supervisionRequests?.[0]?.status || "- - - - -"}
          </span>
        ) : (
          <>
            <button
              className={Style["Read-button"]}
              style={{ margin: "0 10px" }}
              onClick={(e) => handleReadClick(e, item.card_info)}
            >
              Read
            </button>
            <button
              className={Style["Remove-button"]}
              style={{ margin: "0 10px" }}
              onClick={handleRemoveClick}
            >
              Remove
            </button>
          </>
        )}
      </td>
    </tr>
  );
};

const StudentPreferences = ({ submit, sessionTitle, targetDate }) => {
  const [user] = useState(() => {
    const json = localStorage.getItem("user");
    return json ? JSON.parse(json) : {};
  });

  const team_id = user.team_id;
  const location = useLocation();
  const { addedTopic, removedTopic } = location.state || {};
  const [motivationFile, setMotivationFile] = useState(null);
  // Manage preferences locally
  const [preferencesList, setPreferencesList] = useState(() => {
    const stored = JSON.parse(localStorage.getItem("preferencesList")) || [];
    return stored;
  });

  // Handle add/remove from ExplorePage
  useEffect(() => {
    if (addedTopic) {
      setPreferencesList((prev) => {
        // Avoid duplicate adds
        if (prev.some((p) => p.id === addedTopic.id)) return prev;
        // Transform card into list entry
        const newItem = {
          id: addedTopic.id,
          topic_title: addedTopic.title || "",
          main_supervisor:
            addedTopic.supervisors && addedTopic.supervisors.length > 0
              ? `${addedTopic.supervisors[0].firstname} ${addedTopic.supervisors[0].lastname}`
              : "",
          status: "",
          card_info: addedTopic,
          order: String(prev.length + 1).padStart(2, "0"),
        };
        const next = [...prev, newItem];
        localStorage.setItem("preferencesList", JSON.stringify(next));
        window.history.replaceState({}, document.title);
        return next;
      });
    }
    if (removedTopic) {
      setPreferencesList((prev) => {
        const next = prev
          .filter((p) => p.id !== removedTopic.id)
          .map((p, idx) => ({
            ...p,
            order: String(idx + 1).padStart(2, "0"),
          }));
        localStorage.setItem("preferencesList", JSON.stringify(next));
        window.history.replaceState({}, document.title);
        return next;
      });
    }
  }, [addedTopic, removedTopic]);

  // Sync items state for drag-and-drop
  const [items, setItems] = useState(
    preferencesList.map((item, idx) => ({
      ...item,
      id: `${idx}-${item.order}`,
    }))
  );

  useEffect(() => {
    setItems(
      preferencesList.map((item, idx) => ({
        ...item,
        id: `${idx}-${item.order}`,
      }))
    );
  }, [preferencesList]);

  // Toast & Modals
  const [toastMessage, setToastMessage] = useState("");
  const [showToast, setShowToast] = useState(false);
  const [isToasterror, setIsToasterror] = useState(null);
  const [showSubmitModal, setShowSubmitModal] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);

  /*   const handleConfirmSubmit = () => {
      setShowSubmitModal(false);
  
      (async () => {
        if (!motivationFile) {
          return setToastMessage("Please upload your motivation letter first.");
        }
  
        const formData = new FormData();
        const pfeIdsArray = items.map((item) => item.card_info.id);
  
        //  Append each ID as an array element
        pfeIdsArray.forEach((id) => formData.append("pfeIds[]", id));
  
        formData.append("ML", motivationFile);
        console.log("Form data prepared:***********************************", motivationFile);
  
        try {
          const resp = await axios.post(
            "/preflist/approve",
            formData,
            {
              headers: {
                "Content-Type": "multipart/form-data"
              },
              withCredentials: true
            }
          );
  
          // (clear local storage)
          localStorage.removeItem("preferencesList");
  
          setPreferencesList([]);
          setItems([]);
          //   (refresh the page)
          window.location.reload();
        } catch (err) {
          setIsToasterror(true);
  
          setToastMessage(err.response?.data?.message || " failed. Please try again.");
          setShowToast(true);
        }
      })();
    };
  
  
    const handleSaveSubmit = async () => {
      // 1. Make sure a file was selected
      if (!motivationFile) {
        setIsToasterror(null);
  
        setToastMessage("Please upload your motivation letter first.");
        setShowToast(true);
        return;
      }
  
      try {
        // 2. Build FormData
        const formData = new FormData();
        items.forEach(item => {
          formData.append("pfeIds[]", item.card_info.id);
        });
        formData.append("ML", motivationFile);  // motivationFile is a single File object
  
        console.log("Form data prepared:", motivationFile);
  
        // 3. Send to server
        const resp = await axios.post(
          "/preflist/create",
          formData,
          {
            headers: { "Content-Type": "multipart/form-data" },
            withCredentials: true
          }
        );
  
        // 4. On success
        console.log("Server Save response:", resp.data);
        setIsToasterror(null);
  
        setToastMessage("Your list has been saved successfully.");
        setShowToast(true);
  
        // 5. Save local copy
        const storedPrefs = items.map((item, idx) => ({
          ...item,
          order: String(idx + 1).padStart(2, "0"),
        }));
        localStorage.setItem("preferencesList", JSON.stringify(storedPrefs));
  
      } catch (err) {
        setIsToasterror(true);
  
        setToastMessage(err.response?.data?.message || " failed. Please try again.");
        setShowToast(true);
      }
    };
   */
  // 1. Make handleSaveSubmit return a Promise that resolves on success or rejects on error
  const handleSaveSubmit = async () => {
    if (!motivationFile) {
      setIsToasterror(true);
      setToastMessage("Please upload your motivation letter first.");
      setShowToast(true);
      throw new Error("No motivation file"); // reject so confirm won't run
    }

    const formData = new FormData();
    items.forEach(item => formData.append("pfeIds[]", item.card_info.id));
    formData.append("ML", motivationFile);

    console.log("Form data prepared:", motivationFile);

    const resp = await axios.post("/preflist/create", formData, {
      headers: { "Content-Type": "multipart/form-data" },
      withCredentials: true
    });

    console.log("Server Save response:", resp.data);
    setIsToasterror(false);
    setToastMessage("Your list has been saved successfully.");
    setShowToast(true);

    const storedPrefs = items.map((item, idx) => ({
      ...item,
      order: String(idx + 1).padStart(2, "0")
    }));
    localStorage.setItem("preferencesList", JSON.stringify(storedPrefs));

    return resp.data; // resolve with server response
  };

  // 2. Make handleConfirmSubmit call handleSaveSubmit first
  const handleConfirmSubmit = async () => {
    setShowSubmitModal(false);

    try {
      // wait for the save to finish
      await handleSaveSubmit();

      if (!motivationFile) {
        // this case is already handled in save, but just in case
        return setToastMessage("Please upload your motivation letter first.");
      }

      // now run original confirm (approve) logic
      const formData = new FormData();
      items.forEach(item => formData.append("pfeIds[]", item.card_info.id));
      formData.append("ML", motivationFile);

      console.log("Form data prepared for approve:", motivationFile);

      const resp = await axios.post("/preflist/approve", formData, {
        headers: { "Content-Type": "multipart/form-data" },
        withCredentials: true
      });

      console.log("Server Approve response:", resp.data);

      localStorage.removeItem("preferencesList");
      setPreferencesList([]);
      setItems([]);

      window.location.reload();
    } catch (err) {
      setIsToasterror(true);
      setToastMessage(err.response?.data?.message || err.message || " failed. Please try again.");
      setShowToast(true);
    }
  };

  const handleCloseSuccess = () => setShowSuccessModal(false);
  // DnD setup
  const sensors = useSensors(useSensor(PointerSensor, { activationConstraint: { distance: 5 } }));

  const handleDragEnd = ({ active, over }) => {
    if (active.id !== over.id) {
      setItems((prev) => {
        const moved = arrayMove(
          prev,
          prev.findIndex((i) => i.id === active.id),
          prev.findIndex((i) => i.id === over.id)
        );
        return moved.map((item, idx) => ({
          ...item,
          order: String(idx + 1).padStart(2, "0"),
        }));
      });
    }
  };

  const handleRemove = (topicTitle) => {
    setPreferencesList((prev) => {
      const next = prev
        .filter((p) => p.topic_title !== topicTitle)
        .map((p, idx) => ({
          ...p,
          order: String(idx + 1).padStart(2, "0"),
        }));
      localStorage.setItem("preferencesList", JSON.stringify(next));
      return next;
    });
  };

  return (
    <div className={Style["pagecontainer"]}>
      <div className={Module["header-left"]}>
        <h2>Team number</h2>
        <p>You are currently in team number <span>{team_id}</span></p>
      </div>
      {submit ? (
        <div
          className={Style["header"]}
          style={{ color: "#313638", fontFamily: "Manrope", marginLeft: "5px" }}
        >

          <p>Welcome again.</p>
          <p style={{ marginTop: "3px", fontSize: "1rem" }}>
            Here is your result for your selection.
          </p>
        </div>
      ) : (
        <div style={{ color: "#313638", fontFamily: "Manrope", marginLeft: "5px" }}>
          <p>Welcome to Your PFE Topic Selection Panel!</p>
          <p>
            Here, you can manage up to 5 preferred PFE topics. Feel free to add,
            remove, reorder, or revisit topics at any time to explore their details.
          </p>
          <p>
            You can submit your list earlier or wait for the session to end for
            auto-submission.
          </p>
        </div>
      )}

      <div style={{ marginTop: "20px" }}>
        <div className={Module["table-wrapper"]}>
          <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
            <SortableContext items={items} strategy={verticalListSortingStrategy}>
              <table id="StudentPreferencesTable">
                <thead>
                  <tr>
                    <th></th>
                    <th>Order</th>
                    <th>Topic title</th>
                    <th>Main supervisor</th>
                    <th></th>
                  </tr>
                </thead>
                <tbody>
                  {items.map((item) => (
                    <SortableRow
                      key={item.id}
                      item={item}
                      submit={submit}
                      onRemove={handleRemove}
                      preferencesList={preferencesList}
                      sessionTitle={sessionTitle}
                      targetDate={targetDate}
                    />
                  ))}
                </tbody>
              </table>
            </SortableContext>
          </DndContext>
        </div>

        {!submit && (
          <>
            <MotivationCard onFileSelect={setMotivationFile} />
            <div style={{ display: "flex", justifyContent: "flex-end", marginTop: "-40px" }}>
              <button
                className={Style["save-button"]}
                onClick={handleSaveSubmit}
              >
                Save the list
              </button>
              <button
                className={Style["submit-button"]}
                onClick={() => {
                  if (items.length === 5) setShowSubmitModal(true);
                  else {
                    setIsToasterror(null);

                    setToastMessage("You must select exactly 5 topics before submitting.");
                    setShowToast(true);
                  }
                }}
              >
                Submit the list
              </button>

            </div>
          </>
        )}

        <SubmitModal show={showSubmitModal} onCancel={() => setShowSubmitModal(false)} onConfirm={handleConfirmSubmit} />
        {showSuccessModal && (
          <SuccessConfirmationModal
            message="Your list has been successfully submitted!."
            onClose={handleCloseSuccess}
            show={showSuccessModal}
          />
        )}
        {showToast && (
          <Toast
            message={toastMessage}
            onClose={() => setShowToast(false)}
            isError={isToasterror}
          />
        )}
      </div>
    </div>
  );
};

export default StudentPreferences;