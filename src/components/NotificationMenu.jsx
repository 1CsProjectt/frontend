import React, { useState, useRef, useEffect } from "react";
import { createPortal } from "react-dom";
import axios from "axios";
import styles from "../styles/navbar.module.css";
import notificationsIcon from "../assets/Notifications.svg";

export default function NotificationMenu() {
    const [open, setOpen] = useState(false);
    const [notifications, setNotifications] = useState([]);
    const [unreadCount, setUnreadCount] = useState(0);
    const ref = useRef();

    // 🔁 Fonctions pour récupérer les notifications et les non lus
    const fetchNotifications = async () => {
        try {
            const res = await axios.get("/notification/getMyNotifications", {
                headers: { accept: "application/json" },
            });
            setNotifications(res.data.notifications);
        } catch (err) {
            console.error("Erreur lors de la récupération des notifications:", err);
        }
    };

    const fetchUnreadCount = async () => {
        try {
            const res = await axios.get("/notification/count/unread", {
                headers: { accept: "application/json" },
            });
            setUnreadCount(res.data.unreadCount);
        } catch (err) {
            console.error("Erreur lors de la récupération du nombre de non lus:", err);
        }
    };

    const fetchAll = () => {
        fetchNotifications();
        fetchUnreadCount();
    };

    // 🔄 Charger une première fois au montage
    useEffect(() => {
        fetchAll();

        // 🔁 Et aussi toutes les 20 secondes
        const interval = setInterval(fetchAll, 20000);
        return () => clearInterval(interval);
    }, []);

    // ❌ Fermer si clic en dehors
    useEffect(() => {
        const handler = (e) => {
            if (ref.current && !ref.current.contains(e.target)) {
                setOpen(false);
            }
        };
        document.addEventListener("click", handler);
        return () => document.removeEventListener("click", handler);
    }, []);

    // ✅ Marquer comme lu
    const markAsRead = async (id) => {
        try {
            await axios.patch(`/notification/${id}/read`, null, {
                headers: { accept: "application/json" },
            });
            setNotifications((prev) => prev.filter((n) => n.id !== id));
            setUnreadCount((count) => count - 1);
        } catch (err) {
            console.error(`Erreur lors du marquage de la notification ${id} comme lue:`, err);
        }
    };

    // 📩 Menu déroulant
    const dropdown = open ? (
        <div className={styles["notf-dropdown"]}>
            <p className={styles["notf-header"]}>All notifications</p>
            {notifications.length === 0 ? (
                <p className={styles["notf-header-p"]}>Aucune nouvelle notification.</p>
            ) : (
                notifications.map((n) => (
                    <div key={n.id} className={styles["notf-item"]}>
                        <p>
                            <strong>{n.content}</strong>
                        </p>
                        <span className={styles["notf-time"]}>
                            {new Date(n.createdAt).toLocaleString()}
                        </span>
                        <div className={styles["notf-actions"]}>
                            <button
                                className={styles["accept-btn"]}
                                onClick={() => markAsRead(n.id)}
                            >
                                Read
                            </button>
                        </div>
                    </div>
                ))
            )}
        </div>
    ) : null;

    // ✅ Clic pour ouvrir = aussi rafraîchir
    const handleClick = () => {
        setOpen((prev) => {
            const newState = !prev;
            if (newState) fetchAll(); // Fetch on open
            return newState;
        });
    };

    return (
        <div className={styles["notf-container"]} ref={ref}>
            <img
                src={notificationsIcon}
                alt="Notifications"
                className={styles["notf-icon"]}
                onClick={handleClick}
            />
            {unreadCount > 0 && (
                <span className={styles["notf-badge"]}>{unreadCount}</span>
            )}
            {open && createPortal(dropdown, document.body)}
        </div>
    );
}
