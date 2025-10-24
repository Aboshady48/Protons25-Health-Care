import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import Register from "./components/auth/register.jsx";
import Login from "./components/auth/login.jsx";
import Navbar from "./components/Navbar.jsx";
import "./Style/index.css";
import { Home } from "./components/Home.jsx";
import ProtectedRoute from "./components/auth/ProtectedRoute.jsx";
import GetAllTasks from "./components/dailyPlanner/GetAllTasks.jsx";
import { GetTaskById } from "./components/dailyPlanner/GetTaskById.jsx";
import EditTask from "./components/dailyPlanner/EditTask.jsx";
import { AboutUs } from "./components/AboutUs.jsx";
import BlogPage from "./components/BlogPage.jsx";
import StreaksPage from "./components/streak/StreaksPage.jsx";
import StreakCalendar from "./components/streak/StreakCalendar.jsx";
import AddTask from "./components/dailyPlanner/AddTask.jsx";
import Ask from "./components/Ask.jsx";
import Footer from "./components/footer/Footer.jsx";  
import CommunityPage from "./components/community/CommunityPage.jsx";
import MoodTracker from "./components/Tracker/MoodTracker.jsx";
import Biorhythm from "./components/Tracker/Biorhythm.jsx";
import IntegratedAssessment from "./components/IntegratedAssessment.jsx";

const App = () => {
  const token = localStorage.getItem("token");

  return (
    <>
      <Navbar />
      <div className="app-content">
        <Routes>
          {/* Public routes */}
          <Route
            path="/register"
            element={!token ? <Register /> : <Navigate to="/" />}
          />
          <Route
            path="/login"
            element={!token ? <Login /> : <Navigate to="/" />}
          />

          {/* Protected routes */}
          <Route path="/" element={<ProtectedRoute><Home /></ProtectedRoute>} />
          <Route path="/about" element={<ProtectedRoute><AboutUs /></ProtectedRoute>} />
          <Route path="/community" element={<ProtectedRoute><CommunityPage /></ProtectedRoute>} />
          <Route path="/streak" element={<ProtectedRoute><StreaksPage /></ProtectedRoute>} />
          <Route path="/blog" element={<ProtectedRoute><BlogPage /></ProtectedRoute>} />
          <Route path="/ask" element={<ProtectedRoute><Ask /></ProtectedRoute>} />

          {/* Task Routes */}
          <Route path="/tasks" element={<ProtectedRoute><GetAllTasks /></ProtectedRoute>} />
          <Route path="/tasks/:id" element={<ProtectedRoute><GetTaskById /></ProtectedRoute>} />
          <Route path="/tasks/:id/edit" element={<ProtectedRoute><EditTask /></ProtectedRoute>} />
          <Route path="/tasks/add" element={<ProtectedRoute><AddTask /></ProtectedRoute>} />

          {/* Mood Tracker Route */}
          <Route path="/mood" element={<ProtectedRoute><MoodTracker /></ProtectedRoute>} />

          {/* Streak Routes */}
          <Route path="/streak/calendar" element={<ProtectedRoute><StreakCalendar /></ProtectedRoute>} />
          <Route path="/biorhythm" element={<ProtectedRoute><Biorhythm /></ProtectedRoute>} />

          {/* Integrated Assessment Route */}
          <Route path="/assessment" element={<ProtectedRoute><IntegratedAssessment /></ProtectedRoute>} />

          {/* Catch-all route */}
          <Route path="*" element={<Navigate to={token ? "/" : "/login"} />} />
        </Routes>
      </div>
      <Footer />  
    </>
  );
};

export default App;