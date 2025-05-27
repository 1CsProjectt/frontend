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
import { useNavigate } from "react-router-dom";
const AdminSidebar = () => {
  const navigate = useNavigate();
  // utility to delete a non-httpOnly cookie
function eraseCookie(name) {
  // use Max-Age=0 (or Expires in the past) **and** match path/domain
  document.cookie = `${name}=; Max-Age=0; path=/; domain=${window.location
    .hostname};`;
}

const handleLogout = () => {
  // 1) nuking the JWT cookie
  eraseCookie("authToken");

  // 2) clearing any localStorage you were using
  
  localStorage.removeItem("user");

  // 3) reset any React state/context here if needed…
  //    e.g. authContext.setUser(null)

  // 4) finally send them to login (or reload to wipe in-memory caches)
  navigate("/");
  // or window.location.reload();
};


  const menuItems = [
    { name: "Users",              path: "/admin/users",                     icon: <img src={usersIcon} alt="Users" /> },
    { name: "Sessions",           path: "/admin/sessions",                  icon: <img src={sessionsIcon} alt="Sessions" /> },
    { name: "Topic Submission",   path: "/admin/sessions/topic-validation", icon: <img src={exportIcon} alt="Export" /> },
    { name: "Team Formation",     path: "/admin/sessions/admin-team-formation", icon: <img src={loversrIcon} alt="Team" /> },
    { name: "Topic Selection",    path: "/admin/sessions/manage-preferences",     icon: <img src={dashboardIcon} alt="Dashboard" /> },
    { name: "Soutenance",           path: "/admin/soutenance",                  icon: <img src={dashboardIcon} alt="Dashboard" /> },
  ];

  return (
    <div className={classes.sidebar}>
      <div className={classes["sidebar-header"]}>
        <img src={logoIcon} alt="logo icon" />
        <h1>EasyPFE</h1>
      </div>

      <h2 style={{ fontSize: "20px" }}>Menu</h2>

      <nav className={classes["sidebar-menu"]}>
        {menuItems.map((item) => (
          <NavLink
            key={item.name}
            to={item.path}
            end      // <-- full (exact) matching on every link
            className={({ isActive }) =>
              classNames(classes["sidebar-item"], {
                [classes.active]: isActive,
              })
            }
          >
            <span className={classes["sidebar-icon"]}>{item.icon}</span>
            <span className={classes["sidebar-text"]}>{item.name}</span>
          </NavLink>
        ))}
      </nav>

      <div className={classes["sidebar-bottom"]}>
        <NavLink to="/admin/help" end className={classes["sidebar-item"]}>
          <span className={classes["sidebar-icon"]}>
            <img src={helpIcon} alt="Help" />
          </span>
          <span className={classes["sidebar-text"]}>Help</span>
        </NavLink>
        <NavLink to="/" end className={classes["sidebar-item"]} onClick={handleLogout}>
          <span className={classes["sidebar-icon"]}>
            <img src={logoutIcon} alt="Logout" />
          </span>
          <span className={classes["sidebar-text"]}>Logout</span>
        </NavLink>
      </div>
    </div>
  );
};

export default AdminSidebar;
