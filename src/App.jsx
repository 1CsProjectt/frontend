import React from "react";
import { BrowserRouter as Router, Routes, Route ,  Navigate  } from "react-router-dom";
import Login from "./Pages/Login";
import ForgotPassword from "./Pages/ForgotPassword";
import CheckEmail from "./Pages/CheckEmail";
import ResetPassword from "./Pages/ResetPassword";
import AdminDashboard from "./Pages/AdminDashboard";
import UserManagementTabs from "./components/UserManagementTabs";

function App() {
  return (
    <Router>  
      <Routes>
        <Route path="/" element={<Navigate to="/admin" replace />} />
        <Route path="/ForgotPassword" element={<ForgotPassword />} />
        <Route path="/CheckEmail" element={<CheckEmail />} />
        {/* Route with dynamic token */}
        <Route path="/auth/reset-password/:token" element={<ResetPassword />} />
        {/* Protected Routes (Inside AdminDashboard) */}
        {/* Admin Dashboard with Nested Routes */}
        <Route path="/admin" element={<AdminDashboard />}>
        
        <Route index element={<UserManagementTabs />} />{/* Default child route (renders when at /admin) */}
          <Route path="users" element={<UserManagementTabs />} />
          <Route path="sessions" element={<div>Sessions Page 
            <p>Lorem ipsum dolor sit amet consectetur adipisicing elit. Dignissimos, iure ut enim sit consequatur dolorem unde accusantium qui impedit architecto sunt. Iusto pariatur dolore cupiditate quaerat, eum ullam! Animi, maxime.</p>
          </div>} />
          <Route path="export" element={<div>Export Page</div>} />
          <Route path="loversr" element={<div>Loversr Page</div>} />
          <Route path="dashboard" element={<div>Dashboard Page</div>} />
          <Route path="settings" element={<div>Settings Page</div>} />
        </Route>
      </Routes>
    </Router>
  );
}

export default App;
