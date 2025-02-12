// src/components/Footer.js

import React from "react";
import "../styles/Footer.css";

export const Footer = () => {
  return (
    <footer className="footer">
      <div className="footer-content">
        <a href="https://compu-j.com" target="_blank" rel="noopener noreferrer">
          <img src="/comp_j_logo.png" alt="Company Logo" className="logo" />
        </a>
        <p>Address:
          <a href="https://maps.app.goo.gl/SaEPLxT9SU8Mw4JH8" target="_blank" rel="noopener noreferrer">
            195 Bancroft Road, London, E14ET
          </a>
        </p>
        <p>
          Email: <a href="mailto:enquires@compu-j.com">enquires@compu-j.com</a>
        </p>
        <p>
          Contact: <a href="tel:+442071931986">+44-207-193-1986</a>
        </p>

        <div className="social-media">
          <a href="https://www.facebook.com/COMPUJ/" target="_blank" rel="noopener noreferrer">Facebook</a>
          <a href="https://twitter.com/compu-j" target="_blank" rel="noopener noreferrer">Twitter</a>
          <a href="https://uk.linkedin.com/company/compu-j" target="_blank" rel="noopener noreferrer">LinkedIn</a>
        </div>
      </div>
    </footer>
  );
};
