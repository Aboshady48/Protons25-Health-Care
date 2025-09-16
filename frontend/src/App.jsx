import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Register from "./componets/register.jsx";
import Login from "./componets/login.jsx";
import Navbar from "./component/navbar/Navbar";
import "./style/index.css";

const App = () => {
  return (
    <BrowserRouter>
      <Navbar />
      <Routes>
        <Route path="/Register" element={<Register />} />
        <Route path="/Login" element={<Login />} />
      </Routes>
    </BrowserRouter>
  );
};

export default App;
