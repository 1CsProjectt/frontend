import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Login from "./Pages/Login";
import ForgotPassword from "./Pages/ForgotPassword";
import CheckEmail from "./Pages/CheckEmail";
import ResetPassword from "./Pages/ResetPassword";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/ForgotPassword" element={<ForgotPassword />} />
        <Route path="/CheckEmail" element={<CheckEmail />} />
        {/* Route with dynamic token */}
        <Route path="/auth/reset-password/:token" element={<ResetPassword />} />
      </Routes>
    </Router>
  );
}

export default App;
