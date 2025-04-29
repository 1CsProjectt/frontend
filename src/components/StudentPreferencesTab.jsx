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
const SortableRow = ({ item, submit, onRemove, preferencesList }) => {
  const navigate = useNavigate();

  const handleRemoveClick = () => {
    onRemove(item.topic_title);
  };

  const handleReadClick = (e, card) => {
    e.stopPropagation();
    navigate("/pfe-student/explore", { state: { card, } });
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
        {!submit &&   <span className={Module["drag-handle"]}>⋮⋮</span>}
      </td>
      <td>{item.order}</td>
      <td>{item.topic_title}</td>
      <td>{item.main_supervisor}</td>
      <td>
        {submit ? (
          <span
            style={{
              color:  
                item.status === "rejected"
                  ? "#F9857A"
                  : item.status === "Accepted"
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

const StudentPreferences = ({ submit }) => {
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
  const [showSubmitModal, setShowSubmitModal] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);

  const handleConfirmSubmit = () => {
    setShowSubmitModal(false);
    (async () => {
      if (!motivationFile) {
        return setToastMessage("Please upload your motivation letter first.");
      }

      // 1) Build a FormData (container for fields + files) :contentReference[oaicite:0]{index=0}
      const formData = new FormData();
      const pfeIdsArray = items.map((item) => item.card_info.id);

      // 2) Append fields: pfeIds as a comma-separated string, stringML as the binary file :contentReference[oaicite:1]{index=1}
      formData.append("pfeIds", pfeIdsArray.join(","));
      formData.append("stringML", motivationFile);

      try {
        const resp = await axios.post(
          "/preflist/approve",
          formData,
          {
            headers: {
              "Content-Type": "multipart/form-data" // tells the server it’s a file upload
            },
            withCredentials: true
          }
        );
        console.log("Server response:", resp.data);
        setShowSuccessModal(true);
        setToastMessage("The list submitted successfully.");
        setShowToast(true);
      } catch (err) {
        console.error("Upload error:", err);
        setToastMessage("Submission failed. Please try again.");
        setShowToast(true);
      }
    })();
  };

 const handleSaveSubmit = () => {
  // 1) Vérifier la présence du fichier de motivation (motivationFile)
  if (!motivationFile) {
    return setToastMessage("Please upload your motivation letter first.");
  }

  (async () => {
    const formData = new FormData();

    // 2) Construire la chaîne CSV : "101,202,303"
    const pfeIdsArray = items.map(item => item.card_info.id);
    const pfeIdsCsv = pfeIdsArray.join(",");

    // 3) Ajouter au FormData
    formData.append("pfeIds", pfeIdsCsv);
    formData.append("stringML", motivationFile);

    try {
      const resp = await axios.post(
        "/preflist/create",
        formData,
        {
          headers: { "Content-Type": "multipart/form-data" },
          withCredentials: true,
        }
      );
      console.log("Server Save response:", resp.data);
      setToastMessage("Your list has been saved successfully.");
      setShowToast(true);

      // 4) Optionnel : persister localement dans localStorage (stockage local)
      const storedPrefs = items.map((item, idx) => ({
        ...item,
        order: String(idx + 1).padStart(2, "0"),
      }));
      localStorage.setItem("preferencesList", JSON.stringify(storedPrefs));

    } catch (err) {
      console.error("Save error:", err);
      setToastMessage("Save failed. Please try again.");
      setShowToast(true);
    }
  })();
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
            message="Your list has been successfully submitted! You able to modify the pending ones."
            onClose={handleCloseSuccess}
            show={showSuccessModal}
          />
        )}
        {showToast && <Toast message={toastMessage} onClose={() => setShowToast(false)} />}
      </div>
    </div>
  );
};

export default StudentPreferences;