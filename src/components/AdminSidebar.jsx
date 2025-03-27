import { NavLink, useLocation } from "react-router-dom";
import "../styles/adminSidebar.css";
import usersIcon from "../assets/users-icon.svg";
import sessionsIcon from "../assets/sessions-icon.svg";
import exportIcon from "../assets/export-icon.svg";
import loversrIcon from "../assets/loversr-icon.svg";
import dashboardIcon from "../assets/dashboard-icon.svg";
import settingsIcon from "../assets/settings-icon.svg";
import logoIcon from "../assets/logo-icon.svg";
import helpIcon from "../assets/help-icon.svg";
import logoutIcon from "../assets/logout-icon.svg";
const Sidebar = () => {
  const location = useLocation(); // Get current URL

  const menuItems = [
    { name: "Users", path: "/admin/users", icon: <img src={usersIcon} alt="Users" /> },
    { name: "Sessions", path: "/admin/sessions", icon: <img src={sessionsIcon} alt="Sessions" /> },
    { name: "Export", path: "/admin/export", icon: <img src={exportIcon} alt="Export" /> },
    { name: "Loversr", path: "/admin/loversr", icon: <img src={loversrIcon} alt="Loversr" /> },
    { name: "Dashboard", path: "/admin/dashboard", icon: <img src={dashboardIcon} alt="Dashboard" /> },
    { name: "Settings", path: "/admin/settings", icon: <img src={settingsIcon} alt="Settings" /> },
  ];

  return (
    // react we can do inline css by passing a js object using {}
    <div className="sidebar">
      <div className="sidebar-header">
        <img src={logoIcon} alt="logo icon" ></img>
        
        <h1>EasyPFE</h1>
      </div>


      <h2 style = {{fontSize : "20px"}}> Menu </h2>

      <nav className="sidebar-menu">
        {menuItems.map((item) => (
          <NavLink
            key={item.name}
            to={item.path}
            //to only render the sidebar in the according page (adminDashboard)
            className={({ isActive }) =>
              isActive ||
              location.pathname.startsWith(item.path) ||
              (location.pathname === "/admin" && item.path === "/admin/users") 
                ? "sidebar-item active"
                : "sidebar-item"
            }
            
          >
            <span className="sidebar-icon">{item.icon}</span>
            <span className="sidebar-text">{item.name}</span>
          </NavLink>
        ))}
      </nav>
      {/* Bottom Buttons */}
      <div className="sidebar-bottom">
        <NavLink to="/admin/help" className="sidebar-item">
          <span className="sidebar-icon"><img src={helpIcon} alt="Help" /></span>
          <span className="sidebar-text">Help</span>
        </NavLink>
        <NavLink to="/logout" className="sidebar-item">
          <span className="sidebar-icon"><img src={logoutIcon} alt="Logout" /></span>
          <span className="sidebar-text">Logout</span>
        </NavLink>
      </div>
    </div>
  );
};

export default Sidebar;
