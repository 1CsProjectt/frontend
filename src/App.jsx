import React from "react";

import "./styles/App.css";

import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import { SharedStateProvider } from "./contexts/SharedStateContext"; // Importing the shared state context provider
import Login from "./Pages/Login";
import ForgotPassword from "./Pages/ForgotPassword";
import CheckEmail from "./Pages/CheckEmail";
import ResetPassword from "./Pages/ResetPassword";
import AdminDashboard from "./Pages/AdminDashboard";
import UserManagementTabs from "./components/UserManagementTabs";
import SessionsManagementTabs from "./components/SessionsManagementTabs";
import TeacherTopics from "./components/TeacherTopics";
import Addatopic from "./components/addatopic";
import TopicsValidationPage from "./Pages/TopicsValidationPage";
import SubmittedTopicsExplorePage from "./Pages/SubmittedTopicsExplorePage";
import "./styles/App.css";
import HelpPage from "./Pages/HelpPage";
import PFEPage from "./Pages/PFEPage";
import SettingsPage from "./Pages/SettingsPage";
import NotificationsPage from "./Pages/NotificationsPage";
import LoversPage from "./Pages/LoversPage";
import Layout from "./Pages/layout";
import ExplorePage from "./Pages/ExplorePage";

import AdminTeamFormationPage from "./Pages/AdminTeamFormationPage";
/* import NavBar from "./components/Navbar"; */
import TeamFormationPage from "./Pages/TeamformationPage";
import TestingTeam from "./Pages/testingTeamformation";
import TestingPFE from "./Pages/testingPFE";
function App() {
  return (
    <Router>
      <SharedStateProvider>
        {" "}
        {/* Wrap your components */}
        <Routes>
          {
            //<Route path="/" element={<Navigate to="/admin" replace />} />
          }

          <Route path="/" element={<Login />} />

          <Route path="/admin" element={<AdminDashboard />} />
          <Route path="/ForgotPassword" element={<ForgotPassword />} />
          <Route path="/CheckEmail" element={<CheckEmail />} />

          <Route path="/teacher" element={<Layout />}>
            <Route index element={<TeacherTopics />} />
            <Route path="Addatopic" element={<Addatopic />} />
          </Route>

          {/* Route with dynamic token */}
          <Route
            path="/auth/reset-password/:token"
            element={<ResetPassword />}
          />
          {/* Protected Routes (Inside AdminDashboard) */}
          {/* Admin Dashboard with Nested Routes */}

          <Route
            path="/auth/reset-password/:token"
            element={<ResetPassword />}
          />
          <Route path="/help" element={<HelpPage />} />
          <Route path="/pfe" element={<PFEPage />} />
          <Route path="/login" element={<Login />} />
          <Route path="/settings" element={<SettingsPage />} />
          <Route path="/notifications" element={<NotificationsPage />} />
          <Route path="/lovers" element={<LoversPage />} />
          <Route path="/TeamFormationPage" element={<TeamFormationPage />} />
          <Route path="/pfe/explore" element={<ExplorePage />} />
          <Route path="/testingteam" element={<TestingTeam />} />
          <Route path="/testingpfe" element={<TestingPFE />} />

          <Route
            path="/admin/sessions/topic-validation/submitted-topic-explore"
            element={<SubmittedTopicsExplorePage />}
          />
          <Route path="/pfe/explore/:projectId" element={<ExplorePage />} />
          <Route path="/admin" element={<AdminDashboard />}>
            <Route
              path="/admin/sessions/admin-team-formation"
              element={<AdminTeamFormationPage />}
            />
            <Route
              path="/admin/sessions/topic-validation"
              element={<TopicsValidationPage />}
            />
            <Route index element={<UserManagementTabs />} />
            {/* Default child route (renders when at /admin) */}
            <Route path="users" element={<UserManagementTabs />} />
            <Route path="sessions" element={<SessionsManagementTabs />} />
            <Route path="export" element={<div>Export Page</div>} />
            <Route path="loversr" element={<div>Loversr Page</div>} />
            <Route path="dashboard" element={<div>Dashboard Page</div>} />
            <Route path="settings" element={<div>Settings Page</div>} />
          </Route>
        </Routes>
      </SharedStateProvider>
    </Router>
  );
}

export default App;
