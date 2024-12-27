import React from "react";
import "../Css/Footer.css";

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="footer">
      <div className="footer-content">
        <div className="footer-section">
          <h4>About Us</h4>
          <p>
            We are committed to providing the best financial services to our
            customers. Contact us for more information.
          </p>
        </div>
        <div className="footer-section">
          <h4>Contact Us</h4>
          <ul>
            <li>Email: support@bankapp.com</li>
            <li>Phone: +1 (123) 456-7890</li>
            <li>Address: 123 Bank St, Finance City, FC 45678</li>
          </ul>
        </div>
        <div className="footer-section">
          <h4>Quick Links</h4>
          <ul>
            <li><a href="/privacy-policy">Privacy Policy</a></li>
            <li><a href="/terms-of-service">Terms of Service</a></li>
            <li><a href="/help">Help Center</a></li>
            <li><a href="https://github.com/MAThatcher/bank-app-v2-frontend">Frontend Repo</a></li>
            <li><a href="https://github.com/MAThatcher/bank-app-v2-backend">Backend Repo</a></li>
          </ul>
        </div>
      </div>
      <div className="footer-bottom">
        <p>&copy; {currentYear} BankApp. All rights reserved.</p>
      </div>
    </footer>
  );
};

export default Footer;
