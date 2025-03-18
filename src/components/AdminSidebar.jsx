import { NavLink } from "react-router-dom";
import { useState } from "react";
import { Menu, Users, GraduationCap, Briefcase, Gavel } from "lucide-react";


const Sidebar = () => {
  const [isOpen, setIsOpen] = useState(true);

  const menuItems = [
    { name: "Users", path: "/users", icon: <Users size={20} /> },
    { name: "Students", path: "/students", icon: <GraduationCap size={20} /> },
    { name: "Supervisors", path: "/supervisors", icon: <Briefcase size={20} /> },
    { name: "Jurys", path: "/jurys", icon: <Gavel size={20} /> },
    { name: "Enterprises", path: "/enterprises", icon: <Briefcase size={20} /> },
  ];

  return (
    <div className={`sidebar ${isOpen ? "open" : "closed"}`}>
      {/* Toggle Button */}
      <div className="sidebar-header">
        <h1 className={isOpen ? "visible" : "hidden"}>Dashboard</h1>
        <button onClick={() => setIsOpen(!isOpen)} className="toggle-btn">
          <Menu size={24} />
        </button>
      </div>

      {/* Menu Items */}
      <nav className="sidebar-menu">
        {menuItems.map((item) => (
          <NavLink key={item.name} to={item.path} className="sidebar-item">
            <span className="sidebar-icon">{item.icon}</span>
            <span className={`sidebar-text ${!isOpen ? "hidden" : ""}`}>{item.name}</span>
          </NavLink>
        ))}
      </nav>
    </div>
  );
};

export default Sidebar;
