// frontend/src/components/Navbar.js

import React from "react";
import "../styles/Navbar.css"; // Import CSS styles for the Navbar component

export const Navbar = () => { // Define the Navbar functional component
  return (
    <nav className="navbar"> {/* Create a <nav> element for the navigation bar */}
      <div className="navbar-logo"> {/* Create a container for the logo */}
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
          <a href="https://compu-j.com/#1" className="navbar-link" target="_blank" rel="noopener noreferrer">
            Our services
          </a>
        </li>

        <li className="navbar-item">
          <a href="http://localhost:3000/" className="navbar-link">
            Smart_App
          </a>
        </li>

        <li className="navbar-item">
          <a href="https://compu-j.com/#3" className="navbar-link" target="_blank" rel="noopener noreferrer">
            Why Us
          </a>
        </li>
        <li className="navbar-item">
          <a href="https://compu-j.com/#4" className="navbar-link" target="_blank" rel="noopener noreferrer">
            Careers
          </a>
        </li>
        {/* Add the Contact Us link */}
        <li className="navbar-item">
          <a href="#contact-us" className="navbar-link">
            Contact Us
          </a>
        </li>
      </ul>
    </nav>
  );
};