import React, { useEffect, useState } from "react";
import "./Header.css";
import { useNavigate, Link, useLocation } from "react-router-dom";
import { FaMoon, FaBars, FaTimes } from "react-icons/fa";
import logo from "../img/quickJobLogo.png";

const Header = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [userName, setUserName] = useState("");
  const [menuOpen, setMenuOpen] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const userPhoto = "https://via.placeholder.com/40";

  useEffect(() => {
    const firstName = sessionStorage.getItem("firstName");
    const lastName = sessionStorage.getItem("lastName");

    if (firstName && lastName) {
      setUserName(`${firstName} ${lastName}`);
      setIsLoggedIn(true);
    } else {
      setIsLoggedIn(false);
    }
  }, [location]);

  const handleLogoClick = () => {
    navigate("/");
  };

  const toggleMenu = () => {
    setMenuOpen(!menuOpen);
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
        <img className="logo" src={logo} alt="QuickJob Logo" onClick={handleLogoClick} />
        <div className="menu-icon" onClick={toggleMenu}>
          {menuOpen ? <FaTimes className="hamburger-icon" /> : <FaBars className="hamburger-icon" />}
        </div>
        <nav className={`navbar ${menuOpen ? "active" : ""}`}>
          {!isLoggedIn && (
            <>
              <Link to="/register" className="nav-link" onClick={() => setMenuOpen(false)}>
                Register
              </Link>
              <Link to="/login" className="nav-link" onClick={() => setMenuOpen(false)}>
                Login
              </Link>
            </>
          )}
          {isLoggedIn && (
            <button className="nav-link logout-button" onClick={handleLogout}>
              Logout
            </button>
          )}
        </nav>
        <div className="user-info">
          <div className="dark-mode-toggle">
            <FaMoon className="dark-mode-icon" />
          </div>
          <div className="user-profile">
            <img src={userPhoto} alt="User" className="user-photo" />
            <span className="user-name">{userName || "Guest"}</span>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
