// StudentPreferences.jsx
import React, { useState, useEffect } from "react";
import axios from "axios";
import Toast from "./modals/Toast";
import { useNavigate } from "react-router-dom";
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
const SortableRow = ({ item, submit }) => {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
  } = useSortable({
    id: item.id,
    disabled: submit,
  });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  return (
    <tr ref={setNodeRef} style={style} className={Module["sortable-row"]}>
      <td
        {...attributes}
        {...listeners}
        style={{
          cursor: submit ? "default" : "grab",
          pointerEvents: submit ? "none" : "auto",
        }}
      >
        <span className={Module["drag-handle"]}>⋮⋮</span>
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
            {item.status}
          </span>
        ) : (
          <>
            <button className={Style["Read-button"]} style={{ margin: "0 10px" }}>
              Read
            </button>
            <button className={Style["Remove-button"]} style={{ margin: "0 10px" }}>
              Remove
            </button>
          </>
        )}
      </td>
    </tr>
  );
};

const StudentPreferences = ({ PreferenecesList = [], submit }) => {
  const navigate = useNavigate();
  const [toastMessage, setToastMessage] = useState("");
  const [showToast, setShowToast] = useState(false);
  const [showSubmitModal, setShowSubmitModal] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);

  const handleConfirmSubmit = () => {
    setShowSubmitModal(false);
    setShowSuccessModal(true); // Show success modal
  };

  const handleCloseSuccess = () => {
    setShowSuccessModal(false);

  };

  // Local state to manage reordering
  const [items, setItems] = useState(
    PreferenecesList.map((item, idx) => ({
      ...item,
      id: `${idx}-${item.order}`,
    }))
  );

  // Update if props change
  useEffect(() => {
    setItems(
      PreferenecesList.map((item, idx) => ({
        ...item,
        id: `${idx}-${item.order}`,
      }))
    );
  }, [PreferenecesList]);

  // Sensors for drag events
  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 5 } })
  );

  const handleDragEnd = (event) => {
    const { active, over } = event;
    if (active.id !== over.id) {
      setItems((prev) => {
        const moved = arrayMove(prev,
          prev.findIndex(i => i.id === active.id),
          prev.findIndex(i => i.id === over.id)
        );

        return moved.map((item, idx) => ({
          ...item,
          order: String(idx + 1).padStart(2, "0")   // make "1" → "01"
        }));
      });
    }
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
          <DndContext
            sensors={sensors}
            collisionDetection={closestCenter}
            onDragEnd={handleDragEnd}
          >
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
                    />
                  ))}
                </tbody>
              </table>
            </SortableContext>
          </DndContext>
        </div>

        {/* Motivation Letter Card */}
        {!submit && (
          <>
            <MotivationCard />
            <div
              style={{ display: "flex", justifyContent: "flex-end", marginTop: "-40px" }}
            >
              <button className={Style["submit-button"]} onClick={() => setShowSubmitModal(true)} >
                Submit the list
              </button>
            </div>
          </>
        )}

        <SubmitModal
          show={showSubmitModal}
          onCancel={() => setShowSubmitModal(false)}
          onConfirm={handleConfirmSubmit}
        />

        {showSuccessModal && <SuccessConfirmationModal
          message="Your list has been successfully submitted! You won't be able to undo this action.."
          onClose={handleCloseSuccess}
          show={showSuccessModal}
        />}


        {showToast && (
          <Toast message={toastMessage} onClose={() => setShowToast(false)} />
        )}
      </div>
    </div>
  );
};

export default StudentPreferences;
