import React, { useState } from "react";
import { Link } from "react-router-dom";
import "../../Style/Navbar.css";
import eira_logo from "../../../assets/eira_logo.jpeg";

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <nav className="navbar">
      {/* Logo */}
      <Link to="/">
        <img src={eira_logo} alt="Logo" className="logo" />
      </Link>

      {/* Desktop Menu */}
      <ul className="nav-links">
        <li><Link to="/">Home</Link></li>
        <li><Link to="/about">About</Link></li>
        <li><Link to="/community">Community</Link></li>
        <li><Link to="/streak">Streak</Link></li>
        <li><Link to="/blog">Blog</Link></li>
        <li><Link to="/ask">Ask</Link></li>
      </ul>

      {/* Mobile Toggle */}
      <div className="menu-toggle" onClick={() => setIsOpen(prev => !prev)}>
        ☰
      </div>

      {/* Sidebar (Mobile) */}
      {isOpen && (
        <ul className="sidebar">
          <li><Link to="/about" onClick={() => setIsOpen(false)}>About</Link></li>
          <li><Link to="/community" onClick={() => setIsOpen(false)}>Community</Link></li>
          <li><Link to="/streak" onClick={() => setIsOpen(false)}>Streak</Link></li>
          <li><Link to="/blog" onClick={() => setIsOpen(false)}>Blog</Link></li>
          <li><Link to="/ask" onClick={() => setIsOpen(false)}>Ask</Link></li>
        </ul>
      )}
    </nav>
  );
};

export default Navbar;
