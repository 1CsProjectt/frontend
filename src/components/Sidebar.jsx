import React, { useState, useEffect } from "react";
import Module from "../styles/Sidebar.module.css";
import { useNavigate, useLocation } from "react-router-dom";

// Import SVG icons
import LogoIcon from "../assets/EasyPFE-icon.svg";
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
  console.log(user.role);
  const role =
    user.role === "company" || user.role === "teacher" ? true : false;
  const navigate = useNavigate();
  const location = useLocation();
  const [activeMenu, setActiveMenu] = useState("");

  useEffect(() => {
    const path = location.pathname;

    if (path.includes("/pfe-student")) {
      setActiveMenu("pfe");
    } else if (path.includes("mytopics") || path.includes("Addatopic")) {
      setActiveMenu("mytopics"); // ✅ Match this to the comparison
    } else if (path.includes("requests")) {
      setActiveMenu("requests");
    } else if (path.includes("myteam")) {
      setActiveMenu("myteam");
    } else if (path.includes("teachermeetingspage")) {
      setActiveMenu("meetings");
    } else if (path.includes("/teacher")) {
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

  const toggleMenu = (path) => {
    navigate(path);
  };

  const handleLogout = () => {
    document.cookie =
      "authToken=; Path=/; Expires=Thu, 01 Jan 1970 00:00:00 GMT;";

    localStorage.removeItem("preferencesList");
    localStorage.removeItem("user");

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
            onClick={() => toggleMenu(role ? "/teacher" : "/pfe-student")}
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

        {role && (
          <>
            <li className={Module["menu-item"]}>
              <button
                className={`${Module["menu-btn"]} ${
                  activeMenu === "mytopics" ? Module["active"] : ""
                }`}
                onClick={() => toggleMenu("/teacher/mytopics")}
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
                  activeMenu === "requests" ? Module["active"] : ""
                }`}
                onClick={() => toggleMenu("/teacher/requests")}
              >
                <img
                  src={TeamformationIcon}
                  alt="Requests"
                  className={Module["icon"]}
                />
                Requests
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
                  activeMenu === "myteam" ? Module["active"] : ""
                }`}
                onClick={() => toggleMenu("/teacher/myteam")}
              >
                <img
                  src={TeamformationIcon}
                  alt="Requests"
                  className={Module["icon"]}
                />
                My Teams
                <img
                  src={ChevronRightIcon}
                  alt="Arrow"
                  className={Module["row-icon"]}
                />
              </button>
            </li>
          </>
        )}
        {!role && (
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
        {!role && (
          <li className={Module["menu-item"]}>
            <button
              className={`${Module["menu-btn"]} ${
                activeMenu === "meetings" ? Module["active"] : ""
              }`}
              onClick={() => {
                toggleMenu("/StudentMeetingsPage");
              }}
            >
              <img
                src={CheckCircleIcon}
                alt="Loremres"
                className={Module["icon"]}
              />
              Meetings
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
            className={`${Module["menu-btn"]} ${
              activeMenu === "meetings" ? Module["active"] : ""
            }`}
            onClick={() => {
              role
                ? toggleMenu("/teachermeetingspage")
                : toggleMenu("/StudentMeetingsPage");
            }}
          >
            <img
              src={CheckCircleIcon}
              alt="Loremres"
              className={Module["icon"]}
            />
            Meetings
            <img
              src={ChevronRightIcon}
              alt="Arrow"
              className={Module["row-icon"]}
            />
          </button>
        </li>
        <li className={Module["menu-item"]}>
          <button
            /* className={Module[`menu-btn ${activeMenu === "Soutenance" ? "active" : ""}`]} */
            className={`${Module["menu-btn"]} ${
              activeMenu === "Soutenance" ? Module["active"] : ""
            }`}
            onClick={() => toggleMenu("/SoutenanceStudentPage")}
          >
            <img
              src={NotificationsIcon}
              alt="Soutenance"
              className={Module["icon"]}
            />
           Soutenance
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
