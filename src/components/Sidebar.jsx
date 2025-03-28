import React, { useState, useEffect } from "react";
import "../styles/Sidebar.css";
import { useNavigate, useLocation } from "react-router-dom";

// Import SVG icons
import LogoIcon from "../assets/EasyPFE-icon.svg";
import SettingsIcon from "../assets/SettingIcon.svg";
import NotificationsIcon from "../assets/Notifications.svg";
import LoversIcon from "../assets/favorite_border_24px.svg";
import ExportIcon from "../assets/ExportIcon.svg";
import HelpIcon from "../assets/help_outline_24px.svg";
import LogoutIcon from "../assets/logout.svg";
import ChevronRightIcon from "../assets/expand_less_24px.svg";
import PFEIcon from "../assets/Graduation Cap.svg";
import CheckCircleIcon from "../assets/check_circle_outline_24px.svg";
import TeamformationIcon from "../assets/Teamformation.svg";
const Sidebar = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [activeMenu, setActiveMenu] = useState("");

  // Update activeMenu based on current path
  useEffect(() => {
    const path = location.pathname;
    if (path.includes("/pfe")) {
      setActiveMenu("pfe");
    } else if (path.includes("/TeamFormationPage")) {
      setActiveMenu("TeamFormationPage");
    } else if (path.includes("/notifications")) {
      setActiveMenu("notifications");
    } else if (path.includes("/loremres")) {
      setActiveMenu("loremres");
    } else if (path.includes("/lovers")) {
      setActiveMenu("lovers");
    } else if (path.includes("/export")) {
      setActiveMenu("export");
    } else {
      setActiveMenu(""); // Default or fallback state
    }
  }, [location.pathname]);

  // The toggleMenu function now only navigates, while activeMenu is set by location
  const toggleMenu = (path) => {
    navigate(path);
  };

  const handleLogout = () => {
    localStorage.removeItem("authToken");
    navigate("/");
  };

  return (
    <div className="sidebar">
      {/* Logo */}
      <div className="sidebar-title">
        <img src={LogoIcon} alt="EasyPFE Logo" className="logo" />
      </div>

      {/* Menu List */}
      <ul className="menu">
        <li className="menu-title">Menu</li>
        <li className="menu-item">
          <button
            className={`menu-btn ${activeMenu === "pfe" ? "active" : ""}`}
            onClick={() => toggleMenu("/pfe")}
          >
            <img src={PFEIcon} alt="PFE Topics" className="icon" />
            PFE Topics
            <img src={ChevronRightIcon} alt="Arrow" className="row-icon" />
          </button>
        </li>
        <li className="menu-item">
          <button
            className={`menu-btn ${activeMenu === "TeamFormationPage" ? "active" : ""}`}
            onClick={() => toggleMenu("/TeamFormationPage")}
          >
            <img src={TeamformationIcon} alt="Team formation" className="icon" />
            Team formation
            <img src={ChevronRightIcon} alt="Arrow" className="row-icon" />
          </button>
        </li>
        <li className="menu-item">
          <button
            className={`menu-btn ${activeMenu === "notifications" ? "active" : ""}`}
            onClick={() => toggleMenu("/notifications")}
          >
            <img src={NotificationsIcon} alt="Notifications" className="icon" />
            Notifications
            <img src={ChevronRightIcon} alt="Arrow" className="row-icon" />
          </button>
        </li>
        <li className="menu-item">
          <button
            className={`menu-btn ${activeMenu === "loremres" ? "active" : ""}`}
            onClick={() => toggleMenu("/loremres")}
          >
            <img src={CheckCircleIcon} alt="Loremres" className="icon" />
            Loremres
            <img src={ChevronRightIcon} alt="Arrow" className="row-icon" />
          </button>
        </li>
        <li className="menu-item">
          <button
            className={`menu-btn ${activeMenu === "lovers" ? "active" : ""}`}
            onClick={() => toggleMenu("/lovers")}
          >
            <img src={LoversIcon} alt="Lovers" className="icon" />
            Lovers
            <img src={ChevronRightIcon} alt="Arrow" className="row-icon" />
          </button>
        </li>
        <li className="menu-item">
          <button
            className={`menu-btn ${activeMenu === "export" ? "active" : ""}`}
            onClick={() => toggleMenu("/export")}
          >
            <img src={ExportIcon} alt="Export" className="icon" />
            Export
            <img src={ChevronRightIcon} alt="Arrow" className="row-icon" />
          </button>
        </li>
      </ul>

      {/* Bottom Menu */}
      <div className="bottom-menu">
        <button className="bottom-menu-btn" onClick={() => navigate("/help")}>
          <img src={HelpIcon} alt="Help" className="icon" />
          Help
        </button>
        <button className="bottom-menu-btn" onClick={handleLogout}>
          <img src={LogoutIcon} alt="Logout" className="icon" />
          Log Out
        </button>
      </div>
    </div>
  );
};

export default Sidebar;
