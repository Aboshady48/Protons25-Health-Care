import React, { useState, useEffect } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { FiMenu, FiX, FiLogOut } from "react-icons/fi";
import "../../Style/Navbar.css";
import eira_logo from "../../../assets/eira_logo.jpeg";

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [token, setToken] = useState(localStorage.getItem("token"));
  const navigate = useNavigate();
  const location = useLocation();

  // ✅ Recheck token whenever route changes
  useEffect(() => {
    setToken(localStorage.getItem("token"));
  }, [location.pathname]);

  const handleLogout = () => {
    localStorage.removeItem("token");
    setToken(null);
    navigate("/login");
  };

  return (
    <nav className="navbar">
      {/* Logo */}
      <Link to={token ? "/" : "/login"}>
        <img src={eira_logo} alt="Logo" className="logo" />
      </Link>

      {/* Desktop Links */}
      <ul className="nav-links">
        {token ? (
          <>
            <li><Link to="/" className="nav-btn">Home</Link></li>
            <li><Link to="/about" className="nav-btn">About</Link></li>
            <li><Link to="/community" className="nav-btn">Community</Link></li>
            <li><Link to="/streak" className="nav-btn">Streak</Link></li>
            <li><Link to="/blog" className="nav-btn">Blog</Link></li>
            <li><Link to="/ask" className="nav-btn">Ask</Link></li>
            <li>
              <button onClick={handleLogout} className="nav-btn">
                <FiLogOut style={{ marginRight: "6px" }} /> Logout
              </button>
            </li>
          </>
        ) : (
          <>
            <li><Link to="/login" className="nav-btn">Login</Link></li>
            <li><Link to="/register" className="nav-btn">Register</Link></li>
          </>
        )}
      </ul>

      {/* Mobile Menu Toggle */}
      <div className="menu-toggle" onClick={() => setIsOpen((prev) => !prev)}>
        {isOpen ? <FiX /> : <FiMenu />}
      </div>

      {/* Sidebar (Mobile) */}
      {isOpen && (
        <ul className="sidebar">
          {/* Close Button */}
          <button className="close-btn" onClick={() => setIsOpen(false)}>
            <FiX />
          </button>

          {token ? (
            <>
              <li><Link to="/" onClick={() => setIsOpen(false)} className="nav-btn">Home</Link></li>
              <li><Link to="/about" onClick={() => setIsOpen(false)} className="nav-btn">About</Link></li>
              <li><Link to="/community" onClick={() => setIsOpen(false)} className="nav-btn">Community</Link></li>
              <li><Link to="/streak" onClick={() => setIsOpen(false)} className="nav-btn">Streak</Link></li>
              <li><Link to="/blog" onClick={() => setIsOpen(false)} className="nav-btn">Blog</Link></li>
              <li><Link to="/ask" onClick={() => setIsOpen(false)} className="nav-btn">Ask</Link></li>
              <li>
                <button onClick={handleLogout} className="nav-btn">
                  <FiLogOut style={{ marginRight: "6px" }} /> Logout
                </button>
              </li>
            </>
          ) : (
            <>
              <li><Link to="/login" onClick={() => setIsOpen(false)} className="nav-btn">Login</Link></li>
              <li><Link to="/register" onClick={() => setIsOpen(false)} className="nav-btn">Register</Link></li>
            </>
          )}
        </ul>
      )}
    </nav>
  );
};

export default Navbar;
