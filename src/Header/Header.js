import React, { useEffect, useState } from "react";
import "./Header.css";
import { useNavigate, Link, useLocation } from "react-router-dom";
import { FaMoon, FaBars, FaTimes } from "react-icons/fa";
import logo from "../img/quickJobLogo.png";

const Header = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [userName, setUserName] = useState("");
  const [profilePic, setProfilePic] = useState(null); // State for profile picture
  const [menuOpen, setMenuOpen] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userRole, setUserRole] = useState(""); // State for user role

  const getInitialDarkMode = () => {
    try {
      const savedMode = JSON.parse(localStorage.getItem("darkMode"));
      return typeof savedMode === "boolean" ? savedMode : false;
    } catch (error) {
      return false;
    }
  };

  const [darkMode, setDarkMode] = useState(getInitialDarkMode);

  useEffect(() => {
    const firstName = sessionStorage.getItem("firstName");
    const lastName = sessionStorage.getItem("lastName");
    const role = sessionStorage.getItem("registerAs"); // Get user role from sessionStorage
    const profilePicUrl = sessionStorage.getItem("profilePic"); // Get profile picture from sessionStorage
    console.log(sessionStorage.getItem("profilePic"));
    if (firstName && lastName) {
      setUserName(`${firstName} ${lastName}`);
      setIsLoggedIn(true);
    } else {
      setIsLoggedIn(false);
    }

    if (role) {
      setUserRole(role); // Set user role
    }

    if (profilePicUrl) {
      setProfilePic(`http://localhost:5000${profilePicUrl}`); // Construct full URL
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
    setUserRole(""); // Clear user role
    setProfilePic(null); // Clear profile picture
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
          <div className="navbar-links">
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
              <>
                {/* Admin Routes - Only visible to admins */}
                {userRole === "employer" && (
                  <>
                    <Link
                      to="/AdminDashboard"
                      className="nav-link"
                      onClick={() => setMenuOpen(false)}
                    >
                      Admin Dashboard
                    </Link>
                    <Link
                      to="/jobPosting"
                      className="nav-link"
                      onClick={() => setMenuOpen(false)}
                    >
                      Job Posting
                    </Link>
                    <Link
                      to="/payment"
                      className="nav-link"
                      onClick={() => setMenuOpen(false)}
                    >
                      Payments Dashboard
                    </Link>
                  </>
                )}

                {/* User Routes - Visible for all logged-in users */}
                {userRole === "employee" && (
                  <>
                    <Link
                      to="/search"
                      className="nav-link"
                      onClick={() => setMenuOpen(false)}
                    >
                      Jobs
                    </Link>
                    <Link
                      to="/jobalerts"
                      className="nav-link"
                      onClick={() => setMenuOpen(false)}
                    >
                      Job Alerts
                    </Link>
                    <Link to="/applicationhistory" className="nav-link">
                      Application History
                    </Link>
                    <Link to="/savedjobs" className="nav-link">
                      Saved Jobs
                    </Link>
                    <Link to="/PaymentGateway" className="nav-link">
                      Payment
                    </Link>
                    <Link to="/ResumeBuilder" className="nav-link">
                      ResumeBuilder
                    </Link>
                    <Link to="/mockTest" className="nav-link">
                      Mock Test
                    </Link>
                  </>
                )}

                <button
                  className="nav-link logout-button"
                  onClick={handleLogout}
                >
                  Logout
                </button>
              </>
            )}
          </div>
        </nav>

        <div className="user-info">
          <div className="dark-mode-toggle" onClick={toggleDarkMode}>
            <FaMoon className={`dark-mode-icon ${darkMode ? "active" : ""}`} />
          </div>

          <div
            className="user-profile"
            onClick={() => navigate("/EmpProfUpdate")}
            style={{ cursor: "pointer" }}
          >
            <img
              src={profilePic || "https://via.placeholder.com/40"}
              alt="User"
              style={{
                width: "40px",
                height: "40px",
                borderRadius: "50%",
                objectFit: "cover",
                border: "2px solid #ddd",
                transition: "transform 0.3s ease",
              }}
              onMouseOver={(e) =>
                (e.currentTarget.style.transform = "scale(1.1)")
              } // Zoom effect on hover
              onMouseOut={(e) => (e.currentTarget.style.transform = "scale(1)")} // Reset zoom on hover out
            />
            <span className="user-name">{userName || "Guest"}</span>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
