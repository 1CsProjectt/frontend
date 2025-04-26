import React from "react";

import "./styles/App.css";

<<<<<<< HEAD
import {
  BrowserRouter as Router,
  Routes,
  Route,
} from "react-router-dom";
=======
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
>>>>>>> 943101464b6bffed58bab3243f0feadb759f7e10
import { SharedStateProvider } from "./contexts/SharedStateContext";
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
import PFEStudentPage from "./Pages/PFEStudentPage";
import SettingsPage from "./Pages/SettingsPage";
import NotificationsPage from "./Pages/NotificationsPage";
import Layout from "./Pages/layout";
import ExplorePage from "./Pages/ExplorePage";
import StudentMeetingsPage from "./Pages/StudentMeetingsPage";
import AdminTeamFormationPage from "./Pages/AdminTeamFormationPage";
import TeamFormationPage from "./Pages/TeamformationPage";
<<<<<<< HEAD
import SeeMoreMetting from "./components/SeeMoreMettingHistory";
=======
import TeacherPfePage from "./components/teacherpfepage";
import TeamSelectionTeacher from "./Pages/teamselectionteacher";
import AdminManagePreferencesPage from "./Pages/AdminManagePreferencesPage"
>>>>>>> 943101464b6bffed58bab3243f0feadb759f7e10
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
        
          
          <Route path="/ForgotPassword" element={<ForgotPassword />} />
          <Route path="/CheckEmail" element={<CheckEmail />} />

          <Route path="/teacher" element={<Layout />}>
            <Route index element={<TeacherPfePage />} />
            <Route path="mytopics" element={<TeacherTopics />} />
            <Route path="Addatopic" element={<Addatopic />} />
            <Route path="teamselection" element={<TeamSelectionTeacher />} />
          </Route>

          {/* Route with dynamic token */}
          <Route
            path="/auth/reset-password/:token"
            element={<ResetPassword />}
          />
          {/* Protected Routes (Inside AdminDashboard) */}
          {/* Admin Dashboard with Nested Routes */}

          <Route path="/help" element={<HelpPage />} />
          <Route path="/pfe-student" element={<PFEStudentPage />} />
          <Route path="/login" element={<Login />} />
          <Route path="/settings" element={<SettingsPage />} />
          <Route path="/notifications" element={<NotificationsPage />} />
          <Route path="/StudentMeetingsPage" element={<StudentMeetingsPage />} />
          <Route path="/StudentMeetingsPage/SeeMore" element={<SeeMoreMetting/>} />
          <Route path="/TeamFormationPage" element={<TeamFormationPage />} />
          <Route path="/pfe-student/explore" element={<ExplorePage />} />

<<<<<<< HEAD
        
          <Route
            path="/admin/sessions/topic-validation/submitted-topic-explore"
            element={<SubmittedTopicsExplorePage />}
          />
=======
>>>>>>> 943101464b6bffed58bab3243f0feadb759f7e10
          <Route path="/pfe/explore/:projectId" element={<ExplorePage />} />
        <Route path="/admin" element={<AdminDashboard />}>
          <Route index element={<UserManagementTabs />} />
          <Route path="users" element={<UserManagementTabs />} />
          <Route path="sessions" element={<SessionsManagementTabs/>}/>
          <Route path="sessions/manage-preferences" element={<AdminManagePreferencesPage/>}/>
          <Route path="sessions/admin-team-formation" element={<AdminTeamFormationPage />} />
          <Route path="sessions/topic-validation" element={<TopicsValidationPage />} />
          <Route path="sessions/topic-validation/published-topic-explore" element={<SubmittedTopicsExplorePage />} />
          <Route path="sessions/topic-validation/submitted-topic-explore" element={<SubmittedTopicsExplorePage />} />
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
