  import { useLocation } from "react-router-dom";
  import { Outlet } from "react-router-dom";
  import "../styles/adminDashboard.css";
  import AdminSidebar from "../components/AdminSidebar";


  const AdminDashboard = () => {
    const location = useLocation();

    return (  
      <div className="admin-dashboard">
        <AdminSidebar />
        <div className="main-content">
        <Outlet /> {/* This will render subpages dynamically */}
          
          
        </div>
      </div>
    );
  };

  export default AdminDashboard;
