import React from 'react';
import './Header.css';
import { useNavigate, Link } from 'react-router-dom';
import { FaMoon } from 'react-icons/fa'; // Dark mode icon

const Header = () => {
  const navigate = useNavigate();
  const userName = "Abhi Patel"; 
  const userPhoto = "https://via.placeholder.com/40"; 

  // Function to navigate to the home page
  const handleLogoClick = () => {
    navigate('/');
  };

  return (
    <header className="header">
      <div className="navbar-container">
        <h1 className="logo" onClick={handleLogoClick}>QuickJob</h1>
        <nav className="navbar">
          <Link to="/register" className="nav-link">Register</Link>
          <Link to="/login" className="nav-link">Login</Link>
          <Link to="/account" className="nav-link">Account</Link>
        </nav>
        <div className="user-info">
          <div className="dark-mode-toggle">
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
