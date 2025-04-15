import React, { useState, useEffect } from "react";
import Module from "../styles/Sidebar.module.css";
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
  const user = JSON.parse(localStorage.getItem("user"));
  const navigate = useNavigate();
  const location = useLocation();
  const [activeMenu, setActiveMenu] = useState("");

  // Update activeMenu based on current path
  useEffect(() => {
    const path = location.pathname;
    if (path.includes("/pfe")) {
      setActiveMenu("pfe");
    } else if (path.includes("/teacher")) {
      setActiveMenu("mytopics");
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
    <div className={Module["sidebar"]}>
      {/* Logo */}
      <div className={Module["sidebar-title"]}>
        <img src={LogoIcon} alt="EasyPFE Logo" className={Module["logo"]} />
      </div>

      {/* Menu List */}
      <ul className={Module["menu"]}>
        <li className={Module["menu-title"]}>Menu</li>
        <li className={Module["menu-item"]}>
          <button
            className={`${Module["menu-btn"]} ${
              activeMenu === "pfe" ? Module["active"] : ""
            }`}
            onClick={() => toggleMenu("/pfe")}
          >
            <img src={PFEIcon} alt="PFE Topics" className={Module["icon"]} />
            PFE Topics
            <img
              src={ChevronRightIcon}
              alt="Arrow"
              className={Module["row-icon"]}
            />
          </button>
        </li>

        {user?.role === "teacher" && (
          <>
            <li className={Module["menu-item"]}>
              <button
                className={`${Module["menu-btn"]} ${
                  activeMenu === "mytopics" ? Module["active"] : ""
                }`}
                onClick={() => toggleMenu("/teacher")}
              >
                <img src={PFEIcon} alt="My Topics" className={Module["icon"]} />
                My Topics
                <img
                  src={ChevronRightIcon}
                  alt="Arrow"
                  className={Module["row-icon"]}
                />
              </button>
            </li>
            <li className={Module["menu-item"]}>
              <button
                className={`${Module["menu-btn"]} ${
                  activeMenu === "teamselection" ? Module["active"] : ""
                }`}
                onClick={() => toggleMenu("/teamselection")}
              >
                <img
                  src={TeamformationIcon}
                  alt="Team Selection"
                  className={Module["icon"]}
                />
                Team Selection
                <img
                  src={ChevronRightIcon}
                  alt="Arrow"
                  className={Module["row-icon"]}
                />
              </button>
            </li>
          </>
        )}
        {user?.role !== "teacher" && (
          <li className={Module["menu-item"]}>
            <button
              className={`${Module["menu-btn"]} ${
                activeMenu === "TeamFormationPage" ? Module["active"] : ""
              }`}
              onClick={() => toggleMenu("/TeamFormationPage")}
            >
              <img
                src={TeamformationIcon}
                alt="Team formation"
                className={Module["icon"]}
              />
              Team formation
              <img
                src={ChevronRightIcon}
                alt="Arrow"
                className={Module["row-icon"]}
              />
            </button>
          </li>
        )}
        <li className={Module["menu-item"]}>
          <button
            /* className={Module[`menu-btn ${activeMenu === "notifications" ? "active" : ""}`]} */
            className={`${Module["menu-btn"]} ${
              activeMenu === "notifications" ? Module["active"] : ""
            }`}
            onClick={() => toggleMenu("/notifications")}
          >
            <img
              src={NotificationsIcon}
              alt="Notifications"
              className={Module["icon"]}
            />
            Notifications
            <img
              src={ChevronRightIcon}
              alt="Arrow"
              className={Module["row-icon"]}
            />
          </button>
        </li>

        <li className={Module["menu-item"]}>
          <button
            className={`${Module["menu-btn"]} ${
              activeMenu === "loremres" ? Module["active"] : ""
            }`}
            onClick={() => toggleMenu("/loremres")}
          >
            <img
              src={CheckCircleIcon}
              alt="Loremres"
              className={Module["icon"]}
            />
            Loremres
            <img
              src={ChevronRightIcon}
              alt="Arrow"
              className={Module["row-icon"]}
            />
          </button>
        </li>
        <li className={Module["menu-item"]}>
          <button
            className={`${Module["menu-btn"]} ${
              activeMenu === "lovers" ? Module["active"] : ""
            }`}
            onClick={() => toggleMenu("/lovers")}
          >
            <img src={LoversIcon} alt="Lovers" className={Module["icon"]} />
            Lovers
            <img
              src={ChevronRightIcon}
              alt="Arrow"
              className={Module["row-icon"]}
            />
          </button>
        </li>
        <li className={Module["menu-item"]}>
          <button
            className={`${Module["menu-btn"]} ${
              activeMenu === "export" ? Module["active"] : ""
            }`}
            onClick={() => toggleMenu("/export")}
          >
            <img src={ExportIcon} alt="Export" className={Module["icon"]} />
            Export
            <img
              src={ChevronRightIcon}
              alt="Arrow"
              className={Module["row-icon"]}
            />
          </button>
        </li>
      </ul>

      {/* Bottom Menu */}
      <div className={Module["bottom-menu"]}>
        <button
          className={Module["bottom-menu-btn"]}
          onClick={() => navigate("/help")}
        >
          <img src={HelpIcon} alt="Help" className={Module["icon"]} />
          Help
        </button>
        <button className={Module["bottom-menu-btn"]} onClick={handleLogout}>
          <img src={LogoutIcon} alt="Logout" className={Module["icon"]} />
          Log Out
        </button>
      </div>
    </div>
  );
};

export default Sidebar;
