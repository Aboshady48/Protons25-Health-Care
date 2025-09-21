// App.jsx
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
import StreaksPage from "./components/StreaksPage.jsx"; 

const App = () => {
  const token = localStorage.getItem("token");

  return (
    <>
      <Navbar />
      <Routes>
        {/* Public routes - redirect to / if already logged in */}
        <Route path="/register" element={!token ? <Register /> : <Navigate to="/" />} />
        <Route path="/login" element={!token ? <Login /> : <Navigate to="/" />} />

        {/* Protected routes */}
        <Route path="/" element={<ProtectedRoute><Home /></ProtectedRoute>} />
        <Route path="/about" element={<ProtectedRoute><AboutUs /></ProtectedRoute>} />
        <Route path="/community" element={<ProtectedRoute><div>Community Page</div></ProtectedRoute>} />
        <Route path="/streak" element={<ProtectedRoute><StreaksPage /></ProtectedRoute>} /> {/* ✅ fixed */}
        <Route path="/blog" element={<ProtectedRoute><div>Blog Page</div></ProtectedRoute>} />
        <Route path="/ask" element={<ProtectedRoute><div>Ask Page</div></ProtectedRoute>} />
        
        {/* Task Routes - Protected */}
        <Route path="/tasks" element={<ProtectedRoute><GetAllTasks /></ProtectedRoute>} />
        <Route path="/tasks/:id" element={<ProtectedRoute><GetTaskById /></ProtectedRoute>} />
        <Route path="/tasks/:id/edit" element={<ProtectedRoute><EditTask /></ProtectedRoute>} /> 

        {/* Catch-all route */}
        <Route path="*" element={<Navigate to={token ? "/" : "/login"} />} />
      </Routes>
    </>
  );
};

export default App; 