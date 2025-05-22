// src/components/StudentMeetingHistory.jsx
import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import Style from "../styles/StudentMeetingPage.module.css";
import Toast from "./modals/Toast";
import axios from "axios";
import { getPaginatedData, getPageNumbers } from "../utils/paginationFuntion";
import Module from "../styles/TeamFormationPage.module.css";

axios.defaults.withCredentials = true;
axios.defaults.headers.common["ngrok-skip-browser-warning"] = "true";

const StudentMeetingHistory = ({ MeetingHistoryList }) => {
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(5);
  const containerRef = useRef(null);
  const [toastMessage, setToastMessage] = useState("");
  const [showToast, setShowToast] = useState(false);
  const navigate = useNavigate();
  // adjust rows per page to container’s height
  useEffect(() => {
    function updateItemsPerPage() {
      const h = containerRef.current?.clientHeight || 0;
      const rowHeight = 80; // adjust if your rows are taller/shorter
      const perPage = Math.floor(h / rowHeight);
      setItemsPerPage(perPage > 1 ? perPage : 4);
    }
    updateItemsPerPage();
    window.addEventListener("resize", updateItemsPerPage);
    return () => window.removeEventListener("resize", updateItemsPerPage);
  }, []);
  const SeeMoreHandle = (e, Item) => {
    e.stopPropagation();
    // pass both the clicked item and the full currentItems list
    navigate("/StudentMeetingsPage/SeeMore", {
      state: { item: Item, currentItems },
    });
  };
  const { currentItems, totalPages } = getPaginatedData(
    MeetingHistoryList,
    currentPage,
    itemsPerPage
  );
  const pageNumbers = getPageNumbers(totalPages, currentPage);

  const handlePageChange = (newPage) => {
    if (newPage >= 1 && newPage <= totalPages) {
      setCurrentPage(newPage);
    }
  };
  function formatDateToMMDD(dateString) {
    const date = new Date(dateString);
    const month = (date.getMonth() + 1).toString().padStart(2, "0");
    const day = date.getDate().toString().padStart(2, "0");
    return `${month}/${day}`;
  }
  return (
    <div>
      <div className={Module["table-wrapper"]}>
        {/* force a height so containerRef.clientHeight > 0 */}
        <div
          className={Module.tableWrapper}
          ref={containerRef}
          style={{ height: "350px" }}
        >
          <table>
            <thead>
              <tr>
                <th>Meeting ID</th>
                <th>Date</th>
                <th>Time</th>
                <th>Salle</th>
                <th>Work Status</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {currentItems.map((m) => (
                <tr key={m.id}>
                  <td>{m.id}</td>
                  <td>{formatDateToMMDD(m.date)}</td>
                  <td>{m.time}</td>
                  <td>{m.room}</td>
                  <td>{m.work_Status}</td>
                  <td>
                    <button
                      className={Style.SeeBtn}
                      style={{
                        padding: "10px 55px",
                        marginLeft: "90px",
                        Width: "50px",
                      }}
                      onClick={(e) => SeeMoreHandle(e, m)}
                    >
                      See more
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
      <div className={Module.pagination}>
        <button
          onClick={() => handlePageChange(currentPage - 1)}
          disabled={currentPage === 1}
          className={currentPage === 1 ? Style.disabled : ""}
        >
          Previous
        </button>

        <div className={Module.pageNumbers}>
          {pageNumbers.map((p, idx) =>
            p === "..." ? (
              <span key={idx} className={Module.ellipsis}>
                …
              </span>
            ) : (
              <button
                key={idx}
                onClick={() => handlePageChange(p)}
                className={p === currentPage ? Module.active : ""}
              >
                {p}
              </button>
            )
          )}
        </div>

        <button
          onClick={() => handlePageChange(currentPage + 1)}
          disabled={currentPage === totalPages}
          className={currentPage === totalPages ? Module.disabled : ""}
        >
          Next
        </button>
      </div>

      {showToast && (
        <Toast
          message={toastMessage || "Here’s your toast!"}
          onClose={() => setShowToast(false)}
        />
      )}
    </div>
  );
};

export default StudentMeetingHistory;
