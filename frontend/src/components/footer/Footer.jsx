import React from 'react';
import "../../Style/Footer.css"; 
const Footer = () => {
  return (
    <footer className="footer">
      <div className="footer-content">
        <div className="footer-section">
          <h3>Eira </h3>
          <p> M3 Eira Mafesh heyra </p>
        </div>
          <div className="footer-section">
          <h4>Quick Links</h4>
          <ul>
            <li><a href="/about">About Us</a></li>
            <li><a href="/services">Services</a></li>
            <li><a href="/contact">Contact</a></li>
          </ul>
        </div>
        <div className="footer-section">
          <h4>Legal</h4>
          <ul>
            <li><a href="/privacy">Privacy Policy</a></li>
            <li><a href="/terms">Terms of Service</a></li>
          </ul>
        </div>
          <div className="footer-section">
          <h4>Follow Us</h4>
          <div className="social-links">
            <a href="https://twitter.com" aria-label="Twitter">Twitter</a>
            <a href="https://facebook.com" aria-label="Facebook">Facebook</a>
            <a href="https://linkedin.com" aria-label="LinkedIn">LinkedIn</a>
          </div>
        </div>
      </div>
      <div className="footer-bottom">
        <p>&copy; Eira . All rights reserved.</p>
      </div>
    </footer>
  );
};
export default Footer;