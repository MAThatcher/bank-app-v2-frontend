import React, { useState } from "react";
import { Link } from "react-router-dom";
import "../Css/Header.css";

const Header = () => {
  const [menuOpen, setMenuOpen] = useState(false);

  const toggleMenu = () => {
    setMenuOpen((prevState) => !prevState);
  };

  const handleLogout = () => {
    localStorage.removeItem("accessToken");
    localStorage.removeItem("refreshToken");
    window.location.href = "/";
  };

  return (
    <header className="header">
      <div className="header-container">
        <Link to="/Dashboard" className="logo">
          Bank App V2
        </Link>
        <button className="hamburger" onClick={toggleMenu}>
          &#9776; {/* Hamburger Icon */}
        </button>
        <nav className={`menu ${menuOpen ? "open" : ""}`}>
          <ul>
            <li>
              <Link to="/Dashboard">Home</Link>
            </li>
            <li>
              <Link to="/settings">Settings</Link>
            </li>
            <li>
              <Link to="/create-account">Create New Account</Link>
            </li>
            <li>
              <button onClick={handleLogout} className="logout-button">
                Log Out
              </button>
            </li>
          </ul>
        </nav>
      </div>
    </header>
  );
};

export default Header;
