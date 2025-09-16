import React from "react";
import { Routes, Route } from "react-router-dom";
import Register from "./components/auth/register.jsx";
import Login from "./components/auth/login.jsx";
import Navbar from "./components/navbar/Navbar.jsx";
import "./Style/index.css"; 
import { Home } from "./components/Home.jsx";

const App = () => {
  return (
    <>
      <Navbar />
      <Routes>
        <Route path="/register" element={<Register />} />
        <Route path="/login" element={<Login />} />
        <Route path="/" element={<Home />} />
      </Routes>
    </>
  );
};

export default App;
