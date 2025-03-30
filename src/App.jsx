import React from "react";
import "./styles/App.css";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Login from "./Pages/Login";
import ForgotPassword from "./Pages/ForgotPassword";
import CheckEmail from "./Pages/CheckEmail";
import ResetPassword from "./Pages/ResetPassword";

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
        <Route path="/" element={<PFEPage/>} />
        <Route path="/ForgotPassword" element={<ForgotPassword />} />
        <Route path="/CheckEmail" element={<CheckEmail />} />
        {/* Route with dynamic token */}
        <Route path="/auth/reset-password/:token" element={<ResetPassword />} />
        <Route path="/help" element={<HelpPage />} />
        <Route path="/pfe" element={<PFEPage />} />
        <Route path="/settings" element={<SettingsPage />} />
        <Route path="/notifications" element={<NotificationsPage />} />
        <Route path="/lovers" element={<LoversPage />} />
        <Route path="/TeamFormationPage" element={<TeamFormationPage/>} />
        <Route path="/pfe/explore" element={<ExplorePage />} />
        <Route path="/pfe/explore/:projectId" element={<ExplorePage />} />
       
        

      </Routes>
    </Router>
  );
}

export default App;
