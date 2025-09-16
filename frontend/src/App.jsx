import React from "react";
import {  BrowserRouter, Routes, Route, Link, Router  } from "react-router-dom";
import Register from "./componets/register.jsx";
import Login from "./componets/login.jsx";
import "./style/index.css";


function App() {
  return (
  <div>
     <BrowserRouter>
    
      <Routes>
      
        <Route path="/Register" element={<Register />} />
        <Route path="/Login" element={<Login/>} />
      </Routes>
    </BrowserRouter>
  </div>
  );
}

export default App;
  <BrowserRouter>
    
      <Routes>
      
        <Route path="/Register" element={<Register />} />
        <Route path="/Login" element={<Login/>} />
      </Routes>
    </BrowserRouter>
 