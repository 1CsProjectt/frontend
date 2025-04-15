import React, { useState } from "react";
import styles from "../../styles/Notification.module.css";

const NotificationDropdown = () => {
  const [activeFilter, setActiveFilter] = useState("All Notifications");
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  const notifications = {
    "All Notifications": [
      {
        id: 1,
        name: "Guessoum mohamed nizar",
        message: "invites you to join their team.",
        time: "4 min ago",
      },
      {
        id: 2,
        name: "Yettou abdallah",
        message: "invites you to join their team.",
        time: "5 min ago",
      },
      {
        id: 3,
        name: "System Notification",
        message: "Your profile was updated successfully.",
        time: "10 min ago",
      },
    ],
    Invites: [
      {
        id: 1,
        name: "Guessoum mohamed nizar",
        message: "invites you to join their team.",
        time: "4 min ago",
      },
      {
        id: 2,
        name: "Yettou abdallah",
        message: "invites you to join their team.",
        time: "5 min ago",
      },
    ],
    Other: [
      {
        id: 3,
        name: "System Notification",
        message: "Your profile was updated successfully.",
        time: "10 min ago",
      },
    ],
  };

  const toggleDropdown = () => {
    setIsDropdownOpen((prev) => !prev);
  };

  const handleFilterChange = (filter) => {
    setActiveFilter(filter);
    setIsDropdownOpen(false);
  };

  return (
    <div className={styles["dropdown-container"]}>
      <div className={styles["header"]}>
        <div className={styles["dropdown-header"]} onClick={toggleDropdown}>
          {activeFilter} <span className={styles.arrow}>{isDropdownOpen ? "▲" : "▼"}</span>
        </div>
        <button className={styles["mark-as-read"]}>Mark all as read</button>
      </div>

      {isDropdownOpen && (
        <div className={styles["dropdown-menu"]}>
          {Object.keys(notifications).map((filter) => (
            <div
              key={filter}
              className={styles["dropdown-item"]}
              onClick={() => handleFilterChange(filter)}
            >
              {filter}
            </div>
          ))}
        </div>
      )}

      <div className={styles["notifications"]}>
        {notifications[activeFilter].length === 0 ? (
          <div className={styles["no-notifications"]}>No notifications</div>
        ) : (
          notifications[activeFilter].map((notification) => (
            <div key={notification.id} className={styles.notification}>
              <p>
                <strong>{notification.name}</strong> {notification.message}
              </p>
              <small>{notification.time}</small>
              {notification.message.includes("invites") && (
                <div className={styles.actions}>
                  <button className={styles["decline-btn"]}>Decline</button>
                  <button className={styles["accept-btn"]}>Accept</button>
                </div>
              )}
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default NotificationDropdown;
