import React, { useState, useRef, useEffect } from "react";
import axios from "axios";
import user_icon from "../assets/person.png";
import password_icon from "../assets/password.png";
import "./Login.css"
import { Link } from "react-router-dom";

const Login = () => {
  const userRef = useRef();
  const errRef = useRef();

  const [username, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errMsg, setErrMsg] = useState("");



  useEffect(() => {
    userRef.current.focus(); 
  }, []);

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post("http://localhost:5000/api/auth/login", {
        email,
        password,
      });
      console.log("Login success:", response.data);

      
    } catch (err) {
      console.error(err);
      setErrMsg(err.response?.data?.message || "Login failed");
      errRef.current.focus();
    }
  };

  return (
    <div className="container">
      <div className="header">
        <div className="text">Login</div>
        <div className="underline"></div>
      </div>



      <form onSubmit={handleLogin}>
        <div className="inputs">
          <div className="input">
            <img src={user_icon} alt="user name " />
            <input
              type="user name "
              placeholder="user name "
              ref={userRef}
              value={username}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          <div className="input">
            <img src={password_icon} alt="password" />
            <input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
        </div>

        <button type="submit" className="submit">
          Login
        </button>
      </form>

      <p className="signup-text">
        Do not have an account?{" "}
        <Link to="/Register">Click here to sign up</Link>
      </p>
    </div>
  );
};

export default Login;
