import React, { useState } from "react";
import axios from "axios";
import user_icon from "../../assets/person.png";
import email_icon from "../../assets/email.png";
import password_icon from "../../assets/password.png";
import { Link, useNavigate } from "react-router-dom";
import "../../Style/register.css";

const Register = () => {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleRegister = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post(
        "http://localhost:5000/api/auth/register",
        { username, email, password },
        { headers: { "Content-Type": "application/json" } }
      );

      console.log("Registration success:", response.data);
      alert("User registered successfully!");

      // Redirect to login after success
      navigate("/login");
    } catch (err) {
      console.error("Registration error:", err.response?.data || err.message);
      alert(err.response?.data?.message || "Something went wrong!");
    }
  };

  return (
    <div className="page-wrapper">
      <div className="container">
        <div className="header">
          <h2 className="text">Register</h2>
          <div className="underline"></div>
        </div>

        <form onSubmit={handleRegister}>
          <div className="input-field">
            <img src={user_icon} alt="user" />
            <input
              type="text"
              placeholder="Enter your username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
            />
          </div>

          <div className="input-field">
            <img src={email_icon} alt="email" />
            <input
              type="email"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          <div className="input-field">
            <img src={password_icon} alt="password" />
            <input
              type="password"
              placeholder="Enter your password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          <button type="submit">Sign Up</button>
        </form>

        <div className="extra">
          <p>
            Already have an account? <Link to="/login">Login</Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Register;
