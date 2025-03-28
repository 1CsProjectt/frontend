import React from "react";
import { BrowserRouter as Router, Routes, Route ,  Navigate  } from "react-router-dom";
import Login from "./Pages/Login";
import ForgotPassword from "./Pages/ForgotPassword";
import CheckEmail from "./Pages/CheckEmail";
import ResetPassword from "./Pages/ResetPassword";
import AdminDashboard from "./Pages/AdminDashboard";
import UserManagementTabs from "./components/UserManagementTabs";
import SessionsManagementTabs from "./components/SessionsManagementTabs";
import TopicsValidationPage from "./Pages/TopicsValidationPage";
import "./styles/App.css";
import HelpPage from "./Pages/HelpPage";
import PFEPage from "./Pages/PFEPage";
import SettingsPage from "./Pages/SettingsPage";
import NotificationsPage from "./Pages/NotificationsPage";
import LoversPage from "./Pages/LoversPage";
import ExplorePage from "./Pages/ExplorePage";
/* import NavBar from "./components/Navbar"; */
import TeamFormationPage from "./Pages/TeamformationPage";
import ExistedTeamSeemore from "./components/ExistedTeamSeemore";
function App() {
  return (
    <Router>  
      <Routes>
        {//<Route path="/" element={<Navigate to="/admin" replace />} />
        }
        
        
        <Route path="/" element={<PFEPage/>} />
        <Route path="/admin" element={<AdminDashboard/>} />
        <Route path="/ForgotPassword" element={<ForgotPassword />} />
        <Route path="/CheckEmail" element={<CheckEmail />} />
        {/* Route with dynamic token */}
        <Route path="/auth/reset-password/:token" element={<ResetPassword />} />
        {/* Protected Routes (Inside AdminDashboard) */}
        {/* Admin Dashboard with Nested Routes */}

        <Route path="/auth/reset-password/:token" element={<ResetPassword />} />
        <Route path="/help" element={<HelpPage />} />
        <Route path="/pfe" element={<PFEPage />} />
        <Route path="/settings" element={<SettingsPage />} />
        <Route path="/notifications" element={<NotificationsPage />} />
        <Route path="/lovers" element={<LoversPage />} />
        <Route path="/TeamFormationPage" element={<TeamFormationPage/>} />
        <Route path="/pfe/explore" element={<ExplorePage />} />
        <Route path="/pfe/explore/:projectId" element={<ExplorePage />} />
        <Route path="/admin" element={<AdminDashboard />}>
        

        <Route path="/admin/sessions/topic-validation" element={<TopicsValidationPage />}/>
        <Route index element={<UserManagementTabs />} />{/* Default child route (renders when at /admin) */}
          <Route path="users" element={<UserManagementTabs />} />
          <Route path="sessions" element={<SessionsManagementTabs />} />
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
