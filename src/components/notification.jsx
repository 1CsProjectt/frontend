import React, { useState, useEffect } from "react";
import Module from "../styles/navbar.module.css";

// Existing NotificationPanel component updated to display notifications.
const NotificationPanel = ({ notifications }) => {
  const handleAccept = (notificationId) => {
    console.log("Accepted invitation with ID:", notificationId);
    // Additional logic (such as API calls to update the notification status) can be placed here.
  };

  const handleDecline = (notificationId) => {
    console.log("Declined invitation with ID:", notificationId);
    // Additional logic (such as API calls to update the notification status) can be placed here.
  };

  return (
    <div className={Module["notification-panel"]}>
      <div className={Module["notification-header"]}>
        <h3>Notifications</h3>
        <button className={Module["mark-read-btn"]}>Mark all as read</button>
      </div>
      {notifications.map((notification) => (
        <div key={notification.id} className={Module["notification-item"]}>
          <div className={Module["notification-upper"]}>
            <div className={Module["notification-text"]}>
              <p className={Module["notification-message"]}>
                <span>{notification.message}</span> invites you to join their team
              </p>
            </div>
            <p className={Module["notification-time"]}>{notification.time}</p>
          </div>

          {/* Invitation buttons for "invitation" type notifications */}
          {notification.type === "invitation" && (
            <div className={Module["notification-lower"]}>
              <button
                className={Module["decline-btn-notification"]}
                onClick={() => handleDecline(notification.id)}
              >
                Decline
              </button>
              <button
                className={Module["accept-btn-notification"]}
                onClick={() => handleAccept(notification.id)}
              >
                Accept
              </button>
            </div>
          )}
        </div>
      ))}
    </div>
  );
};

// Container component that fetches notifications from the backend.
const NotificationsContainer = () => {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchNotifications = async () => {
      try {
        // Replace this URL with your actual API endpoint.
        const response = await fetch("https://api.example.com/notifications");
        if (!response.ok) {
          throw new Error(`Network response was not ok. Status: ${response.status}`);
        }
        const data = await response.json();
        // Assuming the returned data is an array of notifications.
        setNotifications(data);
      } catch (err) {
        setError(err.message);
        console.error("Error fetching notifications:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchNotifications();
  }, []);

  // Render a loading state or error message if needed
  if (loading) return <div>Loading notifications...</div>;
  if (error) return <div>Error: {error}</div>;

  return <NotificationPanel notifications={notifications} />;
};

export default NotificationsContainer;
