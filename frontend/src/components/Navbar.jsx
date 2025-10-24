import React, { useState, useEffect } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { FiLogOut } from "react-icons/fi";
import "../Style/Navbar.css";
import eira_logo from "../../assets/eira_logo.jpeg";

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [token, setToken] = useState(localStorage.getItem("token"));
  const [isScrolled, setIsScrolled] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const handleScroll = () => {
      const scrollTop = window.scrollY;
      setIsScrolled(scrollTop > 50);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    setToken(localStorage.getItem("token"));
  }, [location.pathname]);

  useEffect(() => {
    setIsOpen(false);
  }, [location.pathname]);

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }

    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  const handleLogout = () => {
    localStorage.removeItem("token");
    setToken(null);
    setIsOpen(false);
    navigate("/login");
  };

  const toggleSidebar = () => {
    setIsOpen(prev => !prev);
  };

  const closeSidebar = () => {
    setIsOpen(false);
  };

  const handleOverlayClick = (e) => {
    if (e.target === e.currentTarget) {
      setIsOpen(false);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Escape') {
      setIsOpen(false);
    }
  };

  return (
    <nav className={`navbar ${isScrolled ? 'scrolled' : ''}`}>
      {/* Logo */}
      <Link to={token ? "/" : "/login"} aria-label="Go to home page">
        <img src={eira_logo} alt="Eira Logo" className="logo" />
      </Link>

      <ul className="nav-links">
        {token ? (
          <>
            <li>
              <Link 
                to="/" 
                className="nav-link"
                aria-current={location.pathname === "/" ? "page" : undefined}
              >
                Home
              </Link>
            </li>
            <li>
              <Link 
                to="/about" 
                className="nav-link"
                aria-current={location.pathname === "/about" ? "page" : undefined}
              >
                About
              </Link>
            </li>
            <li>
              <Link 
                to="/community" 
                className="nav-link"
                aria-current={location.pathname === "/community" ? "page" : undefined}
              >
                Community
              </Link>
            </li>
            <li>
              <Link 
                to="/streak" 
                className="nav-link"
                aria-current={location.pathname === "/streak" ? "page" : undefined}
              >
                Streak
              </Link>
            </li>
            <li>
              <Link 
                to="/blog" 
                className="nav-link"
                aria-current={location.pathname === "/blog" ? "page" : undefined}
              >
                Blog
              </Link>
            </li>
            <li>
              <Link 
                to="/ask" 
                className="nav-link"
                aria-current={location.pathname === "/ask" ? "page" : undefined}
              >
                Ask
              </Link>
            </li>
            <li>
              <button 
                onClick={handleLogout} 
                className="nav-link"
                aria-label="Logout"
                style={{ background: '#3e5f44', border: 'none', cursor: 'pointer', padding: 0, font: 'inherit' }}
              >
                <FiLogOut aria-hidden="true" /> 
                Logout
              </button>
            </li>
          </>
        ) : (
          <>
            <li>
              <Link 
                to="/login" 
                className="nav-link"
                aria-current={location.pathname === "/login" ? "page" : undefined}
              >
                Login
              </Link>
            </li>
            <li>
              <Link 
                to="/register" 
                className="nav-link"
                aria-current={location.pathname === "/register" ? "page" : undefined}
              >
                Register
              </Link>
            </li>
          </>
        )}
      </ul>

      <button 
        className={`menu-toggle ${isOpen ? 'open' : ''}`}
        onClick={toggleSidebar}
        onKeyDown={handleKeyDown}
        aria-label={isOpen ? "Close menu" : "Open menu"}
        aria-expanded={isOpen}
        aria-controls="mobile-sidebar"
      >
        <span className="hamburger-line"></span>
        <span className="hamburger-line"></span>
        <span className="hamburger-line"></span>
      </button>

      {isOpen && (
        <div 
          className="sidebar-overlay" 
          onClick={handleOverlayClick}
          onKeyDown={handleKeyDown}
          role="dialog"
          aria-modal="true"
          aria-labelledby="mobile-menu-title"
        >
          <ul className="sidebar" id="mobile-sidebar">
            <button 
              className="close-btn" 
              onClick={closeSidebar}
              onKeyDown={handleKeyDown}
              aria-label="Close menu"
            >
              ×
            </button>

            <h2 id="mobile-menu-title" className="sr-only">Navigation Menu</h2>

            {token ? (
              <>
                <li>
                  <Link 
                    to="/" 
                    onClick={closeSidebar} 
                    className="sidebar-link"
                    aria-current={location.pathname === "/" ? "page" : undefined}
                  >
                    Home
                  </Link>
                </li>
                <li>
                  <Link 
                    to="/about" 
                    onClick={closeSidebar} 
                    className="sidebar-link"
                    aria-current={location.pathname === "/about" ? "page" : undefined}
                  >
                    About
                  </Link>
                </li>
                <li>
                  <Link 
                    to="/community" 
                    onClick={closeSidebar} 
                    className="sidebar-link"
                    aria-current={location.pathname === "/community" ? "page" : undefined}
                  >
                    Community
                  </Link>
                </li>
                <li>
                  <Link 
                    to="/streak" 
                    onClick={closeSidebar} 
                    className="sidebar-link"
                    aria-current={location.pathname === "/streak" ? "page" : undefined}
                  >
                    Streak
                  </Link>
                </li>
                <li>
                  <Link 
                    to="/blog" 
                    onClick={closeSidebar} 
                    className="sidebar-link"
                    aria-current={location.pathname === "/blog" ? "page" : undefined}
                  >
                    Blog
                  </Link>
                </li>
                <li>
                  <Link 
                    to="/ask" 
                    onClick={closeSidebar} 
                    className="sidebar-link"
                    aria-current={location.pathname === "/ask" ? "page" : undefined}
                  >
                    Ask
                  </Link>
                </li>
                <li>
                  <button 
                    onClick={handleLogout} 
                    className="sidebar-logout-btn"
                    aria-label="Logout"
                  >
                    <FiLogOut aria-hidden="true" /> 
                    Logout
                  </button>
                </li>
              </>
            ) : (
              <>
                <li>
                  <Link 
                    to="/login" 
                    onClick={closeSidebar} 
                    className="sidebar-link"
                    aria-current={location.pathname === "/login" ? "page" : undefined}
                  >
                    Login
                  </Link>
                </li>
                <li>
                  <Link 
                    to="/register" 
                    onClick={closeSidebar} 
                    className="sidebar-link"
                    aria-current={location.pathname === "/register" ? "page" : undefined}
                  >
                    Register
                  </Link>
                </li>
              </>
            )}
          </ul>
        </div>
      )}

      <style jsx>{`
        .sr-only {
          position: absolute;
          width: 1px;
          height: 1px;
          padding: 0;
          margin: -1px;
          overflow: hidden;
          clip: rect(0, 0, 0, 0);
          white-space: nowrap;
          border: 0;
        }
      `}</style>
    </nav>
  );
};

export default Navbar;