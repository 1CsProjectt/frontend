  import { useLocation } from "react-router-dom";
  import { Outlet } from "react-router-dom";
  import classes from "../styles/adminDashboard.module.css";
  import AdminSidebar from "../components/AdminSidebar";
  import NavBar from "../components/NavBar";


  const AdminDashboard = () => {
    const location = useLocation();

    return (  
      <div className={classes["admin-dashboard"]}>
        
        <AdminSidebar />
        <div className={classes["main-content"]}>
        <Outlet /> {/* This will render subpages dynamically */}
          
          
        </div>
      </div>
    );
  };

  export default AdminDashboard;
