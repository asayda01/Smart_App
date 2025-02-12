// src/components/Navbar.js

import React from "react";
import "../styles/Navbar.css";

export const Navbar = () => {
  return (
    <nav className="navbar">
      <div className="navbar-logo">
        <a href="https://compu-j.com" target="_blank" rel="noopener noreferrer">
          <img src="/comp_j_logo.png" alt="Company Logo" className="logo" />
        </a>
      </div>
      <ul className="navbar-list">
        <li className="navbar-item">
          <a href="https://compu-j.com" className="navbar-link" target="_blank" rel="noopener noreferrer">
            Home
          </a>
        </li>
        <li className="navbar-item">
          <a href="http://localhost:3000/" className="navbar-link">
            Smart_App
          </a>
        </li>
      </ul>
    </nav>
  );
};
