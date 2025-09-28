import React, { useState } from "react";
import axios from "axios";
import user_icon from "../../assets/person.png";
import password_icon from "../../assets/password.png";
import { Link, useNavigate } from "react-router-dom";
import "../../Style/login.css";

const Login = () => {
  const [username, setUsername] = useState(""); 
  const [password, setPassword] = useState("");
  const navigate = useNavigate(); 

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post(
        "http://localhost:5000/api/auth/login",
        { username, password },
        { headers: { "Content-Type": "application/json" } }
      );

      console.log("Login success:", response.data);

      if (response.data.token) {
        localStorage.setItem("token", response.data.token);
        navigate("/"); // redirect after login
      }
    } catch (err) {
      console.error("Login failed:", err.response?.data || err.message);
      alert(err.response?.data?.message || "Login failed!");
    }
  };

  return (
    <div className="page-wrapper">
      <div className="container">
        <div className="header">
          <h2 className="text">Login</h2>
          <div className="underline"></div>
        </div>

        <form onSubmit={handleLogin}>
          <div className="input-field">
            <img src={user_icon} alt="User" />
            <input
              type="text"
              placeholder="Enter your username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
              autoComplete="username"
            />
          </div>

          <div className="input-field">
            <img src={password_icon} alt="Password" />
            <input
              type="password"
              placeholder="Enter your password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              autoComplete="current-password"
            />
          </div>

          <button type="submit">Login</button>
        </form>

        <p className="extra">
          Don’t have an account? <Link to="/register">Sign up</Link>
        </p>
      </div>
    </div>
  );
};

export default Login;
