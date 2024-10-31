import React, { useState, useEffect } from 'react';
import { useNavigate, Link, useLocation } from 'react-router-dom';
import { FaMoon, FaTimes, FaBars } from 'react-icons/fa'; // Dark mode icon
import './Header.css'; 
import logo from '../Img/quickJobLogo.png'

const Header = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [userName, setUserName] = useState("");
  const [menuOpen, setMenuOpen] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  const getInitialDarkMode = () => {
    try {
      const savedMode = JSON.parse(localStorage.getItem("darkMode"));
      return typeof savedMode === "boolean" ? savedMode : false;
    } catch (error) {
      return false;
    }
  };
  const [darkMode, setDarkMode] = useState(getInitialDarkMode);
  const userPhoto = "https://via.placeholder.com/40";
  // const logo = "https://via.placeholder.com/100";

  useEffect(() => {
    const firstName = sessionStorage.getItem("firstName");
    const lastName = sessionStorage.getItem("lastName");

    if (firstName && lastName) {
      setUserName(`${firstName} ${lastName}`);
      setIsLoggedIn(true);
    } else {
      setIsLoggedIn(false);
    }

    if (darkMode) {
      document.body.classList.add("dark-mode");
    } else {
      document.body.classList.remove("dark-mode");
    }
  }, [location, darkMode]);

  const toggleMenu = () => setMenuOpen(!menuOpen);

  const toggleDarkMode = () => {
    const newDarkMode = !darkMode;
    setDarkMode(newDarkMode);
    document.body.classList.toggle("dark-mode", newDarkMode);
    localStorage.setItem("darkMode", JSON.stringify(newDarkMode));
  };

  const handleLogout = () => {
    sessionStorage.clear();
    setIsLoggedIn(false);
    setUserName("");
    navigate("/");
  };

  return (
    <header className="header">
      <div className="navbar-container">
        <img
          className="logo"
          src={logo}
          alt="QuickJob Logo"
          onClick={() => navigate("/")}
        />
        <div className="menu-icon" onClick={toggleMenu}>
          {menuOpen ? (
            <FaTimes className="hamburger-icon" />
          ) : (
            <FaBars className="hamburger-icon" />
          )}
        </div>
        <nav className={`navbar ${menuOpen ? "active" : ""}`}>
          {!isLoggedIn ? (
            <>
              <Link
                to="/register"
                className="nav-link"
                onClick={() => setMenuOpen(false)}
              >
                Register
              </Link>
              <Link
                to="/login"
                className="nav-link"
                onClick={() => setMenuOpen(false)}
              >
                Login
              </Link>
            </>
          ) : (
            <button className="nav-link logout-button" onClick={handleLogout}>
              Logout
            </button>
          )}
        </nav>
        <div className="user-info">
          <div className="dark-mode-toggle" onClick={toggleDarkMode}>
            <FaMoon className="dark-mode-icon" />
          </div>
          <div className="user-profile">
            <img src={userPhoto} alt="User" className="user-photo" />
            <span className="user-name">{userName}</span>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
