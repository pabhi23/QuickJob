import React, { useState } from 'react';
import './Header.css';
import { useNavigate, Link } from 'react-router-dom';
import { FaMoon, FaBars, FaTimes } from 'react-icons/fa'; // Dark mode and hamburger icons
import logo from '../Img/Logo.png';

const Header = () => {
  const [menuOpen, setMenuOpen] = useState(false); // State to handle menu toggle
  const navigate = useNavigate();
  const userName = "Abhi Patel";
  const userPhoto = "https://via.placeholder.com/40";

  // Function to navigate to the home page
  const handleLogoClick = () => {
    navigate('/');
  };

  // Function to toggle the menu
  const toggleMenu = () => {
    setMenuOpen(!menuOpen);
  };

  return (
    <header className="header">
      <div className="navbar-container">
        <img 
          src={logo} 
          alt="QuickJob Logo" 
          className="logo" 
          onClick={handleLogoClick} 
        />
        <nav className={`navbar ${menuOpen ? 'active' : ''}`}>
          <Link to="/register" className="nav-link">Register</Link>
          <Link to="/login" className="nav-link">Login</Link>
        </nav>
        <div className="user-menu">
          <div className="user-info">
            <div className="dark-mode-toggle">
              <FaMoon className="dark-mode-icon" />
            </div>
            <div className="user-profile">
              <img src={userPhoto} alt="User" className="user-photo" />
              <span className="user-name">{userName}</span>
            </div>
          </div>
          <div className="menu-icon" onClick={toggleMenu}>
            {menuOpen ? <FaTimes className="hamburger-icon" /> : <FaBars className="hamburger-icon" />}
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
