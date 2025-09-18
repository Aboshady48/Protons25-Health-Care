
import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import Register from "./components/auth/register.jsx";
import Login from "./components/auth/login.jsx";
import Navbar from "./components/navbar/Navbar.jsx";
import "./Style/index.css";
import { Home } from "./components/Home.jsx";
import ProtectedRoute from "./components/auth/ProtectedRoute.jsx";

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
        <Route path="/about" element={<ProtectedRoute><div>About Page</div></ProtectedRoute>} />
        <Route path="/community" element={<ProtectedRoute><div>Community Page</div></ProtectedRoute>} />
        <Route path="/streak" element={<ProtectedRoute><div>Streak Page</div></ProtectedRoute>} />
        <Route path="/blog" element={<ProtectedRoute><div>Blog Page</div></ProtectedRoute>} />
        <Route path="/ask" element={<ProtectedRoute><div>Ask Page</div></ProtectedRoute>} />
        
      </Routes>
    </>
  );
};

export default App;

