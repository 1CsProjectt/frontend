import { NavLink, useLocation } from "react-router-dom";

import classNames from "classnames";
import classes from "../styles/adminSidebar.module.css";
import usersIcon from "../assets/users-icon.svg";
import sessionsIcon from "../assets/sessions-icon.svg";
import exportIcon from "../assets/export-icon.svg";
import loversrIcon from "../assets/loversr-icon.svg";
import dashboardIcon from "../assets/dashboard-icon.svg";
import settingsIcon from "../assets/settings-icon.svg";
import logoIcon from "../assets/logo-icon.svg";
import helpIcon from "../assets/help-icon.svg";
import logoutIcon from "../assets/logout-icon.svg";

const AdminSidebar = () => {
  const location = useLocation(); // Get current URL
  const handleLogout = () => {
    localStorage.removeItem("authToken");
  };
  const menuItems = [
    {
      name: "Users",
      path: "/admin/users",
      icon: <img src={usersIcon} alt="Users" />,
    },
    {
      name: "Sessions",
      path: "/admin/sessions",
      icon: <img src={sessionsIcon} alt="Sessions" />,
    },
    {
      name: "Export",
      path: "/admin/export",
      icon: <img src={exportIcon} alt="Export" />,
    },
    {
      name: "Loversr",
      path: "/admin/loversr",
      icon: <img src={loversrIcon} alt="Loversr" />,
    },
    {
      name: "Dashboard",
      path: "/admin/dashboard",
      icon: <img src={dashboardIcon} alt="Dashboard" />,
    },
    {
      name: "Settings",
      path: "/admin/settings",
      icon: <img src={settingsIcon} alt="Settings" />,
    },
  ];

  return (
    <div className={classes["sidebar"]}>
      <div className={classes["sidebar-header"]}>
        <img src={logoIcon} alt="logo icon" />
        <h1>EasyPFE</h1>
      </div>

      <h2 style={{ fontSize: "20px" }}> Menu </h2>

      <nav className={classes["sidebar-menu"]}>
        {menuItems.map((item) => (
          <NavLink
            key={item.name}
            to={item.path}
            className={({ isActive }) =>
              classNames(classes["sidebar-item"], {
                [classes["active"]]: isActive,
              })
            }
          >
            <span className={classes["sidebar-icon"]}>{item.icon}</span>
            <span className={classes["sidebar-text"]}>{item.name}</span>
          </NavLink>
        ))}
      </nav>

      {/* Bottom Buttons */}
      <div className={classes["sidebar-bottom"]}>
        <NavLink to="/admin/help" className={classes["sidebar-item"]}>
          <span className={classes["sidebar-icon"]}>
            <img src={helpIcon} alt="Help" />
          </span>
          <span className={classes["sidebar-text"]}>Help</span>
        </NavLink>
        <NavLink to="/" className={classes["sidebar-item"]}>
          <span className={classes["sidebar-icon"]} onClick={handleLogout}>
            <img src={logoutIcon} alt="Logout" />
          </span>
          <span className={classes["sidebar-text"]}>Logout</span>
        </NavLink>
      </div>
    </div>
  );
};

export default AdminSidebar;
